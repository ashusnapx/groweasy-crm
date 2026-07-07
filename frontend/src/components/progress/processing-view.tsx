"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StageIndicator } from "./stage-indicator";
import { SummaryCards } from "./summary-cards";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { STAGE_LABELS } from "@/lib/constants";
import { api, type ProgressData } from "@/lib/api";
import type { ImportResults } from "@/types";

interface ProcessingViewProps {
  uploadId: string | null;
  progress: ProgressData | null;
  onComplete: (results: ImportResults) => void;
}

const PROCESSING_STAGES = [
  "parsing",
  "analyzing_schema",
  "mapping_fields",
  "extracting_records",
  "validating",
  "normalizing",
];

export function ProcessingView({ uploadId, progress, onComplete }: ProcessingViewProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFetchingResults, setIsFetchingResults] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress?.status === "completed" || progress?.status === "failed") {
      fetchResults();
    }
  }, [progress?.status]);

  const fetchResults = useCallback(async () => {
    if (!uploadId || isFetchingResults) return;
    setIsFetchingResults(true);
    try {
      const results = await api.getResults(uploadId);
      onComplete(results);
    } catch (err) {
      console.error("Failed to fetch results:", err);
    }
  }, [uploadId, isFetchingResults, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentStageIndex = progress?.status
    ? PROCESSING_STAGES.indexOf(progress.status)
    : 0;

  const overallProgress = progress
    ? Math.round((progress.processedRows / Math.max(progress.totalRows, 1)) * 100)
    : 0;

  const isFailed = progress?.status === "failed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: isFailed ? 0 : 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-flex mb-4"
        >
          {isFailed ? (
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <Icon name="alert" size={24} className="text-coral" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-sky-tint rounded-full flex items-center justify-center">
              <Icon name="spinner" size={24} className="text-notion-blue" />
            </div>
          )}
        </motion.div>
        <h2 className="text-2xl font-medium text-ink-black tracking-tight">
          {isFailed ? "Processing Failed" : "Processing your data"}
        </h2>
        <p className="text-stone text-sm mt-2">
          {isFailed
            ? "An error occurred during processing"
            : "Our AI is analyzing and importing your CSV data"}
        </p>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-graphite">Overall Progress</span>
          <span className="text-sm text-stone">{formatTime(elapsedTime)}</span>
        </div>
        <Progress value={overallProgress} className="mb-3" />
        <div className="flex items-center justify-between text-xs text-stone">
          <span>
            {progress?.processedRows || 0} / {progress?.totalRows || 0} rows
          </span>
          <span>{overallProgress}%</span>
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="text-sm font-medium text-graphite mb-4">Processing Stages</h3>
        <div className="space-y-3">
          {PROCESSING_STAGES.map((stage, index) => {
            let status: "pending" | "active" | "completed" | "failed" = "pending";
            if (index < currentStageIndex) status = "completed";
            else if (index === currentStageIndex) status = isFailed ? "failed" : "active";

            return (
              <StageIndicator
                key={stage}
                label={STAGE_LABELS[stage] || stage}
                status={status}
              />
            );
          })}
        </div>
      </Card>

      {progress && (progress.imported !== undefined || progress.skippedCount !== undefined) && (
        <SummaryCards
          imported={progress.imported || 0}
          skipped={progress.skippedCount || 0}
          processing={progress.processedRows - (progress.imported || 0) - (progress.skippedCount || 0)}
          total={progress.totalRows}
        />
      )}

      {isFailed && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Icon name="refresh" size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      )}
    </motion.div>
  );
}
