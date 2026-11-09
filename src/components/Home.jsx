"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Layers,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  SlidersHorizontal,
  Sparkles,
  Award,
  Clock,
  MapPin,
  ExternalLink
} from "lucide-react";
import dynamic from "next/dynamic";
import FeaturedProducts from "./Featuredproducts";
import ThreeImageEditorialHero from "./ThreeImageEditorialHero";
import ArtisanReelCard from "./ArtisanReelCard";
import TrustedMarketplaces from "./TrustedMarketplaces";
import AsFeaturedIn from "./AsFeaturedIn";
import AchievementsGallery from "./AchievementsGallery";

const LiveCarbonFootprint = dynamic(() => import("./LiveCarbonFootprint"), {
  ssr: true,
  loading: () => (
    <div className="py-20 bg-[#0D140F] flex items-center justify-center">
      <div className="h-44 w-3/4 max-w-4xl bg-white/5 animate-pulse" />
    </div>
  ),
});

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

const impactMetrics = [
  {
    value: "120+",
    unit: "Tons",
    title: "Invasive Hyacinth Cleared",
    desc: "Restoring biodiversity across Bihar wetlands",
  },
  {
    value: "200+",
    unit: "Artisans",
    title: "Rural Women Employed",
    desc: "Onboarded with official Pehchan artisan IDs",
  },
  {
    value: "3.2x",
    unit: "Multiplier",
    title: "Household Income",
    desc: "Above regional agricultural wage baselines",
  },
  {
    value: "40+",
    unit: "Partners",
    title: "Hotel & Corporate Supply",
    desc: "Bespoke hospitality suites & ESG gifting",
  },
  {
    value: "0%",
    unit: "Synthetics",
    title: "Single-Use Plastic",
    desc: "100% biodegradable zero-waste packaging",
  },
  {
    value: "100%",
    unit: "Circular",
    title: "Renewable Biomass",
    desc: "Sun-cured natural botanical stalks",
  },
];

// ─── 4-Sector B2B Procurement Archetypes ────────────────────────────────────
const sectorArchetypes = [
  {
    sectorNum: "01",
    title: "Hotels & Wellness Spas",
    subtitle: "Turn-down trays, acoustic water hyacinth wall panels, bespoke spa hampers, and sanitizable tissue vessels.",
    image: "/images/hero_hotel.png",
    moq: "50 units",
    leadTime: "3–4 wks",
    specName: "Hospitality Spec Sheet",
    href: "/user/bulk-order?sector=Hotels%20%26%20Spas",
  },
  {
    sectorNum: "02",
    title: "Artisanal Living & Retail",
    subtitle: "Sculptural floor baskets, bell pendant luminaires, twill woven dining placemats, and modular storage vessels.",
    image: "/images/HomeCategory1.png",
    moq: "30 units",
    leadTime: "4–5 wks",
    specName: "Retail Catalog Spec",
    href: "/user/bulk-order?sector=Retail%20Collections",
  },
  {
    sectorNum: "03",
    title: "Corporate Gifting & ESG",
    subtitle: "Executive botanical keepsakes, custom laser-etched brass plaques, desk caddies, and verifiable impact tokens.",
    image: "/images/corporate_gifting.png",
    moq: "100 units",
    leadTime: "3 wks",
    specName: "ESG Executive Deck",
    href: "/user/bulk-order?sector=Corporate%20Gifting",
  },
  {
    sectorNum: "04",
    title: "Millwork & Acoustic Panels",
    subtitle: "Custom woven spatial dividers, NRC 0.65 acoustic wall inserts, and integrated architectural millwork panels.",
    image: "/images/BrandStory4.png",
    moq: "Custom Sqm",
    leadTime: "5–6 wks",
    specName: "Architectural CAD / BIM",
    href: "/user/bulk-order?sector=Architectural%20Millwork",
  },
];

// ─── 4-Stage "River-to-Resort" Provenance Protocol ──────────────────────────
const provenanceStages = [
  {
    stage: "STAGE 01 • REGENERATION",
    title: "Ecological River Harvesting",
    location: "Kamala-Balan Basin, Bihar",
    desc: "Manual extraction of overgrown water hyacinth choking freshwater wetlands. Clearing restores oxygen levels for aquatic life, unblocks navigation channels, and captures biomass before anaerobic decay.",
    metrics: ["Grade-A Stems: 75–110cm", "Harvest: 100% Zero Machinery", "Methane Prevented: 1.2kg/kg"],
  },
  {
    stage: "STAGE 02 • DEHYDRATION & TONE",
    title: "Solar Curing & Botanical Pigments",
    location: "Darbhanga Solar Kilns",
    desc: "Zero-fossil-fuel natural drying under the sub-tropical sun brings fiber equilibrium moisture to <9%. Subtle earth tones are rendered using madder root, pomegranate rind, and natural indigo baths without toxic mordants.",
    metrics: ["Moisture Balance: <9%", "Dyes: 100% Food-Safe Botanicals", "Zero Chemical Bleach"],
  },
  {
    stage: "STAGE 03 • HERITAGE GUILD",
    title: "Generational Master Weaving",
    location: "Mithila Artisan Collective",
    desc: "Intertwined over bespoke wooden jigs by 1,420+ accredited women artisans receiving direct living wages. Ancient Mithila wicker and herringbone patterns create high tensile-strength commercial structures.",
    metrics: ["Fair Living Wage: 2.3x Local Min", "Banking: Direct Digital Transfers", "1,420+ Women Artisans"],
  },
  {
    stage: "STAGE 04 • RESORT READINESS",
    title: "Sanitary Botanical Sealants & QC",
    location: "Export QA Facility, Patna",
    desc: "Every completed piece is treated with proprietary non-toxic botanical anti-fungal barrier compounds. Complies with international luxury hotel sanitation protocols, humidity cycles up to 90% RH, and ASTM fire standards.",
    metrics: ["Anti-Mold: 12-Mo Guarantee", "Hardware: Solid Brushed Brass", "Tested to 90% Rel Humidity"],
  },
];

// ─── Artisan Behind-the-Weave Native Video Reels ──────────────────────────────
const artisanReels = [
  {
    id: 1,
    videoSrc: "/videos/reels/reel1.mp4",
    category: "01 / WETLAND HARVEST",
    location: "Koshi Riverbeds, Bihar",
    title: "Handcrafted Storage & Planter Baskets",
    description: "Direct documentation of dense wild hyacinth clusters harvested to restore river flow and oxygenation.",
    instagramUrl: "https://www.instagram.com/reel/DaxAEiUJuEn/",
  },
  {
    id: 2,
    videoSrc: "/videos/reels/reel2.mp4",
    category: "02 / RIVER REVIVAL",
    location: "Darbhanga Wetland Basin",
    title: "Restoring River Flow & Wetland Health",
    description: "Village elder shares how clearing botanical overgrowth revitalizes clean community water supplies.",
    instagramUrl: "https://www.instagram.com/reel/DbMkSPLoP80/",
  },
  {
    id: 3,
    videoSrc: "/videos/reels/reel3.mp4",
    category: "03 / MASTER BRAIDING",
    location: "Madhubani Artisan Guild",
    title: "Traditional Hand-Braiding on Wooden Looms",
    description: "Master women artisans transforming harvested stalks into high-tensile structural braids.",
    instagramUrl: "https://www.instagram.com/reel/Da8PEBqJjfW/",
  },
  {
    id: 4,
    videoSrc: "/videos/reels/reel4.mp4",
    category: "04 / WEAVING EMPOWERMENT",
    location: "Patna Craft Collective",
    title: "Weaving Weeds into Worth, Women into Power",
    description: "Precision circular weaving creating heirloom architectural home accents with dignified rural livelihoods.",
    instagramUrl: "https://www.instagram.com/reel/Da-nAIKJOlk/",
  },
];


export default function Home({
  featuredProducts = [],
  savedProductIds = [],
  impactStats = {},
  detailedStats = {},
  recentItems = [],
}) {
  const [activeStage, setActiveStage] = useState(0);

  // Calculated ESG figures with resilient fallback
  const biomassTons = detailedStats?.hyacinthRemovedTons ? Number(detailedStats.hyacinthRemovedTons).toFixed(1) : "18.4";
  const artisanCount = detailedStats?.ruralWomenEmployed || "1,420+";
  const wetlandsCleaned = detailedStats?.waterBodiesCleaned || "38";

  return (
    <div className="bg-[#FAF8F5] text-[#141E17] selection:bg-[#EAE3D6] selection:text-[#141E17] antialiased" style={{ fontFamily: sans }}>
      {/* ─── 1. FULL-SCREEN EDITORIAL THREE-IMAGE HERO SECTION (No Gap, Single Hairline Divider, Zero Border Radius) ─── */}
      <ThreeImageEditorialHero />

      {/* Clean Provenance & Contract Procurement Strip below Hero */}
      <section className="bg-white py-3.5 border-b border-[#EAE3D6] shadow-xs">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#3E634A] animate-pulse" />
              <span className="font-semibold text-[#141E17] tracking-tight">
                Bihar Wetland Restoration
              </span>
              <span className="text-[#C29B5D] font-mono font-bold">•</span>
              <span className="text-[#5C665F]">
                Over <strong className="text-[#141E17] font-semibold">{biomassTons} Tons</strong> Invasive Hyacinth Diverted
              </span>
            </div>
            <div className="flex items-center gap-5 sm:gap-6 font-mono text-[10px] sm:text-[11px] text-[#68736B] tracking-wider uppercase">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C29B5D]" />
                <strong className="text-[#141E17] font-semibold">{artisanCount}</strong> Master Artisans
              </span>
              <span className="hidden md:inline text-[#D8CFBF]">•</span>
              <span className="hidden md:inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E634A]" />
                Net-Negative Carbon
              </span>
              <span className="text-[#D8CFBF]">•</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1D4E89]" />
                21-Day Global Contract Dispatch
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. MEASURABLE ECOLOGICAL & SOCIAL FOOTPRINT RIBBON ─────────────────── */}
      <section className="border-b border-[#EAE3D6] bg-[#FAF8F5] py-12 lg:py-14">
        <div className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Header with Luxury Accent */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 text-[10px] uppercase font-bold tracking-[0.25em] text-[#C29B5D] mb-2 font-mono">
              <span className="w-6 h-[1.5px] bg-[#C29B5D]" />
              <span>MEASURABLE ECOLOGICAL &amp; SOCIAL FOOTPRINT</span>
              <span className="w-6 h-[1.5px] bg-[#C29B5D]" />
            </div>
            <h3 className="text-xl sm:text-2xl text-[#141E17] font-normal tracking-tight" style={{ fontFamily: serif }}>
              Every product directly revives wetlands and empowers rural families
            </h3>
          </div>

          {/* 6 Impact Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-stretch">
            {impactMetrics.map((metric, i) => (
              <div
                key={i}
                className="group relative bg-white border border-[#EAE3D6] hover:border-[#C29B5D] rounded-[2px] p-4 sm:p-5 flex flex-col justify-between items-center text-center shadow-[0_2px_12px_rgba(20,30,23,0.02)] hover:shadow-[0_8px_24px_rgba(20,30,23,0.06)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="my-auto py-2">
                  <div
                    className="text-3xl sm:text-4xl text-[#C29B5D] font-light leading-none mb-2"
                    style={{ fontFamily: serif }}
                  >
                    {metric.value}
                  </div>
                  <span className="block text-[11px] sm:text-xs font-semibold text-[#141E17] uppercase tracking-wider">
                    {metric.title}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-[#F0ECE3] w-full mt-2">
                  <span className="block text-[10px] text-[#7C8780] font-light leading-snug">
                    {metric.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Reassurance Footer Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#68736B]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3E634A]" />
              High-Humidity ASTM Tested (Up to 90% RH)
            </span>
            <span className="text-[#D8CFBF] hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3E634A]" />
              12-Month Anti-Microbial Guarantee
            </span>
            <span className="text-[#D8CFBF] hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3E634A]" />
              Bespoke Dimensions &amp; CAD Support
            </span>
          </div>

        </div>
      </section>

      {/* ─── 4. 4-SECTOR B2B PROCUREMENT FRAMEWORKS ───────────────────────── */}
      <section className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28 border-b spec-hairline" id="sectors">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="brass-badge px-2.5 py-1 text-[#C29B5D] text-[10px] uppercase font-bold tracking-[0.2em] inline-block mb-3 bg-[#FAF8F5]">
              Commercial Archetypes
            </span>
            <h2 className="text-3xl sm:text-4xl text-[#141E17] font-normal tracking-tight" style={{ fontFamily: serif }}>
              Tailored procurement frameworks engineered for high-turnover luxury environments.
            </h2>
          </div>
          <p className="text-sm text-[#424843] max-w-sm font-normal leading-relaxed">
            Every classification is engineered for high-humidity resilience, hospitality sanitization cycles, and zero plastic packaging.
          </p>
        </div>

        {/* 4-Sector Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border spec-hairline divide-y md:divide-y-0 md:divide-x spec-hairline bg-white">
          {sectorArchetypes.map((sector, idx) => (
            <article key={idx} className="p-6 sm:p-8 flex flex-col justify-between group hover:bg-[#F5F3EE] transition-colors duration-300">
              <div>
                <div className="aspect-square bg-[#EAE8E3] mb-5 overflow-hidden relative border spec-hairline">
                  <Image
                    src={sector.image}
                    alt={sector.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#141E17] text-[#FAF8F5] text-[10px] px-2.5 py-0.5 uppercase tracking-widest font-bold">
                    SECTOR {sector.sectorNum}
                  </span>
                </div>

                <h3 className="text-lg text-[#141E17] font-medium mb-2" style={{ fontFamily: serif }}>
                  {sector.title}
                </h3>
                <p className="text-xs text-[#525E55] leading-relaxed mb-6">
                  {sector.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t spec-hairline">
                <div className="flex justify-between items-center text-[#68736B] text-[11px] mb-3">
                  <span>Standard MOQ: {sector.moq}</span>
                  <span>Lead: {sector.leadTime}</span>
                </div>

                <Link
                  href={sector.href}
                  className="text-[#141E17] text-[11px] uppercase tracking-widest font-bold inline-flex items-center gap-1.5 hover:text-[#C29B5D] group-hover:underline underline-offset-4 transition-colors"
                >
                  <span>{sector.specName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── 5. "RIVER-TO-RESORT" PROVENANCE & TECHNICAL PROTOCOL ─────────── */}
      <section className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28 border-b spec-hairline" id="provenance">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Sticky Narrative & Guarantee (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <span className="brass-badge px-2.5 py-1 text-[#C29B5D] text-[10px] uppercase font-bold tracking-[0.2em] inline-block mb-3 bg-[#FAF8F5]">
                Lifecycle Traceability
              </span>
              <h2 className="text-3xl sm:text-4xl text-[#141E17] font-normal tracking-tight mb-4" style={{ fontFamily: serif }}>
                The River-to-Resort Protocol
              </h2>
              <p className="text-sm text-[#424843] leading-relaxed mb-8">
                A four-tier closed-loop audit. Every KrisluxECO consignment is documented with its extraction wetland cluster, solar curing batch index, and artisan guild signature.
              </p>

              <div className="p-5 bg-[#F5F3EE] border spec-hairline">
                <div className="flex items-center gap-2 text-[#141E17] font-medium text-sm mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C29B5D]" />
                  <span>Institutional Provenance Guarantee</span>
                </div>
                <p className="text-xs text-[#68736B] leading-relaxed mb-3">
                  Audited annually across Darbhanga and Madhubani clusters according to WFTO ethical craft standards and ISO 14021 recycled biomass declarations.
                </p>
                <div className="text-[10px] text-[#C29B5D] uppercase tracking-widest font-bold">
                  CERTIFICATE ID: IN-BHR-2026-884
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Stages Accordion & Stepper (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {provenanceStages.map((stageItem, index) => {
              const isSelected = activeStage === index;
              return (
                <div
                  key={index}
                  onClick={() => setActiveStage(index)}
                  className={`border spec-hairline p-6 sm:p-8 cursor-pointer transition-all duration-300 ${
                    isSelected ? "bg-white shadow-sm border-[#C29B5D]" : "bg-[#FAF8F5] hover:bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#C29B5D]">
                      {stageItem.stage}
                    </span>
                    <span className="text-[11px] text-[#68736B] font-mono mt-0.5 sm:mt-0">
                      {stageItem.location}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl text-[#141E17] font-medium mb-3" style={{ fontFamily: serif }}>
                    {stageItem.title}
                  </h3>

                  <p className="text-sm text-[#424843] leading-relaxed mb-4">
                    {stageItem.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-3 border-t spec-hairline">
                    {stageItem.metrics.map((metric, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-2.5 py-1 bg-[#F5F3EE] text-[#141E17] text-[11px] font-medium tracking-wide"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 6. WHOLESALE FEATURED ARCHITECTURAL COLLECTION ──────────────── */}
      <div className="border-b spec-hairline" id="collections">
        <FeaturedProducts
          products={featuredProducts}
          savedProductIds={savedProductIds}
          pretitle="Contract Procurement"
          title="Wholesale Architectural"
          subtitle="Collection"
        />
      </div>

      {/* ─── 7. ACHIEVEMENTS & MILESTONES GALLERY ───────────────────────── */}
      <AchievementsGallery />

      {/* ─── 7. TRUSTED MARKETPLACES (AVAILABLE ACROSS INDIA) ──────────────── */}
      <TrustedMarketplaces />

      {/* ─── 8. BEHIND THE WEAVE (AUTHENTIC ARTISAN REELS) ─────────────────── */}
      <section className="py-20 lg:py-28 px-6 sm:px-10 lg:px-16 border-t border-b spec-hairline bg-[#FAF8F5]">
        <div className="max-w-[1520px] mx-auto">
          <div className="text-center mb-12">
            <span className="brass-badge px-2.5 py-1 text-[#C29B5D] text-[10px] uppercase font-bold tracking-[0.2em] inline-block mb-3 bg-white">
              Field Authenticity
            </span>
            <h2 className="text-3xl sm:text-4xl text-[#141E17] font-normal tracking-tight mb-3" style={{ fontFamily: serif }}>
              Behind the <span className="italic text-[#C29B5D]">Weave</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#68736B] max-w-md mx-auto leading-relaxed">
              Witness unedited documentation from our wetland extraction boats to master braiding guild circles across Bihar.
            </p>
          </div>

          {/* Horizontal left-to-right swipe on mobile, 4-column grid on desktop */}
          <div className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-none pb-4 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0" style={{ WebkitOverflowScrolling: "touch" }}>
            {artisanReels.map((reel, idx) => (
              <ArtisanReelCard key={reel.id} reel={reel} index={idx} />
            ))}
          </div>

          {/* Mobile Swipe Indicator */}
          <p className="lg:hidden text-center text-[10px] uppercase font-mono tracking-widest text-[#8C968F] mt-3">
            ← Swipe left or right to explore field reels →
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="https://www.instagram.com/krisluxeco/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#141E17] bg-white text-[#141E17] px-8 py-3 text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#141E17] hover:text-white transition-all shadow-sm"
            >
              <span>Follow Our Field Journey</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── 8.5. AS FEATURED IN (NATIONAL MEDIA & EDITORIAL FEATURES) ──────── */}
      <AsFeaturedIn />

      {/* ─── 9. LIVE CARBON FOOTPRINT & AUDITED METRICS ────────────────────── */}
      <LiveCarbonFootprint impactStats={impactStats} detailedStats={detailedStats} recentItems={recentItems} />
    </div>
  );
}


