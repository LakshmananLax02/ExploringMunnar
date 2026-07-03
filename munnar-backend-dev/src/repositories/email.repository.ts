import { prisma } from "../prisma-client";

export class EmailVerificationRepository {
  async createOtp(
    userId: number,
    otpHash: string,
    expiresAt: Date
  ) {
    return prisma.emailVerification.create({
      data: {
        user_id: userId,
        otp_hash: otpHash,
        expires_at: expiresAt,
      },
    });
  }

  async findLatestOtp(userId: number) {
    return prisma.emailVerification.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
  }

  async deleteAll(userId: number) {
    return prisma.emailVerification.deleteMany({
      where: { user_id: userId },
    });
  }
}
