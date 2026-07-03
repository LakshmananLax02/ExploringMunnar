// attraction.service.ts
import { StatusCodes } from "http-status-codes";
import { AttractionDTO } from "../dto/attraction.dto";
import { AttractionRepository } from "../repositories/attraction.repository";
import { ApiError } from "../utils/api-error";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary-upload";

const attractionRepo = new AttractionRepository();

export class AttractionService {
  async createAttraction(
  dto: AttractionDTO,
  file?: Express.Multer.File
) {
  try {
    let imageUrl: string | null = null;
    let publicId: string | null = null;

    if (file) {
      const uploaded = await uploadToCloudinary(file.buffer, "attractions");
      imageUrl = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    return await attractionRepo.create({
      route: dto.route,
      description: dto.description,
      spot_name: dto.spotName,
      image_url: imageUrl,
      public_id: publicId,
    });
  } catch (err: any) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Error creating attraction: ${err.message}`,
      "AttractionCreationError"
    );
  }
}

  async getAttractions(filters: { route?: string }) {
    return await attractionRepo.findAll(filters);
  }

  async deleteAttraction(attractionId: string): Promise<void> {
    const attraction = await attractionRepo.findById(attractionId);

    // ❌ ID not present in DB → 404
    if (!attraction) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Attraction not found",
        "AttractionNotFound"
      );
    }

    // ✅ Idempotent behavior
    // If already inactive → return success
    if (!attraction.is_active) {
      return;
    }

    if (attraction.public_id) {
      // 1. Delete image from Cloudinary
      await deleteFromCloudinary(attraction.public_id);
    }

    // Soft delete
    await attractionRepo.softDelete(attractionId);
  }
}
