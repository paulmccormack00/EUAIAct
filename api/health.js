// /api/health.js — lightweight health check.
// Reports which rate limiter is active and whether Upstash Redis is reachable.
// Does NOT call Gemini and does NOT leak the URL or token.
import rateLimit from "./_rate-limit.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!rateLimit(req, res, { limit: 30, windowMs: 60_000 })) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const upstashConfigured = Boolean(url && token);

  const out = {
    ok: true,
    time: new Date().toISOString(),
    rateLimiter: upstashConfigured ? "durable (upstash)" : "in-memory (fallback)",
    upstashConfigured,
    upstash: null,
  };

  if (upstashConfigured) {
    const t0 = Date.now();
    try {
      const r = await fetch(`${url}/ping`, { headers: { Authorization: `Bearer ${token}` } });
      const body = await r.json().catch(() => ({}));
      const reachable = r.ok && body.result === "PONG";
      out.upstash = { reachable, status: r.status, latencyMs: Date.now() - t0 };
      if (!reachable) out.ok = false;
    } catch (e) {
      out.upstash = { reachable: false, error: String(e.message || e) };
      out.ok = false;
    }
  }

  return res.status(out.ok ? 200 : 503).json(out);
}
