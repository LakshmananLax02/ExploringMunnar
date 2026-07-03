import { prisma } from "../prisma-client";
import { booking_status } from "@prisma/client"; // adjust if your enum path is different

export class DashboardRepository {
  async getPendingCounts() {
    const [
      hotelBookings,
      cabBookings,
      bikeRentals,
      selfDriveRequests,
      itineraries,
    ] = await Promise.all([
      prisma.hotelBooking.count({
        where: { is_active: true },
      }),
      prisma.cabBooking.count({
        where: { is_active: true },
      }),
      prisma.bikeRental.count({
        where: { is_active: true },
      }),
      prisma.selfDriveCarRequest.count({
        where: { is_active: true },
      }),
      prisma.itinerary.count({
        where: { is_active: true },
      }),
    ]);

    return {
      hotelBookings,
      cabBookings,
      bikeRentals,
      selfDriveRequests,
      itineraries,
    };
  }

  async getHotelBookingsByMonth(startDate: Date, endDate: Date) {
    return await prisma.hotelBooking.groupBy({
      by: ["hotel_id"],
      where: {
        is_active: true,
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: { id: true },
    });
  }

  async getHotelsStayTypes(hotelIds: string[]) {
    if (hotelIds.length === 0) return [];

    return await prisma.hotel.findMany({
      where: {
        id: { in: hotelIds },
      },
      select: {
        id: true,
        stayType: true,
      },
    });
  }

  async getTransportBookingsChart() {
    const [cabBookings, bikeRentals, carRentals] = await Promise.all([
      prisma.cabBooking.count({
        where: { is_active: true },
      }),
      prisma.bikeRental.count({
        where: { is_active: true },
      }),
      prisma.selfDriveCarRequest.count({
        where: { is_active: true },
      }),
    ]);

    return [
      { name: "Cab booking", value: cabBookings },
      { name: "Bike rentals", value: bikeRentals },
      { name: "Car rentals", value: carRentals },
    ];
  }

  async getRecentHotelBookings() {
    const bookings = await prisma.hotelBooking.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
      select: {
        id: true,
        created_at: true,
        hotel: {
          select: {
            name: true,
            stayType: true,
            id: true,
          },
        },
      },
    });

    return bookings.map((booking) => ({
      bookingId: booking.id,
      hotelId: booking.hotel.id,
      hotelName: booking.hotel.name,
      stayType: booking.hotel.stayType,
      date: booking.created_at,
    }));
  }
}
