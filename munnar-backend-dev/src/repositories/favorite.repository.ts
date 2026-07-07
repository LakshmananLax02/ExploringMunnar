import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FavoriteRepository {
  // 💡 Changed hotelId type signature to string
  async toggle(userId: number, hotelId: string) {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_hotelId: { userId, hotelId }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_hotelId: { userId, hotelId }
        }
      });
      return { favorited: false, message: "Removed from favorites" };
    }

    const newFavorite = await prisma.favorite.create({
      data: { userId, hotelId }
    });
    
    return { favorited: true, data: newFavorite, message: "Added to favorites" };
  }

  async getByUserId(userId: number) {
    return await prisma.favorite.findMany({
      where: { userId }
    });
  }
}