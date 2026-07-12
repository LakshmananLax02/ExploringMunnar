import { Request, Response, NextFunction } from "express";
import { ReviewRepository } from "../repositories/review.repository";

const reviewRepository = new ReviewRepository();

interface AuthenticatedRequest extends Request {
  user?: {
    id?: number | string;
    userId?: number | string;
    username?: string;
    role?: string;
  };
}

export class ReviewController {
  // User route (still handles mock user credentials for username tracking)
  async submitReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const rawUserId = req.user?.id || req.user?.userId || 1;
      const username = req.user?.username || "Ashok Kumar"; // Falls back gracefully

      const userId = parseInt(String(rawUserId), 10);
      const result = await reviewRepository.create(userId, username, req.body);

      return res.status(201).json({
        success: true,
        message: "Review posted successfully!",
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  // Public Route
  async getHotelReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { hotelId } = req.params;
      const reviews = await reviewRepository.findByHotelId(hotelId);
      return res.status(200).json({ success: true, data: reviews });
    } catch (err) {
      next(err);
    }
  }

  // 💡 ADMIN BYPASS: Fetches all reviews instantly without authorization checks
  async adminGetAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await reviewRepository.findAllAdmin();
      return res.status(200).json({ success: true, data: reviews });
    } catch (err) {
      next(err);
    }
  }

  // 💡 ADMIN BYPASS: Deletes any review directly via ID path string
  async adminDeleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const check = await reviewRepository.findById(id);
      if (!check) {
        return res.status(404).json({ success: false, message: "Review record not found" });
      }

      await reviewRepository.delete(id);
      return res.status(200).json({ success: true, message: "Review cleared by administrator successfully" });
    } catch (err) {
      next(err);
    }
  }
}