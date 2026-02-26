import { useState, useMemo } from "react";
import { SANS, SERIF, COLORS, RADIUS } from "../constants.js";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import ThemeBadge from "./ThemeBadge.jsx";
import InlineRecitals from "./InlineRecitals.jsx";

export default function ProhibitedPracticesView({ article, onThemeClick, onArticleClick }) {
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Parse Article 5's prohibited practices into structured items
  const practices = useMemo(() => {
    const text = article.text;
    const items = [];
    
    // Extract main paragraph 1 practices (a) through (h)
    const letterPattern = /\(([a-h])\)\s+/g;
    const letterMatches = [...text.matchAll(letterPattern)];
    
    for (let i = 0; i < letterMatches.length; i++) {
      const letter = letterMatches[i][1];
      const start = letterMatches[i].index + letterMatches[i][0].length;
      const end = i + 1 < letterMatches.length ? letterMatches[i + 1].index : text.indexOf(" 2.") > start ? text.indexOf(" 2.") : text.length;
      let body = text.substring(start, end).trim();
      body = body.replace(/;\s*$/, '.');
      
      // Give each practice a short label
      const labels = {
        a: "Subliminal, manipulative or deceptive techniques",
        b: "Exploitation of vulnerabilities",
        c: "Social scoring",
        d: "Individual criminal risk assessment based solely on profiling",
        e: "Untargeted facial recognition database scraping",
        f: "Emotion recognition in workplace and education",
        g: "Biometric categorisation for sensitive attributes",
        h: "Real-time remote biometric identification in public spaces for law enforcement",
      };
      
      items.push({
        letter,
        label: labels[letter] || `Practice (${letter})`,
        body,
      });
    }
    return items;
  }, [article.text]);

  const toggleItem = (letter) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(letter) ? next.delete(letter) : next.add(letter);
      return next;
    });
  };

  const expandAll = () => setExpandedItems(new Set(practices.map(p => p.letter)));
  const collapseAll = () => setExpandedItems(new Set());

  const articleThemes = (article.themes || [])
    .map((tid) => EU_AI_ACT_DATA.themes.find((t) => t.id === tid))
    .filter(Boolean);

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: "#6b5a42", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: SANS }}>CHAPTER II · Prohibited AI Practices</p>
        <h2 className="view-title" style={{ fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: 0, fontFamily: SERIF, lineHeight: 1.2 }}>
          Article 5
        </h2>
        <h3 className="view-subtitle" style={{ fontSize: 20, color: "#4a5568", margin: "4px 0 0", fontFamily: SERIF, fontWeight: 400 }}>
          Prohibited AI practices
        </h3>
        {articleThemes.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {articleThemes.map((theme) => (
              <ThemeBadge key={theme.id} theme={theme} onClick={() => onThemeClick(theme.id)} small />
            ))}
          </div>
        )}
      </div>

      {/* Intro */}
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: "#991b1b", fontWeight: 600, margin: "0 0 4px", fontFamily: SANS }}>
          ⛔ The following AI practices are prohibited under the EU AI Act
        </p>
        <p style={{ fontSize: 13, color: "#7f1d1d", margin: 0, fontFamily: SANS, lineHeight: 1.6 }}>
          These prohibitions apply from 2 February 2025. Infringements can result in fines of up to €35 million or 7% of worldwide annual turnover.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <button onClick={expandAll} style={{ padding: "8px 14px", fontSize: 12, fontFamily: SANS, fontWeight: 500, background: "white", border: "1px solid #e2e0dc", borderRadius: 8, cursor: "pointer", color: "#4a5568" }}>Expand all</button>
        <button onClick={collapseAll} style={{ padding: "8px 14px", fontSize: 12, fontFamily: SANS, fontWeight: 500, background: "white", border: "1px solid #e2e0dc", borderRadius: 8, cursor: "pointer", color: "#4a5568" }}>Collapse all</button>
      </div>

      {/* Prohibited practices cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {practices.map((p) => {
          const isExpanded = expandedItems.has(p.letter);
          return (
            <div key={p.letter} style={{
              border: `1px solid ${isExpanded ? "#f87171" : "#e2e0dc"}`,
              borderRadius: 12, background: isExpanded ? "#fffbfb" : "white",
              transition: "all 0.15s",
            }}>
              <button onClick={() => toggleItem(p.letter)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}>
                <span style={{
                  flexShrink: 0, width: 34, height: 34, borderRadius: 8,
                  background: "#fef2f2", color: "#dc2626", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: SANS,
                  border: "1px solid #fecaca",
                }}>
                  {p.letter}
                </span>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: "#1a1a1a", fontFamily: SANS }}>
                  {p.label}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7c93" strokeWidth="2" style={{ flexShrink: 0, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {isExpanded && (
                <div style={{ padding: "0 18px 16px 66px" }}>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0, fontFamily: SANS }}>
                    {p.body}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Related Recitals */}
      <InlineRecitals articleNumber={5} onArticleClick={onArticleClick} />
    </div>
  );
}
