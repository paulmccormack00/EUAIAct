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

// Static date map for content that changes infrequently
const CONTENT_DATES = {
  "/": today,                     // Homepage updates often
  "/recitals": "2024-07-12",     // Regulation published date
  "/fria": today,                 // Tool updates
  "/timeline": today,             // Timeline updates as deadlines approach
  "/role-identifier": "2026-02-01",
  "/annexes": "2024-07-12",
  "/blog": today,                 // Blog listing updates with new posts
};

// Annexes are part of the regulation — use publication date
const ANNEX_DATE = "2024-07-12";

// Articles are part of the regulation — use publication date
const ARTICLE_DATE = "2024-07-12";

// Themes are editorial groupings — use a reasonable date
const THEME_DATE = "2026-01-15";

const urls = [];

// Home
urls.push({ loc: "/", priority: "1.0", changefreq: "weekly", lastmod: CONTENT_DATES["/"] });

// Articles
for (const num of Object.keys(data.articles).sort((a, b) => Number(a) - Number(b))) {
  urls.push({ loc: `/article/${num}`, priority: "0.8", changefreq: "monthly", lastmod: ARTICLE_DATE });
}

// Themes
for (const theme of data.themes) {
  urls.push({ loc: `/theme/${theme.id}`, priority: "0.6", changefreq: "monthly", lastmod: THEME_DATE });
}

// Recitals
urls.push({ loc: "/recitals", priority: "0.5", changefreq: "monthly", lastmod: CONTENT_DATES["/recitals"] });

// FRIA Screening Tool
urls.push({ loc: "/fria", priority: "0.9", changefreq: "weekly", lastmod: CONTENT_DATES["/fria"] });

// Compliance Timeline
urls.push({ loc: "/timeline", priority: "0.8", changefreq: "weekly", lastmod: CONTENT_DATES["/timeline"] });

// Role Identifier
urls.push({ loc: "/role-identifier", priority: "0.8", changefreq: "monthly", lastmod: CONTENT_DATES["/role-identifier"] });

// Annexes
urls.push({ loc: "/annexes", priority: "0.7", changefreq: "monthly", lastmod: ANNEX_DATE });
for (let i = 1; i <= 13; i++) {
  urls.push({ loc: `/annex/${i}`, priority: "0.7", changefreq: "monthly", lastmod: ANNEX_DATE });
}

// Blog
urls.push({ loc: "/blog", priority: "0.7", changefreq: "weekly", lastmod: CONTENT_DATES["/blog"] });

// Blog posts - read from blog-posts.js and use their publication dates
try {
  const blogSource = readFileSync("src/data/blog-posts.js", "utf8");
  // Extract both slug and date for each post
  const postRegex = /slug:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"/g;
  let postMatch;
  while ((postMatch = postRegex.exec(blogSource)) !== null) {
    urls.push({ loc: `/blog/${postMatch[1]}`, priority: "0.7", changefreq: "monthly", lastmod: postMatch[2] });
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
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`Sitemap generated: ${urls.length} URLs written to public/sitemap.xml`);
