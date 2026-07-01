"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Heart,
  Package,
  X,
  Eye,
  ChevronDown,
} from "lucide-react";

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
      className="pointer-events-none absolute -top-1 right-0 text-[#4A6741] z-30"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#4A6741">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
}

// Checkbox row used in the sidebar facets (Categories / Material)
function FacetCheckbox({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-2 py-1.5 cursor-pointer group select-none">
      <span className="flex items-center gap-2.5">
        <span
          className={`relative h-4 w-4 rounded-[4px] border flex items-center justify-center transition-colors ${checked
              ? "bg-[#4A6741] border-[#4A6741]"
              : "bg-white border-[#D9CFC2] group-hover:border-[#4A6741]/50"
            }`}
        >
          {checked && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <span
          className={`text-[13px] transition-colors ${checked ? "text-[#1C1C1A] font-medium" : "text-[#6B6560] group-hover:text-[#1C1C1A]"
            }`}
        >
          {label}
        </span>
      </span>
      {typeof count === "number" && (
        <span className="text-[11px] text-[#B0A89D]">{count}</span>
      )}
    </label>
  );
}

// Collapsible section wrapper for the sidebar (Categories, Material, Price...)
function FacetSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#ECE6DF] py-5 first:pt-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between mb-1"
      >
        <span
          className="text-[13px] font-semibold tracking-wide text-[#1C1C1A]"
          style={{ fontFamily: sans }}
        >
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`text-[#9E9088] transition-transform duration-300 ${open ? "rotate-180" : ""
            }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
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
/* Product Card — image badge, Quick View overlay, details, CTA row        */
/* ----------------------------------------------------------------------- */

export function StorefrontProductCard({ product, onQuickView, isLiked = false, onToggleSaved }) {
  const { status } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(isLiked);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

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

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  // Badge priority: out of stock > best seller > new > limited > special offer > eco choice
  const getBadge = () => {
    if (isOutOfStock) return { text: "OUT OF STOCK", style: "bg-[#1C1C1A] text-white" };
    if (product.isBestSeller) return { text: "BEST SELLER", style: "bg-[#1C1C1A] text-white" };
    if (product.isNew) return { text: "NEW", style: "bg-[#4A6741] text-white" };
    if (product.stock > 0 && product.stock <= 5) return { text: "LIMITED", style: "bg-[#D98C5F] text-white" };
    if (product.discountPrice !== null && product.discountPrice !== undefined)
      return { text: "SPECIAL OFFER", style: "bg-[#8FBD84] text-[#1C1C1A]" };
    if (product.category === "Eco & Sustainable")
      return { text: "ECO CHOICE", style: "bg-[#4A6741] text-white" };
    return null;
  };

  const badge = getBadge();

  return (
    <Link href={`/user/products/${product._id}`}>
      <motion.div
        className="group relative flex-shrink-0 w-full select-none text-left cursor-pointer"
      >
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 240, damping: 20 }}
          className="relative bg-white rounded-2xl overflow-hidden border border-[#ECE6DF] group-hover:border-[#4A6741]/30 shadow-[0_2px_12px_rgba(28,28,26,0.03)] group-hover:shadow-[0_16px_36px_rgba(28,28,26,0.1)] transition-[border-color,box-shadow] duration-300 flex flex-col h-full"
        >
          {/* Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6F2EC] border-b border-[#ECE6DF]/50">
            {badge && (
              <span
                className={`absolute top-3 left-3 z-10 text-[9px] font-semibold tracking-wider px-2.5 py-1 rounded-full shadow-sm ${badge.style}`}
              >
                {badge.text}
              </span>
            )}

            {coverImg ? (
              <img
                src={coverImg}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9E9088]">
                <Package size={32} className="stroke-1" />
              </div>
            )}

            {/* Quick View overlay button, fades in on hover */}
            <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={handleQuickView}
                className="flex items-center gap-1.5 bg-white text-[#1C1C1A] text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:bg-[#4A6741] hover:text-white transition-colors"
              >
                <Eye size={13} /> Quick View
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-1">
              <span
                className="italic text-[11px] tracking-wide text-[#C8A97A] font-medium"
                style={{ fontFamily: serif }}
              >
                {product.category}
              </span>
              <h4
                className="font-semibold text-[#1C1C1A] text-lg mt-0.5 leading-snug line-clamp-2 group-hover:text-[#4A6741] transition-colors"
                style={{ fontFamily: serif }}
              >
                {product.name}
              </h4>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-[#6B6560]">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8A97A]" />
                MOQ: {product.minOrderQty || 1}
              </span>
              <span className="font-semibold text-[#1C1C1A]">
                ₹{displayPrice.toLocaleString()}{" "}
                <span className="font-normal text-[#9E9088]">onwards</span>
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ECE6DF]/50 flex items-center gap-2">
              <button className="flex-1 bg-[#1C1C1A] text-white hover:bg-[#4A6741] text-[11px] font-semibold uppercase tracking-wider py-2.5 rounded-xl transition shadow-sm text-center">
                Request Quote
              </button>

              <button
                onClick={handleLikeClick}
                className="w-9 h-9 shrink-0 rounded-full border border-[#ECE6DF] hover:border-[#4A6741]/30 flex items-center justify-center bg-white text-[#9E9088] hover:text-[#4A6741] transition-colors relative shadow-sm"
                aria-label="Add to wishlist"
              >
                <Heart size={13} className={liked ? "fill-[#4A6741] stroke-[#4A6741]" : ""} />
                <AnimatePresence>{showBurst && <LikeBurst />}</AnimatePresence>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}

/* ----------------------------------------------------------------------- */
/* Main page: sidebar facets + grid                                        */
/* ----------------------------------------------------------------------- */

export default function ProductsListClient({ initialProducts = [], savedProductIds = [] }) {
  const [products] = useState(initialProducts);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortKey, setSortKey] = useState("featured");

  const absoluteMaxPrice = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const effectiveMaxPrice = maxPrice ?? absoluteMaxPrice;

  // Build category facet with live counts
  const categoryFacets = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [products]);

  // Build material facet only if products actually carry a `material` field
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
        return 0; // "featured" — keep original order
      });
  }, [products, search, selectedCategories, selectedMaterials, effectiveMaxPrice, hideOutOfStock, sortKey]);

  /* ------------------------------- Sidebar content, reused for mobile drawer */
  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-1">
        <h3
          className="flex items-center gap-2 text-lg font-semibold text-[#1C1C1A]"
          style={{ fontFamily: serif }}
        >
          <SlidersHorizontal size={16} className="text-[#4A6741]" />
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-[#D98C5F] hover:text-[#b96f44] hover:underline"
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
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#6B6560] font-medium">
            <span>Up to</span>
            <span className="font-semibold text-[#4A6741]">
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
            className="w-full h-1 bg-[#ECE6DF] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
          />
          <div className="flex justify-between text-[10px] text-[#9E9088]">
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
            <div className="w-9 h-5 bg-[#ECE6DF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A6741]" />
          </span>
          <span className="text-[13px] text-[#6B6560]">Hide Out of Stock</span>
        </label>
      </FacetSection>
    </>
  );

  return (
    <main className="relative min-h-screen bg-[#FAF7F2] text-[#1C1C1A]" style={{ fontFamily: sans }}>
      {/* Slim decorative band under the nav */}
      <div className="relative h-24 bg-[#1C1C1A] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,103,65,0.25)_0%,transparent_70%)]" />
      </div>

      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Top bar: search + count + sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-[#6B6560]">
              Showing <span className="font-semibold text-[#1C1C1A]">{filteredProducts.length}</span>{" "}
              products
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9088]" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-[#E8DDD0] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A]"
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden p-2.5 rounded-full border border-[#E8DDD0] bg-white text-[#6B6560] hover:bg-[#FAF7F2] flex items-center justify-center relative"
            >
              <SlidersHorizontal size={14} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#4A6741] text-white text-[9px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative bg-white border border-[#E8DDD0] rounded-full px-3 py-2 flex items-center gap-1.5 shrink-0">
              <ArrowUpDown size={12} className="text-[#9E9088]" />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="bg-transparent text-xs text-[#6B6560] font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low-High</option>
                <option value="price_desc">Price: High-Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 bg-white rounded-2xl border border-[#ECE6DF] p-6 shadow-sm">
              <SidebarContent />
            </div>
          </aside>

          {/* Mobile drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed left-0 top-0 h-full w-[82%] max-w-xs bg-white z-50 p-6 overflow-y-auto lg:hidden"
                >
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="absolute top-5 right-5 text-[#9E9088]"
                  >
                    <X size={18} />
                  </button>
                  <div className="mt-6">
                    <SidebarContent />
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="mt-6 w-full bg-[#4A6741] text-white text-xs font-semibold uppercase tracking-wider py-3 rounded-xl"
                  >
                    Show {filteredProducts.length} Results
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <div>
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ECE6DF] p-16 text-center shadow-sm">
                <Package size={48} className="mx-auto text-[#9E9088] mb-3" />
                <h3 className="text-lg font-medium text-[#1C1C1A]" style={{ fontFamily: serif }}>
                  No collections found
                </h3>
                <p className="text-sm text-[#9E9088] mt-1 max-w-sm mx-auto font-light leading-relaxed">
                  We couldn't find any products matching your filters. Try clearing filters or
                  searching for something else.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E8DDD0] bg-white px-5 py-2 text-xs font-semibold text-[#1C1C1A] hover:bg-[#FAF7F2] transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <StorefrontProductCard
                    key={product._id}
                    product={product}
                    isLiked={savedProductIds?.includes(product._id.toString())}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}