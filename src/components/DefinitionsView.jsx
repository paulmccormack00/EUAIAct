import { useState, useMemo } from "react";
import { SANS, SERIF, COLORS, RADIUS } from "../constants.js";
import { highlightText, renderHighlightedParts } from "../utils.jsx";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { ASTRO_LOST } from "../assets.js";

export default function DefinitionsView({ onArticleClick, searchQuery: globalSearch }) {
  const [defSearch, setDefSearch] = useState("");
  const [expandedDefs, setExpandedDefs] = useState(new Set());

  const article = EU_AI_ACT_DATA.articles["3"];

  // Parse definitions from article text
  const definitions = useMemo(() => {
    const text = article.text;
    const defPattern = /\((\d+)\)\s+([\u2018\u2019'\"]+([^\u2018\u2019'\"]+)[\u2018\u2019'\"]+\s+means\s+)/g;
    const results = [];
    let match;
    const starts = [];

    // Find all definition start positions
    const allPattern = /\((\d+)\)\s+[\u2018\u2019'\"]+([^\u2018\u2019'\"]+)[\u2018\u2019'\"]+\s+means\s+/g;
    while ((match = allPattern.exec(text)) !== null) {
      starts.push({ num: parseInt(match[1]), term: match[2].trim(), start: match.index, contentStart: match.index });
    }

    // Extract each definition's full text
    for (let i = 0; i < starts.length; i++) {
      const start = starts[i].contentStart;
      const end = i + 1 < starts.length ? starts[i + 1].contentStart : text.length;
      let defText = text.substring(start, end).trim();
      // Clean up: remove the leading (N) 'term' means prefix for the body
      const bodyMatch = defText.match(/^\(\d+\)\s+[\u2018\u2019'\"]+[^\u2018\u2019'\"]+[\u2018\u2019'\"]+\s+means\s+(.*)/s);
      const body = bodyMatch ? bodyMatch[1].trim().replace(/;\s*$/, '.') : defText;

      results.push({
        num: starts[i].num,
        term: starts[i].term,
        body: body,
      });
    }
    return results;
  }, [article.text]);

  // Filter definitions
  const query = defSearch.toLowerCase();
  const filtered = query.length >= 2
    ? definitions.filter(d => d.term.toLowerCase().includes(query) || d.body.toLowerCase().includes(query))
    : definitions;

  // Group by first letter
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(d => {
      const letter = d.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(d);
    });
    // Sort within groups
    Object.values(groups).forEach(g => g.sort((a, b) => a.term.localeCompare(b.term)));
    return groups;
  }, [filtered]);

  const letters = Object.keys(grouped).sort();

  const toggleDef = (num) => {
    setExpandedDefs(prev => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
  };

  const expandAll = () => setExpandedDefs(new Set(filtered.map(d => d.num)));
  const collapseAll = () => setExpandedDefs(new Set());

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, color: "#5c4d38", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontFamily: SANS }}>CHAPTER I · Article 3</p>
        <h1 className="view-title" style={{ fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: 0, fontFamily: SERIF, lineHeight: 1.2 }}>
          Definitions
        </h1>
        <p style={{ fontSize: 15, color: "#546478", margin: "8px 0 0", fontFamily: SANS }}>
          {definitions.length} defined terms used throughout the AI Act
        </p>
      </div>

      {/* Search + controls */}
      <div className="def-controls" style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <div className="def-search-wrap" style={{ flex: 1, minWidth: 250, display: "flex", alignItems: "center", background: "white", border: "1.5px solid #e2e0dc", borderRadius: 10, padding: "8px 14px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5f74" strokeWidth="2" aria-hidden="true" style={{ marginRight: 10, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Filter definitions…"
            aria-label="Filter definitions"
            value={defSearch}
            onChange={(e) => setDefSearch(e.target.value)}
            style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, fontFamily: SANS, color: "#1e293b" }}
          />
          {defSearch && (
            <button onClick={() => setDefSearch("")} aria-label="Clear filter" style={{ background: "none", border: "none", cursor: "pointer", color: "#4a5f74", padding: 2 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={expandAll} aria-label="Expand all definitions"
            style={{ padding: "8px 14px", fontSize: 12, fontFamily: SANS, fontWeight: 500, background: "white", border: "1px solid #e2e0dc", borderRadius: 8, cursor: "pointer", color: "#4a5568" }}>
            Expand all
          </button>
          <button onClick={collapseAll} aria-label="Collapse all definitions"
            style={{ padding: "8px 14px", fontSize: 12, fontFamily: SANS, fontWeight: 500, background: "white", border: "1px solid #e2e0dc", borderRadius: 8, cursor: "pointer", color: "#4a5568" }}>
            Collapse all
          </button>
        </div>
      </div>

      {/* Letter index */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 24 }}>
        {letters.map(letter => (
          <a key={letter} href={`#def-letter-${letter}`}
            style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: SANS, color: "#1e3a5f", background: "#f0f4ff", border: "1px solid #c7d6ec", textDecoration: "none", cursor: "pointer" }}>
            {letter}
          </a>
        ))}
      </div>

      {/* Showing count */}
      {defSearch && (
        <p style={{ fontSize: 13, color: "#546478", marginBottom: 16, fontFamily: SANS }}>
          {filtered.length} definition{filtered.length !== 1 ? "s" : ""} matching "{defSearch}"
        </p>
      )}

      {/* Definitions by letter */}
      {letters.map(letter => (
        <div key={letter} id={`def-letter-${letter}`} style={{ marginBottom: 28 }}>
          <div style={{ position: "sticky", top: 0, zIndex: 5, background: "#f7f5f2", padding: "8px 0 6px", borderBottom: "2px solid #1e3a5f" }}>
            <h2 style={{ fontSize: 20, fontWeight: 400, color: "#1e3a5f", margin: 0, fontFamily: SERIF }}>{letter}</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            {grouped[letter].map(def => {
              const isExpanded = expandedDefs.has(def.num);
              return (
                <div key={def.num} style={{
                  border: `1px solid ${isExpanded ? "#93b3d4" : "#e2e0dc"}`,
                  borderRadius: 10, background: isExpanded ? "#fafcff" : "white",
                  transition: "all 0.15s",
                }}>
                  <button onClick={() => toggleDef(def.num)} aria-expanded={isExpanded}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}>
                    <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", background: "#f0f4ff", color: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: SANS }}>
                      {def.num}
                    </span>
                    <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: "#1a1a1a", fontFamily: SANS }}>
                      {defSearch.length >= 2
                        ? (() => {
                            const hl = highlightText(def.term, defSearch);
                            return renderHighlightedParts(hl);
                          })()
                        : def.term
                      }
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5f74" strokeWidth="2" aria-hidden="true" style={{ flexShrink: 0, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="def-expanded" style={{ padding: "0 16px 14px 56px" }}>
                      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0, fontFamily: SANS }}>
                        {defSearch.length >= 2
                          ? renderHighlightedParts(highlightText(def.body, defSearch))
                          : def.body
                        }
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <img src={ASTRO_LOST} alt="" width="120" height="120" aria-hidden="true" style={{ height: 120, opacity: 0.35, margin: "0 auto 12px", display: "block" }} />
          <p style={{ color: "#4a5f74", fontSize: 15, fontFamily: SANS }}>No definitions matching "{defSearch}"</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ROLE-BASED FILTERING
// ============================================================
const ROLES = {
  all: { id: "all", label: "All provisions", icon: "📋", description: "Complete Act" },
  provider: { 
    id: "provider", label: "Provider of AI", icon: "🏗", 
    description: "You develop, train, or place AI systems or GPAI models on the market",
    articles: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,25,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,71,72,73,74,78,79,80,81,82,83,84,95,96,99,100,101,111,112,113]
  },
  deployer: { 
    id: "deployer", label: "Deployer of AI", icon: "⚙", 
    description: "You use AI systems under your authority in a professional capacity",
    articles: [1,2,3,4,5,6,7,9,13,14,15,20,25,26,27,43,49,50,57,58,60,61,62,71,72,73,74,78,85,86,87,95,96,99,111,112,113]
  },
  affected: { 
    id: "affected", label: "Affected person", icon: "👤", 
    description: "You are subject to decisions made by AI systems and want to understand your rights",
    articles: [1,2,3,4,5,50,77,85,86,87,95,96,99,112,113]
  },
};
