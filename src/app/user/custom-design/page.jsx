"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Send,
  CheckCircle,
  Loader2,
  Upload,
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronDown,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import { useSession } from "next-auth/react";
import imageCompression from "browser-image-compression";

// ─── Shared Typography & Palette Tokens (Identical to Home.jsx) ───────────────
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

// ─── Hospitality & Bespoke Architectural Endorsements ─────────────────────────
const hospitalityPartners = [
  { name: "Six Senses", category: "Spas & Wellness", tagline: "Conservation Havens" },
  { name: "The Oberoi", category: "Heritage Luxury", tagline: "Vilas & Palace Hotels" },
  { name: "Amanpuri", category: "Ultra-Luxury Villas", tagline: "Phuket & Kyoto" },
  { name: "Soho House", category: "Private Members", tagline: "Global Clubhouses" },
  { name: "1 Hotels & Homes", category: "Nature-Driven Luxury", tagline: "Zero-Waste Certified" },
  { name: "Post Ranch Inn", category: "Big Sur Sanctuary", tagline: "Sustainable Architecture" },
  { name: "Soneva Fushi", category: "Barefoot Eco Luxury", tagline: "Maldives Atoll" },
];

export default function CustomDesignPage() {
  const { data: session } = useSession();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Architectural Planters & Floor Urns",
    dimensions: "",
    material: "Water Hyacinth Stem Fibre",
    quantity: "1 – 5 Units (Bespoke Commission)",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  // Prepopulate email and name when session loads
  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email,
        name: session.user.name || prev.name,
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("phone", formData.phone);

      // Package full architectural brief into description for the model
      const fullDescription = `[BESPOKE ARCHITECTURAL COMMISSION]
Classification: ${formData.category}
Target Dimensions: ${formData.dimensions || "To be discussed"}
Preferred Natural Fibre: ${formData.material}
Target Quantity: ${formData.quantity}

Client Design Brief:
${formData.description}`;

      dataToSend.append("description", fullDescription);

      if (imageFile) {
        try {
          const compressedFile = await imageCompression(imageFile, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          dataToSend.append("image", compressedFile);
        } catch (compErr) {
          console.error("Image compression error:", compErr);
          dataToSend.append("image", imageFile);
        }
      }

      const res = await fetch("/api/user/custom-design", {
        method: "POST",
        body: dataToSend,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setIsSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const customFaqs = [
    {
      q: "Can I commission a one-off (1-of-1) custom piece?",
      a: "Yes. Our Master Weaving Guild accepts individual bespoke commissions for interior designers, architects, and private residences. Whether it's an oversized floor planter, a sculptural pendant light, or a custom storage credenza, our master artisans will work with you from sketch to delivery.",
    },
    {
      q: "What design materials can I provide as references?",
      a: "You can upload architectural elevation drawings, hand-sketched concepts, 3D CAD models, or moodboard photographs. Our technical atelier will translate your inputs into a physical weave pattern with precise structural frame specifications.",
    },
    {
      q: "How long does a bespoke custom commission take?",
      a: "Our typical timeline is: 3–5 days for initial costing & weave feasibility; 10–14 days for crafting and courier-delivering the physical prototype; and 2–4 weeks for final piece creation depending on the scale and complexity of the weave.",
    },
    {
      q: "Can you match specific Pantone shades or natural wood stains?",
      a: "Yes. We offer organic botanical dyeing using natural madder, indigo, marigold, and turmeric for our fibres. For timber and cane components, we offer custom matte, low-sheen satin, and wire-brushed finishes using non-toxic natural waxes.",
    },
    {
      q: "Do you ship custom furniture and large installations internationally?",
      a: "Yes. All custom pieces are packed in shock-absorbing desiccant-lined reinforced wooden crates to ensure zero transit distortion. We ship globally with door-to-door air freight or container shipping.",
    },
  ];

  return (
    <main className="bg-[#FAF8F5] text-[#141E17]" style={{ fontFamily: sans }}>
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION — LUXURY DEEP OBSIDIAN ATELIER                          */}
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
                Bespoke Artisanal Atelier · 100% Sustainable Bio-Fibres
              </span>
            </div>

            {/* Master Headline */}
            <h1
              className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-light leading-[1.08] tracking-tight max-w-4xl mx-auto"
              style={{ fontFamily: serif }}
            >
              Bespoke Commissions &amp;
              <span className="italic font-serif text-[#C29B5D] block sm:inline font-normal">
                {" "}Custom Natural Weaves
              </span>
            </h1>

            {/* Hairline Divider */}
            <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-[#C29B5D] to-transparent mx-auto my-6" />

            {/* Executive Subtitle */}
            <p className="text-sm sm:text-base text-[#FAF8F5]/75 max-w-2xl mx-auto font-light leading-relaxed">
              Co-create one-of-a-kind sustainable furniture, architectural planters, hospitality amenities, and bespoke home decor directly with our master weaving guild in Bihar.
            </p>

            {/* Hero Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
              <a
                href="#commission-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-[2px] transition-all duration-300 shadow-[0_4px_20px_rgba(194,155,93,0.3)] hover:shadow-[0_4px_28px_rgba(194,155,93,0.5)]"
              >
                Submit Design Brief
                <ArrowRight size={14} />
              </a>

              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi KrisluxECO team, I have a custom design and would like to consult with your master artisans.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[#FAF8F5] border border-white/20 hover:border-[#C29B5D]/60 text-xs uppercase font-medium tracking-[0.16em] px-7 py-4 rounded-[2px] transition-all duration-300"
              >
                <Phone size={14} className="text-[#C29B5D]" />
                WhatsApp Head of Atelier
              </a>
            </div>
          </FadeUp>
        </div>

        {/* ─── 4-Column Metric Ribbon ────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-6 mt-16 pt-10 border-t border-white/10 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <FadeUp delay={0.05}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">1-on-1</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Artisan Consultation
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Direct Collaboration</p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">7 Days</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                CAD &amp; Spec Matrix
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Rapid Feasibility Review</p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">14 Days</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Master Prototype
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Physical Sample Dispatch</p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-3xl sm:text-4xl font-semibold text-[#FAF8F5] font-serif">100%</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C29B5D] font-mono mt-1.5">
                Biodegradable Fibres
              </p>
              <p className="text-[11px] text-[#FAF8F5]/50 mt-0.5">Zero Petrochemical Resins</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 2. THE BESPOKE WEAVING ATELIER PALETTE                                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAF8F5] border-b border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
              Signature Craftsmanship
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#141E17]" style={{ fontFamily: serif }}>
              Architectural Weave Structures &amp;
              <span className="italic font-normal text-[#3E634A]"> Material Finishes</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6560] max-w-xl mx-auto mt-3 font-light">
              Choose from our heritage weaving techniques, each engineered with distinct structural rigidity, tactile texture, and acoustic dampening.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: "01",
                title: "Dense Herringbone Weave",
                useCase: "Planters & Furniture",
                desc: "High-rigidity interlocking pattern woven tightly over seasoned wooden or powder-coated metal internal skeletons. Clean, modern geometry.",
              },
              {
                num: "02",
                title: "Open Lattice Honeycomb",
                useCase: "Pendants & Dividers",
                desc: "Rhythmic hexagonal apertures that filter light into warm, organic shadows. Ideal for bespoke hospitality lampshades and spatial screens.",
              },
              {
                num: "03",
                title: "Twisted Cordage Upholstery",
                useCase: "Benches & Stools",
                desc: "Hand-spun multi-ply water hyacinth twine tension-woven across timber frames, offering natural elasticity and immense load-bearing durability.",
              },
              {
                num: "04",
                title: "Coiled Heritage Siki Grass",
                useCase: "Lidded Vessels & Boxes",
                desc: "Ancestral needle-and-awl coiling of natural golden grass. Can incorporate bespoke natural dye accents (indigo, madder, turmeric).",
              },
            ].map((technique, i) => (
              <FadeUp key={technique.num} delay={i * 0.08}>
                <div className="h-full bg-white border border-[#EAE3D6] p-6 rounded-[2px] shadow-sm hover:border-[#C29B5D]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest text-[#C29B5D] font-bold block mb-3">
                      TECHNIQUE SPEC // {technique.num}
                    </span>
                    <h3 className="text-base font-semibold text-[#141E17] mb-1.5" style={{ fontFamily: serif }}>
                      {technique.title}
                    </h3>
                    <span className="inline-block text-[10px] font-mono tracking-wider text-[#3E634A] bg-[#F4EFE6] px-2 py-0.5 rounded-[2px] mb-3 font-semibold">
                      Ideal For: {technique.useCase}
                    </span>
                    <p className="text-xs text-[#6B6560] leading-relaxed font-light">{technique.desc}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#F4EFE6] flex items-center gap-1.5 text-[10px] text-[#7A7369] font-mono">
                    <CheckCircle2 size={12} className="text-[#3E634A]" />
                    Custom Spec Compatible
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 3. THE 4-STAGE CO-CREATION PROCESS                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F4EFE6] border-b border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
              From Concept to Masterpiece
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#141E17]" style={{ fontFamily: serif }}>
              How We Co-Create
              <span className="italic font-normal text-[#3E634A]"> Your Custom Piece</span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Vision & Reference Submission",
                detail: "Share your dimensions, reference sketches, or moodboard using the form below or WhatsApp.",
              },
              {
                step: "02",
                title: "Technical Feasibility & Costing",
                detail: "Our master craft team reviews the structural tension, suggests the best natural fibre, and issues a locked quotation.",
              },
              {
                step: "03",
                title: "Prototype Master Weave",
                detail: "A physical pre-production sample is crafted and delivered to your doorstep for tactile review and dimension sign-off.",
              },
              {
                step: "04",
                title: "Artisan Guild Handcrafting",
                detail: "Upon your approval, master artisans execute the final creation, followed by bio-enzyme treatment and white-glove crated delivery.",
              },
            ].map((st, i) => (
              <FadeUp key={st.step} delay={i * 0.1}>
                <div className="h-full bg-white border border-[#EAE3D6] p-6 rounded-[2px] shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-2xl font-serif font-bold text-[#C29B5D] block mb-2">
                      {st.step}
                    </span>
                    <h3 className="text-base font-semibold text-[#141E17] leading-snug mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs text-[#6B6560] leading-relaxed font-light">{st.detail}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 4. THE BESPOKE COMMISSION INQUIRY FORM (#commission-form)              */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section id="commission-form" className="py-24 px-6 bg-[#FAF8F5] scroll-mt-24 border-b border-[#EAE3D6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Guarantees & Atelier Channels */}
            <FadeUp className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-bold block mb-2">
                  Artisanal Atelier Guarantee
                </span>
                <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-light leading-[1.12] text-[#141E17]" style={{ fontFamily: serif }}>
                  Every Stitch Shaped
                  <span className="italic font-normal text-[#3E634A] block"> By Human Hands</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#6B6560] mt-4 leading-relaxed font-light">
                  We don't manufacture anonymous mass-market objects. Every custom piece commissioned through KrisluxECO directly sustains traditional craft families in North Bihar while restoring local water ecosystems.
                </p>
              </div>

              {/* 4 Atelier Guarantees */}
              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Bespoke Millimeter Precision",
                    desc: "Custom frames built to fit exact architectural niches, recessed shelving, or banquet dining dimensions.",
                  },
                  {
                    title: "Physical Prototype Verification",
                    desc: "Review your actual master sample in person before final production proceeds.",
                  },
                  {
                    title: "Botanical Color Matching",
                    desc: "Pantone-matched organic plant dyes or untreated sun-bleached natural honey tones.",
                  },
                  {
                    title: "White-Glove International Crating",
                    desc: "Custom reinforced timber crating with humidity control for safe worldwide arrival.",
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

              {/* Direct Atelier Contact */}
              <div className="p-6 bg-[#0D140F] text-[#FAF8F5] rounded-[2px] border border-[#C29B5D]/30 shadow-md">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C29B5D] font-bold block mb-1">
                  Prefer Direct Design Dialogue?
                </span>
                <p className="text-xs text-[#FAF8F5]/70 mb-4 font-light">
                  Speak directly with our Head of Atelier to discuss feasibility:
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

            {/* Right Column: The Bespoke Form */}
            <FadeUp delay={0.1} className="lg:col-span-7">
              <div className="bg-white border border-[#EAE3D6] rounded-[2px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(20,30,23,0.06)]">
                {isSuccess ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-[#F4EFE6] rounded-full flex items-center justify-center border border-[#3E634A]/30">
                      <CheckCircle size={32} className="text-[#3E634A]" />
                    </div>
                    <h3 className="text-2xl font-normal text-[#141E17]" style={{ fontFamily: serif }}>
                      Commission Brief Received
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B6560] max-w-md mx-auto leading-relaxed font-light">
                      Thank you! Our master craft guild is reviewing your design specification. We will reach out within 24–48 hours with technical costing, weave advice, and prototype timelines.
                    </p>

                    <div className="pt-6 flex flex-col sm:flex-row gap-3">
                      <a
                        href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(`Hi KrisluxECO team, I have submitted a bespoke custom inquiry under the name: ${formData.name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#C29B5D] text-[#0D140F] font-bold text-xs uppercase tracking-[0.16em] px-6 py-3.5 rounded-[2px] shadow-sm"
                      >
                        <Phone size={14} />
                        Continue on WhatsApp
                      </a>
                      <button
                        onClick={() => {
                          setIsSuccess(false);
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="inline-flex items-center justify-center px-6 py-3.5 border border-[#EAE3D6] text-xs uppercase tracking-[0.16em] text-[#141E17] hover:bg-[#FAF8F5] rounded-[2px]"
                      >
                        Submit Another Brief
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4 mb-6">
                      <div>
                        <h3 className="text-2xl font-normal text-[#141E17]" style={{ fontFamily: serif }}>
                          Commission Your Custom Piece
                        </h3>
                        <p className="text-xs text-[#7A7369] mt-0.5">
                          Share your dimensions, concepts, or photos for artisan evaluation.
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-[#3E634A] bg-[#F4EFE6] px-2.5 py-1 rounded-[2px] font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3E634A] animate-pulse" />
                        Atelier Open
                      </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Ananya Roy"
                            className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                            WhatsApp / Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ananya@designstudio.com"
                          className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors"
                        />
                      </div>

                      {/* Object Category & Target Dimensions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                            Object Classification
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] focus:outline-none focus:border-[#C29B5D] transition-colors cursor-pointer"
                          >
                            <option>Architectural Planters &amp; Floor Urns</option>
                            <option>Custom Furniture, Seating &amp; Benches</option>
                            <option>Lighting Pendants &amp; Shade Structures</option>
                            <option>Bespoke Storage Trunks &amp; Hamper Baskets</option>
                            <option>Hospitality Room Amenities &amp; Trays</option>
                            <option>Custom Heritage Gift Hampers</option>
                            <option>Other / Bespoke Architectural Installation</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                            Target Dimensions (L x W x H)
                          </label>
                          <input
                            type="text"
                            name="dimensions"
                            value={formData.dimensions}
                            onChange={handleChange}
                            placeholder="e.g. 60cm Dia x 75cm Height"
                            className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Preferred Fibre & Quantity */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                            Preferred Natural Fibre
                          </label>
                          <select
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] focus:outline-none focus:border-[#C29B5D] transition-colors cursor-pointer"
                          >
                            <option>Water Hyacinth Stem Fibre (Pliable Honey Weave)</option>
                            <option>River Siki Golden Grass (Aromatic Straw)</option>
                            <option>Seasoned Bamboo &amp; Cane (Rigid Structural)</option>
                            <option>Natural Organic Jute &amp; Cotton Canvas Blend</option>
                            <option>Artisan Guild Recommended Fibre</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                            Required Quantity
                          </label>
                          <select
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] focus:outline-none focus:border-[#C29B5D] transition-colors cursor-pointer"
                          >
                            <option>1 – 5 Units (Bespoke Commission)</option>
                            <option>6 – 25 Units (Limited Edition Series)</option>
                            <option>25 – 100 Units (Project Batch)</option>
                            <option>100+ Units (Hospitality Contract)</option>
                          </select>
                        </div>
                      </div>

                      {/* Detailed Description */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-1.5">
                          Design Brief, Functional Requirements &amp; Special Finishes *
                        </label>
                        <textarea
                          name="description"
                          required
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe intended aesthetic, load requirements, indoor/outdoor usage, custom branding requests, or target completion deadline..."
                          className="w-full text-xs bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] px-3.5 py-3 text-[#141E17] placeholder:text-[#A39E93] focus:outline-none focus:border-[#C29B5D] transition-colors resize-none leading-relaxed"
                        />
                      </div>

                      {/* Reference Image Upload Stage */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A7369] font-bold mb-2">
                          Concept Sketch or Reference Photograph <span className="font-normal text-[#A39E93]">(Optional, Max 10MB)</span>
                        </label>

                        {imagePreview ? (
                          <div className="relative p-3 bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 bg-white rounded-[2px] overflow-hidden border border-[#EAE3D6] shrink-0">
                                <Image
                                  src={imagePreview}
                                  alt="Reference upload preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-semibold text-[#141E17] truncate max-w-[200px]">
                                  {imageFile?.name}
                                </p>
                                <p className="text-[10px] text-[#3E634A] font-mono">Image attached &amp; compressed</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="text-xs text-red-600 hover:text-red-800 font-mono underline cursor-pointer p-1"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full p-6 bg-[#FAF8F5] border border-dashed border-[#EAE3D6] hover:border-[#C29B5D] rounded-[2px] cursor-pointer transition-colors group">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <Upload size={20} className="text-[#C29B5D] mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-[#141E17] group-hover:text-[#C29B5D] transition-colors">
                              Click to upload sketch, CAD render or photo
                            </span>
                            <span className="text-[10px] text-[#A39E93] mt-1 font-mono">
                              PNG, JPG, WEBP up to 10MB
                            </span>
                          </label>
                        )}
                      </div>

                      {/* Error Alert */}
                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[2px]">
                          {error}
                        </div>
                      )}

                      {/* Submit Action */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#141E17] hover:bg-[#C29B5D] text-[#FAF8F5] hover:text-[#0D140F] text-xs font-bold uppercase tracking-[0.2em] rounded-[2px] transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin text-[#C29B5D]" />
                            <span>Translating Brief to Atelier...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit Bespoke Commission Inquiry</span>
                            <Send size={14} className="text-[#C29B5D]" />
                          </>
                        )}
                      </button>

                      <p className="text-[11px] text-[#7A7369] text-center font-mono">
                        Direct 1-on-1 response and prototype schedule dispatched within 24–48 hours.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* 5. LUXURY RESORTS & INSTITUTIONAL SPECIFICATION STRIP                  */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAF8F5] border-b border-[#EAE3D6] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-10">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#C29B5D] uppercase font-bold block mb-2">
              Architectural Endorsements
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
      {/* 6. FREQUENTLY ASKED COMMISSION QUESTIONS                              */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAF8F5] border-b border-[#EAE3D6]">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-12">
            <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#C29B5D] font-bold block mb-2">
              Bespoke Commission Advice
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#141E17]" style={{ fontFamily: serif }}>
              Frequently Asked Atelier Questions
            </h2>
          </FadeUp>

          <FadeUp delay={0.1} className="bg-white border border-[#EAE3D6] rounded-[2px] divide-y divide-[#EAE3D6] shadow-sm">
            {customFaqs.map((faq, i) => {
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
      {/* 7. FINAL DIRECT ATELIER CALLOUT                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0D140F] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <FadeUp>
            <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#C29B5D] font-bold block mb-2">
              Begin Your Custom Commission
            </span>
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight text-white" style={{ fontFamily: serif }}>
              Have a Custom Concept Ready for Discussion?
              <span className="italic font-normal text-[#C29B5D] block"> Let's Bring It To Life in Natural Fibre.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/70 max-w-xl mx-auto leading-relaxed font-light">
              Submit your inquiry or message our lead craft coordinator directly on WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#commission-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-[2px] transition-all shadow-md"
              >
                Go To Commission Form
                <ArrowRight size={14} />
              </a>

              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi KrisluxECO team, I would like to consult on a custom natural fibre design.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 text-[#FAF8F5] hover:border-[#C29B5D] text-xs uppercase tracking-[0.16em] px-7 py-4 rounded-[2px] transition-all"
              >
                <Phone size={14} className="text-[#C29B5D]" />
                WhatsApp Atelier (+91 97986 11931)
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
