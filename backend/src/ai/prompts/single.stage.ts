export function buildSingleStagePrompt(
  headers: string[],
  records: Record<string, string>[],
): string {
  return `Convert CSV records to CRM format. Return ONLY valid JSON array.

CSV headers: ${JSON.stringify(records.length > 0 ? Object.keys(records[0]) : headers)}

Records:
${JSON.stringify(records, null, 0)}

CRM fields (all strings, empty string if missing):
name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, created_at, possession_time, description

Rules:
- Skip records with no email AND no phone (set "_skip": true)
- crm_status: GOOD_LEAD_FOLLOW_UP | DID_NOT_CONNECT | BAD_LEAD | SALE_DONE (default empty)
- data_source: leads_on_demand | meridian_tower | eden_park | varah_swamy | sarjapur_plots (default empty)
- Phone: strip non-digits, split country code. 10 digits starting 6-9 → country_code "+91"
- Email: lowercase, trim
- Names: title case
- Dates: ISO 8601 YYYY-MM-DDTHH:mm:ss.sssZ
- All empty values must be "" not null

Output: [{"name":"","email":"","country_code":"","mobile_without_country_code":"","company":"","city":"","state":"","country":"","lead_owner":"","crm_status":"","crm_note":"","data_source":"","created_at":"","possession_time":"","description":"","_skip":false}]`;
}
