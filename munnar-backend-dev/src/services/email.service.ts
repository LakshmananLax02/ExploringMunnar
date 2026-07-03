import crypto from "crypto";
import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { sendVerificationEmail } from "../utils/mailer";
import { EmailVerificationRepository } from "../repositories/email.repository";

const userRepo = new UserRepository();
const otpRepo = new EmailVerificationRepository();

export const sendEmailOtpService = async (email: string) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error("User not found");

  if (user.email_verified) {
    throw new Error("Email already verified");
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await otpRepo.deleteAll(user.id);
  await otpRepo.createOtp(user.id, otpHash, expiresAt);

  await sendVerificationEmail(email, otp);

  return { message: "OTP sent to email" };
};

export const verifyEmailOtpService = async (email: string, otp: string) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error("User not found");

  const record = await otpRepo.findLatestOtp(user.id);
  if (!record) throw new Error("OTP not found");

  if (record.expires_at < new Date()) {
    throw new Error("OTP expired");
  }

  const isValid = await bcrypt.compare(otp, record.otp_hash);
  if (!isValid) throw new Error("Invalid OTP");

  await otpRepo.deleteAll(user.id);

  await userRepo.verifyEmail(user.id);

  return { message: "Email verified successfully" };
};
