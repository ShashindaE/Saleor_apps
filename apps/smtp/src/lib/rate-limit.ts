import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Ensure Redis instance is created only if env vars are present
const redis =
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? new Redis({
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            url: process.env.UPSTASH_REDIS_REST_URL,
            // eslint-disable-next-line turbo/no-undeclared-env-vars
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
