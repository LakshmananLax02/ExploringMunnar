import { BusTiming, Prisma } from "@prisma/client";
import { prisma } from "../prisma-client";

export class BusTimingRepository {
  async create(data: Prisma.BusTimingCreateInput) {
    try {
      return await prisma.busTiming.create({ data });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Database error while creating bus timing: ${err.message}`
        );
      }
      throw err;
    }
  }

  async getBusTimings(search?: string): Promise<BusTiming[]> {
    return await prisma.busTiming.findMany({
      where: {
        is_active: true,

        ...(search
          ? {
              OR: [
                {
                  from: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  to: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  bus_type: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async findById(id: number) {
    return await prisma.busTiming.findUnique({
      where: { id },
    });
  }

  async softDelete(id: number): Promise<void> {
    await prisma.busTiming.update({
      where: { id },
      data: {
        is_active: false,
      },
    });
  }

  async update(id: number, data: Prisma.BusTimingUpdateInput) {
    return await prisma.busTiming.update({
      where: { id },
      data,
    });
  }
}
