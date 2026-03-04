import { SANS, SERIF, COLORS, RADIUS, SHADOWS } from "../constants.js";
import { BLOG_POSTS } from "../data/blog-posts.js";

const KEY_ARTICLES = [
  { num: 5, title: "Prohibited AI practices", color: "#dc2626" },
  { num: 6, title: "Classification rules for high-risk AI", color: "#ea580c" },
  { num: 9, title: "Risk management system", color: "#d97706" },
  { num: 26, title: "Obligations of deployers", color: "#2563eb" },
  { num: 27, title: "Fundamental rights impact assessment", color: "#7c3aed" },
  { num: 50, title: "Transparency obligations", color: "#0891b2" },
  { num: 99, title: "Penalties", color: "#991b1b" },
];

export default function HomeView({ onArticleClick, onChatOpen, onFRIAClick, onTimelineClick, onBlogClick, onBlogPostClick, onRoleIdentifierClick }) {
  const recentPosts = BLOG_POSTS.slice(0, 2);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <div className="hero-home" style={{ textAlign: "center", padding: "64px 0 52px" }}>
        <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 18px", background: COLORS.primaryLight, border: `1px solid ${COLORS.primaryLightBorder}`, borderRadius: RADIUS.round, fontSize: 12, color: COLORS.primary, fontWeight: 500, marginBottom: 28, fontFamily: SANS, letterSpacing: "0.01em" }}>
          <span aria-hidden="true">🇪🇺</span> Regulation (EU) 2024/1689 — In force since 1 August 2024
        </div>
        <h1 className="hero-title" style={{ fontSize: 48, fontWeight: 400, lineHeight: 1.1, color: COLORS.textPrimary, maxWidth: 600, margin: "0 auto 18px", fontFamily: SERIF, letterSpacing: "-0.01em" }}>
          The EU AI Act.<br />Finally readable.
        </h1>
        <p className="hero-desc" style={{ fontSize: 17, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 560, margin: "0 auto", fontFamily: SANS }}>
          113 articles. 180 recitals. 13 annexes. One interactive reference — with plain-English summaries, role-based filtering, and compliance tools.
        </p>
      </div>

      {/* ── EMPATHY + QUESTION CARDS ────────────────── */}
      <div style={{ margin: "0 -40px", padding: "0 40px 52px", background: COLORS.white, borderTop: `1px solid ${COLORS.borderDefault}`, borderBottom: `1px solid ${COLORS.borderDefault}` }}>
        <div className="landing-empathy" style={{ padding: "52px 0 32px" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 400, color: COLORS.textPrimary, lineHeight: 1.25, marginBottom: 12 }}>
            Not sure where to start?<br />Most people aren't.
          </h2>
          <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.75, maxWidth: 640, margin: 0, fontFamily: SANS }}>
            Whether you're a DPO preparing for August 2026, a startup founder wondering if your product is in scope, or a legal team mapping compliance obligations — start with the question that matters most to you.
          </p>
        </div>

        <div className="landing-q-cards key-articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {/* FRIA Card */}
          {onFRIAClick && (
            <a href="/fria" onClick={(e) => { e.preventDefault(); onFRIAClick(); }}
              className="q-card"
              style={{ textAlign: "left", padding: "28px 24px", background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.borderDefault}`, cursor: "pointer", transition: "all 0.2s", fontFamily: SANS, textDecoration: "none", display: "flex", flexDirection: "column" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = SHADOWS.lg; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" /><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /><path d="M9 14l2 2 4-4" /></svg>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 10, lineHeight: 1.35 }}>Do I need a Fundamental Rights Impact Assessment?</h3>
              <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.65, marginBottom: 18, flex: 1 }}>Answer 7 questions to find out. Article 27 requires deployers of certain high-risk AI systems to conduct an FRIA before deployment.</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#c2410c" }}>Start the FRIA screening →</span>
            </a>
          )}

          {/* Role Card */}
          {onRoleIdentifierClick && (
            <a href="/role-identifier" onClick={(e) => { e.preventDefault(); onRoleIdentifierClick(); }}
              className="q-card"
              style={{ textAlign: "left", padding: "28px 24px", background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.borderDefault}`, cursor: "pointer", transition: "all 0.2s", fontFamily: SANS, textDecoration: "none", display: "flex", flexDirection: "column" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = SHADOWS.lg; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 10, lineHeight: 1.35 }}>What are my obligations under the AI Act?</h3>
              <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.65, marginBottom: 18, flex: 1 }}>Your obligations depend on your role — provider, deployer, importer, distributor, or authorised representative. Identify yours in 2 minutes.</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary }}>Find your role →</span>
            </a>
          )}

          {/* Timeline Card */}
          {onTimelineClick && (
            <a href="/timeline" onClick={(e) => { e.preventDefault(); onTimelineClick(); }}
              className="q-card"
              style={{ textAlign: "left", padding: "28px 24px", background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.borderDefault}`, cursor: "pointer", transition: "all 0.2s", fontFamily: SANS, textDecoration: "none", display: "flex", flexDirection: "column" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = SHADOWS.lg; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 10, lineHeight: 1.35 }}>When do I need to be compliant?</h3>
              <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.65, marginBottom: 18, flex: 1 }}>The Act applies in phases from February 2025 to August 2027. The big deadline — high-risk AI systems and FRIA — is 2 August 2026.</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#dc2626" }}>View compliance timeline →</span>
            </a>
          )}
        </div>
      </div>

      {/* ── BROWSE THE ACT ──────────────────────────── */}
      <div style={{ textAlign: "center", padding: "56px 0 0" }}>
        <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 400, color: COLORS.textPrimary, marginBottom: 8 }}>Browse the Act</h2>
        <p style={{ fontSize: 15, color: COLORS.textMuted, marginBottom: 32, fontFamily: SANS }}>Jump to the articles practitioners read most.</p>

        <div className="landing-article-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, maxWidth: 760, margin: "0 auto 24px", textAlign: "left" }}>
          {KEY_ARTICLES.map((art) => (
            <a key={art.num} href={`/article/${art.num}`} onClick={(e) => { e.preventDefault(); onArticleClick(art.num); }}
              className={art.num === 99 ? "article-pill-centered" : ""}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 18px",
                background: COLORS.white, border: `1px solid ${COLORS.borderDefault}`, borderRadius: RADIUS.md,
                textDecoration: "none", color: COLORS.textBody, fontSize: 14, fontFamily: SANS,
                transition: "all 0.15s",
                ...(art.num === 99 ? { gridColumn: "1 / -1", maxWidth: 370, margin: "0 auto" } : {}),
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#93b3d4"; e.currentTarget.style.boxShadow = SHADOWS.md; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderDefault; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: art.color, flexShrink: 0 }} />
              <span style={{ fontWeight: 600, color: COLORS.primary, whiteSpace: "nowrap" }}>Art. {art.num}</span>
              <span style={{ color: COLORS.textMuted, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</span>
            </a>
          ))}
        </div>

        <a href="/article/1" onClick={(e) => { e.preventDefault(); onArticleClick(1); }}
          style={{ fontSize: 14, color: COLORS.primary, textDecoration: "none", fontWeight: 500, fontFamily: SANS, transition: "opacity 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >All 113 articles →</a>

        {/* Stats Strip */}
        <div className="landing-stats" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, maxWidth: 760, margin: "40px auto 0", background: COLORS.white, border: `1px solid ${COLORS.borderDefault}`, borderRadius: RADIUS.lg, overflow: "hidden" }}>
          {[
            { label: "Articles", value: "113", accent: COLORS.primary },
            { label: "Recitals", value: "180", accent: "#8b6914" },
            { label: "Annexes", value: "13", accent: "#ea580c" },
            { label: "Themes", value: "19", accent: "#7c3aed" },
            { label: "Cross-refs", value: "242+", accent: "#16a34a" },
          ].map(({ label, value, accent }, i) => (
            <div key={label} style={{ padding: "22px 16px", textAlign: "center", borderRight: i < 4 ? `1px solid ${COLORS.borderDefault}` : "none" }}>
              <p className="stat-value" style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 400, color: COLORS.textPrimary, margin: 0 }}>{value}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: accent, margin: "2px 0 0", fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI ADVISOR CTA ──────────────────────────── */}
      {onChatOpen && (
        <div className="advisor-cta" style={{ padding: "52px 0 0" }}>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 50%, ${COLORS.primary} 100%)`,
            borderRadius: RADIUS.round, padding: "40px 44px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, color: "white",
          }}
            className="hero-section"
          >
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 10px", fontFamily: SANS }}>Still have questions?</h2>
              <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.65, maxWidth: 520, margin: 0, fontFamily: SANS }}>
                Ask the AI Advisor — get plain-English answers about obligations, classification, timelines, and compliance requirements. Powered by Claude.
              </p>
            </div>
            <button onClick={onChatOpen}
              style={{ padding: "15px 32px", background: "white", color: COLORS.primary, border: "none", borderRadius: RADIUS.md, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: SANS, whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Ask the AI Advisor
            </button>
          </div>
        </div>
      )}

      {/* ── BLOG / INSIGHTS ─────────────────────────── */}
      {onBlogClick && recentPosts.length > 0 && (
        <div style={{ padding: "52px 0 16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: COLORS.textPrimary, margin: 0 }}>Latest Insights</h2>
            <a href="/blog" onClick={(e) => { e.preventDefault(); onBlogClick(); }}
              style={{ fontSize: 13, color: COLORS.primary, textDecoration: "none", fontWeight: 500, fontFamily: SANS }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >All posts →</a>
          </div>
          <div className="landing-blog-grid key-articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
            {recentPosts.map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`}
                onClick={(e) => { e.preventDefault(); onBlogPostClick ? onBlogPostClick(post.slug) : onBlogClick(); }}
                style={{ padding: "26px 24px", background: COLORS.pageBg, border: `1px solid ${COLORS.borderDefault}`, borderRadius: RADIUS.lg, textDecoration: "none", color: "inherit", display: "block", transition: "all 0.2s", fontFamily: SANS }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = SHADOWS.lg; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ display: "inline-block", padding: "3px 10px", background: COLORS.primaryLight, border: `1px solid ${COLORS.primaryLightBorder}`, borderRadius: RADIUS.sm, fontSize: 11, fontWeight: 600, color: COLORS.primary, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.03em" }}>{post.category}</span>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 8, lineHeight: 1.35 }}>{post.title}</h3>
                <p style={{ fontSize: 12, color: "#4a5f74", marginBottom: 14 }}>
                  {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {post.readTime}
                </p>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary }}>Read more →</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
