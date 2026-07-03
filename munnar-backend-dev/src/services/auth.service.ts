import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { user } from "@prisma/client";
import { GoogleAuthResult } from "../dto/auth.dto";
import admin from "../lib/firebaseAdmin";
import bcrypt from "bcryptjs";

const userRepo = new UserRepository();

export const googleAuthService = async (
  idToken: string,
): Promise<GoogleAuthResult> => {
  // 1. Verify Firebase token
  const decoded = await admin.auth().verifyIdToken(idToken);

  const email = decoded.email;
  const name = decoded.name || "User";
  const googleUid = decoded.uid;

  if (!email) {
    throw new Error("Email not found in Google token");
  }

  // 2. DB check
  let user: user | null = await userRepo.findUserByEmail(email);

  if (!user) {
    user = await userRepo.createUser(email, name, googleUid);
  } else if (!user.google_id) {
    // ✅ EMAIL → GOOGLE ACCOUNT LINKING
    user = await userRepo.linkGoogleAccount({
      userId: user.id,
      googleId: googleUid,
    });
  }

  // 3. Generate YOUR JWT
  const appToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  return {
    token: appToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const emailSignupService = async (
  name: string,
  email: string,
  password: string,
  phoneNumber?: string
) => {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await userRepo.createEmailUser(
    name,
    email,
    passwordHash,
    phoneNumber
  );

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const emailLoginService = async (
  email: string,
  password: string
) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user || !user.password_hash) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};