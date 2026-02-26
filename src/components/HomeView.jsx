import { SANS, SERIF, COLORS, RADIUS, SHADOWS } from "../constants.js";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { ROLES } from "../data/roles.js";
import EmailSubscribeForm from "./EmailSubscribeForm.jsx";

export default function HomeView({ onArticleClick, onThemeClick, activeRole, setActiveRole, onChatOpen, onFRIAClick, onTimelineClick, onBlogClick, onRoleIdentifierClick, onRecitalsClick, onAnnexesClick }) {
  const primaryRoles = ["provider", "deployer", "affected"];
  const supplyChainRoles = ["importer", "distributor", "authRep"];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Hero */}
      <div className="hero-home" style={{ textAlign: "center", padding: "48px 0 40px" }}>
        <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: COLORS.primaryLight, border: `1px solid ${COLORS.primaryLightBorder}`, borderRadius: RADIUS.round, fontSize: 12, color: COLORS.primary, fontWeight: 500, marginBottom: 24, fontFamily: SANS }}>
          <span aria-hidden="true">🇪🇺</span> In force since 1 August 2024
        </div>
        <h1 className="hero-title" style={{ fontSize: 42, fontWeight: 400, lineHeight: 1.15, color: COLORS.textPrimary, maxWidth: 660, margin: "0 auto 16px", fontFamily: SERIF }}>
          Navigate the EU AI Act by what matters to you
        </h1>
        <p className="hero-desc" style={{ fontSize: 16, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 580, margin: "0 auto", fontFamily: SANS }}>
          The world's first comprehensive AI regulation — 113 articles, 180 recitals, 13 annexes, one interactive reference. Select your role to see the provisions that apply to you.
        </p>
      </div>

      {/* Row 1 — Primary Role Cards */}
      <div className="key-articles-grid persona-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: activeRole !== "all" ? 0 : 20 }}>
        {primaryRoles.map((roleId) => {
          const role = ROLES[roleId];
          const isActive = activeRole === roleId;
          return (
          <div key={roleId} className="persona-card"
            style={{ textAlign: "left",
              background: isActive ? role.colorBg : "white", borderRadius: 20,
              border: `2px solid ${isActive ? role.color : role.colorBorder}`,
              padding: "28px 24px",
              transition: "all 0.25s", position: "relative",
              boxShadow: isActive ? "0 8px 32px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {isActive && <div className="persona-check" style={{ position: "absolute", top: 16, right: 16, width: 24, height: 24, borderRadius: "50%", background: role.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
            </div>}
            <div className="persona-icon" style={{ width: 52, height: 52, borderRadius: 14, background: isActive ? "white" : role.colorBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>{role.icon}</div>
            <h2 className="persona-title" style={{ fontSize: 19, fontWeight: 600, margin: "0 0 4px", fontFamily: SANS, color: "#1a1a1a" }}>{role.label}</h2>
            <span className="persona-desc" style={{ display: "inline-block", padding: "2px 8px", background: isActive ? "white" : role.colorBg, borderRadius: RADIUS.sm, fontSize: 11, color: role.color, fontWeight: 600, fontFamily: SANS, marginBottom: 10, border: `1px solid ${role.colorBorder}` }}>{role.legalBasis}</span>
            <p className="persona-desc" style={{ fontSize: 13.5, color: "#4d5d71", lineHeight: 1.6, marginBottom: 18, fontFamily: SANS }}>{role.identifyAs}</p>
            <div className="persona-themes" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {role.keyArticleGroups.map((t) => (
                <a key={t.name} href={`/article/${t.articleNum}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onArticleClick(t.articleNum); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: isActive ? "white" : "#faf9f7", borderRadius: 10, fontSize: 13, color: "#374151", fontFamily: SANS, textDecoration: "none", cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = isActive ? "#f7f5f2" : "#f0f0ed"}
                  onMouseLeave={e => e.currentTarget.style.background = isActive ? "white" : "#faf9f7"}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: "#4a5f74", fontWeight: 500 }}>{t.ref}</span>
                </a>
              ))}
            </div>
            <button className="persona-cta" onClick={() => setActiveRole(isActive ? "all" : roleId)}
              aria-pressed={isActive}
              style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 18, fontSize: 13, fontWeight: 600, color: role.color, fontFamily: SANS, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <span aria-hidden="true">{isActive ? "✓" : ""}</span> {isActive ? "Viewing as " + role.label : "Explore as " + role.label}
              {!isActive && <span aria-hidden="true"> →</span>}
            </button>
          </div>
          );
        })}
      </div>

      {/* Row 2 — Supply Chain Role Cards (compact) */}
      <div className="key-articles-grid supply-chain-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: activeRole !== "all" ? 0 : 48 }}>
        {supplyChainRoles.map((roleId) => {
          const role = ROLES[roleId];
          const isActive = activeRole === roleId;
          return (
            <button key={roleId}
              onClick={() => { setActiveRole(isActive ? "all" : roleId); }}
              style={{
                background: isActive ? role.colorBg : "white", borderRadius: 14,
                border: `1.5px solid ${isActive ? role.color : role.colorBorder}`,
                padding: "18px 20px", cursor: "pointer",
                transition: "all 0.2s", position: "relative",
                display: "flex", alignItems: "center", gap: 14, textAlign: "left", width: "100%",
                boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = role.color; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = role.colorBorder; }}}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: isActive ? "white" : role.colorBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{role.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 2px", fontFamily: SANS, color: "#1a1a1a" }}>{role.label}</h2>
                <p style={{ fontSize: 12, color: "#4d5d71", margin: 0, fontFamily: SANS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{role.articles.length} articles · {role.legalBasis}</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: role.color, fontFamily: SANS, flexShrink: 0 }}>
                {isActive ? "✓" : "→"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active role banner + provisions */}
      {activeRole !== "all" && (() => {
        const role = ROLES[activeRole];
        const roleArticleSet = new Set(role.articles);
        const chapters = EU_AI_ACT_DATA.chapters;
        const relevantChapters = chapters.map(ch => {
          const allArts = ch.articles || (ch.sections ? ch.sections.flatMap(s => s.articles) : []);
          const matched = allArts.filter(num => roleArticleSet.has(num));
          return matched.length > 0 ? { ...ch, matchedArticles: matched } : null;
        }).filter(Boolean);

        return (
          <div style={{ margin: "16px 0 32px", background: "white", borderRadius: 16, border: `1px solid ${role.colorBorder}`, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px", background: role.colorBg, borderBottom: `1px solid ${role.colorBorder}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{role.icon}</span>
                <span style={{ fontSize: 14, color: COLORS.textBody, fontFamily: SANS, fontWeight: 500 }}>
                  Provisions for <strong>{ROLES[activeRole].labelPlural || role.label}</strong> — {role.articles.length} articles across {relevantChapters.length} chapters
                </span>
              </div>
              <button onClick={() => setActiveRole("all")}
                style={{ fontSize: 12, color: role.color, background: "none", border: `1px solid ${role.colorBorder}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: SANS, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>
                Clear filter
              </button>
            </div>
            {/* Chapter groups */}
            <div style={{ padding: "12px 16px" }}>
              {relevantChapters.map((ch) => (
                <div key={ch.id} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.warmText, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px", fontFamily: SANS }}>
                    {ch.id} — {ch.title}
                  </p>
                  <div className="provisions-grid" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {ch.matchedArticles.map((num) => {
                      const art = EU_AI_ACT_DATA.articles[String(num)];
                      if (!art) return null;
                      return (
                        <a key={num} href={`/article/${num}`} onClick={(e) => { e.preventDefault(); onArticleClick(num); }}
                          title={`Article ${num} — ${art.title}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "5px 10px", background: COLORS.surfaceAltBg,
                            border: `1px solid ${COLORS.borderDefault}`, borderRadius: RADIUS.md,
                            cursor: "pointer", fontSize: 12, fontFamily: SANS, textDecoration: "none",
                            color: COLORS.textBody, transition: "all 0.12s",
                            maxWidth: 260, overflow: "hidden",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = role.color; e.currentTarget.style.background = role.colorBg; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderDefault; e.currentTarget.style.background = COLORS.surfaceAltBg; }}
                        >
                          <span style={{ fontWeight: 600, color: role.color, flexShrink: 0 }}>Art. {num}</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: COLORS.textMuted }}>{art.title}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Role Identifier CTA Banner */}
      {onRoleIdentifierClick && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
          padding: "20px 28px", marginBottom: 36,
          background: COLORS.primaryLight, borderRadius: RADIUS.xxl,
          border: `1px solid ${COLORS.primaryLightBorder}`,
        }}
          className="hero-section"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
          <span style={{ fontSize: 14, color: COLORS.primary, fontFamily: SANS, fontWeight: 500 }}>
            Not sure which role applies to you?
          </span>
          <button onClick={onRoleIdentifierClick}
            style={{
              padding: "8px 18px", background: COLORS.primary, color: "white",
              border: "none", borderRadius: RADIUS.md, cursor: "pointer",
              fontSize: 13, fontWeight: 600, fontFamily: SANS, whiteSpace: "nowrap",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Take the Role Identifier →
          </button>
        </div>
      )}

      {/* Tools & Resources — prominent placement with contrast background */}
      <div style={{ margin: "0 -40px 36px", padding: "32px 40px", background: "#f7f5f2", borderTop: "1px solid #e8e4de", borderBottom: "1px solid #e8e4de" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.textPrimary, margin: 0, fontFamily: SANS }}>Tools &amp; Resources</h2>
        </div>
        <div className="key-articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {onFRIAClick && (
            <a href="/fria"
              onClick={(e) => { e.preventDefault(); onFRIAClick(); }}
              style={{ textAlign: "left", padding: "24px", background: "white", borderRadius: 16, border: "2px solid #fed7aa", cursor: "pointer", transition: "all 0.15s", fontFamily: SANS, textDecoration: "none", display: "block" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#ea580c"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#fed7aa"; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /><path d="M9 14l2 2 4-4" /></svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>FRIA Screening Tool</h3>
              <p style={{ fontSize: 13, color: "#4d5d71", lineHeight: 1.5, margin: "0 0 12px" }}>Am I required to do a FRIA? Answer 7 questions to find out.</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#ea580c" }}>Start screening &rarr;</span>
            </a>
          )}
          {onTimelineClick && (
            <a href="/timeline"
              onClick={(e) => { e.preventDefault(); onTimelineClick(); }}
              style={{ textAlign: "left", padding: "24px", background: "white", borderRadius: 16, border: "2px solid #fecaca", cursor: "pointer", transition: "all 0.15s", fontFamily: SANS, textDecoration: "none", display: "block" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#dc2626"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#fecaca"; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>Compliance Timeline</h3>
              <p style={{ fontSize: 13, color: "#4d5d71", lineHeight: 1.5, margin: "0 0 12px" }}>Every EU AI Act deadline from 2024 to 2027, with alerts.</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#dc2626" }}>View timeline &rarr;</span>
            </a>
          )}
          {onBlogClick && (
            <a href="/blog"
              onClick={(e) => { e.preventDefault(); onBlogClick(); }}
              style={{ textAlign: "left", padding: "24px", background: "white", borderRadius: 16, border: "2px solid #c7d6ec", cursor: "pointer", transition: "all 0.15s", fontFamily: SANS, textDecoration: "none", display: "block" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#1e3a5f"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#c7d6ec"; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>Practitioner Insights</h3>
              <p style={{ fontSize: 13, color: "#4d5d71", lineHeight: 1.5, margin: "0 0 12px" }}>Deep dives on FRIA, DPIA, risk classification, and more.</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1e3a5f" }}>Read articles &rarr;</span>
            </a>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="home-divider" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
        <div style={{ flex: 1, height: 1, background: "#e8e4de" }} />
        <span style={{ fontSize: 12, color: "#4a5f74", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, fontFamily: SANS }}>The Act at a Glance</span>
        <div style={{ flex: 1, height: 1, background: "#e8e4de" }} />
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 44 }}>
        {[
          { label: "Articles", value: "113", bg: "#f0f4ff", accent: "#1e3a5f" },
          { label: "Recitals", value: "180", bg: "#fdf8ef", accent: "#8b6914", href: "/recitals", onClick: onRecitalsClick },
          { label: "Annexes", value: "13", bg: "#fff7ed", accent: "#9a3412", href: "/annexes", onClick: onAnnexesClick },
          { label: "Themes", value: String(EU_AI_ACT_DATA.themes.length), bg: "#f5f3ff", accent: "#5b21b6" },
          { label: "Cross-refs", value: "242+", bg: "#f0fdf4", accent: "#166534" },
        ].map(({ label, value, bg, accent, href, onClick }) => (
          href && onClick ? (
            <a key={label} href={href} onClick={(e) => { e.preventDefault(); onClick(); }}
              style={{ padding: "20px 24px", borderRadius: 16, background: bg, textAlign: "center", textDecoration: "none", display: "block", transition: "transform 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <p className="stat-value" style={{ fontSize: 30, fontWeight: 400, color: "#1a1a1a", margin: 0, fontFamily: SERIF }}>{value}</p>
              <p style={{ fontSize: 13, color: accent, margin: "2px 0 0", fontFamily: SANS, fontWeight: 500 }}>{label}</p>
            </a>
          ) : (
            <div key={label} style={{ padding: "20px 24px", borderRadius: 16, background: bg, textAlign: "center" }}>
              <p className="stat-value" style={{ fontSize: 30, fontWeight: 400, color: "#1a1a1a", margin: 0, fontFamily: SERIF }}>{value}</p>
              <p style={{ fontSize: 13, color: accent, margin: "2px 0 0", fontFamily: SANS, fontWeight: 500 }}>{label}</p>
            </div>
          )
        ))}
      </div>

      {/* Theme Map */}
      <div className="themes-section" style={{ textAlign: "center", marginBottom: 44 }}>
        <h2 style={{ fontSize: 24, fontWeight: 400, margin: "0 0 8px", fontFamily: SERIF }}>Browse by Theme</h2>
        <p style={{ fontSize: 14, color: "#4d5d71", marginBottom: 24, fontFamily: SANS }}>19 thematic groupings across the full Regulation</p>
        <div className="themes-grid" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {EU_AI_ACT_DATA.themes.map((theme) => {
            const roleArticles = activeRole !== "all" ? ROLES[activeRole].articles : null;
            const isRelevant = !roleArticles || theme.articles.some(a => roleArticles.includes(a));
            return (
            <a key={theme.id} className="theme-btn" href={`/theme/${theme.id}`} onClick={(e) => { e.preventDefault(); onThemeClick(theme.id); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "white", border: "1px solid #e8e4de", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: SANS, transition: "all 0.15s", opacity: isRelevant ? 1 : 0.35, textDecoration: "none", color: "inherit" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#93b3d4"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e4de"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: theme.color }} />
              {theme.name}
              <span style={{ fontSize: 11, color: "#4a5f74", marginLeft: 2 }}>{theme.articles.length}</span>
            </a>
            );
          })}
        </div>
      </div>

      {/* FRIA Email Capture */}
      <div className="fria-card" style={{
        background: COLORS.white, borderRadius: RADIUS.xxl, border: `1px solid ${COLORS.borderDefault}`, padding: "32px 36px",
        marginBottom: 44, borderLeft: `4px solid ${COLORS.primary}`,
        boxShadow: SHADOWS.sm, overflow: "hidden", boxSizing: "border-box",
      }}>
        <EmailSubscribeForm
          submitLabel="Get FRIA Updates"
          loadingLabel="Submitting…"
          successMessage="You're in. We'll notify you when the FRIA template drops."
          description="No official template exists yet. Be the first to know when the EU AI Office publishes it."
          headerSlot={
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
              <h2 className="fria-heading" style={{ fontSize: 22, fontWeight: 500, color: COLORS.primary, margin: 0, fontFamily: SERIF }}>
                The FRIA Deadline is 2 August 2026
              </h2>
              <span className="fria-countdown" style={{
                display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px",
                background: COLORS.primary, color: COLORS.warmGold, borderRadius: RADIUS.round, fontSize: 12, fontWeight: 600,
                fontFamily: SANS, whiteSpace: "nowrap", letterSpacing: "0.02em",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {Math.ceil((new Date("2026-08-02") - new Date()) / 86400000)} days to go
              </span>
            </div>
          }
        />
      </div>

      {/* Timeline */}
      <div className="key-articles-grid home-timeline" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, marginBottom: 44, background: "white", borderRadius: 16, border: "1px solid #e8e4de", overflow: "hidden" }}>
        {[
          { date: "1 Aug 2024", event: "Entry into force", isoDate: "2024-08-01" },
          { date: "2 Feb 2025", event: "Prohibited practices · AI literacy", isoDate: "2025-02-02" },
          { date: "2 Aug 2025", event: "GPAI · Governance · Notified Bodies", isoDate: "2025-08-02" },
          { date: "2 Aug 2026", event: "Full application — high-risk & FRIA", isoDate: "2026-08-02", highlight: true },
          { date: "2 Aug 2027", event: "Annex I products — EU safety legislation", isoDate: "2027-08-02" },
        ].map((item, i, arr) => {
          const now = new Date();
          const target = new Date(item.isoDate);
          const isPast = target < now;
          const futureDates = arr.filter(d => new Date(d.isoDate) > now).sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));
          const isNext = futureDates.length > 0 && item.isoDate === futureDates[0].isoDate;
          const status = isPast ? "done" : isNext ? "current" : "future";
          return (
          <div key={item.date} style={{
            padding: "24px 16px", textAlign: "center", borderRight: i < 4 ? "1px solid #e8e4de" : "none",
            background: status === "done" ? "#f0fdf4" : status === "current" ? "#f0f4ff" : "white",
          }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%", margin: "0 auto 10px",
              background: status === "done" ? "#16a34a" : status === "current" ? "#1e3a5f" : "#cbd5e1",
              boxShadow: status === "current" ? "0 0 0 4px rgba(30,58,95,0.15)" : "none",
            }} />
            <p style={{ fontSize: 14, fontWeight: status === "future" ? 400 : 600, color: status === "future" ? "#4a5f74" : "#1a1a1a", margin: "0 0 4px", fontFamily: SANS }}>{item.date}</p>
            <p style={{ fontSize: 12, color: "#4d5d71", lineHeight: 1.5, fontFamily: SANS }}>{item.event}</p>
          </div>
          );
        })}
      </div>

      {/* AI Advisor CTA */}
      {onChatOpen && (
        <div className="advisor-cta" style={{ marginBottom: 16 }}>
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 50%, ${COLORS.primary} 100%)`,
            borderRadius: RADIUS.round, padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, color: "white",
          }}
            className="hero-section"
          >
            <div>
              <h2 style={{ fontSize: 21, fontWeight: 500, margin: "0 0 8px", fontFamily: SANS }}>Not sure where to start?</h2>
              <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.6, maxWidth: 500, margin: 0, fontFamily: SANS }}>
                Ask the AI Advisor — get plain-English answers about your obligations, classification questions, timelines, and compliance requirements. Powered by Claude.
              </p>
            </div>
            <button onClick={onChatOpen}
              style={{ padding: "14px 28px", background: "white", color: COLORS.primary, border: "none", borderRadius: RADIUS.xl, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: SANS, whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Ask the AI Advisor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SIDEBAR
