"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TeamSection from "@/components/TeamSection";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

const archetypes = [
  {
    id: "home-storage",
    title: "Home & Living Storage",
    category: "Interior Architecture",
    description:
      "Sculptural laundry hampers, bread trays, vanity organizers, and nesting baskets woven with tight herringbone braids. Naturally moisture-resistant and breathable.",
    image: "/images/home_storage.png",
    specs: ["Water hyacinth stalk fiber", "Zero synthetics or plastics", "Natural sun-cured finish"],
    link: "/user/products?category=Storage",
  },
  {
    id: "fashion-bags",
    title: "Fashion & Tote Bags",
    category: "Sustainable Apparel",
    description:
      "Ergonomic everyday shoulder totes, clutches, and structured weekenders pairing biological hyacinth canvas with vegetable-tanned accents and brass hardware.",
    image: "/images/fashion_bags.png",
    specs: ["Reinforced botanical weave", "Up to 12kg tensile capacity", "Naturally lightweight"],
    link: "/user/products?category=Fashion",
  },
  {
    id: "furniture-decor",
    title: "Furniture & Statement Décor",
    category: "Lounge & Hospitality",
    description:
      "Solid reclaimed teak and powder-coated steel frames hand-wrapped in dense biological hyacinth cordage. Ideal for five-star eco-resorts and luxury residences.",
    image: "/premium_furniture.png",
    specs: ["Custom architectural dimensions", "Commercial durability rating", "ASTM non-toxic finish"],
    link: "/user/custom-design",
  },
  {
    id: "corporate-gifting",
    title: "Bespoke Corporate Gifting",
    category: "Institutional & ESG",
    description:
      "Sustainable desk organizers, journal covers, executive coasters, and festive hampers customized with discreet debossed logos for global ESG alignment.",
    image: "/images/corporate_gifting.png",
    specs: ["Custom corporate branding", "Verified ESG impact certificate", "Zero single-use packaging"],
    link: "/user/bulk-order",
  },
];

const milestones = [
  {
    year: "2023",
    title: "The Genesis at IIT Patna",
    desc: "Founder Krishna Singh identified water hyacinth choking Begusarai wetlands and initiated pilot fiber-extraction trials in university laboratories.",
  },
  {
    year: "2024",
    title: "Artisan Cooperative Incubation",
    desc: "Partnered with UMSAS and the Ministry of Textiles to establish our first cluster of 50 trained female artisans in rural Bihar.",
  },
  {
    year: "2025",
    title: "State Startup Recognition",
    desc: "Awarded recognition and funding under the Bihar Startup Policy, scaling production to supply 40+ premier hospitality groups and boutiques.",
  },
  {
    year: "2026",
    title: "Global Export Horizon",
    desc: "Expanding ethical trade corridors to the UK, Germany, and the UAE, while onboarding 200+ certified master craftswomen.",
  },
];

const pillars = [
  {
    number: "01",
    title: "Ecological Regeneration",
    desc: "Water hyacinth multiplies exponentially, blocking sunlight and depleting oxygen in freshwater wetlands. We harvest over 100 tons annually, revitalizing native aquatic habitats.",
    metric: "100+ Tons Biomass Harvested",
  },
  {
    number: "02",
    title: "Artisan Sovereignty",
    desc: "We disintermediate traditional middlemen, ensuring our female craftswomen receive 3x standard regional wages, official Pehchan identity cards, and safe cooperative workspaces.",
    metric: "80% Women-Led Cooperative",
  },
  {
    number: "03",
    title: "Zero Synthetic Chemistry",
    desc: "From harvest to dispatch, no toxic varnishes, formaldehyde, or synthetic glues are ever used. Our pieces are 100% biodegradable, returning safely to the soil at the end of their lifecycle.",
    metric: "100% Biodegradable & Safe",
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0D140F] selection:bg-[#C29B5D]/20 selection:text-[#0D140F]">

      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative bg-[#0D140F] text-[#FAF8F5] pt-32 pb-24 lg:pt-40 lg:pb-32 px-6 lg:px-16 overflow-hidden">
        {/* Subtle architectural background texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#C29B5D 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px, 80px 80px",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            {/* Monospace Eyebrow Tag */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-[2px] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#C29B5D] animate-pulse" />
              <span
                className="text-[11px] font-mono tracking-[0.2em] text-[#C29B5D] uppercase"
              >
                FOUNDED AT IIT PATNA · ACCREDITED ARTISAN ENTERPRISE
              </span>
            </div>

            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] text-white mb-8"
              style={{ fontFamily: serif }}
            >
              Transforming Wetland Crisis into <br className="hidden sm:block" />
              <span className="text-[#C29B5D] italic font-serif">Collectible Eco-Luxury</span>.
            </h1>

            <p
              className="text-white/75 text-lg sm:text-xl font-light leading-relaxed max-w-3xl mb-12"
              style={{ fontFamily: sans }}
            >
              KrisluxECO was founded by innovators from IIT Patna to solve an acute ecological threat. We harvest invasive water hyacinth choking Bihar&apos;s freshwater riverways, empowering over 200 rural women master weavers to craft heirloom homeware and sustainable corporate artifacts.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/user/products"
                className="px-8 py-4 bg-[#C29B5D] text-[#0D140F] text-xs uppercase tracking-[0.2em] font-semibold rounded-[2px] hover:bg-[#d6af70] transition-colors shadow-sm"
                style={{ fontFamily: sans }}
              >
                Explore Handcrafted Catalog
              </Link>
              <Link
                href="/user/partners"
                className="px-8 py-4 border border-white/20 text-white text-xs uppercase tracking-[0.2em] font-medium rounded-[2px] hover:bg-white/5 hover:border-white/40 transition-colors"
                style={{ fontFamily: sans }}
              >
                Institutional Partnerships
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 4-Stat Metric Ribbon */}
        <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl lg:text-4xl font-serif text-[#C29B5D] mb-1">200+</div>
            <div className="text-xs uppercase tracking-wider text-white/80 font-medium">Master Artisans</div>
            <div className="text-[11px] text-white/50 mt-1">Begusarai, Madhubani &amp; Gaya clusters</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-serif text-[#C29B5D] mb-1">80%</div>
            <div className="text-xs uppercase tracking-wider text-white/80 font-medium">Women Leadership</div>
            <div className="text-[11px] text-white/50 mt-1">Economic sovereignty &amp; Pehchan IDs</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-serif text-[#C29B5D] mb-1">3.2x</div>
            <div className="text-xs uppercase tracking-wider text-white/80 font-medium">Wage Multiplier</div>
            <div className="text-[11px] text-white/50 mt-1">Above regional agricultural benchmarks</div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-serif text-[#C29B5D] mb-1">100%</div>
            <div className="text-xs uppercase tracking-wider text-white/80 font-medium">Circular Material</div>
            <div className="text-[11px] text-white/50 mt-1">Zero synthetic glues, plastics, or dyes</div>
          </div>
        </div>
      </section>

      {/* 2. FOUNDER'S GENESIS & PHILOSOPHY */}
      <section className="py-24 lg:py-32 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Narrative */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-[1px] w-8 bg-[#C29B5D]" />
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#C29B5D] font-mono">
                THE GENESIS STORY
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-[#0D140F] mb-8"
              style={{ fontFamily: serif }}
            >
              When an ecological nuisance becomes a <span className="text-[#C29B5D] italic">beacon of rural dignity</span>.
            </h2>

            <div className="space-y-6 text-[#0D140F]/75 text-base sm:text-lg font-light leading-relaxed">
              <p>
                In the floodplains of Bihar, water hyacinth (*Eichhornia crassipes*) has long been regarded as an environmental scourge. Over 2.5 lakh hectares of wetlands choked under dense green canopies, blocking sunlight, decimating freshwater fisheries, and releasing methane as rotting vegetation sank to lakebeds.
              </p>
              <p>
                During his engineering tenure at <strong className="text-[#0D140F] font-semibold">IIT Patna</strong>, founder <strong className="text-[#0D140F] font-semibold">Krishna Singh</strong>, born and raised in Begusarai, recognized that the fibrous stalk of this plant possessed extraordinary tensile strength, natural moisture resilience, and an organic tactile warmth akin to natural wicker.
              </p>
              <p>
                What was missing was institutional design, rigorous quality control, and direct market pipelines. By uniting technical incubation from IIT Patna with the indigenous weaving traditions of local artisans, KrisluxECO was born—an enterprise where every artifact produced clears freshwater and generates dignity.
              </p>
            </div>

            {/* Quote block */}
            <div className="mt-8 p-6 bg-[#F4EFE6] border-l-2 border-[#C29B5D] rounded-[2px]">
              <p className="text-[#0D140F] font-serif italic text-lg mb-2">
                &ldquo;True luxury is never built on depletion. When you purchase a KrisluxECO creation, you are directly investing in Bihar&apos;s wetland rejuvenation and the financial autonomy of rural women.&rdquo;
              </p>
              <div className="text-xs uppercase tracking-widest text-[#C29B5D] font-semibold">
                — Krishna Singh, Founder &amp; CEO (IIT Patna)
              </div>
            </div>
          </div>

          {/* Right Visual Collage */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/5] bg-white border border-[#EAE3D6] p-3 rounded-[2px] shadow-[0_12px_40px_rgba(13,20,15,0.06)]">
              <div className="relative w-full h-full overflow-hidden rounded-[2px]">
                <Image
                  src="/artisan_craft.png"
                  alt="Rural female artisan hand-weaving water hyacinth product"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D140F]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C29B5D] block mb-1">
                    BEGUSARAI COOPERATIVE
                  </span>
                  <p className="text-sm font-medium leading-snug">
                    Master weavers transforming sun-cured botanical stems into precision herringbone homeware.
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Badge Card */}
            <div className="bg-white border border-[#EAE3D6] p-6 rounded-[2px] flex items-center gap-5">
              <div className="w-14 h-14 bg-[#3E634A]/10 border border-[#3E634A]/25 rounded-[2px] flex items-center justify-center flex-shrink-0 text-[#3E634A]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0D140F] uppercase tracking-wider">
                  Accredited &amp; Incubation Backed
                </h4>
                <p className="text-xs text-[#0D140F]/65 mt-1 leading-relaxed">
                  Recognized by the Bihar Startup Policy, UMSAS, and mentored through the Incubation Centre, IIT Patna.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. THE 3-PILLAR REGENERATION EQUATION */}
      <section className="py-24 bg-[#F4EFE6] border-y border-[#EAE3D6] px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-[#C29B5D]" />
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#C29B5D] font-mono">
                CIRCULAR METHODOLOGY
              </span>
              <span className="h-[1px] w-8 bg-[#C29B5D]" />
            </div>
            <h2
              className="text-3xl sm:text-5xl font-light text-[#0D140F] mb-6 leading-tight"
              style={{ fontFamily: serif }}
            >
              The Three Pillars of <span className="text-[#C29B5D] italic">KrisluxECO</span>
            </h2>
            <p className="text-base sm:text-lg text-[#0D140F]/70 font-light leading-relaxed">
              Our triple-bottom-line operational model guarantees measurable positive outcomes for ecosystems, artisans, and design connoisseurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="bg-white border border-[#EAE3D6] p-8 rounded-[2px] shadow-[0_8px_30px_rgba(13,20,15,0.03)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-semibold tracking-widest text-[#C29B5D]">
                      PILLAR {pillar.number}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#3E634A]" />
                  </div>
                  <h3
                    className="text-2xl font-serif text-[#0D140F] mb-4"
                    style={{ fontFamily: serif }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#0D140F]/70 font-light leading-relaxed mb-8">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE3D6] flex items-center justify-between text-xs">
                  <span className="text-[#0D140F]/50 uppercase tracking-wider font-mono">Impact Factor</span>
                  <span className="font-semibold text-[#3E634A]">{pillar.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUCT ARCHETYPES (WHAT WE MAKE) */}
      <section className="py-24 lg:py-32 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-[#C29B5D]" />
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#C29B5D] font-mono">
                COLLECTIBLE PRODUCT ARCHETYPES
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-light text-[#0D140F]"
              style={{ fontFamily: serif }}
            >
              Woven for Modern <span className="text-[#C29B5D] italic">Conscious Living</span>
            </h2>
          </div>

          <div className="flex gap-2">
            {archetypes.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-[2px] transition-all ${
                  activeTab === idx
                    ? "bg-[#0D140F] text-white"
                    : "bg-white border border-[#EAE3D6] text-[#0D140F]/70 hover:bg-[#F4EFE6]"
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Archetype Feature Banner */}
        <div className="bg-white border border-[#EAE3D6] p-6 lg:p-12 rounded-[2px] shadow-[0_16px_50px_rgba(13,20,15,0.05)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              <div className="lg:col-span-6 relative aspect-[4/3] rounded-[2px] overflow-hidden bg-[#FAF8F5] border border-[#EAE3D6]">
                <Image
                  src={archetypes[activeTab].image}
                  alt={archetypes[activeTab].title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="lg:col-span-6 flex flex-col justify-center">
                <span className="text-xs font-mono text-[#C29B5D] uppercase tracking-[0.2em] mb-2 block">
                  {archetypes[activeTab].category}
                </span>
                <h3
                  className="text-3xl sm:text-4xl font-serif text-[#0D140F] mb-4"
                  style={{ fontFamily: serif }}
                >
                  {archetypes[activeTab].title}
                </h3>
                <p className="text-base text-[#0D140F]/75 font-light leading-relaxed mb-6">
                  {archetypes[activeTab].description}
                </p>

                <div className="space-y-2 mb-8">
                  {archetypes[activeTab].specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-3 text-xs text-[#0D140F]/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C29B5D]" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={archetypes[activeTab].link}
                    className="px-6 py-3.5 bg-[#0D140F] text-white text-xs uppercase tracking-[0.2em] font-medium rounded-[2px] hover:bg-[#3E634A] transition-colors"
                  >
                    View This Category
                  </Link>
                  <Link
                    href="/user/bulk-order"
                    className="px-6 py-3.5 border border-[#EAE3D6] text-[#0D140F] text-xs uppercase tracking-[0.2em] font-medium rounded-[2px] hover:bg-[#F4EFE6] transition-colors"
                  >
                    Request Custom Batch
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 5. INSTITUTIONAL MILESTONES & JOURNEY */}
      <section className="py-24 bg-[#0D140F] text-[#FAF8F5] px-6 lg:px-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-[#C29B5D]" />
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#C29B5D] font-mono">
                CHRONICLE OF GROWTH
              </span>
              <span className="h-[1px] w-8 bg-[#C29B5D]" />
            </div>
            <h2
              className="text-3xl sm:text-5xl font-light text-white mb-6 leading-tight"
              style={{ fontFamily: serif }}
            >
              Building Bihar&apos;s First <br />
              <span className="text-[#C29B5D] italic">Global Sustainable Luxury House</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 p-6 rounded-[2px] flex flex-col justify-between hover:border-[#C29B5D]/50 transition-colors"
              >
                <div>
                  <div className="text-2xl font-serif text-[#C29B5D] font-light mb-4">{m.year}</div>
                  <h4 className="text-base font-medium text-white mb-3" style={{ fontFamily: serif }}>
                    {m.title}
                  </h4>
                  <p className="text-xs text-white/65 font-light leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  Phase 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LEADERSHIP & TEAM SECTION */}
      <TeamSection />

      {/* 7. EDITORIAL CALL TO ACTION */}
      <section className="py-24 lg:py-32 px-6 lg:px-16 bg-[#FAF8F5] border-t border-[#EAE3D6] text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-[1px] w-8 bg-[#C29B5D]" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#C29B5D] font-mono">
              COLLABORATE WITH US
            </span>
            <span className="h-[1px] w-8 bg-[#C29B5D]" />
          </div>

          <h2
            className="text-3xl sm:text-5xl font-light leading-tight text-[#0D140F] mb-6"
            style={{ fontFamily: serif }}
          >
            Join the Movement Toward <br />
            <span className="text-[#C29B5D] italic">Regenerative Design</span>.
          </h2>

          <p className="text-base sm:text-lg text-[#0D140F]/70 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Whether furnishing a luxury boutique hotel, provisioning an eco-conscious retail network, or curating ESG corporate gifts, let us craft your vision sustainably.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/user/bulk-order"
              className="px-8 py-4 bg-[#0D140F] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-[2px] hover:bg-[#3E634A] transition-colors"
            >
              Inquire Bulk &amp; Corporate
            </Link>
            <Link
              href="/user/custom-design"
              className="px-8 py-4 bg-white border border-[#EAE3D6] text-[#0D140F] text-xs uppercase tracking-[0.2em] font-medium rounded-[2px] hover:bg-[#F4EFE6] transition-colors"
            >
              Custom Bespoke Prototyping
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}