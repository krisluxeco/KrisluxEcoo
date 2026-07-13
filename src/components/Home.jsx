"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import FeaturedProducts from "./Featuredproducts";
import Link from "next/link";

// ─── Shared Typography ────────────────────────────────────────────────────────
const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

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
  "Sustainable Luxury", "·", "Zero Waste", "·", "Artisan Crafted", "·",
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
  { url: "/images/hero_baskets.png", caption: "Handcrafted ceramics & baskets" },
  { url: "/images/hero_hotel.png", caption: "Luxury eco-friendly amenities" },
  { url: "/images/artisan_crafting.png", caption: "Sustainably Sourced Craft" },
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.url}
          className="absolute inset-0 bg-cover bg-center transition-all duration-[1.5s] ease-in-out"
          style={{ 
            backgroundImage: `url(${slide.url})`,
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.05)"
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1A]/80 via-[#1C1C1A]/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A]/80 via-transparent to-transparent z-10 pointer-events-none" />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-500 ${i === current ? "w-6 h-2 bg-[#C8A97A]" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Categories Data ──────────────────────────────────────────────────────────
const categories = [
  { slug: "home-living", name: "Home & Living", tag: "Everyday Rituals", image: "/images/home_storage.png", aspect: "aspect-[3/4]" },
  { slug: "kitchen-dining", name: "Kitchen & Dining", tag: "Reclaimed Woodware", image: "/images/kitchen_dining.png", aspect: "aspect-[4/3]" },
  { slug: "eco-living", name: "Eco Amenities", tag: "Zero-Waste Luxury", image: "/images/hero_hotel.png", aspect: "aspect-square" },
  { slug: "business-wholesale", name: "Wholesale", tag: "Corporate Supply", image: "/images/corporate_gifting.png", aspect: "aspect-[3/4]" },
];

// ─── Video Reels Data ────────────────────────────────────────────────────────
const reels = [
  { id: 1, url: "https://cdn.coverr.co/videos/coverr-weaving-a-basket-5254/1080p.mp4", title: "Hand Woven Baskets" },
  { id: 2, url: "https://cdn.coverr.co/videos/coverr-a-woman-making-a-clay-pot-5246/1080p.mp4", title: "Artisan Pottery" },
  { id: 3, url: "https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4", title: "Nature & Origins" }
];

// ─── Main Home Page Component ──────────────────────────────────────────────────
export default function Home({ featuredProducts = [], savedProductIds = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      
      let ctx = gsap.context(() => {
        // 1. Hero Text Reveal
        gsap.fromTo(".hero-element", 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
        );

        // 2. Collection Header Reveal
        gsap.fromTo(".collection-header",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: ".collection-header", start: "top 80%" }
          }
        );

        // 3. Collection Asymmetric Grid Cards Stagger
        gsap.utils.toArray(".category-card").forEach((card) => {
          gsap.fromTo(card,
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%" }
            }
          );
        });

        // 4. Reels Stagger
        gsap.fromTo(".reel-header",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: ".reel-header", start: "top 85%" } }
        );

        gsap.fromTo(".reel-card",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: ".reel-container", start: "top 80%" }
          }
        );

        // 5. Impact Section Reveal
        gsap.fromTo(".impact-content",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: ".impact-section", start: "top 75%" } }
        );

        // 6. Impact Video Parallax
        gsap.to(".impact-video", {
          y: "20%",
          ease: "none",
          scrollTrigger: { trigger: ".impact-section", start: "top bottom", end: "bottom top", scrub: true }
        });

      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <main ref={containerRef} className="bg-[#FAF7F2] text-[#1C1C1A] overflow-x-hidden" style={{ fontFamily: sans }}>
      
      {/* ─── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[110vh] flex flex-col justify-end overflow-hidden pb-32">
        <HeroSlideshow />

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full md:flex md:items-end justify-between">
          <div className="max-w-3xl">
            <div className="hero-element inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-8">
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
      <section className="py-32 px-6 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          {/* Cinematic Centered Header */}
          <div className="collection-header flex flex-col items-center text-center mb-28">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-[#C8A97A]/40" />
              <p className="text-[#C8A97A] text-[10px] tracking-[0.4em] uppercase font-medium">The Collection</p>
              <span className="w-12 h-[1px] bg-[#C8A97A]/40" />
            </div>
            
            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-light leading-[1] tracking-tight mb-6" style={{ fontFamily: serif }}>
              A curation of <span className="italic text-[#C8A97A]">sustainable</span> elegance.
            </h2>
            
            <p className="text-[#6B6560] text-sm md:text-base max-w-lg font-light leading-relaxed">
              Every piece in our collection is born from highly renewable materials,
              designed to elevate spaces while respecting the earth. Beauty without compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-32 md:gap-y-0">
            {categories.map((cat, i) => (
              <div
                key={cat.slug}
                className={`category-card group cursor-pointer ${
                  i === 0 ? "md:col-span-6 md:pr-12 md:mt-0" :
                  i === 1 ? "md:col-span-5 md:col-start-8 md:mt-64" :
                  i === 2 ? "md:col-span-5 md:pl-12 md:-mt-32" :
                  "md:col-span-6 md:col-start-7 md:mt-32"
                }`}
              >
                <Link href={`/user/products?category=${cat.slug}`}>
                  <div className="w-full bg-white p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-transform duration-1000 group-hover:-translate-y-2">
                    <div className={`relative w-full overflow-hidden ${cat.aspect}`}>
                      <div className="absolute inset-0 bg-[#C8A97A]/0 group-hover:bg-[#C8A97A]/10 transition-colors duration-1000 z-10 mix-blend-overlay" />
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between items-start px-2">
                    <div>
                      <h3 className="text-3xl font-[300] text-[#1C1C1A] mb-3" style={{ fontFamily: serif }}>{cat.name}</h3>
                      <p className="text-[#1C1C1A]/40 text-[9px] tracking-[0.3em] uppercase">{cat.tag}</p>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center text-[#1C1C1A]/30 group-hover:text-[#C8A97A] transition-colors duration-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM / VIDEO REELS ────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-y border-[#E8DDD0]">
        <div className="max-w-7xl mx-auto">
          <div className="reel-header text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light text-[#1C1C1A] mb-4" style={{ fontFamily: serif }}>
              Behind the <span className="italic text-[#C8A97A]">Craft</span>
            </h2>
            <p className="text-[#6B6560] text-sm">Follow our journey and see how each piece is made.</p>
          </div>

          <div className="reel-container grid grid-cols-1 md:grid-cols-3 gap-6">
            {reels.map((reel) => (
              <div key={reel.id} className="reel-card group relative aspect-[9/16] rounded-[24px] overflow-hidden bg-black/5">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
                  <source src={reel.url} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                
                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-medium text-lg" style={{ fontFamily: serif }}>{reel.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (Prop Passed) ────────────────────────────────── */}
      <div className="bg-[#FAF7F2]">
        <FeaturedProducts products={featuredProducts} savedProductIds={savedProductIds} />
      </div>

      {/* ─── STATS / PROMISE ────────────────────────────────────────────────── */}
      <section className="impact-section relative py-32 px-6 bg-[#1C1C1A] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            
            <div className="impact-content">
              <h2 className="text-[clamp(2.5rem,4vw,4.5rem)] font-light leading-[1.1] mb-8 text-white" style={{ fontFamily: serif }}>
                Impact <br />
                <span className="italic text-[#8FBD84]">Measured.</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed max-w-md mb-12">
                We measure our success not just in sales, but in the acreage of wetlands restored,
                the carbon diverted, and the communities uplifted.
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                <div>
                  <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: serif }}>
                    <CountUp target={120} suffix="+" />
                  </div>
                  <p className="text-[#C8A97A] text-[10px] tracking-[0.2em] uppercase">B2B Partners</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: serif }}>
                    <CountUp target={100} suffix="%" />
                  </div>
                  <p className="text-[#C8A97A] text-[10px] tracking-[0.2em] uppercase">Biodegradable</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: serif }}>
                    <CountUp target={350} suffix="+" />
                  </div>
                  <p className="text-[#C8A97A] text-[10px] tracking-[0.2em] uppercase">Artisans Employed</p>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-light text-white mb-2" style={{ fontFamily: serif }}>
                    <CountUp target={50} suffix="K+" />
                  </div>
                  <p className="text-[#C8A97A] text-[10px] tracking-[0.2em] uppercase">Plastics Replaced</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden border border-white/10">
              <div className="impact-video absolute top-[-20%] left-0 w-full h-[140%]">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover filter brightness-[0.7]">
                  <source src="https://cdn.coverr.co/videos/coverr-a-woman-making-a-clay-pot-5246/1080p.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-transparent to-transparent opacity-90 pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-8 z-10 pointer-events-none">
                <p className="text-white/90 font-light text-xl italic" style={{ fontFamily: serif }}>
                  "True luxury is knowing exactly where your products come from, and the hands that shaped them."
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
