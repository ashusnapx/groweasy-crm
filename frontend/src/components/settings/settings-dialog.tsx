"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AIConfig {
  apiKey: string;
  model: string;
}

const AI_MODELS = [
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", description: "Fastest & cheapest", badge: "Recommended" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", description: "Fast with thinking", badge: "Balanced" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", description: "Most capable", badge: "Premium" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Previous gen fast", badge: null },
  { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite", description: "Ultra budget", badge: "Budget" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Legacy, still capable", badge: "Legacy" },
];

const STORAGE_KEY = "groweasy-ai-config";

function loadConfig(): AIConfig {
  if (typeof window === "undefined") return { apiKey: "", model: "gemini-2.5-flash-lite" };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { apiKey: parsed.apiKey || "", model: parsed.model || "gemini-2.5-flash-lite" };
    }
  } catch {}
  return { apiKey: "", model: "gemini-2.5-flash-lite" };
}

function saveConfig(config: AIConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: AIConfig) => void;
}

export function SettingsDialog({ open, onClose, onSave }: SettingsDialogProps) {
  const [config, setConfig] = useState<AIConfig>(loadConfig);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (open) setConfig(loadConfig());
  }, [open]);

  const handleSave = () => {
    saveConfig(config);
    onSave(config);
    onClose();
  };

  const handleTestKey = async () => {
    if (!config.apiKey) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${config.apiKey}`
      );
      setTestResult(res.ok ? "success" : "error");
    } catch {
      setTestResult("error");
    } finally {
      setTesting(false);
    }
  };

  const maskedKey = config.apiKey
    ? config.apiKey.slice(0, 8) + "..." + config.apiKey.slice(-4)
    : "";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white rounded-cards border border-black/8 p-0 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-black/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-ink-black">AI Configuration</h2>
                    <p className="text-sm text-stone mt-0.5">Set your Gemini API key and choose a model</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-buttons hover:bg-black/5 transition-colors text-stone"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-6">
                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-graphite mb-2">
                    Google Gemini API Key
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKey ? "text" : "password"}
                        value={config.apiKey}
                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                        placeholder="AIza..."
                        className="w-full px-3 py-2 text-sm bg-paper-warmth border border-black/10 rounded-buttons text-graphite placeholder:text-stone/50 focus:outline-none focus:ring-2 focus:ring-notion-blue/30 focus:border-notion-blue/50 transition-all pr-20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-stone hover:text-graphite px-2 py-1"
                      >
                        {showKey ? "Hide" : "Show"}
                      </button>
                    </div>
                    <button
                      onClick={handleTestKey}
                      disabled={!config.apiKey || testing}
                      className="px-3 py-2 text-xs font-medium bg-paper-warmth border border-black/10 rounded-buttons text-graphite hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                      {testing ? "Testing..." : "Test Key"}
                    </button>
                  </div>
                  {config.apiKey && (
                    <p className="text-xs text-stone mt-1.5">
                      Active: {maskedKey}
                      {testResult === "success" && (
                        <span className="text-green-600 ml-2">✓ Valid</span>
                      )}
                      {testResult === "error" && (
                        <span className="text-coral ml-2">✗ Invalid key</span>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-stone mt-2">
                    Get your free key at{" "}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-notion-blue hover:underline"
                    >
                      aistudio.google.com/apikey
                    </a>
                    . Your key stays in your browser and is never stored on our servers.
                  </p>
                </div>

                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-graphite mb-2">
                    AI Model
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AI_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setConfig({ ...config, model: model.id })}
                        className={cn(
                          "relative px-3 py-2.5 text-left rounded-buttons border transition-all duration-150",
                          config.model === model.id
                            ? "border-notion-blue bg-sky-tint/50 ring-1 ring-notion-blue/20"
                            : "border-black/8 bg-white hover:bg-paper-warmth"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-graphite">{model.name}</span>
                          {model.badge && (
                            <span
                              className={cn(
                                "text-[10px] font-medium px-1.5 py-0.5 rounded-pills",
                                model.badge === "Recommended"
                                  ? "bg-notion-blue/10 text-notion-blue"
                                  : model.badge === "Budget"
                                  ? "bg-green-50 text-green-700"
                                  : model.badge === "Premium"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-black/5 text-stone"
                              )}
                            >
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone mt-0.5">{model.description}</p>
                        {config.model === model.id && (
                          <motion.div
                            layoutId="model-check"
                            className="absolute top-2 right-2 w-4 h-4 bg-notion-blue rounded-full flex items-center justify-center"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free Tier Notice */}
                <div className="bg-green-50 border border-green-200/50 rounded-cards p-3 flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p className="text-xs text-green-800">
                    Gemini offers a generous free tier. Flash Lite is free for up to 1,500 requests per day — enough for most imports.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-black/5 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-graphite hover:bg-black/5 rounded-buttons transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!config.apiKey}
                  className="px-5 py-2 text-sm font-medium bg-notion-blue text-white rounded-buttons hover:bg-notion-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function getStoredConfig(): AIConfig {
  return loadConfig();
}
