import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DashboardService } from "../services/dashboard.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { ApiError } from "../utils/api-error";

const dashboardService = new DashboardService();

export const getDashboardCounts = async (req: Request, res: Response) => {
  try {
    const counts = await dashboardService.getPendingCounts();

    return sendSuccess(res, StatusCodes.OK, "Dashboard counts fetched", counts);
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "DashboardError"
          );
    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const getHotelBookingsChart = async (req: Request, res: Response) => {
  try {
    // Get month from query param
    const { month } = req.query; // string | undefined

    const chartData = await dashboardService.getHotelBookingsChart(
      month as string | undefined
    );

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Hotel bookings chart data fetched",
      chartData
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "DashboardError"
          );
    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const getTransportBookingsChart = async (
  req: Request,
  res: Response
) => {
  try {
    const chartData = await dashboardService.getTransportBookingsChart();

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Transport bookings chart data fetched",
      chartData
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "DashboardError"
          );
    return sendError(res, error.statusCode, error.message, error.type);
  }
};

export const getRecentHotelBookings = async (req: Request, res: Response) => {
  try {
    const recentBookings = await dashboardService.getRecentHotelBookings();

    return sendSuccess(
      res,
      StatusCodes.OK,
      "Recent hotel bookings fetched",
      recentBookings
    );
  } catch (err: any) {
    const error =
      err instanceof ApiError
        ? err
        : new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            err.message,
            "DashboardError"
          );
    return sendError(res, error.statusCode, error.message, error.type);
  }
};
