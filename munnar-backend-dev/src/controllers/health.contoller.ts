import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";
import { prisma } from "../prisma-client"; // centralized Prisma client
import { sendError, sendSuccess } from "../utils/response.util";
import { ApiResponse } from "../dto/response.dto";
import cloudinary from "../config/cloudinary";

export const healthCheckController = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    let cloudinaryStatus = "unknown";
    try {
      console.log("Pinging Cloudinary...",cloudinaryStatus);
      const cloudRes = await cloudinary.api.ping();
      console.log("Pinged Cloudinary...",cloudRes);
      cloudinaryStatus = cloudRes.status === "ok" ? "connected" : "error";
    } catch (err) {
      cloudinaryStatus = "error";
    }

    return sendSuccess(res, StatusCodes.OK, "Service is healthy", {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: "connected",
      cloudinary: cloudinaryStatus,
    });
  } catch (err: any) {
    const error = new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      "DatabaseError"
    );

    return sendError(
      res,
      error.statusCode,
      error.message,
      error.type,
      err.stack || "No stack"
    );
  }
};
