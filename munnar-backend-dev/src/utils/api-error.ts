import { StatusCodes } from "http-status-codes";

/**
 * Custom error class to standardize API errors
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly type: string;
  public readonly timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    type: string = "ApplicationError"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.timestamp = new Date().toISOString();

    // Maintain proper stack trace (only in V8 engines like Node.js)
    Error.captureStackTrace?.(this, this.constructor);
  }

  /**
   * Format error for API responses
   */
  toJSON() {
    return {
      success: false,
      code: this.statusCode,
      message: this.message,
      error: {
        type: this.type,
        details: this.message,
      },
      timestamp: this.timestamp,
    };
  }
}
