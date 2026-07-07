export interface UploadProgress {
  uploadId: string;
  status: "parsing" | "analyzing_schema" | "mapping_fields" | "extracting_records" | "validating" | "normalizing" | "processing" | "completed" | "failed";
  totalRows: number;
  processedRows: number;
  batches: BatchResult[];
  currentBatch: number;
  results: any[];
  skippedCount?: number;
  errors: string[];
  startedAt: Date;
  completedAt?: Date;
}

export interface BatchResult {
  batchIndex: number;
  records: any[];
  skipped: number;
  errors: string[];
}

export interface ExtractedRecord {
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

export interface SchemaAnalysis {
  columns: Array<{
    originalName: string;
    semanticMeaning: string;
    suggestedField: string | null;
    confidence: number;
    dataType: string;
    sampleValues: string[];
    notes: string;
  }>;
  totalColumns: number;
  mappedColumns: number;
  unmappedColumns: string[];
  overallConfidence: number;
  warnings: string[];
}
