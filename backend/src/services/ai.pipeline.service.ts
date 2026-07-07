import { generateWithFallback, type GeminiClientConfig } from "../ai/gemini.client";
import { buildSingleStagePrompt } from "../ai/prompts/single.stage";
import { CRMRecordSchema, type CRMRecord } from "../schemas/crm.schema";
import { retryWithBackoff } from "../utils/retry";

export interface PipelineConfig {
  apiKey?: string;
  model?: string;
}

const BATCH_SIZE = 15;

export class AIPipelineService {
  async processFullPipeline(
    records: Record<string, string>[],
    headers: string[],
    onProgress?: (stage: string, progress: number) => void,
    pipelineConfig?: PipelineConfig
  ): Promise<{ records: CRMRecord[]; skippedCount: number; errors: string[] }> {
    const allErrors: string[] = [];
    let skippedCount = 0;
    const allRecords: CRMRecord[] = [];

    const geminiConfig: GeminiClientConfig = {
      apiKey: pipelineConfig?.apiKey,
      model: pipelineConfig?.model,
    };

    const totalBatches = Math.ceil(records.length / BATCH_SIZE);

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;

      onProgress?.("processing", Math.floor((i / records.length) * 90));

      try {
        const result = await retryWithBackoff(
          () => this.processBatch(batch, headers, geminiConfig),
          5,
          5000
        );

        for (const item of result) {
          if (item._skip) {
            skippedCount++;
            continue;
          }
          const cleaned = { ...item };
          delete cleaned._skip;
          delete cleaned._skipReason;

          const parsed = CRMRecordSchema.safeParse(cleaned);
          if (parsed.success) {
            allRecords.push(parsed.data);
          } else {
            allErrors.push(`Row validation: ${parsed.error.message}`);
          }
        }
      } catch (error) {
        allErrors.push(
          `Batch ${batchNum}/${totalBatches} failed: ${error instanceof Error ? error.message : error}`
        );
      }

      // Throttle between batches
      if (batchNum < totalBatches) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    onProgress?.("completed", 100);

    return { records: allRecords, skippedCount, errors: allErrors };
  }

  private async processBatch(
    batch: Record<string, string>[],
    headers: string[],
    geminiConfig: GeminiClientConfig
  ): Promise<any[]> {
    const prompt = buildSingleStagePrompt(headers, batch);
    const { text, model } = await generateWithFallback(prompt, geminiConfig);
    console.log(`[batch] processed via ${model}`);
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  }
}
