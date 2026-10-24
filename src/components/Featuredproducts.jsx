"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

const CARD_WIDTH = 320; // Card width + gap for smooth paging

/* ── Floating "+1 liked" burst animation ── */
function LikeBurst() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: 1, y: -24, scale: 1 }}
      exit={{ opacity: 0, y: -36 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pointer-events-none absolute -top-1 right-0 text-[#C29B5D]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#C29B5D">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
}

/* ── Premium Editorial Product Card (Butter-Smooth Hardware Rendered) ── */
function ProductCard({ product, isLiked = false, onToggleSaved }) {
  const { status } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(isLiked);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/user/saved-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const primaryImg = product.images?.[0]?.url || "";
  const secondaryImg = product.images?.[1]?.url || primaryImg;
  const displayPrice = product.discountPrice ?? product.price;
  const originalPrice = product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountSavings = hasDiscount ? originalPrice - product.discountPrice : 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative flex-shrink-0 w-[280px] sm:w-[310px] select-none snap-start">
      <div className="relative bg-white rounded-[2px] overflow-hidden border border-[#EAE3D6] hover:border-[#C29B5D]/70 shadow-[0_4px_20px_rgba(20,30,23,0.04)] hover:shadow-[0_20px_45px_rgba(20,30,23,0.1)] transition-all duration-500 flex flex-col h-[465px]">
        {/* ─── Product Image Showcase ─── */}
        <Link
          href={`/user/products/${product._id}`}
          className="relative h-[270px] w-full bg-[#F5F2EC] overflow-hidden block"
        >
          {primaryImg ? (
            <>
              {/* Primary Base Photography */}
              <div className="absolute inset-0">
                <Image
                  src={primaryImg}
                  alt={product.name}
                  fill
                  draggable={false}
                  sizes="(max-width: 768px) 280px, 310px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Secondary Hover Image (Simple, Smooth, Fast Fade) */}
              {secondaryImg && secondaryImg !== primaryImg && (
                <div className="absolute inset-0 z-[1] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <Image
                    src={secondaryImg}
                    alt={`${product.name} detail`}
                    fill
                    draggable={false}
                    sizes="(max-width: 768px) 280px, 310px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#A3998F]">
              <Sparkles className="w-8 h-8 stroke-1 text-[#C29B5D]" />
            </div>
          )}

          {/* Floating Editorial Pill Badges (Almost Zero Radius) */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between z-10 pointer-events-none">
            {isOutOfStock ? (
              <span className="text-[9px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-[2px] bg-white/95 text-[#68736B] font-semibold shadow-sm border border-black/5 backdrop-blur-md">
                Made To Order
              </span>
            ) : hasDiscount ? (
              <span className="text-[9px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-[2px] bg-[#141E17] text-[#FAF8F5] font-semibold shadow-sm backdrop-blur-md">
                Save ₹{discountSavings.toLocaleString()}
              </span>
            ) : (
              <span className="text-[9px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-[2px] bg-white/95 text-[#141E17] font-semibold shadow-sm border border-black/5 backdrop-blur-md">
                100% Water Hyacinth
              </span>
            )}

            {/* Wishlist Heart Button (Almost Zero Radius) */}
            <button
              onClick={handleLikeClick}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              className="pointer-events-auto relative w-8 h-8 rounded-[2px] bg-white/90 hover:bg-white text-[#141E17] backdrop-blur-md border border-black/5 shadow-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              <AnimatePresence>{showBurst && <LikeBurst />}</AnimatePresence>
              <Heart
                size={14}
                className={`transition-colors duration-200 ${
                  liked ? "fill-[#C29B5D] text-[#C29B5D]" : "text-[#141E17]/80 hover:text-[#141E17]"
                }`}
              />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
        </Link>

        {/* ─── Product Spec & Pricing Content ─── */}
        <div className="p-5 flex flex-col flex-1 justify-between bg-white">
          <div>
            {/* Category Eyebrow & MOQ Pill */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#8C7A6B] font-semibold truncate"
                style={{ fontFamily: sans }}
              >
                {product.category || "Sustainable Craft"}
              </span>

              <span className="text-[10px] font-mono text-[#2B4B38] bg-[#EBF2ED] px-2 py-0.5 rounded-[2px] font-semibold whitespace-nowrap">
                MOQ: {product.minOrderQty || 15} pcs
              </span>
            </div>

            {/* Product Name in Editorial Serif */}
            <Link href={`/user/products/${product._id}`} className="group/title block">
              <h3
                className="text-lg font-normal leading-snug text-[#141E17] group-hover/title:text-[#C29B5D] transition-colors line-clamp-1"
                style={{ fontFamily: serif }}
              >
                {product.name}
              </h3>
            </Link>

            {/* Lead Time & Craft Origin */}
            <p className="text-[11px] text-[#78857C] mt-1 font-light flex items-center gap-1.5 truncate">
              <span>Bihar Artisan Guild</span>
              <span>•</span>
              <span>Lead: {product.leadTime || "3–4 wks"}</span>
            </p>
          </div>

          {/* Pricing & Interactive CTA Action */}
          <div className="pt-3 border-t border-[#F0ECE3] mt-auto">
            <div className="flex items-baseline justify-between mb-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#141E17] font-mono">
                  ₹{displayPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#78857C] uppercase font-mono tracking-wider">
                  / unit
                </span>
              </div>

              {hasDiscount && (
                <span className="text-xs text-[#9B9E9B] line-through font-mono">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <Link href={`/user/products/${product._id}`} className="block w-full">
              <button className="w-full py-2.5 px-3 bg-[#141E17] hover:bg-[#C29B5D] text-[#FAF8F5] hover:text-[#0D140F] font-semibold text-[10px] tracking-[0.2em] uppercase rounded-[2px] transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 group/btn shadow-sm">
                <span>View Specifications</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ─── FEATURED PRODUCTS CAROUSEL ──────────────────────────────────────────────
 * Butter-smooth, zero-vibration horizontal scrolling powered directly by native
 * GPU-accelerated browser momentum scrolling and smooth snap points.
 */
export default function FeaturedProducts({
  products = [],
  savedProductIds = [],
  title = "Featured",
  subtitle = "Products",
  pretitle = "Our Curated Collection",
  backgroundLess = false,
}) {
  const railRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("All");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  // Native passive scroll listener for progress and edge state
  const handleScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    if (max > 0) {
      setScrollProgress(rail.scrollLeft / max);
      setAtStart(rail.scrollLeft <= 5);
      setAtEnd(rail.scrollLeft >= max - 5);
    } else {
      setScrollProgress(0);
      setAtStart(true);
      setAtEnd(true);
    }
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    handleScroll();
    rail.addEventListener("scroll", handleScroll, { passive: true });
    return () => rail.removeEventListener("scroll", handleScroll);
  }, [handleScroll, filteredProducts]);

  const scrollByCards = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * CARD_WIDTH, behavior: "smooth" });
  };

  return (
    <section
      className={`relative overflow-hidden text-[#141E17] ${
        backgroundLess ? "pt-8 pb-4" : "py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]"
      }`}
      style={{ fontFamily: sans }}
    >
      <div className="relative z-10 max-w-[1520px] mx-auto">
        {/* ─── Header Section (Editorial Split) ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 text-[10px] uppercase font-bold tracking-[0.25em] text-[#C29B5D] mb-3">
              <span className="w-5 h-[1.5px] bg-[#C29B5D]" />
              <span>{pretitle}</span>
            </div>

            {/* Headline */}
            <h2
              className="text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.12] tracking-tight text-[#141E17]"
              style={{ fontFamily: serif }}
            >
              <span>{title} </span>
              <span className="italic text-[#C29B5D] font-normal font-serif">
                {subtitle}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-[#5C665F] mt-2 font-light leading-relaxed">
              Behind every eco-luxury piece lies a certified wetland regeneration story and verifiable artisan lineage.
            </p>
          </div>

          {/* Right Action & Arrow Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link
              href="/user/products"
              className="text-xs uppercase tracking-widest text-[#141E17] font-bold hover:text-[#C29B5D] inline-flex items-center gap-1.5 transition-colors group"
            >
              <span>View All 2026 Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Circular Paging Arrows */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => scrollByCards(-1)}
                disabled={atStart}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full border border-[#D5CEC2] hover:border-[#141E17] text-[#141E17] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 bg-white shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollByCards(1)}
                disabled={atEnd}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full border border-[#D5CEC2] hover:border-[#141E17] text-[#141E17] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 bg-white shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Category Filter Chips ─── */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#141E17] text-[#FAF8F5] shadow-sm font-semibold"
                    : "bg-white text-[#5C665F] hover:text-[#141E17] border border-[#EAE3D6] hover:border-[#C29B5D]"
                }`}
              >
                {cat === "All" ? `All Pieces (${products.length})` : cat}
              </button>
            ))}
          </div>
        )}

        {/* ─── Hardware-Accelerated Smooth Horizontal Product Rail (Zero Vibration) ─── */}
        <div className="relative">
          <div
            ref={railRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isLiked={savedProductIds?.includes(product._id.toString())}
              />
            ))}
          </div>
        </div>

        {/* ─── Scroll Progress Indicator ─── */}
        <div className="relative h-[2px] w-full max-w-[200px] mx-auto mt-2 bg-[#E2DBD0] overflow-hidden rounded-full">
          <div
            className="h-full bg-[#C29B5D] rounded-full transition-all duration-150"
            style={{ width: `${Math.max(scrollProgress * 100, 25)}%` }}
          />
        </div>
      </div>
    </section>
  );
}