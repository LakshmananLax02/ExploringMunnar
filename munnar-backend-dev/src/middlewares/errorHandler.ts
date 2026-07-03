import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../dto/response.dto";

/**
 * Global error handler middleware
 * Ensures all errors follow the ApiResponse format
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): Response<ApiResponse> => {
  console.error("Error caught by middleware:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      success: false,
      message: err.message,
      error: { type: "ApiError", details: err.message },
    });
  }

  // Fallback for unexpected errors
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
    message: "Internal server error",
    error: {
      type: err instanceof Error ? err.name : "UnknownError",
      details: err instanceof Error ? err.message : String(err),
    },
  });
};
