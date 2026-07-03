import "reflect-metadata";
import { app } from "./app";
import { prisma } from "./prisma-client";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected via Prisma");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();
