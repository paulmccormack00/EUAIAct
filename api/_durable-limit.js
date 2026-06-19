// Durable, session-aware rate limiting for the chat proxy.
//
// The in-memory limiter (./_rate-limit.js) resets on every cold start and is
// per-instance, so on Vercel it does not actually bound abuse. This module uses
// Upstash Redis (REST API) so limits hold across instances and restarts —
// turning /api/chat from an open Gemini relay into a properly bounded endpoint.
//
// Configure in Vercel with:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// If those are absent, hasDurableStore is false and the caller falls back to the
// in-memory limiter (best-effort) so the endpoint keeps working.

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const hasDurableStore = Boolean(REST_URL && REST_TOKEN);

// Tunable ceilings. Generous enough for genuine research use, tight enough that
// the endpoint can't be farmed as a free LLM relay.
const IP_PER_MIN = 20;
const IP_PER_DAY = 200;
const SESSION_PER_DAY = 40;

/**
 * Atomically increments per-IP (minute + day) and per-session (day) counters in
 * Redis and checks them against the ceilings above.
 * @returns {Promise<{ok: boolean, durable: boolean, status?: number, retryAfter?: number, error?: string}>}
 */
export async function checkChatLimits({ ip, sessionId }) {
  if (!hasDurableStore) return { ok: true, durable: false };

  const ipMin = `rl:ip:min:${ip}`;
  const ipDay = `rl:ip:day:${ip}`;
  const cmds = [
    ["INCR", ipMin], ["EXPIRE", ipMin, 60],
    ["INCR", ipDay], ["EXPIRE", ipDay, 86400],
  ];
  let sessIdx = -1;
  if (sessionId) {
    const sessDay = `rl:sess:day:${sessionId}`;
    sessIdx = cmds.length;
    cmds.push(["INCR", sessDay], ["EXPIRE", sessDay, 86400]);
  }

  let results;
  try {
    const resp = await fetch(`${REST_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmds),
    });
    if (!resp.ok) throw new Error(`upstash ${resp.status}`);
    results = await resp.json();
  } catch (e) {
    // Fail open on store errors — availability over strictness. The caller's
    // in-memory limiter still applies as a backstop.
    console.error("Durable rate-limit unavailable, allowing request:", e.message || e);
    return { ok: true, durable: false, error: String(e.message || e) };
  }

  const ipMinCount = results[0]?.result ?? 0;
  const ipDayCount = results[2]?.result ?? 0;
  const sessCount = sessIdx >= 0 ? (results[sessIdx]?.result ?? 0) : 0;

  if (ipMinCount > IP_PER_MIN) return { ok: false, durable: true, status: 429, retryAfter: 60, error: "Too many requests. Please slow down and try again in a minute." };
  if (ipDayCount > IP_PER_DAY) return { ok: false, durable: true, status: 429, retryAfter: 3600, error: "Daily request limit reached. Please try again tomorrow." };
  if (sessCount > SESSION_PER_DAY) return { ok: false, durable: true, status: 429, retryAfter: 3600, error: "You've reached the daily question limit for this session." };

  return { ok: true, durable: true };
}
