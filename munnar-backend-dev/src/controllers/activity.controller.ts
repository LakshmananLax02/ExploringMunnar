import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendSuccess, sendError } from "../utils/response.util";
import { ApiError } from "../utils/api-error";
import { ActivityService } from "../services/activity.service";
import { CreateActivityDto, GetActivitiesDto } from "../dto/activity.dto";

const activityService = new ActivityService();

export const createActivity = async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];

    const dto = req.body as CreateActivityDto;

    const activity = await activityService.createActivity(dto, files);

    return sendSuccess(
      res,
      StatusCodes.CREATED,
      "Activity created successfully",
      activity
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
 * @desc Get activities based on filters
 * @route POST /activities-list
 */
export const getActivitiesList = async (req: Request, res: Response) => {
  try {
    const filters = (req.body as GetActivitiesDto) || {};
    const data = await activityService.getActivitiesList(filters);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Activities fetched successfully",
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

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing activity id", "BadRequest");
    }

    await activityService.deleteActivity(id);

    return sendSuccess(res, StatusCodes.OK, "Activity deleted successfully", null);
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

export const editActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = (req.files as Express.Multer.File[]) || [];
    const dto = req.body as CreateActivityDto;

    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing activity id", "BadRequest");
    }

    const updatedActivity = await activityService.editActivity(id, dto, files);

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Activity updated successfully",
      updatedActivity
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

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing activity id", "BadRequest");
    }

    const activity = await activityService.getActivityById(id);

    return sendSuccess(res, StatusCodes.OK, "Activity fetched successfully", activity);
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
