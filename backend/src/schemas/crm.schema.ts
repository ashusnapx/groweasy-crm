import { z } from "zod";

const ValidStatus = z.enum([
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
]);

const ValidDataSource = z.enum([
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
]);

export const CRMRecordSchema = z.object({
  created_at: z.string().optional().default(""),
  name: z.string().optional().default(""),
  email: z.string().email().or(z.literal("")).optional().default(""),
  country_code: z.string().optional().default(""),
  mobile_without_country_code: z.string().optional().default(""),
  company: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default(""),
  lead_owner: z.string().optional().default(""),
  crm_status: z.string().optional().default(""),
  crm_note: z.string().optional().default(""),
  data_source: z.string().optional().default(""),
  possession_time: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type CRMRecord = z.infer<typeof CRMRecordSchema>;
