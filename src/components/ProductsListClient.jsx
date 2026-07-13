"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Heart,
  ShoppingCart,
  Package,
  X,
  Eye,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

/* ----------------------------------------------------------------------- */
/* Small building blocks                                                   */
/* ----------------------------------------------------------------------- */

function LikeBurst() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: 1, y: -26, scale: 1 }}
      exit={{ opacity: 0, y: -38 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pointer-events-none absolute -top-1 right-0 text-[#C8A97A] z-30"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#C8A97A">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
}

function CartBurst() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: 1, y: -26, scale: 1 }}
      exit={{ opacity: 0, y: -38 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pointer-events-none absolute -top-1 left-0 text-[#4A6741] z-30"
    >
      <ShoppingCart size={16} className="fill-[#4A6741]" />
    </motion.div>
  );
}

function FacetCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 cursor-pointer group select-none">
      <span className="flex items-center gap-3">
        <span
          className={`relative h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-all duration-300 ${checked
            ? "bg-[#C8A97A] border-[#C8A97A]"
            : "bg-transparent border-[#ECE6DF] group-hover:border-[#C8A97A]/40"
            }`}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          )}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <span
          className={`text-[13px] tracking-wide transition-colors ${checked ? "text-white font-medium" : "text-white/60 group-hover:text-white"
            }`}
        >
          {label}
        </span>
      </span>
      {typeof count === "number" && (
        <span className="text-[11px] text-white/30 font-light">{count}</span>
      )}
    </label>
  );
}

function FacetSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 py-6 first:pt-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between mb-2 group"
      >
        <span
          className="text-[11px] font-bold tracking-[0.2em] uppercase text-white"
          style={{ fontFamily: sans }}
        >
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform duration-500 ease-out group-hover:text-white ${open ? "rotate-180" : ""
            }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Product Card                                                            */
/* ----------------------------------------------------------------------- */

export function StorefrontProductCard({ product, isLiked = false, onToggleSaved }) {
  const { status } = useSession();
  const router = useRouter();
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(isLiked);
  const [showBurst, setShowBurst] = useState(false);
  const [showCartBurst, setShowCartBurst] = useState(false);

  // 3D tilt-on-hover state
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handlePointerMoveCard = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const maxTilt = 5;
    setTilt({
      ry: (px - 0.5) * maxTilt * 2,
      rx: (0.5 - py) * maxTilt * 2,
    });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  const coverImg = product.images?.[0]?.url || "";
  const displayPrice = product.discountPrice ?? product.price;
  const isOutOfStock = product.stock === 0;

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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.minOrderQty || 1);
    setShowCartBurst(true);
    setTimeout(() => setShowCartBurst(false), 500);
  };

  const badgeStyles = {
    "BEST SELLER": "bg-[#C8A97A] text-white",
    "ECO CHOICE": "bg-[#FAF7F2] text-[#1C1C1A] border border-[#1C1C1A]/10",
    "NEW": "bg-[#1C1C1A] text-white",
    "LIMITED": "bg-[#C8A97A] text-white",
    "SPECIAL OFFER": "bg-[#1C1C1A] text-white",
    "OUT OF STOCK": "bg-white/90 text-[#1C1C1A]",
  };

  const getBadgeText = () => {
    if (isOutOfStock) return "OUT OF STOCK";
    if (product.category === "Eco & Sustainable") return "ECO CHOICE";
    if (product.discountPrice) return "SPECIAL OFFER";
    if (product.isBestSeller) return "BEST SELLER";
    if (product.stock > 0 && product.stock <= 5) return "LIMITED";
    if (product.isNew) return "NEW";
    return null;
  };

  const badgeText = getBadgeText();

  return (
    <motion.div
      ref={cardRef}
      style={{ perspective: 1000 }}
      className="group relative flex-shrink-0 w-full select-none"
    >
      <motion.div
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        onPointerMove={handlePointerMoveCard}
        onPointerLeave={resetTilt}
        style={{ transformStyle: "preserve-3d" }}
        className="relative bg-white rounded-sm overflow-hidden border border-[#E8DDD0] group-hover:border-[#C8A97A]/40 shadow-[0_2px_10px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-[border-color,box-shadow] duration-500 h-full flex flex-col"
      >
        {/* Image */}
        <Link href={`/user/products/${product._id}`} className="block relative aspect-[4/5] w-full overflow-hidden bg-[#FAF7F2]">
          {badgeText && (
            <span
              className={`absolute top-3 left-3 z-10 text-[10px] font-bold tracking-[0.2em] px-2.5 py-1 uppercase shadow-sm ${
                badgeStyles[badgeText] ?? "bg-[#1C1C1A] text-white"
              }`}
            >
              {badgeText}
            </span>
          )}

          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {coverImg ? (
              <img
                src={coverImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9E9088]">
                <Package size={32} className="stroke-1" />
              </div>
            )}
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
            initial={{ x: "-120%" }}
            whileHover={{ x: "120%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        </Link>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1" style={{ transform: "translateZ(20px)" }}>
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

          <div className="flex items-center justify-between mb-4 text-xs gap-2 mt-auto pt-2">
            <span className="flex items-center gap-1.5 text-[#9E9088] whitespace-nowrap uppercase tracking-widest text-[9px] font-bold">
              MOQ: {product.minOrderQty || 1}
            </span>
            <span className="text-[#1C1C1A] font-medium whitespace-nowrap">
              ₹{displayPrice.toLocaleString()}{" "}
              <span className="text-[#9E9088] font-light italic">onwards</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/user/products/${product._id}`}
              className="flex-1"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full relative flex items-center justify-center bg-white border border-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-white text-[#1C1C1A] text-[10px] font-bold tracking-[0.2em] uppercase py-3 transition-colors overflow-hidden cursor-pointer"
              >
                VIEW DETAILS
              </motion.button>
            </Link>

            {!isOutOfStock && (
              <motion.button
                onClick={handleAddToCart}
                aria-label="Add to cart"
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.08 }}
                className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[#ECE6DF] hover:border-[#4A6741] text-[#1C1C1A] hover:text-[#4A6741] transition-colors cursor-pointer"
              >
                <AnimatePresence>{showCartBurst && <CartBurst />}</AnimatePresence>
                <ShoppingCart size={14} strokeWidth={2} />
              </motion.button>
            )}

            <motion.button
              onClick={handleLikeClick}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[#ECE6DF] hover:border-[#C8A97A] transition-colors cursor-pointer"
            >
              <AnimatePresence>{showBurst && <LikeBurst />}</AnimatePresence>
              <motion.svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={liked ? "#C8A97A" : "none"}
                stroke={liked ? "#C8A97A" : "#9E9088"}
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

/* ----------------------------------------------------------------------- */
/* Main page: Full width grid + slide-out drawer                           */
/* ----------------------------------------------------------------------- */

export default function ProductsListClient({ initialProducts = [], savedProductIds = [] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const containerRef = useRef(null);
  const { addToCart } = useCart();

  const [products] = useState(initialProducts);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories((prev) => {
        if (!prev.includes(initialCategory)) {
          return [initialCategory];
        }
        return prev;
      });
    }
  }, [initialCategory]);

  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortKey, setSortKey] = useState("featured");

  const absoluteMaxPrice = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const effectiveMaxPrice = maxPrice ?? absoluteMaxPrice;

  const categoryFacets = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [products]);

  const materialFacets = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      if (p.material) counts[p.material] = (counts[p.material] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [products]);

  const toggleCategory = (name) =>
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  const toggleMaterial = (name) =>
    setSelectedMaterials((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setHideOutOfStock(false);
    setMaxPrice(null);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedMaterials.length +
    (hideOutOfStock ? 1 : 0) +
    (maxPrice && maxPrice < absoluteMaxPrice ? 1 : 0) +
    (search ? 1 : 0);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          selectedCategories.length === 0 || selectedCategories.includes(p.category);

        const matchesMaterial =
          selectedMaterials.length === 0 || selectedMaterials.includes(p.material);

        const effectivePrice = p.discountPrice ?? p.price;
        const matchesPrice = effectivePrice <= effectiveMaxPrice;

        const matchesStock = !hideOutOfStock || p.stock > 0;

        return (
          matchesSearch && matchesCategory && matchesMaterial && matchesPrice && matchesStock
        );
      })
      .sort((a, b) => {
        if (sortKey === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortKey === "price_asc")
          return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
        if (sortKey === "price_desc")
          return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
        return 0;
      });
  }, [products, search, selectedCategories, selectedMaterials, effectiveMaxPrice, hideOutOfStock, sortKey]);

  // GSAP Initial Page Reveal
  useEffect(() => {
    if (typeof window !== "undefined") {
      let ctx = gsap.context(() => {
        gsap.fromTo(".reveal-header", 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        );
        gsap.fromTo(".product-card-wrap",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out", delay: 0.2 }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, []);

  /* ------------------------------- Drawer Content -------------------------- */
  const DrawerContent = () => (
    <>
      <div className="flex items-center justify-between mb-8">
        <h3
          className="flex items-center gap-3 text-xs tracking-[0.3em] uppercase font-bold text-white"
          style={{ fontFamily: sans }}
        >
          <SlidersHorizontal size={14} className="text-[#C8A97A]" />
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-[10px] uppercase tracking-widest font-semibold text-[#C8A97A] hover:text-white"
          >
            Clear All
          </button>
        )}
      </div>

      <FacetSection title="Categories">
        <div>
          {categoryFacets.map((c) => (
            <FacetCheckbox
              key={c.name}
              label={c.name}
              count={c.count}
              checked={selectedCategories.includes(c.name)}
              onChange={() => toggleCategory(c.name)}
            />
          ))}
        </div>
      </FacetSection>

      {materialFacets.length > 0 && (
        <FacetSection title="Material">
          <div>
            {materialFacets.map((m) => (
              <FacetCheckbox
                key={m.name}
                label={m.name}
                count={m.count}
                checked={selectedMaterials.includes(m.name)}
                onChange={() => toggleMaterial(m.name)}
              />
            ))}
          </div>
        </FacetSection>
      )}

      <FacetSection title="Price Range">
        <div className="space-y-4 pt-2">
          <div className="flex justify-between text-[11px] uppercase tracking-widest text-white/60 font-medium">
            <span>Up to</span>
            <span className="font-semibold text-white">
              ₹{effectiveMaxPrice.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={absoluteMaxPrice || 10000}
            step="50"
            value={effectiveMaxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-[2px] bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C8A97A]"
          />
          <div className="flex justify-between text-[10px] text-white/30">
            <span>₹0</span>
            <span>₹{(absoluteMaxPrice || 10000).toLocaleString()}</span>
          </div>
        </div>
      </FacetSection>

      <FacetSection title="Availability" defaultOpen={false}>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <span className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={hideOutOfStock}
              onChange={(e) => setHideOutOfStock(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#C8A97A] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C8A97A]" />
          </span>
          <span className="text-[13px] text-white/60">Hide Out of Stock</span>
        </label>
      </FacetSection>
    </>
  );

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#FAF7F2] text-[#1C1C1A]" style={{ fontFamily: sans }}>
      
      {/* ─── Cinematic Page Header ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 bg-[#1C1C1A] text-white border-b border-[#C8A97A]/20">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center reveal-header">
          <p className="flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-[#C8A97A] mb-4 font-bold">
            <span className="w-8 h-px bg-[#C8A97A]/50" />
            The Complete Catalog
            <span className="w-8 h-px bg-[#C8A97A]/50" />
          </p>
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-tight mb-4" style={{ fontFamily: serif }}>
            Curated <span className="italic text-[#C8A97A]">Elegance.</span>
          </h1>
          <p className="text-white/60 text-sm max-w-md font-light leading-relaxed">
            Discover our entire collection of sustainable, artisan-crafted luxury pieces designed to elevate your space.
          </p>
        </div>
      </section>

      {/* ─── Top Utility Bar ────────────────────────────────────────────── */}
      <div className="sticky top-[90px] lg:top-[110px] z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DDD0] py-4 px-6 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 bg-[#1C1C1A] text-white px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#C8A97A] transition-colors shadow-md"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-[#C8A97A] text-white flex items-center justify-center text-[9px]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-xs text-[#9E9088] font-medium hidden sm:inline-block">
              {filteredProducts.length} Results
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9088]" />
              <input
                type="text"
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E8DDD0] bg-white text-xs focus:outline-none focus:border-[#C8A97A] transition-colors text-[#1C1C1A] shadow-sm"
              />
            </div>

            {/* Sort */}
            <div className="relative bg-white border border-[#E8DDD0] rounded-full px-4 py-2.5 flex items-center gap-2 shrink-0 shadow-sm hover:border-[#C8A97A] transition-colors">
              <ArrowUpDown size={12} className="text-[#1C1C1A]" />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="bg-transparent text-[11px] uppercase tracking-widest text-[#1C1C1A] font-bold focus:outline-none cursor-pointer pr-2 appearance-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low</option>
                <option value="price_desc">Price: High</option>
              </select>
            </div>
          </div>
          
        </div>
      </div>

      {/* ─── Main Content Area ──────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Universal Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              {/* Dark Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              
              {/* Drawer Panel */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 h-full w-[85%] max-w-sm bg-[#1C1C1A] shadow-2xl z-50 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-2xl text-white font-light" style={{ fontFamily: serif }}>
                    Refine <span className="italic text-[#C8A97A]">Search</span>
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Scrollable Filters */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#C8A97A] scrollbar-track-transparent">
                  <DrawerContent />
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-[#151514]">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-[#C8A97A] text-[#1C1C1A] text-[10px] font-bold uppercase tracking-[0.2em] py-4 rounded-sm hover:bg-white transition-colors shadow-lg"
                  >
                    View {filteredProducts.length} Results
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ─── Full Width Product Grid ──────────────────────────────────── */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-md border border-[#E8DDD0] p-24 text-center shadow-sm">
              <Package size={48} className="mx-auto text-[#9E9088] mb-4" strokeWidth={1} />
              <h3 className="text-2xl font-light text-[#1C1C1A]" style={{ fontFamily: serif }}>
                No pieces found
              </h3>
              <p className="text-sm text-[#6B6560] mt-2 max-w-sm mx-auto font-light leading-relaxed">
                We couldn't find any products matching those exact criteria. Try adjusting your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-8 inline-flex items-center gap-2 bg-[#1C1C1A] text-white px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-[#C8A97A] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
              {filteredProducts.map((product) => (
                <div key={product._id} className="product-card-wrap h-full flex">
                  <StorefrontProductCard
                    product={product}
                    isLiked={savedProductIds?.includes(product._id.toString())}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}