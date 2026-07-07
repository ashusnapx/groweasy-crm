const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface AIConfig {
  apiKey: string;
  model: string;
}

export interface UploadResponse {
  uploadId: string;
  totalRows: number;
  headers: string[];
  message: string;
}

export interface ProgressData {
  uploadId: string;
  status: string;
  totalRows: number;
  processedRows: number;
  currentBatch: number;
  imported?: number;
  results?: any[];
  skippedCount?: number;
  errors?: string[];
  startedAt: string;
  completedAt?: string;
}

export interface ResultsData {
  status: string;
  totalRows: number;
  imported: number;
  skipped: number;
  errors: string[];
  records: any[];
}

function getConfigHeaders(config?: AIConfig): Record<string, string> {
  const headers: Record<string, string> = {};
  if (config?.apiKey) headers["x-api-key"] = config.apiKey;
  if (config?.model) headers["x-ai-model"] = config.model;
  return headers;
}

export const api = {
  async uploadCSV(file: File, config?: AIConfig): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
      headers: getConfigHeaders(config),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || err.message || "Upload failed");
    }
    return res.json();
  },

  async getProgress(uploadId: string): Promise<ProgressData> {
    const res = await fetch(`${API_URL}/api/upload/${uploadId}/progress`);
    if (!res.ok) throw new Error("Failed to get progress");
    return res.json();
  },

  async getResults(uploadId: string): Promise<ResultsData> {
    const res = await fetch(`${API_URL}/api/upload/${uploadId}/results`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to get results");
    }
    return res.json();
  },

  async downloadSample(fileName: string): Promise<string> {
    const res = await fetch(`${API_URL}/api/samples/${fileName}`);
    if (!res.ok) throw new Error("Failed to download sample");
    return res.text();
  },
};
