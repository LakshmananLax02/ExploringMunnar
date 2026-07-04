import cron from "node-cron";
import { NewsService } from "../services/news.service";

const newsService = new NewsService();

async function runNewsExpiryCleanup() {
  try {
    const deletedCount = await newsService.purgeExpiredNews();
    if (deletedCount > 0) {
      console.log(`🗑️  News expiry job: deleted ${deletedCount} expired news item(s)`);
    }
  } catch (err) {
    console.error("❌ News expiry job failed:", err);
  }
}

/**
 * Starts the recurring cleanup that hard-deletes news past its
 * expirationDate. Runs once immediately (to catch anything that expired
 * while the server was offline), then every hour on the hour.
 */
export function startNewsExpiryJob() {
  runNewsExpiryCleanup();

  cron.schedule("0 * * * *", runNewsExpiryCleanup);

  console.log("🕐 News expiry job scheduled (runs hourly)");
}
