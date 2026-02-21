import { useState } from "react";
import { SANS, SERIF } from "../constants.js";

const DEADLINES = [
  {
    date: "1 August 2024",
    isoDate: "2024-08-01",
    title: "Entry into Force",
    status: "passed",
    description: "The EU AI Act (Regulation (EU) 2024/1689) entered into force, starting the phased implementation timeline.",
    articles: ["Article 113"],
    details: [
      "Published in the Official Journal on 12 July 2024",
      "20-day period before entry into force",
      "Sets the clock for all subsequent deadlines",
    ],
  },
  {
    date: "2 February 2025",
    isoDate: "2025-02-02",
    title: "Prohibited AI Practices & AI Literacy",
    status: "passed",
    description: "Prohibitions on unacceptable-risk AI practices take effect. AI literacy obligations begin for providers and deployers.",
    articles: ["Article 5", "Article 4"],
    details: [
      "Ban on social scoring, manipulative AI, emotion recognition in workplaces/schools, real-time biometric identification (with exceptions)",
      "Organisations must ensure staff have sufficient AI literacy",
      "6-month transition from entry into force",
    ],
  },
  {
    date: "2 August 2025",
    isoDate: "2025-08-02",
    title: "GPAI Obligations, Governance & Penalties",
    status: "current",
    description: "General-purpose AI model rules apply. EU AI governance structure becomes operational. Penalty framework is enforceable.",
    articles: ["Articles 51-56", "Articles 64-65", "Article 99"],
    details: [
      "GPAI providers must comply with transparency, documentation, and copyright obligations",
      "Systemic risk GPAI models face additional requirements (adversarial testing, incident reporting)",
      "EU AI Office, AI Board, and national competent authorities fully operational",
      "Penalties: up to EUR 35M / 7% turnover for prohibited practices; EUR 15M / 3% for other violations",
      "12-month transition from entry into force",
    ],
  },
  {
    date: "2 February 2026",
    isoDate: "2026-02-02",
    title: "Notified Bodies Designation",
    status: "upcoming",
    description: "Member States must have designated notified bodies for conformity assessment of high-risk AI systems.",
    articles: ["Articles 28-39"],
    details: [
      "Notified bodies perform third-party conformity assessments for certain high-risk systems",
      "Required for biometric AI systems under Annex III",
      "18-month transition from entry into force",
    ],
  },
  {
    date: "2 August 2026",
    isoDate: "2026-08-02",
    title: "Full Application — High-Risk AI Systems",
    status: "critical",
    description: "All remaining provisions apply, including high-risk AI system obligations, FRIA requirements, conformity assessments, and the full deployer/provider obligation framework.",
    articles: ["Article 6-7", "Articles 8-15", "Article 26-27", "Article 43", "Article 50"],
    details: [
      "High-risk AI systems must comply with Articles 8-15 (data governance, documentation, transparency, human oversight, accuracy, robustness, cybersecurity)",
      "Deployers of high-risk AI must conduct FRIAs under Article 27",
      "Provider obligations: quality management, conformity assessment, CE marking, registration",
      "Deployer obligations: human oversight, monitoring, incident reporting",
      "Transparency obligations for limited-risk AI (deepfakes, chatbots, emotion recognition)",
      "24-month transition from entry into force",
    ],
    highlight: true,
  },
  {
    date: "2 August 2027",
    isoDate: "2027-08-02",
    title: "Annex I Products — EU Safety Legislation",
    status: "future",
    description: "High-risk AI systems embedded in products covered by EU harmonised safety legislation (Annex I) must comply.",
    articles: ["Article 6(1)", "Annex I"],
    details: [
      "Covers AI in: machinery, toys, lifts, medical devices, civil aviation, motor vehicles, marine equipment, rail systems",
      "These AI systems follow the Article 6(1) route — classified as high-risk through existing product safety frameworks",
      "36-month transition from entry into force",
    ],
  },
  {
    date: "31 December 2027",
    isoDate: "2027-12-31",
    title: "Digital Omnibus Proposal — Potential Long-Stop",
    status: "tentative",
    description: "The European Commission's Digital Omnibus proposal may extend certain deadlines. This is under legislative negotiation and not yet confirmed.",
    articles: ["Digital Omnibus Regulation (proposed)"],
    details: [
      "Proposed simplification of obligations for SMEs",
      "May extend the high-risk application deadline for certain categories",
      "Currently in trilogue negotiations — outcome uncertain",
      "Organisations should prepare for the August 2026 deadline regardless",
    ],
  },
];

function daysUntil(isoDate) {
  const target = new Date(isoDate);
  const now = new Date();
  return Math.ceil((target - now) / 86400000);
}

function getStatusColor(status) {
  switch (status) {
    case "passed": return { bg: "#f0fdf4", border: "#bbf7d0", dot: "#16a34a", text: "#166534" };
    case "current": return { bg: "#f0f4ff", border: "#c7d6ec", dot: "#1e3a5f", text: "#1e3a5f" };
    case "upcoming": return { bg: "#fffbeb", border: "#fde68a", dot: "#d97706", text: "#92400e" };
    case "critical": return { bg: "#fef2f2", border: "#fecaca", dot: "#dc2626", text: "#991b1b" };
    case "future": return { bg: "#f8fafc", border: "#e2e8f0", dot: "#94a3b8", text: "#64748b" };
    case "tentative": return { bg: "#faf5ff", border: "#e9d5ff", dot: "#7c3aed", text: "#5b21b6" };
    default: return { bg: "#f8fafc", border: "#e2e8f0", dot: "#94a3b8", text: "#64748b" };
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "passed": return "Passed";
    case "current": return "Current Phase";
    case "upcoming": return "Upcoming";
    case "critical": return "Key Deadline";
    case "future": return "Future";
    case "tentative": return "Tentative";
    default: return "";
  }
}

export default function DeadlineTracker({ onArticleClick }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [subscribeError, setSubscribeError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscribeEmail)) {
      setSubscribeStatus("error");
      setSubscribeError("Please enter a valid email address.");
      return;
    }
    setSubscribeStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribeStatus("success");
      } else if (res.status === 409 || data.error === "duplicate") {
        setSubscribeStatus("success");
      } else {
        setSubscribeStatus("error");
        setSubscribeError(data.error || "Something went wrong.");
      }
    } catch {
      setSubscribeStatus("error");
      setSubscribeError("Network error. Please try again.");
    }
  };

  const friaDeadline = DEADLINES.find(d => d.status === "critical");
  const daysToFria = friaDeadline ? daysUntil(friaDeadline.isoDate) : 0;

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 0" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 20, fontSize: 12, color: "#991b1b", fontWeight: 600, marginBottom: 16, fontFamily: SANS }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {daysToFria} days until full application
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 400, color: "#1a1a1a", margin: "0 0 8px", fontFamily: SERIF }}>
          EU AI Act Compliance Timeline
        </h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, maxWidth: 600, margin: "0 auto", fontFamily: SANS }}>
          Every deadline you need to know — from prohibited practices to full application. Track milestones, understand obligations, and prepare your organisation.
        </p>
      </div>

      {/* Countdown hero */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 50%, #1e3a5f 100%)",
        borderRadius: 20, padding: "32px 40px", marginBottom: 36, color: "white",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
      }}>
        <div>
          <p style={{ fontSize: 13, opacity: 0.7, margin: "0 0 4px", fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.1em" }}>FRIA Deadline</p>
          <p style={{ fontSize: 36, fontWeight: 400, margin: "0 0 4px", fontFamily: SERIF }}>2 August 2026</p>
          <p style={{ fontSize: 14, opacity: 0.8, margin: 0, fontFamily: SANS }}>Article 27 — Fundamental Rights Impact Assessment</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 48, fontWeight: 400, margin: "0 0 4px", fontFamily: SERIF, color: "#d4c5a9" }}>{daysToFria}</p>
          <p style={{ fontSize: 13, opacity: 0.7, margin: 0, fontFamily: SANS }}>days remaining</p>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 32 }}>
        {/* Vertical line */}
        <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "#e8e4de" }} />

        {DEADLINES.map((deadline, idx) => {
          const colors = getStatusColor(deadline.status);
          const expanded = expandedIdx === idx;
          const days = daysUntil(deadline.isoDate);
          const isPast = days < 0;

          return (
            <div key={idx} style={{ position: "relative", marginBottom: 16 }}>
              {/* Dot */}
              <div style={{
                position: "absolute", left: -27, top: 24, width: 14, height: 14, borderRadius: "50%",
                background: colors.dot, border: "3px solid white",
                boxShadow: deadline.highlight ? `0 0 0 4px ${colors.dot}33` : "0 0 0 2px #e8e4de",
                zIndex: 1,
              }} />

              {/* Card */}
              <button
                onClick={() => setExpandedIdx(expanded ? null : idx)}
                style={{
                  width: "100%", textAlign: "left", padding: "20px 24px",
                  background: expanded ? colors.bg : "white",
                  border: `1px solid ${expanded ? colors.border : "#e8e4de"}`,
                  borderRadius: 14, cursor: "pointer", fontFamily: SANS,
                  transition: "all 0.2s", boxShadow: expanded ? "0 4px 16px rgba(0,0,0,0.06)" : "none",
                  borderLeft: deadline.highlight ? `4px solid ${colors.dot}` : `1px solid ${expanded ? colors.border : "#e8e4de"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{deadline.date}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                        background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
                      }}>
                        {getStatusLabel(deadline.status)}
                      </span>
                      {!isPast && deadline.status !== "passed" && (
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                          {days} days
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>{deadline.title}</h3>
                    <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{deadline.description}</p>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
                    style={{ flexShrink: 0, marginTop: 4, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>

                {expanded && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${colors.border}` }}>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                      {deadline.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                    {deadline.articles.length > 0 && (
                      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                        {deadline.articles.map((art) => {
                          const match = art.match(/Article[s]?\s+(\d+)/);
                          const artNum = match ? Number(match[1]) : null;
                          return (
                            <button
                              key={art}
                              onClick={(e) => { e.stopPropagation(); if (artNum) onArticleClick?.(artNum); }}
                              style={{
                                padding: "4px 12px", background: "white", border: "1px solid #c7d6ec",
                                borderRadius: 6, fontSize: 12, color: "#1e3a5f", fontWeight: 500,
                                cursor: artNum ? "pointer" : "default", fontFamily: SANS,
                              }}
                            >
                              {art}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Email alerts */}
      <div style={{
        marginTop: 36, padding: "28px 32px", background: "white", borderRadius: 16,
        border: "1px solid #e8e4de", borderLeft: "4px solid #1e3a5f",
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 500, color: "#1e3a5f", margin: "0 0 6px", fontFamily: SERIF }}>
          Get Deadline Alerts
        </h3>
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", fontFamily: SANS }}>
          Be notified when key deadlines approach and when the official FRIA template is published.
        </p>
        {subscribeStatus === "success" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            <span style={{ fontSize: 14, color: "#16a34a", fontWeight: 500, fontFamily: SANS }}>You're subscribed to deadline alerts.</span>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 10 }}>
              <input
                type="email"
                placeholder="you@company.com"
                value={subscribeEmail}
                onChange={e => { setSubscribeEmail(e.target.value); if (subscribeStatus === "error") setSubscribeStatus(null); }}
                style={{
                  flex: 1, padding: "12px 16px", border: subscribeStatus === "error" ? "1.5px solid #ef4444" : "1px solid #d1d5db",
                  borderRadius: 10, fontSize: 14, fontFamily: SANS, outline: "none",
                }}
              />
              <button type="submit" disabled={subscribeStatus === "loading"} style={{
                padding: "12px 24px", background: "#1e3a5f", color: "white", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: SANS,
                opacity: subscribeStatus === "loading" ? 0.7 : 1,
              }}>
                {subscribeStatus === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
            {subscribeStatus === "error" && subscribeError && (
              <p style={{ fontSize: 12, color: "#ef4444", margin: "8px 0 0", fontFamily: SANS }}>{subscribeError}</p>
            )}
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "10px 0 0", fontFamily: SANS }}>No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>

      {/* Digital Omnibus Note */}
      <div style={{
        marginTop: 24, padding: "20px 24px", background: "#faf5ff", borderRadius: 12,
        border: "1px solid #e9d5ff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#5b21b6", fontFamily: SANS }}>Digital Omnibus Watch</span>
        </div>
        <p style={{ fontSize: 13, color: "#6b21a8", lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
          The European Commission's Digital Omnibus Regulation proposal may modify certain deadlines and simplify obligations for SMEs.
          This is currently in legislative negotiation. <strong>We recommend preparing for the existing August 2026 deadline</strong> regardless of the outcome — deadline uncertainty is not a reason to delay.
        </p>
      </div>
    </div>
  );
}
