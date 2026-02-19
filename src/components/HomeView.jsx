import { useState } from "react";
import { SANS, SERIF } from "../constants.js";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { ROLES } from "../data/roles.js";
import { ASTRO_FLAG } from "../assets.js";

export default function HomeView({ onArticleClick, onThemeClick, activeRole, setActiveRole, onChatOpen }) {
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [subscribeError, setSubscribeError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscribeEmail)) {
      setSubscribeStatus("error");
      setSubscribeError("Please enter a valid email address.");
      return;
    }
    setSubscribeStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribeStatus("success");
      } else if (res.status === 409 || data.error === "duplicate") {
        setSubscribeStatus("duplicate");
      } else {
        setSubscribeStatus("error");
        setSubscribeError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubscribeStatus("error");
      setSubscribeError("Network error. Please try again.");
    }
  };

  const personaThemes = {
    provider: [
      { name: "Prohibited Practices", color: "#EF4444", ref: "Art. 5", articleNum: 5 },
      { name: "High-Risk Classification", color: "#F97316", ref: "Art. 6-7", articleNum: 6 },
      { name: "Technical Requirements", color: "#F59E0B", ref: "Art. 8-15", articleNum: 9 },
      { name: "Conformity Assessment", color: "#8B5CF6", ref: "Art. 43-48", articleNum: 43 },
      { name: "GPAI Obligations", color: "#10B981", ref: "Art. 51-56", articleNum: 53 },
    ],
    deployer: [
      { name: "Prohibited Practices", color: "#EF4444", ref: "Art. 5", articleNum: 5 },
      { name: "Deployer Obligations", color: "#D97706", ref: "Art. 26-27", articleNum: 26 },
      { name: "Transparency", color: "#06B6D4", ref: "Art. 50", articleNum: 50 },
      { name: "Monitoring & Incidents", color: "#A855F7", ref: "Art. 72-73", articleNum: 72 },
      { name: "Penalties", color: "#DC2626", ref: "Art. 99", articleNum: 99 },
    ],
    affected: [
      { name: "Prohibited Practices", color: "#EF4444", ref: "Art. 5", articleNum: 5 },
      { name: "Transparency Rights", color: "#06B6D4", ref: "Art. 50", articleNum: 50 },
      { name: "Right to Explanation", color: "#2563EB", ref: "Art. 86", articleNum: 86 },
      { name: "Complaints & Whistleblowing", color: "#2563EB", ref: "Art. 85, 87", articleNum: 85 },
      { name: "Penalties & Enforcement", color: "#DC2626", ref: "Art. 99", articleNum: 99 },
    ],
  };

  const personaCards = [
    { id: "provider", icon: "🏗", title: "Provider of AI", desc: "You develop, train, or place AI systems or general-purpose AI models on the EU market.", border: "#dbeafe", hover: "#3b82f6", accent: "#3b82f6", iconBg: "#eff6ff" },
    { id: "deployer", icon: "⚙", title: "Deployer of AI", desc: "You use AI systems under your authority in a professional capacity — procurement, operations, HR, compliance.", border: "#fde68a", hover: "#f59e0b", accent: "#f59e0b", iconBg: "#fffbeb" },
    { id: "affected", icon: "👤", title: "Affected Person", desc: "You are subject to decisions made using AI systems and want to understand your rights and protections.", border: "#d1fae5", hover: "#10b981", accent: "#10b981", iconBg: "#ecfdf5" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Hero */}
      <div className="hero-home" style={{ textAlign: "center", padding: "48px 0 40px" }}>
        <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#f0f4ff", border: "1px solid #c7d6ec", borderRadius: 20, fontSize: 12, color: "#1e3a5f", fontWeight: 500, marginBottom: 24, fontFamily: SANS }}>
          🇪🇺 In force since 1 August 2024
        </div>
        <h1 className="hero-title" style={{ fontSize: 42, fontWeight: 400, lineHeight: 1.15, color: "#1a1a1a", maxWidth: 660, margin: "0 auto 16px", fontFamily: SERIF }}>
          Navigate the EU AI Act by what matters to you
        </h1>
        <p className="hero-desc" style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, maxWidth: 580, margin: "0 auto", fontFamily: SANS }}>
          The world's first comprehensive AI regulation — 113 articles, 180 recitals, one interactive reference. Select your role to see the provisions that apply to you.
        </p>
      </div>

      {/* Persona Cards */}
      <div className="key-articles-grid persona-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: activeRole !== "all" ? 0 : 48 }}>
        {personaCards.map((p) => {
          const isActive = activeRole === p.id;
          return (
          <div key={p.id} className="persona-card"
            onClick={() => { setActiveRole(isActive ? "all" : p.id); }}
            style={{
              background: isActive ? p.iconBg : "white", borderRadius: 20,
              border: `2px solid ${isActive ? p.hover : p.border}`,
              padding: "28px 24px", cursor: "pointer",
              transition: "all 0.25s", position: "relative",
              boxShadow: isActive ? "0 8px 32px rgba(0,0,0,0.08)" : "none",
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = p.hover; }}}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = p.border; }}}
          >
            {isActive && <div className="persona-check" style={{ position: "absolute", top: 16, right: 16, width: 24, height: 24, borderRadius: "50%", background: p.hover, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
            </div>}
            <div className="persona-icon" style={{ width: 52, height: 52, borderRadius: 14, background: isActive ? "white" : p.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>{p.icon}</div>
            <h3 className="persona-title" style={{ fontSize: 19, fontWeight: 600, margin: "0 0 8px", fontFamily: SANS, color: "#1a1a1a" }}>{p.title}</h3>
            <p className="persona-desc" style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6, marginBottom: 18, fontFamily: SANS }}>{p.desc}</p>
            <div className="persona-themes" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {personaThemes[p.id].map((t) => (
                <button key={t.name} onClick={(e) => { e.stopPropagation(); onArticleClick(t.articleNum); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: isActive ? "white" : "#faf9f7", borderRadius: 10, fontSize: 13, color: "#374151", fontFamily: SANS, border: "none", cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = isActive ? "#f7f5f2" : "#f0f0ed"}
                  onMouseLeave={e => e.currentTarget.style.background = isActive ? "white" : "#faf9f7"}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{t.ref}</span>
                </button>
              ))}
            </div>
            <div className="persona-cta" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 18, fontSize: 13, fontWeight: 600, color: p.accent, fontFamily: SANS }}>
              {isActive ? "✓ Viewing as " + p.title : "Explore as " + p.title + " →"}
            </div>
          </div>
          );
        })}
      </div>

      {/* Active role banner */}
      {activeRole !== "all" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 20px", margin: "16px 0 32px", background: "white", borderRadius: 12, border: "1px solid #e8e4de" }}>
          <span style={{ fontSize: 13, color: "#374151", fontFamily: SANS }}>
            Showing provisions relevant to <strong>{ROLES[activeRole].label.toLowerCase()}s</strong> — {ROLES[activeRole].articles.length} articles
          </span>
          <button onClick={() => setActiveRole("all")}
            style={{ fontSize: 12, color: "#1e3a5f", background: "none", border: "1px solid #c7d6ec", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: SANS, fontWeight: 500 }}>
            Clear filter
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="home-divider" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
        <div style={{ flex: 1, height: 1, background: "#e8e4de" }} />
        <span style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: SANS }}>The Act at a Glance</span>
        <div style={{ flex: 1, height: 1, background: "#e8e4de" }} />
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 44 }}>
        {[
          { label: "Articles", value: "113", bg: "#f0f4ff", accent: "#1e3a5f" },
          { label: "Recitals", value: "180", bg: "#fdf8ef", accent: "#8b6914" },
          { label: "Themes", value: String(EU_AI_ACT_DATA.themes.length), bg: "#f5f3ff", accent: "#5b21b6" },
          { label: "Cross-refs", value: "242+", bg: "#f0fdf4", accent: "#166534" },
        ].map(({ label, value, bg, accent }) => (
          <div key={label} style={{ padding: "20px 24px", borderRadius: 16, background: bg, textAlign: "center" }}>
            <p className="stat-value" style={{ fontSize: 30, fontWeight: 400, color: "#1a1a1a", margin: 0, fontFamily: SERIF }}>{value}</p>
            <p style={{ fontSize: 13, color: accent, margin: "2px 0 0", fontFamily: SANS, fontWeight: 500 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Theme Map */}
      <div className="themes-section" style={{ textAlign: "center", marginBottom: 44 }}>
        <h2 style={{ fontSize: 24, fontWeight: 400, margin: "0 0 8px", fontFamily: SERIF }}>Browse by Theme</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, fontFamily: SANS }}>19 thematic groupings across the full Regulation</p>
        <div className="themes-grid" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {EU_AI_ACT_DATA.themes.map((theme) => {
            const roleArticles = activeRole !== "all" ? ROLES[activeRole].articles : null;
            const isRelevant = !roleArticles || theme.articles.some(a => roleArticles.includes(a));
            return (
            <button key={theme.id} className="theme-btn" onClick={() => onThemeClick(theme.id)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "white", border: "1px solid #e8e4de", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: SANS, transition: "all 0.15s", opacity: isRelevant ? 1 : 0.35 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#93b3d4"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e4de"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: theme.color }} />
              {theme.name}
              <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 2 }}>{theme.articles.length}</span>
            </button>
            );
          })}
        </div>
      </div>

      {/* FRIA Email Capture */}
      <div className="fria-card" style={{
        background: "white", borderRadius: 16, border: "1px solid #e8e4de", padding: "32px 36px",
        marginBottom: 44, borderLeft: "4px solid #1e3a5f",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden", boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <h2 className="fria-heading" style={{ fontSize: 22, fontWeight: 500, color: "#1e3a5f", margin: 0, fontFamily: SERIF }}>
            The FRIA Deadline is 2 August 2026
          </h2>
          <span className="fria-countdown" style={{
            display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px",
            background: "#1e3a5f", color: "#d4c5a9", borderRadius: 20, fontSize: 12, fontWeight: 600,
            fontFamily: SANS, whiteSpace: "nowrap", letterSpacing: "0.02em",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {Math.ceil((new Date("2026-08-02") - new Date()) / 86400000)} days to go
          </span>
        </div>
        <p className="fria-sub" style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.6, fontFamily: SANS }}>
          No official template exists yet. Be the first to know when the EU AI Office publishes it.
        </p>
        {subscribeStatus === "success" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p style={{ fontSize: 14, color: "#16a34a", fontWeight: 500, margin: 0, fontFamily: SANS }}>
              You're in. We'll notify you when the FRIA template drops.
            </p>
          </div>
        ) : subscribeStatus === "duplicate" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p style={{ fontSize: 14, color: "#2563eb", fontWeight: 500, margin: 0, fontFamily: SANS }}>
              You're already subscribed! We'll be in touch.
            </p>
          </div>
        ) : (
          <>
            <form className="fria-form" onSubmit={handleSubscribe} style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
              <input
                className="fria-input"
                type="email"
                placeholder="you@company.com"
                value={subscribeEmail}
                onChange={e => { setSubscribeEmail(e.target.value); if (subscribeStatus === "error") setSubscribeStatus(null); }}
                style={{
                  flex: 1, minWidth: 0, padding: "12px 16px", border: subscribeStatus === "error" ? "1.5px solid #ef4444" : "1px solid #d1d5db",
                  borderRadius: 10, fontSize: 14, fontFamily: SANS, outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
                }}
              />
              <button
                className="fria-btn"
                type="submit"
                disabled={subscribeStatus === "loading"}
                style={{
                  padding: "12px 24px", background: "#1e3a5f", color: "white", border: "none", borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: subscribeStatus === "loading" ? "wait" : "pointer",
                  fontFamily: SANS, whiteSpace: "nowrap", transition: "all 0.15s", opacity: subscribeStatus === "loading" ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (subscribeStatus !== "loading") { e.currentTarget.style.background = "#2d5a8e"; } }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1e3a5f"; }}
              >
                {subscribeStatus === "loading" ? "Submitting…" : "Get FRIA Updates"}
              </button>
            </form>
            {subscribeStatus === "error" && subscribeError && (
              <p style={{ fontSize: 12, color: "#ef4444", margin: "8px 0 0", fontFamily: SANS }}>{subscribeError}</p>
            )}
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "10px 0 0", fontFamily: SANS }}>No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>

      {/* Timeline */}
      <div className="key-articles-grid home-timeline" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, marginBottom: 44, background: "white", borderRadius: 16, border: "1px solid #e8e4de", overflow: "hidden" }}>
        {[
          { date: "1 Aug 2024", event: "Entry into force", status: "done" },
          { date: "2 Feb 2025", event: "Prohibited practices · AI literacy", status: "done" },
          { date: "2 Aug 2025", event: "GPAI obligations · Governance · Penalties", status: "current" },
          { date: "2 Aug 2026", event: "Full application — all remaining provisions", status: "future" },
          { date: "2 Aug 2027", event: "Annex I products — EU safety legislation", status: "future" },
        ].map(({ date, event, status }, i) => (
          <div key={date} style={{
            padding: "24px 16px", textAlign: "center", borderRight: i < 4 ? "1px solid #e8e4de" : "none",
            background: status === "done" ? "#f0fdf4" : status === "current" ? "#f0f4ff" : "white",
          }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%", margin: "0 auto 10px",
              background: status === "done" ? "#16a34a" : status === "current" ? "#1e3a5f" : "#cbd5e1",
              boxShadow: status === "current" ? "0 0 0 4px rgba(30,58,95,0.15)" : "none",
            }} />
            <p style={{ fontSize: 14, fontWeight: status === "future" ? 400 : 600, color: status === "future" ? "#94a3b8" : "#1a1a1a", margin: "0 0 4px", fontFamily: SANS }}>{date}</p>
            <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, fontFamily: SANS }}>{event}</p>
          </div>
        ))}
      </div>

      {/* AI Advisor CTA */}
      {onChatOpen && (
        <div className="advisor-cta" style={{ marginBottom: 16 }}>
          <div style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 50%, #1e3a5f 100%)",
            borderRadius: 20, padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, color: "white",
          }}
            className="hero-section"
          >
            <div>
              <h3 style={{ fontSize: 21, fontWeight: 500, margin: "0 0 8px", fontFamily: SANS }}>Not sure where to start?</h3>
              <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.6, maxWidth: 500, margin: 0, fontFamily: SANS }}>
                Ask the AI Advisor — get plain-English answers about your obligations, classification questions, timelines, and compliance requirements. Powered by Claude.
              </p>
            </div>
            <button onClick={onChatOpen}
              style={{ padding: "14px 28px", background: "white", color: "#1e3a5f", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: SANS, whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              💬 Ask the AI Advisor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SIDEBAR
