"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  ShoppingBag,
  Sparkles,
  BookOpen,
  Send,
  Home,
  Layers,
  Leaf
} from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

function FloatingLeaf({ style }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none text-[#C8A97A]/25"
      style={style}
      animate={{
        y: ["0vh", "-110vh"],
        rotate: [0, 360],
        x: [0, style.drift ?? 40, 0],
        opacity: [0, 0.4, 0.2, 0],
      }}
      transition={{
        duration: style.dur ?? 14,
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

const particles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  style: {
    left: `${(i * 10 + 4) % 96}%`,
    bottom: "-10%",
    size: 14 + (i % 4) * 4,
    dur: 12 + (i % 5) * 3,
    delay: i * 1.2,
    drift: -25 + (i % 4) * 20,
  },
}));

export default function NotFound() {
  const router = useRouter();

  const curatedDestinations = [
    {
      title: "Handcrafted Catalog",
      href: "/user/products",
      icon: ShoppingBag,
    },
    {
      title: "Our Heritage & Story",
      href: "/user/about/brand-story",
      icon: BookOpen,
    },
    {
      title: "Bespoke & Bulk Gifting",
      href: "/user/bulk-order",
      icon: Layers,
    },
    {
      title: "Share Catalog Portal",
      href: "/share-catalog",
      icon: Send,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] w-screen h-[100dvh] bg-[#1C1C1A] text-white flex flex-col justify-between px-6 py-6 sm:py-8 sm:px-12 overflow-hidden selection:bg-[#C8A97A] selection:text-[#1C1C1A]"
      style={{ fontFamily: sans }}
    >
      {/* ─── Ambient Animated Backdrop ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <FloatingLeaf key={p.id} style={p.style} />
        ))}

        {/* Ambient radial glows */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.28, 0.15],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] bg-gradient-to-tr from-[#C8A97A]/25 via-[#4A6741]/20 to-transparent rounded-full blur-[130px] pointer-events-none"
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ─── Top Bar: Brand & Status ────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5">
            <Image
              width={100}
              height={100}
              src="/logos.jpg"
              alt="KrisluxECO Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className="font-bold tracking-wide text-white text-base sm:text-lg"
            style={{ fontFamily: serif }}
          >
            Krislux<span className="text-[#7FA06B]">ECO</span>
          </span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] tracking-[0.2em] uppercase font-semibold text-[#E9D9B8]">
          <Compass className="w-3 h-3 text-[#C8A97A] animate-spin" style={{ animationDuration: "12s" }} />
          <span>Error 404 · Uncharted</span>
        </div>
      </header>

      {/* ─── Center Hero Content (Fits perfectly without scroll) ──── */}
      <main className="relative z-10 max-w-3xl mx-auto w-full text-center flex flex-col items-center justify-center my-auto py-2">
        {/* Sculptural 404 Centerpiece */}
        <div className="relative select-none flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 sm:gap-4 font-light leading-none"
            style={{ fontFamily: serif }}
          >
            {/* Number 4 */}
            <motion.span
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-[clamp(4.5rem,14vw,9.5rem)] bg-gradient-to-b from-white via-[#FAF7F2] to-white/40 bg-clip-text text-transparent font-light tracking-tighter"
            >
              4
            </motion.span>

            {/* Glowing Artisan Ring as '0' */}
            <motion.div
              animate={{ rotate: 360, y: [4, -4, 4] }}
              transition={{
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative w-[clamp(3.5rem,11vw,7.5rem)] h-[clamp(3.5rem,11vw,7.5rem)] rounded-full p-[2px] bg-gradient-to-tr from-[#C8A97A] via-white/40 to-[#4A6741] shadow-[0_0_40px_rgba(200,169,122,0.35)] flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full bg-[#1C1C1A] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8A97A]/25 via-transparent to-[#4A6741]/20" />
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-[#C8A97A] animate-pulse" />
              </div>
            </motion.div>

            {/* Number 4 */}
            <motion.span
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="text-[clamp(4.5rem,14vw,9.5rem)] bg-gradient-to-b from-white via-[#FAF7F2] to-white/40 bg-clip-text text-transparent font-light tracking-tighter"
            >
              4
            </motion.span>
          </motion.div>

          <div className="w-32 sm:w-56 h-[1px] bg-gradient-to-r from-transparent via-[#C8A97A]/60 to-transparent -mt-1 sm:-mt-2" />
        </div>

        {/* Narrative Headline */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-3 sm:mt-5 space-y-2 max-w-xl"
        >
          <h1
            className="text-xl sm:text-3xl md:text-4xl font-light text-white leading-tight"
            style={{ fontFamily: serif }}
          >
            This path has returned to <span className="italic text-[#C8A97A]">nature.</span>
          </h1>
          <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
            The artisanal creation or destination you are seeking has dissolved back into the river.
            Let us guide your journey back to conscious luxury.
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full bg-[#C8A97A] text-[#1C1C1A] font-semibold text-[11px] sm:text-xs tracking-widest uppercase hover:bg-[#E9D9B8] transition-all duration-300 shadow-[0_0_25px_rgba(200,169,122,0.25)] hover:shadow-[0_0_35px_rgba(200,169,122,0.4)] transform hover:-translate-y-0.5"
          >
            <Home className="w-3.5 h-3.5 text-[#1C1C1A]" />
            Return to Sanctuary
          </Link>

          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full bg-white/5 border border-white/15 text-white font-medium text-[11px] sm:text-xs tracking-widest uppercase hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C8A97A] group-hover:-translate-x-1 transition-transform" />
            Previous Step
          </button>
        </motion.div>
      </main>

      {/* ─── Bottom Navigation Strip: Quick Links ───────────────── */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex-shrink-0 pt-3 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#C8A97A]/80 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A97A]" />
            <span>Popular Pathways</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {curatedDestinations.map((dest) => {
              const Icon = dest.icon;
              return (
                <Link
                  key={dest.title}
                  href={dest.href}
                  className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C8A97A]/40 text-xs text-white/70 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-3 h-3 text-[#C8A97A] group-hover:scale-110 transition-transform" />
                  <span>{dest.title}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-white/40 group-hover:text-[#C8A97A] group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
