import connectDb from "@/lib/db";
import Blog from "@/models/blog.model";
import { ARTICLES, findArticle } from "@/content/articles";

const stripHtml = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const excerptOf = (html, n = 180) => {
  const t = stripHtml(html);
  return t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, "")}…` : t;
};

const fromArticle = (a) => ({
  slug: a.slug,
  title: a.title,
  description: a.description,
  excerpt: a.description,
  content: a.content,
  image: a.image,
  author: "KrisluxECO Team",
  createdAt: new Date(a.date).toISOString(),
  updatedAt: new Date(a.updated || a.date).toISOString(),
  keywords: a.keywords || [],
  faqs: a.faqs || [],
  readMinutes: a.readMinutes,
  source: "built-in",
});

const fromDb = (b) => ({
  slug: b.slug,
  title: b.title,
  description: excerptOf(b.content, 155),
  excerpt: excerptOf(b.content),
  content: b.content,
  image: b.image,
  author: b.author || "KrisluxECO Team",
  createdAt: new Date(b.createdAt).toISOString(),
  updatedAt: new Date(b.updatedAt || b.createdAt).toISOString(),
  keywords: b.tags || [],
  faqs: [],
  readMinutes: Math.max(2, Math.round(stripHtml(b.content).split(" ").length / 200)),
  source: "admin",
});

/** All published posts (admin posts + built-in articles), newest first. */
export async function getAllPosts() {
  let dbPosts = [];
  try {
    await connectDb();
    const rows = await Blog.find({ status: "published" }).sort({ createdAt: -1 }).lean();
    dbPosts = rows.map(fromDb);
  } catch (err) {
    console.error("Blog fetch failed, showing built-in articles only:", err);
  }
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const builtIn = ARTICLES.filter((a) => !dbSlugs.has(a.slug)).map(fromArticle);
  return [...dbPosts, ...builtIn].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** One post by slug — an admin post with the same slug overrides a built-in one. */
export async function getPost(slug) {
  try {
    await connectDb();
    const row = await Blog.findOne({ slug, status: "published" }).lean();
    if (row) return fromDb(row);
  } catch (err) {
    console.error("Blog lookup failed:", err);
  }
  const a = findArticle(slug);
  return a ? fromArticle(a) : null;
}
