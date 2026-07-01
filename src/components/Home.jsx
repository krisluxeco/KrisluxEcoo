"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import FeaturedProducts from "./Featuredproducts";
import Link from "next/link";

// ─── Shared Typography ────────────────────────────────────────────────────────
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Number Counter ────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Marquee ───────────────────────────────────────────────────────────────────
const marqueeItems = [
  "Sustainable Luxury",
  "·",
  "Zero Waste",
  "·",
  "Artisan Crafted",
  "·",
  "B2B Bulk Orders",
  "·",
  "Eco-Friendly Materials",
  "·",
  "Corporate Gifting",
  "·",
];

function MarqueeStrip() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div className="overflow-hidden border-y border-[#E8DDD0] bg-[#FAF7F2] py-5">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-xs tracking-[0.3em] uppercase text-[#1C1C1A] font-medium flex-shrink-0"
            style={{ fontFamily: sans }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Hero Slideshow ────────────────────────────────────────────────────────────
const heroSlides = [
  {
    url: "/images/hero_baskets.png",
    caption: "Handcrafted ceramics & baskets",
  },
  {
    url: "/images/hero_hotel.png",
    caption: "Luxury eco-friendly amenities",
  },
  {
    url: "/images/artisan_crafting.png",
    caption: "Sustainably Sourced Craft",
  },
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => setCurrent(i);

  return (
    <>
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, i) => (
          <motion.div
            key={slide.url}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.url})` }}
            initial={false}
            animate={{
              opacity: i === current ? 1 : 0,
              scale: i === current ? 1.0 : 1.07,
            }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: 7, ease: "easeOut" },
            }}
          />
        ))}
        {/* Gradient overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1A]/80 via-[#1C1C1A]/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/80 via-transparent to-transparent z-10 pointer-events-none" />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
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
          {heroSlides[current].caption}
        </motion.p>
      </AnimatePresence>
    </>
  );
}

// ─── Categories Data ──────────────────────────────────────────────────────────
const categories = [
  {
    slug: "home-living",
    name: "Home & Living",
    tag: "Everyday Rituals",
    image: "/images/home_storage.png",
    aspect: "aspect-[3/4]",
  },
  {
    slug: "kitchen-dining",
    name: "Kitchen & Dining",
    tag: "Reclaimed Woodware",
    image: "/images/kitchen_dining.png",
    aspect: "aspect-[4/3]",
  },
  {
    slug: "eco-living",
    name: "Eco Amenities",
    tag: "Zero-Waste Luxury",
    image: "/images/hero_hotel.png",
    aspect: "aspect-square",
  },
  {
    slug: "business-wholesale",
    name: "Wholesale",
    tag: "Corporate Supply",
    image: "/images/corporate_gifting.png",
    aspect: "aspect-[3/4]",
  },
];

// ─── Video Reels Data ────────────────────────────────────────────────────────
const reels = [
  {
    id: 1,
    url: "https://cdn.coverr.co/videos/coverr-weaving-a-basket-5254/1080p.mp4",
    title: "Hand Woven Baskets"
  },
  {
    id: 2,
    url: "https://cdn.coverr.co/videos/coverr-a-woman-making-a-clay-pot-5246/1080p.mp4",
    title: "Artisan Pottery"
  },
  {
    id: 3,
    url: "https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4",
    title: "Nature & Origins"
  }
];

// ─── Main Home Page Component ──────────────────────────────────────────────────
export default function Home({ featuredProducts = [], savedProductIds = [] }) {
  const containerRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);

  return (
    <main
      ref={containerRef}
      className="bg-[#FAF7F2] text-[#1C1C1A] overflow-x-hidden"
      style={{ fontFamily: sans }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* ─── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[110vh] flex flex-col justify-end overflow-hidden pb-32">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <HeroSlideshow />
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
              Sustainable · Handcrafted
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-[clamp(3.5rem,8vw,7rem)] font-light leading-[0.9] mb-8 text-white"
              style={{ fontFamily: serif }}
            >
              Nature, <br />
              <span className="italic text-white/80">Crafted</span> By Hand.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link
                href="/user/products"
                className="group flex items-center justify-center gap-3 bg-[#C8A97A] text-[#1C1C1A] px-8 py-4 rounded-full text-xs tracking-[0.2em] uppercase font-bold hover:bg-white transition-all shadow-lg"
              >
                Explore Collection
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/user/bulk-order"
                className="group flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-4 rounded-full text-xs tracking-[0.2em] uppercase hover:border-white transition-all backdrop-blur-sm bg-white/5"
              >
                Request B2B Quote
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ────────────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ─── EDITORIAL CATEGORIES (Asymmetric Grid) ─────────────────────────── */}
      <section className="py-32 px-6 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-28 flex flex-col md:flex-row justify-between items-end gap-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-[1px] bg-[#C8A97A]" />
                <p className="text-[#C8A97A] text-[9px] tracking-[0.4em] uppercase">The Collection</p>
              </div>
              <h2 className="text-[clamp(3rem,5vw,5.5rem)] font-[300] leading-[1.05] tracking-tight text-[#1C1C1A]" style={{ fontFamily: serif }}>
                A curation of <br />
                <span className="italic text-[#1C1C1A]/70">sustainable</span> elegance.
              </h2>
            </div>
            <p className="text-[#6B6560] text-xs md:text-sm max-w-sm leading-loose font-light">
              Every piece in our collection is born from highly renewable materials,
              designed to elevate spaces while respecting the earth. Beauty without compromise.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-32 md:gap-y-0">
            {categories.map((cat, i) => (
              <FadeUp
                key={cat.slug}
                delay={i * 0.15}
                className={`group cursor-pointer ${
                  i === 0 ? "md:col-span-6 md:pr-12 md:mt-0" :
                  i === 1 ? "md:col-span-5 md:col-start-8 md:mt-64" :
                  i === 2 ? "md:col-span-5 md:pl-12 md:-mt-32" :
                  "md:col-span-6 md:col-start-7 md:mt-32"
                }`}
              >
                <Link href={`/user/products?category=${cat.slug}`}>
                  <div className="w-full bg-white p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-transform duration-1000 group-hover:-translate-y-2">
                    <div className={`relative w-full overflow-hidden ${cat.aspect}`}>
                      <div className="absolute inset-0 bg-[#C8A97A]/0 group-hover:bg-[#C8A97A]/10 transition-colors duration-1000 z-10 mix-blend-overlay" />
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between items-start px-2">
                    <div>
                      <h3 className="text-3xl font-[300] text-[#1C1C1A] mb-3" style={{ fontFamily: serif }}>
                        {cat.name}
                      </h3>
                      <p className="text-[#1C1C1A]/40 text-[9px] tracking-[0.3em] uppercase">
                        {cat.tag}
                      </p>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center text-[#1C1C1A]/30 group-hover:text-[#C8A97A] transition-colors duration-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM / VIDEO REELS ────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-y border-[#E8DDD0]">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-[#1C1C1A] mb-4" style={{ fontFamily: serif }}>
              Behind the <span className="italic text-[#C8A97A]">Craft</span>
            </h2>
            <p className="text-[#6B6560] text-sm">Follow our journey and see how each piece is made.</p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reels.map((reel, i) => (
              <FadeUp key={reel.id} delay={i * 0.1} className="group relative aspect-[9/16] rounded-[24px] overflow-hidden bg-black/5">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                >
                  <source src={reel.url} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-medium text-lg" style={{ fontFamily: serif }}>{reel.title}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (Prop Passed) ────────────────────────────────── */}
      <div className="bg-[#FAF7F2]">
        <FeaturedProducts products={featuredProducts} savedProductIds={savedProductIds} />
      </div>

      {/* ─── STATS / PROMISE ────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-[#1C1C1A] overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px"
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">

            <FadeUp>
              <h2 className="text-[clamp(2.5rem,4vw,4.5rem)] font-light leading-[1.1] mb-8 text-white" style={{ fontFamily: serif }}>
                Impact <br />
                <span className="italic text-[#8FBD84]">Measured.</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-md mb-12">
                We measure our success not just in sales, but in the acreage of wetlands restored,
                the carbon diverted, and the communities uplifted.
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                <div>
                  <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: serif }}>
                    <CountUp target={120} suffix="+" />
                  </div>
                  <p className="text-[#C8A97A] text-[10px] tracking-[0.2em] uppercase">B2B Partners</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: serif }}>
                    <CountUp target={100} suffix="%" />
                  </div>
                  <p className="text-[#C8A97A] text-[10px] tracking-[0.2em] uppercase">Biodegradable</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: serif }}>
                    <CountUp target={350} suffix="+" />
                  </div>
                  <p className="text-[#C8A97A] text-[10px] tracking-[0.2em] uppercase">Artisans Employed</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: serif }}>
                    <CountUp target={50} suffix="K+" />
                  </div>
                  <p className="text-[#C8A97A] text-[10px] tracking-[0.2em] uppercase">Plastics Replaced</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2} className="relative aspect-[4/5] rounded-[24px] overflow-hidden border border-white/10">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7]"
              >
                <source src="https://cdn.coverr.co/videos/coverr-a-woman-making-a-clay-pot-5246/1080p.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white/90 font-light text-xl italic" style={{ fontFamily: serif }}>
                  "True luxury is knowing exactly where your products come from, and the hands that shaped them."
                </p>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

    </main>
  );
}