import { useState, useEffect, useRef } from "react";
import { SANS, SERIF } from "../constants.js";
import { EU_AI_ACT_DATA } from "../data/eu-ai-act-data.js";
import { RECITAL_TO_ARTICLE_MAP } from "../data/recital-maps.js";

export default function ChatPanel({ isOpen, onClose, onArticleClick, onRecitalClick, currentArticle }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => "s_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36));
  const [questionCount, setQuestionCount] = useState(0);
  const FREE_LIMIT = 5;
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (isOpen && inputRef.current) setTimeout(() => inputRef.current.focus(), 300); }, [isOpen]);

  const isLimited = questionCount >= FREE_LIMIT;

  const sendMessage = async () => {
    const q = input.trim();
    if (!q || loading) return;

    if (isLimited) {
      setMessages(prev => [...prev,
        { role: "user", content: q },
        { role: "assistant", content: "You've used your " + FREE_LIMIT + " complimentary questions for this session. To continue using the AI Act Advisor, get in touch at paul@kormoon.ai to discuss access options.\n\nIn the meantime, you can still browse all 113 articles, plain English summaries, and thematic groupings in the navigator." }
      ]);
      setInput("");
      return;
    }

    setInput("");
    const userMsg = { role: "user", content: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const contextArticle = currentArticle ? `The user is currently viewing Article ${currentArticle} ("${EU_AI_ACT_DATA.articles[String(currentArticle)]?.title || ""}").` : "";

      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].slice(-10),
          context: contextArticle,
          sessionId,
          question: q,
        }),
      });

      if (!resp.ok) {
        const errBody = await resp.text().catch(() => "");
        console.error("Chat API error:", resp.status, errBody);
        throw new Error(resp.status);
      }

      const contentType = resp.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream")) {
        // Streaming response — read SSE events
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";

        // Add empty assistant message that we'll update
        setMessages(prev => [...prev, { role: "assistant", content: "" }]);
        setLoading(false); // Hide "Analysing..." immediately

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: [DONE]")) continue;
            if (!line.startsWith("data: ")) continue;
            try {
              const event = JSON.parse(line.slice(6));
              if (event.text) {
                accumulated += event.text;
                const snap = accumulated;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: snap };
                  return updated;
                });
              }
            } catch (e) { /* skip */ }
          }
        }
        setQuestionCount(prev => prev + 1);
        return; // loading already set to false above
      } else {
        // Non-streaming fallback (JSON response)
        const data = await resp.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
        setQuestionCount(prev => prev + 1);
      }
    } catch (e) {
      console.error("Chat error:", e);
      setMessages(prev => [...prev, { role: "assistant", content: "Unable to connect to the advisor service. Please try again." }]);
    }
    setLoading(false);
  };

  // Parse article references in response text like [Article 43] and make clickable
  const renderMessage = (text) => {
    // Convert markdown to structured elements
    const lines = text.split("\n");
    const elements = [];
    let listItems = [];
    let listType = null; // "ul" or "ol"

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          listType === "ol"
            ? <ol key={`ol-${elements.length}`} style={{ margin: "6px 0", paddingLeft: 20, fontSize: "inherit" }}>{listItems}</ol>
            : <ul key={`ul-${elements.length}`} style={{ margin: "6px 0", paddingLeft: 18, fontSize: "inherit" }}>{listItems}</ul>
        );
        listItems = [];
        listType = null;
      }
    };

    const renderInline = (str, keyPrefix) => {
      // Process bold, article refs, and inline code
      const tokens = str.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[?Article \d+\]?(?:\(\d+\))?|\[?Recital \d+\]?)/g);
      return tokens.map((tok, ti) => {
        if (!tok) return null;
        // Bold
        const boldMatch = tok.match(/^\*\*(.+)\*\*$/) || tok.match(/^__(.+)__$/);
        if (boldMatch) return <strong key={`${keyPrefix}-${ti}`}>{renderInline(boldMatch[1], `${keyPrefix}-b${ti}`)}</strong>;
        // Inline code
        if (tok.startsWith("`") && tok.endsWith("`")) return <code key={`${keyPrefix}-${ti}`} style={{ background: "#f0f0ed", padding: "1px 5px", borderRadius: 4, fontSize: "0.9em" }}>{tok.slice(1, -1)}</code>;
        // Article reference
        const artMatch = tok.match(/\[?Article (\d+)\]?/);
        if (artMatch) {
          const num = parseInt(artMatch[1]);
          if (EU_AI_ACT_DATA.articles[String(num)]) {
            return (
              <button key={`${keyPrefix}-${ti}`} onClick={() => onArticleClick(num)}
                style={{ display: "inline", background: "none", border: "none", color: "#1e3a5f", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textDecorationColor: "#93b3d4", fontFamily: "inherit", fontSize: "inherit", padding: 0 }}>
                Article {num}
              </button>
            );
          }
        }
        // Recital reference
        const recMatch = tok.match(/\[?Recital (\d+)\]?/);
        if (recMatch) {
          const num = parseInt(recMatch[1]);
          if (RECITAL_TO_ARTICLE_MAP[num]) {
            return (
              <button key={`${keyPrefix}-${ti}`} onClick={() => onRecitalClick && onRecitalClick(num)}
                style={{ display: "inline", background: "none", border: "none", color: "#8b6914", cursor: "pointer", fontWeight: 600, textDecoration: "underline", textDecorationColor: "#d4c5a9", fontFamily: "inherit", fontSize: "inherit", padding: 0 }}>
                Recital {num}
              </button>
            );
          }
        }
        return <span key={`${keyPrefix}-${ti}`}>{tok}</span>;
      });
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines (but flush lists)
      if (!trimmed) { flushList(); continue; }

      // Headers → bold text with spacing
      if (trimmed.startsWith("# ")) { flushList(); elements.push(<p key={`h-${i}`} style={{ fontWeight: 700, fontSize: "1.05em", margin: "12px 0 4px", lineHeight: 1.4 }}>{renderInline(trimmed.replace(/^#+\s*/, ""), `h${i}`)}</p>); continue; }
      if (trimmed.startsWith("## ")) { flushList(); elements.push(<p key={`h-${i}`} style={{ fontWeight: 700, margin: "10px 0 3px", lineHeight: 1.4 }}>{renderInline(trimmed.replace(/^#+\s*/, ""), `h${i}`)}</p>); continue; }
      if (trimmed.startsWith("### ")) { flushList(); elements.push(<p key={`h-${i}`} style={{ fontWeight: 600, margin: "8px 0 2px", lineHeight: 1.4 }}>{renderInline(trimmed.replace(/^#+\s*/, ""), `h${i}`)}</p>); continue; }

      // Horizontal rule
      if (/^---+$/.test(trimmed)) { flushList(); elements.push(<hr key={`hr-${i}`} style={{ border: "none", borderTop: "1px solid #e2e0dc", margin: "10px 0" }} />); continue; }

      // Ordered list items
      const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (olMatch) {
        if (listType !== "ol") { flushList(); listType = "ol"; }
        listItems.push(<li key={`li-${i}`} style={{ margin: "3px 0", lineHeight: 1.55 }}>{renderInline(olMatch[2], `li${i}`)}</li>);
        continue;
      }

      // Unordered list items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (listType !== "ul") { flushList(); listType = "ul"; }
        listItems.push(<li key={`li-${i}`} style={{ margin: "3px 0", lineHeight: 1.55 }}>{renderInline(trimmed.replace(/^[-*]\s+/, ""), `li${i}`)}</li>);
        continue;
      }

      // Regular paragraph
      flushList();
      elements.push(<p key={`p-${i}`} style={{ margin: "4px 0", lineHeight: 1.6 }}>{renderInline(trimmed, `p${i}`)}</p>);
    }
    flushList();
    return elements;
  };

  const defaultPrompts = [
    "Does my AI system count as high-risk?",
    "What are my FRIA obligations under Article 27?",
    "What's the difference between a provider and deployer?",
    "When do the high-risk AI rules take effect?",
  ];
  const [suggestedQuestions, setSuggestedQuestions] = useState(defaultPrompts);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/trending").then(r => r.json()).then(data => {
      if (data.prompts && data.prompts.length === 4) setSuggestedQuestions(data.prompts);
    }).catch(() => {});
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 40 }} />}

      {/* Panel */}
      <div className="chat-panel" style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 420, maxWidth: "100vw",
        background: "white", zIndex: 50, display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ flexShrink: 0, padding: "16px 20px", borderBottom: "1px solid #e8e4de", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16 }}>⚖</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1a1a1a", fontFamily: SANS }}>AI Act Advisor</h3>
              <p style={{ margin: 0, fontSize: 11, color: "#8b7355", fontFamily: SANS }}>Powered by Claude</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {questionCount > 0 && (
              <span style={{ fontSize: 11, color: isLimited ? "#dc2626" : "#94a3b8", fontFamily: SANS, fontWeight: 500 }}>
                {questionCount}/{FREE_LIMIT}
              </span>
            )}
          <button onClick={onClose} style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ flexShrink: 0, padding: "10px 20px", background: "#fffbeb", borderBottom: "1px solid #fde68a", fontSize: 11, color: "#92400e", fontFamily: SANS, lineHeight: 1.5 }}>
          For general guidance only — always verify against the official legislative text.
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#f0f4ff", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>💬</div>
              <h4 style={{ margin: "0 0 6px", fontSize: 16, color: "#1a1a1a", fontFamily: SANS }}>Ask about the EU AI Act</h4>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b", fontFamily: SANS, lineHeight: 1.5 }}>
                Get plain-English answers about obligations, classifications, timelines, and compliance requirements.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {suggestedQuestions.map((sq) => (
                  <button key={sq} onClick={() => { setInput(sq); }}
                    style={{ padding: "10px 14px", background: "#f7f5f2", border: "1px solid #e8e4de", borderRadius: 10, cursor: "pointer", textAlign: "left", fontSize: 13, color: "#4a5568", fontFamily: SANS, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#93b3d4"; e.currentTarget.style.background = "#f0f4ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e4de"; e.currentTarget.style.background = "#f7f5f2"; }}>
                    {sq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "88%", padding: "12px 16px", borderRadius: 14,
                background: msg.role === "user" ? "#1e3a5f" : "#f7f5f2",
                color: msg.role === "user" ? "white" : "#1a1a1a",
                fontSize: 14, lineHeight: 1.65, fontFamily: SANS,
                borderBottomRightRadius: msg.role === "user" ? 4 : 14,
                borderBottomLeftRadius: msg.role === "user" ? 14 : 4,
              }}>
                {msg.role === "assistant" ? renderMessage(msg.content) : msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8", animation: `chatBounce 1.2s ${i * 0.15}s infinite ease-in-out` }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: SANS }}>Analysing…</span>
              <style>{`@keyframes chatBounce { 0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }`}</style>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ flexShrink: 0, padding: "12px 16px", borderTop: "1px solid #e8e4de", background: "white" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about the EU AI Act…"
              rows={1}
              style={{
                flex: 1, padding: "10px 14px", border: "1.5px solid #e2e0dc", borderRadius: 12, fontSize: 14, fontFamily: SANS,
                resize: "none", outline: "none", lineHeight: 1.5, maxHeight: 120, minHeight: 40,
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#93b3d4"}
              onBlur={e => e.currentTarget.style.borderColor = "#e2e0dc"}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
              style={{
                padding: "10px 14px", borderRadius: 12, border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                background: input.trim() && !loading ? "#1e3a5f" : "#e2e0dc", color: "white", flexShrink: 0,
                transition: "background 0.15s",
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 10, color: "#94a3b8", textAlign: "center", fontFamily: SANS }}>
            Responses are AI-generated and may not reflect the latest guidance
          </p>
        </div>
      </div>
    </>
  );
}

// ============================================================
// MAIN APP
