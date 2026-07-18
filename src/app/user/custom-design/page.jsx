"use client";
import imageCompression from "browser-image-compression";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

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
    <main className="min-h-screen bg-[#FAF7F2] text-[#1C1C1A] py-20 px-6 sm:px-12 pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-light mb-6 text-[#1C1C1A]"
            style={{ fontFamily: serif }}
          >
            Bespoke <span className="text-[#4A6741] italic">Creations</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm md:text-base text-[#6B6560] max-w-xl mx-auto leading-relaxed tracking-wide"
            style={{ fontFamily: sans }}
          >
            Have a unique vision? Our master artisans are ready to bring your custom home decor and sustainable living ideas to life. Share your requirements below.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-none border border-[#E8DDD0] shadow-[0_24px_48px_-12px_rgba(28,28,26,0.05)] p-8 md:p-12 relative overflow-hidden"
        >
          {isSuccess ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <CheckCircle size={64} className="text-[#4A6741] mb-6" strokeWidth={1} />
              </motion.div>
              <h2 className="text-3xl mb-4" style={{ fontFamily: serif }}>
                Request Received
              </h2>
              <p className="text-[#6B6560] text-sm tracking-wide max-w-md mx-auto" style={{ fontFamily: sans }}>
                Thank you for your interest. Our design team is reviewing your bespoke request and will reach out to you shortly to discuss the next steps.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-10 px-8 py-3 bg-[#1C1C1A] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#4A6741] transition-colors"
                style={{ fontFamily: sans }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#9E9088] font-bold mb-3" style={{ fontFamily: sans }}>
                    Full Name <span className="text-[#C8A97A]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[#E8DDD0] pb-3 text-sm focus:outline-none focus:border-[#4A6741] transition-colors text-[#1C1C1A] placeholder-[#D9CFC2]"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#9E9088] font-bold mb-3" style={{ fontFamily: sans }}>
                    Email Address <span className="text-[#C8A97A]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!session?.user?.email}
                    placeholder="john@example.com"
                    className="w-full bg-[#FAF7F2] border border-[#E8DDD0] px-4 py-3 text-sm focus:outline-none focus:border-[#4A6741] transition-colors text-[#1C1C1A]"
                  />
                  {session?.user?.email && (
                    <p className="text-[10px] text-[#9E9088] mt-1">Using your account email to link this request to your dashboard.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#9E9088] font-bold mb-3" style={{ fontFamily: sans }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#E8DDD0] pb-3 text-sm focus:outline-none focus:border-[#4A6741] transition-colors text-[#1C1C1A] placeholder-[#D9CFC2]"
                  placeholder="+91 00000 00000"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#9E9088] font-bold mb-3" style={{ fontFamily: sans }}>
                  Design Requirements <span className="text-[#C8A97A]">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#FAF7F2] border border-[#E8DDD0] p-4 text-sm focus:outline-none focus:border-[#4A6741] transition-colors text-[#1C1C1A] placeholder-[#D9CFC2] resize-none"
                  placeholder="Describe your vision, dimensions, materials, and any specific details..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#9E9088] font-bold mb-3" style={{ fontFamily: sans }}>
                  Reference Image (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center justify-center w-full bg-[#FAF7F2] border border-dashed border-[#E8DDD0] p-6 text-sm text-[#9E9088] cursor-pointer hover:border-[#4A6741] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <span>{imageFile ? imageFile.name : "Click to upload an image"}</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-4 border border-red-100">
                  {error}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center gap-4 bg-[#1C1C1A] text-white px-8 py-4 overflow-hidden disabled:opacity-70"
                >
                  <span className="absolute inset-0 w-full h-full bg-[#4A6741] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 text-xs uppercase tracking-[0.2em] font-bold" style={{ fontFamily: sans }}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </span>
                  {isSubmitting ? (
                    <Loader2 size={16} className="relative z-10 animate-spin text-[#C8A97A]" />
                  ) : (
                    <Send size={16} className="relative z-10 text-[#C8A97A] group-hover:text-white transition-colors duration-500" />
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}
