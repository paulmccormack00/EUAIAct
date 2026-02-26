import { useState } from "react";
import { SANS, SERIF, COLORS, RADIUS } from "../constants.js";
import { truncateText } from "../utils.jsx";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import RecitalCard from "./RecitalCard.jsx";

export default function ThemeView({ themeId, onArticleClick }) {
  const theme = EU_AI_ACT_DATA.themes.find((t) => t.id === themeId);
  const [expandedRecitals, setExpandedRecitals] = useState(new Set());
  const [showAllRecitals, setShowAllRecitals] = useState(false);
  if (!theme) return null;
  const articles = theme.articles.map((num) => ({ num, ...EU_AI_ACT_DATA.articles[String(num)] })).filter((a) => a.title);
  const themeRecitals = Object.values(EU_AI_ACT_DATA.recitals).filter((r) => r.themes?.includes(themeId)).sort((a, b) => a.number - b.number);
  const toggleRecital = (rnum) => { setExpandedRecitals(prev => { const n = new Set(prev); n.has(rnum) ? n.delete(rnum) : n.add(rnum); return n; }); };
  const visibleRecitals = showAllRecitals ? themeRecitals : themeRecitals.slice(0, 12);

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: theme.color }} />
          <h2 style={{ fontSize: 28, fontWeight: 400, color: "#1a1a1a", margin: 0, fontFamily: SERIF }}>{theme.name}</h2>
        </div>
        <p style={{ color: "#4a5568", fontSize: 15, fontFamily: SANS, margin: "4px 0 0" }}>{theme.description}</p>
        {theme.cross_cutting && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#fefce8", color: "#854d0e", borderRadius: 8, fontSize: 13, border: "1px solid #fde68a", marginTop: 16, fontFamily: SANS }}>
            ⚡ Cross-cutting theme — spans multiple categories
          </div>
        )}
      </div>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontFamily: SANS }}>Articles ({articles.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {articles.map(({ num, title, text, relatedRecitals }) => (
            <button key={num} onClick={() => onArticleClick(num)}
              style={{ textAlign: "left", padding: 18, background: "white", border: "1px solid #e2e0dc", borderRadius: 12, cursor: "pointer", transition: "all 0.15s", fontFamily: SANS }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#93b3d4"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e0dc"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontWeight: 600, color: "#1a1a1a", margin: 0, fontSize: 15 }}>Article {num}</p>
                  <p style={{ color: "#4a5568", fontSize: 14, margin: "2px 0 0" }}>{title}</p>
                  <p style={{ color: "#6b7c93", fontSize: 12.5, margin: "8px 0 0", lineHeight: 1.5 }}>{truncateText(text, 150)}</p>
                </div>
                {relatedRecitals?.length > 0 && (
                  <span style={{ flexShrink: 0, fontSize: 11, color: "#8b6914", background: "#fdf8ef", padding: "3px 10px", borderRadius: 12, fontWeight: 500 }}>
                    {relatedRecitals.length} recital{relatedRecitals.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {themeRecitals.length > 0 && (
        <div>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontFamily: SANS }}>Related Recitals ({themeRecitals.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visibleRecitals.map((recital) => (
              <RecitalCard key={recital.number} recital={recital} isExpanded={expandedRecitals.has(recital.number)}
                onToggle={() => toggleRecital(recital.number)} onArticleClick={onArticleClick} searchQuery="" />
            ))}
            {themeRecitals.length > 12 && !showAllRecitals && (
              <button onClick={() => setShowAllRecitals(true)}
                style={{ padding: "12px 0", fontSize: 13, color: "#1e3a5f", background: "none", border: "1px solid #c7d6ec", borderRadius: 10, cursor: "pointer", fontFamily: SANS, fontWeight: 500 }}>
                Show all {themeRecitals.length} recitals
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
