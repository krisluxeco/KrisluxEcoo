import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Recycle,
  Leaf,
  ShieldCheck,
  Globe2,
  Sprout,
  Users,
  ShieldAlert,
  CircleSlash,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content                                                           */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    id: "01",
    title: "Circular Economy",
    desc: "Designing out waste and keeping materials in continuous use, honoring the lifecycle of every resource.",
    Icon: Recycle,
  },
  {
    id: "02",
    title: "Sustainability",
    desc: "Fulfilling our present needs without compromising the ability of future generations to meet theirs.",
    Icon: Leaf,
  },
  {
    id: "03",
    title: "ESG Model",
    desc: "Placing Environmental, Social, and Governance criteria at the absolute core of our operations.",
    Icon: ShieldCheck,
  },
  {
    id: "04",
    title: "Align: UN & EU Vision",
    desc: "Meeting strict global standards and anticipating future legislative requirements for a better tomorrow.",
    Icon: Globe2,
  },
  {
    id: "05",
    title: "Eco-Sustainable",
    desc: "Harmonizing robust economic growth with long-term, measurable ecological health.",
    Icon: Sprout,
  },
  {
    id: "06",
    title: "Rural Empowerment",
    desc: "Uplifting local artisan communities through fair trade, direct training, and sustained employment.",
    Icon: Users,
  },
  {
    id: "07",
    title: "Solving Env Threat 1",
    desc: "Actively tackling the most pressing ecological issues in our supply regions.",
    Icon: ShieldAlert,
  },
  {
    id: "08",
    title: "ZERO Waste",
    desc: "Ensuring nothing goes to a landfill, closing the loop from raw material to final packaging.",
    Icon: CircleSlash,
  },
];

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll hook                                              */
/* ------------------------------------------------------------------ */

function useReveal(threshold = 0.3) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ------------------------------------------------------------------ */
/*  Faceted node marker                                                */
/* ------------------------------------------------------------------ */

function NodeMarker({ visible, Icon }) {
  return (
    <div className={`ethx-node ${visible ? "is-visible" : ""}`}>
      <span className="ethx-node-halo" />
      <svg viewBox="0 0 64 64" className="ethx-node-gem" aria-hidden="true">
        <defs>
          <linearGradient id="gemFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a1712" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          <linearGradient id="gemStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f1d9a8" />
            <stop offset="55%" stopColor="#c8a97a" />
            <stop offset="100%" stopColor="#8a6f47" />
          </linearGradient>
        </defs>
        <polygon
          points="32,3 61,32 32,61 3,32"
          fill="url(#gemFill)"
          stroke="url(#gemStroke)"
          strokeWidth="1.4"
          className="ethx-node-poly"
        />
      </svg>
      <Icon className="ethx-node-icon" size={16} strokeWidth={1.6} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Connector — draws itself from spine to card                       */
/* ------------------------------------------------------------------ */

function Connector({ side, visible }) {
  // side: "left" card sits left of spine, line travels leftward, and vice versa
  const flip = side === "left";
  return (
    <svg
      className={`ethx-connector ethx-connector--${side} ${visible ? "is-visible" : ""}`}
      viewBox="0 0 100 2"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line
        x1={flip ? 100 : 0}
        y1="1"
        x2={flip ? 0 : 100}
        y2="1"
        pathLength="1"
        className="ethx-connector-line"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  One timeline row                                                   */
/* ------------------------------------------------------------------ */

function TimelineRow({ item, index }) {
  const isEven = index % 2 === 0;
  const side = isEven ? "left" : "right";
  const [ref, visible] = useReveal(0.35);
  const Icon = item.Icon;

  return (
    <div ref={ref} className="ethx-row">
      {/* ---- Desktop ---- */}
      <div className={`ethx-row-desktop ethx-row-desktop--${side}`}>
        <div className="ethx-card-slot">
          <Connector side={side} visible={visible} />
          <article className={`ethx-card ${visible ? "is-visible" : ""}`}>
            <span className="ethx-card-numeral">{item.id}</span>
            <span className="ethx-eyebrow">Phase {item.id}</span>
            <h3 className="ethx-title">{item.title}</h3>
            <p className="ethx-desc">{item.desc}</p>
          </article>
        </div>
        <div className="ethx-spacer" />
      </div>

      {/* ---- Mobile ---- */}
      <div className="ethx-row-mobile">
        <article className={`ethx-card ethx-card--mobile ${visible ? "is-visible" : ""}`}>
          <span className="ethx-card-numeral">{item.id}</span>
          <span className="ethx-eyebrow">Phase {item.id}</span>
          <h3 className="ethx-title">{item.title}</h3>
          <p className="ethx-desc">{item.desc}</p>
        </article>
      </div>

      {/* ---- Node (shared) ---- */}
      <div className="ethx-node-slot">
        <NodeMarker visible={visible} Icon={Icon} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

export default function EthicsTimeline() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const start = vh * 0.62;
    const total = rect.height - vh * 0.25;
    const passed = start - rect.top;
    const p = total > 0 ? passed / total : 0;
    setProgress(Math.min(1, Math.max(0, p)));
  }, []);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [updateProgress]);

  return (
    <section ref={sectionRef} className="ethx-section">
      <style>{CSS}</style>

      {/* ambient light + grain */}
      <div className="ethx-ambient" />
      <div className="ethx-grain" />

      {/* header */}
      <header className="ethx-header">
        <div className="ethx-header-rule" />
        <p className="ethx-header-eyebrow">The Journey</p>
        <h2 className="ethx-header-title">Our Core Ethics</h2>
        <p className="ethx-header-sub">
          A continuous thread connecting every decision we make towards a truly sustainable,
          closed-loop system.
        </p>
      </header>

      {/* timeline */}
      <div className="ethx-timeline">
        <div className="ethx-spine" />
        <div className="ethx-thread-track">
          <div className="ethx-thread-fill" style={{ height: `${progress * 100}%` }} />
          <div className="ethx-comet" style={{ top: `${progress * 100}%` }} />
        </div>

        <div className="ethx-rows">
          {PILLARS.map((item, idx) => (
            <TimelineRow key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
  .ethx-section {
    position: relative;
    background: #0a0a0a;
    border-top: 1px solid rgba(245,243,238,0.06);
    border-bottom: 1px solid rgba(245,243,238,0.06);
    padding: 7rem 1.5rem;
    overflow: hidden;
    font-family: 'SFMono-Regular', ui-monospace, 'IBM Plex Mono', Menlo, monospace;
  }

  .ethx-ambient {
    position: absolute;
    top: 0; left: 50%;
    width: 900px; height: 900px;
    transform: translate(-50%, -35%);
    background: radial-gradient(circle at center, rgba(200,169,122,0.08) 0%, rgba(200,169,122,0) 68%);
    pointer-events: none;
  }

  .ethx-grain {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    pointer-events: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }

  .ethx-header {
    position: relative;
    z-index: 2;
    max-width: 640px;
    margin: 0 auto 6rem;
    text-align: center;
    padding: 0 1rem;
  }
  .ethx-header-rule {
    width: 1px; height: 56px;
    background: linear-gradient(to bottom, rgba(200,169,122,0), rgba(200,169,122,0.7));
    margin: 0 auto 2rem;
  }
  .ethx-header-eyebrow {
    color: #c8a97a;
    font-size: 10px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    font-weight: 600;
    margin: 0 0 1.25rem;
  }
  .ethx-header-title {
    font-family: Georgia, 'Iowan Old Style', 'Palatino Linotype', serif;
    font-weight: 400;
    font-size: clamp(2.1rem, 5vw, 3.4rem);
    color: #f5f3ee;
    margin: 0 0 1.25rem;
    letter-spacing: 0.01em;
  }
  .ethx-header-sub {
    color: rgba(245,243,238,0.5);
    font-size: 0.95rem;
    line-height: 1.7;
    font-weight: 300;
    max-width: 460px;
    margin: 0 auto;
  }

  .ethx-timeline {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
  }

  .ethx-spine {
    position: absolute;
    top: 0; bottom: 0;
    left: 24px;
    width: 1px;
    background: rgba(245,243,238,0.08);
    transform: translateX(-50%);
  }
  .ethx-thread-track {
    position: absolute;
    top: 0; bottom: 0;
    left: 24px;
    width: 1px;
    transform: translateX(-50%);
    z-index: 1;
  }
  .ethx-thread-fill {
    position: absolute;
    top: 0; left: 0; width: 100%;
    background: linear-gradient(to bottom, #f1d9a8, #c8a97a 70%, rgba(200,169,122,0));
    box-shadow: 0 0 12px rgba(200,169,122,0.55);
    transition: height 0.05s linear;
  }
  .ethx-comet {
    position: absolute;
    left: 50%;
    width: 9px; height: 9px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, #fff4dd 0%, #e8cfa0 45%, rgba(232,207,160,0) 75%);
    box-shadow: 0 0 16px 4px rgba(232,207,160,0.7);
  }

  @media (min-width: 768px) {
    .ethx-spine, .ethx-thread-track { left: 50%; }
  }

  .ethx-rows {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
  }

  .ethx-row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 220px;
  }

  /* ---- desktop layout ---- */
  .ethx-row-desktop { display: none; width: 100%; align-items: center; }
  @media (min-width: 768px) {
    .ethx-row-desktop { display: flex; }
    .ethx-row-mobile { display: none; }
  }
  .ethx-row-desktop--left { flex-direction: row-reverse; }
  .ethx-row-desktop--right { flex-direction: row; }

  .ethx-card-slot {
    position: relative;
    width: 50%;
    display: flex;
    align-items: center;
  }
  .ethx-row-desktop--left .ethx-card-slot { justify-content: flex-end; padding-right: 4.5rem; }
  .ethx-row-desktop--right .ethx-card-slot { justify-content: flex-start; padding-left: 4.5rem; }
  .ethx-spacer { width: 50%; }

  .ethx-connector {
    position: absolute;
    top: 50%;
    width: 4.5rem;
    height: 6px;
    transform: translateY(-50%);
    overflow: visible;
  }
  .ethx-row-desktop--left .ethx-connector { right: 0; }
  .ethx-row-desktop--right .ethx-connector { left: 0; }
  .ethx-connector-line {
    stroke: #c8a97a;
    stroke-width: 1.5;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    opacity: 0;
    transition: stroke-dashoffset 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s,
                opacity 0.3s ease 0.15s;
    filter: drop-shadow(0 0 3px rgba(200,169,122,0.6));
  }
  .ethx-connector.is-visible .ethx-connector-line {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  /* ---- card ---- */
  .ethx-card {
    position: relative;
    max-width: 380px;
    padding: 2rem 2.1rem;
    border: 1px solid rgba(245,243,238,0.08);
    border-radius: 2px;
    background: linear-gradient(160deg, rgba(245,243,238,0.035), rgba(245,243,238,0.008));
    backdrop-filter: blur(6px);
    opacity: 0;
    transform: translateX(var(--ethx-shift, 34px)) scale(0.97);
    filter: blur(6px);
    transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1),
                transform 0.85s cubic-bezier(0.16,1,0.3,1),
                filter 0.85s cubic-bezier(0.16,1,0.3,1),
                border-color 0.4s ease;
  }
  .ethx-row-desktop--left .ethx-card { --ethx-shift: 34px; text-align: right; margin-left: auto; }
  .ethx-row-desktop--right .ethx-card { --ethx-shift: -34px; text-align: left; }
  .ethx-card.is-visible {
    opacity: 1;
    transform: translateX(0) scale(1);
    filter: blur(0);
  }
  .ethx-card:hover {
    border-color: rgba(200,169,122,0.4);
  }
  .ethx-card::before {
    content: "";
    position: absolute;
    top: 0; width: 22px; height: 1px;
    background: linear-gradient(to right, rgba(200,169,122,0.8), rgba(200,169,122,0));
  }
  .ethx-row-desktop--left .ethx-card::before { right: 0; background: linear-gradient(to left, rgba(200,169,122,0.8), rgba(200,169,122,0)); }
  .ethx-row-desktop--right .ethx-card::before { left: 0; }

  .ethx-card-numeral {
    position: absolute;
    top: -0.6rem;
    font-family: Georgia, serif;
    font-size: 4.6rem;
    font-weight: 400;
    color: rgba(245,243,238,0.045);
    line-height: 1;
    pointer-events: none;
    z-index: 0;
  }
  .ethx-row-desktop--left .ethx-card-numeral { right: 0.5rem; }
  .ethx-row-desktop--right .ethx-card-numeral { left: 0.5rem; }

  .ethx-eyebrow {
    position: relative;
    display: block;
    color: #c8a97a;
    font-size: 0.72rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    margin-bottom: 0.9rem;
  }
  .ethx-title {
    position: relative;
    font-family: Georgia, 'Iowan Old Style', 'Palatino Linotype', serif;
    font-weight: 400;
    font-size: 1.65rem;
    color: #f5f3ee;
    margin: 0 0 0.85rem;
    letter-spacing: 0.01em;
  }
  .ethx-desc {
    position: relative;
    color: rgba(245,243,238,0.5);
    font-size: 0.86rem;
    line-height: 1.75;
    font-weight: 300;
    margin: 0;
  }

  /* ---- mobile ---- */
  .ethx-row-mobile { width: 100%; padding: 1.5rem 0 1.5rem 3.5rem; }
  .ethx-card--mobile {
    max-width: 460px;
    transform: translateX(24px);
    --ethx-shift: 24px;
    text-align: left;
  }
  .ethx-card--mobile .ethx-card-numeral { left: 0.5rem; }
  .ethx-card--mobile::before { left: 0; }

  /* ---- node ---- */
  .ethx-node-slot {
    position: absolute;
    left: 24px;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
  }
  @media (min-width: 768px) {
    .ethx-node-slot { left: 50%; }
  }

  .ethx-node {
    position: relative;
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    transform: scale(0) rotate(-35deg);
    opacity: 0;
    transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1),
                opacity 0.4s ease;
  }
  .ethx-node.is-visible {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  .ethx-node-halo {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,169,122,0.28), rgba(200,169,122,0) 70%);
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s;
  }
  .ethx-node.is-visible .ethx-node-halo {
    opacity: 1;
    transform: scale(1.6);
    animation: ethxPulse 2.6s ease-in-out 0.8s infinite;
  }
  .ethx-node-gem { width: 100%; height: 100%; }
  .ethx-node-icon {
    position: absolute;
    color: #e8cfa0;
  }

  @keyframes ethxPulse {
    0%, 100% { opacity: 0.55; transform: scale(1.5); }
    50% { opacity: 1; transform: scale(1.85); }
  }

  @media (prefers-reduced-motion: reduce) {
    .ethx-card, .ethx-node, .ethx-node-halo, .ethx-connector-line, .ethx-thread-fill, .ethx-comet {
      transition: none !important;
      animation: none !important;
    }
    .ethx-card { opacity: 1; transform: none; filter: none; }
    .ethx-node { opacity: 1; transform: none; }
    .ethx-connector-line { opacity: 1; stroke-dashoffset: 0; }
  }
`;