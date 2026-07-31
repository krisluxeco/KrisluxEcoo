"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero Slideshow ────────────────────────────────────────────────────────────
const partnersSlides = [
  { url: "/images/sustainability_hero_2.png", caption: "Boutique Hospitality" },
  { url: "/images/HeroSection1.png", caption: "Global Luxury Resorts" },
];

function PartnersSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % partnersSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => setCurrent(i);

  return (
    <>
      <div className="absolute inset-0 z-0">
        {partnersSlides.map((slide, i) => (
          <motion.div
            key={slide.url}
            className="absolute inset-0 bg-cover bg-center mix-blend-multiply"
            style={{ backgroundImage: `url(${slide.url})` }}
            initial={false}
            animate={{
              opacity: i === current ? 0.8 : 0,
              scale: i === current ? 1.0 : 1.07,
            }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: 7, ease: "easeOut" },
            }}
          />
        ))}
        {/* Dark gradient overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1A]/80 via-[#1C1C1A]/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/80 via-transparent to-transparent z-10 pointer-events-none" />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {partnersSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${i === current
                ? "w-6 h-2 bg-[#C8A97A]"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={current}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-10 right-8 z-20 text-[10px] tracking-[0.22em] uppercase text-white/70 hidden md:block"
          style={{ fontFamily: sans }}
        >
          {partnersSlides[current].caption}
        </motion.p>
      </AnimatePresence>
    </>
  );
}

export default function PartnersPage() {
  const containerRef = useRef(null);
  
  const { scrollYProgress: heroProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const partners = [
    {
      name: "The Oberoi Group",
      type: "Luxury Hospitality",
      desc: "Curated eco-friendly room amenities and spa textiles across their premier Indian properties.",
    },
    {
      name: "Six Senses Hotels",
      type: "Wellness Resorts",
      desc: "Custom zero-plastic toiletry kits and organic cotton robes designed exclusively for holistic retreats.",
    },
    {
      name: "Leela Palaces",
      type: "Heritage Hotels",
      desc: "Bespoke gifting hampers and traditional brass homeware for their VIP guest experiences.",
    },
    {
      name: "Sabyasachi Boutiques",
      type: "Retail Partner",
      desc: "Providing sustainable, artisan-crafted display trays and packaging for high-end jewelry lines.",
    },
    {
      name: "Taj Hotels",
      type: "Hospitality Group",
      desc: "Supplying bulk organic linens and handcrafted bathroom accessories for sustainable suites.",
    },
    {
      name: "Reliance Corporate",
      type: "Corporate Gifting",
      desc: "Annual festive hampers featuring fair-trade certified home decor and premium wellness sets.",
    }
  ];

  return (
    <main ref={containerRef} className="bg-[#FAF7F2] text-[#1C1C1A] min-h-screen overflow-x-hidden" style={{ fontFamily: sans }}>
      
      {/* ─── HERO WITH SLIDESHOW BACKGROUND ─────────────────────────────────── */}
      <section className="relative w-full h-[110vh] flex flex-col justify-end overflow-hidden pb-32 border-b border-[#1C1C1A]/5">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <PartnersSlideshow />
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full md:flex md:items-end justify-between">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FBD84] animate-pulse" />
              Our Stockists & Clients
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-[clamp(3.5rem,8vw,7.5rem)] font-[300] leading-[0.9] mb-8 text-white"
              style={{ fontFamily: serif }}
            >
              Trusted by <br/> <span className="italic text-white/80">Visionaries</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <p className="text-white/80 text-sm md:text-base max-w-lg font-light leading-loose">
                From world-renowned luxury hotels to exclusive boutiques, KrisluxECO is the chosen partner for brands that refuse to compromise on quality or sustainability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PARTNERS GRID ──────────────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-[5vw] max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {partners.map((partner, i) => (
            <FadeUp key={partner.name} delay={i * 0.1} className="flex flex-col group">
              <div className="border-t border-[#1C1C1A]/10 pt-8 mt-auto">
                <span className="block text-[9px] uppercase tracking-[0.4em] text-[#C8A97A] mb-4">
                  {partner.type}
                </span>
                <h3 className="text-3xl font-[300] mb-4 text-[#1C1C1A] group-hover:text-[#C8A97A] transition-colors duration-500" style={{ fontFamily: serif }}>
                  {partner.name}
                </h3>
                <p className="text-[13px] text-[#1C1C1A]/60 font-light leading-relaxed">
                  {partner.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-40 px-6 border-t border-[#1C1C1A]/5 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl md:text-5xl font-[300] mb-8" style={{ fontFamily: serif }}>
              Join Our <span className="italic text-[#1C1C1A]/60">Network</span>
            </h2>
            <p className="text-[13px] text-[#1C1C1A]/50 font-light leading-relaxed mb-12 max-w-md mx-auto">
              Looking to stock KrisluxECO in your boutique or source sustainable amenities for your properties?
            </p>
            <a href="/user/bulk-order" className="relative group inline-block text-[11px] tracking-[0.3em] uppercase font-medium pb-2 text-[#1C1C1A]">
              <span className="relative z-10">Request a Bulk Quote</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1C1C1A]/20" />
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C8A97A] transition-all duration-700 ease-out group-hover:w-full" />
            </a>
          </FadeUp>
        </div>
      </section>

    </main>
  );
}
