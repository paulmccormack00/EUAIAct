import { SANS, SERIF, COLORS, RADIUS } from "../../constants.js";

export default function PrivacyModal({ onClose, onKeyDown }) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title" onKeyDown={onKeyDown}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
      <div className="modal-content" style={{ position: "relative", background: COLORS.white, borderRadius: RADIUS.round, maxWidth: 620, width: "100%", padding: "36px 40px", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close dialog"
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: COLORS.textPlaceholder, padding: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <h2 id="privacy-modal-title" style={{ fontSize: 22, fontWeight: 400, margin: "0 0 4px", fontFamily: SERIF, color: "#1a1a1a" }}>Privacy Notice</h2>
        <p style={{ fontSize: 13, color: "#8b7355", margin: "0 0 24px", fontFamily: SANS }}>Last updated: February 2026</p>

        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 20px", fontFamily: SANS }}>
          We appreciate that not everyone is a privacy geek &mdash; but we are! For that reason, we&rsquo;ve tried to make this short, simple, and transparent. This notice explains what data is collected when you use the EU AI Act Navigator and how it is handled.
        </p>

        {[
          { title: "Who we are", text: "This Tool is provided by Paul McCormack. For privacy-related questions, you can reach out via LinkedIn (linkedin.com/in/paulmccormack1) or through kormoon.ai." },
          { title: "What we collect", text: "This Tool does not require you to create an account or log in. If you use the AI Chat feature, the following data is collected and stored: the text of your questions, the AI-generated responses, an anonymous session identifier (to group messages within a single conversation), a timestamp, and automatically derived metadata such as topic category and referenced article numbers. This data does not identify you personally. If you subscribe to email updates (e.g. the FRIA deadline notification), your email address is stored in our database for the sole purpose of sending you the updates you requested. We use Vercel Analytics to collect anonymous, aggregated page-view data (pages visited, referrer, device type, and country). This does not use cookies and does not track individual users across sessions." },
          { title: "AI chat \u2014 how your data is processed", text: "When you submit a question through the AI Chat, your message is sent to a server-side function hosted on Vercel, which forwards it to Anthropic\u2019s Claude API to generate a response. Your question and the response are then stored in a database hosted by Supabase. This means your chat content is processed by three parties: Vercel (transmission), Anthropic (AI processing), and Supabase (storage). We do not send any personal identifiers to these services. Anthropic\u2019s data handling is governed by their privacy policy (anthropic.com/privacy). Supabase stores data on infrastructure provided by Amazon Web Services (AWS)." },
          { title: "Purpose and legal basis", text: "Chat data is collected for the purposes of operating and improving the Tool, understanding which topics and articles are most commonly queried, and monitoring service quality. The legal basis for this processing is legitimate interest (Article 6(1)(f) UK GDPR / EU GDPR), namely our interest in improving a free public-interest tool. We do not use chat data for marketing, profiling, or any automated decision-making that affects you." },
          { title: "Data retention", text: "Chat logs are retained for as long as they are useful for the purposes described above. We periodically review stored data and delete logs that are no longer needed. If you would like your chat data deleted, please contact us with your approximate date and time of use and we will make reasonable efforts to locate and remove it." },
          { title: "Hosting and infrastructure", text: "This Tool is hosted on Vercel. Vercel may collect standard web server logs including IP addresses, browser type, and pages visited for the purpose of operating the service. Vercel\u2019s own privacy policy applies to this processing. We use Vercel Analytics for anonymous, cookie-free page-view statistics. All fonts are self-hosted \u2014 no external font services are used. We do not use tracking cookies, third-party advertising tools, or any cross-site tracking." },
          { title: "Cookies and local storage", text: "This Tool does not set any cookies \u2014 neither first-party nor third-party. No data is stored in your browser\u2019s localStorage or sessionStorage. The AI Chat session identifier is generated in-memory when you open the chat and is discarded when you close or refresh the page. Vercel Analytics uses a server-side hash (derived from your IP address and user agent) to estimate unique visitors, which resets every 24 hours and cannot be used for cross-site tracking." },
          { title: "Third-party processors", text: "We use the following third-party services which may process data in connection with this Tool: Vercel Inc. (hosting, serverless functions, and anonymous analytics \u2014 vercel.com/legal/privacy-policy), Anthropic PBC (AI model provider \u2014 anthropic.com/privacy), and Supabase Inc. (database hosting \u2014 supabase.com/privacy). No external font services, advertising networks, or social media trackers are used. Data may be transferred to and processed in the United States by these providers. Appropriate safeguards are in place through each provider\u2019s standard contractual terms." },
          { title: "Your rights", text: "If you are in the EU/EEA or UK, you have rights under data protection law including the right to access, rectify, erase, and port your personal data, and to object to or restrict processing. Because chat data is collected anonymously, we may not be able to identify your specific records without additional information from you (such as the date, time, and content of your questions). If you have any concerns or wish to exercise your rights, please contact us." },
          { title: "Changes", text: "We may update this notice from time to time. Any changes will be reflected on this page with an updated date." },
          { title: "Contact", text: "Questions, comments, and requests regarding this privacy notice are welcomed. Please reach out via LinkedIn or through kormoon.ai." },
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
