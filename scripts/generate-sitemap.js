import { readFileSync, writeFileSync } from "fs";

// Read EU_AI_ACT_DATA from its dedicated module
const dataSource = readFileSync("src/data/eu-ai-act-data.js", "utf8");
const match = dataSource.match(/export const EU_AI_ACT_DATA = (\{.*\});?\s*$/s);
if (!match) {
  console.error("Could not extract EU_AI_ACT_DATA from src/data/eu-ai-act-data.js");
  process.exit(1);
}
const data = JSON.parse(match[1]);

const BASE = "https://euai.app";
const today = new Date().toISOString().split("T")[0];

const urls = [];

// Home
urls.push({ loc: "/", priority: "1.0", changefreq: "weekly" });

// Articles
for (const num of Object.keys(data.articles).sort((a, b) => Number(a) - Number(b))) {
  urls.push({ loc: `/article/${num}`, priority: "0.8", changefreq: "monthly" });
}

// Themes
for (const theme of data.themes) {
  urls.push({ loc: `/theme/${theme.id}`, priority: "0.6", changefreq: "monthly" });
}

// Recitals
urls.push({ loc: "/recitals", priority: "0.5", changefreq: "monthly" });

// FRIA Screening Tool
urls.push({ loc: "/fria", priority: "0.9", changefreq: "weekly" });

// Compliance Timeline
urls.push({ loc: "/timeline", priority: "0.8", changefreq: "weekly" });

// Blog
urls.push({ loc: "/blog", priority: "0.7", changefreq: "weekly" });

// Blog posts - read from blog-posts.js
try {
  const blogSource = readFileSync("src/data/blog-posts.js", "utf8");
  const slugMatches = blogSource.matchAll(/slug:\s*"([^"]+)"/g);
  for (const m of slugMatches) {
    urls.push({ loc: `/blog/${m[1]}`, priority: "0.7", changefreq: "monthly" });
  }
} catch (e) {
  console.warn("Could not read blog posts for sitemap:", e.message);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`Sitemap generated: ${urls.length} URLs written to public/sitemap.xml`);
