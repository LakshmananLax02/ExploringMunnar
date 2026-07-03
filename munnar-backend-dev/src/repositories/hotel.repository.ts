import { HotelRequestSearchDto } from "../dto/hotel-booking.dto";
import { HotelFilterDto, HotelRuleDto } from "../dto/hotel.dto";
import { booking_status } from "../dto/status-update.dto";
import { prisma } from "../prisma-client";
import { hotel, Prisma } from "@prisma/client";

export class HotelRepository {
  async createHotel(data: Prisma.hotelCreateInput): Promise<hotel> {
    return await prisma.hotel.create({ data });
  }

  async getHotelsList(filters: HotelFilterDto, skip: number, take: number) {
    const {
      stayType,
      locationRange,
      amenities,
      experiences,
      budget,
      isHighlighted,
      isUniqueStays,
      isTopRated,
      isVerified,
      isFeatured,
    } = filters;

    const now = new Date();

    // Dynamic WHERE conditions
    const baseWhere: any = {
      isActive: true,
      ...(stayType?.length ? { stayType: { in: stayType } } : {}),
      ...(locationRange?.length
        ? { locationRange: { in: locationRange } }
        : {}),
      ...(budget && !(budget.startingFrom === 0 && budget.to === 0)
        ? {
            pricePerNight: {
              gte: budget.startingFrom ?? 0,
              lte: budget.to ?? Number.MAX_SAFE_INTEGER,
            },
          }
        : {}),
      ...(amenities?.length
        ? {
            amenities: {
              some: {
                name: { in: amenities },
              },
            },
          }
        : {}),
      ...(experiences?.length
        ? {
            experiences: {
              some: {
                name: { in: experiences },
              },
            },
          }
        : {}),
      ...(isHighlighted === true ? { isHighlighted: true } : {}),
      ...(isUniqueStays === true ? { isUniqueStays: true } : {}),
      ...(isTopRated === true ? { rating: { gte: 3.5 } } : {}),
      ...(isVerified === true ? { isVerified: true } : {}),
    };

    const featuredActiveWhere = {
      isFeatured: true,
      OR: [{ featuredUntil: null }, { featuredUntil: { gte: now } }],
    };

    const defaultSelect = {
      id: true,
      name: true,
      description: true,
      pricePerNight: true,
      rating: true,
      stayType: true,
      location: true,
      locationRange: true,
      location_url: true,
      isFeatured: true,
      isHighlighted: true,
      isUniqueStays: true,
      isVerified: true,
      featuredImageUrl: true,
      featuredImagePublicId: true,
      featuredUntil: true,
      amenities: { select: { name: true, data: true } },
      experiences: { select: { name: true } },
      images: {
        where: { is_active: true },
        select: { url: true, id: true, public_id: true },
      },
    };

    const where = isFeatured === true
      ? { ...baseWhere, ...featuredActiveWhere }
      : baseWhere;

    const orderBy = [{ isFeatured: "desc" } as const, { name: "asc" } as const];

    const hotels = await prisma.hotel.findMany({
      where,
      skip,
      take,
      orderBy,
      select: defaultSelect,
    });

    const totalRecords = await prisma.hotel.count({ where });
    return { hotels, totalRecords };
  }

  async getHotelById(id: string) {
    return await prisma.hotel.findUnique({
      where: { id, isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        pricePerNight: true,
        rating: true,
        stayType: true,
        location: true,
        locationRange: true,
        location_url: true,
        isFeatured: true,
        isHighlighted: true,
        isUniqueStays: true,
        isVerified: true,
        featuredImageUrl: true,
        featuredImagePublicId: true,
        featuredUntil: true,
        isActive: true,

        amenities: {
          select: { name: true, data: true },
        },
        experiences: {
          select: { name: true },
        },
        images: {
          where: { is_active: true },
          select: { url: true, id: true, public_id: true },
        },
        // ← NEW: Fetch rules
        rules: {
          where: { is_active: true },
          select: {
            id: true,
            key: true,
            title: true,
            description: true,
          },
          orderBy: { key: "asc" }, // optional: consistent order
        },
      },
    });
  }

  async editHotel(
    id: string,
    data: any,
    newImages: Array<{ url: string; public_id?: string }>,
    imageIdsToDelete: string[],
    rulesToCreate: HotelRuleDto[] = [],
    rulesToUpdate: HotelRuleDto[] = [],
    deletedRuleIds: string[] = []
  ) {
    const updateData: any = { ...data };

    // Handle amenities full replace
    if (data.amenities) {
      updateData.amenities = {
        deleteMany: {},
        create: data.amenities.create,
      };
    }

    // Handle experiences full replace
    if (data.experiences) {
      updateData.experiences = {
        deleteMany: {},
        create: data.experiences.create,
      };
    }

    // Handle image soft-deletes
    if (imageIdsToDelete.length > 0) {
      if (!updateData.images) updateData.images = {};
      updateData.images.updateMany = {
        where: { id: { in: imageIdsToDelete } },
        data: { is_active: false },
      };
    }

    // Handle new image creates
    if (newImages.length > 0) {
      if (!updateData.images) updateData.images = {};
      updateData.images.create = newImages.map((img) => ({
        url: img.url,
        public_id: img.public_id || null,
        is_active: true,
      }));
    }

    // Handle rule creates
    if (rulesToCreate.length > 0) {
      if (!updateData.rules) updateData.rules = {};
      updateData.rules.create = rulesToCreate.map((rule) => ({
        key: rule.key,
        title: rule.title || null,
        description: rule.description || null,
      }));
    }

    // Handle rule soft-deletes
    if (deletedRuleIds.length > 0) {
      if (!updateData.rules) updateData.rules = {};
      updateData.rules.updateMany = {
        where: { id: { in: deletedRuleIds } },
        data: { is_active: false },
      };
    }

    // First: Perform the main hotel update (scalars + amenities + experiences + images + new rules + rule deactivations)
    const updatedHotel = await prisma.hotel.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        pricePerNight: true,
        rating: true,
        stayType: true,
        location: true,
        locationRange: true,
        location_url: true,
        isFeatured: true,
        isHighlighted: true,
        isUniqueStays: true,
        isVerified: true,
        featuredImageUrl: true,
        featuredImagePublicId: true,
        featuredUntil: true,
        amenities: { select: { name: true, data: true } },
        experiences: { select: { name: true } },
        images: {
          where: { is_active: true },
          select: { id: true, url: true, public_id: true },
        },
        rules: {
          where: { is_active: true },
          select: { id: true, key: true, title: true, description: true },
          orderBy: { key: "asc" },
        },
      },
    });

    // Handle individual rule updates (Prisma doesn't support bulk update with different data per row)
    if (rulesToUpdate.length > 0) {
      await Promise.all(
        rulesToUpdate.map((rule) =>
          prisma.hotel_rule.update({
            where: { id: rule.id! }, // rule.id is guaranteed here
            data: {
              key: rule.key,
              title: rule.title || null,
              description: rule.description || null,
            },
          })
        )
      );
    }

    // Refetch the hotel to get the latest state including updated rules
    return await this.getHotelById(id);
  }

  async softDeleteHotel(id: string) {
    // Set hotel and all its images to inactive
    return await prisma.hotel.update({
      where: { id },
      data: {
        isActive: false,
        images: {
          updateMany: {
            where: { is_active: true },
            data: { is_active: false },
          },
        },
      },
      include: {
        images: true,
        amenities: true,
        experiences: true,
      },
    });
  }

  async updatePromotions(
    id: string,
    data: {
      isFeatured: boolean;
      isHighlighted: boolean;
      isUniqueStays: boolean;
      featuredImageUrl: string | null;
      featuredImagePublicId: string | null;
      featuredUntil: Date | null;
    }
  ) {
    return await prisma.hotel.update({
      where: { id },
      data,
      select: {
        id: true,
        isFeatured: true,
        isHighlighted: true,
        isUniqueStays: true,
        isVerified: true,
        featuredImageUrl: true,
        featuredImagePublicId: true,
        featuredUntil: true,
        name: true,
        images: {
          where: { is_active: true },
          select: { url: true, id: true, public_id: true },
        },
      },
    });
  }
}

export class HotelBookingRepository {
  async create(data: Prisma.HotelBookingCreateInput) {
    try {
      return await prisma.hotelBooking.create({ data });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Database error while creating hotel booking: ${err.message}`
        );
      }
      throw err;
    }
  }

  async getHotelRequests(
    dto: HotelRequestSearchDto,
    skip: number,
    take: number
  ) {
    const { search, status } = dto;

    const where: any = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              {
                first_name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                last_name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                hotel: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    };

    const requests = await prisma.hotelBooking.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        status: true,
        check_in: true,
        check_out: true,
        adults: true,
        kids: true,
        first_name: true,
        last_name: true,
        email: true,
        phone_number: true,
        created_at: true,
        hotel: {
          select: {
            name: true,
            pricePerNight: true,
            location: true,
            images: {
              where: { is_active: true },
              take: 1,
              select: { id: true, url: true },
            },
          },
        },
      },
    });

    const totalRecords = await prisma.hotelBooking.count({ where });

    return { requests, totalRecords };
  }

  async updateBookingStatus(bookingId: string, status: string) {
    return prisma.hotelBooking.update({
      where: { id: bookingId },
      data: { status: status as booking_status },
      select: {
        id: true,
        status: true,
        updated_at: true,
      },
    });
  }
}
