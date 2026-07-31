"use client";
import Image from "next/image";

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
  ShoppingCart,
  Download,
  Box
} from "lucide-react";
import { StorefrontProductCard } from "./ProductsListClient";
import FeaturedProducts from "./Featuredproducts";
import { useCart } from "@/context/CartContext";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

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

  const { addToCart, applyPromo, promoCode, discountPercentage } = useCart();

  const [modalMode, setModalMode] = useState("cart"); // "cart" or "quote"
  const [activePromo, setActivePromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchActivePromo = async () => {
      try {
        const res = await fetch("/api/promos/active");
        if (res.ok) {
          const data = await res.json();
          setActivePromo(data.promo);
        }
      } catch (err) {
        console.error("Failed to fetch active promo", err);
      }
    };
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${product._id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchActivePromo();
    fetchReviews();
  }, [product._id]);

  const handleApplyPromo = async () => {
    if (!activePromo) return;
    setPromoLoading(true);
    setPromoMessage({ text: "", type: "" });
    try {
      const res = await fetch("/api/promos/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: activePromo.code }),
      });
      const data = await res.json();
      if (res.ok) {
        applyPromo(data.code, data.discountPercentage);
        setPromoMessage({ text: `Code applied! ${data.discountPercentage}% off.`, type: "success" });
      } else {
        setPromoMessage({ text: data.error, type: "error" });
      }
    } catch (err) {
      setPromoMessage({ text: "Error applying code.", type: "error" });
    } finally {
      setPromoLoading(false);
    }
  };

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

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setShowReviewModal(false);
        setReviewForm({ rating: 5, comment: "" });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmittingReview(false);
    }
  };

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

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, quoteForm.quantity, quoteForm.targetBudget);
    setQuoteSubmitted(true);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmittingQuote(true);

    if (status === "authenticated") {
      fetch("/api/user/track-quote", { method: "POST" }).catch(() => { });
    }

    const waMessage = `🌿 *NEW BULK ORDER INQUIRY* 🌿
    
📦 *PRODUCT DETAILS*
▪️ *Item:* ${product.name}
▪️ *Quantity:* ${quoteForm.quantity} units
▪️ *Target Budget:* ${quoteForm.targetBudget ? '₹' + quoteForm.targetBudget : 'Not specified'}

🏢 *CUSTOMER PROFILE*
▪️ *Company:* ${quoteForm.companyName}
▪️ *Contact:* ${quoteForm.contactPerson}
▪️ *Phone:* ${quoteForm.phone}
▪️ *Email:* ${quoteForm.email}
▪️ *GST:* ${quoteForm.gstNumber || 'N/A'}

📝 *ADDITIONAL NOTES*
${quoteForm.additionalInfo || '_No additional requirements specified._'}

-----------------------------------
_Sent via KrisluxECO B2B Portal_`;

    const adminPhone = "6202585952";
    const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(waMessage)}`;

    try {
      await fetch("/api/user/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quoteForm, productName: product.name }),
      });
    } catch (err) {
      console.error("Failed to send email", err);
    }

    setSubmittingQuote(false);
    setQuoteSubmitted(true);

    window.open(waUrl, "_blank");

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
  };

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
    setTimeout(() => setQuoteSubmitted(false), 300);
  };

  return (
    <main
      className="min-h-screen bg-white text-[#1C1C1A] pb-24 pt-32"
      style={{ fontFamily: sans }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#9E9088] mb-12 border-b border-[#ECE6DF]/60 pb-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Vertical thumbnails + Main Image */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-12">

            {/* Thumbnails (vertical on desktop) */}
            {images.length > 0 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-20 shrink-0 py-1 scrollbar-hide">
                {images.map((img, index) => {
                  const active = index === activeImageIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-20 md:w-full h-20 md:h-24 shrink-0 rounded-sm overflow-hidden bg-[#F8F6F3] border transition-all ${active
                        ? "border-[#1C1C1A] ring-1 ring-[#1C1C1A]/20"
                        : "border-transparent hover:border-[#ECE6DF]"
                        }`}
                    >
                      <Image width={800} height={800}
                        src={img.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Image */}
            <div className="relative aspect-square w-full bg-[#F8F6F3] flex items-center justify-center overflow-hidden rounded-sm">
              {activeImage ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={activeImage}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full object-contain"
                  />
                </AnimatePresence>
              ) : (
                <div className="text-[#9E9088] flex flex-col items-center gap-2">
                  <Package size={48} className="stroke-1" />
                  <span className="text-[10px] uppercase tracking-wider">No Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Copy and B2B ordering options */}
          <div className="lg:col-span-6 flex flex-col space-y-8 pt-2 lg:pl-8">
            <div className="space-y-4">
              <span className="block text-[10px] tracking-[0.25em] uppercase text-[#C8A97A] font-bold">
                {product.category}
              </span>
              <h1
                className="text-4xl sm:text-5xl font-medium text-[#1C1C1A] leading-[1.15]"
                style={{ fontFamily: serif }}
              >
                {product.name}
              </h1>

              {/* Prices matching video style */}
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#1C1C1A]">
                    ₹{displayPrice.toLocaleString()} onwards
                  </span>
                  <span className="text-xs text-[#9E9088] tracking-wide ml-1">
                    per unit
                  </span>
                </div>
                {product.discountPrice && product.discountPrice < product.price && (
                  <div className="flex items-center gap-1.5 text-[13px] text-[#9E9088]">
                    <span>MRP:</span>
                    <span className="line-through decoration-[#9E9088]/60">₹{product.price.toLocaleString()}</span>
                    <span className="text-[#4A6741] font-semibold text-[10px] uppercase tracking-wider ml-2 bg-[#FAF7F2] border border-[#ECE6DF] px-2 py-0.5 rounded-sm">
                      Save ₹{(product.price - product.discountPrice).toLocaleString()}
                    </span>
                  </div>
                )}
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

            {/* Description paragraph (Truncated) */}
            <div className="relative">
              <p className="text-[#6B6560] text-sm leading-relaxed font-light line-clamp-3">
                {product.description}
              </p>
              {product.description?.length > 150 && (
                <button 
                  onClick={() => {
                    setActiveTab("description");
                    document.getElementById('product-accordions')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="text-[10px] uppercase tracking-wider font-bold text-[#C8A97A] hover:text-[#1C1C1A] transition-colors mt-2 inline-block"
                >
                  Read full description ↓
                </button>
              )}
            </div>

            {/* B2B Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => {
                  if (status !== "authenticated") return router.push("/login");
                  setModalMode("quote");
                  setShowQuoteModal(true);
                }}
                className="flex-[2] inline-flex items-center justify-center gap-2 bg-[#1C1C1A] hover:bg-[#C8A97A] text-white py-4 px-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 whitespace-nowrap"
              >
                <MessageSquare size={14} /> Request Quote Now
              </button>

              <button
                onClick={() => {
                  if (status !== "authenticated") return router.push("/login");
                  setModalMode("cart");
                  setShowQuoteModal(true);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-[#ECE6DF] hover:bg-[#FAF7F2] text-[#1C1C1A] py-4 px-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 whitespace-nowrap"
              >
                <ShoppingCart size={14} /> Add to Cart
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
                className={`w-14 h-[52px] shrink-0 border flex items-center justify-center transition-colors duration-300 ${liked
                  ? "border-[#1C1C1A] bg-[#1C1C1A] text-white"
                  : "border-[#ECE6DF] bg-transparent text-[#1C1C1A] hover:bg-[#FAF7F2]"
                  }`}
              >
                <Heart size={16} className={liked ? "fill-white stroke-white" : ""} strokeWidth={1.5} />
              </button>
            </div>

            {product.downloadableSpecSheetUrl && (
              <div className="flex gap-4 pt-2">
                <a
                  href={product.downloadableSpecSheetUrl}
                  target="_blank"
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-[#E8DDD0] hover:bg-[#FAF7F2] text-[#1C1C1A] py-2.5 px-4 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors duration-300"
                >
                  <Download size={14} /> Spec Sheet PDF
                </a>
              </div>
            )}



            {/* Promotional Banner in place of tabs */}
            {activePromo && (
              <div className="pt-8 pb-4">
                <div className="bg-[#FAF7F2] border border-[#C8A97A]/40 rounded-sm p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#ECE6DF]">
                        <Sparkles size={18} className="text-[#C8A97A]" />
                      </div>
                      <div>
                        <h4 className="text-[#1C1C1A] text-sm font-semibold" style={{ fontFamily: serif }}>Special Corporate Offer</h4>
                        <p className="text-[#6B6560] text-xs">Use code <span className="font-bold text-[#4A6741]">{activePromo.code}</span> for {activePromo.discountPercentage}% off bulk orders.</p>
                      </div>
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading || promoCode === activePromo.code}
                      className="text-[10px] uppercase tracking-wider font-bold text-[#C8A97A] border-b border-[#C8A97A] pb-0.5 hover:text-[#1C1C1A] hover:border-[#1C1C1A] transition-colors whitespace-nowrap ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {promoLoading ? "Applying..." : (promoCode === activePromo.code ? "Applied" : "Apply Now")}
                    </button>
                  </div>
                  {promoMessage.text && (
                    <p className={`text-[10px] mt-2 font-medium tracking-wide ${promoMessage.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                      {promoMessage.text}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tags Display */}
            {product.tags?.length > 0 && (
              <div className="pt-6 pb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                {product.tags.map((tag, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-[#8C837C] text-[10px] uppercase tracking-[0.25em] font-semibold">
                      {tag}
                    </span>
                    {i < product.tags.length - 1 && (
                      <div className="w-[3px] h-[3px] bg-[#C8A97A] rotate-45 opacity-60" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Vertical Stacked Accordions */}
            <div id="product-accordions" className="pt-4 border-t border-[#ECE6DF]/50 divide-y divide-[#ECE6DF]/60">
              {[
                { id: "description", label: "Description" },
                { id: "specifications", label: "Specifications" },
                { id: "highlights", label: "Product Highlights" },
              ].map((acc) => (
                <div key={acc.id} className="py-4">
                  <button
                    onClick={() => setActiveTab(activeTab === acc.id ? "" : acc.id)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className={`text-sm uppercase tracking-widest font-semibold transition-colors ${activeTab === acc.id ? "text-[#C8A97A]" : "text-[#1C1C1A] group-hover:text-[#C8A97A]"}`}>
                      {acc.label}
                    </span>
                    <span className="text-[#9E9088] font-light text-xl transition-transform duration-300" style={{ transform: activeTab === acc.id ? "rotate(45deg)" : "rotate(0deg)" }}>
                      +
                    </span>
                  </button>

                  <AnimatePresence>
                    {activeTab === acc.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pb-2 text-xs leading-relaxed text-[#6B6560]">
                          {acc.id === "description" && (
                            <p className="font-light leading-relaxed">{product.description}</p>
                          )}

                          {acc.id === "specifications" && (
                            <div className="border border-[#ECE6DF] rounded-xl overflow-hidden divide-y divide-[#ECE6DF]">
                              {specs.map((s, i) => (
                                <div key={i} className="grid grid-cols-3 p-3 bg-white hover:bg-[#FAF7F2]/40 transition">
                                  <span className="text-[#9E9088] font-medium">{s.key}</span>
                                  <span className="col-span-2 text-[#1C1C1A] font-semibold">{s.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {acc.id === "highlights" && (
                            <div className="flex flex-col gap-3">
                              {highlights.map((item, i) => (
                                <div key={i} className="flex items-start gap-2.5 text-[#1C1C1A]">
                                  <Check size={16} className="text-[#4A6741] mt-0.5 shrink-0" />
                                  <span className="leading-relaxed">{item}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Products Recommendation Rail */}
        {similarProducts.length > 0 && (
          <div className="mt-8 border-t border-[#ECE6DF]">
            <FeaturedProducts 
              products={similarProducts} 
              savedProductIds={savedProductIds}
              pretitle="You May Also Like"
              title="Similar"
              subtitle="Products"
            />
          </div>
        )}

        {/* Why KrisluxEco Strip */}
        <section className="mt-12 border-y border-[#ECE6DF] bg-[#FAF7F2] py-12 px-6 lg:px-12 text-center flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-px bg-[#C8A97A]/40" />
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#C8A97A] font-bold">Why KrisluxEco</p>
            <span className="w-12 h-px bg-[#C8A97A]/40" />
          </div>
          <h2 className="text-3xl font-light text-[#1C1C1A] mb-8" style={{ fontFamily: serif }}>
            Our <span className="italic text-[#4A6741]">Commitment</span> to the Earth
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-5xl mx-auto text-[#6B6560] font-light">
            <div className="flex flex-col items-center gap-3">
              <Sparkles size={24} className="text-[#C8A97A]" strokeWidth={1.5} />
              <span className="text-sm tracking-wide">100% Biodegradable</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Package size={24} className="text-[#C8A97A]" strokeWidth={1.5} />
              <span className="text-sm tracking-wide">Zero Plastic Packaging</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Box size={24} className="text-[#C8A97A]" strokeWidth={1.5} />
              <span className="text-sm tracking-wide">Carbon Neutral Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Heart size={24} className="text-[#C8A97A]" strokeWidth={1.5} />
              <span className="text-sm tracking-wide">Ethically Crafted</span>
            </div>
          </div>
        </section>

        {/* Global Reviews Section */}
        <section className="mt-20 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 border-b border-[#ECE6DF] pb-4 text-center md:text-left gap-4">
            <div>
              <h3 className="text-3xl font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>
                Customer <span className="italic text-[#C8A97A]">Reviews</span>
              </h3>
              <p className="text-[10px] text-[#9E9088] mt-2 tracking-[0.2em] uppercase">
                {reviews.length > 0 ? `Based on ${reviews.length} Review${reviews.length !== 1 ? 's' : ''}` : "Be the first to review"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {reviews.length > 0 && (
                <div className="flex flex-col items-center md:items-end gap-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, r) => {
                      const avg = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
                      return <Star key={r} size={16} className={r < Math.round(avg) ? "fill-amber-500" : "fill-[#ECE6DF] stroke-[#ECE6DF]"} />;
                    })}
                  </div>
                  <span className="text-xs text-[#1C1C1A] font-medium tracking-wide">
                    {(reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)} / 5.0 Average
                  </span>
                </div>
              )}
              <button
                onClick={() => {
                  if (status !== "authenticated") {
                    router.push("/login");
                  } else {
                    setShowReviewModal(true);
                  }
                }}
                className="bg-[#1C1C1A] text-white px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#C8A97A] transition-colors"
              >
                Write a Review
              </button>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white p-6 rounded-sm border border-[#E8DDD0] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-[#1C1C1A] transition-colors duration-500 flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-500 gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, r) => (
                        <Star key={r} size={14} className={r < rev.rating ? "fill-amber-500 stroke-none" : "fill-[#ECE6DF] stroke-none"} />
                      ))}
                    </div>
                    <p className="font-light text-[#6B6560] text-sm leading-relaxed italic break-words" style={{ fontFamily: serif }}>"{rev.comment}"</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#ECE6DF]/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[10px] font-bold text-[#4A6741]">
                        {rev.userName.charAt(0)}
                      </div>
                      <span className="font-semibold text-[#1C1C1A] text-[11px] uppercase tracking-wider truncate max-w-[120px]">{rev.userName}</span>
                    </div>
                    <span className="text-[9px] text-[#9E9088]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#FAF7F2] rounded-sm border border-[#ECE6DF]">
              <MessageSquare size={32} className="mx-auto text-[#C8A97A] mb-4 opacity-50" />
              <p className="text-[#6B6560] text-sm">No reviews yet. Share your experience with this product!</p>
            </div>
          )}
        </section>

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
              className={`relative w-full ${modalMode === "cart" ? "max-w-md" : "max-w-xl"} bg-white border border-[#ECE6DF] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 m-4 overflow-y-auto max-h-[90vh]`}
            >
              <button
                onClick={closeQuoteModal}
                className="absolute top-4 right-4 text-[#9E9088] hover:text-[#1C1C1A] p-1.5 rounded-full hover:bg-[#FAF7F2] transition"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] tracking-widest uppercase text-[#C8A97A] font-bold">
                  {modalMode === "cart" ? "Add to Quote Cart" : "Bulk Order Inquiry"}
                </span>
                <h3
                  className="text-2xl font-semibold text-[#1C1C1A] mt-1"
                  style={{ fontFamily: serif }}
                >
                  {modalMode === "cart" ? "Configure Quantity" : "Request a Quote"}
                </h3>
                <p className="text-xs text-[#9E9088] mt-1.5">
                  Item: <span className="font-semibold text-[#4A6741]">{product.name}</span>
                </p>
              </div>

              {quoteSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <Check size={22} />
                  </div>
                  <h4 className="text-lg font-semibold text-[#1C1C1A]" style={{ fontFamily: serif }}>
                    {modalMode === "cart" ? "Added to Quote Cart!" : "Quote request submitted!"}
                  </h4>
                  <p className="text-xs text-[#6B6560] max-w-sm mx-auto font-light leading-relaxed">
                    {modalMode === "cart"
                      ? "You can add more items to your list or proceed to checkout to request a quote for all items at once."
                      : "Thank you for your bulk order inquiry. An artisan partnerships manager will review your target budget and email your custom quote within 24 hours."}
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    {modalMode === "cart" ? (
                      <>
                        <button
                          onClick={closeQuoteModal}
                          className="rounded-full border border-[#ECE6DF] text-[#1C1C1A] hover:bg-[#FAF7F2] text-xs font-semibold uppercase tracking-wider py-2.5 px-6 transition"
                        >
                          Continue Shopping
                        </button>
                        <Link
                          href="/user/quote-cart"
                          className="rounded-full bg-[#1C1C1A] text-white hover:bg-[#4A6741] text-xs font-semibold uppercase tracking-wider py-2.5 px-6 transition"
                        >
                          View Cart
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={closeQuoteModal}
                        className="rounded-full bg-[#1C1C1A] text-white hover:bg-[#4A6741] text-xs font-semibold uppercase tracking-wider py-2.5 px-6 transition"
                      >
                        Back to product
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={modalMode === "cart" ? handleAddToCart : handleQuoteSubmit} className="space-y-4">
                  {modalMode === "quote" && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Company Name</label>
                          <input required type="text" value={quoteForm.companyName} onChange={(e) => setQuoteForm({ ...quoteForm, companyName: e.target.value })} placeholder="e.g. EcoHotels Ltd" className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">GST Number (Optional)</label>
                          <input type="text" value={quoteForm.gstNumber} onChange={(e) => setQuoteForm({ ...quoteForm, gstNumber: e.target.value })} placeholder="22AAAAA0000A1Z5" className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition font-mono uppercase" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Contact Person</label>
                          <input required type="text" value={quoteForm.contactPerson} onChange={(e) => setQuoteForm({ ...quoteForm, contactPerson: e.target.value })} placeholder="Ananya Sharma" className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Email Address</label>
                          <input required type="email" value={quoteForm.email} onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })} placeholder="buyer@company.com" className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                        </div>
                      </div>
                    </>
                  )}

                  <div className={`grid grid-cols-1 ${modalMode === "quote" ? "sm:grid-cols-3 gap-4" : "gap-4"}`}>
                    {modalMode === "quote" && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Phone Number</label>
                        <input required type="tel" value={quoteForm.phone} onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Quantity Required</label>
                      <input required type="number" min={product.minOrderQty || 1} value={quoteForm.quantity} onChange={(e) => setQuoteForm({ ...quoteForm, quantity: parseInt(e.target.value) || "" })} className={`w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 ${modalMode === "cart" ? "text-sm" : "text-xs"} focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition font-semibold`} />
                      {modalMode === "cart" && (
                        <p className="text-[10px] text-[#9E9088] mt-1">Minimum order quantity is {product.minOrderQty || 50} units.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Target Budget per unit (₹, Optional)</label>
                    <input type="number" value={quoteForm.targetBudget} onChange={(e) => setQuoteForm({ ...quoteForm, targetBudget: e.target.value })} placeholder="e.g. 600" className={`w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 ${modalMode === "cart" ? "text-sm" : "text-xs"} focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition`} />
                  </div>

                  {modalMode === "quote" && (
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5">Additional Requirements</label>
                      <textarea rows={3} value={quoteForm.additionalInfo} onChange={(e) => setQuoteForm({ ...quoteForm, additionalInfo: e.target.value })} placeholder="Specify engraving, custom branding..." className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] px-4 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition" />
                    </div>
                  )}

                  <button
                    required
                    type="submit"
                    disabled={modalMode === "quote" && submittingQuote}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A6741] hover:bg-[#3a5233] text-white py-3.5 text-xs font-bold uppercase tracking-wider transition shadow-sm mt-2 disabled:opacity-60"
                  >
                    {modalMode === "cart"
                      ? "Add to Quote List"
                      : (submittingQuote ? "Submitting Inquiry..." : "Submit Quote Request")}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md p-6 relative rounded-sm"
            >
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute right-4 top-4 text-[#9E9088] hover:text-[#1C1C1A] transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl mb-6 text-[#1C1C1A]" style={{ fontFamily: serif }}>
                Write a Review
              </h3>

              <form onSubmit={handleReviewSubmit}>
                <div className="mb-6">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9E9088] mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={star <= reviewForm.rating ? "fill-amber-500 stroke-amber-500" : "fill-transparent stroke-[#E8DDD0]"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#9E9088] mb-2">Comment</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full border border-[#E8DDD0] bg-transparent p-3 text-sm text-[#1C1C1A] focus:outline-none focus:border-[#C8A97A] transition-colors resize-none placeholder:text-[#ECE6DF]"
                    placeholder="Tell us what you think about this product..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-[#1C1C1A] hover:bg-[#C8A97A] text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
