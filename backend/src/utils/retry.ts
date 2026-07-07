export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 3000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLast = i === maxRetries - 1;
      if (isLast) throw error;

      const msg = error?.message || String(error);
      const isRateLimit = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("rate");
      const isOverload = msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand");

      if (!isRateLimit && !isOverload) throw error;

      // Longer delays for overload (503) vs rate limit (429)
      const multiplier = isOverload ? 4 : 2;
      const delay = baseDelay * Math.pow(multiplier, i) + Math.random() * baseDelay;
      const cappedDelay = Math.min(delay, 60_000);

      console.warn(
        `[retry] ${isOverload ? "503 overload" : "429 rate limit"} — ` +
        `attempt ${i + 1}/${maxRetries}, waiting ${Math.round(cappedDelay / 1000)}s`
      );
      await new Promise((r) => setTimeout(r, cappedDelay));
    }
  }
  throw new Error("Max retries exceeded");
}
