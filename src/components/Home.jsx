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
import CategoryCard from "./CategoryCard";
import Link from "next/link";
import Image from "next/image";

// ─── Shared Typography Helpers ─────────────────────────────────────────────────
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

// Eyebrow: small gold label above every section heading
function Eyebrow({ children }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <span className="h-px w-8 bg-[#C8A97A]/60" />
      <p
        className="text-xs tracking-[0.25em] uppercase text-[#C8A97A]"
        style={{ fontFamily: sans }}
      >
        {children}
      </p>
      <span className="h-px w-8 bg-[#C8A97A]/60" />
    </div>
  );
}

// Section heading: large serif, two-tone optional
function SectionHeading({ light, accent, dark = false }) {
  return (
    <>
      <h2
        className="text-[clamp(2.2rem,5vw,3.4rem)] leading-tight font-light"
        style={{ fontFamily: serif }}
      >
        <span className={dark ? "text-white" : "text-[#1C1C1A]"}>{light} </span>
        {accent && (
          <span className={`italic ${dark ? "text-[#8FBD84]" : "text-[#4A6741]"}`}>
            {accent}
          </span>
        )}
      </h2>
      <div className="h-[2px] w-14 bg-[#C8A97A] mx-auto mt-4" />
    </>
  );
}

// ─── Floating Leaf Particle ────────────────────────────────────────────────────
function Leaf({ style }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none text-[#4A6741]"
      style={style}
      animate={{
        y: ["0%", "-120vh"],
        rotate: [0, 360],
        x: [0, style.drift ?? 30, 0],
        opacity: [0, 0.18, 0.1, 0],
      }}
      transition={{
        duration: style.dur ?? 12,
        repeat: Infinity,
        delay: style.delay ?? 0,
        ease: "linear",
      }}
    >
      <svg
        width={style.size ?? 18}
        height={style.size ?? 18}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4 .83-.83 3-2.67 4-5-2.5 1-5.33 2.5-7 4.5C9 8 8.5 11 9 14c-1-1.5-1.5-4-1-6-2 2-3 6-3 8a8 8 0 0 0 8 8c4-2 5-9 4-16z" />
      </svg>
    </motion.div>
  );
}

const leaves = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  style: {
    left: `${(i * 7.3 + 5) % 100}%`,
    bottom: "-5%",
    size: 12 + (i % 5) * 4,
    dur: 10 + (i % 6) * 2,
    delay: i * 0.9,
    drift: -20 + (i % 4) * 18,
  },
}));

// ─── Stats Counter ─────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
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

// ─── Section Fade In ───────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Marquee Strip ─────────────────────────────────────────────────────────────
const marqueeItems = [
  "Handcrafted Excellence",
  "·",
  "Eco-Friendly Materials",
  "·",
  "Zero Plastic",
  "·",
  "Artisan Made",
  "·",
  "B2B Bulk Orders",
  "·",
  "Sustainably Sourced",
  "·",
  "Traditional Craft",
  "·",
];

function MarqueeStrip() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div className="overflow-hidden border-y border-[#E8DDD0] bg-[#FAF7F2] py-3.5">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-xs tracking-[0.22em] uppercase text-[#4A6741] font-medium flex-shrink-0"
            style={{ fontFamily: sans }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Categories ────────────────────────────────────────────────────────────────
const categories = [
  {
    slug: "home-living",
    name: "Home & Living",
    tag: "Hand-thrown ceramics",
    icon: "🏺",
    description: "Tableware and decor made for everyday rituals.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1400",
  },
  {
    slug: "kitchen-dining",
    name: "Kitchen & Dining",
    tag: "Small-batch woodware",
    icon: "🍽️",
    description: "Boards, bowls and tools shaped from reclaimed timber.",
    image:
      "https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=1200",
  },
  {
    slug: "eco-living",
    name: "Eco & Sustainable",
    tag: "Zero-waste essentials",
    icon: "🌿",
    description: "Plastic-free swaps for a lighter footprint.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200",
  },
  {
    slug: "business-wholesale",
    name: "Business & Wholesale",
    tag: "Bulk & B2B",
    icon: "📦",
    description: "Branded packaging and supply for growing businesses.",
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200",
  },
  {
    slug: "garden-outdoor",
    name: "Garden & Outdoor",
    tag: "Terracotta & linen",
    icon: "🪴",
    description: "Pots, planters and outdoor textiles built to weather well.",
    image:
      "https://images.unsplash.com/photo-1466692476655-ce517a4d8a6a?q=80&w=1200",
  },
  {
    slug: "gifting",
    name: "Gifting",
    tag: "Wrapped by hand",
    icon: "🎁",
    description: "Considered gift sets, wrapped in recycled kraft.",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1200",
  },
];

// ─── Impact Numbers ────────────────────────────────────────────────────────────
const impacts = [
  { icon: "🌱", label: "Trees Saved", target: 12000, suffix: "+" },
  { icon: "♻️", label: "Plastic Replaced", target: 50000, suffix: "+" },
  { icon: "💧", label: "Litres Water Saved", target: 800000, suffix: "+" },
  { icon: "🌍", label: "Tonnes CO₂ Reduced", target: 2400, suffix: "+" },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "The quality of KrisluxECO products exceeded our expectations. Our clients loved the eco-friendly packaging.",
    name: "Priya Sharma",
    role: "Procurement Head, GreenSpace Corp",
  },
  {
    quote:
      "Partnering with KrisluxECO transformed our corporate gifting. Each piece felt personal and sustainable.",
    name: "Arjun Mehta",
    role: "CEO, EcoVentures India",
  },
  {
    quote:
      "The craftsmanship is extraordinary. You can feel the care put into every product.",
    name: "Sunita Rao",
    role: "Interior Designer, Studio Verde",
  },
];

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % testimonials.length),
      4500
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto px-4"
        >
          <p
            className="text-2xl md:text-3xl text-[#1C1C1A] mb-6 font-light leading-snug italic"
            style={{ fontFamily: serif }}
          >
            "{testimonials[current].quote}"
          </p>
          <p
            className="text-sm font-semibold text-[#4A6741] tracking-wide"
            style={{ fontFamily: sans }}
          >
            {testimonials[current].name}
          </p>
          <p className="text-xs text-[#9E9088] mt-1" style={{ fontFamily: sans }}>
            {testimonials[current].role}
          </p>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-[#4A6741]" : "w-2 h-2 bg-[#E8DDD0]"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Hero Slideshow ────────────────────────────────────────────────────────────
const heroSlides = [
  {
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1800",
    caption: "Zero-waste living",
  },
  {
    url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1800",
    caption: "Handcrafted ceramics",
  },
  {
    url: "https://images.unsplash.com/photo-1466692476655-ce517a4d8a6a?q=80&w=1800",
    caption: "Garden & outdoor",
  },
  {
    url: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?q=80&w=1800",
    caption: "Kitchen & dining",
  },
  {
    url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=1800",
    caption: "Artisan gifting",
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
      {/* Slide images with crossfade + Ken Burns */}
      <div className="absolute inset-0">
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
      </div>

      {/* Dot indicators — bottom centre, above scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${i === current
              ? "w-6 h-2 bg-[#4A6741]"
              : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>

      {/* Slide caption — bottom right */}
      <AnimatePresence mode="wait">
        <motion.p
          key={current}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-[3.8rem] right-8 z-20 text-[10px] tracking-[0.22em] uppercase text-white/45"
          style={{ fontFamily: sans }}
        >
          {heroSlides[current].caption}
        </motion.p>
      </AnimatePresence>
    </>
  );
}

// ─── Main Home Page ────────────────────────────────────────────────────────────
export default function Home({ featuredProducts = [], savedProductIds = [] }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main
      className="bg-[#FAF7F2] text-[#1C1C1A] overflow-x-hidden"
      style={{ fontFamily: sans }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
        {/* Slideshow background */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <HeroSlideshow />

          {/* Gradient overlays for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1A]/82 via-[#1C1C1A]/46 to-[#1C1C1A]/10 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/72 via-transparent to-transparent z-10 pointer-events-none" />
        </motion.div>

        {/* Floating leaves */}
        <div className="absolute inset-0 z-[1]">
          {leaves.map((l) => (
            <Leaf key={l.id} style={{ ...l.style, opacity: 0.12 }} />
          ))}
        </div>

        {/* Hero text content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 pb-24">
          <div className="max-w-xl">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FBD84] animate-pulse" />
              Sustainable · Handcrafted · Purposeful
            </motion.div>

            {/* Hero heading — matches section heading scale, lighter weight on dark */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.22,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="leading-[1.05] text-white mb-6"
              style={{
                fontFamily: serif,
                fontSize: "clamp(2.8rem, 6.5vw, 5rem)",
              }}
            >
              <span className="block font-light">
                for a{" "}
                <span className="italic font-normal text-[#C8A97A]">
                  Greener
                </span>
              </span>
              <span className="block font-semibold">Tomorrow</span>
            </motion.h1>

            {/* Gold rule — mirrors the section heading underline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="h-[2px] w-14 bg-[#C8A97A] mb-8 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-white/75 text-base leading-relaxed mb-10"
            >
              KrisluxECO creates sustainable, artisan-crafted products that
              honour traditional craft while protecting the planet. Premium
              quality for conscious businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="/products"
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 8px 30px rgba(74,103,65,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-[#4A6741] text-white px-8 py-3.5 rounded-full text-sm tracking-wide transition-all"
              >
                Explore Products
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-full text-sm tracking-wide hover:border-white hover:bg-white/10 transition-all"
              >
                Request B2B Quote
              </motion.a>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint — left-aligned */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-6 md:left-[calc((100%-72rem)/2+1.5rem)] z-10 flex items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.25em] text-white/70 uppercase">
            Scroll to explore
          </span>
          <motion.div
            className="w-10 h-px bg-gradient-to-r from-white/70 to-transparent"
            animate={{ scaleX: [0, 1, 0], originX: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ─── MARQUEE ──────────────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ─── STATS ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 100, suffix: "+", label: "Happy Clients" },
            { value: 500, suffix: "+", label: "Unique Products" },
            { value: 20, suffix: "+", label: "Cities Served" },
            { value: 100, suffix: "%", label: "Eco Certified" },
          ].map((stat, i) => (
            <FadeUp key={i} delay={i * 0.1} className="text-center">
              <div
                className="text-4xl md:text-5xl font-light text-[#4A6741] mb-2"
                style={{ fontFamily: serif }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p
                className="text-[#9E9088] tracking-widest uppercase"
                style={{ fontSize: "0.72rem", letterSpacing: "0.12em" }}
              >
                {stat.label}
              </p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F6F2EC]">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-14">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="h-px w-6 bg-[#C8A97A]/50" />
              <span
                className="text-xs tracking-[0.2em] uppercase text-[#C8A97A]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                What We Make
              </span>
              <span className="h-px w-6 bg-[#C8A97A]/50" />
            </div>

            {/* Heading */}
            <h2
              className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#1C1C1A]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              <span className="inline-block font-bold">
                Crafted{" "}
              </span>

              <span className="relative inline-block font-bold text-[#4A6741]">
                Living

                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#C8A97A]" />
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm text-[#6B6560] mt-4 max-w-xl mx-auto leading-relaxed">
              Discover thoughtfully crafted products designed for homes,
              businesses and sustainable living.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[230px]">
            {categories.map((cat, index) => (
              <div
                key={cat.slug}
                className={index % 3 === 0 ? "md:col-span-2" : ""}
              >
                <CategoryCard cat={cat} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts products={featuredProducts} savedProductIds={savedProductIds} />

      {/* ─── WHY KRISLUXECO ───────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-[#FAF8F5] overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#4A6741]/5 rounded-full blur-[160px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center mb-14">

            <span className="text-xs uppercase tracking-[0.35em] text-[#C8A97A]">
              OUR PROMISE
            </span>

            <h2
              className="mt-3 text-[clamp(2.2rem,4vw,3.8rem)] font-bold leading-[0.95] text-[#1C1C1A]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Crafted For
              <br />
              Sustainable Luxury
            </h2>

            <p className="mt-5 text-[#6B6560] max-w-xl mx-auto text-sm md:text-base">
              Combining traditional craftsmanship with modern
              manufacturing excellence.
            </p>

          </div>

          {/* Premium Bento Grid */}
          <div className="grid lg:grid-cols-12 gap-4">

            {/* Video */}
            <div
              className="
          lg:col-span-8
          row-span-2
          overflow-hidden
          rounded-[24px]
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          group
          bg-white
        "
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="
            w-full
            h-full
            min-h-[420px]
            object-cover
            transition-all
            duration-700
            group-hover:scale-105
          "
              >
                <source
                  src="/about-artisan.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            {/* Card 1 */}
            <div
              className="
          lg:col-span-4
          bg-white/80
          backdrop-blur-xl
          border border-[#ECE6DF]
          rounded-[22px]
          p-6
          shadow-sm
          hover:-translate-y-1
          hover:shadow-lg
          transition-all
          duration-500
        "
            >
              <div
                className="text-3xl font-bold text-[#4A6741]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                100%
              </div>

              <p className="mt-2 text-[#1C1C1A] font-medium">
                Natural Materials
              </p>

              <p className="mt-2 text-[13px] text-[#6B6560] leading-relaxed">
                Responsibly sourced eco-friendly resources with
                minimal environmental impact.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="
          lg:col-span-4
          bg-white/80
          backdrop-blur-xl
          border border-[#ECE6DF]
          rounded-[22px]
          p-6
          shadow-sm
          hover:-translate-y-1
          hover:shadow-lg
          transition-all
          duration-500
        "
            >
              <div
                className="text-3xl font-bold text-[#4A6741]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                ISO
              </div>

              <p className="mt-2 text-[#1C1C1A] font-medium">
                Quality Assured
              </p>

              <p className="mt-2 text-[13px] text-[#6B6560] leading-relaxed">
                Consistent manufacturing standards and premium
                quality control processes.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="
          lg:col-span-8
          bg-white/80
          backdrop-blur-xl
          border border-[#ECE6DF]
          rounded-[22px]
          p-6
          shadow-sm
          hover:-translate-y-1
          hover:shadow-lg
          transition-all
          duration-500
        "
            >
              <div className="flex items-center justify-between">

                <div>
                  <div
                    className="text-4xl font-bold text-[#4A6741]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    200+
                  </div>

                  <p className="mt-1 text-[#1C1C1A] font-medium">
                    Artisan Partners
                  </p>

                  <p className="mt-2 text-[13px] text-[#6B6560]">
                    Supporting skilled craftspeople across India.
                  </p>
                </div>

                <div
                  className="
              w-12 h-12
              rounded-full
              bg-[#4A6741]/10
              flex
              items-center
              justify-center
              text-[#4A6741]
              text-lg
            "
                >
                  ✦
                </div>

              </div>
            </div>

            {/* Card 4 */}
            <div
              className="
          lg:col-span-4
          bg-[#4A6741]
          text-white
          rounded-[22px]
          p-6
          shadow-sm
          hover:-translate-y-1
          hover:shadow-lg
          transition-all
          duration-500
        "
            >
              <div
                className="text-3xl font-bold"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                B2B
              </div>

              <p className="mt-2 font-medium">
                Bulk Ready
              </p>

              <p className="mt-2 text-[13px] text-white/70 leading-relaxed">
                Flexible MOQ, private labeling and custom
                manufacturing solutions.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ─── IMPACT ───────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-[#1C1C1A] relative overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#8FBD84]"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.15,
            }}
            animate={{
              y: [-20, 20, -20],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated Background Blobs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, #4A6741 0%, transparent 70%)",
          }}
        />

        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, #C8A97A 0%, transparent 70%)",
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">

          <FadeUp className="text-center mb-16">

            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-6 bg-[#C8A97A]/50" />
              <span className="text-xs tracking-[0.2em] uppercase text-[#C8A97A]">
                Our Impact
              </span>
              <span className="h-px w-6 bg-[#C8A97A]/50" />
            </div>

            <h2
              className="text-[clamp(2.3rem,4vw,3.8rem)] leading-tight"
              style={{ fontFamily: serif }}
            >
              <span className="font-bold text-white">
                Numbers that matter
              </span>
              <br />
              <span className="relative inline-block font-bold text-[#8FBD84]">
                to the planet

                <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-[#C8A97A]" />
              </span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            {impacts.map((impact, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                  }}
                  transition={{ duration: 0.25 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 text-center"
                >

                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4A6741]/20 via-transparent to-[#C8A97A]/20" />
                  </div>

                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-5xl mb-5"
                  >
                    {impact.icon}
                  </motion.div>

                  <div
                    className="text-4xl md:text-5xl font-light text-white mb-3"
                    style={{ fontFamily: serif }}
                  >
                    <CountUp
                      target={impact.target}
                      suffix={impact.suffix}
                    />
                  </div>

                  <p className="text-xs uppercase tracking-[0.18em] text-[#B7B0A9]">
                    {impact.label}
                  </p>

                  <div className="mt-5 h-px w-12 mx-auto bg-gradient-to-r from-transparent via-[#C8A97A] to-transparent" />

                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>



      {/* ─── TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-[#F8F5F0] via-[#F6F2EC] to-[#F8F5F0]">

        {/* Background Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 w-72 h-72 rounded-full blur-[120px]"
            style={{
              background: "#4A6741",
              opacity: 0.08,
            }}
          />

          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 right-20 w-72 h-72 rounded-full blur-[120px]"
            style={{
              background: "#C8A97A",
              opacity: 0.08,
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          <FadeUp className="text-center mb-16">

            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-6 bg-[#C8A97A]/50" />
              <span
                className="text-xs tracking-[0.22em] uppercase text-[#C8A97A]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Testimonials
              </span>
              <span className="h-px w-6 bg-[#C8A97A]/50" />
            </div>

            <h2
              className="text-[clamp(2.5rem,4vw,4rem)] leading-tight"
              style={{ fontFamily: serif }}
            >
              <span className="font-bold text-[#1C1C1A]">
                What our
              </span>{" "}
              <span className="relative inline-block font-bold text-[#4A6741]">
                partners say
                <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-[#C8A97A]" />
              </span>
            </h2>

            <p className="max-w-xl mx-auto mt-5 text-[#6B6560] leading-relaxed">
              Trusted by retailers, exporters and sustainable brands across
              India and international markets.
            </p>
          </FadeUp>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 mb-14">
            {[
              "200+ Artisan Partners",
              "ISO Certified",
              "B2B Bulk Ready",
              "Eco-Friendly Materials",
            ].map((item) => (
              <div
                key={item}
                className="text-xs uppercase tracking-[0.2em] text-[#8F8880]"
              >
                {item}
              </div>
            ))}
          </div>

          {/* Testimonial Card */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden rounded-[36px] bg-white border border-[#E7E1DA] p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
            >

              {/* Huge Quote */}
              <div
                className="absolute top-6 right-8 text-[150px] leading-none text-[#4A6741]/5 pointer-events-none"
                style={{ fontFamily: serif }}
              >
                "
              </div>

              {/* Your Carousel */}
              <TestimonialCarousel />

            </motion.div>
          </div>
        </div>
      </section>




    </main >
  );
}