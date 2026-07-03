// attraction.repository.ts
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma-client";

export class AttractionRepository {
  async create(data: Prisma.attractionCreateInput) {
    return await prisma.attraction.create({
      data,
    });
  }

  async findAll(filters: { route?: string }) {
    return await prisma.attraction.findMany({
      where: {
        is_active: true,

        ...(filters.route
          ? {
              route: {
                equals: filters.route,
                mode: "insensitive",
              },
            }
          : {}),
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async findById(id: string) {
    return await prisma.attraction.findUnique({
      where: { id },
    });
  }

  async softDelete(id: string) {
    return await prisma.attraction.update({
      where: { id },
      data: {
        is_active: false,
      },
    });
  }
}
