"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GhostSmall } from "@/components/landing/ghost";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function Dropzone({ onFileSelect, isProcessing }: DropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          setError("File size exceeds 50MB limit");
          return;
        }
        if (!file.name.endsWith(".csv") && !file.name.endsWith(".tsv")) {
          setError("Please upload a CSV file");
          return;
        }
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"], "text/tab-separated-values": [".tsv"] },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1
          className="phantom-heading-lg"
          style={{ color: "var(--color-aubergine)" }}
        >
          Import your{" "}
          <span style={{ color: "var(--color-periwinkle)" }}>CSV</span>{" "}
          data
        </h1>
        <p
          className="mt-4 phantom-subheading"
          style={{ color: "var(--color-fog)" }}
        >
          Drop any CSV file. Our AI will map columns intelligently.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed phantom-card p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-[var(--color-periwinkle)]"
            : "border-[var(--color-ash)] hover:border-[var(--color-periwinkle)]",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
        style={{
          background: isDragActive ? "var(--color-ghost-lavender)" : "var(--color-paper-white)",
        }}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={isDragActive ? { scale: 1.05, y: -5 } : { scale: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: isDragActive ? "var(--color-ghost-lavender)" : "var(--color-bone)",
            }}
          >
            <GhostSmall
              className={isDragActive ? "text-[var(--color-periwinkle)]" : "text-[var(--color-fog)]"}
            />
          </div>
          <div>
            <p
              className="phantom-body font-medium"
              style={{ color: "var(--color-aubergine)" }}
            >
              {isDragActive ? "Drop your CSV here" : "Drag & drop your CSV file"}
            </p>
            <p
              className="phantom-caption mt-1"
              style={{ color: "var(--color-fog)" }}
            >
              or click to browse. Max 50MB.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {[".csv", ".tsv", "Excel export", "Any format"].map((type) => (
              <span
                key={type}
                className="phantom-pill phantom-caption px-4 py-1.5"
                style={{
                  background: "var(--color-bone)",
                  color: "var(--color-fog)",
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 phantom-card text-sm"
            style={{
              background: "var(--color-blush-mist)",
              color: "var(--color-obsidian)",
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { icon: "✦", title: "AI-Powered", desc: "Smart column mapping" },
          { icon: "◎", title: "Secure", desc: "Your data stays private" },
          { icon: "⚡", title: "Fast", desc: "Process 50k+ rows" },
        ].map((feature) => (
          <motion.div
            key={feature.title}
            whileHover={{ y: -2 }}
            className="phantom-card p-5 text-center"
            style={{
              background: "var(--color-paper-white)",
              border: "1px solid var(--color-ash)",
            }}
          >
            <div
              className="text-2xl mb-2 w-10 h-10 phantom-pill flex items-center justify-center mx-auto"
              style={{ background: "var(--color-ghost-lavender)" }}
            >
              {feature.icon}
            </div>
            <h3
              className="phantom-body-sm font-medium"
              style={{ color: "var(--color-aubergine)" }}
            >
              {feature.title}
            </h3>
            <p
              className="phantom-caption mt-1"
              style={{ color: "var(--color-fog)" }}
            >
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
