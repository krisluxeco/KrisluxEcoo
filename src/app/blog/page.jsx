import BlogListing from "@/components/BlogListClient";
import JsonLd from "@/components/JsonLd";
import { getAllPosts } from "@/lib/blogData";
import { pageMetadata, breadcrumbJsonLd, absoluteUrl, SITE_URL } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Journal — Water Hyacinth Craft, Sustainable Décor & Buying Guides",
  description:
    "Guides and stories from KrisluxECO: what water hyacinth is, how to care for natural baskets, eco-friendly hotel décor, sustainable corporate gifting in India and bulk buying tips.",
  path: "/blog",
  keywords: ["water hyacinth blog", "sustainable living India", "eco-friendly decor guide", "handicraft buying guide"],
});

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${SITE_URL}/blog#blog`,
            name: "The KrisluxECO Journal",
            url: absoluteUrl("/blog"),
            publisher: { "@id": `${SITE_URL}/#organization` },
            blogPost: posts.slice(0, 20).map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: absoluteUrl(`/blog/${p.slug}`),
              datePublished: p.createdAt,
            })),
          },
        ]}
      />
      <BlogListing initialBlogs={posts} />
    </>
  );
}
