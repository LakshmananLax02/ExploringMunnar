import { booking_status, Prisma } from "@prisma/client";
import { prisma } from "../prisma-client";
import { GetCabBookingsDTO } from "../dto/cab-booking.dto";

export class CabBookingRepository {
  async create(data: Prisma.CabBookingCreateInput) {
    try {
      return await prisma.cabBooking.create({ data });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Database error while creating cab booking: ${err.message}`
        );
      }
      throw err;
    }
  }

  async getCabBookings(dto: GetCabBookingsDTO) {
    try {
      const skip = (dto.page - 1) * dto.limit;

      // Build where clause
      const where: Prisma.CabBookingWhereInput = {
        is_active: true,
      };

      if (dto.userName) {
        where.user = {
          name: {
            contains: dto.userName,
            mode: "insensitive",
          },
        };
      }

      if (dto.status) {
        where.status = dto.status as any;
      }

      // Get total count for pagination info
      const total = await prisma.cabBooking.count({ where });

      // Get paginated results ordered by latest created
      const bookings = await prisma.cabBooking.findMany({
        where,
        select: {
          id: true,
          user_id: true,
          name: true,
          email: true,
          pickup_point: true,
          drop_point: true,
          date: true,
          time: true,
          mobile_number: true,
          no_of_passengers: true,
          vehicle_type: true,
          status: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: dto.limit,
      });

      // Map user.name to user_name
      const flattenedBookings = bookings.map(({ user, ...rest }) => ({
        ...rest,
        user_name: user.name,
      }));

      return {
        data: flattenedBookings,
        pagination: {
          page: dto.page,
          limit: dto.limit,
          total,
          totalPages: Math.ceil(total / dto.limit),
        },
      };
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Database error while fetching cab bookings: ${err.message}`
        );
      }
      throw err;
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      return await prisma.cabBooking.update({
        where: { id },
        data: { status: status as booking_status },
      });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new Error(`Cab booking with ID ${id} not found`);
        }
        throw new Error(
          `Database error while updating cab booking: ${err.message}`
        );
      }
      throw err;
    }
  }
}
