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

  // Form states for the interactive concierge card
  const [rfqSector, setRfqSector] = useState("Hotels & Wellness Spas");
  const [rfqVolume, setRfqVolume] = useState("Tier 2: 151 – 500 units");
  const [sampleKitRequested, setSampleKitRequested] = useState(true);
  const [submittedRfq, setSubmittedRfq] = useState(false);

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

      {/* ─── 7. INTERACTIVE B2B CONCIERGE & SPECIFICATION RFQ CARD ────────── */}
      <section className="max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28" id="concierge">
        <div className="bg-[#0E1611] text-[#FAF8F5] p-8 sm:p-12 lg:p-16 border border-[#27382B] rounded-[2px] shadow-[0_24px_70px_rgba(10,18,12,0.18)] relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(194, 155, 93, 0.25) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Direct Consultation Dialogue (5 cols) */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-[2px] bg-[#1A2A20] border border-[#2B4434] text-[10px] uppercase font-mono font-bold tracking-[0.22em] text-[#C29B5D] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                <span>B2B Procurement Concierge</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[40px] text-white font-normal leading-[1.14] tracking-tight mb-4" style={{ fontFamily: serif }}>
                Initiate Bespoke Hospitality Specifications &amp; Material Lab Sampling.
              </h2>

              <p className="text-xs sm:text-sm text-[#A8B4AB] font-light leading-relaxed mb-8">
                Our commercial desk coordinates directly with FF&amp;E procurement directors, interior architects, and corporate ESG desks. Receive physical swatch boxes, certified technical documentation, and volume estimates within 48 business hours.
              </p>

              {/* Service & Provenance Tiles */}
              <div className="space-y-3.5 border-t border-white/10 pt-6">
                <div className="p-4 rounded-[2px] bg-white/[0.03] border border-white/10 flex items-start gap-3.5 hover:border-[#C29B5D]/40 transition-colors">
                  <div className="w-8 h-8 rounded-[2px] bg-[#C29B5D]/15 text-[#C29B5D] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Mithila &amp; Darbhanga Production Hub • Bihar</p>
                    <p className="text-xs text-[#8A968E] mt-0.5 font-light">Mithila Wetland Restoration Zone 03 • Direct living wages for 1,420+ accredited craftswomen</p>
                  </div>
                </div>

                <div className="p-4 rounded-[2px] bg-white/[0.03] border border-white/10 flex items-start gap-3.5 hover:border-[#C29B5D]/40 transition-colors">
                  <div className="w-8 h-8 rounded-[2px] bg-[#C29B5D]/15 text-[#C29B5D] flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Express Global Sampling</p>
                    <p className="text-xs text-[#8A968E] mt-0.5 font-light">Biological fiber swatch folders dispatched via DHL Express worldwide within 3 business days</p>
                  </div>
                </div>
              </div>

              {/* Trust Reassurance Badges */}
              <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#8C9890]">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" /> 48h Spec Turnaround</span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" /> ASTM Humidity Tested</span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" /> 100% Plastic-Free</span>
              </div>
            </div>

            {/* Right Column: Tailored Architectural RFQ Specification Form (7 cols) */}
            <div className="lg:col-span-7 bg-white text-[#141E17] p-7 sm:p-10 rounded-[2px] border border-[#EAE3D6] shadow-[0_16px_45px_rgba(0,0,0,0.12)]">
              {submittedRfq ? (
                <div className="py-12 px-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#EBF5EE] text-[#2E6B44] flex items-center justify-center mx-auto mb-4 border border-[#2E6B44]/20 shadow-sm">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-normal text-[#141E17] mb-2" style={{ fontFamily: serif }}>
                    Specification Request Received
                  </h4>
                  <p className="text-xs text-[#525E55] max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you. Your commercial project specifications have been routed to our Darbhanga and Patna procurement desks. A bespoke contract proposal and fiber courier tracking number will be delivered within 48 business hours.
                  </p>
                  <button
                    onClick={() => setSubmittedRfq(false)}
                    className="text-xs font-mono uppercase tracking-widest text-[#141E17] hover:text-[#C29B5D] underline underline-offset-4 cursor-pointer"
                  >
                    ← Submit Another Project Inquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl text-[#141E17] font-medium tracking-tight" style={{ fontFamily: serif }}>
                        Request Quotation &amp; Fiber Swatch Portfolio
                      </h3>
                      <p className="text-xs text-[#68736B] mt-1 font-light leading-relaxed">
                        Specify your commercial project details to receive a customized contract PDF and courier tracking.
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex text-[9px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-[2px] bg-[#FAF3E8] text-[#8C6422] font-bold border border-[#8C6422]/15 whitespace-nowrap">
                      Priority Desk
                    </span>
                  </div>

                  <form
                    className="space-y-4 sm:space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmittedRfq(true);
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-[#556057] mb-1.5">
                          Company / Architectural Firm *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Studio KO / Aman Hospitality"
                          className="w-full bg-[#FAF8F5] border border-[#EAE3D6] focus:border-[#141E17] focus:bg-white rounded-[2px] py-2.5 px-3.5 text-xs text-[#141E17] outline-none transition-all placeholder:text-[#9AA39D]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-[#556057] mb-1.5">
                          Procurement Contact Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="procurement@luxuryhotel.com"
                          className="w-full bg-[#FAF8F5] border border-[#EAE3D6] focus:border-[#141E17] focus:bg-white rounded-[2px] py-2.5 px-3.5 text-xs text-[#141E17] outline-none transition-all placeholder:text-[#9AA39D]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-[#556057] mb-1.5">
                          Primary Sector Archetype
                        </label>
                        <select
                          value={rfqSector}
                          onChange={(e) => setRfqSector(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#EAE3D6] focus:border-[#141E17] focus:bg-white rounded-[2px] py-2.5 px-3.5 text-xs text-[#141E17] outline-none transition-all cursor-pointer"
                        >
                          <option value="Hotels & Wellness Spas">Hotels &amp; Wellness Spas</option>
                          <option value="Artisanal Living & Retail">Artisanal Living &amp; Retail</option>
                          <option value="Corporate Gifting & ESG">Corporate Gifting &amp; ESG</option>
                          <option value="Millwork & Acoustic Panels">Millwork &amp; Acoustic Panels</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-[#556057] mb-1.5">
                          Estimated Volume Tier
                        </label>
                        <select
                          value={rfqVolume}
                          onChange={(e) => setRfqVolume(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#EAE3D6] focus:border-[#141E17] focus:bg-white rounded-[2px] py-2.5 px-3.5 text-xs text-[#141E17] outline-none transition-all cursor-pointer"
                        >
                          <option value="Sample Kit Only (1-5 units)">Sample Swatch Kit Only (1–5 units)</option>
                          <option value="Tier 1: 50 – 150 units">Tier 1: 50 – 150 units (Boutique)</option>
                          <option value="Tier 2: 151 – 500 units">Tier 2: 151 – 500 units (Commercial)</option>
                          <option value="Tier 3: 500+ units">Tier 3: 500+ units (Master Millwork)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-[#556057] mb-1.5">
                        Target Delivery Date &amp; Custom Requirements
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Provide desired installation date, bespoke dimensions, brass plaque debossing details, or flammability requirements..."
                        className="w-full bg-[#FAF8F5] border border-[#EAE3D6] focus:border-[#141E17] focus:bg-white rounded-[2px] py-2.5 px-3.5 text-xs text-[#141E17] outline-none transition-all resize-none placeholder:text-[#9AA39D]"
                      />
                    </div>

                    {/* Interactive Swatch Kit Toggle */}
                    <label className={`flex items-start gap-3 p-3.5 rounded-[2px] border cursor-pointer transition-all ${sampleKitRequested ? 'bg-[#F2F7F4] border-[#3E634A]/40' : 'bg-[#FAF8F5] border-[#EAE3D6]'}`}>
                      <input
                        type="checkbox"
                        checked={sampleKitRequested}
                        onChange={(e) => setSampleKitRequested(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded-none accent-[#141E17] cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-[#141E17] block">Include Physical Bihar Biological Fiber Swatch Kit</span>
                        <span className="text-[11px] text-[#68736B] font-light">Contains 4 authentic cured stems (Natural, Madder Root, Indigo, Golden Sun) + tensile lab spec.</span>
                      </div>
                    </label>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-[11px] font-mono text-[#8A968E]">
                        Dispatched via DHL Express Worldwide
                      </span>

                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-[#141E17] hover:bg-[#203225] text-[#FAF8F5] px-8 py-3.5 text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2.5 shadow-sm group/btn cursor-pointer"
                      >
                        <span>Submit Specification</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C29B5D] transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

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


