import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getAllPosts, getPost } from "@/lib/blogData";
import { ARTICLES } from "@/content/articles";
import { pageMetadata, breadcrumbJsonLd, faqJsonLd, absoluteUrl, SITE_URL, BUSINESS } from "@/lib/seo";

export const revalidate = 300;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const meta = pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    image: post.image || undefined,
    type: "article",
  });
  meta.openGraph.publishedTime = post.createdAt;
  meta.openGraph.modifiedTime = post.updatedAt;
  meta.openGraph.authors = [post.author];
  return meta;
}

const serif = "var(--font-playfair), Georgia, serif";
const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" });

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = (await getAllPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const hasImage = post.image && (post.image.startsWith("/") || post.image.startsWith("http"));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: hasImage ? [post.image.startsWith("http") ? post.image : absoluteUrl(post.image)] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author || BUSINESS.name, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.keywords?.join(", "),
    inLanguage: "en-IN",
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          ...(post.faqs?.length ? [faqJsonLd(post.faqs)] : []),
        ]}
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#9E9088] font-bold hover:text-[#C8A97A] transition-colors"
          >
            <ArrowLeft size={15} /> Back to Journal
          </Link>
        </nav>

        <article>
          <header className="text-center mb-10 space-y-5">
            <div className="flex items-center justify-center gap-3 text-xs tracking-widest uppercase text-[#C8A97A] font-bold">
              <time dateTime={post.createdAt}>{fmt(post.createdAt)}</time>
              {post.readMinutes && (
                <span className="inline-flex items-center gap-1 text-[#9E9088]">
                  <Clock size={12} /> {post.readMinutes} min read
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#1C1C1A] leading-tight" style={{ fontFamily: serif }}>
              {post.title}
            </h1>
            <p className="text-[#6B6560] text-base sm:text-lg leading-relaxed">{post.description}</p>
            <p className="text-[#9E9088] italic" style={{ fontFamily: serif }}>by {post.author}</p>
          </header>

          {hasImage && (
            <div className="relative w-full aspect-video overflow-hidden bg-white mb-12 border border-[#E8DDD0]">
              <Image src={post.image} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          )}

          <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {post.faqs?.length > 0 && (
            <section className="mt-14">
              <h2 className="text-2xl text-[#1C1C1A] mb-5" style={{ fontFamily: serif }}>
                Frequently asked questions
              </h2>
              <div className="divide-y divide-[#E8DDD0] border-y border-[#E8DDD0]">
                {post.faqs.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold text-[#1C1C1A]">
                      {f.q}
                      <span className="text-[#C8A97A] text-xl leading-none transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-[#4A4540] leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* CTA */}
        <aside className="mt-16 bg-[#1C1C1A] text-white p-8 sm:p-10 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#C8A97A] mb-3">Handmade in Bihar · Delivered across India</p>
          <h2 className="text-2xl sm:text-3xl mb-4" style={{ fontFamily: serif }}>
            Looking for water hyacinth products in bulk?
          </h2>
          <p className="text-white/70 mb-7 max-w-xl mx-auto">
            Baskets, planters, trays, hotel décor and corporate gifts — with custom designs and live order tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/user/products" className="bg-[#C8A97A] hover:bg-[#d8bb8f] text-[#1C1C1A] px-7 py-3 text-xs font-bold uppercase tracking-widest">
              Browse products
            </Link>
            <Link href="/user/bulk-order" className="border border-white/40 hover:border-white px-7 py-3 text-xs font-bold uppercase tracking-widest">
              Request a quote
            </Link>
          </div>
        </aside>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl text-[#1C1C1A] mb-6" style={{ fontFamily: serif }}>
              Keep reading
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="group block">
                    <p className="text-[#1C1C1A] font-semibold leading-snug group-hover:text-[#C8A97A] transition-colors">{r.title}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-[#9E9088] font-bold">
                      Read <ArrowRight size={12} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
