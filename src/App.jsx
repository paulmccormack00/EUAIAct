import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FONT_FACE_CSS, SANS, COLORS, RADIUS, SHADOWS, FOCUS_CSS } from "./constants.js";
import { EU_AI_ACT_DATA } from "./data/eu-ai-act-data.js";
import { ROLES } from "./data/roles.js";
import SearchBar from "./components/SearchBar.jsx";
import SearchResults from "./components/SearchResults.jsx";
import DefinitionsView from "./components/DefinitionsView.jsx";
import ProhibitedPracticesView from "./components/ProhibitedPracticesView.jsx";
import ArticleDetail from "./components/ArticleDetail.jsx";
import ThemeView from "./components/ThemeView.jsx";
import EnhancedRecitalsTab from "./components/EnhancedRecitalsTab.jsx";
import HomeView from "./components/HomeView.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import AboutModal from "./components/modals/AboutModal.jsx";
import TermsModal from "./components/modals/TermsModal.jsx";
import PrivacyModal from "./components/modals/PrivacyModal.jsx";
import FRIAScreeningTool from "./components/FRIAScreeningTool.jsx";
import DeadlineTracker from "./components/DeadlineTracker.jsx";
import BlogView from "./components/BlogView.jsx";
import BlogPost from "./components/BlogPost.jsx";
import { BLOG_POSTS } from "./data/blog-posts.js";

// Parse initial URL to determine starting view
function parseRoute(pathname) {
  const p = pathname || "/";
  const articleMatch = p.match(/^\/article\/(\d+)$/);
  if (articleMatch) {
    const num = Number(articleMatch[1]);
    if (EU_AI_ACT_DATA.articles[String(num)]) return { view: "article", selectedArticle: num, selectedTheme: null, blogSlug: null };
  }
  const themeMatch = p.match(/^\/theme\/([a-z-]+)$/);
  if (themeMatch) {
    const tid = themeMatch[1];
    if (EU_AI_ACT_DATA.themes.find(t => t.id === tid)) return { view: "theme", selectedArticle: null, selectedTheme: tid, blogSlug: null };
  }
  if (p === "/recitals") return { view: "recitals", selectedArticle: null, selectedTheme: null, blogSlug: null };
  if (p === "/fria") return { view: "fria", selectedArticle: null, selectedTheme: null, blogSlug: null };
  if (p === "/timeline") return { view: "timeline", selectedArticle: null, selectedTheme: null, blogSlug: null };
  if (p === "/blog") return { view: "blog", selectedArticle: null, selectedTheme: null, blogSlug: null };
  const blogMatch = p.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) return { view: "blogpost", selectedArticle: null, selectedTheme: null, blogSlug: blogMatch[1] };
  return { view: "home", selectedArticle: null, selectedTheme: null, blogSlug: null };
}

export default function App() {
  const initRoute = useMemo(() => parseRoute(window.location.pathname), []);
  const [view, setView] = useState(initRoute.view);
  const [selectedArticle, setSelectedArticle] = useState(initRoute.selectedArticle);
  const [selectedTheme, setSelectedTheme] = useState(initRoute.selectedTheme);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [activeRole, setActiveRole] = useState("all");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedRecital, setSelectedRecital] = useState(null);
  const [blogSlug, setBlogSlug] = useState(initRoute.blogSlug);
  const mainRef = useRef(null);

  useEffect(() => { mainRef.current?.scrollTo(0, 0); }, [view, selectedArticle, selectedTheme, blogSlug]);

  // --- URL Routing ---
  const navigateTo = useCallback((path, state) => {
    window.history.pushState(state, "", path);
  }, []);

  const handleArticleClick = useCallback((num) => {
    setSelectedArticle(num); setView("article"); setSearchQuery("");
    navigateTo(`/article/${num}`, { view: "article", selectedArticle: num });
  }, [navigateTo]);

  const handleThemeClick = useCallback((tid) => {
    setSelectedTheme(tid); setView("theme");
    navigateTo(`/theme/${tid}`, { view: "theme", selectedTheme: tid });
  }, [navigateTo]);

  const handleHomeClick = useCallback(() => {
    setView("home"); setSearchQuery("");
    navigateTo("/", { view: "home" });
  }, [navigateTo]);

  const handleRecitalsClick = useCallback(() => {
    setView("recitals");
    navigateTo("/recitals", { view: "recitals" });
  }, [navigateTo]);

  const handleFRIAClick = useCallback(() => {
    setView("fria");
    navigateTo("/fria", { view: "fria" });
  }, [navigateTo]);

  const handleTimelineClick = useCallback(() => {
    setView("timeline");
    navigateTo("/timeline", { view: "timeline" });
  }, [navigateTo]);

  const handleBlogClick = useCallback(() => {
    setView("blog"); setBlogSlug(null);
    navigateTo("/blog", { view: "blog" });
  }, [navigateTo]);

  const handleBlogPostClick = useCallback((slug) => {
    setView("blogpost"); setBlogSlug(slug);
    navigateTo(`/blog/${slug}`, { view: "blogpost", blogSlug: slug });
  }, [navigateTo]);

  // Browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const route = parseRoute(window.location.pathname);
      setView(route.view);
      setSelectedArticle(route.selectedArticle);
      setSelectedTheme(route.selectedTheme);
      setBlogSlug(route.blogSlug);
      setSearchQuery("");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // --- Dynamic document.title, meta description, canonical, JSON-LD ---
  useEffect(() => {
    const BASE_URL = "https://euai.app";
    let title, description, path;

    if (view === "article" && selectedArticle) {
      const art = EU_AI_ACT_DATA.articles[String(selectedArticle)];
      const artTitle = art?.title || `Article ${selectedArticle}`;
      title = `Article ${selectedArticle}: ${artTitle} — EU AI Act Navigator`;
      description = art ? `Read Article ${selectedArticle} (${artTitle}) of the EU AI Act (Regulation (EU) 2024/1689). Full text, plain English summary, related recitals, and cross-references.` : "";
      path = `/article/${selectedArticle}`;
    } else if (view === "theme" && selectedTheme) {
      const theme = EU_AI_ACT_DATA.themes.find(t => t.id === selectedTheme);
      const themeName = theme?.name || selectedTheme;
      title = `${themeName} — EU AI Act Navigator`;
      description = theme ? `${themeName}: ${theme.articles.length} articles from the EU AI Act (Regulation (EU) 2024/1689). Browse articles grouped by theme.` : "";
      path = `/theme/${selectedTheme}`;
    } else if (view === "recitals") {
      title = "Recitals — EU AI Act Navigator";
      description = "All 180 recitals of the EU AI Act (Regulation (EU) 2024/1689). Searchable, cross-referenced with articles.";
      path = "/recitals";
    } else if (view === "fria") {
      title = "FRIA Screening Tool — Am I Required to Do a FRIA? | EU AI Act Navigator";
      description = "Free interactive screening tool to determine if you need a Fundamental Rights Impact Assessment (FRIA) under Article 27 of the EU AI Act. Answer 7 questions to find out.";
      path = "/fria";
    } else if (view === "timeline") {
      title = "EU AI Act Compliance Timeline — Every Deadline You Need to Know";
      description = "Interactive timeline of all EU AI Act deadlines from February 2025 to August 2027. Track the FRIA deadline, GPAI obligations, and Digital Omnibus updates.";
      path = "/timeline";
    } else if (view === "blog") {
      title = "EU AI Act Insights — Practitioner Commentary | EU AI Act Navigator";
      description = "Practitioner-led analysis of the EU AI Act. FRIA deep dives, DPIA comparisons, risk classification guides, and compliance timelines from an experienced AI governance lawyer.";
      path = "/blog";
    } else if (view === "blogpost" && blogSlug) {
      const post = BLOG_POSTS.find(p => p.slug === blogSlug);
      title = post ? `${post.title} — EU AI Act Navigator` : "Blog — EU AI Act Navigator";
      description = post?.metaDescription || "";
      path = `/blog/${blogSlug}`;
    } else {
      title = "EU AI Act Navigator — Interactive Guide to Regulation (EU) 2024/1689";
      description = "Navigate the EU AI Act — 113 articles, 180 recitals, 19 thematic groupings, role-based filtering, and an AI-powered advisor. Free interactive reference.";
      path = "/";
    }

    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", BASE_URL + path);

    // Update og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", BASE_URL + path);

    // Update og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    // Update og:description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    // --- Dynamic JSON-LD ---
    let jsonLdEl = document.getElementById("dynamic-jsonld");
    if (!jsonLdEl) {
      jsonLdEl = document.createElement("script");
      jsonLdEl.type = "application/ld+json";
      jsonLdEl.id = "dynamic-jsonld";
      document.head.appendChild(jsonLdEl);
    }

    const breadcrumbItems = [{ "@type": "ListItem", position: 1, name: "Home", item: BASE_URL + "/" }];
    const jsonLd = { "@context": "https://schema.org" };

    if (view === "article" && selectedArticle) {
      const art = EU_AI_ACT_DATA.articles[String(selectedArticle)];
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: `Article ${selectedArticle}: ${art?.title || ""}`, item: BASE_URL + path });
      jsonLdEl.textContent = JSON.stringify([
        { ...jsonLd, "@type": "Legislation", "name": `Article ${selectedArticle}: ${art?.title || ""}`, "legislationIdentifier": "Regulation (EU) 2024/1689", "description": art ? art.text.substring(0, 300).replace(/\n/g, " ") : "", "url": BASE_URL + path },
        { ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems }
      ]);
    } else if (view === "theme" && selectedTheme) {
      const theme = EU_AI_ACT_DATA.themes.find(t => t.id === selectedTheme);
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: theme?.name || selectedTheme, item: BASE_URL + path });
      jsonLdEl.textContent = JSON.stringify([
        { ...jsonLd, "@type": "CollectionPage", "name": theme?.name || selectedTheme, "description": `${theme?.articles.length || 0} articles from the EU AI Act`, "url": BASE_URL + path },
        { ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems }
      ]);
    } else if (view === "recitals") {
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "Recitals", item: BASE_URL + path });
      jsonLdEl.textContent = JSON.stringify({ ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems });
    } else {
      jsonLdEl.textContent = JSON.stringify({ ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems });
    }
  }, [view, selectedArticle, selectedTheme, blogSlug]);

  const isSearching = searchQuery.length >= 2;
  const searchResultCount = useMemo(() => {
    if (!isSearching) return 0;
    const q = searchQuery.toLowerCase();
    return Object.values(EU_AI_ACT_DATA.articles).filter(a => a.title.toLowerCase().includes(q) || a.text.toLowerCase().includes(q)).length
      + Object.values(EU_AI_ACT_DATA.recitals).filter(r => r.text.toLowerCase().includes(q)).length;
  }, [searchQuery, isSearching]);

  return (
    <div style={{ height: "100vh", display: "flex", background: COLORS.pageBg, fontFamily: SANS }}>
      <style>{FONT_FACE_CSS}</style>
      <style>{FOCUS_CSS}</style>
      {/* Skip navigation link */}
      <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden", zIndex: 1000 }}
        onFocus={e => { e.currentTarget.style.position = "fixed"; e.currentTarget.style.left = "16px"; e.currentTarget.style.top = "16px"; e.currentTarget.style.width = "auto"; e.currentTarget.style.height = "auto"; e.currentTarget.style.overflow = "visible"; e.currentTarget.style.background = "#1e3a5f"; e.currentTarget.style.color = "white"; e.currentTarget.style.padding = "12px 24px"; e.currentTarget.style.borderRadius = "8px"; e.currentTarget.style.fontSize = "14px"; e.currentTarget.style.fontWeight = "600"; e.currentTarget.style.textDecoration = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; }}
        onBlur={e => { e.currentTarget.style.position = "absolute"; e.currentTarget.style.left = "-9999px"; e.currentTarget.style.width = "1px"; e.currentTarget.style.height = "1px"; e.currentTarget.style.overflow = "hidden"; }}>
        Skip to main content
      </a>
      <style>{`
        @media (max-width: 1023px) {
          .mobile-menu-btn { display: block !important; }
          .role-bar { padding: 8px 14px !important; gap: 6px !important; }
          .role-bar button { padding: 5px 10px !important; font-size: 12px !important; }
          .role-bar .role-label { display: none !important; }
          .role-desc { padding: 8px 14px !important; }
          .role-desc p { font-size: 12px !important; }
          .main-content { padding: 20px 16px 40px !important; }
          .top-bar { padding: 10px 14px !important; gap: 8px !important; }
          .breadcrumb { display: none !important; }
          .search-bar-wrap { max-width: 100% !important; }
          .hero-section { flex-direction: column !important; gap: 16px !important; }
          .hero-astro { display: none !important; }
          .hero-title { font-size: 28px !important; }
          .hero-desc { font-size: 14px !important; }
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 6px !important; margin-bottom: 20px !important; }
          .stats-grid > div { padding: 10px 8px !important; }
          .stats-grid .stat-value { font-size: 18px !important; }
          .key-articles-grid { grid-template-columns: 1fr !important; }
          .themes-grid { grid-template-columns: 1fr !important; }
          .nav-arrows { display: none !important; }
          .def-controls { flex-direction: column !important; }
          .def-search-wrap { min-width: 0 !important; }
          .footer-inner { flex-direction: column !important; text-align: center !important; gap: 8px !important; }
          .recitals-controls { flex-direction: column !important; }
          .recitals-controls select { min-width: 0 !important; width: 100% !important; }
          .recital-chips { display: none !important; }
          .view-title { font-size: 24px !important; }
          .view-subtitle { font-size: 16px !important; }
          .article-box { padding: 20px 16px !important; }
          .plain-panel { padding: 16px !important; }
          .modal-content { max-width: 95vw !important; padding: 24px 20px !important; margin: 16px !important; }
          .chat-panel { width: 100vw !important; }
          .btn-label { display: none !important; }
          .site-logo-text { display: none !important; }
          .kbd-shortcut { display: none !important; }
          .persona-grid { display: flex !important; flex-direction: row !important; gap: 8px !important; margin-bottom: 16px !important; }
          .persona-card { padding: 10px 14px !important; border-radius: 12px !important; flex: 1 !important; }
          .persona-icon { width: 32px !important; height: 32px !important; border-radius: 8px !important; font-size: 16px !important; margin-bottom: 0 !important; flex-shrink: 0 !important; }
          .persona-title { font-size: 12px !important; margin: 0 !important; white-space: nowrap !important; }
          .persona-desc { display: none !important; }
          .persona-themes { display: none !important; }
          .persona-cta { display: none !important; }
          .persona-check { position: static !important; width: 18px !important; height: 18px !important; margin-left: auto !important; }
          .persona-check svg { width: 10px !important; height: 10px !important; }
          .home-timeline { display: none !important; }
          .advisor-cta { display: none !important; }
          .hero-home { padding: 20px 0 16px !important; }
          .hero-badge { margin-bottom: 12px !important; }
          .hero-title { margin-bottom: 8px !important; }
          .home-divider { margin-bottom: 16px !important; }
          .themes-section { margin-bottom: 20px !important; }
          .themes-section h2 { font-size: 20px !important; margin-bottom: 4px !important; }
          .themes-section p { margin-bottom: 12px !important; }
          .fria-card { padding: 24px 20px !important; }
          .fria-form { flex-direction: column !important; }
          .fria-input { width: 100% !important; }
          .fria-btn { width: 100% !important; padding: 14px !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .stats-grid .stat-value { font-size: 16px !important; }
          .role-bar { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; }
          .role-bar button { justify-content: center !important; }
          .main-content { padding: 16px 12px 32px !important; }
          .recitals-controls input { font-size: 13px !important; }
          .recitals-controls select { font-size: 13px !important; }
          .recitals-controls button { font-size: 12px !important; padding: 8px 12px !important; }
          .hero-title { font-size: 22px !important; }
          .hero-desc { font-size: 13px !important; }
          .view-title { font-size: 20px !important; }
          .article-box { padding: 16px 12px !important; }
          .persona-title { font-size: 11px !important; }
          .persona-icon { width: 28px !important; height: 28px !important; font-size: 14px !important; }
          .theme-btn { font-size: 12px !important; padding: 8px 14px !important; }
          .sidebar-container { width: 85vw !important; max-width: 310px !important; }
          .def-expanded { padding-left: 16px !important; }
          .about-btn { display: none !important; }
          .site-logo-img { width: 26px !important; height: 26px !important; border-radius: 6px !important; }
          .sidebar-about-btn { display: block !important; }
          .fria-heading { font-size: 18px !important; }
          .fria-sub { font-size: 12px !important; }
          .fria-countdown { font-size: 11px !important; padding: 3px 10px !important; }
        }
      `}</style>

      {isMobileOpen && <div role="presentation" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 20 }} onClick={() => setIsMobileOpen(false)} />}

      <Sidebar view={view} setView={setView} selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}
        selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle}
        isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} activeRole={activeRole} setSelectedRecital={setSelectedRecital}
        onAboutClick={() => setShowAbout(true)} onArticleClick={handleArticleClick} onThemeClick={handleThemeClick} onRecitalsClick={handleRecitalsClick}
        onFRIAClick={handleFRIAClick} onTimelineClick={handleTimelineClick} onBlogClick={handleBlogClick} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar */}
        <header className="top-bar" style={{ flexShrink: 0, background: COLORS.white, borderBottom: `1px solid ${COLORS.borderDefault}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setIsMobileOpen(true)}
            aria-label="Open navigation menu"
            style={{ display: "none", padding: 8, border: "none", background: "none", cursor: "pointer", color: COLORS.textMuted }}
            className="mobile-menu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <style>{`@media (max-width: 1023px) { .mobile-menu-btn { display: block !important; } }`}</style>

          {/* Site Logo */}
          <a href="/" onClick={(e) => { e.preventDefault(); handleHomeClick(); }} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textDecoration: "none", flexShrink: 0 }}>
            <img className="site-logo-img" src="/apple-touch-icon.png" alt="EU AI Act Navigator" style={{ width: 34, height: 34, borderRadius: 8 }} />
            <span className="site-logo-text" style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, fontFamily: SANS, whiteSpace: "nowrap" }}>EU AI Act Navigator</span>
          </a>

          {/* Breadcrumb */}
          <div className="breadcrumb" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: COLORS.textPlaceholder, marginRight: 16, flexShrink: 0 }}>
            <button onClick={handleHomeClick} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textPlaceholder, fontFamily: SANS, fontSize: 14 }}
              onMouseEnter={e => e.currentTarget.style.color = COLORS.textBody} onMouseLeave={e => e.currentTarget.style.color = COLORS.textPlaceholder}>
              Home
            </button>
            {view === "article" && selectedArticle && <>
              <span style={{ color: "#d1d5db" }}>/</span>
              <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Article {selectedArticle}</span>
            </>}
            {view === "theme" && selectedTheme && <>
              <span style={{ color: "#d1d5db" }}>/</span>
              <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{EU_AI_ACT_DATA.themes.find(t => t.id === selectedTheme)?.name}</span>
            </>}
            {view === "recitals" && <>
              <span style={{ color: "#d1d5db" }}>/</span>
              <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Recitals</span>
            </>}
            {view === "fria" && <>
              <span style={{ color: "#d1d5db" }}>/</span>
              <span style={{ color: "#1a1a1a", fontWeight: 600 }}>FRIA Screening</span>
            </>}
            {view === "timeline" && <>
              <span style={{ color: "#d1d5db" }}>/</span>
              <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Timeline</span>
            </>}
            {(view === "blog" || view === "blogpost") && <>
              <span style={{ color: "#d1d5db" }}>/</span>
              <button onClick={handleBlogClick} style={{ background: "none", border: "none", cursor: "pointer", color: view === "blogpost" ? "#94a3b8" : "#1a1a1a", fontFamily: SANS, fontSize: 14, fontWeight: view === "blogpost" ? 400 : 600, padding: 0 }}>Blog</button>
              {view === "blogpost" && blogSlug && <>
                <span style={{ color: "#d1d5db" }}>/</span>
                <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{BLOG_POSTS.find(p => p.slug === blogSlug)?.title?.substring(0, 40) || "Article"}...</span>
              </>}
            </>}
          </div>

          <div className="search-bar-wrap" style={{ flex: 1, maxWidth: 520 }}>
            <SearchBar query={searchQuery} setQuery={setSearchQuery} resultCount={searchResultCount} />
          </div>

          {/* AI Advisor button */}
          <button onClick={() => setChatOpen(true)}
            style={{ flexShrink: 0, padding: "8px 14px", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryHover})`, border: "none", borderRadius: RADIUS.md, cursor: "pointer", fontSize: 13, color: "white", fontFamily: SANS, display: "flex", alignItems: "center", gap: 6, fontWeight: 500, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <span className="btn-label">AI Advisor</span>
          </button>

          {/* About button */}
          <button className="about-btn" onClick={() => setShowAbout(true)}
            style={{ flexShrink: 0, padding: "8px 14px", background: "none", border: `1px solid ${COLORS.borderLight}`, borderRadius: RADIUS.md, cursor: "pointer", fontSize: 13, color: COLORS.textMuted, fontFamily: SANS, display: "flex", alignItems: "center", gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primaryLinkUnderline; e.currentTarget.style.color = COLORS.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.color = COLORS.textMuted; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            <span className="btn-label">About</span>
          </button>

          {/* Nav arrows */}
          {view === "article" && selectedArticle && (
            <div className="nav-arrows" style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <button onClick={() => { const p = selectedArticle - 1; if (EU_AI_ACT_DATA.articles[String(p)]) handleArticleClick(p); }}
                disabled={!EU_AI_ACT_DATA.articles[String(selectedArticle - 1)]}
                aria-label="Previous article"
                style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", opacity: EU_AI_ACT_DATA.articles[String(selectedArticle - 1)] ? 1 : 0.3 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => { const n = selectedArticle + 1; if (EU_AI_ACT_DATA.articles[String(n)]) handleArticleClick(n); }}
                disabled={!EU_AI_ACT_DATA.articles[String(selectedArticle + 1)]}
                aria-label="Next article"
                style={{ padding: 8, borderRadius: 8, border: "none", background: "none", cursor: "pointer", opacity: EU_AI_ACT_DATA.articles[String(selectedArticle + 1)] ? 1 : 0.3 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </header>

        {/* Role Filter Bar */}
        <div className="role-bar" style={{ flexShrink: 0, background: COLORS.white, borderBottom: `1px solid ${COLORS.borderDefault}`, padding: "8px 24px", display: "flex", alignItems: "center", gap: 8, overflowX: "auto" }}>
          <span className="role-label" style={{ fontSize: 12, color: COLORS.warmText, fontWeight: 600, fontFamily: SANS, flexShrink: 0, marginRight: 4 }}>View as:</span>
          {Object.values(ROLES).map(role => {
            const isActive = activeRole === role.id;
            return (
              <button key={role.id} onClick={() => setActiveRole(role.id)}
                title={role.description}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 14px", fontSize: 13, fontFamily: SANS, fontWeight: isActive ? 600 : 500,
                  borderRadius: RADIUS.round, border: `1.5px solid ${isActive ? COLORS.primary : COLORS.borderLight}`,
                  background: isActive ? COLORS.primary : COLORS.white,
                  color: isActive ? "white" : COLORS.textSecondary,
                  cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
                }}>
                <span>{role.icon}</span> {role.label}
              </button>
            );
          })}
        </div>

        {/* Role description */}
        {activeRole !== "all" && (
          <div className="role-desc" style={{ flexShrink: 0, background: COLORS.primaryLight, borderBottom: `1px solid ${COLORS.primaryLightBorder}`, padding: "8px 24px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            <p style={{ fontSize: 13, color: COLORS.primary, margin: 0, fontFamily: SANS }}>
              Showing articles relevant to <strong>{ROLES[activeRole].label.toLowerCase()}s</strong>. {ROLES[activeRole].description}.
              <button onClick={() => setActiveRole("all")} style={{ marginLeft: 8, fontSize: 12, color: COLORS.primary, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: SANS }}>Show all</button>
            </p>
          </div>
        )}

        {/* Content */}
        <main id="main-content" ref={mainRef} className="main-content" style={{ flex: 1, overflowY: "auto", padding: "28px 32px 60px" }}>
          {isSearching ? (
            <SearchResults query={searchQuery} onArticleClick={handleArticleClick} />
          ) : view === "article" && selectedArticle === 3 ? (
            <DefinitionsView onArticleClick={handleArticleClick} searchQuery={searchQuery} />
          ) : view === "article" && selectedArticle === 5 ? (
            <>
              {activeRole !== "all" && !ROLES[activeRole].articles.includes(5) && (
                <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontFamily: SANS }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <p style={{ margin: 0, fontSize: 14, color: "#92400e" }}>This article may not be directly applicable to <strong>{ROLES[activeRole].label.toLowerCase()}s</strong>. <button onClick={() => setActiveRole("all")} style={{ color: "#92400e", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: SANS, fontSize: 14 }}>View as all provisions</button></p>
                </div>
              )}
              <ProhibitedPracticesView article={EU_AI_ACT_DATA.articles["5"] || {}}
                onThemeClick={handleThemeClick} onArticleClick={handleArticleClick} />
            </>
          ) : view === "article" && selectedArticle ? (
            <>
              {activeRole !== "all" && !ROLES[activeRole].articles.includes(selectedArticle) && (
                <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontFamily: SANS }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <p style={{ margin: 0, fontSize: 14, color: "#92400e" }}>This article may not be directly applicable to <strong>{ROLES[activeRole].label.toLowerCase()}s</strong>. <button onClick={() => setActiveRole("all")} style={{ color: "#92400e", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: SANS, fontSize: 14 }}>View as all provisions</button></p>
                </div>
              )}
              <ArticleDetail articleNum={selectedArticle} article={EU_AI_ACT_DATA.articles[String(selectedArticle)] || {}}
                onThemeClick={handleThemeClick} onArticleClick={handleArticleClick} searchQuery={searchQuery} />
            </>
          ) : view === "theme" && selectedTheme ? (
            <ThemeView themeId={selectedTheme} onArticleClick={handleArticleClick} />
          ) : view === "recitals" ? (
            <EnhancedRecitalsTab onArticleClick={handleArticleClick} initialRecital={selectedRecital} />
          ) : view === "fria" ? (
            <FRIAScreeningTool onArticleClick={handleArticleClick} />
          ) : view === "timeline" ? (
            <DeadlineTracker onArticleClick={handleArticleClick} />
          ) : view === "blog" ? (
            <BlogView onBlogPostClick={handleBlogPostClick} />
          ) : view === "blogpost" && blogSlug ? (
            <BlogPost slug={blogSlug} onBlogClick={handleBlogClick} onArticleClick={handleArticleClick} />
          ) : (
            <HomeView onArticleClick={handleArticleClick} onThemeClick={handleThemeClick} activeRole={activeRole} setActiveRole={setActiveRole} onChatOpen={() => setChatOpen(true)} onFRIAClick={handleFRIAClick} onTimelineClick={handleTimelineClick} onBlogClick={handleBlogClick} />
          )}

          {/* Footer */}
          <footer style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${COLORS.borderDefault}` }}>
            <p style={{ fontSize: 11, color: COLORS.textPlaceholder, lineHeight: 1.6, margin: "0 0 14px", fontFamily: SANS }}>
              Built by Paul McCormack — dual-qualified lawyer (England &amp; Wales / New York Bar), Product Leader, and founder of Kormoon (acquired by Privitar/Informatica). An independent resource to help organisations prepare for the EU AI Act.
            </p>
            <div className="footer-inner" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <p style={{ fontSize: 12, color: COLORS.textPlaceholder, margin: 0, fontFamily: SANS }}>
                © 2026 Paul McCormack. All rights reserved.
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                <button onClick={() => setShowTerms(true)}
                  style={{ fontSize: 12, color: COLORS.warmText, background: "none", border: "none", cursor: "pointer", fontFamily: SANS, textDecoration: "underline", textDecorationColor: COLORS.warmGold }}>
                  Terms of Use
                </button>
                <button onClick={() => setShowPrivacy(true)}
                  style={{ fontSize: 12, color: COLORS.warmText, background: "none", border: "none", cursor: "pointer", fontFamily: SANS, textDecoration: "underline", textDecorationColor: COLORS.warmGold }}>
                  Privacy Notice
                </button>
                <a href="https://kormoon.ai/" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: COLORS.warmText, fontFamily: SANS, textDecoration: "underline", textDecorationColor: COLORS.warmGold }}>
                  kormoon.ai
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} onKeyDown={e => { if (e.key === "Escape") setShowAbout(false); }} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} onKeyDown={e => { if (e.key === "Escape") setShowTerms(false); }} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} onKeyDown={e => { if (e.key === "Escape") setShowPrivacy(false); }} />}
      {/* Floating AI Advisor Button */}
      {!chatOpen && (
        <button
          className="fab-advisor"
          onClick={() => setChatOpen(true)}
          aria-label="Open AI Advisor chat"
          title="Ask the AI Advisor"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 15,
            width: 56, height: 56, borderRadius: RADIUS.full, border: "none", cursor: "pointer",
            background: COLORS.primary, padding: 0, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: SHADOWS.fab, transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = SHADOWS.fabHover; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = SHADOWS.fab; }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </button>
      )}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} onArticleClick={(num) => { handleArticleClick(num); setChatOpen(false); }} onRecitalClick={() => { handleRecitalsClick(); setChatOpen(false); }} currentArticle={view === "article" ? selectedArticle : null} />
    </div>
  );
}
