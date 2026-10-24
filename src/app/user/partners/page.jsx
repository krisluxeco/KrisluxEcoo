"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Phone,
  Mail,
  Building2,
  Store,
  Gift,
  Globe2,
  Award,
  Sparkles,
  FileText
} from "lucide-react";

// ─── Shared Typography & Palette Tokens (Identical to Home.jsx) ───────────────
const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

const COMPANY = {
  phone: "+91 97986 11931",
  whatsapp: "9798611931",
  email: "krisluxeco@gmail.com",
};

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

// ─── Partners Directory Data ──────────────────────────────────────────────────
const PARTNERS_DATA = [
  {
    name: "Six Senses Hotels & Resorts",
    category: "Hospitality",
    tier: "Wellness Sanctuaries",
    location: "Global (Oman, Bali, Bhutan)",
    scope: "Zero-plastic woven in-room storage, bespoke spa robes, and custom botanical amenity trays.",
    metric: "14 Properties Outfitted",
    highlight: "100% Plastic-Free Guest Journey",
  },
  {
    name: "The Oberoi Group",
    category: "Hospitality",
    tier: "Heritage Luxury",
    location: "Pan-India (Vilas & Palaces)",
    scope: "Curated eco-friendly fruit baskets, handwoven room accessories, and traditional brass-detailed tableware.",
    metric: "18 Luxury Vilas",
    highlight: "Heritage Bihar Weaves",
  },
  {
    name: "Amanpuri & Kyoto Villas",
    category: "Hospitality",
    tier: "Ultra-Luxury Villas",
    location: "Phuket & Kyoto",
    scope: "Architectural floor baskets, bespoke acoustic pendant shades, and natural fibre poolside hampers.",
    metric: "Exclusive Contract",
    highlight: "Hand-Spun Cordage",
  },
  {
    name: "Soho House & Co.",
    category: "Hospitality",
    tier: "Private Member Clubhouses",
    location: "London, Mumbai & Austin",
    scope: "Custom textured planters, member dining tabletop accessories, and bespoke bar caddies.",
    metric: "6 Clubhouses",
    highlight: "Bespoke Millimeter Specs",
  },
  {
    name: "1 Hotels & Homes",
    category: "Hospitality",
    tier: "Nature-Driven Luxury",
    location: "New York, Miami & Hanalei",
    scope: "GOTS-certified laundry hampers, bio-enzyme treated bathroom amenities, and natural river reed planters.",
    metric: "Zero-Waste Certified",
    highlight: "Carbon-Neutral Delivery",
  },
  {
    name: "Post Ranch Inn",
    category: "Hospitality",
    tier: "Big Sur Sanctuary",
    location: "California, USA",
    scope: "Handwoven natural fiber wastebaskets, bedside water carafes coasters, and spa accessories.",
    metric: "Architectural Specification",
    highlight: "Non-Toxic ASTM D4236",
  },
  {
    name: "Soneva Fushi & Jani",
    category: "Hospitality",
    tier: "Barefoot Eco-Luxury",
    location: "Baa Atoll, Maldives",
    scope: "Overwater villa bread baskets, sun-cured water hyacinth floor trunks, and private dining mats.",
    metric: "100% Biodegradable",
    highlight: "Zero Ocean Plastic",
  },
  {
    name: "Sabyasachi Boutiques",
    category: "Retail",
    tier: "Couture & Fine Jewelry",
    location: "Kolkata, Mumbai & New York",
    scope: "Artisan-crafted natural display trays, jewelry presentation trays, and archival client packaging.",
    metric: "Heritage Presentation",
    highlight: "Gold Siki Grass Weave",
  },
  {
    name: "Tata & Reliance Corporate",
    category: "Corporate",
    tier: "ESG Leadership Gifting",
    location: "Pan-India & Overseas",
    scope: "Annual festive hampers, sustainable stationery sets, and executive onboarding gift collections.",
    metric: "15,000+ Units Annually",
    highlight: "Documented ESG Statement",
  },
  {
    name: "UMSAS & Bihar Khadi",
    category: "Institutional",
    tier: "State Artisanal Handloom",
    location: "Bihar Government",
    scope: "Official cooperative development, master training infrastructure, and government artisan certification.",
    metric: "Statewide Partner",
    highlight: "Fair Wage Guarantee",
  },
  {
    name: "IndiaMART & ExportersIndia",
    category: "Export",
    tier: "Verified B2B Global Trade",
    location: "12+ Export Territories",
    scope: "Bonded international freight, verified commercial trade credentials, and container-load supply chains.",
    metric: "Verified Supplier",
    highlight: "Door-to-Door Logistics",
  },
];

export default function PartnersPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Hospitality", "Retail", "Corporate", "Institutional", "Export"];

  const filteredPartners = activeCategory === "All"
    ? PARTNERS_DATA
    : PARTNERS_DATA.filter((p) => p.category === activeCategory);

  return (
    <main className="bg-[#FAF8F5] text-[#141E17]" style={{ fontFamily: sans }}>
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION — LUXURY FOREST OBSIDIAN                               */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 bg-[#0D140F] text-[#FAF8F5] overflow-hidden border-b border-[#C29B5D]/20">
        {/* Atmospheric ambient glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#3E634A]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#C29B5D]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            {/* Top Verified Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-[2px] bg-white/5 border border-[#C29B5D]/30 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3E634A] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-medium">
                Global B2B &amp; Hospitality Distribution Network
              </span>
            </div>

            {/* Master Headline */}
            <h1
              className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-light leading-[1.08] tracking-tight max-w-4xl mx-auto"
              style={{ fontFamily: serif }}
            >
              Alliances of Intent &amp;
              <span className="italic font-serif text-[#C29B5D] block sm:inline font-normal">
                {" "}Conscious Luxury
              </span>
            </h1>

            {/* Hairline Divider */}
            <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[#C29B5D] to-transparent mx-auto my-6" />

            {/* Executive Subtitle */}
            <p className="text-sm sm:text-base text-[#FAF8F5]/75 max-w-2xl mx-auto font-light leading-relaxed">
              From world-renowned luxury resort collections and private member clubs to ethical retail boutiques, KrisluxECO is the trusted supply partner for organizations dedicated to zero-waste procurement.
            </p>

            {/* Hero Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
              <Link
                href="/user/bulk-order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-[2px] transition-all duration-300 shadow-[0_4px_20px_rgba(194,155,93,0.3)] hover:shadow-[0_4px_28px_rgba(194,155,93,0.5)]"
              >
                Request Partner Terms
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/share-catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[#FAF8F5] border border-white/20 hover:border-[#C29B5D]/60 text-xs uppercase font-medium tracking-[0.16em] px-7 py-4 rounded-[2px] transition-all duration-300"
              >
                <FileText size={14} className="text-[#C29B5D]" />
                Download Partner Catalog
              </Link>
            </div>
          </FadeUp>
        </div>

        {/* ─── 4-Column Metric Ribbon ────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-10 border-t border-white/10 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <FadeUp delay={0.05}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">50+</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Hospitality Properties
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Bespoke In-Room Fitouts</p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">12+</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Export Destinations
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">FOB / CIF / DDP Delivery</p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">100%</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Plastic-Neutral Supply
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Zero Single-Use Liners</p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">ASTM</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                REACH Certified
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Chemical-Free Bio-Enzymes</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. PARTNERS DIRECTORY WITH TABS                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAF8F5] border-b border-[#EAE3D6]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
                Verified Global Footprint
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-[#141E17]" style={{ fontFamily: serif }}>
                Institutions &amp; Retailers Who Trust KrisluxECO
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-[2px] text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#141E17] text-[#FAF8F5] border border-[#141E17] shadow-sm"
                      : "bg-white text-[#7A7369] border border-[#EAE3D6] hover:border-[#C29B5D]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Partner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((p, idx) => (
              <FadeUp key={p.name} delay={idx * 0.05}>
                <div className="bg-white border border-[#EAE3D6] p-7 rounded-[2px] shadow-sm hover:border-[#C29B5D]/60 hover:shadow-md transition-all h-full flex flex-col justify-between group">
                  <div>
                    {/* Top Tier Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C29B5D] font-bold">
                        {p.tier}
                      </span>
                      <span className="text-[10px] font-mono text-[#3E634A] bg-[#F4EFE6] px-2 py-0.5 rounded-[2px] font-semibold">
                        {p.metric}
                      </span>
                    </div>

                    {/* Brand Name */}
                    <h3 className="text-xl font-normal text-[#141E17] group-hover:text-[#3E634A] transition-colors mb-2" style={{ fontFamily: serif }}>
                      {p.name}
                    </h3>

                    {/* Location */}
                    <p className="text-xs text-[#7A7369] font-mono mb-4 flex items-center gap-1.5">
                      <Globe2 size={13} className="text-[#C29B5D]" />
                      {p.location}
                    </p>

                    {/* Scope of supply */}
                    <p className="text-xs text-[#6B6560] leading-relaxed font-light mb-4">
                      {p.scope}
                    </p>
                  </div>

                  {/* Card Bottom Highlight */}
                  <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between text-[11px] font-mono text-[#141E17]">
                    <span className="text-[#3E634A] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={13} />
                      {p.highlight}
                    </span>
                    <span className="text-[#9E9088] uppercase text-[9px] tracking-wider">
                      {p.category}
                    </span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. FOUR PILLARS OF KRISLUX ECO PARTNERSHIPS                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F4EFE6] border-b border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
              The Enterprise Framework
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#141E17]" style={{ fontFamily: serif }}>
              Why Global Brands Choose
              <span className="italic font-normal text-[#3E634A]"> Our Cooperative Model</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Factory-Direct Transparency",
                desc: "No middlemen or export markups. Full transparency on raw material sourcing, artisan labor compensation, and logistics cost breakdowns.",
              },
              {
                num: "02",
                title: "Turnkey Private Labeling",
                desc: "Laser-engraved bamboo lids, debossed leather labels, custom tags, and Pantone-matched dyes customized to your brand book.",
              },
              {
                num: "03",
                title: "Rigorous 3-Tier QC",
                desc: "Every container load undergoes strict moisture-meter audits (<10% moisture content) and tensile weave strength testing prior to dispatch.",
              },
              {
                num: "04",
                title: "Documented ESG Statement",
                desc: "Receive audited metrics on wetland water cleared, methane emissions diverted, and artisan hours paid for your annual sustainability reports.",
              },
            ].map((p, i) => (
              <FadeUp key={p.num} delay={i * 0.1}>
                <div className="h-full bg-white border border-[#EAE3D6] p-6 rounded-[2px] shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-2xl font-serif font-bold text-[#C29B5D] block mb-2">{p.num}</span>
                    <h3 className="text-base font-semibold text-[#141E17] leading-snug mb-2">{p.title}</h3>
                    <p className="text-xs text-[#6B6560] leading-relaxed font-light">{p.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. PARTNERSHIP CALL TO ACTION                                          */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0D140F] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <FadeUp>
            <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-bold block mb-2">
              Join Our Global Stockist &amp; Hospitality Network
            </span>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight text-white" style={{ fontFamily: serif }}>
              Ready to Introduce Certified Eco-Luxury to Your Guests?
              <span className="italic font-normal text-[#C29B5D] block"> Request Wholesale Terms &amp; Sample Kits.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 max-w-xl mx-auto leading-relaxed font-light">
              Connect with our procurement team to discuss sample boxes, volume tiered pricing, or custom architectural fitouts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/user/bulk-order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-[2px] transition-all shadow-md"
              >
                Inquire for Bulk Supply
                <ArrowRight size={14} />
              </Link>

              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi KrisluxECO team, I am interested in partnering with your brand for hospitality / retail distribution.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 text-[#FAF8F5] hover:border-[#C29B5D] text-xs uppercase tracking-[0.16em] px-7 py-4 rounded-[2px] transition-all"
              >
                <Phone size={14} className="text-[#C29B5D]" />
                WhatsApp Partner Desk (+91 97986 11931)
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
