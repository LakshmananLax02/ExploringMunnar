import { booking_status, Prisma } from "@prisma/client";
import { prisma } from "../prisma-client";
import { UpdateStatusDTO } from "../dto/status-update.dto";

export class ItineraryRepository {
  async create(data: Prisma.itineraryCreateInput) {
    try {
      return await prisma.itinerary.create({ data });
    } catch (err: any) {
      // Prisma known error handling
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Database error while creating itinerary: ${err.message}`
        );
      }
      throw err;
    }
  }

  async findItineraries(
    where: Prisma.itineraryWhereInput,
    skip: number,
    take: number
  ) {
    return await prisma.itinerary.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        attractions: {
          select: {
            attraction: {
              select: {
                id: true,
                description: true,
                route: true,
              },
            },
          },
        },
      },
    });
  }

  async countItineraries(where: Prisma.itineraryWhereInput) {
    return await prisma.itinerary.count({ where });
  }

  async updateStatus(itineraryId: number, req: UpdateStatusDTO) {
    return await prisma.itinerary.update({
      where: { id: itineraryId },
      data: { status: req.status },
    });
  }
}
