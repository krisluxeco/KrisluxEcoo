"use client";
import Image from "next/image";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import EthicsTimeline from "@/components/EthicsTimeline";

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
const sustainabilitySlides = [
  { url: "/images/BrandStory4.png", caption: "Preserving Nature" },
  { url: "/images/HeroSection2.png", caption: "Deep Roots" },
  { url: "/images/artisan_empowerment.png", caption: "Sustainable Growth" },
];

function SustainabilitySlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % sustainabilitySlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => setCurrent(i);

  return (
    <>
      <div className="absolute inset-0 z-0">
        {sustainabilitySlides.map((slide, i) => (
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
        {/* Gradient overlays for text legibility (dark) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1A]/80 via-[#1C1C1A]/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/80 via-transparent to-transparent z-10 pointer-events-none" />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {sustainabilitySlides.map((_, i) => (
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
          {sustainabilitySlides[current].caption}
        </motion.p>
      </AnimatePresence>
    </>
  );
}

export default function SustainabilityPage() {
  const containerRef = useRef(null);
  
  const { scrollYProgress: heroProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const pillars = [
    {
      title: "Ethical Sourcing",
      desc: "Every material we use is traced back to its origin. We work exclusively with certified fair-trade cooperatives across 14 Indian states, ensuring that the hands that craft our products are compensated fairly and work in safe conditions.",
      img: "/images/loginimg.png",
    },
    {
      title: "Zero Plastics",
      desc: "From our supply chain to your doorstep, we have eliminated single-use plastics. Our packaging utilizes biodegradable cornstarch, recycled paper, and reusable fabric totes to ensure our environmental footprint remains as light as possible.",
      img: "/images/signup.png",
    },
    {
      title: "Artisan Empowerment",
      desc: "True sustainability includes sustaining communities. We partner with over 200 artisans, preserving centuries-old weaving, carving, and pottery techniques that might otherwise be lost to mass manufacturing.",
      img: "/images/artisan_empowerment.png",
    }
  ];

  return (
    <main ref={containerRef} className="bg-[#FAF7F2] text-[#1C1C1A] min-h-screen overflow-x-hidden" style={{ fontFamily: sans }}>
      
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[110vh] flex flex-col justify-end overflow-hidden pb-32">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <SustainabilitySlideshow />
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
              Our Commitment
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-[clamp(3.5rem,8vw,7rem)] font-[300] leading-[0.9] mb-8 text-white"
              style={{ fontFamily: serif }}
            >
              Sustaining <br/> <span className="italic text-white/80">The Earth</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <p className="text-white/80 text-sm max-w-md font-light leading-loose">
                Eco-Luxury shouldn't cost the earth. Discover how we are redefining premium amenities through ethical sourcing, artisan empowerment, and zero-plastic initiatives.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PILLARS (Museum Framed Grids) ────────────────────────────── */}
      <section className="py-32 px-6 md:px-[5vw] max-w-[1600px] mx-auto space-y-40">
        {pillars.map((pillar, idx) => (
          <div key={pillar.title} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32`}>
            
            {/* Image (Museum Framed) */}
            <div className="w-full lg:w-1/2">
              <FadeUp className="bg-white p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF7F2]">
                  <Image width={800} height={800} 
                    src={pillar.img} 
                    alt={pillar.title}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-[3s] hover:scale-105"
                  />
                </div>
              </FadeUp>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
              <FadeUp delay={0.1}>
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#C8A97A] mb-6 block">0{idx + 1}</span>
                <h2 className="text-4xl md:text-5xl font-[300] mb-8" style={{ fontFamily: serif }}>
                  {pillar.title}
                </h2>
                <p className="text-[#1C1C1A]/60 text-sm md:text-base font-light leading-loose max-w-md mx-auto lg:mx-0">
                  {pillar.desc}
                </p>
              </FadeUp>
            </div>

          </div>
        ))}
      </section>

      {/* ─── BUSINESS MODULE & ETHICS (Ultra-Premium Corporate Grid) ─────── */}
      <EthicsTimeline />

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-40 px-6 border-t border-[#1C1C1A]/5 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl md:text-5xl font-[300] mb-8" style={{ fontFamily: serif }}>
              Experience <span className="italic text-[#1C1C1A]/60">Eco-Luxury</span>
            </h2>
            <Link href="/user/products" className="relative group inline-block text-[11px] tracking-[0.3em] uppercase font-medium pb-2 text-[#1C1C1A] mt-8">
              <span className="relative z-10">Explore The Collection</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1C1C1A]/20" />
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C8A97A] transition-all duration-700 ease-out group-hover:w-full" />
            </Link>
          </FadeUp>
        </div>
      </section>

    </main>
  );
}
