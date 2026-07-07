import type { UploadProgress } from "../types";

class ProgressTrackerService {
  private static instance: ProgressTrackerService;
  private store: Map<string, UploadProgress> = new Map();

  private constructor() {}

  static getInstance(): ProgressTrackerService {
    if (!ProgressTrackerService.instance) {
      ProgressTrackerService.instance = new ProgressTrackerService();
    }
    return ProgressTrackerService.instance;
  }

  create(uploadId: string, data: UploadProgress): void {
    this.store.set(uploadId, data);
  }

  update(uploadId: string, updates: Partial<UploadProgress>): void {
    const existing = this.store.get(uploadId);
    if (existing) {
      this.store.set(uploadId, { ...existing, ...updates });
    }
  }

  get(uploadId: string): UploadProgress | undefined {
    return this.store.get(uploadId);
  }

  delete(uploadId: string): void {
    this.store.delete(uploadId);
  }
}

export { ProgressTrackerService };
