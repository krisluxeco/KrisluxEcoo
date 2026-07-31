"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
  ─────────────────────────────────────────────────────────────────────────
  STORY TIMELINE — the film's captions, unpacked into full prose. This is
  where someone who wants to actually read the story (not just watch it
  scroll past) gets the whole thing, as a typed vertical timeline with a
  hand-drawn connecting line that draws itself in as you scroll.

  Each <TimelineRow> animates independently (own ScrollTrigger, own
  `once` reveal) rather than being scrubbed like the reel above it — this
  section is meant to be read, so entrances happen once and hold, instead
  of scrubbing back and forth with the scrollbar.
  ─────────────────────────────────────────────────────────────────────────
*/

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";
const mono = "'IBM Plex Mono', monospace";

const TIMELINE = [
  {
    year: "2023",
    mark: "The Problem",
    title: "A lake that was losing to a flower",
    text:
      "Three rivers and a lake around Begusarai, Bihar, were disappearing under water hyacinth — a plant that looks almost decorative until it isn't. It doubles its coverage in weeks, starves the water of oxygen, and pushes fish, boats, and livelihoods to the margins. By the time two students from IIT Patna started paying attention, close to 80% of the biomass in some stretches had already gone to waste, and roughly 190 women in the surrounding villages had no market for the weaving skill they already had.",
  },
  {
    year: "2023–24",
    mark: "The Discovery",
    title: "The weed nobody wanted turned out to be a fibre",
    text:
      "It began with a single stem, dried and split by hand in a hostel room. Under the right conditions, hyacinth fibre behaves like something between jute and cane — stronger than expected, softer than expected, and available in a quantity nobody was paying to remove. The question stopped being 'how do we clear this lake' and became 'what if the clearing paid for itself.'",
  },
  {
    year: "18 months",
    mark: "The Research",
    title: "Turning a weed into a repeatable process",
    text:
      "Eighteen months went into failed batches before there was a protocol worth teaching. Retting times, drying angles, dye absorption — each variable tested until the results were consistent enough to hand to someone else and get the same fibre back. That repeatability is what turned a curiosity into a supply chain.",
  },
  {
    year: "Ongoing",
    mark: "The Harvest",
    title: "A closed loop, powered by nothing but sun",
    text:
      "Harvest happens at peak biomass, by hand, by boat. The hyacinth is dried on bamboo racks over ten days, turned each morning, moisture dropping from roughly 92% to under 12%. No fossil fuels, no grid power — the same sun that let the weed take over the lake now does the processing for free.",
  },
  {
    year: "60 days",
    mark: "The Training",
    title: "190+ women, three blocks, one certified program",
    text:
      "Rather than centralize the work in one facility, the fibre travels to the artisans. Sixty-day certified training programs across three blocks taught the process to more than 190 women, with dried fibre delivered to their doorstep — turning a skill they already had into one with a buyer on the other end.",
  },
  {
    year: "Ongoing",
    mark: "The Weaving",
    title: "No two baskets leave the workshop identical",
    text:
      "Each artisan works her own pattern into the weave. What was once a craft passed informally between neighbours is now paid by the piece, with the loom room running from sunrise to last light. The variation between pieces isn't a flaw to standardize away — it's the signature of who made it.",
  },
  {
    year: "2025",
    mark: "The Trust",
    title: "A passport for every piece",
    text:
      "Every product carries traceable information back to its origin: harvest source, drying method, the artisan's name, and an estimated 142g of embedded carbon. The record is built to align with the EU's Corporate Sustainability Due Diligence Directive (CSDDD) and Carbon Border Adjustment Mechanism (CBAM) — the paperwork European buyers already need, done at the source.",
  },
  {
    year: "2025",
    mark: "The Reach",
    title: "From a stall in Delhi to inboxes in three cities",
    text:
      "The label's first real test was a stall at the EPCH Delhi Fair. From there, inbound interest reached Paris, Berlin, and Tokyo, with more than 320 B2B orders placed and fulfilled since. A plant that was actively degrading a lake in Bihar is now a line item on a boutique's shelf in Europe.",
  },
  {
    year: "Today",
    mark: "The Impact",
    title: "The numbers, plainly",
    text:
      "190+ artisans trained. Over 14 sq. km of river surface restored. 320+ B2B orders fulfilled. A 58% gross margin on finished goods. Three state and national recognitions, including recognition at DC Kunj under the Ministry of Textiles.",
  },
  {
    year: "What's next",
    mark: "The Vision",
    title: "It continues with you",
    text:
      "This is KrisluxECO — a material story that starts with an ecological problem and ends on a boutique shelf, with a fully traceable, artisan-made object in between. The film ends here. The supply chain doesn't.",
  },
];

function TimelineRow({ item, index }) {
  const rowRef = useRef(null);
  const dotRef = useRef(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const dot = dotRef.current;
    if (!row) return;

    gsap.set(row, { opacity: 0, y: 40 });
    gsap.set(dot, { scale: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top 78%",
        toggleActions: "play none none none",
      },
    });
    tl.to(dot, { scale: 1, duration: 0.4, ease: "back.out(2.5)" })
      .to(row, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.2");

    return () => {
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="tl-row" ref={rowRef}>
      <div className="tl-marker">
        <span className="tl-dot" ref={dotRef} />
        <span className="tl-year">{item.year}</span>
      </div>
      <div className="tl-content">
        <div className="tl-mark">{String(index + 1).padStart(2, "0")} — {item.mark}</div>
        <h3 className="tl-title">{item.title}</h3>
        <p className="tl-text">{item.text}</p>
      </div>
    </div>
  );
}

export default function StoryTimeline() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const line = lineRef.current;
    const section = sectionRef.current;
    if (!line || !section) return;

    gsap.set(line, { scaleY: 0, transformOrigin: "top" });
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      end: "bottom 80%",
      scrub: 0.3,
      onUpdate: (self) => {
        line.style.transform = `scaleY(${self.progress})`;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section className="story-timeline" ref={sectionRef}>
      <style>{`
        .story-timeline { position: relative; background: #0D0D0B; padding: 7rem 6% 8rem; z-index: 5; }
        .story-timeline .tl-head { text-align: center; max-width: 720px; margin: 0 auto 5.5rem; }
        .story-timeline .tl-eyebrow { font-family: ${sans}; font-size: 0.7rem; letter-spacing: 0.32em;
          text-transform: uppercase; color: #C8A97A; margin-bottom: 1rem; }
        .story-timeline .tl-headline { font-family: ${serif}; font-weight: 300; font-size: clamp(2rem, 4.4vw, 3.2rem);
          color: #F0EBE3; line-height: 1.15; }
        .story-timeline .tl-sub { margin-top: 1rem; color: rgba(240,235,227,0.55); font-size: 1rem; line-height: 1.7; }

        .story-timeline .tl-body { position: relative; max-width: 880px; margin: 0 auto; }
        .story-timeline .tl-spine { position: absolute; left: 5px; top: 6px; bottom: 6px; width: 1px;
          background: rgba(255,255,255,0.12); }
        .story-timeline .tl-spine-fill { position: absolute; left: 0; top: 0; width: 100%; height: 100%;
          background: linear-gradient(180deg, #C8A97A, #8FBD84); transform: scaleY(0); }

        .story-timeline .tl-row { position: relative; display: grid; grid-template-columns: 140px 1fr;
          gap: 2.2rem; padding-left: 0; margin-bottom: 4.2rem; }
        .story-timeline .tl-row:last-child { margin-bottom: 0; }
        .story-timeline .tl-marker { position: relative; padding-left: 2.4rem; }
        .story-timeline .tl-dot { position: absolute; left: -1px; top: 0.35rem; width: 12px; height: 12px;
          border-radius: 50%; background: #C8A97A; box-shadow: 0 0 0 4px rgba(200,169,122,0.15); }
        .story-timeline .tl-year { font-family: ${mono}; font-size: 0.72rem; letter-spacing: 0.08em;
          color: rgba(240,235,227,0.45); display: block; }
        .story-timeline .tl-mark { font-family: ${mono}; font-size: 0.7rem; letter-spacing: 0.14em;
          text-transform: uppercase; color: #8FBD84; margin-bottom: 0.6rem; }
        .story-timeline .tl-title { font-family: ${serif}; font-weight: 400; font-size: clamp(1.3rem, 2.4vw, 1.7rem);
          color: #F0EBE3; margin-bottom: 0.8rem; line-height: 1.3; }
        .story-timeline .tl-text { color: rgba(240,235,227,0.68); font-size: 0.98rem; line-height: 1.8; max-width: 60ch; }

        @media (max-width: 720px) {
          .story-timeline .tl-row { grid-template-columns: 1fr; gap: 0.6rem; }
          .story-timeline .tl-marker { padding-left: 2.4rem; display: flex; align-items: baseline; gap: 0.6rem; }
          .story-timeline .tl-spine { left: 5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .story-timeline .tl-row { opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div className="tl-head">
        <div className="tl-eyebrow">The full story</div>
        <h2 className="tl-headline">From a choked lake to a boutique shelf</h2>
        <p className="tl-sub">
          Everything the film just showed you, in ten chapters — how a weed became a fibre,
          a fibre became a livelihood, and a livelihood became a label.
        </p>
      </div>

      <div className="tl-body">
        <div className="tl-spine">
          <div className="tl-spine-fill" ref={lineRef} />
        </div>
        {TIMELINE.map((item, i) => (
          <TimelineRow key={item.mark} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}