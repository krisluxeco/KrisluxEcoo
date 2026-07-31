"use client";
import Image from "next/image";

import { useRef, useState, useEffect, useCallback } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Package } from "lucide-react";

/**
 * ─── FEATURED PRODUCTS ──────────────────────────────────────────────────────
 * Horizontally scrollable, animation-rich product rail. Works with:
 *  - Mouse: click-and-drag to scroll, with momentum "flick" on release
 *  - Trackpad/touch: native horizontal swipe
 *  - Shift + mouse wheel: native horizontal scroll (standard browser convention)
 *  - Arrow buttons: animated, auto-disable at scroll bounds
 *  - Live scroll-progress bar under the rail
 *
 * IMPORTANT: plain vertical mouse-wheel scrolling over the rail is left
 * completely alone and bubbles up to scroll the PAGE, not the rail. Hijacking
 * vertical wheel input to drive horizontal scroll breaks normal page
 * scrolling for anyone whose cursor happens to be resting over this section
 * (a classic "scroll-jacking" anti-pattern) — that's why the previous
 * version made the heading appear to vanish mid-scroll.
 *
 * Swap the `products` array below with your real catalogue. Badge colors
 * are keyed off `badge` text so you can add new badge types freely.
 */

const badgeStyles = {
  "BEST SELLER": "bg-[#C8A97A] text-white",
  "ECO CHOICE": "bg-[#FAF7F2] text-[#1C1C1A] border border-[#1C1C1A]/10",
  "NEW": "bg-[#1C1C1A] text-white",
  "POPULAR": "bg-[#C8A97A] text-white",
  "SPECIAL OFFER": "bg-[#1C1C1A] text-white",
  "OUT OF STOCK": "bg-white/90 text-[#1C1C1A]",
};

const CARD_WIDTH = 296; // card width + gap, used for arrow-button paging

/* ── Little floating "+1 liked" burst shown above the heart button ── */
function LikeBurst() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: 1, y: -26, scale: 1 }}
      exit={{ opacity: 0, y: -38 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pointer-events-none absolute -top-1 right-0 text-[#C8A97A]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#C8A97A">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
}

function ProductCard({ product, index, onDragStateRef, isLiked = false, onToggleSaved }) {
  const { status } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(isLiked);
  const [showBurst, setShowBurst] = useState(false);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });

  // 3D tilt-on-hover, driven by pointer position relative to the card
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handlePointerMoveCard = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const maxTilt = 5; // degrees, kept subtle so it stays elegant
    setTilt({
      ry: (px - 0.5) * maxTilt * 2,
      rx: (0.5 - py) * maxTilt * 2,
    });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  const handleLikeClick = async (e) => {
    e.stopPropagation();

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/user/saved-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      if (res.ok) {
        const nextState = data.saved;
        setLiked(nextState);
        if (nextState) {
          setShowBurst(true);
          setTimeout(() => setShowBurst(false), 500);
        }
        onToggleSaved?.(product._id, nextState);
      }
    } catch (err) {
      console.error("Error toggling saved status:", err);
    }
  };

  const coverImg = product.images?.[0]?.url || "";
  const displayPrice = product.discountPrice ?? product.price;
  const isOutOfStock = product.stock === 0;

  const getBadgeText = () => {
    if (isOutOfStock) return "OUT OF STOCK";
    if (product.category === "Eco & Sustainable") return "ECO CHOICE";
    if (product.discountPrice) return "SPECIAL OFFER";
    if (product.isBestSeller) return "BEST SELLER";
    return "NEW";
  };
  const badgeText = getBadgeText();

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.09,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        perspective: 1000,
      }}
      className="group relative flex-shrink-0 w-[260px] md:w-[280px] select-none"
      draggable={false}
    >
      <motion.div
        animate={{
          rotateX: tilt.rx,
          rotateY: tilt.ry,
        }}
        whileHover={{ y: -12, scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        onPointerMove={(e) => {
          // Skip tilt while the rail itself is mid-drag
          if (onDragStateRef?.current?.active) return;
          handlePointerMoveCard(e);
        }}
        onPointerLeave={resetTilt}
        style={{ transformStyle: "preserve-3d" }}
        className="relative bg-[#1C1C1A] rounded-[24px] overflow-hidden border border-white/10 group-hover:border-white/30 shadow-[0_2px_10px_rgba(0,0,0,0.2)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow] duration-500"
      >
        {/* Full Card Image Background */}
        <div className="absolute inset-0 z-0 bg-[#111] overflow-hidden">
          {coverImg ? (
            <Image
              src={coverImg}
              alt={product.name}
              fill
              draggable={false}
              sizes="(max-width: 768px) 260px, 280px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#9E9088]">
              <Package size={32} className="stroke-1" />
            </div>
          )}
          {/* Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
          
          {/* Soft gradient sheen that sweeps across on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-10"
            initial={{ x: "-120%" }}
            whileHover={{ x: "120%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        </div>

        {/* Relative Content Overlay */}
        <div className="relative z-10 p-5 flex flex-col h-full justify-between pointer-events-none" style={{ minHeight: "380px" }}>
          
          {/* Top Row: Badge & Floating Price */}
          <div className="flex justify-between items-start">
            <motion.span
              initial={{ opacity: 0, scale: 0.5, x: -10 }}
              animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ delay: index * 0.09 + 0.25, type: "spring", stiffness: 300, damping: 16 }}
              className={`text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 uppercase shadow-sm ${badgeStyles[badgeText] ?? "bg-white text-[#1C1C1A]"}`}
            >
              {badgeText === "BEST SELLER" || badgeText === "NEW" ? (
                <motion.span
                  className="inline-block"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  {badgeText}
                </motion.span>
              ) : (
                badgeText
              )}
            </motion.span>

            {/* Floating Price Tag */}
            <div className="flex flex-col items-end bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
              <span className="text-white font-medium text-xs whitespace-nowrap">
                ₹{displayPrice.toLocaleString()}{" "}
                <span className="text-white/50 font-light italic text-[9px]">onwards</span>
              </span>
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="text-white/40 text-[9px] line-through decoration-white/30 mt-0.5">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Row: Details & Buttons */}
          <div className="flex flex-col mt-auto pointer-events-auto" style={{ transform: "translateZ(20px)" }}>
            <p
              className="text-[11px] uppercase tracking-[0.14em] text-[#C8A97A] italic mb-1.5 truncate drop-shadow-md"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {product.category}
            </p>

            <h3
              className="text-xl leading-snug text-white mb-5 line-clamp-2 min-h-[3.2rem] drop-shadow-md"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {product.name}
            </h3>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Link href={`/user/products/${product._id}`} className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-full relative flex items-center justify-center bg-white border border-white hover:bg-transparent hover:text-white text-[#1C1C1A] text-[10px] font-bold tracking-[0.2em] uppercase py-3 rounded-[12px] transition-colors overflow-hidden cursor-pointer"
                >
                  REQUEST QUOTE
                </motion.button>
              </Link>
              
              <div className="relative">
                <AnimatePresence>{showBurst && <LikeBurst />}</AnimatePresence>
                <motion.button
                  onClick={handleLikeClick}
                  aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.08 }}
                  className={`relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-[12px] border transition-colors cursor-pointer ${
                    isLiked
                      ? "border-[#C8A97A] text-[#C8A97A] bg-[#C8A97A]/20 backdrop-blur-md"
                      : "border-white/20 text-white bg-black/20 backdrop-blur-md hover:bg-white/20"
                  }`}
                >
                  <motion.svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={liked ? "#C8A97A" : "none"}
                    stroke={liked ? "#C8A97A" : "white"}
                    strokeWidth="2"
                    animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </motion.svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedProducts({
  products = [],
  savedProductIds = [],
  title = "Featured",
  subtitle = "Products",
  pretitle = "Our Curated Collection",
  backgroundLess = false,
}) {
  const railRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  // The rail moves slowly upwards as the user scrolls down past it, creating a deep parallax effect
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const [scrollProgress, setScrollProgress] = useState(0); // 0..1
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // ── Unified scroll-physics state, shared by drag and arrow buttons ──
  // `target` is where we WANT scrollLeft to end up; the rAF loop eases
  // scrollLeft toward it every frame, so drag/arrows never fight.
  const physics = useRef({
    target: 0,
    velocity: 0, // px/ms, used for momentum flick on drag release
    running: false,
  });

  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
  });

  const updateEdgeState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setScrollProgress(max > 0 ? rail.scrollLeft / max : 0);
    setAtStart(rail.scrollLeft <= 2);
    setAtEnd(rail.scrollLeft >= max - 2);
  }, []);

  const runPhysics = useCallback(() => {
    const rail = railRef.current;
    const p = physics.current;
    if (!rail) {
      p.running = false;
      return;
    }
    const max = rail.scrollWidth - rail.clientWidth;
    p.target = Math.min(max, Math.max(0, p.target));

    const diff = p.target - rail.scrollLeft;

    if (Math.abs(diff) < 0.4 && Math.abs(p.velocity) < 0.02) {
      rail.scrollLeft = p.target;
      updateEdgeState();
      p.running = false;
      return;
    }

    rail.scrollLeft += diff * 0.18;
    updateEdgeState();
    requestAnimationFrame(runPhysics);
  }, [updateEdgeState]);

  const kickPhysics = useCallback(() => {
    if (!physics.current.running) {
      physics.current.running = true;
      requestAnimationFrame(runPhysics);
    }
  }, [runPhysics]);

  // ── Pointer drag-to-scroll, with momentum flick on release ──
  const onPointerDown = (e) => {
    const rail = railRef.current;
    if (!rail) return;
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.startScroll = rail.scrollLeft;
    drag.current.lastX = e.clientX;
    drag.current.lastT = performance.now();
    physics.current.velocity = 0;
    rail.style.cursor = "grabbing";
  };

  const onPointerMove = (e) => {
    const rail = railRef.current;
    if (!drag.current.active || !rail) return;
    const dx = e.clientX - drag.current.startX;
    const newScroll = drag.current.startScroll - dx;
    rail.scrollLeft = newScroll;
    physics.current.target = newScroll;
    updateEdgeState();

    const now = performance.now();
    const dt = now - drag.current.lastT;
    if (dt > 0) {
      physics.current.velocity = (drag.current.lastX - e.clientX) / dt; // px/ms
    }
    drag.current.lastX = e.clientX;
    drag.current.lastT = now;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const rail = railRef.current;
    if (rail) rail.style.cursor = "grab";

    // Project a momentum "flick" forward based on release velocity
    const v = physics.current.velocity; // px/ms
    const flickDistance = v * 220; // tune for feel
    physics.current.target = (rail?.scrollLeft ?? 0) + flickDistance;
    kickPhysics();
  };

  // ── Keep edge state (arrow disabled/enabled, progress bar) in sync ──
  // Note: deliberately NOT intercepting the wheel event here. Native
  // vertical wheel scrolling is left alone so it scrolls the page, exactly
  // as a user expects. Holding Shift while using the wheel already
  // triggers native horizontal scroll in every browser, so trackpad users
  // and shift-scrollers get horizontal movement "for free" without any
  // custom JS — and nobody's page scroll gets hijacked.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    physics.current.target = rail.scrollLeft;
    updateEdgeState();

    const handleNativeScroll = () => updateEdgeState();
    rail.addEventListener("scroll", handleNativeScroll, { passive: true });

    return () => {
      rail.removeEventListener("scroll", handleNativeScroll);
    };
  }, [updateEdgeState]);

  const scrollByCards = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    
    // Stop physics if it's running so they don't fight
    physics.current.running = false;
    physics.current.target = rail.scrollLeft + dir * CARD_WIDTH;
    
    rail.scrollBy({ left: dir * CARD_WIDTH, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className={`relative overflow-hidden text-[#1C1C1A] ${backgroundLess ? "pt-12 pb-6" : "py-20 px-6 bg-[#FAF7F2] border-y border-[#E8DDD0]"}`}>
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Horizontal Split Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 px-4 md:px-0">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <p className="flex items-center gap-3 text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#C8A97A] mb-3">
              <span className="h-px w-6 bg-[#C8A97A]/50" />
              <span style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>{pretitle}</span>
            </p>

            <h2
              className="text-4xl md:text-5xl font-light leading-tight text-[#1C1C1A]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              <span className="font-bold">{title} </span>
              <span className="relative inline-block font-normal italic text-[#C8A97A]">
                {subtitle}
                <span className="absolute left-0 -bottom-1 h-[1px] w-full bg-[#C8A97A]/40" />
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-start md:items-end gap-4 max-w-sm"
          >
            <p className="text-sm text-[#6B6560] md:text-right">
              Behind every Eco-Luxury product lies a soulful root story.
            </p>
            
            {/* Arrows integrated into header right side */}
            <div className="flex justify-end gap-3">
              <motion.button
                onClick={() => scrollByCards(-1)}
                disabled={atStart}
                aria-label="Scroll left"
                animate={{ opacity: atStart ? 0.35 : 1 }}
                whileHover={atStart ? {} : { scale: 1.08, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={atStart ? {} : { scale: 0.92 }}
                className="w-10 h-10 rounded-full border border-[#1C1C1A]/20 flex items-center justify-center hover:border-[#1C1C1A] disabled:cursor-not-allowed transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1C1A" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => scrollByCards(1)}
                disabled={atEnd}
                aria-label="Scroll right"
                animate={{ opacity: atEnd ? 0.35 : 1 }}
                whileHover={atEnd ? {} : { scale: 1.08, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={atEnd ? {} : { scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-10 h-10 rounded-full border border-[#1C1C1A]/20 flex items-center justify-center hover:border-[#1C1C1A] disabled:cursor-not-allowed transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1C1A" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Rail wrapper — overflow-hidden lives HERE, not on the whole section,
            so headings above are never clipped; edge fades hint at more content */}
        <motion.div className="relative" style={{ y: parallaxY }}>
          {/* Removed solid color gradient overlays since they clash with the parallax background. 
              Using a subtle CSS mask instead if needed, but for now simple overflow is cleaner on dark mode. */}
          <div
            ref={railRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="flex gap-5 overflow-x-auto pb-4 cursor-grab [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ 
              scrollSnapType: "x proximity",
              maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 2%, black 98%, transparent)"
            }}
          >
            {products.map((product, i) => (
              <div key={product._id} style={{ scrollSnapAlign: "start" }}>
                <ProductCard
                  product={product}
                  index={i}
                  onDragStateRef={drag}
                  isLiked={savedProductIds?.includes(product._id.toString())}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live scroll-progress indicator */}
        <div className="relative h-[2px] w-full max-w-[220px] mx-auto mt-1 bg-[#1C1C1A]/10 overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full w-[30%] bg-[#1C1C1A]"
            animate={{ x: `${scrollProgress * 233}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.3 }}
          />
        </div>

        <div className="flex justify-center">
          <Link href="/user/products" passHref legacyBehavior>
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-[#1C1C1A] border-b border-[#1C1C1A]/40 pb-0.5 hover:border-[#1C1C1A] transition-colors mt-8"
            >
              View all products
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.a>
          </Link>
        </div>
      </div>
    </section>
  );
}