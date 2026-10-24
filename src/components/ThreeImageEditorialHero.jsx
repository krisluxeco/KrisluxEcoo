"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

const HERO_PANELS = [
  {
    num: "01",
    label: "01 — PREMIUM SUSTAINABLE",
    titleLine1: "Premium",
    titleLine2: "Sustainable",
    description: "Eco-friendly solutions handcrafted for a better tomorrow.",
    image: "/images/sustainable_harvest.jpg",
    hoverImage: "/images/sustainable_fiber_curing.jpg",
    alt: "Wetland farmer harvesting fresh green water hyacinth stalks at sunrise in Bihar",
    hoverAlt: "Rural village artisans sun-curing golden water hyacinth fiber sheaves in sunny courtyard",
    href: "/user/products",
    textColor: "text-white",
    labelColor: "text-white/90",
    dashColor: "bg-white/70",
    descColor: "text-white/85",
    btnBorder: "border-white/60 group-hover:border-white",
    btnBg: "bg-black/25 group-hover:bg-white",
    btnText: "text-white group-hover:text-[#1A3326]",
    overlay: "bg-gradient-to-b from-black/65 via-black/20 to-black/50",
  },
  {
    num: "02",
    label: "02 — ARTISAN HERITAGE",
    titleLine1: "Artisan",
    titleLine2: "Heritage",
    description: "Empowering 200+ rural women. Weaving timeless craft.",
    image: "/images/artisan_empowerment.png",
    hoverImage: "/images/HeroSection3.png",
    alt: "Rural women master artisans hand-weaving water hyacinth craft",
    hoverAlt: "Artisan cooperative workshop handcrafting sustainable eco-luxury products",
    href: "/user/about",
    textColor: "text-white",
    labelColor: "text-white/90",
    dashColor: "bg-white/70",
    descColor: "text-white/85",
    btnBorder: "border-white/60 group-hover:border-white",
    btnBg: "bg-black/25 group-hover:bg-white",
    btnText: "text-white group-hover:text-[#1A3326]",
    overlay: "bg-gradient-to-b from-black/65 via-black/25 to-black/50",
  },
  {
    num: "03",
    label: "03 — INDIA'S 1ST ECO-LUXURY",
    titleLine1: "India's 1st",
    titleLine2: "Eco-Luxury",
    description: "Pioneering botanical luxury. Handcrafted with zero synthetics.",
    image: "/images/eco_luxury_totes_hq.jpg",
    hoverImage: "/images/eco_luxury_canister_hq.jpg",
    alt: "Handcrafted water hyacinth luxury tote bags with embroidered botanical floral motifs",
    hoverAlt: "Artisanal hand-woven water hyacinth canister with embroidered blue flowers and lid handle",
    href: "/user/about",
    textColor: "text-white",
    labelColor: "text-white/90",
    dashColor: "bg-white/70",
    descColor: "text-white/85",
    btnBorder: "border-white/60 group-hover:border-white",
    btnBg: "bg-black/25 group-hover:bg-white",
    btnText: "text-white group-hover:text-[#1A3326]",
    overlay: "bg-gradient-to-b from-black/70 via-black/25 to-black/55",
  },
];

/**
 * Premium Three-Image Editorial Hero Section
 * - 100% Responsive: Full-screen horizontal swipe carousel on mobile with touch snap; 3 equal columns on desktop.
 * - Zero gap, single hairline divider line, zero border radius.
 * - Top navbar clearance so fixed navbar never conceals hero content.
 * - Monumental faded "KRISLUXECO" watermark anchored at the bottom.
 * - Smooth curtain reveal on hover: secondary image slides down from navbar to bottom, slides back up on release.
 */
export default function ThreeImageEditorialHero() {
  const containerRef = useRef(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  // Track active slide on mobile horizontal scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / clientWidth);
      setActiveMobileIdx(Math.min(Math.max(idx, 0), HERO_PANELS.length - 1));
    }
  };

  const scrollToPanel = (idx) => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: idx * width,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-label="Editorial Product Showcase"
      className="relative w-full bg-[#0D140F] border-b border-black overflow-hidden pt-[96px] sm:pt-[112px] lg:pt-[124px]"
      style={{ fontFamily: sans }}
    >
      {/* ─── Big Faded Single Watermark Text "KRISLUXECO" Spanning Bottom Across Images (Dark Color) ─── */}
      <div
        className="absolute bottom-2 sm:bottom-4 lg:bottom-6 inset-x-0 z-15 pointer-events-none select-none flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-[clamp(3.5rem,13vw,14rem)] font-bold tracking-[0.12em] uppercase text-black/45 whitespace-nowrap leading-none drop-shadow-[0_2px_16px_rgba(0,0,0,0.3)]"
          style={{ fontFamily: serif }}
        >
          KRISLUXECO
        </span>
      </div>

      {/* ─── Hero Container: Swipeable Snap Carousel on Mobile, 3-Column Grid on Desktop with Black Separation Lines ─── */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-[76vh] sm:h-[82vh] md:h-[84vh] min-h-[520px] max-h-[860px] flex md:grid md:grid-cols-3 gap-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none divide-x divide-black border-y border-black"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {HERO_PANELS.map((panel, idx) => (
          <Link
            key={panel.num}
            href={panel.href}
            className="group relative flex-shrink-0 w-full min-w-full md:min-w-0 md:w-full h-full rounded-none overflow-hidden block select-none bg-[#0D140F] snap-center"
          >
            {/* 1. Base Background Photography */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={panel.image}
                alt={panel.alt}
                fill
                priority={true}
                sizes="(max-width: 768px) 100vw, 33.33vw"
                className="object-cover transform transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            </div>

            {/* Base Editorial Overlay Scrim */}
            <div
              className={`absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none ${panel.overlay}`}
            />

            {/* 2. Slide-Down Secondary Image: Sweeps DOWN from top on hover, slides back UP on release */}
            <div className="absolute inset-0 z-12 overflow-hidden pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-y-full group-hover:translate-y-0">
              <div className="relative w-full h-full transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0">
                <Image
                  src={panel.hoverImage}
                  alt={panel.hoverAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33.33vw"
                  className="object-cover scale-105"
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${panel.overlay}`}
                />
              </div>
            </div>

            {/* 3. Text & CTA Content Positioned in Upper Portion */}
            <div className="relative z-20 h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14">
              <div className="flex flex-col items-start pt-1 sm:pt-2">
                {/* Number & Dash (e.g. 01 —) */}
                <div
                  className={`flex items-center gap-2.5 sm:gap-3 font-mono text-xs sm:text-[13px] tracking-wider uppercase font-medium mb-3 sm:mb-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] ${panel.labelColor}`}
                >
                  <span>{panel.num}</span>
                  <span className={`w-7 sm:w-8 h-[1.5px] ${panel.dashColor}`} />
                </div>

                {/* Large Editorial Serif Headline */}
                <h2
                  className={`text-[clamp(2.2rem,3.4vw,3.6rem)] font-normal leading-[1.06] tracking-[-0.02em] mb-2.5 sm:mb-3.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] ${panel.textColor}`}
                  style={{ fontFamily: serif }}
                >
                  <span className="block">{panel.titleLine1}</span>
                  <span className="block">{panel.titleLine2}</span>
                </h2>

                {/* Clean Modern Sans-Serif Description */}
                <p
                  className={`text-xs sm:text-sm font-normal max-w-[280px] leading-relaxed mb-5 sm:mb-6 drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)] ${panel.descColor}`}
                >
                  {panel.description}
                </p>

                {/* Minimal Circular Arrow Icon */}
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-sm ${panel.btnBorder} ${panel.btnBg} ${panel.btnText}`}
                  aria-hidden="true"
                >
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>

              {/* Accessible Subtle Bottom Bar on Hover */}
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-white/90">
                <span>Direct B2B Procurement</span>
                <span className="inline-flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ─── Mobile Slide Indicators & Swipe Hint (Visible only on mobile/tablet) ─── */}
      <div className="md:hidden absolute bottom-3 left-0 right-0 z-25 flex items-center justify-between px-6 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
          {HERO_PANELS.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPanel(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeMobileIdx === i ? "w-6 bg-white" : "w-1.5 bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => scrollToPanel(Math.max(activeMobileIdx - 1, 0))}
            disabled={activeMobileIdx === 0}
            className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white flex items-center justify-center disabled:opacity-30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scrollToPanel(Math.min(activeMobileIdx + 1, HERO_PANELS.length - 1))}
            disabled={activeMobileIdx === HERO_PANELS.length - 1}
            className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white flex items-center justify-center disabled:opacity-30"
            aria-label="Next slide"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
