import { Request, Response } from "express";
import { emailLoginService, emailSignupService, googleAuthService } from "../services/auth.service";

export const googleLoginController = async (
  req: Request,
  res: Response
) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    const result = await googleAuthService(idToken);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Google login error:", error.message);
    return res.status(401).json({ message: "Authentication failed" });
  }
};


export const emailSignupController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const result = await emailSignupService(
      name,
      email,
      password,
      phoneNumber
    );

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const emailLoginController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const result = await emailLoginService(email, password);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};