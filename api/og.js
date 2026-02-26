import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "EU AI Act Navigator";
  const type = searchParams.get("type") || "page";

  // Type-specific styling
  const typeLabel = {
    article: "Article",
    theme: "Theme",
    blog: "Blog Post",
    annex: "Annex",
    tool: "Interactive Tool",
    page: "EU AI Act Navigator",
  }[type] || "EU AI Act Navigator";

  const typeBadgeColor = {
    article: "#1e40af",
    theme: "#7c3aed",
    blog: "#059669",
    annex: "#b45309",
    tool: "#dc2626",
    page: "#003399",
  }[type] || "#003399";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a1628",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top section: badge + title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Type badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                backgroundColor: typeBadgeColor,
                color: "white",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {typeLabel}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 60 ? 42 : 52,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.2,
              maxWidth: "900px",
              wordWrap: "break-word",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom section: branding bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgba(255,255,255,0.15)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* EU flag-inspired accent */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#003399",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffd700",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              EU
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "22px",
                fontWeight: 600,
              }}
            >
              EU AI Act Navigator
            </div>
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "18px",
            }}
          >
            euai.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
