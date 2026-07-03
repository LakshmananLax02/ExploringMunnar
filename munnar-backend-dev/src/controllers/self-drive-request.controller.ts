import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/response.util";
import { ApiError } from "../utils/api-error";
import {
  SelfDriveRequestDTO,
  GetSelfDriveRequestsDTO,
} from "../dto/self-drive-request.dto";
import { SelfDriveRequestService } from "../services/self-drive-request.service";
import { UpdateStatusDTO } from "../dto/status-update.dto";

const service = new SelfDriveRequestService();

export const createSelfDriveRequest = async (req: Request, res: Response) => {
  try {
    const data: SelfDriveRequestDTO = req.body;

    const result = await service.createSelfDriveRequest(data);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "Self-drive car request created successfully",
      result
    );
  } catch (err: any) {
    console.error("❌ Caught error:", err);
    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message || "Failed to create self-drive car request",
      err.type || "DatabaseError"
    );
  }
};

export const getSelfDriveRequests = async (req: Request, res: Response) => {
  try {
    const data: GetSelfDriveRequestsDTO = req.body;

    const result = await service.getSelfDriveRequests(data);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Self-drive requests retrieved successfully",
      result
    );
  } catch (err: any) {
    console.error("❌ Caught error:", err);
    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      err.type || "DatabaseError"
    );
  }
};

export const updateSelfDriveRequestStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const data: UpdateStatusDTO = req.body;

    const requestId = parseInt(id);
    if (isNaN(requestId) || requestId <= 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid request ID",
        "ValidationError"
      );
    }

    const result = await service.updateSelfDriveRequestStatus(requestId, data);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Self-drive request status updated successfully",
      result
    );
  } catch (err: any) {
    console.error("❌ Caught error:", err);
    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      err.type || "DatabaseError"
    );
  }
};
