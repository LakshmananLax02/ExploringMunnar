// home-slide.controller.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateHomeSlideDto } from "../dto/home-slide.dto";
import { HomeSlideService } from "../services/home-slide.service";
import { sendSuccess } from "../utils/response.util";
import { ApiError } from "../utils/api-error";

const homeSlideService = new HomeSlideService();

export const createHomeSlide = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data: CreateHomeSlideDto = req.body;
    const file = req.file as Express.Multer.File | undefined;

    const result = await homeSlideService.createSlide(data, file);

    sendSuccess(
      res,
      StatusCodes.CREATED,
      "Homepage slide created successfully",
      result
    );
    return;
  } catch (err: any) {
    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message,
      err.type || "DatabaseError"
    );
  }
};

export const getHomeSlides = async (req: Request, res: Response) => {
  try {
    const result = await homeSlideService.getSlides();

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Homepage slides fetched successfully",
      result
    );
  } catch (err: any) {
    console.error("❌ Error fetching homepage slides:", err);

    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message || "Failed to fetch homepage slides",
      err.type || "DatabaseError"
    );
  }
};

export const deleteHomeSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await homeSlideService.deleteSlide(String(id));

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Homepage slide deleted successfully",
      null
    );
  } catch (err: any) {
    console.error("❌ Error deleting homepage slide:", err);

    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message || "Failed to delete homepage slide",
      err.type || "DatabaseError"
    );
  }
};
