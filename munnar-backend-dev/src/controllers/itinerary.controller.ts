import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ItineraryService } from "../services/itinerary.service";
import { sendSuccess } from "../utils/response.util";
import { ApiError } from "../utils/api-error";
import { ItineraryDTO, ItineraryListDTO } from "../dto/itinerary.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { UpdateStatusDTO } from "../dto/status-update.dto";

const service = new ItineraryService();

export const createItinerary = async (req: Request, res: Response) => {
  try {
    const data : ItineraryDTO= req.body;
    const result = await service.createItinerary(data);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "Itinerary created successfully",
      result
    );
  } catch (err: any) {
    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      "DatabaseError"
    );
  }
};

export const listItineraries = async (req: Request, res: Response) => {
  try {
    const data :ItineraryListDTO = req.body

    const result = await service.listItineraries(data);

    return sendSuccess(res, StatusCodes.OK, "Itineraries fetched successfully", result);
  } catch (err: any) {
    console.error("❌ Error in listItineraries:", err);
    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      err.type || "DatabaseError"
    );
  }
};


export const updateItineraryStatus = async (req: Request, res: Response) => {
  try {
    const itineraryId = Number(req.params.id);
    const dto: UpdateStatusDTO = req.body

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Validation failed",
        "ValidationError"
      );
    }

    const result = await service.updateItineraryStatus(itineraryId, dto);

    return sendSuccess(res, StatusCodes.OK, "Itinerary status updated successfully", result);
  } catch (err: any) {
    console.error("❌ Error in updateItineraryStatus:", err);
    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      err.type || "DatabaseError"
    );
  }
};