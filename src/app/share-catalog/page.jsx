"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Shared Typography Helpers ─────────────────────────────────────────────────
const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

function Leaf({ style }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none text-[#4A6741]"
      style={style}
      animate={{
        y: ["0%", "-120vh"],
        rotate: [0, 360],
        x: [0, style.drift ?? 30, 0],
        opacity: [0, 0.16, 0.09, 0],
      }}
      transition={{
        duration: style.dur ?? 14,
        repeat: Infinity,
        delay: style.delay ?? 0,
        ease: "linear",
      }}
    >
      <svg
        width={style.size ?? 16}
        height={style.size ?? 16}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4 .83-.83 3-2.67 4-5-2.5 1-5.33 2.5-7 4.5C9 8 8.5 11 9 14c-1-1.5-1.5-4-1-6-2 2-3 6-3 8a8 8 0 0 0 8 8c4-2 5-9 4-16z" />
      </svg>
    </motion.div>
  );
}

const leaves = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  style: {
    left: `${(i * 9.7 + 4) % 100}%`,
    bottom: "-5%",
    size: 11 + (i % 5) * 4,
    dur: 11 + (i % 6) * 2,
    delay: i * 1.1,
    drift: -18 + (i % 4) * 16,
  },
}));

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

function FloatField({
  label,
  type = "text",
  icon,
  name,
  value,
  onChange,
  required,
  accept,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative flex items-center gap-3 rounded-xl border bg-white/60 backdrop-blur-md px-5 transition-all duration-500 ${
        focused
          ? "border-[#C8A97A] shadow-[0_4px_20px_rgba(200,169,122,0.15)]"
          : "border-[#E8DDD0] hover:border-[#C8A97A]/50"
      }`}
      style={{ height: 64 }}
    >
      <span
        className={`shrink-0 transition-colors duration-500 ${focused ? "text-[#C8A97A]" : "text-[#9E9088]"}`}
      >
        {icon}
      </span>

      <div className="relative flex-1 h-full flex items-center">
        <input
          id={name}
          name={name}
          type={type}
          accept={accept}
          required={required}
          placeholder=" "
          value={type !== "file" ? value : undefined}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="peer w-full bg-transparent outline-none text-[#1C1C1A] text-[15px]"
          style={{ fontFamily: sans }}
        />
        <label
          htmlFor={name}
          className={`absolute left-0 top-1/2 -translate-y-1/2 origin-left select-none pointer-events-none transition-all duration-300 ease-out text-[#9E9088] uppercase tracking-[0.15em] text-[10px] 
          ${
            type === "file" 
              ? "-translate-y-[28px] scale-90 text-[#C8A97A]"
              : "peer-focus:-translate-y-[28px] peer-focus:scale-90 peer-focus:text-[#C8A97A] peer-[:not(:placeholder-shown)]:-translate-y-[28px] peer-[:not(:placeholder-shown)]:scale-90"
          }`}
          style={{ fontFamily: sans }}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

function OrbitAccent() {
  return (
    <div className="absolute -top-3 right-0 w-16 h-16 pointer-events-none hidden sm:block">
      <motion.svg
        viewBox="0 0 64 64"
        width="64"
        height="64"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#C8A97A"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.45"
        />
      </motion.svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="#4A6741"
          opacity="0.5"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4 .83-.83 3-2.67 4-5-2.5 1-5.33 2.5-7 4.5C9 8 8.5 11 9 14c-1-1.5-1.5-4-1-6-2 2-3 6-3 8a8 8 0 0 0 8 8c4-2 5-9 4-16z" />
        </svg>
      </motion.div>
    </div>
  );
}

export default function ShareCatalogPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    organisationName: "",
    ownerName: "",
    location: "",
    email: "",
    phone: "",
    moq: "",
    sustainableMaterial: "",
    productType: "",
    collaborationModel: "",
    file: null,
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.file) {
      setError("Please select a PDF file to upload.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("organisationName", formData.organisationName);
      data.append("ownerName", formData.ownerName);
      data.append("location", formData.location);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("moq", formData.moq);
      data.append("sustainableMaterial", formData.sustainableMaterial);
      data.append("productType", formData.productType);
      data.append("collaborationModel", formData.collaborationModel);
      data.append("file", formData.file);

      const res = await fetch("/api/catalogs", {
        method: "POST",
        body: data, // No Content-Type, fetch handles multipart/form-data with FormData
      });
      const result = await res.json();
      
      if (!res.ok) {
        setError(result.message);
      } else {
        setSuccess("Catalog uploaded successfully! We will review it shortly.");
        setFormData({ 
          organisationName: "", ownerName: "", location: "", email: "", phone: "", 
          moq: "", sustainableMaterial: "", productType: "", collaborationModel: "", file: null 
        });
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen bg-[#FAF7F2] text-[#1C1C1A]"
      style={{ fontFamily: sans }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="relative min-h-screen grid lg:grid-cols-[1fr_1.05fr]">
        {/* LEFT — Form panel */}
        <section className="relative flex flex-col items-center justify-center px-6 sm:px-10 pt-32 pb-16 lg:pt-32 lg:pb-16 order-2 lg:order-1 min-h-screen overflow-hidden">
          <div className="absolute inset-0 z-0 lg:hidden opacity-60">
            {leaves.slice(0, 6).map((l) => (
              <Leaf key={l.id} style={l.style} />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[520px] h-[520px] rounded-full blur-[120px] opacity-[0.06] bg-[#4A6741]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 w-full max-w-[440px]"
          >
            {/* Heading */}
            <div className="relative">
              <OrbitAccent />
              <Eyebrow>Partner With Us</Eyebrow>
              <h2
                className="text-center text-[clamp(1.9rem,4vw,2.5rem)] leading-tight font-light mb-2"
                style={{ fontFamily: serif }}
              >
                <span className="text-[#1C1C1A]">Showcase your </span>
                <span className="italic text-[#4A6741]">Collection</span>
              </h2>
            </div>
            
            <p className="text-center text-[13.5px] text-[#9E9088] mb-9 px-4">
              Upload your shop's PDF catalog to showcase your products to our community.
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-[#FAD4D6] px-4 py-3 text-sm text-[#8B1C1C] mb-6 text-center"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-[#E6F3E6] border border-[#8FBD84]/30 px-4 py-3 text-sm text-[#4A6741] mb-6 text-center"
              >
                {success}
              </motion.div>
            )}

            <motion.form 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4" 
              onSubmit={handleSubmit}
            >
              <FloatField
                label="Organisation Name"
                name="organisationName"
                type="text"
                required={true}
                value={formData.organisationName}
                onChange={handleChange}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <FloatField
                  label="Owner Name"
                  name="ownerName"
                  type="text"
                  required={true}
                  value={formData.ownerName}
                  onChange={handleChange}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  }
                />
                <FloatField
                  label="Location"
                  name="location"
                  type="text"
                  required={true}
                  value={formData.location}
                  onChange={handleChange}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FloatField
                  label="Email Address"
                  name="email"
                  type="email"
                  required={true}
                  value={formData.email}
                  onChange={handleChange}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                  }
                />
                <FloatField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  required={true}
                  value={formData.phone}
                  onChange={handleChange}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FloatField
                  label="MOQ"
                  name="moq"
                  type="text"
                  required={false}
                  value={formData.moq}
                  onChange={handleChange}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  }
                />
                <FloatField
                  label="Type of Product"
                  name="productType"
                  type="text"
                  required={false}
                  value={formData.productType}
                  onChange={handleChange}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  }
                />
              </div>

              <FloatField
                label="Sustainable Material"
                name="sustainableMaterial"
                type="text"
                required={false}
                value={formData.sustainableMaterial}
                onChange={handleChange}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4 .83-.83 3-2.67 4-5-2.5 1-5.33 2.5-7 4.5C9 8 8.5 11 9 14c-1-1.5-1.5-4-1-6-2 2-3 6-3 8a8 8 0 0 0 8 8c4-2 5-9 4-16z" />
                  </svg>
                }
              />

              <FloatField
                label="Collaboration Model"
                name="collaborationModel"
                type="text"
                required={false}
                value={formData.collaborationModel}
                onChange={handleChange}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
              />

              <div className="relative group mt-2">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  required={true}
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-500 bg-white/40 backdrop-blur-md ${formData.file ? 'border-[#C8A97A] bg-[#FAF7F2]' : 'border-[#D8CFC2] group-hover:border-[#C8A97A]/60 group-hover:bg-white/60'}`}>
                  {formData.file ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[#E6F3E6] flex items-center justify-center text-[#4A6741] shadow-[0_4px_15px_rgba(74,103,65,0.15)]">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10.08 10.08 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold text-[#1C1C1A] text-center truncate max-w-[250px]">{formData.file.name}</span>
                        <span className="text-[10px] uppercase tracking-widest text-[#4A6741] mt-1 font-medium">Ready to upload</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#9E9088] shadow-sm group-hover:text-[#C8A97A] group-hover:shadow-[0_4px_20px_rgba(200,169,122,0.15)] transition-all duration-500">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-[#1C1C1A] block">Click or drag PDF here</span>
                        <span className="text-[11px] text-[#9E9088] mt-1 block">Maximum file size 10MB</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center gap-4 bg-gradient-to-r from-[#1C1C1A] to-[#2A2A28] text-[#E8DDD0] border border-[#333] px-8 py-4 rounded-xl overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(28,28,26,0.15)] mt-8 disabled:opacity-70"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10 text-[11px] uppercase tracking-[0.3em] font-medium text-[#E8DDD0]" style={{ fontFamily: sans }}>
                  {loading ? "Uploading..." : "Share Catalog"}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10 text-[#C8A97A] transform group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.form>

            {/* Bottom gold rule */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <span className="h-px w-8 bg-[#C8A97A]/50" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C8A97A]">
                Secure · Private
              </span>
              <span className="h-px w-8 bg-[#C8A97A]/50" />
            </div>
          </motion.div>
        </section>

        {/* RIGHT — Editorial / brand panel */}
        <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#1C1C1A] px-14 py-12 order-1 lg:order-2 sticky top-0 h-screen">
          {/* Background image */}
          <div className="absolute inset-0">
            <motion.div
              initial={{ scale: 1.08, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(/images/BrandStory4.png)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-[#1C1C1A]/75 to-[#1C1C1A]/35" />
            <div className="absolute inset-0 bg-[#1C1C1A]/20" />
          </div>

          <div className="absolute inset-0 z-[1]">
            {leaves.map((l) => (
              <Leaf key={l.id} style={l.style} />
            ))}
          </div>

          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 25, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full blur-[140px] opacity-25"
            style={{
              background:
                "radial-gradient(circle, #C8A97A 0%, transparent 70%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex items-center gap-2.5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#8FBD84">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4 .83-.83 3-2.67 4-5-2.5 1-5.33 2.5-7 4.5C9 8 8.5 11 9 14c-1-1.5-1.5-4-1-6-2 2-3 6-3 8a8 8 0 0 0 8 8c4-2 5-9 4-16z" />
            </svg>
            <span
              className="font-semibold text-white"
              style={{ fontFamily: serif, fontSize: "1.15rem" }}
            >
              Krislux<span className="text-[#8FBD84]">ECO</span>
            </span>
          </motion.div>

          <div className="relative z-10 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FBD84] animate-pulse" />
              B2B Partnerships
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="leading-[1.08] text-white mb-6"
              style={{
                fontFamily: serif,
                fontSize: "clamp(2.4rem, 4vw, 3.2rem)",
              }}
            >
              <span className="block font-light">
                Showcase your{" "}
                <span className="italic font-normal text-[#C8A97A]">Craft</span>
              </span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="h-[2px] w-14 bg-[#C8A97A] mb-6 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-white/70 text-[15px] leading-relaxed"
            >
              Partner with KrisluxECO to bring your sustainable and handcrafted products to a wider audience. Upload your catalog to get started.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative z-10 flex items-center gap-6 flex-wrap"
          >
            {["Handcrafted", "Sustainable"].map(
              (item, i) => (
                <div key={item} className="flex items-center gap-2">
                  {i !== 0 && (
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                  )}
                  <span className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                    {item}
                  </span>
                </div>
              ),
            )}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
