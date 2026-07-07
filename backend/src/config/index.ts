import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || "4000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN || "http://localhost:3000"
      : true,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash-lite",
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "52428800", 10),
  },
  processing: {
    batchSize: parseInt(process.env.BATCH_SIZE || "30", 10),
    maxConcurrentBatches: parseInt(process.env.MAX_CONCURRENT_BATCHES || "1", 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};
