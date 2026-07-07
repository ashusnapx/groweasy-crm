import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { UploadController } from "../controllers/upload.controller";
import { config } from "../config";

const router = Router();
const controller = new UploadController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "text/plain" ||
      file.originalname.endsWith(".csv") ||
      file.originalname.endsWith(".tsv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

// Sample CSV files endpoint
const SAMPLES_DIR = path.resolve(__dirname, "../../../test-data");

router.get("/samples/:filename", (req: Request, res: Response) => {
  const filename = req.params.filename as string;
  // Security: only allow .csv files, no path traversal
  if (!filename.endsWith(".csv") || filename.includes("..") || filename.includes("/")) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  const filePath = path.join(SAMPLES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Sample file not found" });
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  fs.createReadStream(filePath).pipe(res);
});

// Upload and process
router.post("/upload", upload.single("file"), controller.upload);
router.get("/upload/:uploadId/progress", controller.progress);
router.get("/upload/:uploadId/results", controller.results);

export default router;
