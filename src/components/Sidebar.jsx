import { useState, useRef } from "react";
import { SANS, SERIF, COLORS, RADIUS } from "../constants.js";
import { truncateText } from "../utils.jsx";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { ROLES } from "../data/roles.js";
import { ANNEXES } from "../data/annexes.js";
import useFocusTrap from "../hooks/useFocusTrap.js";

const COLLAPSED_WIDTH = 56;
const EXPANDED_WIDTH = 310;

const KEY_ARTICLES = [
  { num: 5, title: "Prohibited AI practices", color: "#dc2626" },
  { num: 6, title: "High-risk classification", color: "#ea580c" },
  { num: 9, title: "Risk management system", color: "#d97706" },
  { num: 26, title: "Deployer obligations", color: "#2563eb" },
  { num: 27, title: "FRIA requirements", color: "#7c3aed" },
  { num: 50, title: "Transparency obligations", color: "#0891b2" },
  { num: 99, title: "Penalties", color: "#991b1b" },
];

const NAV_TABS = [
  { id: "chapters", label: "Chapters", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> },
  { id: "themes", label: "Themes", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
  { id: "recitals", label: "Recitals", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> },
  { id: "annexes", label: "Annexes", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> },
];

const TOOL_ITEMS = [
  { label: "Role Identifier", viewId: "role-identifier", href: "/role-identifier", color: "#8b5cf6", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
  { label: "FRIA Screening", viewId: "fria", href: "/fria", color: "#ea580c", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> },
  { label: "Timeline", viewId: "timeline", href: "/timeline", color: "#dc2626", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
  { label: "Insights", viewId: "blog", href: "/blog", color: "#1e3a5f", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> },
];

const TOOL_VIEWS = ["home", "fria", "timeline", "role-identifier", "blog", "blogpost"];

export default function Sidebar({ view, setView, selectedTheme, setSelectedTheme, selectedArticle, setSelectedArticle, isMobileOpen, setIsMobileOpen, activeRole, setSelectedRecital, onAboutClick, onArticleClick, onThemeClick, onRecitalsClick, onAnnexesClick, onAnnexClick, selectedAnnex, onFRIAClick, onTimelineClick, onBlogClick, onRoleIdentifierClick, collapsed, onExpand }) {
  const chapters = EU_AI_ACT_DATA.chapters;
  const themes = EU_AI_ACT_DATA.themes;
  const [expandedChapters, setExpandedChapters] = useState(new Set(["CHAPTER I"]));
  const [expandedSections, setExpandedSections] = useState(new Set());
  const hoverTimerRef = useRef(null);

  const mobileTrapRef = useFocusTrap(isMobileOpen);

  const toggleChapter = (id) => setExpandedChapters((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleSection = (id) => setExpandedSections((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const allChapterIds = chapters.map(c => c.id);
  const allExpanded = allChapterIds.every(id => expandedChapters.has(id));
  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedChapters(new Set());
      setExpandedSections(new Set());
    } else {
      setExpandedChapters(new Set(allChapterIds));
    }
  };

  const handleArticleClick = (num) => { onArticleClick(num); setIsMobileOpen(false); };
  const handleThemeClick = (tid) => { onThemeClick(tid); setIsMobileOpen(false); };

  // Tool click handlers mapped by viewId
  const toolClickHandlers = {
    "role-identifier": () => { onRoleIdentifierClick?.(); setIsMobileOpen(false); },
    "fria": () => { onFRIAClick?.(); setIsMobileOpen(false); },
    "timeline": () => { onTimelineClick?.(); setIsMobileOpen(false); },
    "blog": () => { onBlogClick?.(); setIsMobileOpen(false); },
  };

  const isToolView = TOOL_VIEWS.includes(view);

  // Desktop: collapsed sidebar shows icons only
  const isDesktopCollapsed = collapsed && !isMobileOpen;

  const sidebarWidth = isDesktopCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const sidebarStyle = {
    position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 30,
    width: EXPANDED_WIDTH, background: COLORS.white, borderRight: `1px solid ${COLORS.borderDefault}`,
    display: "flex", flexDirection: "column",
    transform: isMobileOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s ease, width 0.25s ease",
  };

  const handleMouseEnter = () => {
    if (!isDesktopCollapsed) return;
    hoverTimerRef.current = setTimeout(() => onExpand?.(), 300);
  };
  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  // ── Collapsed sidebar (desktop only) ──
  const collapsedContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", paddingTop: 12 }}>
      {/* Logo icon */}
      <a href="/" onClick={(e) => { e.preventDefault(); onArticleClick && setIsMobileOpen(false); setView?.("home"); }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, marginBottom: 16, flexShrink: 0 }}>
        <img src="/apple-touch-icon.png" alt="Home" width="28" height="28" style={{ borderRadius: 6 }} />
      </a>

      {/* Divider */}
      <div style={{ width: 24, height: 1, background: COLORS.warmBorder, marginBottom: 12, flexShrink: 0 }} />

      {/* Nav tab icons */}
      {NAV_TABS.map(({ id, label, icon }) => {
        const isActive = (view === id || (view === "theme" && id === "themes") || (view === "article" && id === "chapters") || (view === "home" && id === "chapters") || (view === "annex" && id === "annexes"));
        return (
          <button key={id} title={label}
            onClick={() => {
              onExpand?.();
              if (id === "recitals") onRecitalsClick();
              else if (id === "annexes") onAnnexesClick?.();
              else setView(id === "themes" ? "theme" : id);
            }}
            style={{
              width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 4,
              background: isActive ? "#f0f4ff" : "transparent",
              color: isActive ? "#1e3a5f" : "#4a5f74",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f5f2ed"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {icon}
          </button>
        );
      })}

      {/* Divider */}
      <div style={{ width: 24, height: 1, background: COLORS.warmBorder, margin: "8px 0", flexShrink: 0 }} />

      {/* Tool icons */}
      {TOOL_ITEMS.map(({ viewId, label, icon, color }) => {
        const isActive = view === viewId || (viewId === "blog" && view === "blogpost");
        return (
          <button key={viewId} title={label}
            onClick={() => toolClickHandlers[viewId]?.()}
            style={{
              width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 4,
              background: isActive ? "#f0f4ff" : "transparent",
              color: isActive ? color : "#4a5f74",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f5f2ed"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {icon}
          </button>
        );
      })}

      {/* Expand button at bottom */}
      <div style={{ flex: 1 }} />
      <button title="Expand sidebar" onClick={() => onExpand?.()}
        style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "none", cursor: "pointer", background: "transparent", color: "#4a5f74", marginBottom: 12, transition: "all 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.background = "#f5f2ed"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
      </button>
    </div>
  );

  // ── Fallback quick links for tool pages ──
  const toolPageFallback = (
    <div>
      <p style={{ fontSize: 10, fontWeight: 600, color: "#5c4d38", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px 10px", fontFamily: SANS }}>Quick Links</p>
      {KEY_ARTICLES.map((art) => (
        <a key={art.num} href={`/article/${art.num}`} onClick={(e) => { e.preventDefault(); handleArticleClick(art.num); }}
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8,
            textDecoration: "none", cursor: "pointer", fontFamily: SANS, fontSize: 12,
            color: "#374151", transition: "all 0.1s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#f5ede3"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: art.color, flexShrink: 0 }} />
          <span><span style={{ fontWeight: 600 }}>Art. {art.num}</span> {art.title}</span>
        </a>
      ))}
    </div>
  );

  // Does the current view have matching nav content?
  const hasNavContent = ["chapters", "article", "home", "theme", "recitals", "annexes", "annex"].includes(view);

  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          .sidebar-container {
            transform: translateX(0) !important;
            position: relative !important;
            width: ${sidebarWidth}px !important;
            min-width: ${sidebarWidth}px !important;
          }
          .sidebar-collapsed-content { display: ${isDesktopCollapsed ? "flex" : "none"} !important; }
          .sidebar-expanded-content { display: ${isDesktopCollapsed ? "none" : "flex"} !important; }
        }
        @media (max-width: 1023px) {
          .sidebar-close-btn { display: block !important; }
          .sidebar-collapsed-content { display: none !important; }
          .sidebar-expanded-content { display: flex !important; }
          .sidebar-container { width: 85vw !important; max-width: 310px !important; }
        }
      `}</style>
      <nav ref={mobileTrapRef} className="sidebar-container" aria-label="EU AI Act navigation" style={sidebarStyle}
        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

        {/* Collapsed view (desktop only) */}
        <div className="sidebar-collapsed-content" style={{ display: "none", flexDirection: "column", height: "100%" }}>
          {collapsedContent}
        </div>

        {/* Expanded view */}
        <div className="sidebar-expanded-content" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          {/* Title */}
          <div style={{ flexShrink: 0, padding: "20px 20px 16px", borderBottom: `1px solid ${COLORS.warmBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 20, fontWeight: 400, color: COLORS.textPrimary, margin: 0, fontFamily: SERIF }}>EU AI Act</p>
                <p style={{ fontSize: 11, color: COLORS.warmText, margin: "2px 0 0", fontFamily: SANS }}>Regulation (EU) 2024/1689</p>
              </div>
              <button className="sidebar-close-btn" onClick={() => setIsMobileOpen(false)} aria-label="Close navigation"
                style={{ display: "none", padding: 8, background: "none", border: "none", cursor: "pointer", color: COLORS.textSecondary, borderRadius: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
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
                    aria-pressed={isActive}
                    style={{
                      flex: 1, padding: "8px 6px", fontSize: 12, fontWeight: isActive ? 600 : 500,
                      borderRadius: 8, border: "none", cursor: "pointer", fontFamily: SANS,
                      background: isActive ? "white" : "transparent",
                      color: isActive ? "#1a1a1a" : "#5c4d38",
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
            {(view === "chapters" || view === "article" || view === "home") && (
              <>
                {/* Expand/Collapse All */}
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 4px 6px" }}>
                  <button onClick={toggleExpandAll}
                    style={{
                      background: "none", border: "none", cursor: "pointer", fontFamily: SANS,
                      fontSize: 11, color: "#4a5f74", display: "flex", alignItems: "center", gap: 4,
                      padding: "4px 8px", borderRadius: 6, transition: "all 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5f2ed"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {allExpanded ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                    )}
                    {allExpanded ? "Collapse all" : "Expand all"}
                  </button>
                </div>
                {chapters.map((chapter) => {
                  const isExp = expandedChapters.has(chapter.id);
                  const allArts = chapter.articles || (chapter.sections ? chapter.sections.flatMap(s => s.articles) : []);
                  return (
                    <div key={chapter.id} style={{ marginBottom: 4 }}>
                      <button onClick={() => toggleChapter(chapter.id)} aria-expanded={isExp}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", textAlign: "left", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: SANS,
                          background: isExp ? "#f5f2ed" : "transparent",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = "#faf8f5"; }}
                        onMouseLeave={e => { if (!isExp) e.currentTarget.style.background = "transparent"; }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isExp ? "#1e3a5f" : "#4a5f74"} strokeWidth="2.5" style={{ transition: "transform 0.15s", transform: isExp ? "rotate(90deg)" : "none", flexShrink: 0 }}><path d="M9 5l7 7-7 7" /></svg>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: isExp ? "#1e3a5f" : "#5c4d38", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>{chapter.id}</p>
                          <p style={{ fontSize: 13, color: isExp ? "#1a1a1a" : "#374151", fontWeight: isExp ? 600 : 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chapter.title}</p>
                        </div>
                        <span style={{ fontSize: 11, color: isExp ? "#1e3a5f" : "#4a5f74", fontWeight: isExp ? 600 : 400, background: isExp ? "#e0eaf5" : "transparent", padding: isExp ? "2px 8px" : "0", borderRadius: 10 }}>{allArts.length}</span>
                      </button>
                      {isExp && (
                        <div style={{ marginLeft: 18, marginTop: 2 }}>
                          {chapter.sections ? chapter.sections.map((sec) => {
                            const sKey = `${chapter.id}-${sec.id}`;
                            const secExp = expandedSections.has(sKey);
                            return (
                              <div key={sKey}>
                                <button onClick={() => toggleSection(sKey)} aria-expanded={secExp}
                                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", minHeight: 36, textAlign: "left", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", fontFamily: SANS }}>
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4a5f74" strokeWidth="3" style={{ transform: secExp ? "rotate(90deg)" : "none" }}><path d="M9 5l7 7-7 7" /></svg>
                                  <span style={{ fontSize: 12, color: "#4d5d71" }}>{sec.title}</span>
                                </button>
                                {secExp && <div style={{ marginLeft: 16 }}>
                                  {sec.articles.map((num) => {
                                    const art = EU_AI_ACT_DATA.articles[String(num)];
                                    if (!art) return null;
                                    const isActive = selectedArticle === num;
                                    const roleArticles = activeRole !== "all" ? ROLES[activeRole].articles : null;
                                    const isRelevant = !roleArticles || roleArticles.includes(num);
                                    return (
                                      <a key={num} href={`/article/${num}`} onClick={(e) => { e.preventDefault(); handleArticleClick(num); }}
                                        aria-current={isActive ? "page" : undefined}
                                        style={{
                                          display: "block", width: "100%", textAlign: "left", padding: "8px 10px", minHeight: 36, borderRadius: 8, textDecoration: "none", cursor: "pointer", fontFamily: SANS, fontSize: 12,
                                          background: isActive ? "#1e3a5f" : "transparent",
                                          color: isActive ? "white" : isRelevant ? "#374151" : "#c8c8c8",
                                          fontWeight: isActive ? 600 : 400,
                                          opacity: isRelevant ? 1 : 0.5,
                                          transition: "all 0.1s",
                                          borderLeft: isActive ? "3px solid #1e3a5f" : "3px solid transparent",
                                        }}>
                                        <span style={{ fontWeight: 600 }}>Art. {num}</span> <span style={{ color: isActive ? "#c7d6ec" : "#4a5f74" }}>{art.title}</span>
                                      </a>
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
                              <a key={num} href={`/article/${num}`} onClick={(e) => { e.preventDefault(); handleArticleClick(num); }}
                                aria-current={isActive ? "page" : undefined}
                                style={{
                                  display: "block", width: "100%", textAlign: "left", padding: "8px 10px", minHeight: 36, borderRadius: 8, textDecoration: "none", cursor: "pointer", fontFamily: SANS, fontSize: 12,
                                  background: isActive ? "#1e3a5f" : "transparent",
                                  color: isActive ? "white" : isRelevant ? "#374151" : "#c8c8c8",
                                  fontWeight: isActive ? 600 : 400,
                                  opacity: isRelevant ? 1 : 0.5,
                                  transition: "all 0.1s",
                                  borderLeft: isActive ? "3px solid #1e3a5f" : "3px solid transparent",
                                }}>
                                <span style={{ fontWeight: 600 }}>Art. {num}</span> <span style={{ color: isActive ? "#c7d6ec" : "#4a5f74" }}>{art.title}</span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {view === "theme" && (
              <div>
                {themes.filter(t => !t.cross_cutting).map((theme) => {
                  const isActive = selectedTheme === theme.id;
                  return (
                    <a key={theme.id} href={`/theme/${theme.id}`} onClick={(e) => { e.preventDefault(); handleThemeClick(theme.id); }}
                      aria-current={isActive ? "page" : undefined}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10, textDecoration: "none", cursor: "pointer", fontFamily: SANS, marginBottom: 2, background: isActive ? `${theme.color}10` : "transparent", borderLeft: isActive ? `3px solid ${theme.color}` : "3px solid transparent" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: theme.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? "#1a1a1a" : "#374151" }}>{theme.name}</span>
                      </div>
                      <p style={{ fontSize: 11, color: "#4a5f74", margin: "2px 0 0 18px" }}>{theme.articles.length} article{theme.articles.length !== 1 ? "s" : ""}</p>
                    </a>
                  );
                })}
                <div style={{ borderTop: "1px solid #f0ebe4", margin: "12px 0", paddingTop: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#5c4d38", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px 12px", fontFamily: SANS }}>Cross-cutting</p>
                  {themes.filter(t => t.cross_cutting).map((theme) => (
                    <a key={theme.id} href={`/theme/${theme.id}`} onClick={(e) => { e.preventDefault(); handleThemeClick(theme.id); }}
                      aria-current={selectedTheme === theme.id ? "page" : undefined}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, textDecoration: "none", cursor: "pointer", fontFamily: SANS, background: selectedTheme === theme.id ? `${theme.color}10` : "transparent" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${theme.color}`, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{theme.name}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {view === "recitals" && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#5c4d38", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px 10px", fontFamily: SANS }}>All Recitals (1–180)</p>
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
                <p style={{ fontSize: 10, fontWeight: 600, color: "#5c4d38", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px 10px", fontFamily: SANS }}>All Annexes (I–XIII)</p>
                {ANNEXES.map((annex) => {
                  const isActive = selectedAnnex === annex.id;
                  return (
                    <a key={annex.id} href={`/annex/${annex.id}`} onClick={(e) => { e.preventDefault(); onAnnexClick(annex.id); setIsMobileOpen(false); }}
                      aria-current={isActive ? "page" : undefined}
                      style={{
                        display: "block", width: "100%", textAlign: "left", padding: "7px 10px", borderRadius: 8, textDecoration: "none", cursor: "pointer", fontFamily: SANS, fontSize: 12,
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
                      <span style={{ color: isActive ? "#c7d6ec" : "#4a5f74" }}>{truncateText(annex.title, 55)}</span>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Fallback: quick links when on tool/home pages with no matching nav */}
            {!hasNavContent && isToolView && toolPageFallback}
          </div>

          {/* Tools Section */}
          <div style={{ flexShrink: 0, padding: "12px 16px", borderTop: "1px solid #f0ebe4" }}>
            <p style={{ fontSize: 10, color: "#4a5f74", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, margin: "0 0 8px", fontFamily: SANS }}>Tools</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {TOOL_ITEMS.map(({ label, viewId, href, color, icon }) => {
                const isActive = view === viewId || (viewId === "blog" && view === "blogpost");
                return (
                  <a key={viewId} href={href} onClick={(e) => { e.preventDefault(); toolClickHandlers[viewId]?.(); }}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                      background: isActive ? "#f0f4ff" : "transparent",
                      textDecoration: "none", borderRadius: 8, cursor: "pointer",
                      fontSize: 13, fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#1e3a5f" : "#4d5d71",
                      fontFamily: SANS, textAlign: "left", width: "100%",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f7f5f2"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? color : "#cbd5e1", flexShrink: 0 }} />
                    {label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={{ flexShrink: 0, padding: "12px 16px", borderTop: "1px solid #f0ebe4", background: "#faf9f7" }}>
            {onAboutClick && (
              <button className="sidebar-about-btn" onClick={() => { onAboutClick(); setIsMobileOpen(false); }}
                style={{ display: "none", width: "100%", padding: "8px 12px", marginBottom: 8, background: "none", border: "1px solid #e2e0dc", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "#4d5d71", fontFamily: SANS, textAlign: "center" }}>
                About this tool
              </button>
            )}
            <p style={{ fontSize: 11, color: "#4a5f74", textAlign: "center", margin: 0, fontFamily: SANS }}>
              OJ L, 2024/1689 · In force 1 Aug 2024
            </p>
          </div>
        </div>
      </nav>
    </>
  );
}

// ============================================================
// AI CHAT PANEL
