import { useState } from "react";
import { SANS, SERIF } from "../constants.js";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { ARTICLE_TO_RECITAL_MAP, RECITAL_TO_ARTICLE_MAP, RECITAL_SUMMARIES, getRecitalDisplayText } from "../data/recital-maps.js";

export default function InlineRecitals({ articleNumber, onArticleClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedRecitals, setExpandedRecitals] = useState({});

  const linkedRecitals = ARTICLE_TO_RECITAL_MAP[articleNumber] || [];

  const toggleRecital = (num) => {
    setExpandedRecitals((prev) => ({ ...prev, [num]: !prev[num] }));
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
            style={{ color: "#1e3a5f", textDecoration: "underline", textDecorationColor: "#93b3d4", background: "none", border: "none", cursor: "pointer", font: "inherit", padding: 0, display: "inline", fontWeight: 500 }}
            title={`Navigate to Article ${artNum}`}>
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (linkedRecitals.length === 0) return null;

  return (
    <div style={{ margin: "16px 0", border: `1px solid ${isExpanded ? "#d4a574" : "#e8e0d8"}`, borderRadius: 10, overflow: "hidden", background: "#fdfaf6", transition: "all 0.2s" }}>
      <button onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: isExpanded ? "#f5ede3" : "#fdfaf6", border: "none", cursor: "pointer", fontFamily: SANS, transition: "background 0.2s" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b6914" strokeWidth="2" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          Related Recitals ({linkedRecitals.length})
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b5a42" strokeWidth="2" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isExpanded && (
        <div style={{ padding: "8px 16px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          {linkedRecitals.map((recitalNum) => {
            const isOpen = expandedRecitals[recitalNum];
            const { text: displayText, isFullText } = getRecitalDisplayText(recitalNum);
            const linkedArticles = RECITAL_TO_ARTICLE_MAP[recitalNum] || [];

            return (
              <div key={recitalNum} style={{ border: "1px solid #e8e0d8", borderRadius: 8, background: "white", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", fontFamily: SANS }}>
                  <button onClick={() => toggleRecital(recitalNum)} aria-expanded={isOpen}
                    style={{ background: "none", border: "none", cursor: "pointer", fontFamily: SANS, padding: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                    Recital {recitalNum}
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {linkedArticles.filter((a) => a !== articleNumber).slice(0, 4).map((a) => (
                        <button key={a} onClick={() => onArticleClick && onArticleClick(a)}
                          style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "#f0f4ff", color: "#1e3a5f", cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap", border: "1px solid #c7d6ec", fontFamily: "inherit", lineHeight: "inherit" }}
                          title={`Also linked to Article ${a}`}>
                          Art {a}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => toggleRecital(recitalNum)} aria-hidden="true" tabIndex={-1}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#566b82" strokeWidth="2"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {isOpen && displayText && (
                  <div style={{ padding: "0 12px 12px", fontSize: 13.5, lineHeight: 1.65, color: "#374151", fontFamily: SANS }}>
                    {renderTextWithLinks(displayText)}
                    {!isFullText && <p style={{ fontSize: 11, color: "#6b5a42", marginTop: 8, marginBottom: 0, fontStyle: "italic" }}>Summary — full text in OJ L 2024/1689</p>}
                  </div>
                )}
                {isOpen && !displayText && (
                  <div style={{ padding: "0 12px 12px", fontSize: 13, color: "#566b82", fontStyle: "italic", fontFamily: SANS }}>
                    Full text available in the official regulation (OJ L 2024/1689).
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
