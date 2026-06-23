"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ─── Shared Typography Helpers (consistent with Home) ──────────────────────────
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

function Eyebrow({ children, dark = false }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <span className={`h-px w-8 ${dark ? "bg-[#C8A97A]/40" : "bg-[#C8A97A]/60"}`} />
      <p
        className="text-xs tracking-[0.25em] uppercase text-[#C8A97A]"
        style={{ fontFamily: sans }}
      >
        {children}
      </p>
      <span className={`h-px w-8 ${dark ? "bg-[#C8A97A]/40" : "bg-[#C8A97A]/60"}`} />
    </div>
  );
}

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Floating Leaf Particle (reused from Home, lighter density) ───────────────
function Leaf({ style }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none text-[#4A6741]"
      style={style}
      animate={{
        y: ["0%", "-120vh"],
        rotate: [0, 360],
        x: [0, style.drift ?? 30, 0],
        opacity: [0, 0.14, 0.08, 0],
      }}
      transition={{
        duration: style.dur ?? 14,
        repeat: Infinity,
        delay: style.delay ?? 0,
        ease: "linear",
      }}
    >
      <svg width={style.size ?? 16} height={style.size ?? 16} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4 .83-.83 3-2.67 4-5-2.5 1-5.33 2.5-7 4.5C9 8 8.5 11 9 14c-1-1.5-1.5-4-1-6-2 2-3 6-3 8a8 8 0 0 0 8 8c4-2 5-9 4-16z" />
      </svg>
    </motion.div>
  );
}

const leaves = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  style: {
    left: `${(i * 12.5 + 4) % 100}%`,
    bottom: "-5%",
    size: 12 + (i % 4) * 4,
    dur: 12 + (i % 5) * 2,
    delay: i * 1.1,
    drift: -20 + (i % 4) * 18,
  },
}));

// ─── Timeline Data — the actual chronology, real sequence (markers earned) ────
const milestones = [
  {
    year: "2018",
    title: "A workshop, a question",
    text: "Founded in a single rented workshop outside Jaipur, with three artisan families and one question: could craft pay fairly and still travel the world?",
  },
  {
    year: "2019",
    title: "First reclaimed timber line",
    text: "Our kitchenware range launched, sourced entirely from reclaimed shipping pallets and demolition timber — no tree felled to make a single board.",
  },
  {
    year: "2021",
    title: "Artisan partner network formalised",
    text: "Pehchan-style ID and fair-wage contracts rolled out across our network, putting more than three times the standard middleman rate directly into artisans' hands.",
  },
  {
    year: "2023",
    title: "Zero-plastic packaging, fully realised",
    text: "Every shipment — D2C and B2B — moved to recycled kraft, plant-fibre void fill, and water-based inks. No exceptions, no plastic tape.",
  },
  {
    year: "2025",
    title: "200+ artisans, export-ready",
    text: "Our network crossed two hundred artisans, eighty percent women-led, with the quality systems and capacity to serve corporate gifting and export buyers at scale.",
  },
];

const values = [
  {
    icon: "✦",
    title: "Material honesty",
    text: "Every material is named and traceable — reclaimed wood, natural clay, plant fibre. Nothing is dressed up as something it isn't.",
  },
  {
    icon: "✦",
    title: "Fair before fast",
    text: "We set artisan pay before we set retail price. Speed to market never comes at the cost of who made the piece.",
  },
  {
    icon: "✦",
    title: "Built to outlast trend",
    text: "Pieces are designed for a decade of daily use, not a season of feed photos. Durability is a design constraint, not an afterthought.",
  },
  {
    icon: "✦",
    title: "Closed-loop by default",
    text: "Packaging, offcuts and returns are designed back into the system from day one — waste is a planning failure, not an inevitability.",
  },
];

// ─── Main About / Brand Story Page ─────────────────────────────────────────────
export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="bg-[#FAF7F2] text-[#1C1C1A] overflow-x-hidden" style={{ fontFamily: sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-center overflow-hidden bg-[#1C1C1A]">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-[0.34]"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1800)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-[#1C1C1A]/70 to-[#1C1C1A]/55" />
        </motion.div>

        <div className="absolute inset-0 z-[1]">
          {leaves.map((l) => (
            <Leaf key={l.id} style={{ ...l.style, opacity: 0.1 }} />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FBD84]" />
              Our Story
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="leading-[1.05] text-white mb-6"
              style={{ fontFamily: serif, fontSize: "clamp(2.6rem, 6vw, 4.6rem)" }}
            >
              <span className="block font-light">Made by hand,</span>
              <span className="block font-semibold">
                made to <span className="italic font-normal text-[#C8A97A]">matter</span>
              </span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
              className="h-[2px] w-14 bg-[#C8A97A] mb-8 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-white/75 text-base md:text-lg leading-relaxed"
            >
              KrisluxECO began as a question — could a craft tradition pay its
              makers fairly and still earn a place on the world's shelves? Every
              product since has been our answer.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ─── ORIGIN STORY ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <FadeUp>
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden shadow-[0_24px_70px_rgba(28,28,26,0.12)]">
              <Image
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200"
                alt="Artisan shaping clay by hand in a sunlit workshop"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/30 via-transparent to-transparent" />
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <Eyebrow>How We Began</Eyebrow>
            <h2
              className="text-[clamp(2rem,4vw,3rem)] leading-tight font-light text-[#1C1C1A] text-center md:text-left"
              style={{ fontFamily: serif }}
            >
              A workshop, three families,
              <br />
              <span className="italic text-[#4A6741] font-normal">and one stubborn idea</span>
            </h2>
            <div className="h-[2px] w-14 bg-[#C8A97A] mt-4 mb-6 mx-auto md:mx-0" />
            <p className="text-[#5C5650] leading-relaxed mb-4">
              KrisluxECO started in a single rented workshop with three artisan
              families and a refusal to accept the usual trade-off: that a maker's
              fair wage and a buyer's fair price couldn't both exist in the same
              supply chain.
            </p>
            <p className="text-[#5C5650] leading-relaxed">
              We removed the middle layers instead of the craftsmanship. What's
              left is a product that costs what it actually takes to make well —
              and pays the person who made it accordingly.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── TIMELINE — signature element: the stitched thread ───────────────── */}
      <section className="relative py-24 px-6 bg-[#F6F2EC]">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-16">
            <Eyebrow>Our Journey</Eyebrow>
            <h2
              className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#1C1C1A]"
              style={{ fontFamily: serif }}
            >
              Built <span className="italic text-[#4A6741]">stitch by stitch</span>
            </h2>
          </FadeUp>

          <div className="relative">
            {/* Stitched thread — dashed vertical rule, the page's signature motif */}
            <svg
              className="absolute left-[27px] top-2 bottom-2 hidden sm:block"
              width="2"
              height="100%"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                x1="1" y1="0" x2="1" y2="100%"
                stroke="#C8A97A"
                strokeWidth="2"
                strokeDasharray="6 7"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex flex-col gap-12">
              {milestones.map((m, i) => (
                <FadeUp key={m.year} delay={i * 0.08}>
                  <div className="relative flex gap-7 sm:pl-0">
                    <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-[#FAF7F2] border-2 border-[#4A6741] flex items-center justify-center">
                      <span
                        className="text-[#4A6741] text-xs font-semibold tracking-wide"
                        style={{ fontFamily: sans }}
                      >
                        {m.year}
                      </span>
                    </div>
                    <div className="pt-1.5">
                      <h3
                        className="text-xl font-medium text-[#1C1C1A] mb-1.5"
                        style={{ fontFamily: serif }}
                      >
                        {m.title}
                      </h3>
                      <p className="text-sm text-[#6B6560] leading-relaxed max-w-md">
                        {m.text}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CRAFT PHILOSOPHY ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#1C1C1A] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #4A6741 0%, transparent 70%)" }}
        />

        <div className="relative max-w-6xl mx-auto z-10">
          <FadeUp className="text-center mb-16">
            <Eyebrow dark>Our Craft</Eyebrow>
            <h2
              className="text-[clamp(2.2rem,4vw,3.6rem)] leading-tight"
              style={{ fontFamily: serif }}
            >
              <span className="font-light text-white">Three things we'll </span>
              <span className="italic font-normal text-[#8FBD84]">never compromise</span>
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "The material",
                text: "Reclaimed timber, natural clay, plant fibre. If it can't decompose or be reused, it doesn't enter our supply chain.",
              },
              {
                title: "The maker",
                text: "Every piece is traceable to the artisan who made it, and every artisan is paid before the piece ships — not after it sells.",
              },
              {
                title: "The finish",
                text: "No shortcuts on cure time, joinery, or glaze. A piece leaves the workshop only when it's ready, not when the order is due.",
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.1}>
                <div className="h-full rounded-[22px] border border-white/10 bg-white/[0.03] backdrop-blur-md p-7 hover:bg-white/[0.05] transition-colors duration-500">
                  <div className="w-10 h-10 rounded-full bg-[#4A6741]/20 flex items-center justify-center text-[#8FBD84] mb-5 text-sm">
                    ✦
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2" style={{ fontFamily: serif }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#B7B0A9] leading-relaxed">{item.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOUNDER NOTE ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="relative rounded-[32px] bg-white border border-[#E7E1DA] p-10 md:p-14 shadow-[0_20px_60px_rgba(28,28,26,0.06)]">
              <div
                className="absolute top-6 left-8 text-[120px] leading-none text-[#4A6741]/5 pointer-events-none select-none"
                style={{ fontFamily: serif }}
              >
                "
              </div>
              <div className="relative">
                <p
                  className="text-xl md:text-2xl text-[#1C1C1A] leading-relaxed italic font-light mb-8"
                  style={{ fontFamily: serif }}
                >
                  We never set out to be the biggest. We set out to be the
                  brand an artisan's daughter could point to and say,
                  "my mother's hands made that, and we were paid fairly for it."
                  Everything else — the design, the export markets, the
                  certifications — exists in service of that one sentence.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4A6741]/10 flex items-center justify-center text-[#4A6741] text-sm font-medium" style={{ fontFamily: serif }}>
                    KR
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1C1A]" style={{ fontFamily: sans }}>
                      Founder, KrisluxECO
                    </p>
                    <p className="text-xs text-[#9E9088]">Jaipur, India</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── VALUES GRID ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#F6F2EC]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <Eyebrow>What We Stand For</Eyebrow>
            <h2
              className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#1C1C1A]"
              style={{ fontFamily: serif }}
            >
              Values we <span className="italic text-[#4A6741]">build around</span>
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.08}>
                <div className="flex gap-5 h-full bg-white/70 backdrop-blur-sm border border-[#ECE6DF] rounded-[20px] p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-500">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4A6741]/10 flex items-center justify-center text-[#4A6741] text-sm">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1C1C1A] mb-1.5" style={{ fontFamily: serif }}>
                      {v.title}
                    </h3>
                    <p className="text-sm text-[#6B6560] leading-relaxed">{v.text}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMPACT STRIP ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 200, suffix: "+", label: "Artisan Partners" },
            { value: 8, suffix: "", label: "Years of Craft" },
            { value: 80, suffix: "%", label: "Women-Led" },
            { value: 0, suffix: "", label: "Plastic Used", display: "Zero" },
          ].map((stat, i) => (
            <FadeUp key={i} delay={i * 0.1} className="text-center">
              <div className="text-4xl md:text-5xl font-light text-[#4A6741] mb-2" style={{ fontFamily: serif }}>
                {stat.display ?? <CountUp target={stat.value} suffix={stat.suffix} />}
              </div>
              <p className="text-[#9E9088] tracking-widest uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.12em" }}>
                {stat.label}
              </p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 bg-[#4A6741] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <FadeUp className="relative max-w-3xl mx-auto text-center">
          <h2
            className="text-[clamp(2rem,4vw,3rem)] leading-tight text-white font-light mb-5"
            style={{ fontFamily: serif }}
          >
            Curious how it's <span className="italic text-[#E9D9B8]">made?</span>
          </h2>
          <p className="text-white/75 mb-9 max-w-xl mx-auto leading-relaxed">
            Explore the products our artisan partners make by hand, or get in
            touch about a bulk or B2B order.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-[#4A6741] px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-[#FAF7F2] transition-colors"
            >
              Explore Products
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-3.5 rounded-full text-sm tracking-wide hover:border-white hover:bg-white/10 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </FadeUp>
      </section>
    </main>
  );
}