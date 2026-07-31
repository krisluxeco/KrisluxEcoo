"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── Shared Typography Helpers (matches Home.jsx) ──────────────────────────────
const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

// ⚠️ Update these with your real business details
const COMPANY = {
  phone: "+9798611931", // used for the "Call Us" button
  whatsapp: "9798611931", // used for the WhatsApp button (no + or spaces)
  email: "krisluxeco@gmail.com",
};

function Eyebrow({ children }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-3">
      <span className="h-px w-8 bg-[#C8A97A]/60" />
      <p
        className="text-xs tracking-[0.25em] uppercase text-[#C8A97A]"
        style={{ fontFamily: sans }}
      >
        {children}
      </p>
      <span className="h-px w-8 bg-[#C8A97A]/60" />
    </div>
  );
}

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated counter for the stats band ───────────────────────────────────────
function Counter({ value, suffix = "", duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
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

// ─── Floating decorative icon (used sparingly in the hero) ─────────────────────
function FloatIcon({ children, className, duration = 6, delay = 0 }) {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5, y: [0, -14, 0], rotate: [0, 4, 0] }}
      transition={{
        opacity: { duration: 1, delay },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: duration * 1.3, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Quick Contact Cards (Call / WhatsApp) ─────────────────────────────────────
function QuickContact() {
  const whatsappMessage = encodeURIComponent(
    "Hi KrisluxECO team, I'd like to enquire about a bulk / B2B order."
  );
  const whatsappHref = `https://wa.me/${COMPANY.whatsapp}?text=${whatsappMessage}`;
  const callHref = `tel:${COMPANY.phone}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <motion.a
        href={callHref}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-4 rounded-[20px] border border-[#E8DDD0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <motion.span
          whileHover={{ rotate: [0, -12, 12, -6, 0] }}
          transition={{ duration: 0.5 }}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#4A6741]/10 text-[#4A6741]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </motion.span>
        <div>
          <p className="text-sm font-semibold text-[#1C1C1A]" style={{ fontFamily: sans }}>
            Call Us
          </p>
          <p className="text-xs text-[#9E9088] mt-0.5">{COMPANY.phone}</p>
        </div>
      </motion.a>

      <motion.a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-4 rounded-[20px] border border-[#E8DDD0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <motion.span
          whileHover={{ rotate: [0, -12, 12, -6, 0] }}
          transition={{ duration: 0.5 }}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#4A6741]/10 text-[#4A6741]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.6 6.32A8.86 8.86 0 0 0 12.04 4c-4.9 0-8.88 3.99-8.88 8.9 0 1.57.41 3.1 1.18 4.45L3 21l3.78-1.32a8.86 8.86 0 0 0 4.26 1.08h.01c4.9 0 8.88-3.99 8.88-8.9 0-2.38-.93-4.61-2.62-6.27L17.6 6.32zm-5.55 13.7h-.01a7.4 7.4 0 0 1-3.78-1.04l-.27-.16-2.81.98.94-2.74-.18-.28a7.34 7.34 0 0 1-1.13-3.92c0-4.07 3.31-7.39 7.4-7.39a7.34 7.34 0 0 1 5.22 2.17 7.32 7.32 0 0 1 2.16 5.22c0 4.07-3.32 7.39-7.4 7.39l.01-.01z" />
          </svg>
        </motion.span>
        <div>
          <p className="text-sm font-semibold text-[#1C1C1A]" style={{ fontFamily: sans }}>
            Message on WhatsApp
          </p>
          <p className="text-xs text-[#9E9088] mt-0.5 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#4A6741] opacity-60 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4A6741]" />
            </span>
            Usually replies within a day
          </p>
        </div>
      </motion.a>
    </div>
  );
}

// ─── Bulk Order Form ────────────────────────────────────────────────────────────
function BulkOrderForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    quantity: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sent
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;

    // Track quote request (fire and forget)
    fetch("/api/user/track-quote", { method: "POST" }).catch(() => { });

    const waMessage = `🌿 *NEW BULK ORDER INQUIRY* 🌿
    
📦 *ORDER DETAILS*
▪️ *Category:* ${form.category || "Not specified"}
▪️ *Estimated Quantity:* ${form.quantity || "Not specified"}

👤 *CONTACT INFO*
▪️ *Name:* ${form.name}
▪️ *Phone:* ${form.phone}
▪️ *Email:* ${form.email}

📝 *MESSAGE*
${form.message || '_No message provided._'}

-----------------------------------
_Sent via KrisluxECO Bulk Orders Page_`;

    const text = encodeURIComponent(waMessage);

    // Send Email via our API
    try {
      await fetch("/api/user/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.category || "General Bulk Inquiry",
          companyName: "Not specified (Bulk Page)",
          contactPerson: form.name,
          email: form.email,
          phone: form.phone,
          quantity: form.quantity || "Not specified",
          additionalInfo: form.message
        }),
      });
    } catch (err) {
      console.error("Failed to send email", err);
    }

    window.open(`https://wa.me/${COMPANY.whatsapp}?text=${text}`, "_blank");
    setStatus("sent");
  };

  const fieldClass = (name) =>
    `w-full rounded-xl border bg-[#FAF7F2] px-4 py-3 text-sm text-[#1C1C1A] placeholder:text-[#B7B0A9] focus:outline-none transition-all duration-200 ${focused === name
      ? "border-[#4A6741] ring-2 ring-[#4A6741]/15 -translate-y-[1px]"
      : "border-[#E8DDD0]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#9E9088] mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused("")}
            placeholder="Your name"
            className={fieldClass("name")}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#9E9088] mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            onFocus={() => setFocused("phone")}
            onBlur={() => setFocused("")}
            placeholder="+91 00000 00000"
            className={fieldClass("phone")}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.15em] text-[#9E9088] mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused("")}
          placeholder="you@company.com"
          className={fieldClass("email")}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#9E9088] mb-2">
            Product Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            onFocus={() => setFocused("category")}
            onBlur={() => setFocused("")}
            className={fieldClass("category") + " appearance-none cursor-pointer"}
          >
            <option value="">Select a category</option>
            <option>Home Decor</option>
            <option>Bath &amp; Body</option>
            <option>Bags &amp; Totes</option>
            <option>Corporate Gifting Sets</option>
            <option>Other / Custom</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-[#9E9088] mb-2">
            Estimated Quantity
          </label>
          <select
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            onFocus={() => setFocused("quantity")}
            onBlur={() => setFocused("")}
            className={fieldClass("quantity") + " appearance-none cursor-pointer"}
          >
            <option value="">Select a range</option>
            <option>50 – 100 units</option>
            <option>100 – 500 units</option>
            <option>500 – 1,000 units</option>
            <option>1,000+ units</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.15em] text-[#9E9088] mb-2">
          Tell us what you need
        </label>
        <textarea
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused("")}
          placeholder="Branding requirements, target timeline, delivery location..."
          className={fieldClass("message") + " resize-none"}
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(74,103,65,0.35)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#4A6741] text-white px-8 py-3.5 rounded-full text-sm tracking-wide transition-all"
      >
        Send Enquiry on WhatsApp
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </motion.svg>
      </motion.button>

      <p className="text-center text-[11px] text-[#B7B0A9]">
        We typically respond to bulk enquiries within 48 working hours.
      </p>

      <AnimatePresence>
        {status === "sent" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-xs text-[#4A6741]"
          >
            Opening WhatsApp with your details — thank you, we'll be in touch shortly.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

// ─── Stats band ─────────────────────────────────────────────────────────────────
function StatsBand() {
  const stats = [
    { value: 200, suffix: "+", label: "Artisan Partners" },
    { value: 14, suffix: "", label: "Indian States Sourced From" },
    { value: 12, suffix: "+", label: "Countries Exported To" },
    { value: 48, suffix: "hrs", label: "Average Quote Turnaround" },
  ];
  return (
    <section className="bg-[#1C1C1A] py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle,_white_1px,_transparent_1px)] [background-size:22px_22px]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.1} className="text-center lg:border-r lg:border-white/10 lg:last:border-r-0">
              <p
                className="text-[clamp(2rem,4vw,3rem)] font-semibold text-white"
                style={{ fontFamily: serif }}
              >
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.15em] text-white/50 mt-2">
                {s.label}
              </p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works / Process ─────────────────────────────────────────────────────
function ProcessSection() {
  const steps = [
    {
      n: "01",
      title: "Share Your Brief",
      desc: "Tell us the product, quantity and timeline through the form or WhatsApp. We come back to you within 48 hours with costing and lead-time estimates.",
    },
    {
      n: "02",
      title: "Approve a Sample",
      desc: "We produce a physical sample matched to your exact specification — material, finish and branding — before a single unit of the bulk run begins.",
    },
    {
      n: "03",
      title: "Production Begins",
      desc: "Your order moves into our partner workshops, with our team checking quality at every stage, not just at the end of the line.",
    },
    {
      n: "04",
      title: "Pack, Inspect & Ship",
      desc: "Final QC, eco-friendly export packaging, and dispatch — with full invoicing and shipping documentation handled for you.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-light leading-tight" style={{ fontFamily: serif }}>
            <span className="text-[#1C1C1A] font-semibold">From enquiry to </span>
            <span className="italic text-[#4A6741] font-semibold">your loading dock</span>
          </h2>
        </FadeUp>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-[#E8DDD0]" />
          {steps.map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.12} className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white border border-[#E8DDD0] shadow-sm mb-5"
              >
                <span className="text-sm font-semibold text-[#4A6741]" style={{ fontFamily: sans }}>
                  {s.n}
                </span>
              </motion.div>
              <p className="font-semibold text-[#1C1C1A] mb-2" style={{ fontFamily: sans }}>
                {s.title}
              </p>
              <p className="text-[13px] text-[#6B6560] leading-relaxed">{s.desc}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Industries We Serve ────────────────────────────────────────────────────────
function IndustriesSection() {
  const industries = [
    {
      icon: "🏨",
      title: "Hospitality & Hotels",
      desc: "Amenity kits, room linen and eco-conscious toiletry packaging for guest experiences that match your brand.",
    },
    {
      icon: "🛍️",
      title: "Retail & Boutiques",
      desc: "Private-label ranges, ready for your shelves, with consistent quality across every reorder.",
    },
    {
      icon: "🎁",
      title: "Corporate Gifting",
      desc: "Festive hampers, onboarding kits and client gifts that feel considered, not generic.",
    },
    {
      icon: "🚢",
      title: "Exporters & Distributors",
      desc: "Container-load programs with consolidated shipping and full compliance documentation.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#F6F2EC]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-12">
          <Eyebrow>Who We Work With</Eyebrow>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-light leading-tight" style={{ fontFamily: serif }}>
            <span className="text-[#1C1C1A] font-semibold">Industries we </span>
            <span className="italic text-[#4A6741] font-semibold">already serve</span>
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((ind, i) => (
            <FadeUp key={ind.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                className="h-full rounded-[22px] bg-white border border-[#ECE6DF] p-6 shadow-sm hover:shadow-lg transition-shadow duration-500"
              >
                <div className="text-3xl mb-4">{ind.icon}</div>
                <p className="font-semibold text-[#1C1C1A] mb-2" style={{ fontFamily: sans }}>
                  {ind.title}
                </p>
                <p className="text-[13px] text-[#6B6560] leading-relaxed">{ind.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Our amenity kits arrived exactly as the sample promised — same texture, same stitching, same finish. That consistency is rare at this volume.",
      name: "Meera Kulkarni",
      role: "Procurement Lead, The Olive Stay",
    },
    {
      quote:
        "We needed a private-label range in under six weeks. The team was upfront about what was realistic and still beat the timeline.",
      name: "Devansh Rao",
      role: "Founder, Terra & Co.",
    },
    {
      quote:
        "Export paperwork is usually our biggest headache. KrisluxECO handled documentation end to end, which saved us days at customs.",
      name: "Aisha Fernandes",
      role: "Sourcing Manager, Cambay Exports",
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-12">
          <Eyebrow>From Our Partners</Eyebrow>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-light leading-tight" style={{ fontFamily: serif }}>
            <span className="text-[#1C1C1A] font-semibold">Trusted by teams </span>
            <span className="italic text-[#4A6741] font-semibold">who reorder</span>
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="h-full flex flex-col rounded-[22px] bg-white border border-[#ECE6DF] p-7 shadow-sm hover:shadow-lg transition-shadow duration-500"
              >
                <span className="text-4xl text-[#C8A97A] leading-none mb-3" style={{ fontFamily: serif }}>
                  "
                </span>
                <p className="text-[14px] text-[#3F3B36] leading-relaxed flex-1 italic" style={{ fontFamily: serif }}>
                  {t.quote}
                </p>
                <div className="mt-5 pt-4 border-t border-[#ECE6DF]">
                  <p className="text-sm font-semibold text-[#1C1C1A]" style={{ fontFamily: sans }}>
                    {t.name}
                  </p>
                  <p className="text-xs text-[#9E9088]">{t.role}</p>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Certifications band ────────────────────────────────────────────────────────
function CertificationsSection() {
  const certs = [
    { mark: "✓", label: "ISO 9001:2015" },
    { mark: "✓", label: "GOTS Certified" },
    { mark: "✓", label: "Fair Trade Verified" },
    { mark: "✓", label: "Plastic-Neutral" },
    { mark: "✓", label: "OEKO-TEX Standard 100" },
  ];
  return (
    <section className="py-14 px-6 bg-[#F6F2EC] border-y border-[#ECE6DF]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {certs.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-[#6B6560]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A6741]/10 text-[#4A6741] text-xs">
                {c.mark}
              </span>
              <span className="text-xs uppercase tracking-[0.1em]" style={{ fontFamily: sans }}>
                {c.label}
              </span>
            </motion.div>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────────
function FAQItem({ q, a, isOpen, onClick }) {
  return (
    <div className="border-b border-[#E8DDD0]">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-[#1C1C1A]" style={{ fontFamily: sans }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 text-xl text-[#4A6741] leading-none"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-8 text-sm text-[#6B6560] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(0);
  const faqs = [
    {
      q: "What's the minimum order quantity (MOQ)?",
      a: "MOQs vary by product, starting from as low as 50 units for select home decor pieces. Share your product brief and we'll confirm the exact MOQ for your category.",
    },
    {
      q: "Can you private label or custom brand our order?",
      a: "Yes. We handle custom tags, branded packaging and bespoke finishing — including logo placement, color matching and packaging inserts.",
    },
    {
      q: "What are typical lead times?",
      a: "Sample approval usually takes 7–10 days. Bulk production runs 3–6 weeks depending on quantity and complexity, followed by 1–2 weeks for export shipping.",
    },
    {
      q: "Do you handle export documentation and shipping?",
      a: "Yes — invoicing, packing lists, certificates of origin and coordination with freight forwarders are all handled on our end for international orders.",
    },
    {
      q: "What payment terms do you offer?",
      a: "Standard terms are 50% advance to confirm production and 50% before dispatch. Custom terms can be discussed for recurring or large-volume partners.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#FAF7F2]">
      <div className="max-w-3xl mx-auto">
        <FadeUp className="text-center mb-10">
          <Eyebrow>Common Questions</Eyebrow>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-light leading-tight" style={{ fontFamily: serif }}>
            <span className="text-[#1C1C1A] font-semibold">Before you </span>
            <span className="italic text-[#4A6741] font-semibold">reach out</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.1} className="rounded-[24px] bg-white border border-[#ECE6DF] shadow-sm px-6 sm:px-8">
          {faqs.map((f, i) => (
            <FAQItem
              key={f.q}
              q={f.q}
              a={f.a}
              isOpen={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Final CTA band ──────────────────────────────────────────────────────────────
function FinalCTA() {
  const whatsappMessage = encodeURIComponent(
    "Hi KrisluxECO team, I'd like to enquire about a bulk / B2B order."
  );
  return (
    <section className="relative py-20 px-6 bg-[#1C1C1A] overflow-hidden">
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#4A6741]/20 rounded-full blur-[100px]" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-[#C8A97A]/10 rounded-full blur-[100px]" />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <FadeUp>
          <Eyebrow>Ready When You Are</Eyebrow>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-light leading-tight text-white" style={{ fontFamily: serif }}>
            Have a deadline? <span className="italic font-semibold text-[#C8A97A]">Let's talk timelines.</span>
          </h2>
          <p className="text-white/60 max-w-md mx-auto mt-4 mb-8 text-sm leading-relaxed">
            Send us your brief today and hear back from our bulk orders team within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#quote-form"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-[#4A6741] text-white px-8 py-3.5 rounded-full text-sm tracking-wide"
            >
              Request a Quote
            </motion.a>
            <motion.a
              href={`https://wa.me/${COMPANY.whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 border border-white/25 text-white px-8 py-3.5 rounded-full text-sm tracking-wide hover:bg-white/5 transition-colors"
            >
              Chat on WhatsApp
            </motion.a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Main Bulk Order Page ───────────────────────────────────────────────────────
export default function BulkOrderPage() {
  const promises = [
    { icon: "📦", title: "Flexible MOQ", desc: "Order sizes that scale with your business, from small pilot batches to full container loads." },
    { icon: "🏷️", title: "Private Labeling", desc: "Branded packaging, custom tags and bespoke finishing for your store or storefront." },
    { icon: "🌿", title: "Sustainable Materials", desc: "Every piece sourced and produced with eco-friendly, traceable materials." },
    { icon: "🤝", title: "200+ Artisan Partners", desc: "A trusted network of craftspeople ready to deliver consistent quality at scale." },
    { icon: "👤", title: "Dedicated Account Manager", desc: "One point of contact from first sample to final shipment — no handoffs, no repeating yourself." },
    { icon: "📋", title: "Export-Ready Documentation", desc: "Invoices, certificates of origin and shipping paperwork prepared and checked before dispatch." },
  ];

  return (
    <main className="bg-[#FAF7F2] text-[#1C1C1A]" style={{ fontFamily: sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ─── HEADER ───────────────────────────────────────────────────────── */}
      <section className="relative pt-40 sm:pt-44 lg:pt-48 pb-16 px-6 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] bg-[#4A6741]/5 rounded-full blur-[140px] pointer-events-none" />

        <FloatIcon className="text-3xl left-[8%] top-[20%] hidden md:block" duration={7}>
          🌿
        </FloatIcon>
        <FloatIcon className="text-3xl right-[10%] top-[15%] hidden md:block" duration={8} delay={0.6}>
          📦
        </FloatIcon>
        <FloatIcon className="text-2xl right-[18%] bottom-[8%] hidden md:block" duration={6.5} delay={1.1}>
          🧵
        </FloatIcon>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeUp>
            <Eyebrow>B2B &amp; Wholesale</Eyebrow>
            <h1
              className="text-[clamp(2.4rem,5.5vw,4rem)] leading-tight font-light"
              style={{ fontFamily: serif }}
            >
              <span className="text-[#1C1C1A]">Bulk Orders, </span>
              <span className="italic font-semibold text-[#4A6741]">Crafted at Scale</span>
            </h1>
            <div className="h-[2px] w-14 bg-[#C8A97A] mx-auto mt-5 mb-6" />
            <p className="text-[#6B6560] max-w-xl mx-auto leading-relaxed">
              Whether you're outfitting a hotel, stocking a store or planning
              corporate gifting, our team will help you source sustainable,
              handcrafted products at the volume your business needs.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#9E9088]">
              Trusted by hotels, retailers &amp; exporters across 12+ countries
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── STATS BAND ───────────────────────────────────────────────────── */}
      <StatsBand />

      {/* ─── FORM + QUICK CONTACT ─────────────────────────────────────────── */}
      <section id="quote-form" className="px-6 py-24 scroll-mt-32 lg:scroll-mt-40">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-6">
          {/* Form card */}
          <FadeUp className="lg:col-span-3">
            <div className="rounded-[28px] bg-white border border-[#ECE6DF] shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 md:p-10">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h2 className="text-2xl font-semibold" style={{ fontFamily: serif }}>
                  Request a Quote
                </h2>
                <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#4A6741] bg-[#4A6741]/10 px-3 py-1 rounded-full whitespace-nowrap">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#4A6741] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4A6741]" />
                  </span>
                  Team online
                </span>
              </div>
              <p className="text-sm text-[#9E9088] mb-7">
                Share a few details and our bulk orders team will reach out.
              </p>
              <BulkOrderForm />
            </div>
          </FadeUp>

          {/* Quick contact + company blurb */}
          <FadeUp delay={0.1} className="lg:col-span-2 space-y-6">
            <div>
              <h3
                className="text-sm uppercase tracking-[0.18em] text-[#9E9088] mb-4"
                style={{ fontFamily: sans }}
              >
                Prefer to talk directly?
              </h3>
              <QuickContact />
            </div>

            <div className="rounded-[24px] bg-[#1C1C1A] text-white p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C8A97A] mb-3">
                Why KrisluxECO
              </p>
              <p className="text-sm text-white/75 leading-relaxed">
                We partner with over 200 artisans across India to manufacture
                sustainable, ISO-certified products with flexible MOQs and
                private labeling — built for retailers, exporters and
                conscious brands.
              </p>
              <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-2 text-xs text-white/50">
                <span>✉</span>
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <ProcessSection />

      {/* ─── OUR PROMISE / COMPANY INFO ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F6F2EC]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <Eyebrow>Our Promise</Eyebrow>
            <h2
              className="text-[clamp(2rem,4vw,3rem)] font-light leading-tight"
              style={{ fontFamily: serif }}
            >
              <span className="text-[#1C1C1A] font-semibold">Built for businesses, </span>
              <span className="italic text-[#4A6741] font-semibold">made for the planet</span>
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promises.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="h-full rounded-[22px] bg-white border border-[#ECE6DF] p-6 shadow-sm hover:shadow-lg transition-shadow duration-500"
                >
                  <div className="text-3xl mb-4">{p.icon}</div>
                  <p className="font-semibold text-[#1C1C1A] mb-2" style={{ fontFamily: sans }}>
                    {p.title}
                  </p>
                  <p className="text-[13px] text-[#6B6560] leading-relaxed">{p.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES WE SERVE ──────────────────────────────────────────── */}
      <IndustriesSection />

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <TestimonialsSection />

      {/* ─── CERTIFICATIONS ───────────────────────────────────────────────── */}
      <CertificationsSection />

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ─── FINAL CTA ────────────────────────────────────────────────────── */}
      <FinalCTA />
    </main>
  );
}
