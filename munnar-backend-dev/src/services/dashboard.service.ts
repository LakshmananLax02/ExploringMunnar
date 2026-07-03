import { StatusCodes } from "http-status-codes";
import { DashboardRepository } from "../repositories/dashboard.repository";
import { ApiError } from "../utils/api-error";
import { MONTH_MAP } from "../utils/month-map";

const dashboardRepository = new DashboardRepository();

export class DashboardService {
  async getPendingCounts() {
    return await dashboardRepository.getPendingCounts();
  }

  async getHotelBookingsChart(month?: string) {
    let monthNumber: number;
    const now = new Date();
    const year = now.getFullYear(); // ← Dynamic year!

    if (month) {
      const cleaned =
        month.trim().charAt(0).toUpperCase() +
        month.trim().slice(1).toLowerCase();
      monthNumber = MONTH_MAP[cleaned];
      if (!monthNumber) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Invalid month name",
          "InvalidMonth"
        );
      }
    } else {
      // Default: current month
      monthNumber = now.getMonth() + 1;
    }

    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0, 23, 59, 59);

    const bookings = await dashboardRepository.getHotelBookingsByMonth(
      startDate,
      endDate
    );

    const hotelIds = bookings.map((b) => b.hotel_id);
    if (hotelIds.length === 0) return [];

    const hotels = await dashboardRepository.getHotelsStayTypes(hotelIds);

    const hotelMap = new Map(hotels.map((h) => [h.id, h.stayType]));

    const aggregated = new Map<string, number>();
    for (const booking of bookings) {
      const stayType = hotelMap.get(booking.hotel_id) || "Unknown";
      aggregated.set(
        stayType,
        (aggregated.get(stayType) || 0) + booking._count.id
      );
    }

    const result = Array.from(aggregated.entries())
      .map(([name, pv]) => ({ name, pv }))
      .sort((a, b) => b.pv - a.pv);

    return result;
  }

  async getTransportBookingsChart() {
    return await dashboardRepository.getTransportBookingsChart();
  }

  async getRecentHotelBookings() {
    return await dashboardRepository.getRecentHotelBookings();
  }
}
