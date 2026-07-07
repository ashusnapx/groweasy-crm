export const CRM_FIELDS = [
  { key: "created_at", label: "Created At", type: "date" },
  { key: "name", label: "Name", type: "string" },
  { key: "email", label: "Email", type: "email" },
  { key: "country_code", label: "Country Code", type: "string" },
  { key: "mobile_without_country_code", label: "Mobile", type: "phone" },
  { key: "company", label: "Company", type: "string" },
  { key: "city", label: "City", type: "string" },
  { key: "state", label: "State", type: "string" },
  { key: "country", label: "Country", type: "string" },
  { key: "lead_owner", label: "Lead Owner", type: "string" },
  { key: "crm_status", label: "Status", type: "enum" },
  { key: "crm_note", label: "Notes", type: "string" },
  { key: "data_source", label: "Data Source", type: "enum" },
  { key: "possession_time", label: "Possession Time", type: "date" },
  { key: "description", label: "Description", type: "string" },
] as const;

export const VALID_STATUSES = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
] as const;

export const VALID_DATA_SOURCES = [
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: "Good Lead - Follow Up",
  DID_NOT_CONNECT: "Did Not Connect",
  BAD_LEAD: "Bad Lead",
  SALE_DONE: "Sale Done",
};

export const STATUS_COLORS: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: "bg-sky-tint text-notion-blue",
  DID_NOT_CONNECT: "bg-gray-100 text-stone",
  BAD_LEAD: "bg-red-50 text-coral",
  SALE_DONE: "bg-green-50 text-green-700",
};

export const STAGES = [
  { id: "upload", label: "Upload CSV" },
  { id: "preview", label: "Preview Data" },
  { id: "processing", label: "AI Processing" },
  { id: "results", label: "Results" },
] as const;

export const STAGE_LABELS: Record<string, string> = {
  parsing: "Parsing CSV",
  analyzing_schema: "Analyzing Schema",
  mapping_fields: "Mapping Fields",
  extracting_records: "Extracting Records",
  validating: "Validating Data",
  normalizing: "Normalizing",
  completed: "Completed",
  failed: "Failed",
};
