import crypto from "crypto";
import { UserRepository } from "../repositories/user.repository";
import { sendPasswordResetEmail } from "../utils/mailer";
import { PasswordResetRepository } from "../repositories/password.repository";
import bcrypt from "bcryptjs";

const userRepo = new UserRepository();
const resetRepo = new PasswordResetRepository();

export const forgotPasswordService = async (email: string) => {
  const user = await userRepo.findUserByEmail(email);

  // SECURITY: Always return success
  if (!user) {
    return { message: "If the email exists, a reset link has been sent." };
  }

  // Generate token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  // Expiry (15 mins)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // Remove old tokens
  await resetRepo.deleteAll(user.id);

  // Store new token
  await resetRepo.create(user.id, tokenHash, expiresAt);

  // Send email
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail(user.email, resetLink);

  return { message: "If the email exists, a reset link has been sent." };
};

export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  // Hash incoming token
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Find valid token via repository
  const resetRecord = await resetRepo.findValidToken(tokenHash);

  if (!resetRecord) {
    throw new Error("Invalid or expired reset token");
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Update user password via repository
  await userRepo.updatePassword(resetRecord.user_id, passwordHash);

  // Cleanup tokens
  await resetRepo.deleteAll(resetRecord.user_id);

  return { message: "Password reset successful" };
};