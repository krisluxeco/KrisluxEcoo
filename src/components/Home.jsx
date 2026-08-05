"use client";
import Image from "next/image";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { animate, utils } from "animejs";
import FeaturedProducts from "./Featuredproducts";
import LiveCarbonFootprint from "./LiveCarbonFootprint";
import Link from "next/link";
import Deck from "./Deck";
import DustParticles from "./DustParticles";
import ImpactCarousel from "./ImpactCarousel";
import Lenis from "lenis";
import Platforms from "./Platforms";

// ─── Shared Typography ────────────────────────────────────────────────────────
const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

// ─── Number Counter (GSAP) ───────────────────────────────────────────────────
function CountUp({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const targetRef = useRef({ val: 0 });

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(targetRef.current, {
        val: target,
        duration: 2,
        ease: "power3.out",
        onUpdate: () => {
          setCount(Math.floor(targetRef.current.val));
        },
        scrollTrigger: {
          trigger: counterRef.current,
          start: "top 85%"
        }
      });
    }, counterRef);
    return () => ctx.revert();
  }, [target]);

  return (
    <span ref={counterRef}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Marquee ───────────────────────────────────────────────────────────────────
const marqueeItems = [
  "Eco-Luxury", "·", "Zero Waste", "·", "Artisan Crafted", "·",
  "B2B Bulk Orders", "·", "Eco-Friendly Materials", "·", "Corporate Gifting", "·"
];

function MarqueeStrip() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const q = gsap.utils.selector(marqueeRef);
      gsap.to(q(".marquee-content"), {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
      });
    }, marqueeRef);
    return () => ctx.revert();
  }, []);

  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div ref={marqueeRef} className="overflow-hidden border-y border-[#E8DDD0] bg-[#FAF7F2] py-5">
      <div className="marquee-content flex gap-12 whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-xs tracking-[0.3em] uppercase text-[#1C1C1A] font-medium flex-shrink-0"
            style={{ fontFamily: sans }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Hero Slideshow ────────────────────────────────────────────────────────────
const heroSlides = [
  { url: "/images/HeroSection2.png", caption: "Handcrafted Ceramics & Baskets", tag: "Collection 01" },
  { url: "/images/HeroSection3.png", caption: "Eco-Luxury Hotel Amenities", tag: "Collection 02" },
  { url: "/images/HeroSection1.png", caption: "Sustainably Sourced Heritage Craft", tag: "Collection 03" },
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const intervalTime = 50; // Update progress every 50ms
    const totalTime = 6000;  // 6 seconds per slide
    const increment = (intervalTime / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrent((c) => (c + 1) % heroSlides.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    setCurrent((c) => (c + 1) % heroSlides.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
    setProgress(0);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#1C1C1A]">
      {heroSlides.map((slide, i) => {
        const isActive = i === current;
        return (
          <div
            key={slide.url}
            className={`absolute inset-0 transition-all duration-[1200ms] cubic-bezier(0.77, 0, 0.175, 1) ${
              isActive
                ? "opacity-100 clip-path-full scale-100 z-10"
                : "opacity-0 clip-path-right scale-110 z-0 pointer-events-none"
            }`}
            style={{
              clipPath: isActive ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" : "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
            }}
          >
            {/* Background Image with Ken Burns continuous zoom effect */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-linear ${
                isActive ? "scale-110" : "scale-100"
              }`}
              style={{ backgroundImage: `url(${slide.url})` }}
            />
          </div>
        );
      })}

      {/* Vignette & Gradients Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1A]/90 via-[#1C1C1A]/50 to-transparent z-15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-transparent to-black/30 z-15 pointer-events-none" />

      {/* Floating Caption & Slide Indicators */}
      <div className="absolute bottom-12 right-6 md:right-16 z-30 flex flex-col items-end gap-4">
        {/* Active Slide Info Tag */}
        <div className="text-right hidden sm:block">
          <p className="text-[#C8A97A] text-[10px] tracking-[0.3em] uppercase font-semibold mb-1">
            {heroSlides[current].tag}
          </p>
          <p className="text-white/80 text-sm font-light italic" style={{ fontFamily: serif }}>
            "{heroSlides[current].caption}"
          </p>
        </div>

        {/* Counter and Navigation Controls */}
        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/15 px-6 py-3 rounded-full">
          <span className="text-white text-xs font-mono tracking-widest">
            0{current + 1} <span className="text-white/40">/ 0{heroSlides.length}</span>
          </span>

          {/* Progress Bar Container */}
          <div className="w-16 h-[2px] bg-white/20 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#C8A97A] transition-all ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Arrow Buttons */}
          <div className="flex items-center gap-2 border-l border-white/20 pl-4">
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Previous Slide"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Next Slide"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Mouse Cursor ───────────────────────────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef(null);
  const outerRef = useRef(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const outer = outerRef.current;
    
    const onMouseMove = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
      gsap.to(outer, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power3.out" });
    };

    const onMouseEnter = () => {
      gsap.to(cursor, { scale: 1.5, backgroundColor: "rgba(200, 169, 122, 0.8)", duration: 0.3 });
      gsap.to(outer, { scale: 0, opacity: 0, duration: 0.3 });
    };
    
    const onMouseLeave = () => {
      gsap.to(cursor, { scale: 1, backgroundColor: "rgba(200, 169, 122, 1)", duration: 0.3 });
      gsap.to(outer, { scale: 1, opacity: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMouseMove);
    
    document.querySelectorAll('a, button, .hover-target').forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.querySelectorAll('a, button, .hover-target').forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-[#C8A97A] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[#C8A97A]/50 rounded-full pointer-events-none z-[9998] mix-blend-difference hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}

// ─── Categories Data ──────────────────────────────────────────────────────────
const categories = [
  { slug: "Home & Living", name: "Home & Living", tag: "Everyday Rituals", image: "/images/HomeCategory1.png", aspect: "aspect-[3/4]" },
  { slug: "Kitchen & Dining", name: "Kitchen & Dining", tag: "Reclaimed Woodware", image: "/images/HomeCategory2.png", aspect: "aspect-[4/3]" },
  { slug: "Eco & Sustainable", name: "Eco Amenities", tag: "Zero-Waste Eco-Luxury", image: "/images/hero_hotel.png", aspect: "aspect-square" },
  { slug: "Business & Wholesale", name: "Wholesale", tag: "Corporate Supply", image: "/images/HomeCategory4.png", aspect: "aspect-[3/4]" },
];

const collectionData = [
  {
    image: "/images/HomeCategory1.png",
    title: "Artisan Woodware",
    description: "Hand-carved essentials crafted from reclaimed wood. Elevating everyday rituals."
  },
  {
    image: "/images/HomeCategory2.png",
    title: "Sustainable Serveware",
    description: "Minimalist ceramic designs built with eco-conscious clay, bringing nature to your table."
  },
  {
    image: "/images/hero_hotel.png",
    title: "Eco-Luxury Amenities",
    description: "Zero-waste toiletries and sustainable bamboo designed exclusively for premium boutique hotels."
  },
  {
    image: "/images/HomeCategory4.png",
    title: "Corporate Gifting",
    description: "Tailor-made, biodegradable wholesale packages for mindful business partnerships."
  },
  {
    image: "/images/HeroSection1.png",
    title: "Heritage Craft",
    description: "Every piece tells a story of mindful sourcing and sustainable craftsmanship."
  },
  {
    image: "/images/HeroSection2.png",
    title: "A curation of elegance",
    description: "Every piece in our collection is born from highly renewable materials, designed to elevate spaces while respecting the earth."
  }
];

// ─── Video Reels Data ────────────────────────────────────────────────────────
const reels = [
  { id: 1, type: "instagram", url: "https://www.instagram.com/p/DaxAEiUJuEn/embed", title: "KrisluxECO Highlights" },
  { id: 2, type: "instagram", url: "https://www.instagram.com/p/DbMkSPLoP80/embed", title: "Eco-Friendly Lifestyle" },
  { id: 3, type: "instagram", url: "https://www.instagram.com/p/Da8PEBqJjfW/embed", title: "Sustainable Living" },
  { id: 4, type: "instagram", url: "https://www.instagram.com/p/Da-nAIKJOlk/embed", title: "Impact & Craft" }
];

// ─── Main Home Page Component ──────────────────────────────────────────────────
export default function Home({ featuredProducts = [], savedProductIds = [], impactStats, detailedStats, recentItems }) {
  const containerRef = useRef(null);
  const [activeDeckIndex, setActiveDeckIndex] = useState(collectionData.length - 1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Initialize Lenis Smooth Scroll
      const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      // Sync Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      let ctx = gsap.context(() => {
        // 1. Hero Text Reveal
        gsap.fromTo(".hero-element",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
        );

        // 2. Collection Header Reveal
        gsap.fromTo(".collection-header",
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power4.out",
            scrollTrigger: { trigger: ".collection-header", start: "top 85%" }
          }
        );

        // 3. Generalized Fade-Up Reveal
        gsap.utils.toArray(".gsap-reveal").forEach((elem) => {
          gsap.fromTo(elem,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
              scrollTrigger: { trigger: elem, start: "top 85%" }
            }
          );
        });

        // Generalized Parallax Image
        gsap.utils.toArray(".gsap-parallax").forEach((elem) => {
          gsap.to(elem, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: { trigger: elem.parentElement, start: "top bottom", end: "bottom top", scrub: 1 }
          });
        });

        // 3. Collection Asymmetric Grid Cards Stagger
        gsap.utils.toArray(".category-card").forEach((card) => {
          gsap.fromTo(card,
            { opacity: 0, y: 80 },
            {
              opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%" }
            }
          );
        });

        // 4. Reels Stagger
        gsap.fromTo(".reel-header",
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power4.out", scrollTrigger: { trigger: ".reel-header", start: "top 85%" } }
        );

        gsap.fromTo(".reel-card",
          { opacity: 0, y: 100, rotate: 2 },
          {
            opacity: 1, y: 0, rotate: 0, duration: 1.2, stagger: 0.15, ease: "back.out(1.2)",
            scrollTrigger: { trigger: ".reel-container", start: "top 80%" }
          }
        );

        // Old impact animations removed as they are replaced by ImpactCarousel.
      }, containerRef);

      // ─── Anime.js v4 Animations ───────────────────────────────────────────────
      // A. Anime.js Entrance Animation for Hero Badge
      animate('.anime-badge', {
        scale: [0.8, 1],
        opacity: [0, 1],
        ease: 'outElastic(1, .8)',
        delay: 300
      });

      // B. Anime.js Continuous Floating Geometric Particles
      animate('.anime-float-particle', {
        translateY: () => utils.random(-25, 25),
        translateX: () => utils.random(-20, 20),
        rotate: () => utils.random(-15, 15),
        scale: () => utils.random(0.9, 1.15),
        duration: 4000,
        ease: 'inOutQuad',
        alternate: true,
        loop: true,
        delay: utils.stagger(400)
      });

      return () => {
        ctx.revert();
        lenis.destroy();
      };
    }
  }, []);

  return (
    <main ref={containerRef} className="bg-[#FAF7F2] text-[#1C1C1A] overflow-x-hidden cursor-none" style={{ fontFamily: sans }}>
      <CustomCursor />
      <DustParticles particleCount={80} />
      
      {/* ─── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[110vh] flex flex-col justify-end overflow-hidden pb-32">
        <HeroSlideshow />

        {/* Anime.js Floating Ambient Elements */}
        <div className="anime-float-particle absolute top-1/4 left-10 w-24 h-24 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm pointer-events-none z-20 hidden md:block" />
        <div className="anime-float-particle absolute top-1/3 right-20 w-16 h-16 rounded-full border border-[#C8A97A]/20 bg-[#C8A97A]/5 backdrop-blur-sm pointer-events-none z-20 hidden md:block" />
        <div className="anime-float-particle absolute bottom-1/3 left-1/4 w-12 h-12 rounded-full border border-[#8FBD84]/20 bg-[#8FBD84]/5 backdrop-blur-sm pointer-events-none z-20 hidden md:block" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full md:flex md:items-end justify-between">
          <div className="max-w-3xl">
            <div className="hero-element anime-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FBD84] animate-pulse" />
              Sustainable · Handcrafted
            </div>

            <h1 className="hero-element text-[clamp(3.5rem,8vw,7rem)] font-light leading-[0.9] mb-8 text-white" style={{ fontFamily: serif }}>
              Nature, <br />
              <span className="italic text-white/80">Crafted</span> By Hand.
            </h1>

            <div className="hero-element flex flex-col sm:flex-row gap-6">
              <Link href="/user/products" className="group flex items-center justify-center gap-3 bg-[#C8A97A] text-[#1C1C1A] px-8 py-4 rounded-full text-xs tracking-[0.2em] uppercase font-bold hover:bg-white transition-all shadow-lg">
                Explore Collection
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/user/bulk-order" className="group flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-4 rounded-full text-xs tracking-[0.2em] uppercase hover:border-white transition-all backdrop-blur-sm bg-white/5">
                Request B2B Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ────────────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ─── EDITORIAL CATEGORIES (Asymmetric Grid) ─────────────────────────── */}
      <section className="relative min-h-[100vh] py-20 px-6 bg-[#141414] flex items-center justify-center overflow-hidden">
        
        {/* PARALLAX BACKGROUND */}
        <div className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none z-0">
           <img 
             src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=2000" 
             className="gsap-parallax w-full h-full object-cover opacity-[0.25]"
             alt="Deep Forest Parallax"
           />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side: Details & Text */}
            <div className="collection-header flex flex-col items-start text-left min-h-[300px] justify-center">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-[#C8A97A]" />
                <p className="text-[#C8A97A] text-[10px] tracking-[0.4em] uppercase font-bold">The Collection</p>
              </div>

              <div key={activeDeckIndex} className="animate-fade-up">
                <h2 className="text-[clamp(3rem,5vw,5rem)] text-white font-light leading-[1.05] tracking-tight mb-8" style={{ fontFamily: serif }}>
                  {activeDeckIndex >= 0 ? collectionData[activeDeckIndex].title : "A curation of elegance"}
                </h2>

                <p className="text-white/70 text-sm md:text-base max-w-md font-light leading-relaxed mb-12 transition-all duration-300">
                  {activeDeckIndex >= 0 ? collectionData[activeDeckIndex].description : "Every piece in our collection is designed to elevate spaces while respecting the earth."}
                </p>

                <Link href="/user/products" className="hover-target group relative overflow-hidden inline-flex items-center justify-center gap-3 border border-white/20 text-white px-10 py-5 rounded-full text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 w-0 bg-[#C8A97A] transition-all duration-[400ms] ease-out group-hover:w-full" />
                  <span className="relative z-10 group-hover:text-[#1C1C1A] transition-colors duration-300">View All Categories</span>
                </Link>
              </div>
            </div>

            {/* Right Side: Interactive Deck */}
            <div className="hover-target relative w-full h-[75vh] min-h-[600px] flex justify-center items-center bg-transparent">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,122,0.15)_0%,transparent_60%)] pointer-events-none" />
              <Deck cards={collectionData} onIndexChange={setActiveDeckIndex} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM / VIDEO REELS ────────────────────────────────────────── */}
      <section className="relative py-16 px-6 bg-[#FAF7F2] border-y border-[#E8DDD0] overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="reel-header text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-light text-[#1C1C1A] mb-3" style={{ fontFamily: serif }}>
              Behind the <span className="italic text-[#C8A97A]">Craft</span>
            </h2>
            <p className="text-[#6B6560] text-sm">Follow our journey and see how each piece is made.</p>
          </div>

          <div className="reel-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {reels.map((reel) => (
              reel.type === "instagram" ? (
                <div key={reel.id} className="reel-card group relative aspect-[9/16] rounded-[24px] overflow-hidden bg-white shadow-lg">
                  <iframe
                    src={reel.url}
                    className="w-full h-full border-none"
                    scrolling="no"
                    allowTransparency={true}
                    allow="encrypted-media"
                  ></iframe>
                </div>
              ) : (
                <a href={reel.link || "#"} target="_blank" rel="noopener noreferrer" key={reel.id} className="reel-card group relative aspect-[9/16] rounded-[24px] overflow-hidden bg-black/5 block">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
                    <source src={reel.url} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 pointer-events-none" />

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-lg">
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-medium text-lg" style={{ fontFamily: serif }}>{reel.title}</p>
                  </div>
                </a>
              )
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a href="https://www.instagram.com/krisluxeco/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 border border-[#E8DDD0] bg-transparent text-[#1C1C1A] px-8 py-4 rounded-full text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#1C1C1A] hover:text-[#FAF7F2] transition-all duration-500">
              Watch More on Instagram
              <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (Prop Passed) ────────────────────────────────── */}
      <div className="bg-[#FAF7F2] gsap-reveal">
        <FeaturedProducts products={featuredProducts} savedProductIds={savedProductIds} />
      </div>

      {/* --- NEW IMPACT CAROUSEL ------------------------------------------------ */ }
      <Platforms />
      <ImpactCarousel />

      {/* ─── LIVE CARBON FOOTPRINT TRACKER ──────────────────────────────────── */}
      <LiveCarbonFootprint impactStats={impactStats} detailedStats={detailedStats} recentItems={recentItems} />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateY(100%); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </main>
  );
}
