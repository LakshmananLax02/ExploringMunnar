import { Router } from "express";
import {
  emailLoginController,
  emailSignupController,
  googleLoginController,
} from "../controllers/auth.controller";
import { sendEmailOtpController, verifyEmailOtpController } from "../controllers/email.controller";
import { forgotPasswordController, resetPasswordController } from "../controllers/password.controller";

const authRouter = Router();

authRouter.post("/google", googleLoginController);
authRouter.post("/signup", emailSignupController);
authRouter.post("/login", emailLoginController);

authRouter.post("/email/send-otp", sendEmailOtpController);
authRouter.post("/email/verify", verifyEmailOtpController);

authRouter.post("/forgot-password", forgotPasswordController);
authRouter.post("/reset-password", resetPasswordController);

export default authRouter;
