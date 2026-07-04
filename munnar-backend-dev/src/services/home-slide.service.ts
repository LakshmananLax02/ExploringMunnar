// home-slide.service.ts
import { StatusCodes } from "http-status-codes";
import { CreateHomeSlideDto } from "../dto/home-slide.dto";
import { HomeSlideRepository } from "../repositories/home-slide.repository";
import { ApiError } from "../utils/api-error";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary-upload";

const homeSlideRepo = new HomeSlideRepository();

export class HomeSlideService {
  async createSlide(dto: CreateHomeSlideDto, file?: Express.Multer.File) {
    if (!file) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "An image is required to create a slide",
        "ValidationError"
      );
    }

    try {
      const uploaded = await uploadToCloudinary(file.buffer, "home-slides");

      return await homeSlideRepo.create({
        imageUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        title: dto.title,
        subtitle: dto.subtitle,
        position: dto.position ?? 0,
      });
    } catch (err: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating home slide: ${err.message}`,
        "HomeSlideCreationError"
      );
    }
  }

  async getSlides() {
    return await homeSlideRepo.findAll();
  }

  async deleteSlide(id: string): Promise<void> {
    const slide = await homeSlideRepo.findById(id);

    if (!slide) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Slide not found",
        "HomeSlideNotFound"
      );
    }

    // Idempotent: already removed → treat as success
    if (!slide.is_active) {
      return;
    }

    if (slide.publicId) {
      await deleteFromCloudinary(slide.publicId);
    }

    await homeSlideRepo.softDelete(id);
  }
}
