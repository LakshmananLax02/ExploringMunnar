import { Request, Response } from "express";
import { sendEmailOtpService, verifyEmailOtpService } from "../services/email.service";

export const sendEmailOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await sendEmailOtpService(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyEmailOtpController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyEmailOtpService(email, otp);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
