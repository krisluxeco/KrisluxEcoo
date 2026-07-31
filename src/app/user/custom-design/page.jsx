"use client";
import imageCompression from "browser-image-compression";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

export default function CustomDesignPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  // Prepopulate email when session loads
  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({ ...prev, email: session.user.email, name: session.user.name || prev.name }));
    }
  }, [session]);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
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
      dataToSend.append("description", formData.description);
      if (imageFile) {
        try {
          const compressedFile = await imageCompression(imageFile, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          dataToSend.append("image", compressedFile);
        } catch (error) {
          console.error("Image compression error:", error);
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
      setFormData({ name: "", email: "", phone: "", description: "" });
      setImageFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1C1C1A] flex flex-col lg:flex-row pt-20 lg:pt-28 overflow-x-hidden">
      {/* Left Column - Image & Typography */}
      <div className="lg:w-1/2 relative min-h-[60vh] lg:min-h-[calc(100vh-7rem)] flex items-center justify-center p-8 md:p-16 overflow-hidden group">
        <div className="absolute inset-0 z-0 lg:fixed lg:top-28 lg:w-1/2 lg:h-[calc(100vh-7rem)] overflow-hidden bg-[#1C1C1A]">
          {/* YouTube Video Background */}
          <iframe
            src="https://www.youtube.com/embed/VT7leFlgaAU?autoplay=1&mute=1&loop=1&playlist=VT7leFlgaAU&controls=0&rel=0&playsinline=1&modestbranding=1&iv_load_policy=3&disablekb=1"
            className="absolute top-1/2 left-1/2 w-[300vw] h-[300vh] lg:w-[150vw] lg:h-[150vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-80"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
        </div>

        <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block mb-6 px-5 py-2 border border-[#C8A97A]/40 rounded-full text-[#C8A97A] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium backdrop-blur-md bg-black/40"
            style={{ fontFamily: sans }}
          >
            Quiet Eco-Luxury · 100% Biodegradable
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-white leading-[1.1]"
            style={{ fontFamily: serif }}
          >
            Bespoke <span className="text-[#C8A97A] italic">Eco-Friendly</span> <br /> Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-[17px] text-[#E8DDD0] leading-relaxed max-w-md font-light mx-auto"
            style={{ fontFamily: sans }}
          >
            Discover the perfect harmony of nature and elegance. We specialize in crafting Eco-Luxury sustainable products that bring your unique vision to life. Collaborate directly with our artisans to create bespoke, premium items that are as beautiful as they are kind to the earth.
          </motion.p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 py-16 lg:py-24 bg-[#FAF7F2] relative ml-auto">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8DDD0]/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="w-full max-w-xl relative z-10">
          <div className="mb-6 text-center">
            <p className="text-lg md:text-xl font-bold text-[#1C1C1A] uppercase tracking-wider" style={{ fontFamily: sans }}>
              We are converting waste into sustainable Eco-Luxury
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(28,28,26,0.06)] border border-[#E8DDD0]/60 p-8 md:p-14 relative overflow-hidden"
          >
            {/* Form Inner Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A97A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              {isSuccess ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div className="w-24 h-24 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-8 mx-auto border border-[#E8DDD0]/50">
                      <CheckCircle size={40} className="text-[#4A6741]" strokeWidth={1} />
                    </div>
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl mb-4 text-[#1C1C1A]" style={{ fontFamily: serif }}>
                    Inquiry Received
                  </h2>
                  <p className="text-[#6B6560] text-sm md:text-base leading-relaxed max-w-xs mx-auto mb-10 font-light" style={{ fontFamily: sans }}>
                    Our master artisans are reviewing your vision. We will be in touch shortly to schedule a consultation.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-10 py-4 border border-[#1C1C1A] text-[#1C1C1A] text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-[#1C1C1A] hover:text-white transition-all duration-500"
                    style={{ fontFamily: sans }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative group">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6560] font-medium mb-2 transition-colors group-focus-within:text-[#1C1C1A]" style={{ fontFamily: sans }}>
                        Full Name <span className="text-[#C8A97A]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[#E8DDD0] px-0 py-2 rounded-none text-base focus:outline-none focus:border-[#1C1C1A] transition-colors text-[#1C1C1A] placeholder-[#9E9088]/60 font-light"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="relative group">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6560] font-medium mb-2 transition-colors group-focus-within:text-[#1C1C1A]" style={{ fontFamily: sans }}>
                        Email Address <span className="text-[#C8A97A]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!!session?.user?.email}
                        placeholder="jane@example.com"
                        className="w-full bg-transparent border-b border-[#E8DDD0] px-0 py-2 rounded-none text-base focus:outline-none focus:border-[#1C1C1A] transition-colors text-[#1C1C1A] placeholder-[#9E9088]/60 font-light disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6560] font-medium mb-2 transition-colors group-focus-within:text-[#1C1C1A]" style={{ fontFamily: sans }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-[#E8DDD0] px-0 py-2 rounded-none text-base focus:outline-none focus:border-[#1C1C1A] transition-colors text-[#1C1C1A] placeholder-[#9E9088]/60 font-light"
                      placeholder="+91 00000 00000"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6560] font-medium mb-2 transition-colors group-focus-within:text-[#1C1C1A]" style={{ fontFamily: sans }}>
                      Design Requirements <span className="text-[#C8A97A]">*</span>
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-[#E8DDD0] px-0 py-2 rounded-none text-base focus:outline-none focus:border-[#1C1C1A] transition-colors text-[#1C1C1A] placeholder-[#9E9088]/60 resize-none font-light leading-relaxed"
                      placeholder="Describe your vision, dimensions, preferred materials..."
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6B6560] font-medium mb-4" style={{ fontFamily: sans }}>
                      Reference Image <span className="lowercase italic opacity-60">(optional)</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full bg-transparent border border-dashed border-[#E8DDD0] p-8 cursor-pointer hover:border-[#1C1C1A] transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="mb-3 text-[#9E9088] group-hover:text-[#1C1C1A] transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-light text-[#1C1C1A] mb-1 text-center truncate max-w-[250px]">{imageFile ? imageFile.name : "Upload your reference"}</span>
                      <span className="text-[10px] text-[#9E9088] text-center tracking-widest uppercase">Max 1MB</span>
                    </label>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-xs flex items-center gap-2 font-light">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </motion.div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full flex items-center justify-center gap-4 bg-[#1C1C1A] text-white px-8 py-5 overflow-hidden disabled:opacity-50 transition-all hover:bg-[#333]"
                    >
                      <span className="relative z-10 text-[11px] uppercase tracking-[0.3em] font-medium" style={{ fontFamily: sans }}>
                        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                      </span>
                      {isSubmitting ? (
                        <Loader2 size={16} className="relative z-10 animate-spin text-[#C8A97A]" />
                      ) : (
                        <Send size={16} className="relative z-10 text-[#C8A97A] transform group-hover:translate-x-1 transition-transform" />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
