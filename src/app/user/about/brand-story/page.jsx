"use client";
import Image from "next/image";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
  ─────────────────────────────────────────────────────────────────────────
  IMAGE STORY — the second act of the film. The YouTube reel above this
  section is the "cold open"; this is the movie proper: full-bleed
  photographs, pinned and cross-dissolved as you scroll, each one carrying
  a line of the story like a subtitle. A thin gold thread stitches down
  the right edge as you move through it — a nod to the weaving itself.

  HOW IT WORKS
  ───────────────────────────────────
  • The whole section is one tall track (CHAPTERS.length * 100vh).
  • Inside it, a single sticky stage stays pinned to the viewport.
  • One ScrollTrigger (scrubbed, driven by the same Lenis instance the
    parent <MovieBrandStory> already wires into GSAP's ticker) reads
    scroll progress 0→1 across that track and:
      1. picks the active chapter + how far through it you are ("local"),
      2. cross-dissolves that chapter's photo in from the previous one,
      3. drives a slow Ken Burns drift (scale 1 → 1.12) on the visible
         photo so nothing ever looks static,
      4. fades the caption in/out on the same local timeline,
      5. advances the gold thread + the "reel counter" readout.
  • No Three.js here on purpose — a pinned crossfade + Ken Burns already
    reads as "cinematic," and skipping WebGL keeps this section light on
    mobile. If you want a heavier moment later (e.g. a single 3D hero
    beat), that's a good place to reach for @react-three/fiber — doing it
    for every photo would fight the film's slow pace.

  IMAGES — READ THIS BEFORE SHIPPING
  ───────────────────────────────────
  Each chapter below points at a loremflickr.com keyword search so you can
  see the section working immediately with roughly-on-theme photography.
  These are NOT licensed for production use — swap `img` for real photos
  of your own harvest, artisans, and product (your strongest asset for a
  story like this anyway) before this goes live. The `lock` query param
  just keeps the same placeholder photo across reloads while you build.
  ─────────────────────────────────────────────────────────────────────────
*/

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";
const mono = "'IBM Plex Mono', monospace";

const CHAPTERS = [
  {
    id: "crisis",
    eyebrow: "Chapter One — The Crisis",
    title: "A silent ecological emergency",
    line: "In Bihar, our waterways faced a disaster. Over 2.5 lakh hectares of vital wetlands became choked by invasive water hyacinth—killing local fish populations, destroying the livelihoods of traditional fishermen, and releasing harmful methane as it decayed.",
    img: "/images/BrandStory1.png",
    align: "left",
  },
  {
    id: "impact",
    eyebrow: "Chapter Two — The Human Cost",
    title: "Exploited and marginalized",
    line: "Simultaneously, traditional craft was dying due to a lack of market access. Rural artisans—80% of whom are economically vulnerable women—earned below subsistence levels while middlemen captured over 80% of the value they created.",
    img: "/images/BrandStory2.png",
    align: "right",
  },
  {
    id: "innovation",
    eyebrow: "Chapter Three — The Innovation",
    title: "Turning pollution into premium",
    line: "We saw a bridge between these two crises. By harvesting the free, abundant water hyacinth directly from dying wetlands, we eliminated raw material costs and turned a climate threat into a sustainable design solution.",
    img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80",
    align: "left",
  },
  {
    id: "craft",
    eyebrow: "Chapter Four — The Craft",
    title: "Heritage meets modern design",
    line: "Collaborating with the National Institute of Design (NID), we combined traditional weaving heritage with modern ergonomics to craft export-ready, Eco-Luxury products.",
    img: "/images/BrandStory4.png",
    align: "right",
  },
  {
    id: "restoration",
    eyebrow: "Chapter Five — Restoring Nature",
    title: "Healing our wetlands",
    line: "Today, we actively remove methane-emitting hyacinth, helping restore wetland biodiversity and clean up Bihar's aquatic ecosystems.",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    align: "left",
  },
  {
    id: "empowerment",
    eyebrow: "Chapter Six — Empowering Creators",
    title: "Independence and prosperity",
    line: "By eliminating middlemen, we ensure artisans earn over three times more income, transforming rural weavers into independent entrepreneurs.",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
    align: "right",
  },
  {
    id: "heritage",
    eyebrow: "Chapter Seven — Global Heritage",
    title: "Bihar’s greatest export story",
    line: "We are taking authentic Bihar handicraft—backed by a Geographical Indication (GI) Tag—from local wetlands to world shelves.",
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1600&q=80",
    align: "left",
  },
];

const N = CHAPTERS.length;
const BOUNDARIES = Array.from({ length: N + 1 }, (_, i) => i / N);

const ImageStoryStyles = () => (
  <style>{`
    .img-story, .img-story *, .img-story *::before, .img-story *::after { box-sizing: border-box; }
    .img-story { position: relative; background: #050505; }
    .img-story .is-track { position: relative; height: ${N * 100}vh; }
    .img-story .is-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; }

    .img-story .is-frame { position: absolute; inset: 0; opacity: 0; will-change: opacity, transform; }
    .img-story .is-frame img { width: 100%; height: 100%; object-fit: cover; display: block;
      filter: saturate(0.92) contrast(1.05) brightness(0.92); transform: scale(1); will-change: transform; }
    .img-story .is-scrim { position: absolute; inset: 0; z-index: 1; }
    .img-story .is-frame.align-left .is-scrim { background: linear-gradient(90deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.45) 42%, rgba(5,5,5,0.15) 68%, rgba(5,5,5,0.55) 100%); }
    .img-story .is-frame.align-right .is-scrim { background: linear-gradient(270deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.45) 42%, rgba(5,5,5,0.15) 68%, rgba(5,5,5,0.55) 100%); }
    .img-story .is-frame .is-scrim::after { content:''; position:absolute; inset:0;
      background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 22%, transparent 76%, rgba(0,0,0,0.5) 100%); }

    .img-story .is-copy { position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
      width: min(460px, 84vw); padding: 0 6%; opacity: 0; }
    .img-story .is-frame.align-left .is-copy { left: 0; text-align: left; }
    .img-story .is-frame.align-right .is-copy { right: 0; text-align: right; }
    .img-story .is-eyebrow { font-family: ${mono}; font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase;
      color: #C8A97A; margin-bottom: 1rem; }
    .img-story .is-title { font-family: ${serif}; font-weight: 300; font-size: clamp(1.7rem, 3.4vw, 2.7rem);
      color: #F5F1E7; line-height: 1.18; margin-bottom: 1.25rem; }
    .img-story .is-line { font-family: ${sans}; font-size: 1.1rem; line-height: 1.7; color: rgba(240,235,227,0.8); max-width: 52ch; font-weight: 300; }
    .img-story .is-frame.align-right .is-line { margin-left: auto; }

    .img-story .is-thread-track { position: absolute; right: 2.4rem; top: 12%; bottom: 12%; width: 1px;
      background: rgba(255,255,255,0.12); z-index: 3; }
    .img-story .is-thread-fill { position: absolute; left: 0; top: 0; width: 100%; height: 0%;
      background: linear-gradient(180deg, #C8A97A, #8FBD84); }
    .img-story .is-thread-bead { position: absolute; left: 50%; width: 8px; height: 8px; border-radius: 50%;
      background: #C8A97A; transform: translate(-50%, -50%); box-shadow: 0 0 10px rgba(200,169,122,0.85); top: 0%; }

    .img-story .is-counter { position: absolute; left: 6%; bottom: 6%; z-index: 3;
      font-family: ${mono}; font-size: 0.7rem; letter-spacing: 0.14em; color: rgba(255,255,255,0.45); }
    .img-story .is-counter b { color: #C8A97A; font-weight: 500; }

    @media (max-width: 768px) {
      .img-story .is-copy { top: auto; bottom: 8%; transform: none; text-align: left !important; left: 0 !important; right: 0 !important; padding: 0 7%; }
      .img-story .is-line { margin-left: 0 !important; }
      .img-story .is-thread-track { display: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .img-story .is-frame, .img-story .is-copy { transition: opacity 0.3s !important; }
      .img-story .is-frame img { transform: none !important; }
    }
  `}</style>
);

function ImageStory() {
  const trackRef = useRef(null);
  const frameRefs = useRef([]);
  const copyRefs = useRef([]);
  const threadFillRef = useRef(null);
  const threadBeadRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    function chapterAt(p) {
      let idx = N - 1;
      for (let i = 0; i < N; i++) {
        if (p >= BOUNDARIES[i] && p < BOUNDARIES[i + 1]) { idx = i; break; }
      }
      const segStart = BOUNDARIES[idx], segEnd = BOUNDARIES[idx + 1];
      const local = segEnd > segStart ? (p - segStart) / (segEnd - segStart) : 0;
      return { idx, local: Math.max(0, Math.min(1, local)) };
    }

    function update(p) {
      const { idx, local } = chapterAt(p);
      const crossfade = 0.22; // fraction of a chapter spent dissolving into the next photo

      frameRefs.current.forEach((el, i) => {
        if (!el) return;
        let op = 0;
        if (i === idx) {
          op = local < crossfade ? local / crossfade : 1;
        } else if (i === idx - 1) {
          op = local < crossfade ? 1 - local / crossfade : 0;
        }
        el.style.opacity = op;
        const img = el.querySelector("img");
        if (img) img.style.transform = `scale(${1 + 0.12 * local})`;
      });

      copyRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i !== idx) { el.style.opacity = 0; return; }
        const fadeZone = 0.16;
        let op = 1;
        if (local < fadeZone) op = local / fadeZone;
        else if (local > 1 - fadeZone) op = (1 - local) / fadeZone;
        el.style.opacity = Math.max(0, Math.min(1, op));
        el.style.transform = `translateY(${(-50 + (1 - op) * 4)}%)`;
      });

      if (threadFillRef.current) threadFillRef.current.style.height = `${p * 100}%`;
      if (threadBeadRef.current) threadBeadRef.current.style.top = `${p * 100}%`;
      if (counterRef.current) {
        counterRef.current.innerHTML = `<b>${String(idx + 1).padStart(2, "0")}</b> / ${String(N).padStart(2, "0")} — ${CHAPTERS[idx].id.toUpperCase()}`;
      }
    }

    const trigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.2,
      onUpdate: (self) => update(self.progress),
    });

    update(0);
    return () => trigger.kill();
  }, []);

  return (
    <div className="img-story">
      <ImageStoryStyles />
      <div className="is-track" ref={trackRef}>
        <div className="is-stage">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.id}
              className={`is-frame align-${c.align}`}
              ref={(el) => (frameRefs.current[i] = el)}
            >
              <Image width={800} height={800} src={c.img} alt={c.title} loading={i === 0 ? "eager" : "lazy"} />
              <div className="is-scrim" />
            </div>
          ))}

          {CHAPTERS.map((c, i) => (
            <div
              key={`${c.id}-copy`}
              className="is-copy"
              style={{ left: c.align === "left" ? 0 : "auto", right: c.align === "right" ? 0 : "auto" }}
              ref={(el) => (copyRefs.current[i] = el)}
            >
              <div className="is-eyebrow">{c.eyebrow}</div>
              <div className="is-title">{c.title}</div>
              <div className="is-line">{c.line}</div>
            </div>
          ))}

          <div className="is-thread-track">
            <div className="is-thread-fill" ref={threadFillRef} />
            <div className="is-thread-bead" ref={threadBeadRef} />
          </div>

          <div className="is-counter" ref={counterRef}>01 / {String(N).padStart(2, "0")} — {CHAPTERS[0].id.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

export default function BrandStoryPage() {
  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Image Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/brand_Story_hero.png"
            alt="Brand Story Hero"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-black/30 z-1" />
          {/* Just a slight fade at the very bottom to blend with the next section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#C8A97A] mb-6" style={{ fontFamily: mono }}>Our Heritage</h2>
          <h1 className="text-4xl md:text-7xl text-white font-light tracking-wide leading-tight mb-8" style={{ fontFamily: serif }}>
            Nature, <span className="italic">refined.</span>
          </h1>
          <p className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-light mb-12" style={{ fontFamily: sans }}>
            KrisluxECO bridges the gap between organic sustainability and uncompromising Eco-Luxury. Scroll down to watch our journey unfold.
          </p>
          <div className="w-[1px] h-24 bg-gradient-to-b from-[#C8A97A] to-transparent animate-pulse" />
        </div>
      </section>

      {/* GSAP Story Chapters */}
      <ImageStory />
    </div>
  );
}