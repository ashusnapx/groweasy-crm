import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";

const modelCache = new Map<string, GenerativeModel>();

export interface GeminiClientConfig {
  apiKey?: string;
  model?: string;
}

// Fallback chain: try these models in order when one returns 503
const FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-flash",
];

// Circuit breaker: track failures per model
const failureCounts = new Map<string, number>();
const circuitOpenUntil = new Map<string, number>();
const CIRCUIT_THRESHOLD = 3;
const CIRCUIT_RESET_MS = 60_000; // 1 minute

function isCircuitOpen(model: string): boolean {
  const until = circuitOpenUntil.get(model);
  if (!until) return false;
  if (Date.now() > until) {
    circuitOpenUntil.delete(model);
    failureCounts.delete(model);
    return false;
  }
  return true;
}

function recordFailure(model: string) {
  const count = (failureCounts.get(model) || 0) + 1;
  failureCounts.set(model, count);
  if (count >= CIRCUIT_THRESHOLD) {
    circuitOpenUntil.set(model, Date.now() + CIRCUIT_RESET_MS);
    console.warn(`[circuit] ${model} opened — ${CIRCUIT_RESET_MS / 1000}s cooldown`);
  }
}

function recordSuccess(model: string) {
  failureCounts.delete(model);
  circuitOpenUntil.delete(model);
}

function getModelName(clientConfig?: GeminiClientConfig): string {
  return clientConfig?.model || process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
}

function getOrderedModels(preferred: string): string[] {
  const idx = FALLBACK_CHAIN.indexOf(preferred);
  if (idx === -1) return [preferred, ...FALLBACK_CHAIN];
  return [...FALLBACK_CHAIN.slice(idx), ...FALLBACK_CHAIN.slice(0, idx)];
}

function getOrCreateModel(apiKey: string, modelName: string): GenerativeModel {
  const cacheKey = `${apiKey}:${modelName}`;
  if (modelCache.has(cacheKey)) return modelCache.get(cacheKey)!;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  modelCache.set(cacheKey, model);
  return model;
}

/**
 * Generate content with automatic model fallback on 503/overload errors.
 * Tries models in fallback chain order, skipping circuit-broken ones.
 */
export async function generateWithFallback(
  prompt: string,
  clientConfig?: GeminiClientConfig
): Promise<{ text: string; model: string }> {
  const apiKey = clientConfig?.apiKey || process.env.GEMINI_API_KEY || "";
  const preferred = getModelName(clientConfig);
  const models = getOrderedModels(preferred);

  let lastError: Error | null = null;

  for (const modelName of models) {
    if (isCircuitOpen(modelName)) {
      console.warn(`[fallback] skipping ${modelName} — circuit open`);
      continue;
    }

    try {
      const model = getOrCreateModel(apiKey, modelName);
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      let text = response.response.text();
      if (!text) throw new Error("Empty response from Gemini");

      text = text.trim();
      if (text.startsWith("```")) {
        text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      recordSuccess(modelName);
      if (modelName !== preferred) {
        console.warn(`[fallback] ${preferred} failed, succeeded on ${modelName}`);
      }
      return { text, model: modelName };
    } catch (error: any) {
      lastError = error;
      const msg = error?.message || String(error);
      const isOverload =
        msg.includes("503") ||
        msg.includes("UNAVAILABLE") ||
        msg.includes("high demand") ||
        msg.includes("429") ||
        msg.includes("RESOURCE_EXHAUSTED");

      if (!isOverload) throw error;

      recordFailure(modelName);
      console.warn(`[fallback] ${modelName} failed: ${msg.slice(0, 100)}`);

      // Wait before trying next model
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  throw lastError || new Error("All models exhausted");
}

export function getGeminiModel(clientConfig?: GeminiClientConfig): GenerativeModel {
  const apiKey = clientConfig?.apiKey || process.env.GEMINI_API_KEY || "";
  const modelName = getModelName(clientConfig);
  return getOrCreateModel(apiKey, modelName);
}
