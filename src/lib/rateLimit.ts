// In-memory sliding window Rate Limiter for serverless API routes

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale IP records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    ipMap.forEach((value, key) => {
      if (now > value.resetTime) {
        ipMap.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Checks if a given identifier (e.g., client IP) exceeds the maximum allowed requests in the time window.
 * @param identifier Client IP or token
 * @param limit Max allowed requests within the window
 * @param windowMs Time window in milliseconds (default 60 seconds)
 * @returns { success: boolean, remaining: number, reset: number }
 */
export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const record = ipMap.get(identifier);

  if (!record || now > record.resetTime) {
    ipMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, reset: record.resetTime };
}

export const checkRateLimit = rateLimit;

/**
 * Extracts client IP from request headers (NextRequest or standard Request)
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
