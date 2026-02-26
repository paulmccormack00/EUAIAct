export default function handler(req, res) {
  const { title = "EU AI Act Navigator", type = "page" } = req.query;

  const typeLabel = {
    article: "ARTICLE",
    theme: "THEME",
    blog: "BLOG POST",
    annex: "ANNEX",
    tool: "INTERACTIVE TOOL",
    page: "EU AI ACT NAVIGATOR",
  }[type] || "EU AI ACT NAVIGATOR";

  const typeBadgeColor = {
    article: "#1e40af",
    theme: "#7c3aed",
    blog: "#059669",
    annex: "#b45309",
    tool: "#dc2626",
    page: "#003399",
  }[type] || "#003399";

  // Truncate title for display
  const displayTitle = title.length > 80 ? title.substring(0, 77) + "..." : title;
  const fontSize = displayTitle.length > 50 ? 40 : 52;

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a1628"/>
      <stop offset="100%" stop-color="#0d1f3c"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Type badge -->
  <rect x="60" y="60" width="${typeLabel.length * 12 + 32}" height="36" rx="18" fill="${typeBadgeColor}"/>
  <text x="76" y="84" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="white" letter-spacing="1.5">${escapeXml(typeLabel)}</text>

  <!-- Title -->
  <text x="60" y="${fontSize === 40 ? 160 : 170}" font-family="Georgia, serif" font-size="${fontSize}" font-weight="700" fill="white" width="1080">
    ${wrapText(escapeXml(displayTitle), fontSize === 40 ? 42 : 32)}
  </text>

  <!-- Bottom bar -->
  <line x1="60" y1="540" x2="1140" y2="540" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>

  <!-- EU badge -->
  <rect x="60" y="562" width="40" height="40" rx="10" fill="#003399"/>
  <text x="68" y="589" font-family="system-ui, sans-serif" font-size="17" font-weight="700" fill="#ffd700">EU</text>

  <!-- Site name -->
  <text x="112" y="590" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" fill="rgba(255,255,255,0.9)">EU AI Act Navigator</text>

  <!-- URL -->
  <text x="1140" y="590" font-family="system-ui, sans-serif" font-size="18" fill="rgba(255,255,255,0.5)" text-anchor="end">euai.app</text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
  res.status(200).send(svg);
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length > maxCharsPerLine && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current.trim());

  return lines
    .slice(0, 3)
    .map((line, i) => `<tspan x="60" dy="${i === 0 ? 0 : '1.3em'}">${line}</tspan>`)
    .join("");
}
