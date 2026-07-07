import { Request, Response, NextFunction } from 'express';
import { FavoriteRepository } from '../repositories/favorite.repository';

const favoriteRepository = new FavoriteRepository();

// Custom interface to bypass TypeScript request context errors securely
interface AuthenticatedRequest extends Request {
  user?: {
    id?: number | string;
    userId?: number | string;
    _id?: number | string;
    [key: string]: any;
  };
}

export class FavoriteController {
  async toggleSave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const rawUserId = req.user?.id || req.user?.userId || req.user?._id;
      const { hotelId } = req.body; // This is now your string UUID

      if (!rawUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized auth context" });
      }

      const userId = parseInt(String(rawUserId), 10);
      
      // 💡 REMOVED parseInt from targetHotelId. Keep it as a pure string text value.
      const targetHotelId = String(hotelId).trim();

      const result = await favoriteRepository.toggle(userId, targetHotelId);
      return res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getFavorites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const rawUserId = req.user?.id || req.user?.userId || req.user?._id;

      if (!rawUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized auth context" });
      }

      const userId = parseInt(String(rawUserId), 10);
      const favorites = await favoriteRepository.getByUserId(userId);
      
      return res.status(200).json({ success: true, data: favorites });
    } catch (err) {
      next(err);
    }
  }
}