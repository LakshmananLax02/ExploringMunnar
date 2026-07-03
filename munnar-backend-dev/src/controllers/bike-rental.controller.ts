import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from "../utils/response.util";
import { ApiError } from "../utils/api-error";
import { BikeRentalDTO, GetBikeRentalDTO } from "../dto/bike-rental.dto";
import { BikeRentalService } from "../services/bike-rental.service";
import { booking_status } from "../dto/status-update.dto";

const service = new BikeRentalService();

export const createBikeRental = async (req: Request, res: Response) => {
  try {
    const data: BikeRentalDTO = req.body;

    const result = await service.createBikeRental(data);

    return sendSuccess(res, StatusCodes.CREATED, "Bike rental created successfully", result);
  } catch (err: any) {
    console.error("❌ Error creating bike rental:", err);
    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message || "Failed to create bike rental",
      err.type || "DatabaseError"
    );
  }
};

export const getBikeRentals = async (req: Request, res: Response) => {
  try {
    const data: GetBikeRentalDTO = req.body;

    const result = await service.getBikeRentals(data);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Bike rentals retrieved successfully",
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

export const updateBikeRentalStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const rentalId = parseInt(id);
    if (isNaN(rentalId) || rentalId <= 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid rental ID", "ValidationError");
    }

    if (!status || !Object.values(booking_status).includes(status)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid status", "ValidationError");
    }

    const result = await service.updateBikeRentalStatus(rentalId, status);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Bike rental status updated successfully",
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
