import { CRMRecordSchema, type CRMRecord } from "../schemas/crm.schema";

export class ValidationService {
  validateRecord(
    record: any
  ): { valid: boolean; errors: string[]; data?: CRMRecord } {
    const result = CRMRecordSchema.safeParse(record);
    if (result.success) {
      return { valid: true, errors: [], data: result.data };
    }
    return {
      valid: false,
      errors: result.error.errors.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      ),
    };
  }

  validateRecords(
    records: any[]
  ): { valid: CRMRecord[]; invalid: number; errors: string[] } {
    const valid: CRMRecord[] = [];
    const allErrors: string[] = [];
    let invalid = 0;

    for (const record of records) {
      const result = this.validateRecord(record);
      if (result.valid && result.data) {
        valid.push(result.data);
      } else {
        invalid++;
        allErrors.push(...result.errors);
      }
    }

    return { valid, invalid, errors: allErrors };
  }
}
