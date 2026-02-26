import { SANS, SERIF, COLORS, RADIUS } from "../../constants.js";
import { ASTRO_THUMBS } from "../../assets.js";
import useFocusTrap from "../../hooks/useFocusTrap.js";

export default function AboutModal({ onClose, onKeyDown }) {
  const trapRef = useFocusTrap(true);

  return (
    <div ref={trapRef} role="dialog" aria-modal="true" aria-labelledby="about-modal-title" onKeyDown={onKeyDown}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
      <div className="modal-content" style={{ position: "relative", background: COLORS.white, borderRadius: RADIUS.round, maxWidth: 560, width: "100%", padding: "36px 40px", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close dialog"
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: COLORS.textPlaceholder, padding: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: RADIUS.xl, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryHover})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 22 }}>⚖</div>
          <div>
            <h2 id="about-modal-title" style={{ fontSize: 22, fontWeight: 400, margin: 0, fontFamily: SERIF, color: COLORS.textPrimary }}>EU AI Act Navigator</h2>
            <p style={{ fontSize: 13, color: COLORS.warmText, margin: 0, fontFamily: SANS }}>Interactive Reference Tool</p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #f0ebe4", paddingTop: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#5c4d38", margin: "0 0 10px", fontFamily: SANS }}>Created with a little help from Claude</h3>
          <p style={{ fontSize: 18, fontWeight: 400, color: "#1a1a1a", margin: "0 0 4px", fontFamily: SERIF }}>Paul McCormack</p>
          <p style={{ fontSize: 13, color: "#4d5d71", lineHeight: 1.6, margin: "0 0 16px", fontFamily: SANS }}>
            Founder, dual-qualified lawyer (England & Wales / New York), and Director of Product Management at Salesforce. 16+ years in data privacy, AI governance, and regulatory technology — including founding <a href="https://kormoon.ai/" target="_blank" rel="noopener noreferrer" style={{ color: "#1e3a5f", textDecoration: "underline", textDecorationColor: "#93b3d4" }}>Kormoon</a>, a privacy software company acquired by Privitar and later Informatica (now Salesforce).
          </p>
        </div>

        <div style={{ borderTop: "1px solid #f0ebe4", paddingTop: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#5c4d38", margin: "0 0 10px", fontFamily: SANS }}>Why this tool exists</h3>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0, fontFamily: SANS }}>
            The EU AI Act is one of the most consequential pieces of technology regulation in a generation. But like the GDPR before it, its 113 articles and 180 recitals are difficult to navigate without understanding how they interrelate. The recitals are essential — they provide the legislative intent, the context, and the interpretive guidance that practitioners need to apply the law properly.
          </p>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "12px 0 0", fontFamily: SANS }}>
            This tool maps every recital to its corresponding articles, groups provisions by theme, and makes the entire Act searchable and cross-referenced — so that lawyers, compliance teams, product managers, and policymakers can quickly find what they need and understand the full picture.
          </p>
        </div>

        <div style={{ borderTop: "1px solid #f0ebe4", paddingTop: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#5c4d38", margin: "0 0 10px", fontFamily: SANS }}>Feedback & Contact</h3>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 14px", fontFamily: SANS }}>
            This is a living tool. If you spot an error in the cross-references, have suggestions for additional features, or would like to discuss the AI Act's application to your business — I'd love to hear from you.
          </p>
          <a href="https://www.linkedin.com/in/paulmccormack1/" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", background: "#0a66c2", color: "white",
              borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: "none",
              fontFamily: SANS, transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            Connect on LinkedIn
          </a>
          <img src={ASTRO_THUMBS} alt="" width="100" height="100" aria-hidden="true" style={{ position: "absolute", right: -10, bottom: -20, height: 100, opacity: 0.3 }} />
        </div>

        <div style={{ borderTop: "1px solid #f0ebe4", paddingTop: 16 }}>
          <p style={{ fontSize: 12, color: "#4a5f74", margin: 0, fontFamily: SANS, lineHeight: 1.5 }}>
            Based on the official text published in the Official Journal of the European Union (OJ L, 2024/1689, 12.7.2024). This tool is for informational purposes and does not constitute legal advice. Recital-to-article mappings reflect editorial judgment and may be updated.
          </p>
        </div>
      </div>
    </div>
  );
}
