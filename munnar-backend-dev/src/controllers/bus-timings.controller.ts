import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BusTimingDTO } from "../dto/bus-timings.dto";
import { ApiError } from "../utils/api-error";
import { sendSuccess } from "../utils/response.util";
import { BusTimingService } from "../services/bus-timings.service";

const busTimingService = new BusTimingService();

export const createBusTiming = async (req: Request, res: Response) => {
  try {
    const data: BusTimingDTO = req.body;

    const result = await busTimingService.createBusTiming(data);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "Bus timing created successfully",
      result
    );
  } catch (err: any) {
    console.log("❌ Caught error:", err);
    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      err.type || "DatabaseError"
    );
  }
};

export const getBusTimings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;

    const result = await busTimingService.getBusTimings(search);

    sendSuccess(
      res,
      StatusCodes.OK,
      "Bus timings fetched successfully",
      result
    );
    return;
  } catch (err: any) {
    throw err;
  }
};

export const deleteBusTiming = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const busTimingId = Number(id);

    if (isNaN(busTimingId) || busTimingId <= 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid bus timing id",
        "InvalidBusTimingId"
      );
    }

    await busTimingService.deleteBusTiming(busTimingId);

    sendSuccess(res, StatusCodes.OK, "Bus timing deleted successfully", null);
    return;
  } catch (err) {
    throw err;
  }
};

export const updateBusTiming = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const busTimingId = Number(id);

    if (isNaN(busTimingId) || busTimingId <= 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid bus timing id",
        "InvalidBusTimingId"
      );
    }

    const data: BusTimingDTO = req.body;

    const result = await busTimingService.updateBusTiming(busTimingId, data);

    sendSuccess(res, StatusCodes.OK, "Bus timing updated successfully", result);
    return;
  } catch (err) {
    throw err;
  }
};
