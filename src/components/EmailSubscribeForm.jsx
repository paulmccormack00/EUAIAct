import { useState } from "react";
import { SANS, SERIF, COLORS, RADIUS } from "../constants.js";

export default function EmailSubscribeForm({
  heading,
  headingFont = SERIF,
  description,
  submitLabel = "Subscribe",
  loadingLabel = "Subscribing…",
  successMessage = "You're subscribed!",
  duplicateMessage = "You're already subscribed! We'll be in touch.",
  headerSlot,
  compact = false,
  onSuccess,
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        onSuccess?.();
      } else if (res.status === 409 || data.error === "duplicate") {
        setStatus("duplicate");
      } else {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: compact ? "12px 0" : "14px 0" }}>
        <div style={{ width: 28, height: 28, borderRadius: RADIUS.full, background: COLORS.successAccent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.successDot} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <p style={{ fontSize: 14, color: COLORS.successDot, fontWeight: 500, margin: 0, fontFamily: SANS }}>
          {successMessage}
        </p>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: compact ? "12px 0" : "14px 0" }}>
        <div style={{ width: 28, height: 28, borderRadius: RADIUS.full, background: COLORS.infoBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.infoText} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <p style={{ fontSize: 14, color: COLORS.infoText, fontWeight: 500, margin: 0, fontFamily: SANS }}>
          {duplicateMessage}
        </p>
      </div>
    );
  }

  return (
    <div>
      {headerSlot}
      {heading && (
        <h2 style={{ fontSize: compact ? 18 : 22, fontWeight: 500, color: COLORS.primary, margin: "0 0 6px", fontFamily: headingFont }}>
          {heading}
        </h2>
      )}
      {description && (
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 16px", lineHeight: 1.6, fontFamily: SANS }}>
          {description}
        </p>
      )}
      <form className="fria-form" onSubmit={handleSubmit} style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
        <input
          className="fria-input"
          type="email"
          aria-label="Email address"
          placeholder="you@company.com"
          value={email}
          onChange={e => { setEmail(e.target.value); if (status === "error") setStatus(null); }}
          style={{
            flex: 1, minWidth: 0, padding: "12px 16px",
            border: status === "error" ? `1.5px solid ${COLORS.errorAccent}` : `1px solid ${COLORS.borderInput}`,
            borderRadius: RADIUS.lg, fontSize: 14, fontFamily: SANS, outline: "none",
            transition: "border-color 0.15s", boxSizing: "border-box",
          }}
        />
        <button
          className="fria-btn"
          type="submit"
          disabled={status === "loading"}
          style={{
            padding: "12px 24px", background: COLORS.primary, color: "white", border: "none",
            borderRadius: RADIUS.lg, fontSize: 14, fontWeight: 600,
            cursor: status === "loading" ? "wait" : "pointer",
            fontFamily: SANS, whiteSpace: "nowrap", transition: "all 0.15s",
            opacity: status === "loading" ? 0.7 : 1,
          }}
          onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.background = COLORS.primaryHover; }}
          onMouseLeave={e => { e.currentTarget.style.background = COLORS.primary; }}
        >
          {status === "loading" ? loadingLabel : submitLabel}
        </button>
      </form>
      {status === "error" && error && (
        <p style={{ fontSize: 12, color: COLORS.errorAccent, margin: "8px 0 0", fontFamily: SANS }}>{error}</p>
      )}
      <p style={{ fontSize: 11, color: COLORS.textPlaceholder, margin: "10px 0 0", fontFamily: SANS }}>No spam. Unsubscribe anytime.</p>
    </div>
  );
}
