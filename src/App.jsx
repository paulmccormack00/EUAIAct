import { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from "react";
import { SANS, SERIF, COLORS, RADIUS, SHADOWS, FOCUS_CSS } from "./constants.js";
import { EU_AI_ACT_DATA } from "./data/eu-ai-act-data.js";
import { ROLES } from "./data/roles.js";
import SearchBar from "./components/SearchBar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { BLOG_POSTS } from "./data/blog-posts.js";
import { ANNEXES } from "./data/annexes.js";

// Lazy-loaded route components
const SearchResults = lazy(() => import("./components/SearchResults.jsx"));
const DefinitionsView = lazy(() => import("./components/DefinitionsView.jsx"));
const ProhibitedPracticesView = lazy(() => import("./components/ProhibitedPracticesView.jsx"));
const ArticleDetail = lazy(() => import("./components/ArticleDetail.jsx"));
const ThemeView = lazy(() => import("./components/ThemeView.jsx"));
const EnhancedRecitalsTab = lazy(() => import("./components/EnhancedRecitalsTab.jsx"));
// HomeView loaded eagerly for LCP performance
import HomeView from "./components/HomeView.jsx";
const ChatPanel = lazy(() => import("./components/ChatPanel.jsx"));
const AboutModal = lazy(() => import("./components/modals/AboutModal.jsx"));
const TermsModal = lazy(() => import("./components/modals/TermsModal.jsx"));
const PrivacyModal = lazy(() => import("./components/modals/PrivacyModal.jsx"));
const FRIAScreeningTool = lazy(() => import("./components/FRIAScreeningTool.jsx"));
const DeadlineTracker = lazy(() => import("./components/DeadlineTracker.jsx"));
const BlogView = lazy(() => import("./components/BlogView.jsx"));
const BlogPost = lazy(() => import("./components/BlogPost.jsx"));
const AnnexView = lazy(() => import("./components/AnnexView.jsx"));
const RoleIdentifier = lazy(() => import("./components/RoleIdentifier.jsx"));

// Parse initial URL to determine starting view
function parseRoute(pathname) {
  const p = pathname || "/";
  const articleMatch = p.match(/^\/article\/(\d+)$/);
  if (articleMatch) {
    const num = Number(articleMatch[1]);
    if (EU_AI_ACT_DATA.articles[String(num)]) return { view: "article", selectedArticle: num, selectedTheme: null, blogSlug: null, annexId: null };
    return { view: "notfound", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  }
  const themeMatch = p.match(/^\/theme\/([a-z-]+)$/);
  if (themeMatch) {
    const tid = themeMatch[1];
    if (EU_AI_ACT_DATA.themes.find(t => t.id === tid)) return { view: "theme", selectedArticle: null, selectedTheme: tid, blogSlug: null, annexId: null };
    return { view: "notfound", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  }
  if (p === "/definitions") return { view: "article", selectedArticle: 3, selectedTheme: null, blogSlug: null, annexId: null };
  if (p === "/recitals") return { view: "recitals", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  if (p === "/fria") return { view: "fria", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  if (p === "/timeline") return { view: "timeline", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  if (p === "/role-identifier") return { view: "role-identifier", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  if (p === "/blog") return { view: "blog", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  const blogMatch = p.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    if (BLOG_POSTS.find(bp => bp.slug === slug)) return { view: "blogpost", selectedArticle: null, selectedTheme: null, blogSlug: slug, annexId: null };
    return { view: "notfound", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  }
  if (p === "/annexes") return { view: "annexes", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  const annexMatch = p.match(/^\/annex\/(\d+)$/);
  if (annexMatch) {
    const aid = Number(annexMatch[1]);
    if (ANNEXES.find(a => a.id === aid)) return { view: "annex", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: aid };
    return { view: "notfound", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  }
  if (p === "/") return { view: "home", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
  return { view: "notfound", selectedArticle: null, selectedTheme: null, blogSlug: null, annexId: null };
}

export default function App() {
  const initRoute = useMemo(() => parseRoute(window.location.pathname), []);
  const [view, setView] = useState(initRoute.view);
  const [selectedArticle, setSelectedArticle] = useState(initRoute.selectedArticle);
  const [selectedTheme, setSelectedTheme] = useState(initRoute.selectedTheme);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [activeRole, setActiveRole] = useState("all");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedRecital, setSelectedRecital] = useState(null);
  const [blogSlug, setBlogSlug] = useState(initRoute.blogSlug);
  const [selectedAnnex, setSelectedAnnex] = useState(initRoute.annexId);
  const mainRef = useRef(null);
  const menuBtnRef = useRef(null);

  // Debounce search query by 200ms
  useEffect(() => {
    if (searchQuery.length < 2) { setDebouncedQuery(""); return; }
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    // Skip scroll-to-top on back/forward navigation (scroll is restored in popstate handler)
    if (isPopStateRef.current) return;
    mainRef.current?.scrollTo(0, 0);
    // Move focus to main content for screen readers on route change
    if (mainRef.current) {
      mainRef.current.focus({ preventScroll: true });
    }
  }, [view, selectedArticle, selectedTheme, blogSlug, selectedAnnex]);

  // --- URL Routing ---
  const navigateTo = useCallback((path, state) => {
    // Save current scroll position before navigating
    const scrollY = mainRef.current?.scrollTop || 0;
    window.history.replaceState({ ...window.history.state, scrollY }, "");
    window.history.pushState(state, "", path);
  }, []);

  const handleArticleClick = useCallback((num) => {
    setSelectedArticle(num); setView("article"); setSearchQuery("");
    navigateTo(`/article/${num}`, { view: "article", selectedArticle: num });
  }, [navigateTo]);

  const handleThemeClick = useCallback((tid) => {
    setSelectedTheme(tid); setView("theme"); setSearchQuery("");
    navigateTo(`/theme/${tid}`, { view: "theme", selectedTheme: tid });
  }, [navigateTo]);

  const handleHomeClick = useCallback(() => {
    setView("home"); setSearchQuery("");
    navigateTo("/", { view: "home" });
  }, [navigateTo]);

  const handleRecitalsClick = useCallback(() => {
    setView("recitals"); setSearchQuery("");
    navigateTo("/recitals", { view: "recitals" });
  }, [navigateTo]);

  const handleFRIAClick = useCallback(() => {
    setView("fria"); setSearchQuery("");
    navigateTo("/fria", { view: "fria" });
  }, [navigateTo]);

  const handleTimelineClick = useCallback(() => {
    setView("timeline"); setSearchQuery("");
    navigateTo("/timeline", { view: "timeline" });
  }, [navigateTo]);

  const handleBlogClick = useCallback(() => {
    setView("blog"); setBlogSlug(null); setSearchQuery("");
    navigateTo("/blog", { view: "blog" });
  }, [navigateTo]);

  const handleBlogPostClick = useCallback((slug) => {
    setView("blogpost"); setBlogSlug(slug); setSearchQuery("");
    navigateTo(`/blog/${slug}`, { view: "blogpost", blogSlug: slug });
  }, [navigateTo]);

  const handleAnnexesClick = useCallback(() => {
    setView("annexes"); setSelectedAnnex(null); setSearchQuery("");
    navigateTo("/annexes", { view: "annexes" });
  }, [navigateTo]);

  const handleAnnexClick = useCallback((annexId) => {
    setSearchQuery("");
    if (annexId === null) {
      setView("annexes"); setSelectedAnnex(null);
      navigateTo("/annexes", { view: "annexes" });
    } else {
      setView("annex"); setSelectedAnnex(annexId);
      navigateTo(`/annex/${annexId}`, { view: "annex", annexId });
    }
  }, [navigateTo]);

  const handleRoleIdentifierClick = useCallback(() => {
    setView("role-identifier"); setSearchQuery("");
    navigateTo("/role-identifier", { view: "role-identifier" });
  }, [navigateTo]);

  const handleApplyRole = useCallback((roleId) => {
    setActiveRole(roleId);
    setView("home");
    navigateTo("/", { view: "home" });
  }, [navigateTo]);

  // Browser back/forward
  const isPopStateRef = useRef(false);
  useEffect(() => {
    const onPopState = (e) => {
      isPopStateRef.current = true;
      const route = parseRoute(window.location.pathname);
      setView(route.view);
      setSelectedArticle(route.selectedArticle);
      setSelectedTheme(route.selectedTheme);
      setBlogSlug(route.blogSlug);
      setSelectedAnnex(route.annexId);
      setSearchQuery("");
      // Restore scroll position after render
      const savedScroll = e.state?.scrollY;
      if (savedScroll != null) {
        requestAnimationFrame(() => {
          mainRef.current?.scrollTo(0, savedScroll);
          isPopStateRef.current = false;
        });
      } else {
        isPopStateRef.current = false;
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Close mobile sidebar on Escape and return focus to menu button
  useEffect(() => {
    if (!isMobileOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
        requestAnimationFrame(() => menuBtnRef.current?.focus());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isMobileOpen]);

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
    } else if (view === "role-identifier") {
      title = "Role Identifier — What's My Role Under the EU AI Act?";
      description = "Free interactive tool to identify your role under the EU AI Act. Answer a few questions to discover whether you are a provider, deployer, importer, distributor, authorised representative, or affected person.";
      path = "/role-identifier";
    } else if (view === "blog") {
      title = "EU AI Act Insights — Practitioner Commentary | EU AI Act Navigator";
      description = "Practitioner-led analysis of the EU AI Act. FRIA deep dives, DPIA comparisons, risk classification guides, and compliance timelines from an experienced AI governance lawyer.";
      path = "/blog";
    } else if (view === "blogpost" && blogSlug) {
      const post = BLOG_POSTS.find(p => p.slug === blogSlug);
      title = post ? `${post.title} — EU AI Act Navigator` : "Blog — EU AI Act Navigator";
      description = post?.metaDescription || "";
      path = `/blog/${blogSlug}`;
    } else if (view === "annexes") {
      title = "Annexes I–XIII — EU AI Act Navigator";
      description = "All 13 annexes of the EU AI Act (Regulation (EU) 2024/1689). High-risk classifications, technical documentation requirements, conformity assessment procedures, and GPAI model criteria.";
      path = "/annexes";
    } else if (view === "annex" && selectedAnnex) {
      const annex = ANNEXES.find(a => a.id === selectedAnnex);
      title = annex ? `Annex ${annex.number}: ${annex.title} — EU AI Act Navigator` : "Annex — EU AI Act Navigator";
      description = annex?.summary || "";
      path = `/annex/${selectedAnnex}`;
    } else if (view === "notfound") {
      title = "Page Not Found — EU AI Act Navigator";
      description = "The page you're looking for doesn't exist.";
      path = window.location.pathname;
    } else {
      title = "EU AI Act Navigator — Interactive Guide to Regulation (EU) 2024/1689";
      description = "Navigate the EU AI Act — 113 articles, 180 recitals, 13 annexes, 19 thematic groupings, role-based filtering, and an AI-powered advisor. Free interactive reference.";
      path = "/";
    }

    document.title = title;

    // Add noindex for 404 pages
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) robotsMeta.setAttribute("content", view === "notfound" ? "noindex, nofollow" : "index, follow");

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

    // Update og:type — "article" for blog posts, "website" for everything else
    let ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute("content", view === "blogpost" ? "article" : "website");

    // Add article:published_time and article:author for blog posts
    const articleTimeMeta = document.querySelector('meta[property="article:published_time"]');
    const articleAuthorMeta = document.querySelector('meta[property="article:author"]');
    if (view === "blogpost" && blogSlug) {
      const post = BLOG_POSTS.find(p => p.slug === blogSlug);
      if (post) {
        if (!articleTimeMeta) {
          const m1 = document.createElement("meta"); m1.setAttribute("property", "article:published_time"); m1.setAttribute("content", post.date); document.head.appendChild(m1);
        } else { articleTimeMeta.setAttribute("content", post.date); }
        if (!articleAuthorMeta) {
          const m2 = document.createElement("meta"); m2.setAttribute("property", "article:author"); m2.setAttribute("content", post.author); document.head.appendChild(m2);
        } else { articleAuthorMeta.setAttribute("content", post.author); }
      }
    } else {
      if (articleTimeMeta) articleTimeMeta.remove();
      if (articleAuthorMeta) articleAuthorMeta.remove();
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      let keywords = "EU AI Act, AI regulation, Regulation 2024/1689";
      if (view === "blogpost" && blogSlug) {
        const post = BLOG_POSTS.find(p => p.slug === blogSlug);
        if (post?.metaKeywords) keywords = post.metaKeywords;
        else if (post?.tags) keywords = post.tags.join(", ");
      } else if (view === "article" && selectedArticle) {
        const art = EU_AI_ACT_DATA.articles[String(selectedArticle)];
        const themes = (art?.themes || []).map(tid => EU_AI_ACT_DATA.themes.find(t => t.id === tid)?.name).filter(Boolean);
        keywords = [`Article ${selectedArticle}`, art?.title, ...themes, "EU AI Act"].filter(Boolean).join(", ");
      } else if (view === "fria") {
        keywords = "FRIA, fundamental rights impact assessment, Article 27, EU AI Act, high-risk AI, screening tool";
      } else if (view === "timeline") {
        keywords = "EU AI Act timeline, compliance deadlines, FRIA deadline, GPAI deadline, Article 113, 2025, 2026, 2027";
      } else if (view === "role-identifier") {
        keywords = "EU AI Act roles, provider, deployer, importer, distributor, authorised representative, role identifier";
      } else if (view === "annex" && selectedAnnex) {
        const annex = ANNEXES.find(a => a.id === selectedAnnex);
        keywords = annex ? `Annex ${annex.number}, ${annex.title}, EU AI Act` : keywords;
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // Update og:image — dynamic PNG via satori + resvg
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      const ogImgType = view === "article" ? "article" : view === "theme" ? "theme" : view === "blogpost" ? "blog" : view === "annex" ? "annex" : view === "fria" || view === "timeline" || view === "role-identifier" ? "tool" : "page";
      const ogImgTitle = encodeURIComponent(title.replace(/ — EU AI Act Navigator$/, ""));
      const ogImageUrl = `${BASE_URL}/api/og?title=${ogImgTitle}&type=${ogImgType}`;
      ogImage.setAttribute("content", ogImageUrl);
    }

    // Update og:image:width/height
    let ogWidth = document.querySelector('meta[property="og:image:width"]');
    if (ogWidth) ogWidth.setAttribute("content", "1200");
    let ogHeight = document.querySelector('meta[property="og:image:height"]');
    if (ogHeight) ogHeight.setAttribute("content", "630");

    // Update twitter:title, twitter:description, twitter:image
    const twitterMeta = { "twitter:title": title, "twitter:description": description };
    for (const [name, content] of Object.entries(twitterMeta)) {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    }
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) { twitterImage = document.createElement("meta"); twitterImage.setAttribute("name", "twitter:image"); document.head.appendChild(twitterImage); }
    const twImgType = view === "article" ? "article" : view === "theme" ? "theme" : view === "blogpost" ? "blog" : view === "annex" ? "annex" : view === "fria" || view === "timeline" || view === "role-identifier" ? "tool" : "page";
    const twImgTitle = encodeURIComponent(title.replace(/ — EU AI Act Navigator$/, ""));
    twitterImage.setAttribute("content", `${BASE_URL}/api/og?title=${twImgTitle}&type=${twImgType}`);

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
        { ...jsonLd, "@type": "Legislation", "name": `Article ${selectedArticle}: ${art?.title || ""}`, "legislationIdentifier": "Regulation (EU) 2024/1689", "description": art ? (() => { const t = art.text.replace(/\n/g, " "); const idx = t.lastIndexOf(".", 300); return idx > 100 ? t.substring(0, idx + 1) : t.substring(0, 300); })() : "", "url": BASE_URL + path },
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
      jsonLdEl.textContent = JSON.stringify([
        { ...jsonLd, "@type": "CollectionPage", "name": "EU AI Act Recitals", "description": "All 180 recitals of the EU AI Act, cross-referenced with articles.", "url": BASE_URL + path },
        { ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems }
      ]);
    } else if (view === "blogpost" && blogSlug) {
      const post = BLOG_POSTS.find(p => p.slug === blogSlug);
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "Blog", item: BASE_URL + "/blog" });
      if (post) {
        breadcrumbItems.push({ "@type": "ListItem", position: 3, name: post.title, item: BASE_URL + path });
        // Extract first 500 chars of plain text from content blocks
        const articleBody = post.content
          .filter(b => b.type === "paragraph" || b.type === "lead")
          .map(b => b.text)
          .join(" ")
          .substring(0, 500);
        jsonLdEl.textContent = JSON.stringify([
          {
            ...jsonLd,
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription || "",
            "datePublished": post.date,
            "dateModified": post.date,
            "author": {
              "@type": "Person",
              "name": post.author,
              "jobTitle": post.authorRole,
              "url": "https://euai.app"
            },
            "publisher": {
              "@type": "Organization",
              "name": "EU AI Act Navigator",
              "url": "https://euai.app"
            },
            "mainEntityOfPage": BASE_URL + path,
            "articleBody": articleBody,
            "keywords": post.metaKeywords || post.tags?.join(", ") || "",
            "image": `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}&type=blog`,
            "url": BASE_URL + path
          },
          { ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems }
        ]);
      } else {
        jsonLdEl.textContent = JSON.stringify({ ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems });
      }
    } else if (view === "blog") {
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "Blog", item: BASE_URL + path });
      jsonLdEl.textContent = JSON.stringify([
        { ...jsonLd, "@type": "CollectionPage", "name": "EU AI Act Insights", "description": "Practitioner-led analysis of the EU AI Act.", "url": BASE_URL + path },
        { ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems }
      ]);
    } else if (view === "fria") {
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "FRIA Screening Tool", item: BASE_URL + path });
      jsonLdEl.textContent = JSON.stringify([
        { ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems },
        {
          ...jsonLd,
          "@type": "WebApplication",
          "name": "FRIA Screening Tool",
          "description": "Free interactive screening tool to determine if you need a Fundamental Rights Impact Assessment (FRIA) under Article 27 of the EU AI Act.",
          "url": BASE_URL + path,
          "applicationCategory": "BusinessApplication",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
        }
      ]);
    } else if (view === "timeline") {
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "Compliance Timeline", item: BASE_URL + path });
      jsonLdEl.textContent = JSON.stringify([
        { ...jsonLd, "@type": "ItemList", "name": "EU AI Act Compliance Timeline", "description": "Every EU AI Act deadline from 2024 to 2027.", "url": BASE_URL + path, "numberOfItems": 7 },
        { ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems }
      ]);
    } else if (view === "annex" && selectedAnnex) {
      const annex = ANNEXES.find(a => a.id === selectedAnnex);
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "Annexes", item: BASE_URL + "/annexes" });
      if (annex) breadcrumbItems.push({ "@type": "ListItem", position: 3, name: `Annex ${annex.number}: ${annex.title}`, item: BASE_URL + path });
      jsonLdEl.textContent = JSON.stringify([
        { ...jsonLd, "@type": "Legislation", "name": annex ? `Annex ${annex.number}: ${annex.title}` : "Annex", "legislationIdentifier": "Regulation (EU) 2024/1689", "description": annex?.summary || "", "url": BASE_URL + path },
        { ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems }
      ]);
    } else if (view === "annexes") {
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: "Annexes", item: BASE_URL + path });
      jsonLdEl.textContent = JSON.stringify({ ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems });
    } else {
      jsonLdEl.textContent = JSON.stringify({ ...jsonLd, "@type": "BreadcrumbList", "itemListElement": breadcrumbItems });
    }
  }, [view, selectedArticle, selectedTheme, blogSlug, selectedAnnex]);

  const isSearching = debouncedQuery.length >= 2;
  const searchResultCount = useMemo(() => {
    if (!isSearching) return 0;
    const q = debouncedQuery.toLowerCase();
    return Object.values(EU_AI_ACT_DATA.articles).filter(a => a.title.toLowerCase().includes(q) || a.text.toLowerCase().includes(q)).length
      + Object.values(EU_AI_ACT_DATA.recitals).filter(r => r.text.toLowerCase().includes(q)).length;
  }, [debouncedQuery, isSearching]);

  return (
    <div style={{ height: "100vh", display: "flex", background: COLORS.pageBg, fontFamily: SANS }}>
      <style>{FOCUS_CSS}</style>
      <style>{`body { padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }`}</style>
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
          .role-bar button { padding: 8px 12px !important; font-size: 12px !important; min-height: 36px !important; }
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
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 6px !important; margin-bottom: 20px !important; }
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
          .persona-grid { display: flex !important; flex-direction: row !important; gap: 8px !important; margin-bottom: 8px !important; }
          .supply-chain-grid { grid-template-columns: 1fr !important; gap: 6px !important; margin-bottom: 16px !important; }
          .persona-card { padding: 10px 14px !important; border-radius: 12px !important; flex: 1 !important; }
          .persona-icon { width: 32px !important; height: 32px !important; border-radius: 8px !important; font-size: 16px !important; margin-bottom: 0 !important; flex-shrink: 0 !important; }
          .persona-title { font-size: 12px !important; margin: 0 !important; white-space: nowrap !important; }
          .persona-desc { display: none !important; }
          .persona-themes { display: none !important; }
          .persona-cta { display: none !important; }
          .persona-check { position: static !important; width: 18px !important; height: 18px !important; margin-left: auto !important; }
          .persona-check svg { width: 10px !important; height: 10px !important; }
          .home-timeline { grid-template-columns: 1fr !important; border-radius: 12px !important; }
          .home-timeline > div { border-right: none !important; border-bottom: 1px solid #e8e4de !important; padding: 14px 16px !important; display: flex !important; align-items: center !important; gap: 12px !important; text-align: left !important; }
          .home-timeline > div:last-child { border-bottom: none !important; }
          .home-timeline > div > div:first-child { margin: 0 !important; }
          .advisor-cta { margin-bottom: 8px !important; }
          .advisor-cta .hero-section { padding: 20px 16px !important; flex-direction: column !important; text-align: center !important; border-radius: 16px !important; }
          .advisor-cta .hero-section button { width: 100% !important; }
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
          .fria-step-tabs { overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; }
          .fria-step-tabs button { min-width: 80px !important; flex-shrink: 0 !important; }
          .fria-results-grid { grid-template-columns: 1fr !important; }
          .fria-email-form { flex-direction: column !important; }
          .fria-email-form input { width: 100% !important; }
          .fria-email-form button { width: 100% !important; }
          .fria-card-inner { padding: 24px 16px !important; }
          .fria-heatmap { grid-template-columns: 1fr !important; }
          .role-id-header { padding: 24px 0 20px !important; }
          .role-id-title { font-size: 26px !important; }
          .role-id-subtitle { font-size: 13px !important; }
          .role-id-card { padding: 24px 20px !important; }
          .role-result-header { flex-wrap: wrap !important; }
          .role-result-actions { flex-direction: column !important; }
          .role-result-actions button { width: 100% !important; justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .stats-grid .stat-value { font-size: 16px !important; }
          .role-bar { display: flex !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; }
          .role-bar button { font-size: 11px !important; padding: 7px 10px !important; min-height: 36px !important; white-space: nowrap !important; }
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
          .fria-step-tabs button { min-width: 70px !important; font-size: 10px !important; padding: 6px 2px !important; }
          .fria-card-inner { padding: 20px 12px !important; }
          .fria-results-title { font-size: 18px !important; }
        }
      `}</style>

      {isMobileOpen && <div role="presentation" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 20 }} onClick={() => { setIsMobileOpen(false); requestAnimationFrame(() => menuBtnRef.current?.focus()); }} />}

      <Sidebar view={view} setView={setView} selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}
        selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle}
        isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} activeRole={activeRole} setSelectedRecital={setSelectedRecital}
        onAboutClick={() => setShowAbout(true)} onArticleClick={handleArticleClick} onThemeClick={handleThemeClick} onRecitalsClick={handleRecitalsClick}
        onAnnexesClick={handleAnnexesClick} onAnnexClick={handleAnnexClick} selectedAnnex={selectedAnnex}
        onFRIAClick={handleFRIAClick} onTimelineClick={handleTimelineClick} onBlogClick={handleBlogClick} onRoleIdentifierClick={handleRoleIdentifierClick} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} aria-hidden={isMobileOpen || undefined}>
        {/* Top Bar */}
        <header className="top-bar" style={{ flexShrink: 0, background: COLORS.white, borderBottom: `1px solid ${COLORS.borderDefault}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <button ref={menuBtnRef} onClick={() => setIsMobileOpen(true)}
            aria-label="Open navigation menu"
            style={{ display: "none", padding: 8, border: "none", background: "none", cursor: "pointer", color: COLORS.textMuted }}
            className="mobile-menu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <style>{`@media (max-width: 1023px) { .mobile-menu-btn { display: block !important; } }`}</style>

          {/* Site Logo */}
          <a href="/" onClick={(e) => { e.preventDefault(); handleHomeClick(); }} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textDecoration: "none", flexShrink: 0 }}>
            <img className="site-logo-img" src="/apple-touch-icon.png" alt="EU AI Act Navigator" width="34" height="34" style={{ width: 34, height: 34, borderRadius: 8 }} />
            <span className="site-logo-text" style={{ fontSize: 15, fontWeight: 600, color: COLORS.textPrimary, fontFamily: SANS, whiteSpace: "nowrap" }}>EU AI Act Navigator</span>
          </a>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="breadcrumb" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: COLORS.textPlaceholder, marginRight: 16, flexShrink: 0 }}>
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
            {view === "role-identifier" && <>
              <span style={{ color: "#d1d5db" }}>/</span>
              <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Role Identifier</span>
            </>}
            {(view === "blog" || view === "blogpost") && <>
              <span style={{ color: "#d1d5db" }}>/</span>
              <button onClick={handleBlogClick} style={{ background: "none", border: "none", cursor: "pointer", color: view === "blogpost" ? "#4a5f74" : "#1a1a1a", fontFamily: SANS, fontSize: 14, fontWeight: view === "blogpost" ? 400 : 600, padding: 0 }}>Blog</button>
              {view === "blogpost" && blogSlug && <>
                <span style={{ color: "#d1d5db" }}>/</span>
                <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{BLOG_POSTS.find(p => p.slug === blogSlug)?.title?.substring(0, 40) || "Article"}...</span>
              </>}
            </>}
            {(view === "annexes" || view === "annex") && <>
              <span style={{ color: "#d1d5db" }}>/</span>
              <button onClick={handleAnnexesClick} style={{ background: "none", border: "none", cursor: "pointer", color: view === "annex" ? "#4a5f74" : "#1a1a1a", fontFamily: SANS, fontSize: 14, fontWeight: view === "annex" ? 400 : 600, padding: 0 }}>Annexes</button>
              {view === "annex" && selectedAnnex && <>
                <span style={{ color: "#d1d5db" }}>/</span>
                <span style={{ color: "#1a1a1a", fontWeight: 600 }}>Annex {ANNEXES.find(a => a.id === selectedAnnex)?.number}</span>
              </>}
            </>}
          </nav>

          <div className="search-bar-wrap" style={{ flex: 1, maxWidth: 520 }}>
            <SearchBar query={searchQuery} setQuery={setSearchQuery} resultCount={searchResultCount} />
          </div>

          {/* AI Advisor button */}
          <button aria-label="AI Advisor" onClick={() => setChatOpen(true)}
            style={{ flexShrink: 0, padding: "8px 14px", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryHover})`, border: "none", borderRadius: RADIUS.md, cursor: "pointer", fontSize: 13, color: "white", fontFamily: SANS, display: "flex", alignItems: "center", gap: 6, fontWeight: 500, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <span className="btn-label">AI Advisor</span>
          </button>

          {/* About button */}
          <button className="about-btn" aria-label="About" onClick={() => setShowAbout(true)}
            style={{ flexShrink: 0, padding: "8px 14px", background: "none", border: `1px solid ${COLORS.borderLight}`, borderRadius: RADIUS.md, cursor: "pointer", fontSize: 13, color: COLORS.textMuted, fontFamily: SANS, display: "flex", alignItems: "center", gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primaryLinkUnderline; e.currentTarget.style.color = COLORS.primary; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.color = COLORS.textMuted; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
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
                aria-pressed={isActive}
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
              Showing articles relevant to <strong>{ROLES[activeRole].labelPlural || ROLES[activeRole].label}</strong>. {ROLES[activeRole].description}.
              <button onClick={() => setActiveRole("all")} style={{ marginLeft: 8, fontSize: 12, color: COLORS.primary, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: SANS }}>Show all</button>
            </p>
          </div>
        )}

        {/* Content */}
        <div ref={mainRef} tabIndex={-1} className="main-content" style={{ flex: 1, overflowY: "auto", padding: "28px 32px 60px", outline: "none" }}>
        <main id="main-content">
          <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 120px)" }}><div style={{ width: 32, height: 32, border: `3px solid ${COLORS.borderDefault}`, borderTopColor: COLORS.primary, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>}>
          {isSearching ? (
            <SearchResults query={debouncedQuery} onArticleClick={handleArticleClick} />
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
          ) : view === "role-identifier" ? (
            <RoleIdentifier onArticleClick={handleArticleClick} onApplyRole={handleApplyRole} onFRIAClick={handleFRIAClick} />
          ) : view === "blog" ? (
            <BlogView onBlogPostClick={handleBlogPostClick} />
          ) : view === "blogpost" && blogSlug ? (
            <BlogPost slug={blogSlug} onBlogClick={handleBlogClick} onArticleClick={handleArticleClick} />
          ) : view === "annexes" ? (
            <AnnexView onAnnexClick={handleAnnexClick} onArticleClick={handleArticleClick} />
          ) : view === "annex" && selectedAnnex ? (
            <AnnexView annexId={selectedAnnex} onAnnexClick={handleAnnexClick} onArticleClick={handleArticleClick} />
          ) : view === "notfound" ? (
            <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
              <h1 style={{ fontSize: 28, fontWeight: 400, color: COLORS.textPrimary, margin: "0 0 12px", fontFamily: SERIF }}>Page Not Found</h1>
              <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.6, margin: "0 0 32px", fontFamily: SANS }}>
                The page you're looking for doesn't exist. It may have been moved or the URL may be incorrect.
              </p>
              <a href="/" onClick={(e) => { e.preventDefault(); setView("home"); window.history.pushState({}, "", "/"); }}
                style={{ display: "inline-block", padding: "12px 28px", background: COLORS.primary, color: "white", textDecoration: "none", borderRadius: RADIUS.xl, fontSize: 15, fontWeight: 600, fontFamily: SANS }}>
                Back to EU AI Act Navigator
              </a>
            </div>
          ) : (
            <HomeView onArticleClick={handleArticleClick} onThemeClick={handleThemeClick} activeRole={activeRole} setActiveRole={setActiveRole} onChatOpen={() => setChatOpen(true)} onFRIAClick={handleFRIAClick} onTimelineClick={handleTimelineClick} onBlogClick={handleBlogClick} onRoleIdentifierClick={handleRoleIdentifierClick} onRecitalsClick={handleRecitalsClick} onAnnexesClick={handleAnnexesClick} />
          )}

          {/* Footer */}
          <footer style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${COLORS.borderDefault}` }}>
            <p style={{ fontSize: 11, color: "#3d4f5f", lineHeight: 1.6, margin: "0 0 14px", fontFamily: SANS }}>
              Built by Paul McCormack — lawyer, product leader, and founder of Kormoon. This site is an independent informational resource only and does not constitute legal advice. No reliance should be placed on its contents. For the authoritative text, refer to the official EUR-Lex source linked in the Annexes tab, or consult your legal advisor.
            </p>
            <div className="footer-inner" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <p style={{ fontSize: 12, color: "#3d4f5f", margin: 0, fontFamily: SANS }}>
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
                <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: COLORS.warmText, fontFamily: SANS, textDecoration: "underline", textDecorationColor: COLORS.warmGold }}>
                  Official EUR-Lex Source
                </a>
              </div>
            </div>
          </footer>

          </Suspense>
        </main>
        </div>
      </div>

      <Suspense fallback={null}>
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} onKeyDown={e => { if (e.key === "Escape") setShowAbout(false); }} />}
        {showTerms && <TermsModal onClose={() => setShowTerms(false)} onKeyDown={e => { if (e.key === "Escape") setShowTerms(false); }} />}
        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} onKeyDown={e => { if (e.key === "Escape") setShowPrivacy(false); }} />}
      </Suspense>
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
      <Suspense fallback={null}>
        <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} onArticleClick={(num) => { handleArticleClick(num); setChatOpen(false); }} onRecitalClick={() => { handleRecitalsClick(); setChatOpen(false); }} currentArticle={view === "article" ? selectedArticle : null} />
      </Suspense>
    </div>
  );
}
