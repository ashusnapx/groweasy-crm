import Papa from "papaparse";

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

export class CSVParserService {
  async parse(fileBuffer: Buffer): Promise<ParsedCSV> {
    const content = fileBuffer.toString("utf-8");
    const result = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header: string) => header.trim(),
    });

    const headers = result.meta.fields || [];
    const rows = result.data as Record<string, string>[];

    return {
      headers,
      rows: rows.filter((row) => {
        const values = Object.values(row);
        return values.some((v) => v && v.trim() !== "");
      }),
      totalRows: rows.length,
    };
  }
}
