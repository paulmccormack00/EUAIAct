import { SANS } from "../constants.js";
import { truncateText, highlightText, renderHighlightedParts } from "../utils.jsx";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { RECITAL_SUMMARIES } from "../data/recital-maps.js";

export default function RecitalCard({ recital, isExpanded, onToggle, onArticleClick, searchQuery }) {
  const previewText = truncateText(recital.text, 200);
  const displayText = isExpanded ? recital.text : previewText;
  let renderedText = displayText;
  if (searchQuery && searchQuery.length >= 2) renderedText = highlightText(renderedText, searchQuery);

  return (
    <div style={{
      border: `1px solid ${isExpanded ? "#d4a574" : "#e8e0d8"}`,
      borderRadius: 10, transition: "all 0.2s",
      backgroundColor: isExpanded ? "#fdfaf6" : "white",
    }}>
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        style={{
          width: "100%", textAlign: "left", padding: "14px 16px",
          display: "flex", alignItems: "flex-start", gap: 12,
          background: "none", border: "none", cursor: "pointer",
        }}
      >
        <span style={{
          flexShrink: 0, marginTop: 2, width: 30, height: 30, borderRadius: "50%",
          background: "#f5ede3", color: "#8b6914", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: SANS,
        }}>
          {recital.number}
        </span>
        <p style={{ flex: 1, margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "#374151", fontFamily: SANS }}>
          {renderHighlightedParts(renderedText)}
        </p>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5f74" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0, marginTop: 4, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isExpanded && recital.relatedArticles && recital.relatedArticles.length > 0 && (
        <div style={{ padding: "4px 16px 14px", borderTop: "1px solid #ede5da" }}>
          <p style={{ fontSize: 10, color: "#5c4d38", margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: SANS }}>Related Articles</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {recital.relatedArticles.map((artNum) => {
              const art = EU_AI_ACT_DATA.articles[String(artNum)];
              return (
                <button key={artNum} onClick={(e) => { e.stopPropagation(); onArticleClick(artNum); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", fontSize: 12, background: "#f0f4ff", color: "#1e3a5f", borderRadius: 6, border: "1px solid #c7d6ec", cursor: "pointer", fontFamily: SANS }}>
                  <span style={{ fontWeight: 600 }}>Art. {artNum}</span>
                  {art && <span style={{ color: "#6b82a0", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


// Helper: detect if recital text is actually a footnote/OJ reference
function isFootnoteEntry(text) {
  if (!text) return true;
  if (text.startsWith("OJ ")) return true;
  if (text.length < 300 && /^(Regulation|Directive|Decision|European (Parliament|Council))/.test(text)) return true;
  return false;
}

// Get best available text for a recital (prefer real text, fall back to summary)
function getRecitalDisplayText(num) {
  const recitalData = EU_AI_ACT_DATA.recitals[String(num)];
  const fullText = recitalData ? recitalData.text : null;
  const summary = RECITAL_SUMMARIES[num];
  if (fullText && !isFootnoteEntry(fullText)) return { text: fullText, isFullText: true };
  if (summary) return { text: summary, isFullText: false };
  return { text: null, isFullText: false };
}

// ============================================================
// INLINE RECITALS — Expandable accordion for article pages
