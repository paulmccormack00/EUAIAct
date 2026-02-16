---
title: "feat: Enhanced Recitals Browsing and Cross-References"
type: feat
status: completed
date: 2026-02-16
---

# Enhanced Recitals Browsing and Cross-References

## Overview

Add three interconnected recitals enhancements to the EU AI Act Navigator:

1. **Enhanced recital-to-article mappings** — Comprehensive, legally-accurate `RECITAL_TO_ARTICLE_MAP` (all 180 recitals) with computed reverse `ARTICLE_TO_RECITAL_MAP`, replacing the existing incomplete mappings
2. **Inline recitals on article pages** — Replace the existing `RecitalCard` list at the bottom of `ArticleDetail` with an `InlineRecitals` accordion component showing related recitals with clickable cross-references
3. **Recitals browsing tab** — Full `EnhancedRecitalsTab` view rendered when clicking the sidebar "Recitals" tab (currently a no-op), with search, article filtering, expand/collapse all, and clickable article chips

Source implementation: `EnhancedRecitalsFeature.txt` (copied to project root)

## Problem Statement

The current recitals experience has significant gaps:

- **Sidebar "Recitals" tab is non-functional** — clicking it sets `view === "recitals"` but the main content area has no corresponding render branch (falls through to `HomeView`)
- **Sidebar recital list is not clickable** — all 180 recitals are listed with truncated text and a no-op click handler (`src/App.jsx:1435`)
- **No dedicated recitals browsing view** — users cannot search, filter, or browse recitals independently
- **Limited cross-referencing** — the existing `relatedRecitals`/`relatedArticles` data may be incomplete compared to the new legally-analyzed mappings
- **ArticleDetail recitals section is basic** — renders `RecitalCard` components at the bottom of the page with no inline article cross-reference chips

## Proposed Solution

Integrate the three components from `EnhancedRecitalsFeature.txt` into `src/App.jsx`, adapting them to the existing single-file architecture, warm color palette, and inline styling conventions.

## Technical Approach

### Architecture

All changes are within `src/App.jsx` (single-file architecture). No new files, no new dependencies.

### Key Design Decisions

**D1. Data Authority — New maps are authoritative.**
The new `RECITAL_TO_ARTICLE_MAP` and computed `ARTICLE_TO_RECITAL_MAP` become the primary source of truth for recital-article relationships. The existing `article.relatedRecitals` and `recital.relatedArticles` arrays in `EU_AI_ACT_DATA` remain unchanged (they're part of the embedded ~600KB JSON), but all *rendering* code will use the new maps. Both maps are computed at module scope (not inside components).

**D2. InlineRecitals replaces the existing "Related Recitals" section.**
The `InlineRecitals` accordion replaces the `RecitalCard` list at the bottom of `ArticleDetail` (`src/App.jsx:736-754`) and `ProhibitedPracticesView` (`src/App.jsx:566-583`). The existing `RecitalCard` component (`src/App.jsx:155-209`) is kept for use in `ThemeView` and `SearchResults` — no changes to those components.

**D3. Recital text source — Use full text from existing data.**
The provided `RECITAL_SUMMARIES` (~50 entries) are supplementary summaries. The components should primarily display the full recital text from `EU_AI_ACT_DATA.recitals[N].text` (which exists for all 180 recitals). The `RECITAL_SUMMARIES` can be shown as a concise preview when a recital is collapsed, with full text on expand.

**D4. Color palette — Remap to warm palette.**
All blue/indigo colors from the feature file are remapped to the app's warm palette:

| Feature file color | Purpose | Remapped to |
|---|---|---|
| `#4f46e5` / `#4338ca` (indigo) | Recital number, chip text | `#1e3a5f` (navy) |
| `#2563eb` (blue) | Article link text | `#1e3a5f` (navy) |
| `#eef2ff` (indigo-50) | Chip background, expanded header | `#f0f4ff` (existing article chip bg) |
| `#c7d2fe` (indigo-200) | Chip border, filter tag border | `#c7d6ec` (existing article chip border) |
| `#6366f1` (indigo-400) | SVG icon stroke | `#8b7355` (gold) |
| `#f8fafc` (slate-50) | Accordion outer bg | `#fdfaf6` (existing expanded recital bg) |
| `#e2e8f0` (slate-200) | Borders | `#e8e0d8` (existing recital border) |
| `#334155` / `#1e293b` (slate-800/900) | Text | `#1a1a1a` (existing text primary) |
| `#64748b` / `#94a3b8` (slate) | Muted text | `#4a5568` / `#6b7280` (existing muted) |

**D5. Global search takes priority over recitals view.**
When `isSearching` is true, `SearchResults` always renders regardless of current view. When cleared, the user returns to the recitals view.

**D6. Breadcrumb updated for recitals view.**
The breadcrumb at `src/App.jsx:1864-1878` will show "Home > Recitals" when `view === "recitals"`.

**D7. No role-based filtering of recitals (Phase 1).**
Recitals are shown regardless of active role. This matches the current behavior of recitals in `ArticleDetail`. Role filtering of recitals can be a future enhancement.

**D8. Chat panel parses "Recital N" references.**
Extend the regex at `src/App.jsx:1586` to match `Recital \d+` and navigate to the recitals tab with that recital highlighted.

### Implementation Phases

#### Phase 1: Data Layer — Maps and Summaries

**Tasks:**

- [x] Add `RECITAL_TO_ARTICLE_MAP` constant after `PLAIN_SUMMARIES` (after `src/App.jsx:20`)
  - All 180 entries from `EnhancedRecitalsFeature.txt:29-211`
  - Include inline comments for legal context
- [x] Add computed `ARTICLE_TO_RECITAL_MAP` at module scope (reverse map)
  - Compute once using `Object.entries().forEach()` pattern from feature file
  - Sort each article's recital array numerically
- [x] Add `RECITAL_SUMMARIES` constant (~50 key recital summaries)
  - From `EnhancedRecitalsFeature.txt:231-267`
  - Used as concise preview text in collapsed accordion items

**Files modified:** `src/App.jsx`

**Acceptance criteria:**
- [x] Both maps are accessible at module scope
- [x] `ARTICLE_TO_RECITAL_MAP[5]` returns recitals mapped to Article 5
- [x] `RECITAL_TO_ARTICLE_MAP[25]` returns `[5]` (Article 5)
- [x] No runtime computation inside components — all static at load time

#### Phase 2: InlineRecitals Component

**Tasks:**

- [x] Define `InlineRecitals` component in `src/App.jsx` (after `RecitalCard`, before `ArticleDetail`)
  - Props: `{ articleNumber, onArticleClick }`
  - Uses `ARTICLE_TO_RECITAL_MAP` to find linked recitals
  - Accordion header: "Related Recitals (N)" with book icon and chevron
  - Each recital item: expandable with number, summary preview (from `RECITAL_SUMMARIES`), full text (from `EU_AI_ACT_DATA.recitals`)
  - Article cross-reference chips on each recital row (excluding current article)
  - Clickable `Article N` references within recital text via `renderTextWithLinks`
- [x] Remap all colors to warm palette (per D4)
- [x] Replace existing "Related Recitals" section in `ArticleDetail` (`src/App.jsx:736-754`) with `<InlineRecitals articleNumber={articleNum} onArticleClick={onArticleClick} />`
- [x] Replace existing "Related Recitals" section in `ProhibitedPracticesView` (`src/App.jsx:566-583`) with `<InlineRecitals>`
- [x] Handle edge case: articles with 0 linked recitals (component returns `null`)

**Files modified:** `src/App.jsx`

**Acceptance criteria:**
- [x] ArticleDetail shows collapsible "Related Recitals" accordion after article text
- [x] Expanding the accordion shows individual recital items with number and preview
- [x] Expanding a recital shows full text with clickable `Article N` references
- [x] Article chips on recital rows navigate to the referenced article
- [x] Articles with no linked recitals show no accordion (graceful empty state)
- [x] ProhibitedPracticesView also uses InlineRecitals

#### Phase 3: EnhancedRecitalsTab and Routing

**Tasks:**

- [x] Define `EnhancedRecitalsTab` component in `src/App.jsx` (after `SearchResults`, before modals)
  - Props: `{ onArticleClick }`
  - Header: "Recitals" title with description text
  - Search input (local, scoped to recitals — number, keyword, or article)
  - Article filter dropdown (all articles that have mapped recitals, with recital count)
  - "Expand All" / "Collapse All" toggle button
  - Results count with active filter chip (dismissible)
  - List of 180 recital cards: number, summary preview (collapsed), full text (expanded), article chips, cross-reference footer
  - Empty state when no results match filters
  - Remap all colors to warm palette
- [x] Add `view === "recitals"` render branch in main App content area
  - Insert after `isSearching` check, before article checks (`src/App.jsx:~1958`)
  - Render `<EnhancedRecitalsTab onArticleClick={handleArticleClick} />`
- [x] Update breadcrumb (`src/App.jsx:1864-1878`) to handle `view === "recitals"`:
  - Show "Home > Recitals"
  - "Home" clicks back to home view
- [x] Update sidebar recitals click behavior (`src/App.jsx:1431-1441`):
  - Make individual recital items clickable — clicking navigates to `view === "recitals"` (the tab already does this, but individual items should also work)
  - Keep the sidebar list as a quick-nav index

**Files modified:** `src/App.jsx`

**Acceptance criteria:**
- [x] Clicking "Recitals" sidebar tab renders the EnhancedRecitalsTab in the main content area
- [x] Search filters recitals by number, keyword in text, or article reference
- [x] Article dropdown filters recitals to those mapped to the selected article
- [x] "Expand All" opens all visible recitals; "Collapse All" closes them
- [x] Active filter shows dismissible chip with article number
- [x] Clicking an article chip navigates to ArticleDetail for that article
- [x] Breadcrumb shows "Home > Recitals" on the recitals view
- [x] Empty state shown when search/filter returns no results
- [x] Global search (top bar) overrides recitals view (takes priority)

#### Phase 4: Chat Panel and Polish

**Tasks:**

- [x] Extend `renderInline` regex in `ChatPanel` (`src/App.jsx:1586`) to also match `Recital \d+`
  - Parse `Recital N` into clickable button that navigates to recitals view
  - Style consistently with existing `Article N` link buttons
- [x] Add responsive styles for new components at existing breakpoints:
  - At `1023px`: Stack search input and filter dropdown vertically, reduce padding
  - At `480px`: Full-width controls, smaller font sizes, hide article chips on recital rows (show on expand only)
- [x] Verify the `onRecitalClick` prop path works end-to-end (currently unused)
- [x] Test with role-based filtering active — ensure no crashes when role articles don't overlap with recital maps

**Files modified:** `src/App.jsx`

**Acceptance criteria:**
- [x] Chat responses with "Recital 47" render as clickable links
- [x] Clicking a recital link in chat navigates to recitals view
- [x] Mobile layout does not overflow horizontally
- [x] Controls stack properly on narrow viewports
- [x] No console errors with any role active

## Acceptance Criteria

### Functional Requirements

- [x] Sidebar "Recitals" tab renders the EnhancedRecitalsTab (currently renders HomeView)
- [x] InlineRecitals accordion appears on all ArticleDetail and ProhibitedPracticesView pages
- [x] All 180 recitals are browsable and searchable in the EnhancedRecitalsTab
- [x] Recital-to-article and article-to-recital cross-references are clickable throughout
- [x] Chat panel parses "Recital N" references into navigable links
- [x] Breadcrumb correctly reflects recitals view state

### Non-Functional Requirements

- [x] No new dependencies added to `package.json`
- [x] All styles are inline (no CSS files)
- [x] Color palette matches existing warm theme (navy, gold, beige)
- [x] Maps computed at module scope (no per-render computation)
- [x] 180-recital list renders without perceptible jank on modern devices

### Quality Gates

- [x] `npm run build` succeeds with no errors
- [x] `npm run lint` passes
- [x] No console warnings or errors in browser
- [x] Tested on desktop (>1023px) and mobile (<480px) viewports

## Dependencies & Prerequisites

- None — all data and components are self-contained within `src/App.jsx`
- `EnhancedRecitalsFeature.txt` is the source implementation (already in project root)

## Risk Analysis & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| App.jsx grows significantly (~300+ lines) | Longer file, harder to navigate | Keep components well-delimited with comment headers matching existing pattern |
| New maps disagree with existing `relatedRecitals`/`relatedArticles` | Inconsistent cross-references across views | New maps are authoritative for new components; existing data unchanged for backward compat |
| 180-item recital list causes jank on expand-all | Poor mobile performance | All collapsed by default; expand-all is opt-in; no virtual scrolling needed for Phase 1 |
| Color remapping introduces visual inconsistencies | Feature looks different from mockup | Define full color mapping table (see D4) before coding |

## Future Considerations

- **Role-filtered recitals** — Filter or dim recitals based on active role's article scope
- **Individual recital deep linking** — Add `selectedRecital` state for URL-like navigation to specific recitals
- **Virtual scrolling** — If performance becomes an issue with 180 items expanded
- **Recital reference in chat system prompt** — Update `api/chat.js` system prompt to instruct Claude to cite recitals by number
- **Sidebar recitals search** — Add a search input in the sidebar's recitals panel for quick filtering

## References

### Internal References

- Application: `src/App.jsx` (all components, ~2019 lines)
- RecitalCard component: `src/App.jsx:155-209`
- ArticleDetail component: `src/App.jsx:588-757`
- ArticleDetail related recitals section: `src/App.jsx:736-754`
- ProhibitedPracticesView related recitals: `src/App.jsx:566-583`
- Sidebar recitals tab: `src/App.jsx:1431-1441`
- Main content render chain: `src/App.jsx:1956-1986`
- Breadcrumb: `src/App.jsx:1864-1878`
- ChatPanel renderInline: `src/App.jsx:1586`
- View state management: `src/App.jsx:1786-1795`
- Color constants: `src/App.jsx:29-38`
- Feature source: `EnhancedRecitalsFeature.txt`

### Architecture Constraints

- Single-file application — all code in `src/App.jsx`
- No router library — view switching via `useState`
- All inline styles — no CSS files or CSS-in-JS
- Embedded data — ~600KB `EU_AI_ACT_DATA` inline constant
- React 19 + Vite 7, JSX only (no TypeScript)
