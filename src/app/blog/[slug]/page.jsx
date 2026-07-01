"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function BlogReader() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data.blog);
        } else {
          router.push("/blog");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97A]"></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-[#9E9088] font-bold hover:text-[#C8A97A] transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Back to Journal
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="text-center mb-12 space-y-6">
            <div className="text-xs tracking-widest uppercase text-[#C8A97A] font-bold">
              {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-[#1C1C1A] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {blog.title}
            </h1>
            <div className="text-[#9E9088] italic" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.2rem" }}>
              by {blog.author}
            </div>
          </header>

          {blog.image && (
            <div className="w-full aspect-video md:aspect-[21/9] overflow-hidden bg-white mb-16 border border-[#E8DDD0]">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none text-[#1C1C1A] prose-headings:font-serif prose-headings:text-[#1C1C1A] prose-a:text-[#C8A97A] prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.article>
      </div>
    </div>
  );
}
