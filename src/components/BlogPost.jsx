import { SANS, SERIF, COLORS, RADIUS, SHADOWS } from "../constants.js";
import { BLOG_POSTS } from "../data/blog-posts.js";

export default function BlogPost({ slug, onBlogClick, onArticleClick }) {
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 0", textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 400, color: "#1a1a1a", fontFamily: SERIF }}>Article not found</h2>
        <button onClick={onBlogClick} style={{ marginTop: 16, padding: "10px 20px", background: "#1e3a5f", color: "white", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: SANS }}>
          Back to Blog
        </button>
      </div>
    );
  }

  const renderContent = (block, idx) => {
    switch (block.type) {
      case "lead":
        return (
          <p key={idx} style={{ fontSize: 17, color: "#374151", lineHeight: 1.8, fontFamily: SANS, fontWeight: 400, marginBottom: 28, borderLeft: "3px solid #1e3a5f", paddingLeft: 20 }}>
            {block.text}
          </p>
        );
      case "heading":
        return (
          <h2 key={idx} style={{ fontSize: 22, fontWeight: 500, color: "#1a1a1a", margin: "36px 0 16px", fontFamily: SERIF }}>
            {block.text}
          </h2>
        );
      case "paragraph":
        return (
          <p key={idx} style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 16, fontFamily: SANS }}>
            {parseInlineRefs(block.text, onArticleClick)}
          </p>
        );
      case "list":
        return (
          <ul key={idx} style={{ margin: "0 0 20px", paddingLeft: 24, fontFamily: SANS }}>
            {block.items.map((item, i) => (
              <li key={i} style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 6 }}>
                {parseInlineRefs(item, onArticleClick)}
              </li>
            ))}
          </ul>
        );
      case "callout":
        return (
          <blockquote key={idx} style={{
            margin: "24px 0", padding: "20px 24px", background: "#f0f4ff",
            borderLeft: "4px solid #1e3a5f", borderRadius: "0 12px 12px 0",
            fontFamily: SERIF, fontSize: 15, color: "#1e3a5f", lineHeight: 1.7, fontStyle: "italic",
          }}>
            {block.text}
          </blockquote>
        );
      case "table":
        return (
          <div key={idx} style={{ overflowX: "auto", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: SANS, fontSize: 13 }}>
              <thead>
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} style={{ textAlign: "left", padding: "12px 16px", background: "#f0f4ff", borderBottom: "2px solid #c7d6ec", fontWeight: 600, color: "#1e3a5f" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: "10px 16px", borderBottom: "1px solid #e8e4de", color: "#374151", lineHeight: 1.6 }}>
                        {j === 0 ? <strong>{cell}</strong> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "numbered-action":
        return (
          <div key={idx} style={{ margin: "24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
            {block.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: 16, padding: "18px 20px",
                background: COLORS.white, borderRadius: RADIUS.xl, border: `1px solid ${COLORS.borderDefault}`,
                transition: "all 0.15s",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: RADIUS.md, background: COLORS.primaryLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: COLORS.primary, fontFamily: SANS,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, margin: "0 0 4px", fontFamily: SANS }}>
                    {item.action}
                  </p>
                  <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
                    {parseInlineRefs(item.detail, onArticleClick)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case "takeaways":
        return (
          <div key={idx} style={{
            margin: "24px 0", padding: "24px 28px",
            background: COLORS.primaryLight, borderRadius: RADIUS.xl,
            borderLeft: `4px solid ${COLORS.primary}`,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {block.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <p style={{ fontSize: 14, color: COLORS.primary, lineHeight: 1.6, margin: 0, fontFamily: SANS, fontWeight: 500 }}>
                    {parseInlineRefs(item, onArticleClick)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "diagram":
        return (
          <div key={idx} style={{ margin: "32px 0", padding: "28px 24px", background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0" }}>
            {block.title && (
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 20px", textAlign: "center", fontFamily: SANS }}>
                {block.title}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              {block.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 480 }}>
                  <div style={{
                    width: "100%", padding: "14px 20px", borderRadius: step.type === "diamond" ? 0 : 10,
                    background: step.type === "start" ? "#0a1e5c" : step.type === "diamond" ? "#fffbeb" : step.type === "yes" ? "#f0fdf4" : step.type === "no" ? "#fef2f2" : "white",
                    color: step.type === "start" ? "white" : "#1a1a1a",
                    border: step.type === "diamond" ? "2px solid #d97706" : step.type === "yes" ? "2px solid #16a34a" : step.type === "no" ? "2px solid #dc2626" : "1px solid #e2e8f0",
                    textAlign: "center", fontSize: 13, fontFamily: SANS, fontWeight: step.type === "start" ? 600 : 500, lineHeight: 1.5,
                    transform: step.type === "diamond" ? "rotate(0deg)" : "none",
                    position: "relative",
                  }}>
                    {step.badge && <span style={{ position: "absolute", top: -10, left: 16, padding: "2px 8px", background: step.type === "yes" ? "#16a34a" : "#dc2626", color: "white", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{step.badge}</span>}
                    {step.text}
                    {step.ref && <span style={{ display: "block", fontSize: 11, color: step.type === "start" ? "#b0b8d4" : "#94a3b8", marginTop: 2 }}>{step.ref}</span>}
                  </div>
                  {i < block.steps.length - 1 && (
                    <div style={{ width: 2, height: 20, background: "#cbd5e1" }} />
                  )}
                </div>
              ))}
            </div>
            {block.caption && (
              <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", margin: "16px 0 0", fontStyle: "italic", fontFamily: SANS }}>{block.caption}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 0" }}>
      {/* Back link */}
      <button
        onClick={onBlogClick}
        style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32, padding: 0, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#1e3a5f", fontWeight: 500, fontFamily: SANS }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to all articles
      </button>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ padding: "4px 12px", background: "#f0f4ff", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#1e3a5f", fontFamily: SANS }}>
            {post.category}
          </span>
          <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: SANS }}>{post.readTime}</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: "0 0 12px", fontFamily: SERIF, lineHeight: 1.2 }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.6, margin: "0 0 20px", fontFamily: SANS }}>
          {post.subtitle}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid #e8e4de" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: "#1e3a5f", fontFamily: SANS }}>P</div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", margin: 0, fontFamily: SANS }}>{post.author}</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, fontFamily: SANS }}>
              {post.authorRole} &middot; {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <article>
        {post.content.map((block, idx) => renderContent(block, idx))}
      </article>

      {/* Tags */}
      <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid #e8e4de" }}>
        <p style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 10, fontFamily: SANS }}>Tags</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ padding: "4px 12px", background: "#f7f5f2", borderRadius: 6, fontSize: 12, color: "#8b7355", fontFamily: SANS }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 36, padding: "28px 32px", background: "#f0f4ff",
        borderRadius: 16, border: "1px solid #c7d6ec", textAlign: "center",
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 500, color: "#1e3a5f", margin: "0 0 8px", fontFamily: SERIF }}>
          Not sure if you need a FRIA?
        </h3>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", fontFamily: SANS }}>
          Use our free FRIA Screening Tool to find out in under 5 minutes.
        </p>
      </div>
    </div>
  );
}

function parseInlineRefs(text, onArticleClick) {
  const parts = text.split(/(Article \d+(?:\(\d+\))?)/g);
  return parts.map((part, i) => {
    const match = part.match(/^Article (\d+)/);
    if (match) {
      const num = Number(match[1]);
      return (
        <button
          key={i}
          onClick={(e) => { e.preventDefault(); onArticleClick?.(num); }}
          style={{ background: "none", border: "none", color: "#1e3a5f", textDecoration: "underline", cursor: "pointer", fontSize: "inherit", fontFamily: "inherit", padding: 0 }}
        >
          {part}
        </button>
      );
    }
    return part;
  });
}
