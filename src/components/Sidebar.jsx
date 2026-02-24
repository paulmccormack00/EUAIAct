import { useState } from "react";
import { SANS, SERIF, COLORS, RADIUS } from "../constants.js";
import { truncateText } from "../utils.jsx";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { ROLES } from "../data/roles.js";
import { ANNEXES } from "../data/annexes.js";

export default function Sidebar({ view, setView, selectedTheme, setSelectedTheme, selectedArticle, setSelectedArticle, isMobileOpen, setIsMobileOpen, activeRole, setSelectedRecital, onAboutClick, onArticleClick, onThemeClick, onRecitalsClick, onAnnexesClick, onAnnexClick, selectedAnnex, onFRIAClick, onTimelineClick, onBlogClick, onRoleIdentifierClick }) {
  const chapters = EU_AI_ACT_DATA.chapters;
  const themes = EU_AI_ACT_DATA.themes;
  const [expandedChapters, setExpandedChapters] = useState(new Set(["CHAPTER I"]));
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleChapter = (id) => setExpandedChapters((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSection = (id) => setExpandedSections((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleArticleClick = (num) => { onArticleClick(num); setIsMobileOpen(false); };
  const handleThemeClick = (tid) => { onThemeClick(tid); setIsMobileOpen(false); };

  const sidebarStyle = {
    position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 30,
    width: 310, background: COLORS.white, borderRight: `1px solid ${COLORS.borderDefault}`,
    display: "flex", flexDirection: "column",
    transform: isMobileOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease",
  };

  return (
    <>
      <style>{`@media (min-width: 1024px) { .sidebar-container { transform: translateX(0) !important; position: relative !important; } }`}</style>
      <nav className="sidebar-container" aria-label="EU AI Act navigation" style={sidebarStyle}>
        {/* Title */}
        <div style={{ flexShrink: 0, padding: "20px 20px 16px", borderBottom: `1px solid ${COLORS.warmBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 400, color: COLORS.textPrimary, margin: 0, fontFamily: SERIF }}>EU AI Act</h2>
              <p style={{ fontSize: 11, color: COLORS.warmText, margin: "2px 0 0", fontFamily: SANS }}>Regulation (EU) 2024/1689</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ flexShrink: 0, padding: "12px 16px 8px" }}>
          <div style={{ display: "flex", background: "#f5f2ed", borderRadius: 10, padding: 3 }}>
            {[
              { id: "chapters", label: "Chapters" },
              { id: "themes", label: "Themes" },
              { id: "recitals", label: "Recitals" },
              { id: "annexes", label: "Annexes" },
            ].map(({ id, label }) => {
              const isActive = (view === id || (view === "theme" && id === "themes") || (view === "article" && id === "chapters") || (view === "home" && id === "chapters") || (view === "annex" && id === "annexes"));
              return (
                <button key={id}
                  onClick={() => { if (id === "recitals") { onRecitalsClick(); } else if (id === "annexes") { onAnnexesClick?.(); } else { setView(id === "themes" ? "theme" : id); } }}
                  style={{
                    flex: 1, padding: "8px 6px", fontSize: 12, fontWeight: isActive ? 600 : 500,
                    borderRadius: 8, border: "none", cursor: "pointer", fontFamily: SANS,
                    background: isActive ? "white" : "transparent",
                    color: isActive ? "#1a1a1a" : "#8b7355",
                    boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nav Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
          {(view === "chapters" || view === "article" || view === "home") && chapters.map((chapter) => {
            const isExp = expandedChapters.has(chapter.id);
            const allArts = chapter.articles || (chapter.sections ? chapter.sections.flatMap(s => s.articles) : []);
            return (
              <div key={chapter.id} style={{ marginBottom: 4 }}>
                <button onClick={() => toggleChapter(chapter.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", textAlign: "left", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: SANS,
                    background: isExp ? "#f5f2ed" : "transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = "#faf8f5"; }}
                  onMouseLeave={e => { if (!isExp) e.currentTarget.style.background = "transparent"; }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isExp ? "#1e3a5f" : "#94a3b8"} strokeWidth="2.5" style={{ transition: "transform 0.15s", transform: isExp ? "rotate(90deg)" : "none", flexShrink: 0 }}><path d="M9 5l7 7-7 7" /></svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: isExp ? "#1e3a5f" : "#8b7355", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{chapter.id}</p>
                    <p style={{ fontSize: 13, color: isExp ? "#1a1a1a" : "#374151", fontWeight: isExp ? 600 : 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chapter.title}</p>
                  </div>
                  <span style={{ fontSize: 11, color: isExp ? "#1e3a5f" : "#94a3b8", fontWeight: isExp ? 600 : 400, background: isExp ? "#e0eaf5" : "transparent", padding: isExp ? "2px 8px" : "0", borderRadius: 10 }}>{allArts.length}</span>
                </button>
                {isExp && (
                  <div style={{ marginLeft: 18, marginTop: 2 }}>
                    {chapter.sections ? chapter.sections.map((sec) => {
                      const sKey = `${chapter.id}-${sec.id}`;
                      const secExp = expandedSections.has(sKey);
                      return (
                        <div key={sKey}>
                          <button onClick={() => toggleSection(sKey)}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, padding: "5px 8px", textAlign: "left", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", fontFamily: SANS }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" style={{ transform: secExp ? "rotate(90deg)" : "none" }}><path d="M9 5l7 7-7 7" /></svg>
                            <span style={{ fontSize: 12, color: "#64748b" }}>{sec.title}</span>
                          </button>
                          {secExp && <div style={{ marginLeft: 16 }}>
                            {sec.articles.map((num) => {
                              const art = EU_AI_ACT_DATA.articles[String(num)];
                              if (!art) return null;
                              const isActive = selectedArticle === num;
                              const roleArticles = activeRole !== "all" ? ROLES[activeRole].articles : null;
                              const isRelevant = !roleArticles || roleArticles.includes(num);
                              return (
                                <button key={num} onClick={() => handleArticleClick(num)}
                                  style={{
                                    width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 12,
                                    background: isActive ? "#1e3a5f" : "transparent",
                                    color: isActive ? "white" : isRelevant ? "#374151" : "#c8c8c8",
                                    fontWeight: isActive ? 600 : 400,
                                    opacity: isRelevant ? 1 : 0.5,
                                    transition: "all 0.1s",
                                    borderLeft: isActive ? "3px solid #1e3a5f" : "3px solid transparent",
                                  }}>
                                  <span style={{ fontWeight: 600 }}>Art. {num}</span> <span style={{ color: isActive ? "#c7d6ec" : "#94a3b8" }}>{art.title}</span>
                                </button>
                              );
                            })}
                          </div>}
                        </div>
                      );
                    }) : chapter.articles?.map((num) => {
                      const art = EU_AI_ACT_DATA.articles[String(num)];
                      if (!art) return null;
                      const isActive = selectedArticle === num;
                      const roleArticles = activeRole !== "all" ? ROLES[activeRole].articles : null;
                      const isRelevant = !roleArticles || roleArticles.includes(num);
                      return (
                        <button key={num} onClick={() => handleArticleClick(num)}
                          style={{
                            width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 12,
                            background: isActive ? "#1e3a5f" : "transparent",
                            color: isActive ? "white" : isRelevant ? "#374151" : "#c8c8c8",
                            fontWeight: isActive ? 600 : 400,
                            opacity: isRelevant ? 1 : 0.5,
                            transition: "all 0.1s",
                            borderLeft: isActive ? "3px solid #1e3a5f" : "3px solid transparent",
                          }}>
                          <span style={{ fontWeight: 600 }}>Art. {num}</span> <span style={{ color: isActive ? "#c7d6ec" : "#94a3b8" }}>{art.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {view === "theme" && (
            <div>
              {themes.filter(t => !t.cross_cutting).map((theme) => {
                const isActive = selectedTheme === theme.id;
                return (
                  <button key={theme.id} onClick={() => handleThemeClick(theme.id)}
                    style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: SANS, marginBottom: 2, background: isActive ? `${theme.color}10` : "transparent", borderLeft: isActive ? `3px solid ${theme.color}` : "3px solid transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: theme.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? "#1a1a1a" : "#374151" }}>{theme.name}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0 18px" }}>{theme.articles.length} article{theme.articles.length !== 1 ? "s" : ""}</p>
                  </button>
                );
              })}
              <div style={{ borderTop: "1px solid #f0ebe4", margin: "12px 0", paddingTop: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#8b7355", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px 12px", fontFamily: SANS }}>Cross-cutting</p>
                {themes.filter(t => t.cross_cutting).map((theme) => (
                  <button key={theme.id} onClick={() => handleThemeClick(theme.id)}
                    style={{ width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: SANS, background: selectedTheme === theme.id ? `${theme.color}10` : "transparent" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${theme.color}`, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{theme.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {view === "recitals" && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#8b7355", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px 10px", fontFamily: SANS }}>All Recitals (1–180)</p>
              {Object.values(EU_AI_ACT_DATA.recitals).sort((a, b) => a.number - b.number).map((r) => (
                <button key={r.number} onClick={() => { setSelectedRecital(r.number); setView("recitals"); }}
                  style={{ width: "100%", textAlign: "left", padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 12, background: "transparent", color: "#4a5568" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f5ede3"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontWeight: 600, color: "#1a1a1a" }}>({r.number})</span> <span>{truncateText(r.text, 70)}</span>
                </button>
              ))}
            </div>
          )}

          {(view === "annexes" || view === "annex") && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#8b7355", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px 10px", fontFamily: SANS }}>All Annexes (I–XIII)</p>
              {ANNEXES.map((annex) => {
                const isActive = selectedAnnex === annex.id;
                return (
                  <button key={annex.id} onClick={() => { onAnnexClick(annex.id); setIsMobileOpen(false); }}
                    style={{
                      width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 12,
                      background: isActive ? "#1e3a5f" : "transparent",
                      color: isActive ? "white" : "#374151",
                      fontWeight: isActive ? 600 : 400,
                      transition: "all 0.1s",
                      borderLeft: isActive ? "3px solid #1e3a5f" : "3px solid transparent",
                      marginBottom: 1,
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#f5ede3"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontWeight: 600, color: isActive ? "#c7d6ec" : "#1a1a1a" }}>Annex {annex.number}</span>{" "}
                    <span style={{ color: isActive ? "#c7d6ec" : "#94a3b8" }}>{truncateText(annex.title, 55)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tools Section */}
        <div style={{ flexShrink: 0, padding: "12px 16px", borderTop: "1px solid #f0ebe4" }}>
          <p style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, margin: "0 0 8px", fontFamily: SANS }}>Tools</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "Role Identifier", icon: "user-check", viewId: "role-identifier", onClick: () => { onRoleIdentifierClick?.(); setIsMobileOpen(false); }, color: "#8b5cf6" },
              { label: "FRIA Screening", icon: "clipboard-check", viewId: "fria", onClick: () => { onFRIAClick?.(); setIsMobileOpen(false); }, color: "#ea580c" },
              { label: "Compliance Timeline", icon: "clock", viewId: "timeline", onClick: () => { onTimelineClick?.(); setIsMobileOpen(false); }, color: "#dc2626" },
              { label: "Practitioner Insights", icon: "book", viewId: "blog", onClick: () => { onBlogClick?.(); setIsMobileOpen(false); }, color: "#1e3a5f" },
            ].map(({ label, viewId, onClick, color }) => {
              const isActive = view === viewId || (viewId === "blog" && view === "blogpost");
              return (
                <button key={viewId} onClick={onClick}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                    background: isActive ? "#f0f4ff" : "transparent",
                    border: "none", borderRadius: 8, cursor: "pointer",
                    fontSize: 13, fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#1e3a5f" : "#64748b",
                    fontFamily: SANS, textAlign: "left", width: "100%",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f7f5f2"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? color : "#cbd5e1", flexShrink: 0 }} />
                  {label}
                  {viewId === "fria" && (
                    <span style={{ marginLeft: "auto", padding: "1px 6px", background: "#fff7ed", borderRadius: 4, fontSize: 10, fontWeight: 700, color: "#ea580c" }}>New</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, padding: "12px 16px", borderTop: "1px solid #f0ebe4", background: "#faf9f7" }}>
          {onAboutClick && (
            <button className="sidebar-about-btn" onClick={() => { onAboutClick(); setIsMobileOpen(false); }}
              style={{ display: "none", width: "100%", padding: "8px 12px", marginBottom: 8, background: "none", border: "1px solid #e2e0dc", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#64748b", fontFamily: SANS, textAlign: "center" }}>
              About this tool
            </button>
          )}
          <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", margin: 0, fontFamily: SANS }}>
            OJ L, 2024/1689 · In force 1 Aug 2024
          </p>
        </div>
      </nav>
    </>
  );
}

// ============================================================
// AI CHAT PANEL
