import { prisma } from "../prisma-client";

export class PasswordResetRepository {
  async create(userId: number, tokenHash: string, expiresAt: Date) {
    return prisma.passwordReset.create({
      data: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    });
  }

  async findValid(userId: number, tokenHash: string) {
    return prisma.passwordReset.findFirst({
      where: {
        user_id: userId,
        token_hash: tokenHash,
        expires_at: {
          gt: new Date(),
        },
      },
    });
  }

  async findValidToken(tokenHash: string) {
    return prisma.passwordReset.findFirst({
      where: {
        token_hash: tokenHash,
        expires_at: {
          gt: new Date(),
        },
      },
    });
  }

  async deleteAll(userId: number) {
    return prisma.passwordReset.deleteMany({
      where: { user_id: userId },
    });
  }
}
