import { Prisma, News } from "@prisma/client";
import { prisma } from "../prisma-client";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";

export class NewsRepository {
  async create(data: Prisma.NewsCreateInput) {
    try {
      return await prisma.news.create({ data });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error while creating news: ${err.message}`);
      }
      throw err;
    }
  }

  async getRecentNews(filters: {
    categories?: string[];
    search?: string;
    isNotExpired?: boolean;
  }): Promise<News[]> {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const now = new Date();

    return await prisma.news.findMany({
      where: {
        isActive: true,
        ...(filters.isNotExpired === true
          ? {
              OR: [
                { expirationDate: null }, // No expiration date
                { expirationDate: { gt: now } }, // Not yet expired
              ],
            }
          : {}),

        ...(filters.categories?.length
          ? { category: { in: filters.categories } }
          : {}),

        ...(filters.search
          ? {
              heading: {
                contains: filters.search,
                mode: "insensitive",
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findExpiredNews(): Promise<News[]> {
    const now = new Date();

    return await prisma.news.findMany({
      where: {
        expirationDate: { not: null, lte: now },
      },
    });
  }

  async deleteExpiredNews(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0;

    const result = await prisma.news.deleteMany({
      where: { id: { in: ids } },
    });

    return result.count;
  }

  async deleteNews(newsId: number): Promise<void> {
    // Soft delete only if active
    const result = await prisma.news.updateMany({
      where: {
        id: newsId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // If no rows updated, distinguish:
    // - not found
    // - already inactive
    if (result.count === 0) {
      const exists = await prisma.news.count({
        where: { id: newsId },
      });

      if (exists === 0) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "News not found",
          "NewsNotFound"
        );
      }

      // already inactive → idempotent success
      return;
    }
  }
}
