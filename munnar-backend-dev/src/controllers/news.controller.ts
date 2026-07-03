import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { sendSuccess, sendError } from "../utils/response.util";
import { ApiError } from "../utils/api-error";
import { NewsDTO } from "../dto/news.dto";
import { NewsService } from "../services/news.service";

const service = new NewsService();

export const createNews = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    const data = plainToInstance(NewsDTO, req.body);

    // Validate incoming fields
    const errors = await validate(data, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: errors.map((e) => e.constraints),
      });
    }

    // Pass data + single image file to service
    const result = await service.createNews(data, file);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "News created successfully",
      result
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

export const getRecentNews = async (req: Request, res: Response) => {
  try {
    const { categories, search, isNotExpired } = req.query;

    const categoryArray =
      typeof categories === "string"
        ? categories.split(",").map((c) => c.trim())
        : [];

    const newsList = await service.getRecentNews({
      categories: categoryArray,
      search: typeof search === "string" ? search : undefined,
      isNotExpired:
        typeof isNotExpired === "string" && isNotExpired.toLowerCase() === "true",
    });

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Recent news fetched successfully",
      newsList
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "NewsFetchError"
          );

    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newsId = Number(id);

    if (isNaN(newsId) || newsId <= 0) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "News not found",
        "InvalidNewsId"
      );
    }

    await service.deleteNews(newsId);

    return sendSuccess(res, StatusCodes.OK, "News deleted successfully", null);
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "NewsDeleteError"
          );

    return sendError(res, error.statusCode, error.message, error.type);
  }
};
