// Shared, framework-agnostic analytics beacon for the cross-app metrics dashboard.
// Copy this file into each app (EUAI: src/lib/metrics.js, Wadira: src/lib/metrics.js,
// Raksa: src/lib/metrics.js) and call initMetrics({ url, key, app }) once at startup
// with that app's env values:
//   Vite  apps:  import.meta.env.VITE_METRICS_URL / VITE_METRICS_KEY
//   Next  apps:  process.env.NEXT_PUBLIC_METRICS_URL / NEXT_PUBLIC_METRICS_KEY
//
// It inserts events directly into the metrics Supabase project (anon key,
// insert-only RLS). If url/key are absent it no-ops, so it's safe to ship before
// the metrics store is configured.

let CONFIG = null; // { url, key, app }
let SESSION = "";

function sessionId() {
  if (SESSION) return SESSION;
  try {
    const k = "_m_sid";
    SESSION = sessionStorage.getItem(k) || "";
    if (!SESSION) {
      SESSION = "s_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
      sessionStorage.setItem(k, SESSION);
    }
  } catch {
    SESSION = SESSION || "s_anon";
  }
  return SESSION;
}

/**
 * Send one event. Fire-and-forget; never throws into the host app.
 * @param {string} type  view | click | download | signup | chat | other
 * @param {object} [meta]
 */
export function track(type, meta) {
  if (!CONFIG || typeof window === "undefined") return;
  let path = "", referrer = "";
  try { path = location.pathname + location.search; referrer = document.referrer || ""; } catch { /* noop */ }

  const body = JSON.stringify({
    app: CONFIG.app,
    type,
    path: path.slice(0, 512),
    referrer: referrer.slice(0, 512),
    session: sessionId(),
    meta: meta && typeof meta === "object" ? meta : null,
  });
  const endpoint = `${CONFIG.url.replace(/\/$/, "")}/rest/v1/events`;
  const headers = {
    "Content-Type": "application/json",
    apikey: CONFIG.key,
    Authorization: `Bearer ${CONFIG.key}`,
    Prefer: "return=minimal",
  };

  try {
    // Prefer fetch with keepalive so it survives navigation; sendBeacon can't set headers.
    fetch(endpoint, { method: "POST", headers, body, keepalive: true, mode: "cors" }).catch(() => {});
  } catch { /* noop */ }
}

let routeHooked = false;
function hookRouteChanges() {
  if (routeHooked || typeof window === "undefined") return;
  routeHooked = true;
  let last = location.pathname + location.search;
  const fire = () => {
    const now = location.pathname + location.search;
    if (now !== last) { last = now; track("view"); }
  };
  const wrap = (fn) => function (...args) { const r = fn.apply(this, args); queueMicrotask(fire); return r; };
  try {
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener("popstate", fire);
  } catch { /* noop */ }
}

/**
 * Initialise the beacon and send the first pageview.
 * @param {{url?: string, key?: string, app: string}} cfg
 */
export function initMetrics(cfg) {
  if (typeof window === "undefined") return;       // SSR / build: do nothing
  if (!cfg || !cfg.url || !cfg.key || !cfg.app) return; // not configured: no-op
  // Skip headless automation (prerender crawler, bots) so build-time route
  // crawling and scrapers don't pollute the metrics.
  if (typeof navigator !== "undefined" && navigator.webdriver) return;
  CONFIG = { url: cfg.url, key: cfg.key, app: cfg.app };
  track("view");
  hookRouteChanges();
}
