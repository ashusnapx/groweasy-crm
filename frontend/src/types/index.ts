export type AppStep = "upload" | "preview" | "processing" | "results";

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  fileName: string;
  fileSize: number;
  file?: File;
}

export interface CRMRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export interface ImportResults {
  status: string;
  totalRows: number;
  imported: number;
  skipped: number;
  errors: string[];
  records: CRMRecord[];
}

export interface ProcessingStage {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "failed";
  progress: number;
}
