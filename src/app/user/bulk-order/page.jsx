"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  Phone,
  Mail,
  FileText,
  Sparkles,
  ArrowRight,
  Clock,
  ChevronDown,
  Layers,
  Award,
  Leaf,
  ExternalLink,
  SlidersHorizontal,
  PackageCheck
} from "lucide-react";

// ─── Shared Typography & Design Tokens (Identical to Home.jsx) ────────────────
const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

const COMPANY = {
  phone: "+91 97986 11931",
  rawPhone: "+919798611931",
  whatsapp: "9798611931",
  email: "krisluxeco@gmail.com",
};

// ─── Animation Wrapper ────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Counter Helper ───────────────────────────────────────────────────────────
function Counter({ value, suffix = "", duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setCount(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Luxury Resort Partners (Matches Home.jsx) ────────────────────────────────
const hospitalityPartners = [
  { name: "Six Senses", category: "Spas & Wellness", tagline: "Conservation Havens" },
  { name: "The Oberoi", category: "Heritage Luxury", tagline: "Vilas & Palace Hotels" },
  { name: "Amanpuri", category: "Ultra-Luxury Villas", tagline: "Phuket & Kyoto" },
  { name: "Soho House", category: "Private Members", tagline: "Global Clubhouses" },
  { name: "1 Hotels & Homes", category: "Nature-Driven Luxury", tagline: "Zero-Waste Certified" },
  { name: "Post Ranch Inn", category: "Big Sur Sanctuary", tagline: "Sustainable Architecture" },
  { name: "Soneva Fushi", category: "Barefoot Eco Luxury", tagline: "Maldives Atoll" },
];

// ─── Product Categories for Bulk Calculator & RFQ ─────────────────────────────
const BULK_CATEGORIES = [
  {
    id: "storage",
    title: "Handwoven Storage & Planters",
    baseMoq: 50,
    priceRange: "₹450 – ₹1,850",
    leadTime: "18–24 Days",
    fibre: "Sun-Cured Water Hyacinth & Bamboo",
  },
  {
    id: "hospitality",
    title: "Hospitality & In-Room Amenities",
    baseMoq: 100,
    priceRange: "₹220 – ₹950",
    leadTime: "14–21 Days",
    fibre: "Fine River Reed & Organic Cotton Lining",
  },
  {
    id: "gifting",
    title: "Corporate Sustainable Gift Sets",
    baseMoq: 75,
    priceRange: "₹650 – ₹2,400",
    leadTime: "15–20 Days",
    fibre: "Golden Siki Grass & Natural Timber Lid",
  },
  {
    id: "tableware",
    title: "Dining, Trays & Tableware",
    baseMoq: 50,
    priceRange: "₹380 – ₹1,400",
    leadTime: "12–18 Days",
    fibre: "Food-Safe Lacquered Bamboo & Cane",
  },
  {
    id: "custom",
    title: "Bespoke Architectural Contract",
    baseMoq: 200,
    priceRange: "Custom Specification",
    leadTime: "25–35 Days",
    fibre: "Custom Natural Blends & Pantone Dyes",
  },
];

// ─── Bulk Order Page ──────────────────────────────────────────────────────────
export default function BulkOrderPage() {
  // RFQ Form State
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    category: "Handwoven Storage & Planters",
    quantity: "100 – 500 units",
    destination: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | sent

  // Calculator State
  const [calcCategory, setCalcCategory] = useState(BULK_CATEGORIES[0]);
  const [calcQuantity, setCalcQuantity] = useState(250);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Calculate volume tier
  const tierInfo = useMemo(() => {
    if (calcQuantity >= 2500) {
      return { tier: "Enterprise Tier", discount: "35% Wholesale Margin", sample: "Complimentary Spec Kit + Courier", leadTime: "25-30 Days" };
    }
    if (calcQuantity >= 1000) {
      return { tier: "Volume Tier III", discount: "28% Wholesale Margin", sample: "Complimentary Sample Box", leadTime: "21-25 Days" };
    }
    if (calcQuantity >= 500) {
      return { tier: "Contract Tier II", discount: "22% Wholesale Margin", sample: "Reimbursed on Bulk Order", leadTime: "18-22 Days" };
    }
    if (calcQuantity >= 100) {
      return { tier: "Standard Tier I", discount: "15% Wholesale Margin", sample: "Nominal Sample Fee", leadTime: "14-18 Days" };
    }
    return { tier: "Pilot Batch MOQ", discount: "Base Wholesale Rate", sample: "Sample Available", leadTime: "10-14 Days" };
  }, [calcQuantity]);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyCalcToRfq = () => {
    setForm((prev) => ({
      ...prev,
      category: calcCategory.title,
      quantity: `${calcQuantity} units (${tierInfo.tier})`,
    }));
    const el = document.getElementById("rfq-concierge");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;

    setFormStatus("sending");

    // Track quote request
    fetch("/api/user/track-quote", { method: "POST" }).catch(() => {});

    const waMessage = `🌿 *KRISLUX ECO — B2B DIRECT RFQ* 🌿

📦 *SPECIFICATION REQUIREMENTS*
▪️ *Product Category:* ${form.category}
▪️ *Target Volume:* ${form.quantity}
▪️ *Destination Port / City:* ${form.destination || "Pan-India / International"}

🏢 *BUYER CREDENTIALS*
▪️ *Company / Institution:* ${form.company || "Direct Procurement"}
▪️ *Contact Officer:* ${form.name}
▪️ *Business Email:* ${form.email}
▪️ *Direct Phone / WhatsApp:* ${form.phone}

📝 *CUSTOMIZATION & TIMELINE NOTES*
${form.message ? form.message : "_Standard export packaging & physical sample verification requested._"}

-----------------------------------
_Submitted via KrisluxECO Architectural Procurement Concierge_`;

    const encodedText = encodeURIComponent(waMessage);

    try {
      await fetch("/api/user/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.category,
          companyName: form.company || "B2B Inquiry",
          contactPerson: form.name,
          email: form.email,
          phone: form.phone,
          quantity: form.quantity,
          additionalInfo: `Destination: ${form.destination || "N/A"}\n\nNotes: ${form.message || "None"}`,
        }),
      });
    } catch (err) {
      console.error("Failed to dispatch RFQ email", err);
    }

    setFormStatus("sent");
    window.open(`https://wa.me/${COMPANY.whatsapp}?text=${encodedText}`, "_blank");
  };

  const faqs = [
    {
      q: "What is the Minimum Order Quantity (MOQ) for custom procurement?",
      a: "Our baseline production MOQ starts from as low as 50 units for catalogue storage and tableware items. For bespoke private-label pieces with custom Pantone dye batches or custom stamped brass plates, the typical MOQ is 100 to 200 units depending on mould requirements.",
    },
    {
      q: "Can you provide physical pre-production samples before full dispatch?",
      a: "Yes, absolutely. We dispatch physical, production-grade master samples complete with your chosen weave tightness, dimensions, and custom logo tags within 7–10 working days. Mass weaving only commences once your procurement director signs off on the physical sample.",
    },
    {
      q: "Do you supply international hospitality chains and overseas importers?",
      a: "Yes. KrisluxECO products are currently supplied to 12+ countries across North America, Europe, the Middle East, and Southeast Asia. We provide complete export documentation including Certificate of Origin, HS Code classification, Phytosanitary inspection, and fumigation certificates.",
    },
    {
      q: "What testing and compliance standards do your natural fibres meet?",
      a: "All water hyacinth and natural fibre batches are naturally treated with botanical bio-enzymes, oven-dried to <10% moisture content to prevent mould, and certified compliant with ASTM D4236 (Non-Toxic) and EU REACH Regulation (zero harmful phthalates or azo dyes).",
    },
    {
      q: "What are your standard commercial payment terms?",
      a: "Standard commercial terms are 50% mobilization advance upon sample sign-off, with the remaining 50% payable upon final Quality Audit clearance prior to container/freight dispatch. Irrevocable Letters of Credit (L/C at sight) are supported for container-load enterprise contracts.",
    },
  ];

  return (
    <main className="bg-[#FAF8F5] text-[#141E17]" style={{ fontFamily: sans }}>
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION — LUXURY DEEP FOREST OBSIDIAN AESTHETIC                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 bg-[#0D140F] text-[#FAF8F5] overflow-hidden border-b border-[#C29B5D]/20">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#3E634A]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#C29B5D]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <FadeUp>
            {/* Top Verified Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-[2px] bg-white/5 border border-[#C29B5D]/30 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3E634A] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-medium">
                Direct From Bihar Artisan Cooperatives · Global B2B Contract
              </span>
            </div>

            {/* Master Headline */}
            <h1
              className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-light leading-[1.08] tracking-tight max-w-4xl mx-auto"
              style={{ fontFamily: serif }}
            >
              Architectural Wholesale &amp;
              <span className="italic font-serif text-[#C29B5D] block sm:inline font-normal">
                {" "}Bespoke Contract Supply
              </span>
            </h1>

            {/* Hairline Divider */}
            <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[#C29B5D] to-transparent mx-auto my-6" />

            {/* Executive Subtitle */}
            <p className="text-sm sm:text-base text-[#FAF8F5]/75 max-w-2xl mx-auto font-light leading-relaxed">
              Traceable water hyacinth, wild river reeds, and seasoned natural timber handcrafted by certified co-operatives. Engineered for luxury resorts, ethical retailers, and ESG-mandated corporate procurement.
            </p>

            {/* Hero Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
              <a
                href="#rfq-concierge"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-[2px] transition-all duration-300 shadow-[0_4px_20px_rgba(194,155,93,0.3)] hover:shadow-[0_4px_28px_rgba(194,155,93,0.5)]"
              >
                Request Custom RFQ
                <ArrowRight size={14} />
              </a>

              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi KrisluxECO team, I would like to inquire about institutional bulk orders.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[#FAF8F5] border border-white/20 hover:border-[#C29B5D]/60 text-xs uppercase font-medium tracking-[0.16em] px-7 py-4 rounded-[2px] transition-all duration-300"
              >
                <Phone size={14} className="text-[#C29B5D]" />
                WhatsApp Priority Desk
              </a>

              <Link
                href="/share-catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs uppercase text-[#C29B5D] hover:text-white tracking-[0.16em] px-4 py-4 transition-colors font-mono"
              >
                <FileText size={14} />
                View Digital Catalog
              </Link>
            </div>
          </FadeUp>
        </div>

        {/* ─── 4-Column Metric Ribbon ────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-10 border-t border-white/10 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <FadeUp delay={0.05}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">
                <Counter value={200} suffix="+" />
              </p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Master Co-op Artisans
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Begusarai &amp; North Bihar</p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">
                <Counter value={12} suffix="+" />
              </p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Countries Exported
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">FOB / CIF / DDP Delivery</p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">
                <Counter value={21} suffix=" Days" />
              </p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Avg Contract Turnaround
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Sample Approved in 7 Days</p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">
                100%
              </p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Plastic-Free Export
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">ASTM &amp; REACH Compliant</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. INTERACTIVE LIVE VOLUME PRICING & MOQ ESTIMATOR                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAF8F5] border-b border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
              Procurement Feasibility Tool
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#141E17]" style={{ fontFamily: serif }}>
              Live Volume Tier &amp;
              <span className="italic font-normal text-[#3E634A]"> Costing Calculator</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6560] max-w-xl mx-auto mt-3 font-light">
              Select your required product classification and drag the volume slider to preview institutional discounting, estimated lead times, and sample privileges.
            </p>
          </FadeUp>

          {/* Calculator Container */}
          <FadeUp delay={0.1} className="bg-white border border-[#EAE3D6] rounded-[2px] p-6 sm:p-10 shadow-[0_16px_40px_rgba(20,30,23,0.04)]">
            {/* Category Selector Tabs */}
            <div className="mb-8">
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#9E9088] font-bold font-mono mb-3">
                1. Select Product Classification
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {BULK_CATEGORIES.map((cat) => {
                  const active = calcCategory.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCalcCategory(cat)}
                      className={`text-left p-3.5 rounded-[2px] border transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-[#141E17] text-[#FAF8F5] border-[#141E17] shadow-sm"
                          : "bg-[#FAF8F5] text-[#141E17] border-[#EAE3D6] hover:border-[#C29B5D]/60"
                      }`}
                    >
                      <p className="text-xs font-semibold leading-tight line-clamp-1">{cat.title}</p>
                      <p className={`text-[10px] mt-1 font-mono ${active ? "text-[#C29B5D]" : "text-[#7A7369]"}`}>
                        MOQ: {cat.baseMoq} Units
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider & Tier Display Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 border-t border-[#F4EFE6]">
              {/* Slider Left Side */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-[0.18em] text-[#9E9088] font-bold font-mono">
                    2. Select Target Production Volume
                  </label>
                  <span className="text-2xl font-bold font-mono text-[#141E17] bg-[#F4EFE6] px-4 py-1 rounded-[2px] border border-[#EAE3D6]">
                    {calcQuantity.toLocaleString()} <span className="text-xs font-normal text-[#6B6560]">Units</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Number(e.target.value))}
                  className="w-full h-2 bg-[#EAE3D6] rounded-[2px] appearance-none cursor-pointer accent-[#C29B5D]"
                />

                <div className="flex justify-between text-[10px] text-[#7A7369] font-mono">
                  <span>50 Units (Pilot MOQ)</span>
                  <span>500 Units</span>
                  <span>1,500 Units</span>
                  <span>5,000+ Units (Container)</span>
                </div>

                <div className="p-4 bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B6560]">Standard Price Range:</span>
                    <span className="font-mono font-semibold text-[#141E17]">{calcCategory.priceRange}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B6560]">Fibre Composition:</span>
                    <span className="text-[#3E634A] font-medium">{calcCategory.fibre}</span>
                  </div>
                </div>
              </div>

              {/* Tier Summary Card Right Side */}
              <div className="lg:col-span-5 bg-[#141E17] text-[#FAF8F5] p-6 sm:p-7 rounded-[2px] border border-[#C29B5D]/30 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#C29B5D] uppercase font-bold">
                    Contract Matrix
                  </span>
                  <span className="text-xs bg-[#3E634A] text-white px-2.5 py-0.5 rounded-[2px] font-semibold">
                    {tierInfo.tier}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-[11px] text-[#FAF8F5]/60 uppercase font-mono tracking-wider block">Estimated Margin</span>
                    <span className="text-lg font-bold text-[#C29B5D] font-mono">{tierInfo.discount}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[10px] text-[#FAF8F5]/60 uppercase font-mono tracking-wider block">Lead Time</span>
                      <span className="text-xs font-semibold text-[#FAF8F5]">{tierInfo.leadTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#FAF8F5]/60 uppercase font-mono tracking-wider block">Pre-Production Sample</span>
                      <span className="text-xs font-semibold text-[#7FA06B]">{tierInfo.sample}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleApplyCalcToRfq}
                  className="w-full mt-3 py-3 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-[11px] uppercase tracking-[0.16em] rounded-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Apply Configuration to RFQ
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. SUSTAINABLE MATERIAL PALETTE SHOWCASE                                */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F4EFE6] border-b border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
              Traceable Bio-Materials
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#141E17]" style={{ fontFamily: serif }}>
              Natural Fibres Handcrafted
              <span className="italic font-normal text-[#3E634A]"> Without Compromise</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6560] max-w-xl mx-auto mt-3 font-light">
              Every piece manufactured for bulk supply originates from sustainable, naturally regenerative plant matter harvested responsibly from the Bihar river basin.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: "01",
                title: "Water Hyacinth Stems",
                feature: "High Tensile Braiding",
                desc: "Invasive wetland flora transformed into pliable, sun-cured fibre. Zero pesticides, mold-inhibited through natural bio-enzyme baths.",
              },
              {
                num: "02",
                title: "River Siki Golden Grass",
                feature: "Ancestral Fine Weaving",
                desc: "Indigenous golden reed native to Mithila riverbeds. Naturally aromatic, moisture-resistant, and woven into intricate heritage boxes.",
              },
              {
                num: "03",
                title: "Seasoned Cane & Bamboo",
                feature: "Structural Durability",
                desc: "Harvested from cultivated North Bihar groves. Precision turned, kiln-dried, and finished with food-grade botanical sealants.",
              },
              {
                num: "04",
                title: "Organic Handloom Liners",
                feature: "GOTS & OEKO-TEX Cotton",
                desc: "Unbleached natural canvas and organic jute linings. Custom silk-screen or embossed vegan leather badging for corporate branding.",
              },
            ].map((mat, i) => (
              <FadeUp key={mat.num} delay={i * 0.08}>
                <div className="h-full bg-white border border-[#EAE3D6] p-6 rounded-[2px] shadow-sm hover:border-[#C29B5D]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest text-[#C29B5D] font-bold block mb-3">
                      MATERIAL SPEC // {mat.num}
                    </span>
                    <h3 className="text-base font-semibold text-[#141E17] mb-1.5" style={{ fontFamily: serif }}>
                      {mat.title}
                    </h3>
                    <span className="inline-block text-[10px] font-mono tracking-wider text-[#3E634A] bg-[#F4EFE6] px-2 py-0.5 rounded-[2px] mb-3 font-semibold">
                      {mat.feature}
                    </span>
                    <p className="text-xs text-[#6B6560] leading-relaxed font-light">{mat.desc}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#F4EFE6] flex items-center gap-1.5 text-[10px] text-[#7A7369] font-mono">
                    <CheckCircle2 size={12} className="text-[#3E634A]" />
                    Lab Tested · 0% Synthetics
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. THE B2B RFQ CONCIERGE & FORM SECTION (#rfq-concierge)              */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section id="rfq-concierge" className="py-24 px-6 bg-[#FAF8F5] scroll-mt-24 border-b border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Guarantees & Direct Channels */}
            <FadeUp className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-bold block mb-2">
                  Institutional Procurement Concierge
                </span>
                <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-light leading-[1.12] text-[#141E17]" style={{ fontFamily: serif }}>
                  Direct Factory Terms,
                  <span className="italic font-normal text-[#3E634A] block"> Zero Middlemen</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#6B6560] mt-4 leading-relaxed font-light">
                  Our direct artisan cooperative model provides enterprise clients with wholesale price transparency, custom white-label packaging, and rigorous 3-tier inspection before shipment.
                </p>
              </div>

              {/* 4 Architectural Benefits */}
              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Bespoke White-Labeling & Branding",
                    desc: "Custom laser-engraved bamboo plates, debossed cotton tags, and tailored gift packaging inserts with your exact company logo.",
                  },
                  {
                    title: "7-Day Physical Master Sample",
                    desc: "Zero-risk approvals. We dispatch a complete physical master prototype directly to your office before commencing container weaving.",
                  },
                  {
                    title: "Export Compliance & Documentation",
                    desc: "Full international customs documentation provided: Phytosanitary, Certificate of Origin, HS Code classification & commercial invoices.",
                  },
                  {
                    title: "Dedicated Single-Contact Procurement Manager",
                    desc: "One senior point of contact through WhatsApp and email, providing weekly photographic production progress reports.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 bg-white border border-[#EAE3D6] rounded-[2px] shadow-sm">
                    <div className="w-5 h-5 rounded-[2px] bg-[#3E634A]/10 text-[#3E634A] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#141E17] leading-tight">{item.title}</h4>
                      <p className="text-[11px] text-[#6B6560] mt-1 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Priority Contact Box */}
              <div className="p-6 bg-[#0D140F] text-[#FAF8F5] rounded-[2px] border border-[#C29B5D]/30 shadow-md">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C29B5D] font-bold block mb-1">
                  Prefer Direct Executive Discussion?
                </span>
                <p className="text-xs text-[#FAF8F5]/70 mb-4 font-light">
                  Our head of procurement is available for live briefing calls:
                </p>

                <div className="space-y-2.5 text-xs font-mono">
                  <a
                    href={`tel:${COMPANY.rawPhone}`}
                    className="flex items-center gap-3 p-2.5 bg-white/5 hover:bg-white/10 rounded-[2px] border border-white/10 transition-colors text-[#FAF8F5]"
                  >
                    <Phone size={14} className="text-[#C29B5D]" />
                    <span>{COMPANY.phone} (Voice / IST)</span>
                  </a>

                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="flex items-center gap-3 p-2.5 bg-white/5 hover:bg-white/10 rounded-[2px] border border-white/10 transition-colors text-[#FAF8F5]"
                  >
                    <Mail size={14} className="text-[#C29B5D]" />
                    <span className="truncate">{COMPANY.email}</span>
                  </a>
                </div>
              </div>
            </FadeUp>

            {/* Right Column: The Architectural RFQ Form */}
            <FadeUp delay={0.1} className="lg:col-span-7">
              <div className="bg-white border border-[#EAE3D6] rounded-[2px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(20,30,23,0.06)]">
                <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-normal text-[#141E17]" style={{ fontFamily: serif }}>
                      Direct B2B Request for Quote
                    </h3>
                    <p className="text-xs text-[#7A7369] mt-0.5">
                      Receive an itemized quote, sample timeline, and freight estimate within 24 hours.
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-[#3E634A] bg-[#F4EFE6] px-2.5 py-1 rounded-[2px] font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E634A] animate-pulse" />
                    RFQ Active
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="e.g. Meera Sharma"
                        className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                        Organization / Brand Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleFormChange}
                        placeholder="e.g. Oberoi Luxury Resorts"
                        className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleFormChange}
                        placeholder="procurement@company.com"
                        className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleFormChange}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Category & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                        Product Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleFormChange}
                        className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] focus:outline-none focus:border-[#C29B5D] transition-colors cursor-pointer"
                      >
                        {BULK_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                        Target Volume Range
                      </label>
                      <select
                        name="quantity"
                        value={form.quantity}
                        onChange={handleFormChange}
                        className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] focus:outline-none focus:border-[#C29B5D] transition-colors cursor-pointer"
                      >
                        <option>50 – 100 units (Pilot Trial)</option>
                        <option>100 – 500 units (Tier I)</option>
                        <option>500 – 1,000 units (Tier II)</option>
                        <option>1,000 – 2,500 units (Tier III)</option>
                        <option>2,500+ units (Full Container Load)</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Location / Port */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                      Destination City / Country / Port (for freight estimate)
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={form.destination}
                      onChange={handleFormChange}
                      placeholder="e.g. Mumbai / Delhi / Dubai / Rotterdam"
                      className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors"
                    />
                  </div>

                  {/* Project Specifications */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                      Custom Dimensions, Logo Branding or Special Instructions
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={handleFormChange}
                      placeholder="Specify target dimensions, custom branding requirements, sample urgency, or target delivery date..."
                      className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    className="w-full py-4 bg-[#141E17] hover:bg-[#C29B5D] text-[#FAF8F5] hover:text-[#0D140F] text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {formStatus === "sending" ? (
                      <span>Dispatching Specifications...</span>
                    ) : (
                      <>
                        <span>Submit Direct RFQ &amp; Connect on WhatsApp</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[#7A7369] text-center font-mono">
                    Locked pricing quotation &amp; sample tracking sent within 24–48 working hours.
                  </p>

                  <AnimatePresence>
                    {formStatus === "sent" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-[#F4EFE6] border border-[#3E634A]/40 text-[#141E17] rounded-[2px] text-xs space-y-1"
                      >
                        <p className="font-bold text-[#3E634A] flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          RFQ Dispatched Successfully
                        </p>
                        <p className="text-[11px] text-[#6B6560]">
                          Our team has received your inquiry and WhatsApp has been launched with your exact specification breakdown.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 5. LUXURY RESORTS & INSTITUTIONAL SPECIFICATION MARQUEE               */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAF8F5] border-b border-[#EAE3D6] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-10">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#C29B5D] uppercase font-bold block mb-2">
              Architectural Specification Endorsements
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#141E17]" style={{ fontFamily: serif }}>
              Specified by Leading Luxury Resorts &amp; Ethical Sanctuaries
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {hospitalityPartners.map((partner) => (
              <div
                key={partner.name}
                className="bg-white border border-[#EAE3D6] p-4 rounded-[2px] text-center shadow-sm flex flex-col justify-center items-center h-28 hover:border-[#C29B5D]/60 transition-colors"
              >
                <p className="font-serif text-sm font-semibold text-[#141E17] leading-tight mb-1">
                  {partner.name}
                </p>
                <p className="text-[9px] font-mono text-[#C29B5D] uppercase tracking-wider">{partner.category}</p>
                <p className="text-[8px] text-[#9E9088] mt-0.5">{partner.tagline}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-[10px] text-[#7A7369] font-mono tracking-widest uppercase mt-8">
            Meets or Exceeds ASTM D4236 (Non-Toxic) · EU REACH Chemical Safety · Zero-Waste Verified
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 6. BESPOKE 4-STEP PRODUCTION TIMELINE                                  */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F4EFE6] border-b border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
              Rigorous Quality Engineering
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#141E17]" style={{ fontFamily: serif }}>
              From First Specification
              <span className="italic font-normal text-[#3E634A]"> to Bonded Freight</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Technical Costing & Spec Matrix",
                timeline: "Turnaround: 24–48 Hours",
                desc: "We analyze your target dimensions, fibre selection, MOQ thresholds, and deliver an itemized commercial quotation.",
              },
              {
                step: "02",
                title: "Physical Sample Prototype",
                timeline: "Dispatched: 7–10 Days",
                desc: "Artisan master sample crafted and courier-delivered for tangible sign-off on weave tightness, handle rigidity, and branding.",
              },
              {
                step: "03",
                title: "Cooperative Batch Weaving",
                timeline: "Production: 2–4 Weeks",
                desc: "Distributed production across vetted rural women's artisan clusters with staged moisture-meter checks and dimensional audits.",
              },
              {
                step: "04",
                title: "Zero-Plastic Export Packing",
                timeline: "Freight: Sea / Air / Road",
                desc: "Desiccant-protected kraft corrugated cartons, barcoded carton markings, and bonded logistics dispatch with live bill-of-lading.",
              },
            ].map((st, i) => (
              <FadeUp key={st.step} delay={i * 0.1}>
                <div className="h-full bg-white border border-[#EAE3D6] p-6 rounded-[2px] shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-2xl font-serif font-bold text-[#C29B5D] block mb-2">
                      {st.step}
                    </span>
                    <h3 className="text-base font-semibold text-[#141E17] leading-snug mb-1">
                      {st.title}
                    </h3>
                    <span className="inline-block text-[10px] font-mono font-semibold text-[#3E634A] bg-[#F4EFE6] px-2 py-0.5 rounded-[2px] mb-3">
                      {st.timeline}
                    </span>
                    <p className="text-xs text-[#6B6560] leading-relaxed font-light">{st.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 7. FREQUENTLY ASKED PROCUREMENT QUESTIONS                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAF8F5] border-b border-[#EAE3D6]">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-12">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
              Procurement Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#141E17]" style={{ fontFamily: serif }}>
              Frequently Clarified Contract Terms
            </h2>
          </FadeUp>

          <FadeUp delay={0.1} className="bg-white border border-[#EAE3D6] rounded-[2px] divide-y divide-[#EAE3D6] shadow-sm">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="p-5 sm:p-6">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-[#141E17]" style={{ fontFamily: sans }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#C29B5D] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-[#6B6560] pt-3 leading-relaxed font-light border-t border-[#F4EFE6] mt-3">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </FadeUp>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 8. FINAL CONTRACT CONCIERGE CALLOUT BANNER                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0D140F] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <FadeUp>
            <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-bold block mb-2">
              Ready To Finalize Your Batch?
            </span>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight text-white" style={{ fontFamily: serif }}>
              Have an Upcoming Hospitality Opening or Corporate Deadline?
              <span className="italic font-normal text-[#C29B5D] block"> Let's Lock Your Production Calendar.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 max-w-xl mx-auto leading-relaxed font-light">
              Submit your RFQ today to receive priority access to our upcoming weaving cycle and master artisan capacity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#rfq-concierge"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-[2px] transition-all shadow-md"
              >
                Go To RFQ Form
                <ArrowRight size={14} />
              </a>

              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi KrisluxECO team, I have an urgent deadline for bulk procurement.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 text-[#FAF8F5] hover:border-[#C29B5D] text-xs uppercase tracking-[0.16em] px-7 py-4 rounded-[2px] transition-all"
              >
                <Phone size={14} className="text-[#C29B5D]" />
                WhatsApp Direct (+91 97986 11931)
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
