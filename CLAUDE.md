# EU AI Act Navigator

## Overview

Interactive single-page application for navigating the EU AI Act (Regulation (EU) 2024/1689). Provides full-text access to all 113 articles and 180 recitals, with search, thematic groupings, role-based filtering, plain English summaries, and an AI-powered chat advisor (Claude Sonnet via Anthropic API).

**Author:** Paul McCormack (paul@kormoon.ai / kormoon.ai)

## Tech Stack

- **Frontend:** React 19 + Vite 7 (JSX, no TypeScript)
- **Backend:** Vercel Serverless Function (`api/chat.js`)
- **AI:** Anthropic Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) with streaming SSE
- **Analytics/Logging:** Supabase (chat_logs table)
- **Deployment:** Vercel (project: `eu-ai-act-navigator`)
- **Styling:** Inline styles (no CSS framework, no CSS modules)
- **Fonts:** LoveFrom Serif (embedded woff2) + DM Sans (Google Fonts CDN)
- **Linting:** ESLint 9 with react-hooks and react-refresh plugins

## Project Structure

```
eu-ai-act-navigator/
  index.html              # Entry point, mounts #root
  vite.config.js          # Vite config (react plugin only)
  eslint.config.js        # ESLint flat config
  package.json            # Dependencies (react, react-dom only)
  api/
    chat.js               # Vercel serverless — proxies Anthropic API with SSE streaming, logs to Supabase
  src/
    main.jsx              # React root render (StrictMode)
    App.jsx               # ENTIRE application in one file (~2019 lines)
    assets/
      react.svg
  dist/                   # Build output (committed)
  .vercel/                # Vercel project config
```

## Architecture

### Single-File Application (`src/App.jsx`)

The entire UI is in one file. There are no external components, hooks, or state management libraries.

**Sections (by line region):**

| Lines | Section | Description |
|-------|---------|-------------|
| 1 | Imports | React hooks: useState, useEffect, useMemo, useCallback, useRef |
| 3–15 | Font CSS | Embedded LoveFrom Serif woff2 font-face |
| 16–28 | Data | `EU_AI_ACT_DATA` — full Act text as inline JSON (~600KB) |
| 19 | Data const | `EU_AI_ACT_DATA` — articles, recitals, chapters, themes, metadata, crossReferences |
| 20 | Data const | `PLAIN_SUMMARIES` — plain English summaries keyed by article number |
| 29–38 | Constants | Typography (`SERIF`, `SANS`) and color constants |
| 40–68 | Utilities | `highlightText`, `truncateText`, `formatArticleText`, `renderHighlightedParts` |
| 70–400 | Components | SearchBar, ThemeBadge, RecitalCard, DefinitionsView |
| 402–423 | Role Config | `ROLES` constant — provider, deployer, affected person article lists |
| 424–587 | Component | ProhibitedPracticesView (Article 5 special view) |
| 588–758 | Component | ArticleDetail — main article viewer with plain English toggle |
| 759–830 | Component | ThemeView — articles grouped by theme |
| 831–905 | Component | SearchResults — full-text search across articles + recitals |
| 906–1046 | Modals | AboutModal, TermsModal, PrivacyModal |
| 1047–1248 | Component | HomeView — landing page with stats, key articles, themes grid |
| 1249–1454 | Component | Sidebar — chapter/section tree navigation with expandable sections |
| 1455–1781 | Component | ChatPanel — AI advisor with SSE streaming, markdown rendering, article linking |
| 1782–2019 | Component | App (default export) — root layout, routing, top bar, role filter, footer |

### Navigation / Routing

No router library. View state is managed via `useState`:
- `view`: "home" | "article" | "theme"
- `selectedArticle`: article number (1-113) or null
- `selectedTheme`: theme id string or null
- `searchQuery`: triggers SearchResults overlay when >= 2 chars

### Components

- **SearchBar** — real-time search input with result count badge
- **ThemeBadge** — colored pill for theme categories
- **RecitalCard** — expandable recital display with article cross-references
- **DefinitionsView** — special view for Article 3 (definitions), grouped alphabetically with local search
- **ProhibitedPracticesView** — special view for Article 5 with expandable prohibited practice items
- **ArticleDetail** — full article text, plain English summary toggle, related recitals, theme badges, article cross-references
- **ThemeView** — list of articles within a theme, with related recitals
- **SearchResults** — combined article + recital search results
- **HomeView** — hero section, stats grid (113 articles, 180 recitals, 13 chapters, 19 themes), key articles cards, themes overview
- **Sidebar** — tree navigation: chapters > sections > articles, plus themes list
- **ChatPanel** — sliding AI chat panel with SSE streaming, message history, article reference parsing, 5-question free limit per session
- **AboutModal / TermsModal / PrivacyModal** — overlay modals

### Role-Based Filtering

Three roles filter which articles are shown/highlighted:
- **Provider of AI** — 65 articles (develops, trains, places on market)
- **Deployer of AI** — 37 articles (uses AI professionally)
- **Affected person** — 15 articles (subject to AI decisions)
- **All provisions** — no filter (default)

Role filter is displayed as a bar below the top bar. When active, articles outside the role scope show a warning banner.

## Data Model (`EU_AI_ACT_DATA`)

Embedded as a ~600KB inline JSON constant. Structure:

```
{
  metadata: { title, subtitle, date, published, entry_into_force, oj_reference }
  chapters: [{ id, title, articles: [number], sections?: [{ id, title, articles }] }]
  themes: [{ id, name, description, articles: [number], color }]
  articles: { [number]: { number, title, text, chapter, themes: [id], relatedRecitals: [number] } }
  recitals: { [number]: { number, text, relatedArticles: [number], themes: [id] } }
  crossReferences: { articleToRecitals: { [artNum]: [recitalNums] } }
}
```

`PLAIN_SUMMARIES`: `{ [articleNumber]: "plain English summary text" }` — covers all 113 articles.

## API (`api/chat.js`)

Vercel serverless function at `/api/chat`. POST only.

**Request body:**
```json
{
  "messages": [{ "role": "user|assistant", "content": "..." }],
  "context": "optional article context string",
  "sessionId": "client-generated session id",
  "question": "the current question text"
}
```

**Behavior:**
1. Validates input and API key
2. Calls Anthropic Messages API with streaming enabled
3. Pipes SSE events (`data: {"text":"..."}`) to client
4. After stream completes, logs to Supabase `chat_logs` table asynchronously

**Environment variables (Vercel):**
- `ANTHROPIC_API_KEY` — required
- `SUPABASE_URL` — optional (logging)
- `SUPABASE_SERVICE_KEY` — optional (logging)

**System prompt:** Configures Claude as "AI Act Advisor" with knowledge of all 113 articles, 180 recitals, timelines, classification procedures, penalty framework. Formatting rules enforce chat-friendly output (no markdown headers, short paragraphs, bold for emphasis).

## Styling Conventions

- **All inline styles** — no CSS files, no CSS-in-JS library
- **Responsive:** Media queries injected via `<style>` tags in JSX at breakpoints 1023px and 480px
- **Color palette:** Navy (#1e3a5f), warm beige/tan backgrounds (#f7f5f2, #f0ede6), gold accents (#8b7355, #d4c5a9)
- **Typography:** DM Sans for UI, LoveFrom Serif for headings/hero text
- **Border radius:** 10-16px for cards, 8px for buttons, 20px for pills
- **Hover effects:** Inline `onMouseEnter`/`onMouseLeave` handlers modifying `style` properties

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # ESLint check
```

## Key Patterns

- **No external state management** — all state via React hooks in component tree
- **No routing library** — view switching via useState
- **Inline data** — entire EU AI Act text embedded in App.jsx (no API calls for content)
- **SSE streaming** — chat responses stream token-by-token from Anthropic API via Vercel serverless proxy
- **Session-based rate limiting** — 5 free questions per chat session (client-side, resets on page reload)
- **Cross-referencing** — articles link to related recitals and vice versa; chat responses parse `Article N` references into clickable links
- **Accessibility:** Minimal — no ARIA attributes, keyboard nav limited to native browser behavior
