"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import type { ProgressData } from "@/lib/api";

export function useProgress(uploadId: string | null) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!uploadId) return;

    const poll = async () => {
      try {
        const data = await api.getProgress(uploadId);
        setProgress(data);
        if (data.status === "completed" || data.status === "failed") {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // ignore polling errors
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [uploadId]);

  return { progress };
}
