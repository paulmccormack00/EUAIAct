import { useState, useMemo, useEffect, useRef } from "react";
import { SANS, SERIF } from "../constants.js";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { RECITAL_TO_ARTICLE_MAP, ARTICLE_TO_RECITAL_MAP, RECITAL_SUMMARIES, getRecitalDisplayText } from "../data/recital-maps.js";

export default function EnhancedRecitalsTab({ onArticleClick, initialRecital }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [articleFilter, setArticleFilter] = useState(null);
  const [expandedRecitals, setExpandedRecitals] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const recitalRefs = useRef({});
  const lastProcessedRecital = useRef(null);

  // Auto-expand and scroll to initial recital (deferred to avoid sync setState in effect)
  useEffect(() => {
    if (initialRecital && initialRecital !== lastProcessedRecital.current && RECITAL_TO_ARTICLE_MAP[initialRecital]) {
      lastProcessedRecital.current = initialRecital;
      const timer = setTimeout(() => {
        setExpandedRecitals((prev) => ({ ...prev, [initialRecital]: true }));
        const el = recitalRefs.current[initialRecital];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialRecital]);

  const allRecitals = useMemo(
    () => Object.keys(RECITAL_TO_ARTICLE_MAP).map(Number).sort((a, b) => a - b),
    []
  );

  const allArticles = useMemo(() => {
    const set = new Set();
    Object.values(RECITAL_TO_ARTICLE_MAP).forEach((arts) => arts.forEach((a) => set.add(a)));
    return Array.from(set).sort((a, b) => a - b);
  }, []);

  const filteredRecitals = useMemo(() => {
    return allRecitals.filter((num) => {
      if (articleFilter !== null) {
        const linked = RECITAL_TO_ARTICLE_MAP[num] || [];
        if (!linked.includes(articleFilter)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const numMatch = num.toString().includes(q);
        const { text: rText } = getRecitalDisplayText(num);
        const textMatch = rText ? rText.toLowerCase().includes(q) : false;
        const summaryMatch = (RECITAL_SUMMARIES[num] || "").toLowerCase().includes(q);
        const artMatch = (RECITAL_TO_ARTICLE_MAP[num] || []).some((a) => `article ${a}`.includes(q));
        if (!numMatch && !textMatch && !summaryMatch && !artMatch) return false;
      }
      return true;
    });
  }, [allRecitals, searchQuery, articleFilter]);

  const toggleRecital = (num) => {
    setExpandedRecitals((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const handleExpandAll = () => {
    const next = !expandAll;
    setExpandAll(next);
    const newState = {};
    filteredRecitals.forEach((num) => { newState[num] = next; });
    setExpandedRecitals(newState);
  };

  const renderTextWithLinks = (text) => {
    if (!text) return null;
    const parts = text.split(/(Article\s+\d+(?:\(\d+\))?(?:\([a-z]\))?)/gi);
    return parts.map((part, i) => {
      const match = part.match(/Article\s+(\d+)/i);
      if (match) {
        const artNum = parseInt(match[1]);
        return (
          <button key={i} onClick={() => onArticleClick && onArticleClick(artNum)}
            style={{ color: "#1e3a5f", textDecoration: "underline", textDecorationColor: "#93b3d4", textDecorationStyle: "dotted", textUnderlineOffset: "2px", background: "none", border: "none", cursor: "pointer", font: "inherit", padding: 0, display: "inline", fontWeight: 500 }}
            title={`Navigate to Article ${artNum}`}>
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 400, color: "#1a1a1a", margin: "0 0 4px", fontFamily: SERIF }}>Recitals</h2>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0, fontFamily: SANS }}>
          The EU AI Act contains 180 recitals providing interpretive guidance for the articles. Click any Article reference to navigate directly.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="recitals-controls" style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search recitals by number, keyword, or article..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "10px 12px 10px 34px", border: "1px solid #e8e0d8", borderRadius: 10, fontSize: 14, outline: "none", background: "white", color: "#1a1a1a", fontFamily: SANS, boxSizing: "border-box" }} />
        </div>

        <select value={articleFilter ?? ""} onChange={(e) => setArticleFilter(e.target.value ? parseInt(e.target.value) : null)}
          style={{ padding: "10px 12px", border: "1px solid #e8e0d8", borderRadius: 10, fontSize: 14, background: "white", color: articleFilter ? "#1a1a1a" : "#94a3b8", cursor: "pointer", minWidth: 180, fontFamily: SANS }}>
          <option value="">Filter by Article...</option>
          {allArticles.map((a) => (
            <option key={a} value={a}>Article {a} ({(ARTICLE_TO_RECITAL_MAP[a] || []).length} recitals)</option>
          ))}
        </select>

        <button onClick={handleExpandAll}
          style={{ padding: "10px 16px", border: "1px solid #e8e0d8", borderRadius: 10, fontSize: 13, background: "white", color: "#4a5568", cursor: "pointer", whiteSpace: "nowrap", fontWeight: 500, fontFamily: SANS }}>
          {expandAll ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Results Count */}
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, fontFamily: SANS }}>
        Showing {filteredRecitals.length} of {allRecitals.length} recitals
        {articleFilter && (
          <button onClick={() => setArticleFilter(null)}
            style={{ fontSize: 12, padding: "2px 8px", borderRadius: 12, border: "1px solid #c7d6ec", background: "#f0f4ff", color: "#1e3a5f", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: SANS }}>
            Article {articleFilter} ×
          </button>
        )}
      </div>

      {/* Recital Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredRecitals.map((num) => {
          const isOpen = expandedRecitals[num];
          const { text: displayText, isFullText } = getRecitalDisplayText(num);
          const previewText = RECITAL_SUMMARIES[num] || (displayText ? displayText.substring(0, 120) + "..." : null);
          const linkedArticles = RECITAL_TO_ARTICLE_MAP[num] || [];

          return (
            <div key={num} ref={(el) => { recitalRefs.current[num] = el; }}
              style={{ border: `1px solid ${isOpen ? "#d4a574" : "#e8e0d8"}`, borderRadius: 10, background: "white", overflow: "hidden", transition: "all 0.15s", boxShadow: isOpen ? "0 1px 3px rgba(0,0,0,0.06)" : "none" }}>
              {/* Recital Header */}
              <button onClick={() => toggleRecital(num)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: isOpen ? "#fdfaf6" : "transparent", border: "none", cursor: "pointer", fontFamily: SANS, gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: "#f5ede3", color: "#8b6914", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                    {num}
                  </span>
                  {!isOpen && previewText && (
                    <span style={{ fontSize: 13, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>
                      {previewText}
                    </span>
                  )}
                  {!isOpen && !previewText && (
                    <span style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic", textAlign: "left" }}>Recital {num}</span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <div className="recital-chips" style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {linkedArticles.slice(0, 5).map((a) => (
                      <span key={a} onClick={(e) => { e.stopPropagation(); onArticleClick && onArticleClick(a); }}
                        style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: "#f0f4ff", color: "#1e3a5f", cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap", border: "1px solid #c7d6ec", transition: "background 0.15s" }}
                        title={`Navigate to Article ${a}`}
                        onMouseEnter={(e) => (e.target.style.background = "#dbe5f5")}
                        onMouseLeave={(e) => (e.target.style.background = "#f0f4ff")}>
                        Art {a}
                      </span>
                    ))}
                    {linkedArticles.length > 5 && (
                      <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "#f0ebe4", color: "#8b7355", fontWeight: 500 }}>
                        +{linkedArticles.length - 5}
                      </span>
                    )}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {isOpen && (
                <div style={{ padding: "0 16px 16px 58px" }}>
                  {displayText ? (
                    <div style={{ fontSize: 14, lineHeight: 1.75, color: "#374151", fontFamily: SANS }}>
                      {renderTextWithLinks(displayText)}
                      {!isFullText && <p style={{ fontSize: 11, color: "#8b7355", marginTop: 8, marginBottom: 0, fontStyle: "italic" }}>Summary — full text in OJ L 2024/1689</p>}
                    </div>
                  ) : (
                    <div style={{ fontSize: 14, color: "#94a3b8", fontStyle: "italic", fontFamily: SANS }}>
                      Recital text pending — full text is available in the official regulation (OJ L 2024/1689).
                    </div>
                  )}
                  {/* Cross-reference footer */}
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f0ebe4", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#8b7355", fontWeight: 500, fontFamily: SANS }}>Cross-references:</span>
                    {linkedArticles.map((a) => (
                      <button key={a} onClick={() => onArticleClick && onArticleClick(a)}
                        style={{ fontSize: 12, padding: "3px 10px", borderRadius: 14, border: "1px solid #c7d6ec", background: "#f0f4ff", color: "#1e3a5f", cursor: "pointer", fontWeight: 500, fontFamily: SANS, transition: "all 0.15s" }}
                        onMouseEnter={(e) => { e.target.style.background = "#1e3a5f"; e.target.style.color = "#ffffff"; e.target.style.borderColor = "#1e3a5f"; }}
                        onMouseLeave={(e) => { e.target.style.background = "#f0f4ff"; e.target.style.color = "#1e3a5f"; e.target.style.borderColor = "#c7d6ec"; }}>
                        Article {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredRecitals.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8", fontSize: 14, fontFamily: SANS }}>
            No recitals match your search. Try a different keyword or clear filters.
          </div>
        )}
      </div>
    </div>
  );
}
