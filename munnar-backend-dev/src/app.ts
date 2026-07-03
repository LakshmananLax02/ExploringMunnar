import express from "express";
import cors from "cors";
import { router, userRouter } from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler";
import authRouter from "./routes/auth.routes";

const app = express();

// CORS configuration
app.use(cors({
  // origin: ["http://localhost:3000", "https://your-frontend.vercel.app"], // add dev + prod URLs
  origin: "*", // allow all origins (change in production)
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  credentials: true, // if you send cookies/auth
}));

app.use(express.json());

// Register routes
app.use("/api", router);
app.use("/api", userRouter);
app.use("/auth", authRouter);

// Global error handler (keep at the end)
app.use(errorHandler);

export { app };
