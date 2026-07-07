"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StepIndicator } from "@/components/layout/step-indicator";
import { Dropzone } from "@/components/upload/dropzone";
import { SampleCsvBrowser } from "@/components/upload/sample-csv-browser";
import { CsvPreview } from "@/components/preview/csv-preview";
import { ProcessingView } from "@/components/progress/processing-view";
import { ResultsTable } from "@/components/results/results-table";
import { ImportComplete } from "@/components/results/import-complete";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { SettingsDialog, getStoredConfig, type AIConfig } from "@/components/settings/settings-dialog";
import { useCsvParser } from "@/hooks/use-csv-parser";
import { useUpload } from "@/hooks/use-upload";
import { useProgress } from "@/hooks/use-progress";
import type { AppStep, ParsedCSV, ImportResults } from "@/types";

export default function AppPage() {
  const [step, setStep] = useState<AppStep>("upload");
  const [parsedCSV, setParsedCSV] = useState<ParsedCSV | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [results, setResults] = useState<ImportResults | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig>({ apiKey: "", model: "gemini-2.5-flash-lite" });
  const [mounted, setMounted] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { parseCSV, isParsing } = useCsvParser();
  const { uploadFile, isUploading } = useUpload();
  const { progress } = useProgress(uploadId);

  useEffect(() => {
    setMounted(true);
    const config = getStoredConfig();
    setAiConfig(config);
    if (!config.apiKey) {
      const hasVisited = localStorage.getItem("groweasy-has-visited");
      if (!hasVisited) {
        setSettingsOpen(true);
        localStorage.setItem("groweasy-has-visited", "true");
      }
    }
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    const csv = await parseCSV(file);
    if (csv) {
      setParsedCSV({ ...csv, file });
      setStep("preview");
    }
  }, [parseCSV]);

  const handleConfirmImport = useCallback(async () => {
    if (!parsedCSV?.file) return;
    setUploadError(null);
    if (!aiConfig.apiKey) {
      setUploadError("Please set your Gemini API key first. Click the settings button in the top right.");
      setSettingsOpen(true);
      return;
    }
    const id = await uploadFile(parsedCSV.file, aiConfig);
    if (id) {
      setUploadId(id);
      setStep("processing");
    } else {
      setUploadError("Upload failed. Check your API key and try again. Open browser console for details.");
    }
  }, [parsedCSV, uploadFile, aiConfig]);

  const handleImportComplete = useCallback((importResults: ImportResults) => {
    setResults(importResults);
    setStep("results");
  }, []);

  const handleStartOver = useCallback(() => {
    setStep("upload");
    setParsedCSV(null);
    setUploadId(null);
    setResults(null);
  }, []);

  const handleSettingsSave = useCallback((config: AIConfig) => {
    setAiConfig(config);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-paper-white)" }}
    >
      <Header
        onSettingsClick={() => setSettingsOpen(true)}
        hasApiKey={!!aiConfig.apiKey}
      />

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSettingsSave}
      />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <StepIndicator currentStep={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {step === "upload" && (
                <>
                  <Dropzone onFileSelect={handleFileSelect} isProcessing={isParsing} />

                  {mounted && !aiConfig.apiKey && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-2xl mx-auto mt-6"
                    >
                      <div
                        className="phantom-card p-5 flex items-start gap-3"
                        style={{
                          background: "var(--color-buttercream)",
                          border: "1px solid transparent",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: "rgba(0,0,0,0.08)" }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-obsidian)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="phantom-body-sm font-medium" style={{ color: "var(--color-obsidian)" }}>
                            API Key Required
                          </h3>
                          <p className="phantom-caption mt-0.5" style={{ color: "var(--color-obsidian)" }}>
                            Set your Gemini API key to start importing. Click{" "}
                            <button
                              onClick={() => setSettingsOpen(true)}
                              className="underline font-medium hover:opacity-70"
                            >
                              Set API Key
                            </button>{" "}
                            in the top right.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <SampleCsvBrowser onSelectFile={handleFileSelect} />
                </>
              )}
              {step === "preview" && parsedCSV && (
                <>
                  {uploadError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-6xl mx-auto mb-4"
                    >
                      <div
                        className="phantom-card p-4 flex items-start gap-3"
                        style={{
                          background: "var(--color-blush-mist)",
                          border: "1px solid transparent",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: "rgba(0,0,0,0.08)" }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-obsidian)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="phantom-body-sm" style={{ color: "var(--color-obsidian)" }}>
                            {uploadError}
                          </p>
                        </div>
                        <button
                          onClick={() => setUploadError(null)}
                          className="hover:opacity-50 transition-opacity"
                          style={{ color: "var(--color-obsidian)" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  )}
                  <CsvPreview
                    csv={parsedCSV}
                    onConfirm={handleConfirmImport}
                    onBack={() => setStep("upload")}
                    isUploading={isUploading}
                  />
                </>
              )}
              {step === "processing" && (
                <ProcessingView
                  uploadId={uploadId}
                  progress={progress}
                  onComplete={handleImportComplete}
                />
              )}
              {step === "results" && results && (
                <>
                  <ImportComplete results={results} />
                  <ResultsTable results={results} />
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={handleStartOver}
                    >
                      <Icon name="refresh" size={16} className="mr-2" />
                      Import Another File
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
