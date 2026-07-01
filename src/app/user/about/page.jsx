"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";

// ─── Shared Typography Helpers ──────────────────────────────────────────────
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

function Eyebrow({ children, dark = false }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <span className={`h-px w-8 ${dark ? "bg-[#C8A97A]/40" : "bg-[#C8A97A]/60"}`} />
      <p
        className="text-xs tracking-[0.25em] uppercase text-[#C8A97A]"
        style={{ fontFamily: sans }}
      >
        {children}
      </p>
      <span className={`h-px w-8 ${dark ? "bg-[#C8A97A]/40" : "bg-[#C8A97A]/60"}`} />
    </div>
  );
}

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

// ─── Hero Slideshow ────────────────────────────────────────────────────────────
const aboutSlides = [
  { url: "/images/artisan_crafting.png", caption: "Preserving Heritage" },
  { url: "/images/home_storage.png", caption: "Natural Materials" },
  { url: "/images/luxury_amenities.png", caption: "Elevated Living" },
];

function AboutSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % aboutSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => setCurrent(i);

  return (
    <>
      <div className="absolute inset-0 z-0">
        {aboutSlides.map((slide, i) => (
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
        {aboutSlides.map((_, i) => (
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
          {aboutSlides[current].caption}
        </motion.p>
      </AnimatePresence>
    </>
  );
}

// ─── Ticker items ────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "Water Hyacinth",
  "Natural Clay",
  "Reclaimed Timber",
  "Plant Fibre",
  "Zero Synthetics",
  "100% Biodegradable",
  "Bihar's Wetlands",
];

// ─── Product data ────────────────────────────────────────────────────────────
const products = [
  {
    img: "/images/home_storage.png",
    name: "Home & Storage",
    desc: "Everyday objects made to last a decade — baskets, trays, organisers, and lampshades from water hyacinth and natural fibre.",
    tags: ["Baskets", "Trays", "Organisers", "Lampshades"],
    margin: "68% gross margin",
    price: "₹350–₹2,800",
    buyer: "Eco home décor · NRI gifting",
  },
  {
    img: "/images/fashion_bags.png",
    name: "Fashion & Bags",
    desc: "Wearable craft — handbags, clutches, wallets, and totes designed for sustainable fashion buyers and boutique retail.",
    tags: ["Handbags", "Clutches", "Wallets", "Totes"],
    margin: "72% gross margin",
    price: "₹800–₹5,500",
    buyer: "Sustainable fashion buyers",
  },
  {
    img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
    name: "Furniture & Décor",
    desc: "Statement pieces — stools, mirror frames, and wall art that serve luxury interior and hospitality buyers at scale.",
    tags: ["Stools", "Mirror Frames", "Wall Art"],
    margin: "65% gross margin",
    price: "₹1,200–₹18,000",
    buyer: "Luxury interiors · hotel chains",
  },
  {
    img: "/images/corporate_gifting.png",
    name: "Corporate Gifting",
    desc: "Branded hampers, coasters, and stationery — our fastest-growing B2B revenue stream, tailored for bulk ESG-aligned gifting.",
    tags: ["Hampers", "Coasters", "Stationery"],
    margin: "70% gross margin",
    price: "₹500–₹3,000/unit",
    buyer: "B2B bulk · fastest revenue",
  },
];

// ─── SDG impact data ─────────────────────────────────────────────────────────
const sdgs = [
  {
    num: "SDG 1",
    code: "No Poverty",
    title: "Artisan income",
    impact: "3× the standard middleman rate, paid directly to craft families",
  },
  {
    num: "SDG 5",
    code: "Gender Equality",
    title: "Women-led workforce",
    impact: "80% of partner artisans are women, formally employed",
  },
  {
    num: "SDG 8",
    code: "Decent Work",
    title: "Formal employment",
    impact: "Pehchan IDs and fair-wage contracts for every artisan partner",
  },
  {
    num: "SDG 12",
    code: "Responsible Production",
    title: "Zero waste",
    impact: "100% biodegradable materials, zero plastic in any shipment",
  },
  {
    num: "SDG 13",
    code: "Climate Action",
    title: "Methane removal",
    impact: "Harvesting water hyacinth removes a major wetland methane source",
  },
  {
    num: "SDG 14",
    code: "Life Below Water",
    title: "Wetland health",
    impact: "Restores Bihar's wetland biodiversity through hyacinth clearance",
  },
  {
    num: "SDG 17",
    code: "Partnerships",
    title: "Institutional backing",
    impact: "Bihar Govt · UMSAS · Khadi Mall — formal public-sector partners",
  },
];

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AboutWhatWeDoPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main
      className="bg-[#FAF7F2] text-[#1C1C1A] overflow-x-hidden"
      style={{ fontFamily: sans }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 24s linear infinite; }
      `}</style>

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[110vh] flex flex-col justify-end overflow-hidden pb-32 border-b border-[#1C1C1A]/5">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <AboutSlideshow />
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
              What We Do
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-[clamp(3.5rem,8vw,7.5rem)] font-[300] leading-[0.9] mb-8 text-white"
              style={{ fontFamily: serif }}
            >
              Handcrafted goods <br/> <span className="italic text-white/80">that pay it forward.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <p className="text-white/80 text-sm md:text-base max-w-lg font-light leading-loose">
                KrisluxECO makes eco-friendly handcrafted products from Bihar's
                natural materials — built through traditional craft, sold directly
                to businesses, and designed so every link in the chain benefits.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM / SOLUTION ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-12">
            <Eyebrow>The Problem We Solve</Eyebrow>
            <h2
              className="text-[clamp(2rem,4vw,2.8rem)] font-light leading-tight text-[#1C1C1A]"
              style={{ fontFamily: serif }}
            >
              A broken trade,{" "}
              <span className="italic text-[#4A6741]">rebuilt by hand</span>
            </h2>
            <div className="h-[2px] w-14 bg-[#C8A97A] mt-4 mx-auto" />
            <p className="text-[#5C5650] mt-5 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
              India's craft sector produces extraordinary goods — and pays
              extraordinary artisans almost nothing for them. Middlemen extract
              the margin; the maker absorbs the cost. We built a direct path out.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Problem card */}
            <FadeUp delay={0.08}>
              <div className="h-full rounded-[22px] bg-white border border-[#E7E1DA] p-8">
                <p
                  className="text-[10px] tracking-[0.22em] uppercase text-[#9E9088] mb-4"
                  style={{ fontFamily: sans }}
                >
                  The Problem
                </p>
                <h3
                  className="text-xl font-medium text-[#1C1C1A] mb-3 leading-snug"
                  style={{ fontFamily: serif }}
                >
                  What the industry looks like today
                </h3>
                <p className="text-sm text-[#6B6560] leading-relaxed mb-5">
                  Skilled artisans — many women, most informal — make goods that
                  travel through 3–5 middlemen before reaching a buyer. Each layer
                  clips the price. The maker earns a fraction.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Artisans earn 8–15% of final sale price",
                    "No formal contracts, wages, or identity",
                    "Synthetic materials displace local, natural ones",
                    "Methane-emitting water hyacinth left unprocessed in Bihar's wetlands",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 items-start text-sm text-[#6B6560] leading-relaxed"
                    >
                      <span className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#C8A97A]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* Solution card */}
            <FadeUp delay={0.14}>
              <div className="h-full rounded-[22px] bg-[#4A6741] relative overflow-hidden p-8">
                <div className="absolute inset-0 opacity-[0.06] bg-gradient-to-br from-white to-transparent" />
                <div className="relative">
                  <p
                    className="text-[10px] tracking-[0.22em] uppercase text-white/55 mb-4"
                    style={{ fontFamily: sans }}
                  >
                    Our Answer
                  </p>
                  <h3
                    className="text-xl font-medium text-[#E9D9B8] italic mb-3 leading-snug"
                    style={{ fontFamily: serif }}
                  >
                    Direct, formal, and traceable
                  </h3>
                  <p className="text-sm text-white/72 leading-relaxed mb-5">
                    We contract artisans directly with formal wages and Pehchan
                    IDs. We source from Bihar's wetlands — turning invasive water
                    hyacinth into export-quality craft. No middlemen. No plastic.
                  </p>
                  <ul className="flex flex-col gap-3">
                    {[
                      "3× the standard middleman rate, direct to artisan",
                      "Formal employment — 80% women-led households",
                      "100% natural, biodegradable, traceable materials",
                      "Removes methane-emitting hyacinth from wetlands",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 items-start text-sm text-white/82 leading-relaxed"
                      >
                        <span className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#8FBD84]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#F6F2EC]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <Eyebrow>What We Make</Eyebrow>
            <h2
              className="text-[clamp(2rem,4vw,2.8rem)] font-light leading-tight text-[#1C1C1A]"
              style={{ fontFamily: serif }}
            >
              Four categories,{" "}
              <span className="italic text-[#4A6741]">one supply chain</span>
            </h2>
            <div className="h-[2px] w-14 bg-[#C8A97A] mt-4 mx-auto" />
            <p className="text-[#6B6560] mt-4 text-sm max-w-lg mx-auto leading-relaxed">
              All B2B — corporate gifting, retail buyers, hotel chains, and export
              customers. Every SKU 100% biodegradable, zero synthetic materials.
            </p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-5">
            {products.map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.08}>
                <div className="h-full bg-white border border-[#E7E1DA] rounded-[22px] overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-500 group">
                  <div className="relative w-full h-48 overflow-hidden bg-[#FAF7F2]">
                    <img 
                      src={p.img} 
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-7 flex flex-col gap-3 flex-grow">
                    <h3
                      className="text-xl font-medium text-[#1C1C1A]"
                      style={{ fontFamily: serif }}
                    >
                      {p.name}
                    </h3>
                    <p className="text-sm text-[#6B6560] leading-relaxed">{p.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] bg-[#F0EBE3] text-[#6B6560] rounded-full px-3 py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 border-t border-[#ECE6DF] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#4A6741] tracking-wide">
                        {p.margin} · {p.price}
                      </span>
                    </div>
                    <p
                      className="text-[11px] text-[#9E9088] uppercase tracking-widest mt-1"
                      style={{ fontFamily: sans }}
                    >
                      {p.buyer}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MISSION QUOTE ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-y border-[#E7E1DA]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <Eyebrow>Our Mission</Eyebrow>
            <div className="relative px-8 mt-2">
              <span
                className="absolute -top-4 left-0 text-[5rem] leading-none text-[#4A6741]/08 pointer-events-none select-none"
                style={{ fontFamily: serif }}
              >
                "
              </span>
              <p
                className="text-[clamp(1.2rem,2.8vw,1.75rem)] font-light italic text-[#1C1C1A] leading-relaxed"
                style={{ fontFamily: serif }}
              >
                We promote sustainable living by supporting skilled artisans and
                preserving traditional craft — creating products that make a
                positive impact on people and planet, one handmade piece at a time.
              </p>
              <span
                className="absolute -bottom-6 right-0 text-[5rem] leading-none text-[#4A6741]/08 pointer-events-none select-none"
                style={{ fontFamily: serif }}
              >
                "
              </span>
            </div>
            <p
              className="mt-8 text-xs text-[#9E9088] tracking-[0.14em] uppercase"
              style={{ fontFamily: sans }}
            >
              KrisluxECO — Jaipur &amp; Bihar, India
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── MATERIALS TICKER ──────────────────────────────────────────────── */}
      <div className="bg-[#4A6741] py-4 overflow-hidden">
        <div className="ticker-track flex gap-8 whitespace-nowrap w-max">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="text-white/70 text-xs tracking-[0.2em] uppercase flex-shrink-0 flex items-center gap-2"
              style={{ fontFamily: sans }}
            >
              <span className="text-[#C8A97A]">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── SDG IMPACT ────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 bg-[#1C1C1A] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative max-w-6xl mx-auto z-10">
          <FadeUp className="text-center mb-12">
            <Eyebrow dark>Impact</Eyebrow>
            <h2
              className="text-[clamp(2rem,4vw,3rem)] font-light leading-tight text-white"
              style={{ fontFamily: serif }}
            >
              7 UN Goals,{" "}
              <span className="italic text-[#8FBD84]">one supply chain</span>
            </h2>
            <div className="h-[2px] w-14 bg-[#C8A97A] mt-4 mx-auto" />
            <p className="text-white/55 mt-4 text-sm max-w-lg mx-auto leading-relaxed">
              Every B2B order creates measurable, trackable social and
              environmental impact across seven Sustainable Development Goals.
            </p>
          </FadeUp>

          {/* Top 4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {sdgs.slice(0, 4).map((s, i) => (
              <FadeUp key={s.num} delay={i * 0.07}>
                <div className="h-full border border-white/10 bg-white/[0.03] rounded-[18px] p-5 text-center">
                  <div
                    className="text-[2rem] font-light text-[#8FBD84] leading-none mb-1"
                    style={{ fontFamily: serif }}
                  >
                    {s.num}
                  </div>
                  <div
                    className="text-[10px] tracking-[0.18em] text-white/35 uppercase mb-3"
                    style={{ fontFamily: sans }}
                  >
                    {s.code}
                  </div>
                  <div className="text-sm font-medium text-white/80 mb-2">
                    {s.title}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    {s.impact}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Bottom 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sdgs.slice(4).map((s, i) => (
              <FadeUp key={s.num} delay={i * 0.07 + 0.28}>
                <div className="h-full border border-white/10 bg-white/[0.03] rounded-[18px] p-5 text-center">
                  <div
                    className="text-[2rem] font-light text-[#8FBD84] leading-none mb-1"
                    style={{ fontFamily: serif }}
                  >
                    {s.num}
                  </div>
                  <div
                    className="text-[10px] tracking-[0.18em] text-white/35 uppercase mb-3"
                    style={{ fontFamily: sans }}
                  >
                    {s.code}
                  </div>
                  <div className="text-sm font-medium text-white/80 mb-2">
                    {s.title}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    {s.impact}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 bg-[#4A6741] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <FadeUp className="relative max-w-3xl mx-auto text-center">
          <h2
            className="text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight text-white font-light mb-4"
            style={{ fontFamily: serif }}
          >
            Ready to source{" "}
            <span className="italic text-[#E9D9B8]">differently?</span>
          </h2>
          <p className="text-white/75 mb-9 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            Explore our B2B catalogue or talk to us about a corporate gifting or
            bulk order that creates real, traceable impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/user/products"
              className="inline-flex items-center gap-2 bg-white text-[#4A6741] px-8 py-3.5 rounded-full text-sm tracking-wide font-medium hover:bg-[#FAF7F2] transition-colors"
            >
              View Product Catalogue
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/user/bulk-order"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-3.5 rounded-full text-sm tracking-wide hover:border-white hover:bg-white/10 transition-all"
            >
              Discuss a B2B Order
            </Link>
          </div>
        </FadeUp>
      </section>
    </main>
  );
}