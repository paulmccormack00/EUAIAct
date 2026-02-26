import { useState, useMemo } from "react";
import { SANS, SERIF, COLORS, RADIUS, SHADOWS } from "../constants.js";
import { formatArticleText, highlightText, renderHighlightedParts } from "../utils.jsx";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { PLAIN_SUMMARIES } from "../data/plain-summaries.js";
import ThemeBadge from "./ThemeBadge.jsx";
import InlineRecitals from "./InlineRecitals.jsx";

export default function ArticleDetail({ articleNum, article, onThemeClick, onArticleClick, searchQuery }) {
  const [showPlainLanguage, setShowPlainLanguage] = useState(true);

  const formattedText = formatArticleText(article.text);
  const paragraphs = formattedText.split(/\n\n+/).filter(Boolean);

  const articleThemes = (article.themes || [])
    .map((tid) => EU_AI_ACT_DATA.themes.find((t) => t.id === tid))
    .filter(Boolean);

  const referencedArticles = useMemo(() => {
    const refs = new Set();
    const regex = /Article\s+(\d+)/g;
    let match;
    while ((match = regex.exec(article.text)) !== null) {
      const num = parseInt(match[1]);
      if (num !== articleNum && EU_AI_ACT_DATA.articles[String(num)]) refs.add(num);
    }
    return [...refs].sort((a, b) => a - b);
  }, [article.text, articleNum]);

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        {article.chapter && (
          <p style={{ fontSize: 11, color: "#6b5a42", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: SANS }}>{article.chapter}</p>
        )}
        <h1 className="view-title" style={{ fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: 0, fontFamily: SERIF, lineHeight: 1.2 }}>
          Article {articleNum}
        </h1>
        <p className="view-subtitle" style={{ fontSize: 20, color: "#4a5568", margin: "4px 0 0", fontFamily: SERIF, fontWeight: 400 }}>
          {article.title}
        </p>
        {articleNum === 27 && (
          <div style={{ marginTop: 12 }}>
            <span className="fria-countdown" style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 14px",
              background: "#1e3a5f", color: "#d4c5a9", borderRadius: 20, fontSize: 12, fontWeight: 600,
              fontFamily: SANS, letterSpacing: "0.02em",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {Math.ceil((new Date("2026-08-02") - new Date()) / 86400000)} days until the FRIA deadline
            </span>
          </div>
        )}
        {articleThemes.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {articleThemes.map((theme) => (
              <ThemeBadge key={theme.id} theme={theme} onClick={() => onThemeClick(theme.id)} small />
            ))}
          </div>
        )}
      </div>

      {/* Plain Language Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button aria-expanded={showPlainLanguage} onClick={() => {
          setShowPlainLanguage(!showPlainLanguage);
        }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13, fontFamily: SANS, fontWeight: 500,
            borderRadius: 10, border: `1.5px solid ${showPlainLanguage ? "#1e3a5f" : "#e2e0dc"}`,
            background: showPlainLanguage ? "#1e3a5f" : "white", color: showPlainLanguage ? "white" : "#4a5568",
            cursor: "pointer", transition: "all 0.15s",
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          {showPlainLanguage ? "Hide" : "Plain English"}
        </button>
      </div>

      {/* Plain Language Panel */}
      {showPlainLanguage && (
        <div className="plain-panel" style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 14, padding: "24px 28px", marginBottom: 24, fontFamily: SANS }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0369a1" }}>Plain English Summary</h2>
          </div>
          <div style={{ fontSize: 14, color: "#1e3a5f", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
            {(PLAIN_SUMMARIES[String(articleNum)] || "No plain language summary available for this article.")}
          </div>
        </div>
      )}

      {/* Article Text */}
      <div className="article-box" style={{ background: "white", border: "1px solid #e2e0dc", borderRadius: 14, padding: "28px 32px", marginBottom: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {paragraphs.map((para, i) => {
          let rendered = para.trim();
          if (searchQuery && searchQuery.length >= 2) rendered = highlightText(rendered, searchQuery);

          rendered = rendered.replace(/Article\s+(\d+)/g, (match, num) => {
            if (EU_AI_ACT_DATA.articles[num] && parseInt(num) !== articleNum) return `§ARTREF§${num}§/ARTREF§`;
            return match;
          });

          const tokens = rendered.split(/(§HL_START§|§HL_END§|§ARTREF§\d+§\/ARTREF§)/);
          let inHL = false;
          const isNumbered = /^\d+\./.test(para.trim());
          const isLettered = /^\s+\([a-z]\)/.test(para);

          return (
            <p key={i} style={{
              fontSize: 14.5, lineHeight: 1.75, color: "#2d3748", margin: "0 0 14px", fontFamily: SANS,
              paddingLeft: isLettered ? 28 : 0,
            }}>
              {tokens.map((token, j) => {
                if (token === "§HL_START§") { inHL = true; return null; }
                if (token === "§HL_END§") { inHL = false; return null; }
                const artRef = token.match(/§ARTREF§(\d+)§\/ARTREF§/);
                if (artRef) {
                  return (
                    <button key={j} onClick={() => onArticleClick(parseInt(artRef[1]))}
                      style={{ color: "#1e3a5f", textDecoration: "underline", textDecorationColor: "#93b3d4", cursor: "pointer", fontWeight: 500, background: "none", border: "none", fontFamily: "inherit", fontSize: "inherit", padding: 0 }}>
                      Article {artRef[1]}
                    </button>
                  );
                }
                if (inHL) return <mark key={j} style={{ backgroundColor: "#fef08a", borderRadius: 2, padding: "0 2px" }}>{token}</mark>;
                return <span key={j}>{token}</span>;
              })}
            </p>
          );
        })}
      </div>

      {/* Cross-referenced Articles */}
      {referencedArticles.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: SANS, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            Cross-referenced Articles
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {referencedArticles.map((num) => {
              const ref = EU_AI_ACT_DATA.articles[String(num)];
              return (
                <button key={num} onClick={() => onArticleClick(num)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13, background: "#f8f9fa", color: "#374151", borderRadius: 10, border: "1px solid #e2e8f0", cursor: "pointer", fontFamily: SANS, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#93b3d4"; e.currentTarget.style.backgroundColor = "#f0f4ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.backgroundColor = "#f8f9fa"; }}
                >
                  <span style={{ fontWeight: 600 }}>Art. {num}</span>
                  {ref && <span style={{ color: "#6b7280", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ref.title}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Recitals */}
      <InlineRecitals articleNumber={articleNum} onArticleClick={onArticleClick} />
    </div>
  );
}
