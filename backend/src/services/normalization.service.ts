import type { CRMRecord } from "../schemas/crm.schema";

export class NormalizationService {
  normalizePhone(phone: string): { countryCode: string; mobile: string } {
    const cleaned = phone.replace(/[^\d+]/g, "");

    if (cleaned.startsWith("+91") && cleaned.length >= 13) {
      return { countryCode: "+91", mobile: cleaned.slice(3) };
    }
    if (cleaned.startsWith("91") && cleaned.length >= 12) {
      return { countryCode: "+91", mobile: cleaned.slice(2) };
    }
    if (cleaned.startsWith("+1") && cleaned.length >= 12) {
      return { countryCode: "+1", mobile: cleaned.slice(2) };
    }
    if (/^[6-9]\d{9}$/.test(cleaned)) {
      return { countryCode: "+91", mobile: cleaned };
    }
    if (cleaned.length >= 6) {
      return { countryCode: "", mobile: cleaned };
    }
    return { countryCode: "", mobile: cleaned };
  }

  normalizeEmail(email: string): string {
    return email.toLowerCase().trim().replace(/\s+/g, "");
  }

  normalizeDate(dateStr: string): string {
    if (!dateStr) return "";

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      return date.toISOString();
    } catch {
      return "";
    }
  }

  normalizeName(name: string): string {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  normalizeRecord(record: CRMRecord): CRMRecord {
    return {
      ...record,
      name: this.normalizeName(record.name),
      email: record.email ? this.normalizeEmail(record.email) : "",
      created_at: record.created_at ? this.normalizeDate(record.created_at) : "",
      possession_time: record.possession_time
        ? this.normalizeDate(record.possession_time)
        : "",
      crm_note: (record.crm_note || "").trim(),
      description: (record.description || "").trim(),
    };
  }
}
