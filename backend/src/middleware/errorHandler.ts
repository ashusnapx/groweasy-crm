import { Request, Response, NextFunction } from "express";
import multer from "multer";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error:", err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "File too large",
        message: "Maximum file size is 50MB",
      });
    }
    return res.status(400).json({
      error: "Upload error",
      message: err.message,
    });
  }

  if (err.message === "Only CSV files are allowed") {
    return res.status(400).json({
      error: "Invalid file type",
      message: "Only CSV files are accepted",
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
}
