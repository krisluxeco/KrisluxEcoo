"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import {
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Droplets,
  Sun,
  Users,
  Recycle,
  ArrowRight,
  Award,
  Globe2,
  FileText,
  Clock,
  Sparkles
} from "lucide-react";

const LiveCarbonFootprint = dynamic(() => import("@/components/LiveCarbonFootprint"), {
  ssr: true,
  loading: () => (
    <div className="py-20 bg-[#0D140F] flex items-center justify-center">
      <div className="h-44 w-3/4 max-w-4xl bg-white/5 animate-pulse rounded-[2px]" />
    </div>
  ),
});

// ─── Shared Typography & Palette Tokens (Identical to Home.jsx) ───────────────
const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Counter Helper ───────────────────────────────────────────────────────────
function Counter({ value, suffix = "", duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let raf;
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCount(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── The 4 Circular Pillars Data ──────────────────────────────────────────────
const PILLARS_DATA = [
  {
    num: "01",
    tag: "AQUATIC ECOSYSTEM RESTORATION",
    title: "Invasive Water Hyacinth Eradication",
    desc: "Water hyacinth is known as the 'Terror of Bengal' — an aggressive invasive weed that doubles in volume every 12 days, choking waterways, blocking sunlight, and depleting dissolved oxygen for fish. By manually harvesting mature hyacinth stems, we physically restore sunlight to Bihar's wetlands while preventing thousands of tons of rotting methane from polluting our atmosphere.",
    img: "/raw_materials.png",
    stat: "12.2+ Tons Diverted",
    statLabel: "Invasive Biomass Harvested",
  },
  {
    num: "02",
    tag: "CHEMICAL-FREE SOLAR CURING",
    title: "Bio-Enzyme Fermentation & Sunlight",
    desc: "Conventional straw and commercial wicker often rely on toxic sulfur fumigation or formaldehyde dips to prevent mold during export. KrisluxECO pioneered a 100% organic bio-enzyme bath derived from local botanical extracts, followed by 72 hours of open-air solar curing to maintain moisture below 10% — ensuring complete mold resistance with zero chemical run-off.",
    img: "/images/HeroSection1.png",
    stat: "<10% Moisture",
    statLabel: "ASTM D4236 Certified Non-Toxic",
  },
  {
    num: "03",
    tag: "GENDER-LENS ECONOMIC INCLUSION",
    title: "Empowering Rural Women Artisans",
    desc: "Over 80% of our artisanal workforce consists of rural mothers and daughters across Begusarai, Madhubani, and Gaya. Through Ministry of Textiles partnerships and official Pehchan identification cards, we ensure transparent, bank-disbursed piece-rate earnings that triple traditional household incomes and foster generational financial independence.",
    img: "/artisan_craft.png",
    stat: "3x Higher Incomes",
    statLabel: "Direct Bank Disbursals",
  },
  {
    num: "04",
    tag: "CIRCULAR PACKAGING PHILOSOPHY",
    title: "100% Zero-Single-Use Plastics",
    desc: "Our environmental responsibility doesn't stop at product manufacture. From our artisan cooperative workshops to global freight loading docks, we completely prohibit single-use bubble wraps and petrochemical plastics. Every order is secured using natural unbleached kraft cartons, cornstarch liners, and organic cotton dust bags.",
    img: "/premium_furniture.png",
    stat: "0% Plastic Waste",
    statLabel: "Biodegradable Crating",
  },
];

// ─── UN Sustainable Development Goals (SDGs) ──────────────────────────────────
const SDGS_DATA = [
  {
    num: "SDG 1",
    title: "No Poverty",
    desc: "Tripling artisan household earnings above local agricultural day-labor rates with consistent year-round production orders.",
  },
  {
    num: "SDG 5",
    title: "Gender Equality",
    desc: "80% female artisan guild workforce, providing women with personal bank accounts and leadership within rural co-op clusters.",
  },
  {
    num: "SDG 8",
    title: "Decent Work & Growth",
    desc: "Safe, well-ventilated co-op workshops equipped with ergonomic weaving tables, clean drinking water, and fair wage transparency.",
  },
  {
    num: "SDG 12",
    title: "Responsible Production",
    desc: "Closed-loop, zero-waste manufacturing that consumes zero synthetic petrochemical binders or toxic solvent dyes.",
  },
  {
    num: "SDG 13",
    title: "Climate Action",
    desc: "Mitigating massive decomposing wetland methane emissions by converting decaying aquatic biomass into durable lifestyle objects.",
  },
  {
    num: "SDG 14",
    title: "Life Below Water",
    desc: "Restoring dissolved oxygen levels, native aquatic biodiversity, and freshwater sunlight for indigenous fish in Bihar river basins.",
  },
  {
    num: "SDG 17",
    title: "Global Partnerships",
    desc: "Collaborating with IIT Patna Incubation, Bihar Khadi, UMSAS, and international ethical hospitality brands.",
  },
];

export default function SustainabilityPage() {
  return (
    <main className="bg-[#FAF8F5] text-[#141E17]" style={{ fontFamily: sans }}>
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION — LUXURY DEEP FOREST OBSIDIAN                           */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 bg-[#0D140F] text-[#FAF8F5] overflow-hidden border-b border-[#C29B5D]/20">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#3E634A]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#C29B5D]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            {/* Top Verified Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-[2px] bg-white/5 border border-[#C29B5D]/30 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3E634A] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-medium">
                ESG Impact Assessment · Bihar Wetland Restoration
              </span>
            </div>

            {/* Master Headline */}
            <h1
              className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-light leading-[1.08] tracking-tight max-w-4xl mx-auto"
              style={{ fontFamily: serif }}
            >
              Restoring Rivers,
              <span className="italic font-serif text-[#C29B5D] block sm:inline font-normal">
                {" "}Empowering Artisans
              </span>
            </h1>

            {/* Hairline Divider */}
            <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[#C29B5D] to-transparent mx-auto my-6" />

            {/* Executive Subtitle */}
            <p className="text-sm sm:text-base text-[#FAF8F5]/75 max-w-2xl mx-auto font-light leading-relaxed">
              True Eco-Luxury should regenerate the earth, not deplete it. Discover how KrisluxECO transforms noxious aquatic weeds into certified export-grade homeware through circular bio-design and fair-wage rural employment.
            </p>

            {/* Quick Hero Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
              <Link
                href="/user/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-[2px] transition-all duration-300 shadow-[0_4px_20px_rgba(194,155,93,0.3)] hover:shadow-[0_4px_28px_rgba(194,155,93,0.5)]"
              >
                Explore Sustainable Collection
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/share-catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[#FAF8F5] border border-white/20 hover:border-[#C29B5D]/60 text-xs uppercase font-medium tracking-[0.16em] px-7 py-4 rounded-[2px] transition-all duration-300"
              >
                <FileText size={14} className="text-[#C29B5D]" />
                Download ESG Whitepaper
              </Link>
            </div>
          </FadeUp>
        </div>

        {/* ─── 4-Column Real-Time Metric Ribbon ──────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-10 border-t border-white/10 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <FadeUp delay={0.05}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">
                <Counter value={12} suffix=".2 Tons" />
              </p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Invasive Hyacinth Diverted
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Clearing Begusarai Wetlands</p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">
                <Counter value={42} suffix=".8 Tons" />
              </p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Methane Emissions Avoided
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Calculated CO2e Mitigation</p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">
                <Counter value={200} suffix="+" />
              </p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Fair-Wage Rural Artisans
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">80% Female Leadership</p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">0%</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Synthetic Resins or Plastics
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">100% Biodegradable Lifecycles</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. THE 4 CIRCULAR BIO-PILLARS (Editorial Museum Split)                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-28">
        <FadeUp className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
            The Circular Regeneration Framework
          </span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#141E17]" style={{ fontFamily: serif }}>
            How Every Step Heals
            <span className="italic font-normal text-[#3E634A]"> Local Ecosystems</span>
          </h2>
        </FadeUp>

        {PILLARS_DATA.map((pillar, idx) => (
          <div
            key={pillar.num}
            className={`flex flex-col ${
              idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center gap-12 lg:gap-20`}
          >
            {/* Left: Photographic Proof Card */}
            <div className="w-full lg:w-1/2">
              <FadeUp className="bg-white border border-[#EAE3D6] p-4 sm:p-5 rounded-[2px] shadow-[0_16px_40px_rgba(20,30,23,0.06)]">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#F4EFE6] rounded-[2px]">
                  <Image
                    src={pillar.img}
                    alt={pillar.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#0D140F]/90 backdrop-blur-sm border border-[#C29B5D]/30 px-3 py-1 rounded-[2px]">
                    <span className="text-[10px] font-mono tracking-widest text-[#C29B5D] font-bold">
                      VERIFIED IMPACT // {pillar.num}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F4EFE6] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#141E17] font-mono block">{pillar.stat}</span>
                    <span className="text-[10px] text-[#7A7369] font-mono">{pillar.statLabel}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#3E634A] bg-[#F4EFE6] px-2 py-1 rounded-[2px] font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Verified Data
                  </span>
                </div>
              </FadeUp>
            </div>

            {/* Right: Narrative Description */}
            <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
              <FadeUp delay={0.1}>
                <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-bold block mb-1">
                  {pillar.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-light text-[#141E17]" style={{ fontFamily: serif }}>
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6560] leading-relaxed font-light pt-2">
                  {pillar.desc}
                </p>
                <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs font-mono text-[#141E17]">
                  <span className="flex items-center gap-1.5 text-[#3E634A]">
                    <Leaf size={14} /> Zero Synthetic Additives
                  </span>
                  <span className="text-[#EAE3D6]">|</span>
                  <span className="flex items-center gap-1.5 text-[#7A7369]">
                    <Award size={14} className="text-[#C29B5D]" /> Non-Toxic Bio-Enzyme
                  </span>
                </div>
              </FadeUp>
            </div>
          </div>
        ))}
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. LIVE CARBON FOOTPRINT EMBEDDED DASHBOARD                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="bg-[#0D140F] border-y border-[#C29B5D]/20">
        <LiveCarbonFootprint />
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. THE 7 UN SUSTAINABLE DEVELOPMENT GOALS (SDGS)                       */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FAF8F5] border-b border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-bold block mb-2">
              Global Standards Alignment
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#141E17]" style={{ fontFamily: serif }}>
              Direct Contributions to the
              <span className="italic font-normal text-[#3E634A]"> UN Sustainability Goals</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6560] max-w-xl mx-auto mt-3 font-light">
              Our rural operations are audited to actively satisfy seven United Nations Sustainable Development Goals, providing institutional procurement teams with verified ESG credentials.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SDGS_DATA.map((sdg, i) => (
              <FadeUp key={sdg.num} delay={i * 0.06}>
                <div className="h-full bg-white border border-[#EAE3D6] p-6 rounded-[2px] shadow-sm hover:border-[#C29B5D]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-[#C29B5D] bg-[#0D140F] px-2.5 py-1 rounded-[2px]">
                        {sdg.num}
                      </span>
                      <CheckCircle2 size={14} className="text-[#3E634A]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#141E17] mb-2" style={{ fontFamily: serif }}>
                      {sdg.title}
                    </h3>
                    <p className="text-xs text-[#6B6560] leading-relaxed font-light">{sdg.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 5. CALL TO ACTION                                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0D140F] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <FadeUp>
            <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-bold block mb-2">
              Transform Your Organization's Procurement
            </span>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight text-white" style={{ fontFamily: serif }}>
              Every Object You Source Restores a Wetland.
              <span className="italic font-normal text-[#C29B5D] block"> Join Our Movement for Real Eco-Luxury.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 max-w-xl mx-auto leading-relaxed font-light">
              Explore our full catalogue of handcrafted, zero-waste products or commission bespoke natural decor for your spaces.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/user/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-[2px] transition-all shadow-md"
              >
                Browse Products
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/user/bulk-order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 text-[#FAF8F5] hover:border-[#C29B5D] text-xs uppercase tracking-[0.16em] px-7 py-4 rounded-[2px] transition-all"
              >
                Bulk B2B Procurement
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
