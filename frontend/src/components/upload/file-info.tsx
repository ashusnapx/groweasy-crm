"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FileInfoProps {
  fileName: string;
  fileSize: number;
  totalRows: number;
  headers: string[];
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileInfo({ fileName, fileSize, totalRows, headers, className }: FileInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white border border-black/8 rounded-cards p-4", className)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-sky-tint rounded-buttons flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0075de" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-graphite truncate">{fileName}</p>
          <p className="text-xs text-stone">
            {formatFileSize(fileSize)} · {totalRows.toLocaleString()} rows · {headers.length} columns
          </p>
        </div>
        <Badge variant="info">CSV</Badge>
      </div>
    </motion.div>
  );
}
