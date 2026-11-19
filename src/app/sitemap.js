import connectDb from "@/lib/db";
import Product from "@/models/product.model";
import { getAllPosts } from "@/lib/blogData";
import { LOCATIONS } from "@/content/locations";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_PAGES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/user/products", changeFrequency: "daily", priority: 0.95 },
  { path: "/user/bulk-order", changeFrequency: "monthly", priority: 0.9 },
  { path: "/user/custom-design", changeFrequency: "monthly", priority: 0.8 },
  { path: "/water-hyacinth-products", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/user/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/user/about/brand-story", changeFrequency: "monthly", priority: 0.7 },
  { path: "/user/sustainability", changeFrequency: "monthly", priority: 0.7 },
  { path: "/user/partners", changeFrequency: "monthly", priority: 0.5 },
  { path: "/track", changeFrequency: "yearly", priority: 0.5 },
  { path: "/share-catalog", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap() {
  const now = new Date();
  const entries = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  try {
    await connectDb();
    const products = await Product.find({ status: { $ne: "draft" } }).select("_id updatedAt images").lean();
    for (const p of products) {
      entries.push({
        url: `${SITE_URL}/user/products/${p._id}`,
        lastModified: p.updatedAt || now,
        changeFrequency: "weekly",
        priority: 0.85,
        images: (p.images || []).slice(0, 3).map((im) => (im.url?.startsWith("http") ? im.url : `${SITE_URL}${im.url}`)),
      });
    }
  } catch (err) {
    console.error("Sitemap: product fetch failed", err);
  }

  const posts = await getAllPosts();
  for (const post of posts) {
    entries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const loc of LOCATIONS) {
    entries.push({
      url: `${SITE_URL}/water-hyacinth-products/${loc.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: loc.home ? 0.8 : 0.6,
    });
  }

  return entries;
}
