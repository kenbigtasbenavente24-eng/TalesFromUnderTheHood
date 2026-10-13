import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// 5 messages per 10 minutes per visitor. Adjust to taste.
const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "anon-messages",
});

export async function isRateLimited(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const key = createHash("sha256")
      .update(ip + process.env.RATE_LIMIT_SALT)
      .digest("hex");
    const { success } = await limiter.limit(key);
    return !success;
  } catch (err) {
    // If Redis is down, let messages through rather than blocking everyone.
    console.error("Rate limit check failed:", err);
    return false;
  }
}