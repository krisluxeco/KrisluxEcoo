"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Award, ChevronDown } from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * WALL OF FAME - REAL MUSEUM GALLERY WALL WITH 18 HONORS
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const wallOfFameImages = [
  {
    id: 1,
    src: "/walloffame/fame-01.jpeg",
    alt: "Wall of Fame Milestone 1",
    aspect: "aspect-[16/9]",
  },
  {
    id: 2,
    src: "/walloffame/fame-07.jpeg",
    alt: "Wall of Fame Milestone 2",
    aspect: "aspect-[9/14]",
  },
  {
    id: 3,
    src: "/walloffame/fame-04.jpeg",
    alt: "Wall of Fame Milestone 3",
    aspect: "aspect-[16/9]",
  },
  {
    id: 4,
    src: "/walloffame/fame-08.jpeg",
    alt: "Wall of Fame Milestone 4",
    aspect: "aspect-[9/14]",
  },
  {
    id: 5,
    src: "/walloffame/fame-02.jpeg",
    alt: "Wall of Fame Milestone 5",
    aspect: "aspect-[16/9]",
  },
  {
    id: 6,
    src: "/walloffame/fame-09.jpeg",
    alt: "Wall of Fame Milestone 6",
    aspect: "aspect-[9/14]",
  },
  {
    id: 7,
    src: "/walloffame/fame-03.jpeg",
    alt: "Wall of Fame Milestone 7",
    aspect: "aspect-[16/9]",
  },
  {
    id: 8,
    src: "/walloffame/fame-11.jpeg",
    alt: "Wall of Fame Milestone 8",
    aspect: "aspect-[9/14]",
  },
  {
    id: 9,
    src: "/walloffame/fame-05.jpeg",
    alt: "Wall of Fame Milestone 9",
    aspect: "aspect-[16/9]",
  },
  {
    id: 10,
    src: "/walloffame/fame-13.jpeg",
    alt: "Wall of Fame Milestone 10",
    aspect: "aspect-[9/14]",
  },
  {
    id: 11,
    src: "/walloffame/fame-06.jpeg",
    alt: "Wall of Fame Milestone 11",
    aspect: "aspect-[16/9]",
  },
  {
    id: 12,
    src: "/walloffame/fame-15.jpeg",
    alt: "Wall of Fame Milestone 12",
    aspect: "aspect-[9/14]",
  },
  {
    id: 13,
    src: "/walloffame/fame-10.jpeg",
    alt: "Wall of Fame Milestone 13",
    aspect: "aspect-[16/9]",
  },
  {
    id: 14,
    src: "/walloffame/fame-18.jpeg",
    alt: "Wall of Fame Milestone 14",
    aspect: "aspect-[9/14]",
  },
  {
    id: 15,
    src: "/walloffame/fame-12.jpeg",
    alt: "Wall of Fame Milestone 15",
    aspect: "aspect-[16/9]",
  },
  {
    id: 16,
    src: "/walloffame/fame-14.jpeg",
    alt: "Wall of Fame Milestone 16",
    aspect: "aspect-[16/9]",
  },
  {
    id: 17,
    src: "/walloffame/fame-16.jpeg",
    alt: "Wall of Fame Milestone 17",
    aspect: "aspect-[16/9]",
  },
  {
    id: 18,
    src: "/walloffame/fame-17.jpeg",
    alt: "Wall of Fame Milestone 18",
    aspect: "aspect-[16/9]",
  },
];

const INITIAL_VISIBLE_COUNT = 6;

export default function AchievementsGallery({ images = wallOfFameImages }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const displayedImages = showAll ? images : images.slice(0, INITIAL_VISIBLE_COUNT);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  return (
    <section
      id="wall-of-fame"
      className="relative py-24 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 text-[#FAF8F5] overflow-hidden"
      style={{
        fontFamily: sans,
        backgroundColor: "#0D140F",
      }}
    >
      {/* ─── 1. REAL ARCHITECTURAL WALL SURFACE TEXTURE (Venetian Plaster / Limewash) ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 12%, rgba(212, 175, 108, 0.16) 0%, transparent 55%),
            radial-gradient(circle at 20% 45%, rgba(38, 56, 42, 0.45) 0%, transparent 60%),
            radial-gradient(circle at 80% 55%, rgba(28, 42, 32, 0.5) 0%, transparent 60%),
            radial-gradient(circle at 50% 90%, rgba(20, 30, 22, 0.6) 0%, transparent 70%),
            linear-gradient(180deg, #070B08 0%, #0E1610 25%, #121C14 55%, #0B110D 85%, #060907 100%)
          `,
        }}
      />

      {/* Fine tactile masonry stippled wall grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ─── 2. REAL GALLERY CEILING TRACK & LIGHT FIXTURES ─── */}
      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#040605] via-[#090F0B] to-[#121B14] border-b border-[#28382B] z-20 shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
        <div className="max-w-[1560px] mx-auto px-8 sm:px-14 flex justify-around items-center h-full">
          <div className="w-8 h-2 rounded-[1px] bg-[#C29B5D]/40 border border-[#C29B5D]/60 shadow-xs" />
          <div className="w-10 h-2.5 rounded-[1px] bg-[#C29B5D]/60 border border-[#C29B5D]/80 shadow-xs" />
          <div className="w-8 h-2 rounded-[1px] bg-[#C29B5D]/40 border border-[#C29B5D]/60 shadow-xs" />
        </div>
      </div>

      {/* Realistic Spotlights Shining Down On Wall Frames */}
      <div
        className="absolute top-0 left-1/4 -translate-x-1/2 w-[750px] h-[750px] pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212, 175, 108, 0.45) 0%, rgba(194, 155, 93, 0.1) 45%, transparent 75%)",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[850px] pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212, 175, 108, 0.55) 0%, rgba(194, 155, 93, 0.15) 50%, transparent 80%)",
        }}
      />
      <div
        className="absolute top-0 left-3/4 -translate-x-1/2 w-[750px] h-[750px] pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212, 175, 108, 0.45) 0%, rgba(194, 155, 93, 0.1) 45%, transparent 75%)",
        }}
      />

      {/* ─── 3. REAL ARCHITECTURAL BASEBOARD AT BOTTOM ─── */}
      <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-b from-[#0A100C] via-[#050806] to-[#020302] border-t border-[#1C281F] z-20 flex items-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)]">
        <div className="w-full h-[1px] bg-white/[0.05]" />
      </div>

      {/* ─── 4. MAIN CONTENT ─── */}
      <div className="relative z-10 max-w-[1560px] mx-auto">
        {/* ─── WALL OF FAME HEADING ─── */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-[2px] bg-[#142018]/90 border border-[#C29B5D]/40 text-[10px] uppercase font-mono font-bold tracking-[0.28em] text-[#C29B5D] mb-4 shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-xs">
            <Award className="w-3.5 h-3.5 text-[#C29B5D]" />
            <span>HONORS &amp; MILESTONES</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]"
            style={{ fontFamily: serif }}
          >
            Wall of <span className="italic text-[#C29B5D]">Fame</span>
          </h2>

          <div className="flex items-center justify-center gap-3 mt-3.5">
            <span className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#C29B5D] to-[#C29B5D]" />
            <span className="w-2 h-2 rotate-45 bg-[#C29B5D] shadow-[0_0_8px_rgba(194,155,93,0.6)]" />
            <span className="w-16 h-[1.5px] bg-gradient-to-l from-transparent via-[#C29B5D] to-[#C29B5D]" />
          </div>
        </div>

        {/* ─── FRAMED PICTURES ON WALL: BIGGER IMAGES, 3D CAST SHADOWS, BRASS BEVEL ─── */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-7 [column-fill:_balance]">
          {displayedImages.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              className="mb-6 sm:mb-7 break-inside-avoid group cursor-pointer transition-all duration-300 hover:-translate-y-2"
            >
              {/* Outer Picture Frame Moulding (Double Hairline Bevel + Deep Ambient Occlusion Shadow) */}
              <div className="relative p-2 sm:p-2.5 bg-gradient-to-b from-[#18241B] to-[#0F1711] border border-[#C29B5D]/45 group-hover:border-[#C29B5D] rounded-[2px] shadow-[0_24px_50px_rgba(0,0,0,0.85),0_8px_18px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.9)] group-hover:shadow-[0_32px_65px_rgba(0,0,0,0.95),0_12px_28px_rgba(194,155,93,0.3)] transition-all duration-300">
                {/* Inner Museum Mat Border */}
                <div className={`relative w-full ${item.aspect} overflow-hidden bg-black/80 ring-1 ring-black/90`}>
                  <Image
                    src={item.src}
                    alt={item.alt || `Wall of fame piece ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover brightness-[0.93] group-hover:brightness-105 group-hover:scale-[1.03] transition-all duration-500 ease-out"
                  />

                  {/* Museum Glass Sheen Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/12 opacity-60 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

                  {/* Corner Brass Mounting Studs / Nails */}
                  <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#E5C78E] to-[#8C6422] shadow-[0_1px_3px_rgba(0,0,0,0.8)] pointer-events-none" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#E5C78E] to-[#8C6422] shadow-[0_1px_3px_rgba(0,0,0,0.8)] pointer-events-none" />
                  <span className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#E5C78E] to-[#8C6422] shadow-[0_1px_3px_rgba(0,0,0,0.8)] pointer-events-none" />
                  <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#E5C78E] to-[#8C6422] shadow-[0_1px_3px_rgba(0,0,0,0.8)] pointer-events-none" />

                  {/* Center Zoom View Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-black/85 border border-[#C29B5D] text-[#C29B5D] flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.7)] transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── "VIEW ALL" BUTTON ─── */}
        {images.length > INITIAL_VISIBLE_COUNT && (
          <div className="mt-14 sm:mt-18 flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-[2px] bg-[#142018] hover:bg-[#C29B5D] text-[#C29B5D] hover:text-[#070B08] border border-[#C29B5D]/60 hover:border-[#C29B5D] font-mono text-xs uppercase tracking-[0.24em] font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.7)] cursor-pointer group"
            >
              <span>{showAll ? "Show Less" : `View All Moments (${images.length})`}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  showAll ? "rotate-180" : "group-hover:translate-y-0.5"
                }`}
              />
            </button>
            <span className="text-[11px] font-mono text-[#8C9890] tracking-wider">
              {showAll
                ? `Displaying all ${images.length} archived moments`
                : `Showing ${displayedImages.length} of ${images.length} field moments`}
            </span>
          </div>
        )}
      </div>

      {/* ─── FULLSCREEN EXHIBITION LIGHTBOX ─── */}
      <AnimatePresence>
        {selectedIndex !== null && images[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/96 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              aria-label="Close"
              className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-black/80 hover:bg-[#C29B5D] text-white hover:text-[#070B08] flex items-center justify-center transition-all cursor-pointer border border-[#C29B5D]/40"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  );
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/80 hover:bg-[#C29B5D] text-white hover:text-[#070B08] flex items-center justify-center transition-all cursor-pointer border border-[#C29B5D]/40"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev + 1) % images.length);
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/80 hover:bg-[#C29B5D] text-white hover:text-[#070B08] flex items-center justify-center transition-all cursor-pointer border border-[#C29B5D]/40"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Lightbox Frame */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl max-h-[88vh] w-full h-full flex flex-col items-center justify-center"
            >
              <div className="relative w-full h-full max-h-[82vh] p-2.5 sm:p-3.5 bg-[#121B14] border border-[#C29B5D]/70 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
                <div className="relative w-full h-full">
                  <Image
                    src={images[selectedIndex].src}
                    alt={images[selectedIndex].alt || "Wall of fame picture"}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Minimal Counter */}
              <div className="mt-3 bg-black/80 border border-[#C29B5D]/30 px-3.5 py-1 rounded-[2px] text-xs font-mono text-[#C29B5D]">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
