import { NewsDTO } from "../dto/news.dto";
import { NewsRepository } from "../repositories/news.repository";
import { ApiError } from "../utils/api-error";
import { StatusCodes } from "http-status-codes";
import { uploadToCloudinary } from "../utils/cloudinary-upload";

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
}
