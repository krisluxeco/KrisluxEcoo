"use client";
import Image from "next/image";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

// ─── Hero Slideshow ────────────────────────────────────────────────────────────
const blogSlides = [
  { url: "/images/HeroSection3.png", caption: "Sustaining The Earth" },
  { url: "/images/HeroSection2.png", caption: "Handcrafted Luxury" },
  { url: "/images/brand_Story_hero.png", caption: "Natural Spaces" },
];

function BlogSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % blogSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => setCurrent(i);

  return (
    <>
      <div className="absolute inset-0 z-0">
        {blogSlides.map((slide, i) => (
          <motion.div
            key={slide.url}
            className="absolute inset-0 bg-cover bg-center mix-blend-multiply"
            style={{ backgroundImage: `url(${slide.url})` }}
            initial={false}
            animate={{
              opacity: i === current ? 0.8 : 0,
              scale: i === current ? 1.0 : 1.07,
            }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: 7, ease: "easeOut" },
            }}
          />
        ))}
        {/* Dark gradient overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1A]/80 via-[#1C1C1A]/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/80 via-transparent to-transparent z-10 pointer-events-none" />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {blogSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${i === current
                ? "w-6 h-2 bg-[#C8A97A]"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={current}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-10 right-8 z-20 text-[10px] tracking-[0.22em] uppercase text-white/70 hidden md:block"
          style={{ fontFamily: sans }}
        >
          {blogSlides[current].caption}
        </motion.p>
      </AnimatePresence>
    </>
  );
}

export default function BlogListing() {
  const containerRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.blogs);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAF7F2] overflow-x-hidden">
      
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[110vh] flex flex-col justify-end overflow-hidden pb-32 border-b border-[#1C1C1A]/5">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <BlogSlideshow />
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full md:flex md:items-end justify-between">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FBD84] animate-pulse" />
              Journal
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-[clamp(3.5rem,8vw,7.5rem)] font-[300] leading-[0.9] mb-8 text-white"
              style={{ fontFamily: serif }}
            >
              The KrisluxECO <br/> <span className="italic text-white/80">Journal</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <p className="text-white/80 text-sm md:text-base max-w-lg font-light leading-loose">
                Insights on sustainable luxury, craftsmanship, and living an eco-conscious lifestyle.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24">

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A97A]"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No journal entries found. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden mb-6 bg-white border border-[#E8DDD0]">
                    {blog.image && (blog.image.startsWith('/') || blog.image.startsWith('http')) ? (
                      <Image width={800} height={800}
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E8DDD0]/30 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#9E9088] font-bold">
                      <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <h2
                      className="text-2xl text-[#1C1C1A] leading-snug group-hover:text-[#C8A97A] transition-colors"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">
                      {blog.content.replace(/<[^>]+>/g, '')}
                    </p>
                    <div className="pt-2 text-sm font-bold tracking-wider uppercase text-[#1C1C1A] flex items-center gap-2 group-hover:text-[#C8A97A] transition-colors">
                      Read Article
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
