"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Heart,
  MessageSquare,
  Check,
  Star,
  X,
  Package,
  Sparkles,
} from "lucide-react";
import { StorefrontProductCard } from "./ProductsListClient";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

export default function ProductDetailClient({ product, similarProducts = [], isLiked = false, savedProductIds = [] }) {
  const { status } = useSession();
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "specifications" | "applications" | "reviews"
  const [liked, setLiked] = useState(isLiked);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  // Quote form states
  const [quoteForm, setQuoteForm] = useState({
    companyName: "",
    gstNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    quantity: product.minOrderQty || 50,
    targetBudget: "",
    additionalInfo: "",
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const images = product.images || [];
  const activeImage = images[activeImageIndex]?.url || "";
  const displayPrice = product.discountPrice ?? product.price;
  const isOutOfStock = product.stock === 0;

  // Highlights 2x2 grid based on category
  const getHighlights = () => {
    const cat = product.category;
    if (cat === "Home & Living" || cat === "Home Decor") {
      return [
        "Hand-carved edges",
        "Large serving surface",
        "Non-slip base",
        "Natural grain visible",
      ];
    }
    if (cat === "Kitchen & Dining") {
      return [
        "Food-grade lacquer",
        "100% natural wood",
        "Heat & moisture resistant",
        "Ergonomic handle grip",
      ];
    }
    if (cat === "Eco & Sustainable") {
      return [
        "100% Biodegradable",
        "Zero plastic packaging",
        "Sustainably sourced fibers",
        "Carbon-neutral shipping",
      ];
    }
    return [
      "Artisan handcrafted",
      "Traditional Indian craft",
      "Eco-friendly finish",
      "Premium quality materials",
    ];
  };

  // Applications list based on category
  const getApplications = () => {
    const cat = product.category;
    if (cat === "Home & Living" || cat === "Home Decor") {
      return ["Dining table", "Hotel breakfast service", "Gift item", "Home decor"];
    }
    if (cat === "Kitchen & Dining") {
      return ["Eco dining", "Restaurant buffet", "Kitchen display", "Culinary plating"];
    }
    return ["Eco styling", "Corporate gifting", "Artisan showcase", "Zero waste household"];
  };

  // Mock specs table
  const getSpecs = () => {
    const specs = [
      { key: "Material", value: product.category === "Kitchen & Dining" || product.category === "Home & Living" ? "100% Natural Bamboo" : "Ethically sourced sustainable materials" },
    ];
    if (product.length || product.width || product.height) {
      specs.push({
        key: "Dimensions",
        value: `${product.length || 40} * ${product.width || 28} * ${product.height || 5} cm`,
      });
    }
    specs.push({ key: "Weight", value: product.weight ? `${product.weight}g` : "650g" });
    specs.push({ key: "Finish", value: "Food-grade organic lacquer" });
    specs.push({ key: "Color", value: "Natural wood grain" });
    specs.push({ key: "Care", value: "Hand wash, dry immediately" });
    
    // Add additional custom specs
    if (product.specs && product.specs.length > 0) {
      product.specs.forEach((s) => specs.push({ key: s.key, value: s.value }));
    }
    return specs;
  };

  const highlights = getHighlights();
  const applications = getApplications();
  const specs = getSpecs();

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setSubmittingQuote(true);
    // Simulate API call
    setTimeout(() => {
      setSubmittingQuote(false);
      setQuoteSubmitted(true);
      // Reset form
      setQuoteForm({
        companyName: "",
        gstNumber: "",
        contactPerson: "",
        email: "",
        phone: "",
        quantity: product.minOrderQty || 50,
        targetBudget: "",
        additionalInfo: "",
      });
    }, 1500);
  };

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
    setQuoteSubmitted(false);
  };

  return (
    <main
      className="min-h-screen bg-[#FAF7F2] text-[#1C1C1A] pb-24 pt-6"
      style={{ fontFamily: sans }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs matching video */}
        <div className="flex items-center gap-2 text-xs text-[#9E9088] mb-8 border-b border-[#ECE6DF]/60 pb-4">
          <Link href="/" className="hover:text-[#4A6741] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/user/products" className="hover:text-[#4A6741] transition">
            Products
          </Link>
          <span>/</span>
          <span className="text-[#6B6560] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        {/* Dynamic Split details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white rounded-3xl border border-[#ECE6DF] p-6 sm:p-8 shadow-[0_4px_24px_rgba(28,28,26,0.02)]">
          {/* Left Column: Image showcase with thumbnails */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F6F2EC] border border-[#ECE6DF]/50 flex items-center justify-center">
              {activeImage ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={activeImage}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              ) : (
                <div className="text-[#9E9088] flex flex-col items-center gap-2">
                  <Package size={48} className="stroke-1" />
                  <span className="text-xs">No image preview available</span>
                </div>
              )}
            </div>

            {/* Thumbnails row */}
            {images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {images.map((img, index) => {
                  const active = index === activeImageIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden bg-[#F6F2EC] border transition-all ${
                        active
                          ? "border-[#4A6741] ring-2 ring-[#4A6741]/10"
                          : "border-[#ECE6DF] hover:border-[#9E9088]"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Copy and B2B ordering options */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div className="space-y-3">
              <span className="text-xs tracking-wider uppercase text-[#C8A97A] font-semibold">
                {product.category}
              </span>
              <h1
                className="text-3xl sm:text-4xl font-semibold text-[#1C1C1A] leading-tight"
                style={{ fontFamily: serif }}
              >
                {product.name}
              </h1>
              
              {/* Prices matching video style */}
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-3xl font-bold text-[#1C1C1A]">
                  ₹{displayPrice.toLocaleString()} onwards
                </span>
                <span className="text-xs text-[#9E9088] tracking-wide ml-1">
                  per unit
                </span>
              </div>

              {/* MOQ Indicator */}
              <div className="flex items-center gap-2 text-xs text-[#6B6560] pt-1">
                <span className="h-5 w-5 rounded-full bg-[#FAF7F2] border border-[#ECE6DF] flex items-center justify-center text-[#C8A97A] font-bold">
                  ○
                </span>
                <span>Minimum Order: <span className="font-semibold">{product.minOrderQty || 50} units</span></span>
              </div>

              {/* Status Badge */}
              <div className="pt-1">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 border border-red-200">
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    In Stock
                  </span>
                )}
              </div>
            </div>

            {/* Description paragraph */}
            <p className="text-[#6B6560] text-sm leading-relaxed font-light">
              {product.description}
            </p>

            {/* B2B Action Buttons Row */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A6741] hover:bg-[#3a5233] text-white py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <MessageSquare size={14} /> Request Quote
              </button>

              <button
                onClick={async () => {
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
                      setLiked(data.saved);
                    }
                  } catch (err) {
                    console.error("Error toggling saved status:", err);
                  }
                }}
                className={`px-5 py-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition ${
                  liked
                    ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                    : "bg-white border-[#E8DDD0] text-[#6B6560] hover:bg-[#FAF7F2]"
                }`}
              >
                <Heart size={14} className={liked ? "fill-red-600 stroke-red-600" : ""} />
                {liked ? "Saved" : "Save"}
              </button>
            </div>

            {/* Highlight Bullets 2x2 Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 border-t border-[#ECE6DF]/50">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#6B6560]">
                  <span className="text-[#4A6741] font-semibold text-sm">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Interactive Tabs specifications panel */}
            <div className="pt-6">
              {/* Tab Header Buttons */}
              <div className="flex border-b border-[#ECE6DF] text-xs font-semibold tracking-wider text-[#9E9088] mb-4">
                {[
                  { id: "description", label: "DESCRIPTION" },
                  { id: "specifications", label: "SPECIFICATIONS" },
                  { id: "applications", label: "APPLICATIONS" },
                  { id: "reviews", label: "REVIEWS (67)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 pr-4 sm:pr-6 border-b-2 transition relative ${
                      activeTab === tab.id
                        ? "text-[#1C1C1A] border-[#4A6741]"
                        : "border-transparent hover:text-[#1C1C1A]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content Display */}
              <div className="text-xs leading-relaxed text-[#6B6560] min-h-[140px]">
                {activeTab === "description" && (
                  <p className="font-light leading-relaxed">{product.description}</p>
                )}

                {activeTab === "specifications" && (
                  <div className="border border-[#ECE6DF] rounded-xl overflow-hidden divide-y divide-[#ECE6DF]">
                    {specs.map((s, i) => (
                      <div key={i} className="grid grid-cols-3 p-3 bg-white hover:bg-[#FAF7F2]/40 transition">
                        <span className="text-[#9E9088] font-medium">{s.key}</span>
                        <span className="col-span-2 text-[#1C1C1A] font-semibold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "applications" && (
                  <div className="flex flex-wrap gap-2.5">
                    {applications.map((app, i) => (
                      <span
                        key={i}
                        className="bg-white border border-[#E8DDD0] rounded-xl px-4 py-2.5 font-medium text-[#1C1C1A] text-xs shadow-sm hover:border-[#4A6741]/40 hover:bg-[#4A6741]/5 transition"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {[
                      { name: "Amit B.", rating: 5, comment: "Great quality and eco-friendly. Perfect for our office." },
                      { name: "Sneha R.", rating: 5, comment: "Exceeded expectations. Will order again." },
                    ].map((rev, i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-[#ECE6DF] space-y-1 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#1C1C1A]">{rev.name}</span>
                          <div className="flex text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, r) => (
                              <Star key={r} size={10} className="fill-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="font-light text-[#6B6560]">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Recommendation Rail */}
        {similarProducts.length > 0 && (
          <section className="mt-20 border-t border-[#ECE6DF] pt-12">
            <div className="text-center mb-8">
              <span className="h-px w-8 bg-[#C8A97A]/60 inline-block mr-2 align-middle" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C8A97A] align-middle font-semibold">
                You May Also Like
              </span>
              <span className="h-px w-8 bg-[#C8A97A]/60 inline-block ml-2 align-middle" />
              <h3
                className="text-3xl font-light text-[#1C1C1A] mt-2"
                style={{ fontFamily: serif }}
              >
                Related <span className="italic text-[#4A6741]">Products</span>
              </h3>
              <div className="h-[2px] w-14 bg-[#C8A97A] mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <StorefrontProductCard
                  key={p._id}
                  product={p}
                  isLiked={savedProductIds?.includes(p._id.toString())}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Quote inquiry modal */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeQuoteModal}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-xl bg-white border border-[#ECE6DF] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 m-4 overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={closeQuoteModal}
                className="absolute top-4 right-4 text-[#9E9088] hover:text-[#1C1C1A] p-1.5 rounded-full hover:bg-[#FAF7F2] transition"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] tracking-widest uppercase text-[#C8A97A] font-bold">
                  Bulk Order inquiry
                </span>
                <h3
                  className="text-2xl font-semibold text-[#1C1C1A] mt-1"
                  style={{ fontFamily: serif }}
                >
                  Request a Quote
                </h3>
                <p className="text-xs text-[#9E9088] mt-1.5">
                  Pre-filled item: <span className="font-semibold text-[#4A6741]">{product.name}</span>
                </p>
              </div>

              {quoteSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <Check size={22} />
                  </div>
                  <h4 className="text-lg font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>
                    Quote request submitted!
                  </h4>
                  <p className="text-xs text-[#6B6560] max-w-sm mx-auto font-light leading-relaxed">
                    Thank you for your bulk order inquiry. An artisan partnerships manager will review your target budget and email your custom quote within 24 hours.
                  </p>
                  <button
                    onClick={closeQuoteModal}
                    className="mt-4 rounded-full bg-[#1C1C1A] text-white hover:bg-[#4A6741] text-xs font-semibold uppercase tracking-wider py-2.5 px-6 transition"
                  >
                    Back to product
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
                        Company Name
                      </label>
                      <input
                        required
                        type="text"
                        value={quoteForm.companyName}
                        onChange={(e) => setQuoteForm({ ...quoteForm, companyName: e.target.value })}
                        placeholder="e.g. EcoHotels Ltd"
                        className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
                        GST Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={quoteForm.gstNumber}
                        onChange={(e) => setQuoteForm({ ...quoteForm, gstNumber: e.target.value })}
                        placeholder="22AAAAA0000A1Z5"
                        className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
                        Contact Person
                      </label>
                      <input
                        required
                        type="text"
                        value={quoteForm.contactPerson}
                        onChange={(e) => setQuoteForm({ ...quoteForm, contactPerson: e.target.value })}
                        placeholder="Ananya Sharma"
                        className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        placeholder="buyer@yourcompany.com"
                        className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
                        Quantity Required
                      </label>
                      <input
                        required
                        type="number"
                        min={product.minOrderQty || 1}
                        value={quoteForm.quantity}
                        onChange={(e) => setQuoteForm({ ...quoteForm, quantity: parseInt(e.target.value) || "" })}
                        className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
                      Target Budget per unit (₹, Optional)
                    </label>
                    <input
                      type="number"
                      value={quoteForm.targetBudget}
                      onChange={(e) => setQuoteForm({ ...quoteForm, targetBudget: e.target.value })}
                      placeholder="e.g. 600"
                      className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">
                      Additional Requirements / Customization
                    </label>
                    <textarea
                      rows={3}
                      value={quoteForm.additionalInfo}
                      onChange={(e) => setQuoteForm({ ...quoteForm, additionalInfo: e.target.value })}
                      placeholder="Specify engraving, custom branding options, target delivery dates..."
                      className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition"
                    />
                  </div>

                  <button
                    required
                    type="submit"
                    disabled={submittingQuote}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A6741] hover:bg-[#3a5233] text-white py-3 text-xs font-semibold uppercase tracking-wider transition disabled:opacity-60 shadow-sm mt-2"
                  >
                    {submittingQuote ? "Submitting Inquiry..." : "Submit Quote Request"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
