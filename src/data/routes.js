import { EU_AI_ACT_DATA } from "./eu-ai-act-data.js";
import { BLOG_POSTS } from "./blog-posts.js";
import { ANNEXES } from "./annexes.js";

/**
 * Returns all routable URL paths for the site.
 * Used by the prerender script and sitemap generator.
 */
export function getAllRoutes() {
  const routes = [];

  // Home
  routes.push("/");

  // Articles (113)
  for (const num of Object.keys(EU_AI_ACT_DATA.articles).sort((a, b) => Number(a) - Number(b))) {
    routes.push(`/article/${num}`);
  }

  // Themes (19)
  for (const theme of EU_AI_ACT_DATA.themes) {
    routes.push(`/theme/${theme.id}`);
  }

  // Static pages
  routes.push("/recitals");
  routes.push("/fria");
  routes.push("/timeline");
  routes.push("/role-identifier");

  // Annexes
  routes.push("/annexes");
  for (const annex of ANNEXES) {
    routes.push(`/annex/${annex.id}`);
  }

  // Blog
  routes.push("/blog");
  for (const post of BLOG_POSTS) {
    routes.push(`/blog/${post.slug}`);
  }

  return routes;
}
