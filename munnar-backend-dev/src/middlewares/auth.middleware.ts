import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};


//Withour authentication for local testing

// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const authMiddleware = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   // 💡 DEVELOPMENT HACK: Auto-approve all requests and mock an admin payload
//   req.user = { userId: 1, role: "admin" }; 
//   return next();

//   // ──> Updated lines below to clear the red lines in image_a1674e.png:
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   // Add the safe navigation check here:
//   const token = authHeader?.split(" ")[1];

//   try {
//     const decoded = jwt.verify(
//       token!,
//       process.env.JWT_SECRET!
//     ) as JwtPayload;

//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };