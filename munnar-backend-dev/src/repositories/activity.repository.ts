import { prisma } from "../prisma-client";
import { Prisma, activity } from "@prisma/client";

export class ActivityRepository {
  async createActivity(data: Prisma.activityCreateInput): Promise<activity> {
    return await prisma.activity.create({
      data,
      include: {
        images: true,
        reviews: true,
      },
    });
  }

  async getActivitiesList(filters: any, skip: number, take: number) {
    const { search, category, type } = filters;

    const where: any = {
      is_active: true,
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
      ...(category
        ? {
            category: category,
          }
        : {}),
      ...(type?.length
        ? {
            type: {
              in: type,
            },
          }
        : {}),
    };

    const activities = await prisma.activity.findMany({
      where,
      skip,
      take,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        short_description: true,
        description: true,
        price: true,
        category: true,
        type: true,
        address: true,
        location_url: true,
        is_featured: true,
        created_at: true,
        images: {
          select: { id: true, url: true },
        },
      },
    });

    const totalRecords = await prisma.activity.count({ where });

    return { activities, totalRecords };
  }

  async softDeleteActivity(id: string) {
    // Set activity and all its images to inactive
    return await prisma.activity.update({
      where: { id },
      data: {
        is_active: false,
        images: {
          updateMany: {
            where: { is_active: true },
            data: { is_active: false },
          },
        },
      },
      include: {
        images: true,
        reviews: true,
      },
    });
  }

  async getActivityById(id: string) {
    return await prisma.activity.findUnique({
      where: { id },
      include: {
        images: {
          select: { id: true, url: true, public_id: true },
        },
        reviews: true,
      },
    });
  }

  async editActivity(
    id: string,
    data: any,
    newImages: Array<{ url: string; public_id?: string }>,
    imageIdsToDelete: string[]
  ) {
    const updateData: any = { ...data };

    // Delete images that are no longer needed
    if (imageIdsToDelete.length > 0) {
      updateData.images = {
        deleteMany: { id: { in: imageIdsToDelete } },
      };
    }

    // Add new images
    if (newImages.length > 0) {
      if (!updateData.images) updateData.images = {};
      updateData.images.create = newImages.map((img) => ({
        url: img.url,
        alt_text: data.name,
        is_active: true,
        public_id: img.public_id || null,
      }));
    }

    return await prisma.activity.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        reviews: true,
      },
    });
  }
}
