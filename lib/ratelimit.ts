import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Fallback in-memory rate limiter cache
const ipCache = new Map<string, number[]>();

function inMemoryRateLimit(ip: string, limit = 5, windowMs = 60 * 1000): boolean {
  const now = Date.now();

  // Self-cleaning sweep to prevent memory leaks (runs with 5% chance per request check)
  if (Math.random() < 0.05) {
    for (const [key, timestamps] of ipCache.entries()) {
      const active = timestamps.filter((t) => now - t < windowMs);
      if (active.length === 0) {
        ipCache.delete(key);
      } else {
        ipCache.set(key, active);
      }
    }
  }

  const timestamps = ipCache.get(ip) || [];
  const activeTimestamps = timestamps.filter((t) => now - t < windowMs);
  
  if (activeTimestamps.length >= limit) {
    return true;
  }
  
  activeTimestamps.push(now);
  ipCache.set(ip, activeTimestamps);
  return false;
}

let redisInstance: Redis | null = null;

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (redisUrl && redisToken) {
  try {
    redisInstance = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  } catch (error) {
    console.warn("Failed to initialize Upstash Redis. Falling back to in-memory rate limiting.", error);
  }
} else {
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL: Upstash Redis not configured. In-memory fallback rate limiting is active but is highly ineffective in serverless environments.");
  }
}

const ratelimiters = new Map<string, Ratelimit>();

export async function isRateLimited(
  ip: string,
  limit = 5,
  windowMs = 60 * 1000,
  actionKey = "default"
): Promise<boolean> {
  if (!redisInstance) {
    return inMemoryRateLimit(`${actionKey}:${ip}`, limit, windowMs);
  }

  try {
    const windowSeconds = Math.max(1, Math.round(windowMs / 1000));
    const cacheKey = `${limit}_${windowSeconds}_${actionKey}`;
    
    let limiter = ratelimiters.get(cacheKey);
    if (!limiter) {
      limiter = new Ratelimit({
        redis: redisInstance,
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        prefix: `@upstash/ratelimit:${actionKey}`,
      });
      ratelimiters.set(cacheKey, limiter);
    }

    const { success } = await limiter.limit(ip);
    return !success;
  } catch (error) {
    console.error("Upstash Rate Limiting error, falling back to in-memory:", error);
    return inMemoryRateLimit(`${actionKey}:${ip}`, limit, windowMs);
  }
}
