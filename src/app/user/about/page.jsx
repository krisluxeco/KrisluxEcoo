"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TeamSection from "@/components/TeamSection";
import { motion } from "framer-motion";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

function Eyebrow({ children, dark = false }) {
  return (
    <div className="flex items-center justify-start gap-3 mb-6">
      <span className={`h-px w-8 ${dark ? "bg-[#C8A97A]" : "bg-[#C8A97A]/60"}`} />
      <p
        className={`text-xs tracking-[0.25em] uppercase ${dark ? "text-[#C8A97A]" : "text-[#C8A97A]"}`}
        style={{ fontFamily: sans }}
      >
        {children}
      </p>
    </div>
  );
}

const products = [
  { name: "Home & Storage", tags: "Baskets, Trays, Organizers, Lampshades", desc: "Designed for eco-conscious home decor and functional living.", img: "/images/home_storage.png" },
  { name: "Fashion & Bags", tags: "Handbags, Clutches, Wallets, Totes", desc: "Ergonomic, durable, and styled for the sustainable fashion market.", img: "/images/fashion_bags.png" },
  { name: "Furniture & Décor", tags: "Stools, Mirror Frames, Wall Art", desc: "Premium statement pieces built for luxury interiors and hotel chains.", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80" },
  { name: "Corporate Gifting", tags: "Branded Hampers, Coasters, Stationery", desc: "High-impact, zero-waste gifting solutions aligned with ESG goals.", img: "/images/corporate_gifting.png" }
];

const sdgs = [
  { num: "SDG 1", code: "No Poverty", impact: "Tripling artisan household incomes compared to traditional middleman systems." },
  { num: "SDG 5", code: "Gender Equality", impact: "Formally employing and empowering an 80% female workforce." },
  { num: "SDG 8", code: "Decent Work & Economic Growth", impact: "Providing formal wages and official Pehchan identification." },
  { num: "SDG 12", code: "Responsible Production", impact: "Ensuring a 100% biodegradable, zero-waste manufacturing cycle." },
  { num: "SDG 13", code: "Climate Action", impact: "Removing rotting, methane-emitting water hyacinth from waterways." },
  { num: "SDG 14", code: "Life Below Water", impact: "Actively restoring natural freshwater biodiversity in Bihar's wetlands." },
  { num: "SDG 17", code: "Partnerships for the Goals", impact: "Working closely with the Bihar Government, UMSAS, Bihar Khadi Mall, and international export pipelines." }
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let ctx = gsap.context(() => {
      // Horizontal Scroll Section (What We Make)
      const hSections = gsap.utils.toArray(".h-card");
      if (hSections.length > 0) {
        gsap.to(hSections, {
          xPercent: -100 * (hSections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: ".h-scroll-container",
            pin: true,
            scrub: 1,
            end: () => "+=" + document.querySelector(".h-scroll-container").offsetWidth
          }
        });
      }

      // SDG Grid Reveal
      gsap.utils.toArray(".sdg-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, scale: 0.9 }, {
          opacity: 1, scale: 1, duration: 0.8,
          delay: (i % 4) * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%"
          }
        });
      });

      // Vision Reveal
      gsap.fromTo(".vision-text",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.5, ease: "power3.out",
          scrollTrigger: {
            trigger: ".vision-container",
            start: "top 75%"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleVideoPlay = () => {
    if (!iframeRef.current) return;
    const command = isPlaying ? "pauseVideo" : "playVideo";
    iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${command}","args":""}`, "*");
    setIsPlaying(!isPlaying);
  };

  return (
    <main ref={containerRef} className="bg-[#FAF7F2] text-[#1C1C1A] overflow-x-hidden">
      
      {/* 1. Cinematic Video Hero */}
      <section className="relative w-full h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-[#1C1C1A]">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-80">
            <iframe
              ref={iframeRef}
              className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] md:w-[150vw] md:h-[150vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
              src={`https://www.youtube.com/embed/99RGtZgPe1w?enablejsapi=1&controls=0&modestbranding=1&rel=0&autoplay=0&mute=0`}
              allow="autoplay; encrypted-media"
              frameBorder="0"
            ></iframe>
          </div>
          
          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-[#1C1C1A]/40 to-[#1C1C1A]/10 pointer-events-none" />
          
          <div className="absolute inset-0 flex flex-col justify-end pb-24 px-6 md:px-16 md:pb-32 max-w-7xl mx-auto w-full z-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            >
              <Eyebrow dark>About KrisluxECO</Eyebrow>
              <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-light leading-[0.95] mb-4 text-white" style={{ fontFamily: serif }}>
                The Story of KrisluxECO
              </h1>
              <p className="text-white/80 text-xl md:text-2xl font-light italic max-w-2xl" style={{ fontFamily: serif }}>
                Watch our journey.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Custom Slide Controls */}
        <div className="absolute bottom-8 right-6 md:right-16 z-30 flex items-center gap-6">
          <button 
            onClick={toggleVideoPlay}
            className="group flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all text-white"
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
        </div>
      </section>

      {/* 2. Brand Ethos (Replacing solid green Who We Are section) */}
      <section className="relative w-full py-32 px-6 md:px-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center">
          <div className="w-full md:w-1/2">
            <Eyebrow>Who We Are</Eyebrow>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-8" style={{ fontFamily: serif }}>
              Founded in Begusarai,<br/>Bihar in 2023.
            </h2>
            <p className="text-[#1C1C1A]/70 text-lg md:text-xl font-light leading-relaxed mb-8">
              We are an artisan-led, zero-waste, and export-ready eco-luxury brand. We build a formal, sustainable ecosystem that sources free raw materials from wetlands, trains rural artisans, and connects their premium creations directly to conscious consumers and global buyers.
            </p>
            <p className="text-[#1C1C1A]/70 text-lg md:text-xl font-light leading-relaxed">
              We believe that true luxury is ethical and inclusive. Our ecosystem is built from the ground up to empower those who need it most.
            </p>
          </div>

          <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-[#E8DDD0]">
              <h4 className="text-[3rem] leading-none text-[#C8A97A] font-light mb-4" style={{ fontFamily: serif }}>200+</h4>
              <h5 className="text-lg font-medium mb-3">Artisans</h5>
              <p className="text-[#1C1C1A]/60 text-sm font-light leading-relaxed">Trained and onboarded across Begusarai, Madhubani, and Gaya.</p>
            </div>
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-[#E8DDD0] sm:translate-y-8">
              <h4 className="text-[3rem] leading-none text-[#C8A97A] font-light mb-4" style={{ fontFamily: serif }}>80%</h4>
              <h5 className="text-lg font-medium mb-3">Women-Led</h5>
              <p className="text-[#1C1C1A]/60 text-sm font-light leading-relaxed">Predominantly driven by women, ensuring strong gender-lens credentials.</p>
            </div>
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-[#E8DDD0] sm:col-span-2">
              <h4 className="text-3xl leading-tight text-[#C8A97A] font-light mb-4" style={{ fontFamily: serif }}>Pehchan ID</h4>
              <h5 className="text-lg font-medium mb-3">Formal Identity</h5>
              <p className="text-[#1C1C1A]/60 text-sm font-light leading-relaxed">Every artisan receives formal employment status, fair wages, and access to social security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Scroll (What We Make) */}
      <section className="h-scroll-container w-full h-[100vh] bg-[#1C1C1A] text-white overflow-hidden flex flex-col justify-center relative">
        <div className="absolute top-16 left-6 md:left-16 z-20">
          <Eyebrow dark>What We Make</Eyebrow>
          <p className="text-white/60 text-sm max-w-sm mt-4 font-light">
            The intersection of traditional Indian craftsmanship and global sustainability standards. 100% biodegradable, zero synthetics, naturally pest-resistant.
          </p>
        </div>

        <div className="h-wrap flex w-[400vw] h-[60vh] mt-24">
          {products.map((p, i) => (
            <div key={i} className="h-card w-[100vw] h-full flex items-center justify-center px-6 md:px-16 flex-shrink-0">
              <div className="w-full max-w-5xl h-full flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2 h-64 md:h-[90%] overflow-hidden rounded-[2rem]">
                  <Image width={800} height={800} src={p.img} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="w-full md:w-1/2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#C8A97A] mb-4 block" style={{ fontFamily: sans }}>Category {i + 1}</span>
                  <h3 className="text-4xl md:text-6xl font-light mb-6" style={{ fontFamily: serif }}>{p.name}</h3>
                  <p className="text-white/50 text-sm tracking-wider uppercase mb-6" style={{ fontFamily: sans }}>{p.tags}</p>
                  <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Global Impact SDGs */}
      <section className="py-32 px-6 md:px-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <Eyebrow dark>Our Global Impact</Eyebrow>
            <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-light leading-tight text-[#1C1C1A]" style={{ fontFamily: serif }}>
              Aligned with 7 UN Sustainable Development Goals
            </h2>
            <div className="h-[2px] w-14 bg-[#C8A97A] mt-6 mx-auto" />
            <p className="text-[#1C1C1A]/70 mt-6 max-w-xl mx-auto text-lg font-light leading-relaxed">
              Every product crafted in our ecosystem creates measurable, trackable impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdgs.map((s, i) => (
              <div key={i} className="sdg-card bg-white border border-[#1C1C1A]/10 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-shadow duration-500">
                <div className="text-3xl font-light text-[#4A6741] mb-2" style={{ fontFamily: serif }}>{s.num}</div>
                <div className="text-[11px] tracking-[0.15em] uppercase text-[#C8A97A] font-semibold mb-6" style={{ fontFamily: sans }}>{s.code}</div>
                <p className="text-[#1C1C1A]/80 text-sm leading-relaxed font-light">{s.impact}</p>
              </div>
            ))}
            <div className="sdg-card bg-[#1C1C1A] text-white rounded-[2rem] p-8 flex items-center justify-center text-center shadow-lg">
              <p className="text-lg font-medium italic" style={{ fontFamily: serif }}>
                "Building a formal, sustainable ecosystem."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* 5. Vision for the future */}
      <section className="vision-container relative py-48 px-6 md:px-16 bg-[#1C1C1A] text-white text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <div className="relative z-10 max-w-5xl mx-auto vision-text">
          <Eyebrow dark>Our Vision For The Future</Eyebrow>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-light leading-[1.1] mb-12" style={{ fontFamily: serif }}>
            We are not just building a business; <br />
            <span className="text-[#C8A97A] italic">we are building for Bihar.</span>
          </h2>
          <p className="text-white/70 text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto">
            As we expand our export pipelines to the <span className="text-white font-medium">UK, Germany, and Japan</span>, our goal is to scale our network to empower over <span className="text-white font-medium">10,000 artisans</span> while establishing Bihar's first globally recognized eco-luxury brand.
          </p>
        </div>
      </section>
    </main>
  );
}