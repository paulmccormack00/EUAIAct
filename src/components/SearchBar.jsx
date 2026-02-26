import { useEffect, useRef, memo } from "react";
import { SANS, COLORS, RADIUS, SHADOWS } from "../constants.js";

export default memo(function SearchBar({ query, setQuery, resultCount }) {
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
        background: COLORS.white, border: `1.5px solid ${COLORS.borderSubtle}`, borderRadius: RADIUS.lg,
        padding: "10px 16px", transition: "all 0.2s",
      }}
        onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.boxShadow = SHADOWS.focus; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.borderSubtle; e.currentTarget.style.boxShadow = "none"; }}
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.textPlaceholder} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 12, flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          aria-label="Search articles, recitals, or keywords"
          placeholder="Search articles, recitals, or keywords…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1, border: "none", background: "transparent",
            fontSize: 14, fontFamily: SANS, color: COLORS.textPrimary,
          }}
        />
        {query ? (
          <button onClick={() => setQuery("")} aria-label="Clear search" style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textPlaceholder, padding: 8, minWidth: 32, minHeight: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        ) : (
          <kbd className="kbd-shortcut" style={{ display: "inline-flex", padding: "2px 8px", fontSize: 11, color: COLORS.textPlaceholder, background: COLORS.subtleBg, borderRadius: RADIUS.xs, border: `1px solid ${COLORS.borderSubtle}`, fontFamily: SANS }}>⌘K</kbd>
        )}
      </div>
      {query && (
        <div aria-live="polite" aria-atomic="true" style={{ position: "absolute", right: 16, top: "100%", marginTop: 4, fontSize: 12, color: COLORS.textMuted, fontFamily: SANS }}>
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
})
