import multer from "multer";
import { Request } from "express";
import { ApiError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";

// --- Configure multer storage (no local saving, just buffer in memory)
const storage = multer.memoryStorage();

// --- File filter to accept only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        "Only image uploads are allowed",
        "InvalidFileType"
      )
    );
  }
};

// --- Multer config
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max size
});
