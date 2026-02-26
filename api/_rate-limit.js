// Simple in-memory rate limiter for Vercel serverless functions
// Uses a sliding window counter per IP address

const store = new Map();

const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now - entry.windowStart > entry.windowMs * 2) {
      store.delete(key);
    }
  }
}

/**
 * @param {object} req - Vercel request object
 * @param {object} res - Vercel response object
 * @param {object} opts
 * @param {number} opts.limit - Max requests per window
 * @param {number} opts.windowMs - Window duration in ms (default: 60000)
 * @returns {boolean} true if request is allowed, false if rate limited (response already sent)
 */
export default function rateLimit(req, res, { limit = 20, windowMs = 60_000 } = {}) {
  cleanup();

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.headers["x-real-ip"]
    || req.socket?.remoteAddress
    || "unknown";

  const key = `${ip}:${req.url?.split("?")[0] || "/"}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry || now - entry.windowStart > windowMs) {
    entry = { count: 0, windowStart: now, windowMs };
    store.set(key, entry);
  }

  entry.count++;

  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - entry.count)));

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
    res.setHeader("Retry-After", String(retryAfter));
    res.status(429).json({ error: "Too many requests. Please try again later." });
    return false;
  }

  return true;
}
