import { NewsDTO } from "../dto/news.dto";
import { NewsRepository } from "../repositories/news.repository";
import { ApiError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary-upload";

const newsRepo = new NewsRepository();

export class NewsService {
  async createNews(dto: NewsDTO, file?: Express.Multer.File) {
    try {
      let imageUrl: string | null = null;
      let publicId: string | null = null;

      // ✅ Upload image if present
      if (file) {
        const uploaded = await uploadToCloudinary(file.buffer, "news");
        imageUrl = uploaded.secure_url;
        publicId= uploaded.public_id;
      }

      // ✅ Save news entry
      return await newsRepo.create({
        category: dto.category,
        heading: dto.heading,
        detail: dto.detail,
        imageUrl,
        publicId,
        expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
      });
    } catch (err: any) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating news: ${err.message}`,
        "NewsCreationError"
      );
    }
  }

  async getRecentNews(filters: {
    categories?: string[];
    search?: string;
    isNotExpired?: boolean;
  }) {
    return await newsRepo.getRecentNews(filters);
  }

  async deleteNews(newsId: number) {
    return await newsRepo.deleteNews(newsId);
  }

  /**
   * Hard-deletes news whose expirationDate has passed, cleaning up
   * their Cloudinary images first. Called on a schedule (see src/jobs).
   */
  async purgeExpiredNews(): Promise<number> {
    const expired = await newsRepo.findExpiredNews();
    if (expired.length === 0) return 0;

    for (const item of expired) {
      if (item.publicId) {
        try {
          await deleteFromCloudinary(item.publicId);
        } catch (err) {
          console.warn(
            `Failed to delete Cloudinary image for expired news ${item.id}:`,
            err
          );
        }
      }
    }

    return await newsRepo.deleteExpiredNews(expired.map((n) => n.id));
  }
}
