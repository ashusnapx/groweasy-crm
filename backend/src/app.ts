import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";
import { rateLimiter } from "./middleware/rateLimiter";
import uploadRoutes from "./routes/upload.routes";

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", uploadRoutes);

app.use(errorHandler);

export default app;
