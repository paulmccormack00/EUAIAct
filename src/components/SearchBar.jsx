import { useEffect, useRef } from "react";
import { SANS } from "../constants.js";

export default function SearchBar({ query, setQuery, resultCount }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setQuery]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center",
        background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10,
        padding: "10px 16px", transition: "all 0.2s",
      }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#1e3a5f"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,58,95,0.08)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 12, flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search articles, recitals, or keywords…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1, outline: "none", border: "none", background: "transparent",
            fontSize: 14, fontFamily: SANS, color: "#1e293b",
          }}
        />
        {query ? (
          <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        ) : (
          <kbd className="kbd-shortcut" style={{ display: "inline-flex", padding: "2px 8px", fontSize: 11, color: "#94a3b8", background: "#f8fafc", borderRadius: 4, border: "1px solid #e2e8f0", fontFamily: SANS }}>⌘K</kbd>
        )}
      </div>
      {query && (
        <div style={{ position: "absolute", right: 16, top: "100%", marginTop: 4, fontSize: 12, color: "#64748b", fontFamily: SANS }}>
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
