import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HotelBookingService, HotelService } from "../services/hotel.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { ApiError } from "../utils/api-error";
import {
  HotelBookingDTO,
  HotelRequestSearchDto,
} from "../dto/hotel-booking.dto";
import { UpdateStatusDTO } from "../dto/status-update.dto";
import { HotelFilterDto, UpdateHotelPromotionsDto } from "../dto/hotel.dto";

const hotelService = new HotelService();
const hotelBookingService = new HotelBookingService();

export const createHotel = async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const hotel = await hotelService.createHotel(req.body, files);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "Hotel created successfully",
      hotel
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "UnexpectedError"
          );

    return sendError(res, error.statusCode, error.message, error.type);
  }
};

/**
 * @desc Get hotels based on filters
 * @route POST /hotels/filter
 */
export const getHotelsList = async (req: Request, res: Response) => {
  try {
    const filters : HotelFilterDto = req.body || {}; // contains stayType, location, amenities, etc.
    const data = await hotelService.getHotelsList(filters);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Hotels fetched successfully",
      data
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "UnexpectedError"
          );

    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const hotel = await hotelService.getHotelById(id);
    return sendSuccess(
      res,
      StatusCodes.OK,
      "Hotel fetched successfully",
      hotel
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "UnexpectedError"
          );

    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const editHotel = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const files = (req.files as Express.Multer.File[]) || [];
    const updatedHotel = await hotelService.editHotel(id, req.body, files);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Hotel updated successfully",
      updatedHotel
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "UnexpectedError"
          );

    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const updateHotelPromotions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dto: UpdateHotelPromotionsDto = req.body;
    const file = req.file as Express.Multer.File | undefined;

    const updatedHotel = await hotelService.updateHotelPromotions(id, dto, file);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Hotel promotions updated successfully",
      updatedHotel
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "PromotionUpdateError"
          );

    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Missing hotel id",
        "BadRequest"
      );
    }

    await hotelService.deleteHotel(id);

    return sendSuccess(res, StatusCodes.OK, "Hotel deleted successfully", null);
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "UnexpectedError"
          );

    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const createHotelBooking = async (req: Request, res: Response) => {
  try {
    const data: HotelBookingDTO = req.body;

    const result = await hotelBookingService.createHotelBooking(data);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "Hotel booking created successfully",
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

export const getHotelBookingRequests = async (req: Request, res: Response) => {
  try {
    const data: HotelRequestSearchDto = req.body;

    const result = await hotelBookingService.getHotelRequests(data);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Hotel booking requests fetched successfully",
      result
    );
  } catch (err: any) {
    console.error("❌ Caught error:", err);

    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message || "Failed to fetch hotel booking requests",
      err.type || "HotelBookingFetchError"
    );
  }
};

export const updateHotelBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: UpdateStatusDTO = req.body;

    const result = await hotelBookingService.updateHotelBookingStatus(id, data);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Hotel booking status updated successfully",
      result
    );
  } catch (err: any) {
    console.error("❌ Caught error:", err);

    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message || "Failed to update hotel booking status",
      err.type || "DatabaseError"
    );
  }
};
