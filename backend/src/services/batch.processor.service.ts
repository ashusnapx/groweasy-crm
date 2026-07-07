import { AIPipelineService, type PipelineConfig } from "./ai.pipeline.service";
import { ProgressTrackerService } from "./progress.tracker.service";
import { config } from "../config";

export class BatchProcessorService {
  private aiPipeline: AIPipelineService;
  private progressTracker: ProgressTrackerService;

  constructor() {
    this.aiPipeline = new AIPipelineService();
    this.progressTracker = ProgressTrackerService.getInstance();
  }

  async processUpload(
    uploadId: string,
    records: Record<string, string>[],
    headers: string[],
    pipelineConfig?: PipelineConfig
  ): Promise<void> {
    try {
      this.progressTracker.update(uploadId, { status: "processing" });

      const result = await this.aiPipeline.processFullPipeline(
        records,
        headers,
        (stage, progress) => {
          this.progressTracker.update(uploadId, {
            status: stage as any,
            processedRows: Math.floor((progress / 100) * records.length),
          });
        },
        pipelineConfig
      );

      this.progressTracker.update(uploadId, {
        status: "completed",
        processedRows: records.length,
        results: result.records,
        skippedCount: result.skippedCount,
        errors: result.errors,
        completedAt: new Date(),
      });
    } catch (error) {
      this.progressTracker.update(uploadId, {
        status: "failed",
        errors: [error instanceof Error ? error.message : "Unknown error"],
        completedAt: new Date(),
      });
    }
  }
}
