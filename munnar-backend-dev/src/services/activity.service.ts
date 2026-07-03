import { CreateActivityDto } from "../dto/activity.dto";
import { ApiError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary-upload";
import { ActivityRepository } from "../repositories/activity.repository";

const activityRepository = new ActivityRepository();

export class ActivityService {
  async createActivity(dto: CreateActivityDto, files: Express.Multer.File[]) {
    try {
      // --------------------------------------------
      // 1. Upload images to Cloudinary
      // --------------------------------------------
      const uploadPromises =
        files && files.length > 0
          ? files.map((file) => uploadToCloudinary(file.buffer, "activities"))
          : [];

      const uploadedImages =
        uploadPromises.length > 0 ? await Promise.all(uploadPromises) : [];

      const imageUrls = uploadedImages.map((img: any) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));

      // --------------------------------------------
      // 2. Prepare Activity Data (Prisma)
      // --------------------------------------------
      const activityData = {
        name: dto.name,
        short_description: dto.short_description,
        description: dto.description,
        price: dto.price ? dto.price : null,

        category: dto.category || null,
        type: dto.type || null,

        address: dto.address,
        location_url: dto.locationURL ? dto.locationURL : null,

        is_featured: dto.is_featured ?? false,
        is_active: true,

        // images (connect to activity_image table)
        images: {
          create: imageUrls.map((img) => ({
            url: img.url,
            alt_text: dto.name,
            is_active: true,
            public_id: img.public_id,
          })),
        },
      };

      // --------------------------------------------
      // 4. Save in Database
      // --------------------------------------------
      const activity = await activityRepository.createActivity(activityData);
      return activity;
    } catch (err: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        err.message,
        "ActivityCreationError"
      );
    }
  }

  async getActivitiesList(filters: any) {
    try {
      const { pageNumber = 1 } = filters;
      const take = 10;
      const skip = (pageNumber - 1) * take;

      const { activities, totalRecords } =
        await activityRepository.getActivitiesList(filters, skip, take);

      return {
        activities,
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / take),
      };
    } catch (err: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        err.message,
        "ActivityFetchError"
      );
    }
  }

  async deleteActivity(id: string) {
    try {
      // 1. Fetch activity with images to get public_ids
      const activity = await activityRepository.getActivityById(id);
      if (!activity) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Activity with id ${id} not found`,
          "ActivityNotFoundError"
        );
      }

      // 2. Delete all images from Cloudinary
      for (const img of activity.images) {
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

      // 3. Soft delete activity (is_active = false) and mark images as inactive
      const deletedActivity = await activityRepository.softDeleteActivity(id);
      return deletedActivity;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Activity with id ${id} not found or could not be deleted`,
        "ActivityDeletionError"
      );
    }
  }

  async editActivity(
    id: string,
    dto: CreateActivityDto,
    files: Express.Multer.File[]
  ) {
    try {
      // 1. Fetch existing activity with images
      const existingActivity = await activityRepository.getActivityById(id);
      if (!existingActivity) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Activity with id ${id} not found`,
          "ActivityNotFoundError"
        );
      }

      // 2. Delete images specified in deletedImages from Cloudinary
      const deletedImageIds = dto.deletedImages || [];
      const imagesToDelete = existingActivity.images.filter((img: any) =>
        deletedImageIds.includes(img.id)
      );

      for (const img of imagesToDelete) {
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

      // 3. Upload new images to Cloudinary
      const uploadPromises =
        files && files.length > 0
          ? files.map((file) => uploadToCloudinary(file.buffer, "activities"))
          : [];

      const uploadedImages =
        uploadPromises.length > 0 ? await Promise.all(uploadPromises) : [];

      const newImageUrls = uploadedImages.map((img: any) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));

      // 4. Prepare activity update data
      const activityData = {
        name: dto.name,
        short_description: dto.short_description,
        description: dto.description,
        price: dto.price ? dto.price : null,
        category: dto.category || null,
        type: dto.type || null,
        address: dto.address,
        location_url: dto.locationURL ? dto.locationURL : null,
        is_featured: dto.is_featured ?? false,
      };

      // 5. Update activity and sync images
      const updatedActivity = await activityRepository.editActivity(
        id,
        activityData,
        newImageUrls,
        deletedImageIds
      );

      return updatedActivity;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        err.message,
        "ActivityEditError"
      );
    }
  }

  async getActivityById(id: string) {
    const activity = await activityRepository.getActivityById(id);

    if (!activity) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Activity with id ${id} not found`,
        "ActivityNotFoundError"
      );
    }

    return activity;
  }
}
