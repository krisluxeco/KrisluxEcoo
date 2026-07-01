"use client";

import { useRef, useEffect } from "react";
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
    id: "origin",
    eyebrow: "Chapter One — The Lake",
    title: "A wetland, disappearing under a flower",
    line: "Three rivers and a lake in Begusarai, Bihar — choking under a plant that looked almost decorative.",
    img: "https://loremflickr.com/1600/2000/wetland,lake,india?lock=101",
    align: "left",
  },
  {
    id: "discovery",
    eyebrow: "Chapter Two — The Stem",
    title: "Split by hand, in a hostel room",
    line: "A fibre stronger than jute, softer than cane — hiding inside the weed nobody wanted.",
    img: "https://loremflickr.com/1600/2000/plant,fiber,hands?lock=102",
    align: "right",
  },
  {
    id: "research",
    eyebrow: "Chapter Three — The Protocol",
    title: "Eighteen months of failed batches",
    line: "Retting times, drying angles, dye absorption — tested until the process could be taught, not just performed.",
    img: "https://loremflickr.com/1600/2000/laboratory,notebook,research?lock=103",
    align: "left",
  },
  {
    id: "harvest",
    eyebrow: "Chapter Four — The Harvest",
    title: "By hand, by boat, at peak biomass",
    line: "A closed loop with zero fossil fuel and zero grid power — nature was already doing the work.",
    img: "https://loremflickr.com/1600/2000/boat,harvest,river?lock=104",
    align: "right",
  },
  {
    id: "drying",
    eyebrow: "Chapter Five — The Sun",
    title: "Ten days on bamboo racks",
    line: "Moisture falls from 92% to under 12%. The fibre curls, toughens, remembers its shape.",
    img: "https://loremflickr.com/1600/2000/bamboo,drying,sun?lock=105",
    align: "left",
  },
  {
    id: "training",
    eyebrow: "Chapter Six — The Hands",
    title: "190+ women, three blocks, sixty days",
    line: "A skill they already had, finally given a market — fibre delivered to their doorstep.",
    img: "https://loremflickr.com/1600/2000/women,craft,workshop?lock=106",
    align: "right",
  },
  {
    id: "weaving",
    eyebrow: "Chapter Seven — The Loom",
    title: "No two baskets leave identical",
    line: "Each artisan chooses her own pattern. The loom room hums from sunrise to last light.",
    img: "https://loremflickr.com/1600/2000/basket,weaving,craft?lock=107",
    align: "left",
  },
  {
    id: "trust",
    eyebrow: "Chapter Eight — The Passport",
    title: "142 grams of carbon, traced",
    line: "Harvest source, drying method, artisan's name — compliant with EU CSDDD & CBAM before it ever ships.",
    img: "https://loremflickr.com/1600/2000/handwoven,basket,product?lock=108",
    align: "right",
  },
  {
    id: "reach",
    eyebrow: "Chapter Nine — The Fair",
    title: "From a stall at EPCH Delhi",
    line: "320+ B2B orders later, a river weed is a line item on a boutique's shelf in Paris and Tokyo.",
    img: "https://loremflickr.com/1600/2000/market,export,crates?lock=109",
    align: "left",
  },
  {
    id: "vision",
    eyebrow: "Chapter Ten — The Shelf",
    title: "This is KrisluxECO",
    line: "The film doesn't end here. It continues with every order placed.",
    img: "https://loremflickr.com/1600/2000/boutique,shop,display?lock=110",
    align: "right",
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
      color: #F5F1E7; line-height: 1.18; margin-bottom: 1rem; }
    .img-story .is-line { font-family: ${sans}; font-size: 1rem; line-height: 1.7; color: rgba(240,235,227,0.72); max-width: 46ch; }
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

export default function ImageStory() {
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
              <img src={c.img} alt={c.title} loading={i === 0 ? "eager" : "lazy"} />
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