interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

// In-memory fallback for when Upstash is not configured
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

function inMemoryRateLimit(ip: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = inMemoryStore.get(ip);

  if (!entry || now > entry.resetAt) {
    inMemoryStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, reset: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, reset: entry.resetAt };
}

// Periodic cleanup of in-memory store to prevent unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of Array.from(inMemoryStore.entries())) {
    if (now > value.resetAt) inMemoryStore.delete(key);
  }
}, 60_000);

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const limit = 5;
  const windowMs = 60 * 60 * 1000; // 1 hour

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    return inMemoryRateLimit(ip, limit, windowMs);
  }

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({ url: upstashUrl, token: upstashToken });
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, "1 h"),
      prefix: "regret-simulator",
    });

    const result = await ratelimit.limit(ip);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    // If Upstash fails, fall back to in-memory
    return inMemoryRateLimit(ip, limit, windowMs);
  }
}
