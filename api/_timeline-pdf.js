// Server-side generator for the EU AI Act Compliance Timeline PDF.
// Shared by GET /api/timeline-pdf (download) and POST /api/email-timeline (email).
// Built with @react-pdf/renderer's Node API. No JSX (this is a .js serverless
// function), so the document tree is composed with React.createElement.
import React from "react";
import path from "path";
import { renderToBuffer, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { DEADLINES, TIMELINE_META } from "../src/data/timeline.js";

const h = React.createElement;
const fontPath = (f) => path.join(process.cwd(), "public", "fonts", f);

let registered = false;
function registerFonts() {
  if (registered) return;
  Font.register({
    family: "Spectral",
    fonts: [
      { src: fontPath("Spectral-Regular.ttf"), fontWeight: 400 },
      { src: fontPath("Spectral-Medium.ttf"), fontWeight: 500 },
      { src: fontPath("Spectral-SemiBold.ttf"), fontWeight: 600 },
    ],
  });
  // Avoid hyphenation breaking words mid-line.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}

const NAVY = "#1e3a5f";
const INK = "#1a1a1a";
const BODY = "#374151";
const MUTED = "#6b7280";
const GOLD = "#9a7b3f";
const LINE = "#e6e2db";

const styles = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 56, paddingHorizontal: 50, fontFamily: "Helvetica", fontSize: 9.5, color: BODY, lineHeight: 1.5 },
  eyebrow: { fontFamily: "Helvetica-Bold", fontSize: 8, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 10 },
  title: { fontFamily: "Spectral", fontWeight: 600, fontSize: 24, color: INK, lineHeight: 1.2, marginBottom: 10 },
  subtitle: { fontSize: 10.5, color: MUTED, marginTop: 0, maxWidth: 430, lineHeight: 1.45 },
  meta: { fontSize: 8.5, color: MUTED, marginTop: 8 },
  rule: { borderBottomWidth: 1, borderBottomColor: LINE, marginVertical: 16 },

  noteBox: { backgroundColor: "#fffbeb", borderLeftWidth: 3, borderLeftColor: "#d97706", borderRadius: 3, padding: "10 12", marginBottom: 16 },
  noteHeading: { fontFamily: "Helvetica-Bold", fontSize: 8.5, color: "#92400e", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  noteText: { fontSize: 9, color: "#92400e", lineHeight: 1.55 },

  cardsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  card: { flex: 1, borderWidth: 1, borderColor: LINE, borderRadius: 6, padding: "12 14" },
  cardLabel: { fontFamily: "Helvetica-Bold", fontSize: 7.5, letterSpacing: 1, color: MUTED, textTransform: "uppercase" },
  cardDate: { fontFamily: "Spectral", fontWeight: 600, fontSize: 15, color: NAVY, marginTop: 4 },
  cardSub: { fontSize: 8.5, color: MUTED, marginTop: 3, lineHeight: 1.4 },

  sectionHeading: { fontFamily: "Spectral", fontWeight: 600, fontSize: 14, color: INK, marginBottom: 12 },

  item: { flexDirection: "row", marginBottom: 16 },
  itemLeft: { width: 108, paddingRight: 12 },
  itemDate: { fontFamily: "Spectral", fontWeight: 600, fontSize: 11.5, color: NAVY },
  pill: { alignSelf: "flex-start", marginTop: 5, fontSize: 6.5, fontFamily: "Helvetica-Bold", letterSpacing: 0.5, textTransform: "uppercase", borderRadius: 3, paddingVertical: 2, paddingHorizontal: 5 },
  itemRight: { flex: 1, borderLeftWidth: 1, borderLeftColor: LINE, paddingLeft: 14 },
  itemTitle: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: INK, marginBottom: 3 },
  itemDesc: { fontSize: 9, color: BODY, marginBottom: 6, lineHeight: 1.5 },
  bulletRow: { flexDirection: "row", marginBottom: 2.5 },
  bulletDot: { width: 9, fontSize: 9, color: GOLD },
  bulletText: { flex: 1, fontSize: 8.5, color: BODY, lineHeight: 1.45 },
  articles: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 },
  article: { fontSize: 7, color: NAVY, backgroundColor: "#f0f4ff", borderWidth: 1, borderColor: "#c7d6ec", borderRadius: 3, paddingVertical: 1.5, paddingHorizontal: 5 },

  sourcesHeading: { fontFamily: "Helvetica-Bold", fontSize: 8, letterSpacing: 0.5, color: MUTED, textTransform: "uppercase", marginBottom: 5 },
  source: { fontSize: 8, color: MUTED, marginBottom: 2 },

  footer: { position: "absolute", bottom: 28, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: MUTED, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 6 },
});

function statusFor(d, now) {
  if (d.pending) return { label: "Pending OJ", bg: "#faf5ff", color: "#5b21b6", border: "#e9d5ff" };
  const passed = new Date(d.isoDate) < now;
  return passed
    ? { label: "In force", bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" }
    : { label: "Upcoming", bg: "#f0f4ff", color: NAVY, border: "#c7d6ec" };
}

function deadlineItem(d, now) {
  const st = statusFor(d, now);
  return h(View, { style: styles.item, wrap: false, key: d.isoDate },
    h(View, { style: styles.itemLeft },
      h(Text, { style: styles.itemDate }, d.date),
      h(Text, { style: [styles.pill, { backgroundColor: st.bg, color: st.color, borderWidth: 1, borderColor: st.border }] }, st.label),
    ),
    h(View, { style: styles.itemRight },
      h(Text, { style: styles.itemTitle }, d.title),
      h(Text, { style: styles.itemDesc }, d.description),
      ...d.details.map((line, i) =>
        h(View, { style: styles.bulletRow, key: i },
          h(Text, { style: styles.bulletDot }, "•"),
          h(Text, { style: styles.bulletText }, line),
        )
      ),
      d.articles && d.articles.length
        ? h(View, { style: styles.articles }, ...d.articles.map((a, i) => h(Text, { style: styles.article, key: i }, a)))
        : null,
    ),
  );
}

function buildDocument(now) {
  const generated = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const transparency = DEADLINES.find((d) => d.highlight);
  const fria = DEADLINES.find((d) => d.friaPrimary);

  return h(Document, { title: "EU AI Act Compliance Timeline", author: "euai.app", creator: "euai.app", subject: "EU AI Act phased application timeline (Digital Omnibus update)" },
    h(Page, { size: "A4", style: styles.page },
      // Header
      h(Text, { style: styles.eyebrow }, "EUAI.APP  ·  EU AI ACT REFERENCE"),
      h(Text, { style: styles.title }, TIMELINE_META.title),
      h(Text, { style: styles.subtitle }, TIMELINE_META.subtitle),
      h(Text, { style: styles.meta }, `Last reviewed ${TIMELINE_META.lastReviewed}  ·  Generated ${generated}  ·  euai.app/timeline`),
      h(View, { style: styles.rule }),

      // Digital Omnibus status note
      h(View, { style: styles.noteBox },
        h(Text, { style: styles.noteHeading }, "Status: high-risk deadlines deferred (Digital Omnibus) — pending Official Journal"),
        h(Text, { style: styles.noteText }, TIMELINE_META.omnibusNote),
      ),

      // Two headline figures
      h(View, { style: styles.cardsRow },
        transparency ? h(View, { style: styles.card },
          h(Text, { style: styles.cardLabel }, "Transparency obligations"),
          h(Text, { style: styles.cardDate }, transparency.date),
          h(Text, { style: styles.cardSub }, "Article 50 — disclose AI interaction; mark synthetic content"),
        ) : null,
        fria ? h(View, { style: [styles.card, { borderLeftWidth: 3, borderLeftColor: NAVY }] },
          h(Text, { style: styles.cardLabel }, "High-risk & FRIA  ·  pending OJ"),
          h(Text, { style: styles.cardDate }, fria.date),
          h(Text, { style: styles.cardSub }, "Article 27 — Annex III high-risk obligations & FRIA"),
        ) : null,
      ),

      // Full timeline
      h(Text, { style: styles.sectionHeading }, "The full timeline"),
      ...DEADLINES.map((d) => deadlineItem(d, now)),

      // Sources
      h(View, { style: styles.rule }),
      h(Text, { style: styles.sourcesHeading }, "Primary sources & analysis"),
      ...TIMELINE_META.sources.map((s, i) => h(Text, { style: styles.source, key: i }, `•  ${s}`)),

      // Footer (repeats on every page)
      h(View, { style: styles.footer, fixed: true },
        h(Text, null, "Informational only — not legal advice. Authoritative text: EUR-Lex (Regulation (EU) 2024/1689)."),
        h(Text, { render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}` }),
      ),
    ),
  );
}

export async function renderTimelinePdf(now = new Date()) {
  registerFonts();
  return renderToBuffer(buildDocument(now));
}
