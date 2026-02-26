import { useState } from "react";
import { SANS, SERIF, COLORS, RADIUS, SHADOWS } from "../constants.js";
import { ANNEXES } from "../data/annexes.js";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";

export default function AnnexView({ annexId, onArticleClick, onAnnexClick }) {
  const [expandedSections, setExpandedSections] = useState(new Set([0]));

  // If no annexId provided, show the full list
  if (!annexId) {
    return <AnnexList onAnnexClick={onAnnexClick} onArticleClick={onArticleClick} />;
  }

  const annex = ANNEXES.find(a => a.id === annexId);
  if (!annex) return <p style={{ fontFamily: SANS, color: COLORS.textSecondary }}>Annex not found.</p>;

  const toggleSection = (idx) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <button onClick={() => onAnnexClick(null)} style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
          background: "none", border: `1px solid ${COLORS.borderLight}`, borderRadius: RADIUS.md,
          cursor: "pointer", fontFamily: SANS, fontSize: 12, color: COLORS.textMuted,
          marginBottom: 16, transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primaryLinkUnderline; e.currentTarget.style.color = COLORS.primary; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.color = COLORS.textMuted; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
          All Annexes
        </button>

        <p style={{ fontSize: 11, color: COLORS.warmText, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: SANS }}>
          Annex {annex.number}
        </p>
        <h1 className="view-title" style={{ fontSize: 28, fontWeight: 400, color: COLORS.textPrimary, margin: 0, fontFamily: SERIF, lineHeight: 1.2 }}>
          {annex.title}
        </h1>
        {annex.subtitle && (
          <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "6px 0 0", fontFamily: SANS }}>{annex.subtitle}</p>
        )}
      </div>

      {/* Summary */}
      <div style={{
        background: COLORS.primaryLight, border: `1px solid ${COLORS.primaryLightBorder}`,
        borderRadius: 14, padding: "20px 24px", marginBottom: 24, fontFamily: SANS,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.primary }}>Overview</h4>
        </div>
        <p style={{ fontSize: 14, color: COLORS.primary, lineHeight: 1.7, margin: 0 }}>{annex.summary}</p>
      </div>

      {/* Sections */}
      {annex.sections.map((section, idx) => {
        const isExpanded = expandedSections.has(idx);
        return (
          <div key={idx} style={{
            background: COLORS.white, border: `1px solid ${COLORS.borderLight}`,
            borderRadius: 14, marginBottom: 12, overflow: "hidden",
            boxShadow: SHADOWS.xs,
          }}>
            <button onClick={() => toggleSection(idx)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "16px 24px", border: "none", cursor: "pointer",
              background: isExpanded ? "#faf9f7" : COLORS.white,
              fontFamily: SANS, textAlign: "left", transition: "background 0.15s",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2.5"
                style={{ transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "none", flexShrink: 0 }}>
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>{section.title}</span>
            </button>
            {isExpanded && (
              <div style={{ padding: "0 24px 20px" }}>
                {section.preamble && (
                  <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7, margin: "0 0 16px", fontFamily: SANS, fontStyle: "italic" }}>
                    {section.preamble}
                  </p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {section.items.map((item, i) => {
                    // Parse article references
                    const parts = item.split(/(Article\s+\d+)/g);
                    return (
                      <div key={i} style={{
                        fontSize: 14, lineHeight: 1.75, color: COLORS.textBody, fontFamily: SANS,
                        padding: "10px 14px", background: "#faf9f7", borderRadius: RADIUS.md,
                        borderLeft: `3px solid ${COLORS.warmBorder}`,
                      }}>
                        {parts.map((part, j) => {
                          const artMatch = part.match(/^Article\s+(\d+)$/);
                          if (artMatch) {
                            const num = parseInt(artMatch[1]);
                            if (EU_AI_ACT_DATA.articles[String(num)]) {
                              return (
                                <button key={j} onClick={() => onArticleClick(num)} style={{
                                  color: COLORS.primary, textDecoration: "underline",
                                  textDecorationColor: COLORS.primaryLinkUnderline,
                                  cursor: "pointer", fontWeight: 500, background: "none",
                                  border: "none", fontFamily: "inherit", fontSize: "inherit", padding: 0,
                                }}>
                                  Article {num}
                                </button>
                              );
                            }
                          }
                          return <span key={j}>{part}</span>;
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Related Articles */}
      {annex.relatedArticles && annex.relatedArticles.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h4 style={{
            fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, margin: "0 0 12px",
            textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: SANS,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Related Articles
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {annex.relatedArticles.map(num => {
              const ref = EU_AI_ACT_DATA.articles[String(num)];
              return (
                <button key={num} onClick={() => onArticleClick(num)} style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px",
                  fontSize: 13, background: "#f8f9fa", color: COLORS.textBody,
                  borderRadius: RADIUS.lg, border: `1px solid ${COLORS.borderSubtle}`,
                  cursor: "pointer", fontFamily: SANS, transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primaryLinkUnderline; e.currentTarget.style.backgroundColor = COLORS.primaryLight; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderSubtle; e.currentTarget.style.backgroundColor = "#f8f9fa"; }}
                >
                  <span style={{ fontWeight: 600 }}>Art. {num}</span>
                  {ref && <span style={{ color: COLORS.textMuted, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ref.title}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Official Source Link */}
      <div style={{
        marginTop: 32, padding: "16px 20px", background: "#f7f5f2",
        borderRadius: 12, border: `1px solid ${COLORS.warmBorder}`,
        display: "flex", alignItems: "center", gap: 10, fontFamily: SANS,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.warmText} strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span style={{ fontSize: 13, color: COLORS.textSecondary }}>
          Official source:{" "}
          <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng" target="_blank" rel="noopener noreferrer"
            style={{ color: COLORS.primary, textDecoration: "underline", textDecorationColor: COLORS.primaryLinkUnderline }}>
            EUR-Lex — Regulation (EU) 2024/1689
          </a>
        </span>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
        {annex.id > 1 && (
          <button onClick={() => onAnnexClick(annex.id - 1)} style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px",
            background: COLORS.white, border: `1px solid ${COLORS.borderLight}`,
            borderRadius: RADIUS.lg, cursor: "pointer", fontFamily: SANS, fontSize: 13,
            color: COLORS.textSecondary, transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primaryLinkUnderline; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderLight; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
            Annex {ANNEXES[annex.id - 2]?.number}
          </button>
        )}
        <div style={{ flex: 1 }} />
        {annex.id < 13 && (
          <button onClick={() => onAnnexClick(annex.id + 1)} style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px",
            background: COLORS.white, border: `1px solid ${COLORS.borderLight}`,
            borderRadius: RADIUS.lg, cursor: "pointer", fontFamily: SANS, fontSize: 13,
            color: COLORS.textSecondary, transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primaryLinkUnderline; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderLight; }}
          >
            Annex {ANNEXES[annex.id]?.number}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

function AnnexList({ onAnnexClick, onArticleClick }) {
  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="view-title" style={{ fontSize: 32, fontWeight: 400, color: COLORS.textPrimary, margin: 0, fontFamily: SERIF, lineHeight: 1.2 }}>
          Annexes
        </h1>
        <p style={{ fontSize: 15, color: COLORS.textSecondary, margin: "8px 0 0", fontFamily: SANS, lineHeight: 1.6 }}>
          The EU AI Act contains 13 Annexes that provide detailed technical, procedural, and classificatory substance supporting the main regulatory articles.
        </p>
      </div>

      {/* Official Source Banner */}
      <div style={{
        padding: "14px 20px", background: COLORS.primaryLight,
        borderRadius: 12, border: `1px solid ${COLORS.primaryLightBorder}`,
        display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, marginBottom: 24,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span style={{ fontSize: 13, color: COLORS.primary }}>
          Official source:{" "}
          <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng" target="_blank" rel="noopener noreferrer"
            style={{ color: COLORS.primary, fontWeight: 600, textDecoration: "underline", textDecorationColor: COLORS.primaryLinkUnderline }}>
            EUR-Lex — Regulation (EU) 2024/1689
          </a>
        </span>
      </div>

      {/* Annex Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ANNEXES.map(annex => (
          <button key={annex.id} onClick={() => onAnnexClick(annex.id)} style={{
            width: "100%", textAlign: "left", padding: "18px 22px",
            background: COLORS.white, border: `1px solid ${COLORS.borderLight}`,
            borderRadius: 14, cursor: "pointer", fontFamily: SANS,
            transition: "all 0.15s", boxShadow: SHADOWS.xs,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primaryLinkUnderline; e.currentTarget.style.boxShadow = SHADOWS.md; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.boxShadow = SHADOWS.xs; }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{
                flexShrink: 0, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                background: COLORS.primaryLight, borderRadius: RADIUS.md,
                fontSize: 14, fontWeight: 700, color: COLORS.primary,
              }}>
                {annex.number}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, margin: 0, lineHeight: 1.3 }}>
                  {annex.title}
                </h3>
                <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "4px 0 0", lineHeight: 1.5 }}>
                  {annex.summary}
                </p>
                {annex.relatedArticles && annex.relatedArticles.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {annex.relatedArticles.map(num => (
                      <span key={num} style={{
                        padding: "2px 8px", background: "#f0f4ff", borderRadius: 6,
                        fontSize: 11, fontWeight: 600, color: COLORS.primary,
                      }}>
                        Art. {num}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.textPlaceholder} strokeWidth="2" style={{ flexShrink: 0, marginTop: 4 }}>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
