import { Prisma } from "@prisma/client";
import { prisma } from "../prisma-client";
import { GetSelfDriveRequestsDTO } from "../dto/self-drive-request.dto";

export class SelfDriveRequestRepository {
  async create(data: Prisma.SelfDriveCarRequestCreateInput) {
    try {
      return await prisma.selfDriveCarRequest.create({ data });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error while creating self-drive car request: ${err.message}`);
      }
      throw err;
    }
  }

  async getSelfDriveRequests(dto: GetSelfDriveRequestsDTO) {
    try {
      const skip = (dto.page - 1) * dto.limit;

      // Build where clause
      const where: Prisma.SelfDriveCarRequestWhereInput = {
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
      const total = await prisma.selfDriveCarRequest.count({ where });

      // Get paginated results ordered by latest created
      const requests = await prisma.selfDriveCarRequest.findMany({
        where,
        select: {
          id: true,
          user_id: true,
          name: true,
          email: true,
          pickup_location: true,
          drop_location: true,
          date: true,
          time: true,
          mobile_number: true,
          no_of_days: true,
          fuel_type: true,
          driver_needed: true,
          car_category: true,
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

      // Map to response format
      const mappedRequests = requests.map(({ user, ...rest }) => ({
        ...rest,
        name: rest.name,
        email: rest.email,
        from: rest.pickup_location,
        to: rest.drop_location,
        phone: rest.mobile_number,
        date: rest.date.toISOString().split('T')[0],
        days: rest.no_of_days,
        fueltype: rest.fuel_type,
        carCategory: rest.car_category,
        driverNeeded: rest.driver_needed ? "Yes" : "No",
      }));

      return {
        data: mappedRequests,
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
          `Database error while fetching self-drive requests: ${err.message}`
        );
      }
      throw err;
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      return await prisma.selfDriveCarRequest.update({
        where: { id },
        data: { status: status as any },
      });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new Error(`Self-drive request with ID ${id} not found`);
        }
        throw new Error(`Database error while updating self-drive request: ${err.message}`);
      }
      throw err;
    }
  }
}
