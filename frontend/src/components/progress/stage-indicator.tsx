"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";

interface StageIndicatorProps {
  label: string;
  status: "pending" | "active" | "completed" | "failed";
}

export function StageIndicator({ label, status }: StageIndicatorProps) {
  const statusConfig = {
    pending: {
      icon: (
        <div className="w-5 h-5 rounded-full border-2 border-black/15" />
      ),
      textColor: "text-stone",
      bgColor: "",
    },
    active: {
      icon: (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-5 rounded-full bg-notion-blue flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      ),
      textColor: "text-ink-black",
      bgColor: "bg-sky-tint/50",
    },
    completed: {
      icon: (
        <div className="w-5 h-5 rounded-full bg-notion-blue flex items-center justify-center">
          <Icon name="check" size={12} className="text-white" />
        </div>
      ),
      textColor: "text-notion-blue",
      bgColor: "",
    },
    failed: {
      icon: (
        <div className="w-5 h-5 rounded-full bg-coral flex items-center justify-center">
          <Icon name="alert" size={12} className="text-white" />
        </div>
      ),
      textColor: "text-coral",
      bgColor: "",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-buttons transition-colors", config.bgColor)}>
      {config.icon}
      <span className={cn("text-sm font-medium", config.textColor)}>
        {label}
      </span>
      {status === "active" && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="ml-auto"
        >
          <span className="text-xs text-notion-blue">Processing...</span>
        </motion.div>
      )}
      {status === "completed" && (
        <span className="ml-auto text-xs text-notion-blue">Done</span>
      )}
    </div>
  );
}
