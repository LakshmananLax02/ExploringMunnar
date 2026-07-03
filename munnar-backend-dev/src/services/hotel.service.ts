import {
  AmenityDto,
  CreateHotelDto,
  HotelFilterDto,
  HotelRuleDto,
  UpdateHotelDto,
  UpdateHotelPromotionsDto,
} from "../dto/hotel.dto";
import {
  HotelBookingRepository,
  HotelRepository,
} from "../repositories/hotel.repository";
import { ApiError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary-upload";
import {
  HotelBookingDTO,
  HotelRequestSearchDto,
} from "../dto/hotel-booking.dto";
import { Prisma } from "@prisma/client";

const hotelRepository = new HotelRepository();
const userService = new UserService();
const hotelBookingRepository = new HotelBookingRepository();

export class HotelService {
  async createHotel(dto: CreateHotelDto, files: Express.Multer.File[]) {
    try {
      // 1. Upload images to Cloudinary
      const uploadPromises =
        files && files.length > 0
          ? files.map((file) => uploadToCloudinary(file.buffer, "hotels"))
          : [];

      const uploadedImages =
        uploadPromises.length > 0 ? await Promise.all(uploadPromises) : [];
      const imageUrls = uploadedImages.map((img: any) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));

      // 2. Parse amenities & experiences (already handled by DTO)
      const amenities = dto.amenities || [];
      const experiences = dto.experiences || [];
      const rules = dto.rules || []; // ← NEW

      // 3. Prepare hotel data
      const hotelData = {
        name: dto.name,
        description: dto.description,
        pricePerNight: dto.pricePerNight,
        rating: dto.rating ? dto.rating : null,
        distanceFromCenter: dto.distanceFromCenter,
        stayType: dto.stayType,
        location: dto.location,
        locationRange: dto.locationRange, // ← NEW
        location_url: dto.locationUrl,

        // Force promotion fields to default (ignore any sent values)
        isFeatured: false,
        isHighlighted: false,
        isUniqueStays: false,
        isVerified: dto.isVerified ?? false,
        featuredImageUrl: null,
        featuredImagePublicId: null,
        featuredUntil: null,

        isActive: true,

        amenities: {
          create: amenities.map((a: AmenityDto) => ({
            name: a.title,
            data: a.data.join(", "),
          })),
        },
        experiences: {
          create: experiences.map((e: string) => ({ name: e })),
        },
        images: {
          create: imageUrls.map((img) => ({
            url: img.url,
            public_id: img.public_id,
            is_active: true,
          })),
        },
        rules: {
          create: rules.map((rule) => ({
            key: rule.key,
            title: rule.title || null,
            description: rule.description || null,
          })),
        },
      };

      // 4. Save
      const hotel = await hotelRepository.createHotel(hotelData);
      return hotel;
    } catch (err: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        err.message,
        "HotelCreationError"
      );
    }
  }

  async getHotelsList(filters: HotelFilterDto) {
    try {
      const { pageNumber = 1 } = filters;
      const take = 10; // ✅ 10 records per page
      const skip = (pageNumber - 1) * take;

      const { hotels, totalRecords } = await hotelRepository.getHotelsList(
        filters,
        skip,
        take
      );

      const hotelsMapped = hotels?.map((hotel: any) => ({
        ...hotel,
        amenities: hotel.amenities.map((amenity: any) => ({
          title: amenity.name,
          data: amenity.data ? amenity.data.split(", ") : [],
        })),
        images: hotel.images?.map((img: any) => ({
          url: img.url,
          id: img.id,
          public_id: img.public_id,
        })),
      }));

      return {
        hotels: hotelsMapped,
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / take),
      };
    } catch (err: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        err.message,
        "HotelFetchError"
      );
    }
  }

  async getHotelById(id: string) {
    const hotel = await hotelRepository.getHotelById(id);
    if (!hotel) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Hotel not found",
        "HotelNotFound"
      );
    }
    return hotel;
  }

  async editHotel(
    id: string,
    dto: UpdateHotelDto,
    files: Express.Multer.File[]
  ) {
    try {
      // 1. Fetch existing hotel with images (and rules via getHotelById)
      const existingHotel = await hotelRepository.getHotelById(id);
      if (!existingHotel) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Hotel with id ${id} not found`,
          "HotelNotFoundError"
        );
      }

      // 2. Handle image deletion from Cloudinary
      const deletedImageIds = dto.deletedImages || [];
      const imagesToDelete = existingHotel.images.filter((img: any) =>
        deletedImageIds.includes(img.id)
      );

      for (const img of imagesToDelete) {
        if (img.public_id) {
          try {
            await deleteFromCloudinary(img.public_id);
          } catch (err) {
            console.warn(
              `Failed to delete image from Cloudinary: ${img.url}`,
              err
            );
          }
        }
      }

      const dbImageIdsToDelete = imagesToDelete.map((img: any) => img.id);

      // 3. Upload new images
      const uploadPromises =
        files && files.length > 0
          ? files.map((file) => uploadToCloudinary(file.buffer, "hotels"))
          : [];

      const uploadedImages =
        uploadPromises.length > 0 ? await Promise.all(uploadPromises) : [];

      const newImageUrls = uploadedImages.map((img: any) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));

      // 4. Prepare base hotel update data — ONLY allowed fields
      // Promotion fields are INTENTIONALLY EXCLUDED
      const hotelData: any = {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.pricePerNight !== undefined && {
          pricePerNight: dto.pricePerNight,
        }),
        ...(dto.rating !== undefined && { rating: dto.rating }),
        ...(dto.distanceFromCenter !== undefined && {
          distanceFromCenter: dto.distanceFromCenter,
        }),
        ...(dto.stayType !== undefined && { stayType: dto.stayType }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.locationRange !== undefined && {
          locationRange: dto.locationRange,
        }),
        ...(dto.locationUrl !== undefined && { location_url: dto.locationUrl }),
        ...(dto.isVerified !== undefined && { isVerified: dto.isVerified }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),

        // Amenities: full replace if provided
        ...(dto.amenities !== undefined && {
          amenities: {
            deleteMany: {},
            create: dto.amenities.map((a: AmenityDto) => ({
              name: a.title,
              data: a.data.join(", "),
            })),
          },
        }),

        // Experiences: full replace if provided
        ...(dto.experiences !== undefined && {
          experiences: {
            deleteMany: {},
            create: dto.experiences.map((e: string) => ({ name: e })),
          },
        }),
      };

      // 5. Process rules granularly
      const rulesToCreate = (dto.rules || []).filter(
        (rule): rule is HotelRuleDto & { id?: undefined } => !rule.id
      );

      const rulesToUpdate = (dto.rules || []).filter(
        (rule): rule is HotelRuleDto & { id: string } => !!rule.id
      );

      const deletedRuleIds = dto.deletedRules || [];

      // 6. Call repository with all necessary data
      const updatedHotel = await hotelRepository.editHotel(
        id,
        hotelData,
        newImageUrls,
        dbImageIdsToDelete,
        rulesToCreate,
        rulesToUpdate,
        deletedRuleIds
      );

      return updatedHotel;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        err.message || "Failed to update hotel",
        "HotelEditError"
      );
    }
  }

  async updateHotelPromotions(
    id: string,
    dto: UpdateHotelPromotionsDto,
    file?: Express.Multer.File
  ) {
    try {
      // Fetch current hotel to get old featured image (for deletion)
      const existingHotel = await hotelRepository.getHotelById(id);
      if (!existingHotel) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Hotel not found",
          "HotelNotFound"
        );
      }

      let newFeaturedImageUrl: string | null = null;
      let newFeaturedImagePublicId: string | null = null;

      // Handle new featured image upload
      if (dto.isFeatured) {
        if (!file) {
          newFeaturedImageUrl = existingHotel.featuredImageUrl;
          newFeaturedImagePublicId = existingHotel.featuredImagePublicId;
        } else {
          // Delete old featured image if exists
          if (existingHotel.featuredImagePublicId) {
            try {
              await deleteFromCloudinary(existingHotel.featuredImagePublicId);
            } catch (err) {
              console.warn(
                "Failed to delete old featured image from Cloudinary",
                err
              );
            }
          }

          // Upload new one
          const uploaded = await uploadToCloudinary(
            file.buffer,
            "hotels/featured"
          );
          newFeaturedImageUrl = uploaded.secure_url;
          newFeaturedImagePublicId = uploaded.public_id;
        }
      }

      // If isFeatured is false, clear featured image and date
      if (!dto.isFeatured) {
        // Delete from Cloudinary if exists and not already handled above
        if (existingHotel.featuredImagePublicId) {
          try {
            await deleteFromCloudinary(existingHotel.featuredImagePublicId);
          } catch (err) {
            console.warn("Failed to delete featured image on disable", err);
          }
        }

        newFeaturedImageUrl = null;
        newFeaturedImagePublicId = null;
        dto.featuredUntil = null;
      }

      // Prepare update data
      const updateData = {
        isFeatured: dto.isFeatured,
        isHighlighted: dto.isHighlighted,
        isUniqueStays: dto.isUniqueStays,
        featuredImageUrl: newFeaturedImageUrl,
        featuredImagePublicId: newFeaturedImagePublicId,
        featuredUntil: dto.featuredUntil
          ? new Date(dto.featuredUntil):null,
      };

      // Update in DB
      return await hotelRepository.updatePromotions(id, updateData);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        err.message,
        "PromotionUpdateError"
      );
    }
  }

  async deleteHotel(id: string) {
    try {
      // 1. Fetch hotel with images to get public_ids
      const hotel = await hotelRepository.getHotelById(id);
      if (!hotel) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Hotel with id ${id} not found`,
          "HotelNotFoundError"
        );
      }

      console.log(hotel.images);
      // 2. Delete all images from Cloudinary
      for (const img of hotel.images) {
        try {
          if (img.public_id) {
            await deleteFromCloudinary(img.public_id);
          }
        } catch (err) {
          console.warn(
            `Failed to delete image from Cloudinary: ${img.url}`,
            err
          );
        }
      }

      // 3. Soft delete hotel (isActive = false) and mark images as inactive
      const deletedHotel = await hotelRepository.softDeleteHotel(id);
      return deletedHotel;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Hotel with id ${id} not found or could not be deleted`,
        "HotelDeletionError"
      );
    }
  }

  async validateActiveHotel(hotelId: string) {
    const hotel = await hotelRepository.getHotelById(hotelId);

    if (!hotel) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Hotel not found or inactive",
        "ValidationError"
      );
    }

    return hotel; // useful later if needed
  }
}

const hotelService = new HotelService();

export class HotelBookingService {
  async createHotelBooking(dto: HotelBookingDTO) {
    try {
      // ✅ Validate hotel (ACTIVE only)
      await hotelService.validateActiveHotel(dto.hotelId);

      // Validate user only if provided
      if (dto.userId) {
        await userService.validateUserId(dto.userId);
      }

      return await hotelBookingRepository.create({
        first_name: dto.firstName,
        last_name: dto.lastName,
        email: dto.email,
        phone_number: dto.phoneNumber,
        check_in: new Date(dto.checkIn),
        check_out: new Date(dto.checkOut),
        adults: Number(dto.adults),
        kids: Number(dto.kids ?? 0),

        hotel: { connect: { id: dto.hotelId } },

        ...(dto.userId && {
          user: { connect: { id: dto.userId } },
        }),
      });
    } catch (err: any) {
      if (err instanceof ApiError) throw err;

      throw new ApiError(
        500,
        `Database error while creating hotel booking: ${err.message}`,
        "DatabaseError"
      );
    }
  }

  async getHotelRequests(dto: HotelRequestSearchDto) {
    const pageNumber = dto.pageNumber ?? 1;
    const pageSize = dto.pageSize ?? 10;

    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    const { requests, totalRecords } =
      await hotelBookingRepository.getHotelRequests(dto, skip, take);

    const data = requests.map((req: any) => ({
      id: req.id,
      status: req.status,
      createdAt: req.created_at,
      hotelName: req.hotel.name,
      pricePerNight: req.hotel.pricePerNight,
      location: req.hotel.location,
      image: req.hotel.images?.[0] ?? null,
      name: `${req.first_name} ${req.last_name}`.trim(),
      email: req.email,
      phone: req.phone_number,
      checkIn: req.check_in,
      checkOut: req.check_out,
      adults: req.adults,
      kids: req.kids,
    }));

    return {
      data,
      pagination: {
        currentPage: pageNumber,
        pageSize,
        totalRecords,
        totalPages: Math.ceil(totalRecords / pageSize),
        hasMore: pageNumber * pageSize < totalRecords,
      },
    };
  }

  async updateHotelBookingStatus(bookingId: string, data: { status: string }) {
    try {
      return await hotelBookingRepository.updateBookingStatus(
        bookingId,
        data.status
      );
    } catch (err: any) {
      // 🔹 Prisma "record not found"
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Hotel booking not found",
            "BookingNotFound"
          );
        }
      }

      throw err;
    }
  }
}
