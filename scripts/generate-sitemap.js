import { readFileSync, writeFileSync } from "fs";

// Extract EU_AI_ACT_DATA from App.jsx
const appSource = readFileSync("src/App.jsx", "utf8");
const match = appSource.match(/const EU_AI_ACT_DATA = (\{[\s\S]*?\});\s*\n\s*const PLAIN/);
if (!match) {
  console.error("Could not extract EU_AI_ACT_DATA from App.jsx");
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
