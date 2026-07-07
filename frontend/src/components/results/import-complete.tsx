"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { ImportResults } from "@/types";

interface ImportCompleteProps {
  results: ImportResults;
}

export function ImportComplete({ results }: ImportCompleteProps) {
  const successRate = results.totalRows > 0
    ? Math.round((results.imported / results.totalRows) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center mb-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            points="20 6 9 17 4 12"
          />
        </motion.svg>
      </motion.div>

      <h2 className="text-3xl font-medium text-ink-black tracking-tight mb-2">
        Import Complete
      </h2>
      <p className="text-stone text-lg">
        Your data has been successfully processed and imported
      </p>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <Card className="text-center">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-2xl font-semibold text-ink-black">{results.imported.toLocaleString()}</p>
          <p className="text-xs text-stone mt-1">Imported</p>
        </Card>

        <Card className="text-center">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </div>
          <p className="text-2xl font-semibold text-ink-black">{results.skipped.toLocaleString()}</p>
          <p className="text-xs text-stone mt-1">Skipped</p>
        </Card>

        <Card className="text-center">
          <div className="w-10 h-10 bg-sky-tint rounded-full flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0075de" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-2xl font-semibold text-ink-black">{results.totalRows.toLocaleString()}</p>
          <p className="text-xs text-stone mt-1">Total Rows</p>
        </Card>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone">Success Rate:</span>
          <span className="text-sm font-medium text-ink-black">{successRate}%</span>
        </div>
        {results.errors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone">Errors:</span>
            <span className="text-sm font-medium text-coral">{results.errors.length}</span>
          </div>
        )}
      </div>

      {results.errors.length > 0 && (
        <div className="mt-6 text-left">
          <h4 className="text-sm font-medium text-graphite mb-2">Errors:</h4>
          <div className="bg-red-50 border border-coral/20 rounded-cards p-4 max-h-32 overflow-y-auto">
            {results.errors.slice(0, 10).map((error, i) => (
              <p key={i} className="text-xs text-coral mb-1">{error}</p>
            ))}
            {results.errors.length > 10 && (
              <p className="text-xs text-stone">...and {results.errors.length - 10} more errors</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
