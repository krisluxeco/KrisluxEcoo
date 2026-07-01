"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useInView, AnimatePresence } from "framer-motion";

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
  "BEST SELLER": "bg-[#4A6741] text-white",
  "ECO CHOICE": "bg-[#8FBD84] text-[#1C1C1A]",
  "NEW": "bg-[#1C1C1A] text-white",
  "POPULAR": "bg-[#C8A97A] text-white",
  "SPECIAL OFFER": "bg-[#D98C5F] text-white",
  "OUT OF STOCK": "bg-[#1C1C1A]/60 text-white",
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
      className="pointer-events-none absolute -top-1 right-0 text-[#4A6741]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#4A6741">
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
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        onPointerMove={(e) => {
          // Skip tilt while the rail itself is mid-drag
          if (onDragStateRef?.current?.active) return;
          handlePointerMoveCard(e);
        }}
        onPointerLeave={resetTilt}
        style={{ transformStyle: "preserve-3d" }}
        className="relative bg-white rounded-2xl overflow-hidden border border-[#E8DDD0] group-hover:border-[#4A6741]/30 shadow-[0_2px_10px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-[border-color,box-shadow] duration-300"
      >
        {/* Image */}
        <div className="relative h-[200px] w-full overflow-hidden bg-[#F6F2EC]">
          <motion.span
            initial={{ opacity: 0, scale: 0.5, x: -10 }}
            animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ delay: index * 0.09 + 0.25, type: "spring", stiffness: 300, damping: 16 }}
            className={`absolute top-3 left-3 z-10 text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm ${
              badgeStyles[badgeText] ?? "bg-[#4A6741] text-white"
            }`}
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

          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {coverImg ? (
              <Image
                src={coverImg}
                alt={product.name}
                fill
                draggable={false}
                sizes="(max-width: 768px) 260px, 280px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9E9088]">
                <Package size={32} className="stroke-1" />
              </div>
            )}
          </motion.div>

          {/* Soft gradient sheen that sweeps across on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
            initial={{ x: "-120%" }}
            whileHover={{ x: "120%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col" style={{ transform: "translateZ(20px)" }}>
          <p
            className="text-[11px] uppercase tracking-[0.14em] text-[#C8A97A] italic mb-1.5 truncate"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {product.category}
          </p>

          <h3
            className="text-lg leading-snug text-[#1C1C1A] mb-3 line-clamp-2 min-h-[2.8rem]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-4 text-xs gap-2">
            <span className="flex items-center gap-1.5 text-[#9E9088] whitespace-nowrap">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <circle cx="12" cy="12" r="9" />
              </svg>
              MOQ: {product.minOrderQty || 1}
            </span>
            <span className="text-[#4A6741] font-semibold whitespace-nowrap">
              ₹{displayPrice.toLocaleString()} <span className="text-[#9E9088] font-normal">onwards</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/user/products/${product._id}`}
              className="flex-1"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full relative flex items-center justify-center bg-[#1C1C1A] hover:bg-[#4A6741] text-white text-xs tracking-wide py-2.5 rounded-full transition-colors overflow-hidden cursor-pointer"
              >
                REQUEST QUOTE
              </motion.button>
            </Link>

            <motion.button
              onClick={handleLikeClick}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full border border-[#E8DDD0] hover:border-[#4A6741] transition-colors cursor-pointer"
            >
              <AnimatePresence>{showBurst && <LikeBurst />}</AnimatePresence>
              <motion.svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={liked ? "#4A6741" : "none"}
                stroke={liked ? "#4A6741" : "#9E9088"}
                strokeWidth="2"
                animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedProducts({ products = [], savedProductIds = [] }) {
  const railRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

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
    physics.current.velocity = 0;
    physics.current.target = rail.scrollLeft + dir * CARD_WIDTH;
    kickPhysics();
  };

  return (
    <section ref={sectionRef} className="py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#C8A97A] mb-3"
          >
            <span className="h-px w-6 bg-[#C8A97A]/50" />
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }} className="italic not-italic">
              Handpicked for You
            </span>
            <span className="h-px w-6 bg-[#C8A97A]/50" />
          </motion.p>

          <h2
            className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#1C1C1A]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-block font-bold"
            >
              Featured{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="relative inline-block font-bold text-[#4A6741]"
            >
              Products
              <motion.span
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
                className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#C8A97A] origin-left"
              />
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-[#6B6560] mt-4 max-w-md"
          >
            Our most loved eco-friendly products, crafted by skilled artisans.
          </motion.p>
        </motion.div>

        {/* Arrows live above the rail, right-aligned over it */}
        <div className="flex justify-end gap-3 mb-4">
          <motion.button
            onClick={() => scrollByCards(-1)}
            disabled={atStart}
            aria-label="Scroll left"
            animate={{ opacity: atStart ? 0.35 : 1 }}
            whileHover={atStart ? {} : { scale: 1.08, backgroundColor: "#DCE8D8" }}
            whileTap={atStart ? {} : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-10 h-10 rounded-full border border-[#E8DDD0] flex items-center justify-center hover:border-[#4A6741] disabled:cursor-not-allowed transition-colors"
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
            whileHover={atEnd ? {} : { scale: 1.08, backgroundColor: "#DCE8D8" }}
            whileTap={atEnd ? {} : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-10 h-10 rounded-full border border-[#E8DDD0] flex items-center justify-center hover:border-[#4A6741] disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1C1A" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        </div>

        {/* Rail wrapper — overflow-hidden lives HERE, not on the whole section,
            so headings above are never clipped; edge fades hint at more content */}
        <div className="relative">
          <motion.div
            className="pointer-events-none absolute left-0 top-0 bottom-4 w-12 z-10 bg-gradient-to-r from-[#FAF7F2] to-transparent"
            animate={{ opacity: atStart ? 0 : 1 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 z-10 bg-gradient-to-l from-[#FAF7F2] to-transparent"
            animate={{ opacity: atEnd ? 0 : 1 }}
            transition={{ duration: 0.25 }}
          />

          <div
            ref={railRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="flex gap-5 overflow-x-auto pb-4 cursor-grab [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ scrollSnapType: "x proximity" }}
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
        </div>

        {/* Live scroll-progress indicator */}
        <div className="relative h-[3px] w-full max-w-[220px] mx-auto mt-1 bg-[#E8DDD0] rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full w-[30%] bg-[#4A6741] rounded-full"
            animate={{ x: `${scrollProgress * 233}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.3 }}
          />
        </div>

        <div className="flex justify-center">
          <motion.a
            href="/user/products"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ x: 4 }}
            className="inline-flex items-center gap-2 text-sm text-[#4A6741] tracking-wide border-b border-[#4A6741]/40 pb-0.5 hover:border-[#4A6741] transition-colors mt-8"
          >
            View all products
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}