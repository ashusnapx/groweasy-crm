"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileInfo } from "@/components/upload/file-info";
import { Icon } from "@/components/shared/icon";
import type { ParsedCSV } from "@/types";

interface CsvPreviewProps {
  csv: ParsedCSV;
  onConfirm: () => void;
  onBack: () => void;
  isUploading: boolean;
}

export function CsvPreview({ csv, onConfirm, onBack, isUploading }: CsvPreviewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () =>
      csv.headers.map((header) => ({
        id: header,
        accessorFn: (row: Record<string, string>) => row[header] || "",
        header: () => (
          <span className="font-medium">{header}</span>
        ),
        cell: (info: any) => (
          <span className="max-w-[200px] truncate block" title={String(info.getValue())}>
            {String(info.getValue()) || <span className="text-stone italic">empty</span>}
          </span>
        ),
      })),
    [csv.headers]
  );

  const previewRows = useMemo(() => csv.rows.slice(0, 100), [csv.rows]);

  const table = useReactTable({
    data: previewRows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="phantom-heading" style={{ color: "var(--color-aubergine)" }}>
            Preview your data
          </h2>
          <p className="phantom-body-sm mt-1" style={{ color: "var(--color-fog)" }}>
            Showing first {previewRows.length} of {csv.totalRows.toLocaleString()} rows
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} disabled={isUploading}>
            ← Back
          </Button>
          <Button onClick={onConfirm} disabled={isUploading} size="lg">
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading...
              </>
            ) : (
              "Confirm Import →"
            )}
          </Button>
        </div>
      </div>

      <FileInfo
        fileName={csv.fileName}
        fileSize={csv.fileSize}
        totalRows={csv.totalRows}
        headers={csv.headers}
        className="mb-6"
      />

      <div
        className="phantom-card overflow-hidden"
        style={{ border: "1px solid var(--color-ash)" }}
      >
        <ScrollArea className="h-[500px]">
          <table className="w-full text-sm">
            <thead
              className="sticky top-0 z-10"
              style={{
                background: "var(--color-bone)",
                borderBottom: "1px solid var(--color-ash)",
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSorted = sorting.some((s) => s.id === header.id);
                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-medium phantom-caption cursor-pointer transition-colors"
                        style={{
                          color: "var(--color-fog)",
                          borderBottom: "1px solid var(--color-ash)",
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSorted && (
                            <span style={{ color: "var(--color-periwinkle)" }}>
                              {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors"
                  style={{
                    borderBottom: "1px solid var(--color-ash)",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2.5"
                      style={{ color: "var(--color-obsidian)" }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      <div className="mt-4 flex items-center justify-between phantom-caption" style={{ color: "var(--color-fog)" }}>
        <span>
          {csv.totalRows.toLocaleString()} total rows · {csv.headers.length} columns
        </span>
        <span>
          Scroll to see more data
        </span>
      </div>
    </motion.div>
  );
}
