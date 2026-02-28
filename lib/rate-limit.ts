type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitRecord>();

export function checkRateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const { key, limit, windowMs } = options;

  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    const next: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs
    };
    store.set(key, next);
    return {
      allowed: true,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000)
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
  };
}

export function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") || "unknown";
}
