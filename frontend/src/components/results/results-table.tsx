"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icon } from "@/components/shared/icon";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";
import type { ImportResults } from "@/types";

interface ResultsTableProps {
  results: ImportResults;
}

export function ResultsTable({ results }: ResultsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRecords = useMemo(() => {
    if (statusFilter === "all") return results.records;
    return results.records.filter((r) => r.crm_status === statusFilter);
  }, [results.records, statusFilter]);

  const columns = useMemo(
    () => [
      {
        id: "name",
        accessorFn: (row: any) => row.name || "",
        header: "Name",
        cell: (info: any) => (
          <span className="font-medium text-ink-black">{String(info.getValue()) || "-"}</span>
        ),
      },
      {
        id: "email",
        accessorFn: (row: any) => row.email || "",
        header: "Email",
        cell: (info: any) => (
          <span className="text-notion-blue">{String(info.getValue()) || "-"}</span>
        ),
      },
      {
        id: "mobile_without_country_code",
        accessorFn: (row: any) => row.mobile_without_country_code || "",
        header: "Mobile",
        cell: (info: any) => (
          <span>{String(info.getValue()) || "-"}</span>
        ),
      },
      {
        id: "company",
        accessorFn: (row: any) => row.company || "",
        header: "Company",
        cell: (info: any) => (
          <span>{String(info.getValue()) || "-"}</span>
        ),
      },
      {
        id: "city",
        accessorFn: (row: any) => row.city || "",
        header: "City",
        cell: (info: any) => (
          <span>{String(info.getValue()) || "-"}</span>
        ),
      },
      {
        id: "crm_status",
        accessorFn: (row: any) => row.crm_status || "",
        header: "Status",
        cell: (info: any) => {
          const status = String(info.getValue());
          const label = STATUS_LABELS[status] || status;
          const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-700";
          return <Badge className={colorClass}>{label}</Badge>;
        },
      },
      {
        id: "data_source",
        accessorFn: (row: any) => row.data_source || "",
        header: "Source",
        cell: (info: any) => (
          <span className="text-xs text-stone">{String(info.getValue()) || "-"}</span>
        ),
      },
      {
        id: "created_at",
        accessorFn: (row: any) => row.created_at || "",
        header: "Created",
        cell: (info: any) => (
          <span className="text-xs text-stone">{String(info.getValue()) || "-"}</span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredRecords,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const exportToCSV = () => {
    const headers = ["name", "email", "mobile_without_country_code", "company", "city", "state", "country", "crm_status", "data_source", "created_at"];
    const csvContent = [
      headers.join(","),
      ...results.records.map((record) =>
        headers.map((h) => `"${(record as any)[h] || ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "imported_contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(results.records.map((r) => r.crm_status).filter(Boolean));
    return Array.from(statuses);
  }, [results.records]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-ink-black">Imported Records</h3>
          <p className="text-sm text-stone">
            {filteredRecords.length} of {results.records.length} records
          </p>
        </div>
        <div className="flex items-center gap-3">
          {uniqueStatuses.length > 0 && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-black/15 rounded-buttons px-3 py-1.5 text-graphite bg-white focus:outline-none focus:ring-2 focus:ring-notion-blue/20"
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status] || status}
                </option>
              ))}
            </select>
          )}
          <Button variant="outline" onClick={exportToCSV}>
            <Icon name="download" size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <ScrollArea className="h-[400px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-paper-warmth border-b border-black/8">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSorted = sorting.some((s) => s.id === header.id);
                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-medium text-stone text-xs cursor-pointer hover:bg-black/5 transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSorted && (
                            <span className="text-notion-blue">
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
                <tr key={row.id} className="border-b border-black/5 hover:bg-paper-warmth/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2.5 text-graphite">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-stone">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}
