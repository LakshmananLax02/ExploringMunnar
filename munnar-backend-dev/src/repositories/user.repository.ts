import { AuthProvider, user } from "@prisma/client";
import { prisma } from "../prisma-client";

export class UserRepository {
  async exists(id: number): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!user;
  }

  async findUserByEmail(email: string): Promise<user | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(
    email: string,
    name: string,
    googleId: string,
  ): Promise<user> {
    return prisma.user.create({
      data: {
        email,
        name,
        google_id: googleId,
        auth_provider: AuthProvider.GOOGLE,
        email_verified: true,
        is_active: true,
      },
    });
  }

  async linkGoogleAccount(data: {
    userId: number;
    googleId: string;
  }): Promise<user> {
    return prisma.user.update({
      where: { id: data.userId },
      data: {
        google_id: data.googleId,
        auth_provider: AuthProvider.GOOGLE,
        email_verified: true,
      },
    });
  }

  async createEmailUser(
    name: string,
    email: string,
    passwordHash: string,
    phoneNumber?: string,
  ): Promise<user> {
    return prisma.user.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        phone: phoneNumber,
        auth_provider: AuthProvider.EMAIL,
        email_verified: false,
        is_active: true,
      },
    });
  }

  async verifyEmail(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { email_verified: true },
    });
  }

  async updatePassword(userId: number, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password_hash: passwordHash },
    });
  }
}
