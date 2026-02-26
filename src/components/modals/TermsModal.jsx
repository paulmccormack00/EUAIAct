import { SANS, SERIF, COLORS, RADIUS } from "../../constants.js";
import useFocusTrap from "../../hooks/useFocusTrap.js";

export default function TermsModal({ onClose, onKeyDown }) {
  const trapRef = useFocusTrap(true);

  return (
    <div ref={trapRef} role="dialog" aria-modal="true" aria-labelledby="terms-modal-title" onKeyDown={onKeyDown}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
      <div className="modal-content" style={{ position: "relative", background: COLORS.white, borderRadius: RADIUS.round, maxWidth: 620, width: "100%", padding: "36px 40px", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close dialog"
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: COLORS.textPlaceholder, padding: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <h2 id="terms-modal-title" style={{ fontSize: 22, fontWeight: 400, margin: "0 0 4px", fontFamily: SERIF, color: "#1a1a1a" }}>Terms of Use</h2>
        <p style={{ fontSize: 13, color: "#6b5a42", margin: "0 0 24px", fontFamily: SANS }}>Last updated: February 2026</p>

        {[
          { title: "About this tool", text: "The EU AI Act Navigator (\u201cTool\u201d) is provided by Paul McCormack as a free, informational reference tool. It is designed to help users navigate the EU Artificial Intelligence Act (Regulation (EU) 2024/1689). The Tool is not a law firm product and is not authorised or regulated by any legal professional body." },
          { title: "Not legal advice", text: "The content provided through this Tool \u2014 including the AI-powered chat feature \u2014 is for general informational purposes only and does not constitute legal advice. AI-generated responses may be inaccurate, incomplete, or out of date. While every effort has been made to ensure accuracy, the cross-referencing of recitals to articles reflects editorial judgment. You should not rely on this Tool as a substitute for professional legal advice. Always consult a qualified lawyer for advice specific to your circumstances." },
          { title: "AI chat feature", text: "This Tool includes an AI-powered chat feature (\u201cAI Chat\u201d) that uses Claude, an AI model developed by Anthropic, to answer questions about the EU AI Act. AI Chat responses are generated automatically and have not been reviewed by a legal professional. The AI may produce incorrect or misleading information. You use the AI Chat at your own risk and should independently verify any information it provides. Chat interactions (your questions and the AI\u2019s responses) are logged anonymously for the purpose of improving the Tool \u2014 see our Privacy Notice for details." },
          { title: "Third-party services", text: "This Tool relies on third-party services to operate: Vercel (hosting and serverless functions), Anthropic (AI model provider for the chat feature), and Supabase (anonymous chat log storage). Your use of this Tool is also subject to the terms and policies of these providers. We are not responsible for the availability, performance, or practices of any third-party service." },
          { title: "Use of content", text: "The legislative text reproduced in this Tool is sourced from the Official Journal of the European Union and is subject to EU copyright rules. The editorial elements \u2014 including the thematic groupings, cross-reference mappings, and interface design \u2014 are \u00a9 2026 Paul McCormack. All rights reserved. You may use this Tool for personal and professional reference. You may not reproduce, redistribute, or commercialise the editorial content or the Tool itself without prior written consent." },
          { title: "No warranty", text: "This Tool is provided \u201cas is\u201d without warranties of any kind, express or implied. We do not warrant that the Tool or its AI Chat feature will be error-free, uninterrupted, or free of harmful components. We shall not be liable for any loss or damage arising from your use of or reliance on this Tool, including any reliance on AI-generated content." },
          { title: "Changes", text: "We may update these terms from time to time. Any changes will be reflected on this page. Continued use of the Tool following any changes constitutes your acceptance of the updated terms." },
          { title: "Governing law", text: "These terms are governed by and interpreted in accordance with the laws of England and Wales." },
          { title: "Contact", text: "Questions about these terms are welcomed. Please reach out via LinkedIn or through kormoon.ai." },
        ].map(({ title, text }, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px", fontFamily: SANS }}>{title}</h3>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0, fontFamily: SANS }}>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
