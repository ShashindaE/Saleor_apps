import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Ensure Redis instance is created only if env vars are present
const redis =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        })
        : null;

/**
 * Global Rate Limiter for Notify Events
 * Limit: 3 requests per 10 seconds per identifier
 */
export const notifyRateLimiter = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(3, "10 s"),
        analytics: true,
        prefix: "@upstash/ratelimit",
    })
    : null;
