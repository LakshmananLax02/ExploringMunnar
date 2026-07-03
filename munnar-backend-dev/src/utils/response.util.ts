import { Response } from "express";
import { ApiResponse } from "../dto/response.dto";

export const sendSuccess = <T>(
  res: Response,
  code: number,
  message: string,
  data: T
): Response<ApiResponse<T>> => {
  return res.status(code).json({
    success: true,
    code,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (
  res: Response,
  code: number,
  message: string,
  errorType: string,
  errorDetails?: string
): Response<ApiResponse> => {
  return res.status(code).json({
    success: false,
    code,
    message,
    error: {
      type: errorType,
      details: errorDetails || message,
    },
    timestamp: new Date().toISOString(),
  });
};
