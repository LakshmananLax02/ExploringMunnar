// home-slide.repository.ts
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma-client";

export class HomeSlideRepository {
  async create(data: Prisma.HomeSlideCreateInput) {
    return await prisma.homeSlide.create({
      data,
    });
  }

  async findAll() {
    return await prisma.homeSlide.findMany({
      where: { is_active: true },
      orderBy: [{ position: "asc" }, { created_at: "asc" }],
    });
  }

  async findById(id: string) {
    return await prisma.homeSlide.findUnique({
      where: { id },
    });
  }

  async softDelete(id: string) {
    return await prisma.homeSlide.update({
      where: { id },
      data: { is_active: false },
    });
  }
}
