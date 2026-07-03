// attraction.controller.ts
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AttractionDTO } from "../dto/attraction.dto";
import { AttractionService } from "../services/attraction.service";
import { sendSuccess } from "../utils/response.util";
import { ApiError } from "../utils/api-error";

const attractionService = new AttractionService();

export const createAttraction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data: AttractionDTO = req.body;
    const file = req.file as Express.Multer.File | undefined;

    const result = await attractionService.createAttraction(data,file);

    sendSuccess(
      res,
      StatusCodes.CREATED,
      "Attraction created successfully",
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

export const getAttractions = async (req: Request, res: Response) => {
  try {
    const route = req.query.route as string | undefined;

    const result = await attractionService.getAttractions({
      route,
    });

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Attractions fetched successfully",
      result
    );
  } catch (err: any) {
    console.error("❌ Error fetching attractions:", err);

    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message || "Failed to fetch attractions",
      err.type || "DatabaseError"
    );
  }
};

export const deleteAttraction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const attractionId = String(id);
    await attractionService.deleteAttraction(attractionId);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Attraction deleted successfully",
      null
    );
  } catch (err: any) {
    console.error("❌ Error deleting attraction:", err);

    throw new ApiError(
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.message || "Failed to delete attraction",
      err.type || "DatabaseError"
    );
  }
};
