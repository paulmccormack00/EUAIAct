/**
 * Prerender script — runs after `vite build` to generate static HTML for every route.
 *
 * 1. Serves the built `dist/` directory on a local port
 * 2. Launches Playwright (Chromium) and navigates to each route
 * 3. Waits for the React useEffect meta-tag updates to fire
 * 4. Saves the fully-rendered HTML to dist/{route}/index.html
 * 5. Processes 4 pages concurrently for speed
 */

import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, extname } from "path";

const DIST = join(process.cwd(), "dist");
const CONCURRENCY = 4;
const PORT = 4173;

// Minimal static file server for dist/
const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".webmanifest": "application/manifest+json",
};

function serve() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);

      // SPA fallback: if file doesn't exist and no extension, serve index.html
      if (!existsSync(filePath) && !extname(filePath)) {
        filePath = join(DIST, "index.html");
      }
      // Also try with /index.html appended
      if (!existsSync(filePath)) {
        filePath = join(DIST, "index.html");
      }

      try {
        const data = readFileSync(filePath);
        const ext = extname(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      } catch {
        // Fallback to index.html for SPA routes
        try {
          const data = readFileSync(join(DIST, "index.html"));
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        } catch {
          res.writeHead(404);
          res.end("Not found");
        }
      }
    });

    server.listen(PORT, () => {
      console.log(`Static server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

// Dynamically import routes — the data files use ES module exports
async function loadRoutes() {
  const { getAllRoutes } = await import("../src/data/routes.js");
  return getAllRoutes();
}

async function prerenderRoute(page, route) {
  const url = `http://localhost:${PORT}${route}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  // Wait for React useEffect meta updates to fire
  await page.waitForFunction(() => {
    const title = document.title;
    // Home page has a specific title; other pages should have changed from default
    return title && title !== "EU AI Act Navigator" || window.location.pathname === "/";
  }, { timeout: 10000 }).catch(() => {
    // Timeout is OK for home page — it keeps the default title
  });

  // Small extra delay to ensure all DOM updates complete
  await page.waitForTimeout(200);

  const html = await page.content();

  // Determine output path
  let outDir, outFile;
  if (route === "/") {
    outDir = DIST;
    outFile = join(DIST, "index.html");
  } else {
    // /article/6 → dist/article/6/index.html
    outDir = join(DIST, route);
    outFile = join(outDir, "index.html");
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, html, "utf-8");
}

async function main() {
  const routes = await loadRoutes();
  console.log(`Prerendering ${routes.length} routes...`);

  const server = await serve();
  const browser = await chromium.launch({ headless: true });

  let completed = 0;
  const errors = [];

  // Process in batches of CONCURRENCY
  for (let i = 0; i < routes.length; i += CONCURRENCY) {
    const batch = routes.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (route) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        try {
          await prerenderRoute(page, route);
          completed++;
          if (completed % 20 === 0 || completed === routes.length) {
            console.log(`  ${completed}/${routes.length} done`);
          }
        } catch (err) {
          errors.push({ route, error: err.message });
          console.error(`  Failed: ${route} — ${err.message}`);
        } finally {
          await context.close();
        }
      })
    );
  }

  await browser.close();
  server.close();

  console.log(`\nPrerender complete: ${completed} succeeded, ${errors.length} failed`);
  if (errors.length > 0) {
    console.error("Failed routes:", errors.map((e) => e.route).join(", "));
    process.exit(1);
  }
}

main().catch((err) => {
  if (err.message && err.message.includes("Executable doesn't exist")) {
    console.warn("Prerender skipped: Playwright browsers not installed. Run 'npx playwright install chromium' to enable prerendering.");
    process.exit(0);
  }
  console.error("Prerender failed:", err);
  process.exit(1);
});
