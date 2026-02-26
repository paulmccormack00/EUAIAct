import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import { join } from "path";

// Cache font at module scope for warm function reuse
let fontData;
function getFont() {
  if (!fontData) {
    fontData = readFileSync(join(process.cwd(), "public", "fonts", "Inter-Bold.ttf"));
  }
  return fontData;
}

import rateLimit from "./_rate-limit.js";

export default async function handler(req, res) {
  if (!rateLimit(req, res, { limit: 30, windowMs: 60_000 })) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  let { title = "EU AI Act Navigator", type = "page" } = req.query;
  // Input validation: limit title length to prevent abuse
  if (typeof title !== "string" || title.length > 200) title = "EU AI Act Navigator";
  if (typeof type !== "string" || !["article", "theme", "blog", "annex", "tool", "page"].includes(type)) type = "page";

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

  const displayTitle = title.length > 80 ? title.substring(0, 77) + "..." : title;
  const fontSize = displayTitle.length > 50 ? 40 : 52;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0a1628, #0d1f3c)",
          fontFamily: "Inter",
        },
        children: [
          // Top section: badge + title
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column" },
              children: [
                // Type badge
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "32px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            background: typeBadgeColor,
                            borderRadius: "18px",
                            padding: "8px 20px",
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "white",
                            letterSpacing: "1.5px",
                          },
                          children: typeLabel,
                        },
                      },
                    ],
                  },
                },
                // Title
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: `${fontSize}px`,
                      fontWeight: 700,
                      color: "white",
                      lineHeight: 1.3,
                      maxWidth: "1080px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    children: displayTitle,
                  },
                },
              ],
            },
          },
          // Bottom section: EU badge + site name + URL
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "2px solid rgba(255,255,255,0.15)",
                paddingTop: "20px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", alignItems: "center" },
                    children: [
                      // EU badge
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: "#003399",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "12px",
                            fontSize: "17px",
                            fontWeight: 700,
                            color: "#ffd700",
                          },
                          children: "EU",
                        },
                      },
                      // Site name
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "22px",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.9)",
                          },
                          children: "EU AI Act Navigator",
                        },
                      },
                    ],
                  },
                },
                // URL
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "18px",
                      color: "rgba(255,255,255,0.5)",
                    },
                    children: "euai.app",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: getFont(),
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const png = resvg.render().asPng();

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
  res.status(200).send(Buffer.from(png));
}
