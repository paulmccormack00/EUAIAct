import { SANS, SERIF } from "../constants.js";
import { BLOG_POSTS } from "../data/blog-posts.js";

export default function BlogView({ onBlogPostClick }) {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 0" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#f0f4ff", border: "1px solid #c7d6ec", borderRadius: 20, fontSize: 12, color: "#1e3a5f", fontWeight: 600, marginBottom: 16, fontFamily: SANS }}>
          Practitioner Commentary
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: "0 0 8px", fontFamily: SERIF }}>
          EU AI Act Insights
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 600, margin: "0 auto", fontFamily: SANS }}>
          Practitioner-led analysis of the EU AI Act — not academic, not bureaucratic. Practical guidance from someone who's been in the compliance trenches.
        </p>
      </div>

      {/* Featured post */}
      {BLOG_POSTS.length > 0 && (
        <button
          onClick={() => onBlogPostClick(BLOG_POSTS[0].slug)}
          style={{
            width: "100%", textAlign: "left", padding: "32px",
            background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)",
            borderRadius: 20, border: "none", cursor: "pointer", color: "white",
            marginBottom: 24, transition: "transform 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ padding: "3px 10px", background: "rgba(255,255,255,0.15)", borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: SANS }}>
              Featured
            </span>
            <span style={{ fontSize: 12, opacity: 0.7, fontFamily: SANS }}>{BLOG_POSTS[0].readTime}</span>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 500, margin: "0 0 8px", fontFamily: SERIF, lineHeight: 1.3 }}>
            {BLOG_POSTS[0].title}
          </h2>
          <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.6, margin: "0 0 16px", fontFamily: SANS, maxWidth: 600 }}>
            {BLOG_POSTS[0].subtitle}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>P</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0, fontFamily: SANS }}>{BLOG_POSTS[0].author}</p>
              <p style={{ fontSize: 11, opacity: 0.6, margin: 0, fontFamily: SANS }}>{new Date(BLOG_POSTS[0].date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>
        </button>
      )}

      {/* Post list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {BLOG_POSTS.slice(1).map((post) => (
          <button
            key={post.slug}
            onClick={() => onBlogPostClick(post.slug)}
            style={{
              width: "100%", textAlign: "left", padding: "24px",
              background: "white", borderRadius: 16,
              border: "1px solid #e8e4de", cursor: "pointer",
              transition: "all 0.15s", fontFamily: SANS,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#c7d6ec"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e4de"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ padding: "3px 10px", background: "#f0f4ff", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#1e3a5f" }}>
                {post.category}
              </span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{post.readTime}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>{post.title}</h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 12px" }}>{post.subtitle}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{ padding: "2px 8px", background: "#f7f5f2", borderRadius: 4, fontSize: 11, color: "#8b7355" }}>{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
