"use client";

import { motion } from "framer-motion";
import { STAGES } from "@/lib/constants";
import type { AppStep } from "@/types";

const stepIndex: Record<AppStep, number> = {
  upload: 0,
  preview: 1,
  processing: 2,
  results: 3,
};

export function StepIndicator({ currentStep }: { currentStep: AppStep }) {
  const current = stepIndex[currentStep];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-center gap-2">
        {STAGES.map((stage, i) => {
          const isActive = i === current;
          const isCompleted = i < current;

          return (
            <div key={stage.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    backgroundColor: isCompleted
                      ? "var(--color-periwinkle)"
                      : isActive
                      ? "var(--color-aubergine)"
                      : "transparent",
                    scale: isActive ? 1.1 : 1,
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    border: `2px solid ${
                      isCompleted
                        ? "var(--color-periwinkle)"
                        : isActive
                        ? "var(--color-aubergine)"
                        : "var(--color-ash)"
                    }`,
                  }}
                >
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span
                      className="phantom-caption font-medium"
                      style={{
                        color: isActive ? "var(--color-paper-white)" : "var(--color-fog)",
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                </motion.div>
                <span
                  className="phantom-caption font-medium hidden sm:block"
                  style={{
                    color: isActive
                      ? "var(--color-aubergine)"
                      : isCompleted
                      ? "var(--color-periwinkle)"
                      : "var(--color-fog)",
                  }}
                >
                  {stage.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className="w-8 sm:w-12 h-px mx-2"
                  style={{
                    backgroundColor: isCompleted
                      ? "var(--color-periwinkle)"
                      : "var(--color-ash)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
