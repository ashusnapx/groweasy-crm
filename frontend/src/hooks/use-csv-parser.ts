"use client";
import { useState, useCallback } from "react";
import Papa from "papaparse";
import type { ParsedCSV } from "@/types";

export function useCsvParser() {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = useCallback(async (file: File): Promise<ParsedCSV | null> => {
    setIsParsing(true);
    setError(null);

    try {
      const text = await file.text();
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        transformHeader: (h: string) => h.trim(),
      });

      if (result.errors.length > 0) {
        console.warn("CSV parse warnings:", result.errors);
      }

      const headers = result.meta.fields || [];
      const rows = result.data as Record<string, string>[];
      const validRows = rows.filter(row => {
        const values = Object.values(row);
        return values.some(v => v && v.trim() !== "");
      });

      return {
        headers,
        rows: validRows,
        totalRows: validRows.length,
        fileName: file.name,
        fileSize: file.size,
        file,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV");
      return null;
    } finally {
      setIsParsing(false);
    }
  }, []);

  return { parseCSV, isParsing, error };
}
