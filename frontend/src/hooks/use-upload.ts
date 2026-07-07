"use client";
import { useState, useCallback } from "react";
import { api, type AIConfig } from "@/lib/api";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, config?: AIConfig): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    try {
      const response = await api.uploadCSV(file, config);
      return response.uploadId;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      console.error("[upload]", message, err);
      setError(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadFile, isUploading, error };
}
