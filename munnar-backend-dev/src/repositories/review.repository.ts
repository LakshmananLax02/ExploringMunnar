import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ReviewRepository {
  async create(userId: number, username: string, data: any) {
    return await prisma.review.create({
      data: {
        hotelId: data.hotelId,
        userId: userId,
        username: username,
        title: data.title,
        description: data.description,
        rating: Number(data.rating),
        travelledMonth: data.travelledMonth,
        roomType: data.roomType,
        ratings: {
          create: {
            cleanliness: Number(data.cleanliness),
            food: Number(data.food),
            value: Number(data.value),
            facilities: Number(data.facilities),
            location: Number(data.location),
          }
        }
      },
      include: { ratings: true }
    });
  }

  async findByHotelId(hotelId: string) {
    return await prisma.review.findMany({
      where: { hotelId, is_active: true },
      include: { ratings: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async findAllAdmin() {
    return await prisma.review.findMany({
      include: { ratings: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    return await prisma.review.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return await prisma.review.delete({
      where: { id }
    });
  }
}