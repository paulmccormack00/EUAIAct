import { useMemo } from "react";
import { SANS, SERIF, COLORS, RADIUS } from "../constants.js";
import { highlightText, renderHighlightedParts, truncateText } from "../utils.jsx";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { ASTRO_LOST } from "../assets.js";

export default function SearchResults({ query, onArticleClick }) {
  const results = useMemo(() => {
    if (!query || query.length < 2) return { articles: [], recitals: [] };
    const q = query.toLowerCase();
    const articles = Object.entries(EU_AI_ACT_DATA.articles)
      .filter(([_, art]) => art.title.toLowerCase().includes(q) || art.text.toLowerCase().includes(q))
      .map(([num, art]) => ({ num: parseInt(num), ...art }))
      .sort((a, b) => { const at = a.title.toLowerCase().includes(q) ? 0 : 1; const bt = b.title.toLowerCase().includes(q) ? 0 : 1; return at - bt || a.num - b.num; });
    const recitals = Object.entries(EU_AI_ACT_DATA.recitals)
      .filter(([_, rec]) => rec.text.toLowerCase().includes(q))
      .map(([num, rec]) => ({ num: parseInt(num), ...rec }))
      .sort((a, b) => a.num - b.num);
    return { articles, recitals };
  }, [query]);

  return (
    <div style={{ maxWidth: "100%" }}>
      <h2 style={{ fontSize: 24, fontWeight: 400, color: "#1a1a1a", margin: "0 0 4px", fontFamily: SERIF }}>Search Results</h2>
      <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 28px", fontFamily: SANS }}>
        {results.articles.length + results.recitals.length} result{(results.articles.length + results.recitals.length) !== 1 ? "s" : ""} for "{query}"
      </p>

      {results.articles.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontFamily: SANS }}>Articles ({results.articles.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {results.articles.map(({ num, title, text }) => (
              <button key={num} onClick={() => onArticleClick(num)}
                style={{ textAlign: "left", padding: 18, background: "white", border: "1px solid #e2e0dc", borderRadius: 12, cursor: "pointer", fontFamily: SANS }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#93b3d4"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e0dc"}>
                <p style={{ fontWeight: 600, color: "#1a1a1a", margin: 0, fontSize: 15 }}>Article {num} — {renderHighlightedParts(highlightText(title, query))}</p>
                <p style={{ color: "#6b7c93", fontSize: 13, margin: "6px 0 0", lineHeight: 1.5 }}>{renderHighlightedParts(highlightText(truncateText(text, 200), query))}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {results.recitals.length > 0 && (
        <div>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontFamily: SANS }}>Recitals ({results.recitals.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {results.recitals.slice(0, 20).map(({ num, text, relatedArticles }) => (
              <div key={num} style={{ padding: 16, background: "white", border: "1px solid #e2e0dc", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: "#f5ede3", color: "#8b6914", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: SANS }}>{num}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13.5, color: "#374151", lineHeight: 1.6, fontFamily: SANS }}>{renderHighlightedParts(highlightText(truncateText(text, 250), query))}</p>
                  {relatedArticles?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                      {relatedArticles.map((artNum) => (
                        <button key={artNum} onClick={() => onArticleClick(artNum)}
                          style={{ fontSize: 11, padding: "3px 8px", background: "#f0f4ff", color: "#1e3a5f", borderRadius: 4, border: "1px solid #c7d6ec", cursor: "pointer", fontFamily: SANS }}>
                          Art. {artNum}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.articles.length === 0 && results.recitals.length === 0 && (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <img src={ASTRO_LOST} alt="" style={{ height: 140, opacity: 0.4, margin: "0 auto 16px", display: "block" }} />
          <p style={{ color: "#6b7c93", fontSize: 16, fontFamily: SANS }}>No results found for "{query}"</p>
          <p style={{ color: "#cbd5e1", fontSize: 14, marginTop: 4, fontFamily: SANS }}>Try different keywords</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ENHANCED RECITALS TAB — Full browsing view
