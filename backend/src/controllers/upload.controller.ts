import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { CSVParserService } from "../services/csv.parser.service";
import { BatchProcessorService } from "../services/batch.processor.service";
import { ProgressTrackerService } from "../services/progress.tracker.service";
import type { PipelineConfig } from "../services/ai.pipeline.service";

export class UploadController {
  private csvParser: CSVParserService;
  private batchProcessor: BatchProcessorService;
  private progressTracker: ProgressTrackerService;

  constructor() {
    this.csvParser = new CSVParserService();
    this.batchProcessor = new BatchProcessorService();
    this.progressTracker = ProgressTrackerService.getInstance();
  }

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Extract AI config from headers
      const apiKey = req.headers["x-api-key"] as string | undefined;
      const model = req.headers["x-ai-model"] as string | undefined;

      if (!apiKey) {
        return res.status(400).json({ error: "API key is required. Set x-api-key header." });
      }

      const pipelineConfig: PipelineConfig = {
        apiKey,
        model: model || undefined,
      };

      const uploadId = uuidv4();
      const parsed = await this.csvParser.parse(req.file.buffer);

      if (parsed.rows.length === 0) {
        return res
          .status(400)
          .json({ error: "CSV file is empty or has no valid rows" });
      }

      this.progressTracker.create(uploadId, {
        uploadId,
        status: "parsing",
        totalRows: parsed.rows.length,
        processedRows: 0,
        batches: [],
        currentBatch: 0,
        results: [],
        errors: [],
        startedAt: new Date(),
      });

      this.batchProcessor.processUpload(
        uploadId,
        parsed.rows,
        parsed.headers,
        pipelineConfig
      );

      res.status(202).json({
        uploadId,
        totalRows: parsed.rows.length,
        headers: parsed.headers,
        message: "Upload accepted. Processing started.",
      });
    } catch (error) {
      next(error);
    }
  };

  progress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uploadId = req.params.uploadId as string;
      const progress = this.progressTracker.get(uploadId);

      if (!progress) {
        return res.status(404).json({ error: "Upload not found" });
      }

      res.json(progress);
    } catch (error) {
      next(error);
    }
  };

  results = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uploadId = req.params.uploadId as string;
      const progress = this.progressTracker.get(uploadId);

      if (!progress) {
        return res.status(404).json({ error: "Upload not found" });
      }

      if (
        progress.status !== "completed" &&
        progress.status !== "failed"
      ) {
        return res
          .status(202)
          .json({ error: "Processing not complete", status: progress.status });
      }

      res.json({
        status: progress.status,
        totalRows: progress.totalRows,
        imported: progress.results?.length || 0,
        skipped: progress.skippedCount || 0,
        errors: progress.errors || [],
        records: progress.results || [],
      });
    } catch (error) {
      next(error);
    }
  };
}
