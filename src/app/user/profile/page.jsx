"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Upload, Check, Loader2, Camera } from "lucide-react";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

export default function UserProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Profile data states
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Status feedback states
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (res.ok && data.user) {
        setProfile({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          mobile: data.user.mobile || "",
          image: data.user.image || "",
        });
        setImagePreview(data.user.image || "");
      } else {
        setMessage({ type: "error", text: data.message || "Failed to load profile details" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An error occurred fetching your profile details" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image file size should be less than 5MB" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("mobile", profile.mobile);
      
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (profile.image) {
        formData.append("image", profile.image);
      }

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setMessage({ type: "success", text: "Profile details updated successfully!" });
        setProfile({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          mobile: data.user.mobile || "",
          image: data.user.image || "",
        });
        setImagePreview(data.user.image || "");
        setSelectedFile(null);

        // Update NextAuth session immediately so Navbar reflects the change
        await update({
          name: `${data.user.firstName} ${data.user.lastName}`,
          image: data.user.image,
        });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile details" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An error occurred while saving your profile details" });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#4A6741] h-8 w-8 stroke-[1.5]" />
          <p className="text-xs text-[#9E9088] uppercase tracking-widest" style={{ fontFamily: sans }}>
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  // Get user initials
  const initials = `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`.toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1C1C1A] pb-24 pt-28" style={{ fontFamily: sans }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="max-w-3xl mx-auto px-6">
        <h1
          className="text-4xl font-light text-center mb-2 text-[#1C1C1A]"
          style={{ fontFamily: serif }}
        >
          My <span className="italic text-[#4A6741]">Profile</span>
        </h1>
        <div className="h-[2px] w-14 bg-[#C8A97A] mx-auto mb-10" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-[#ECE6DF] p-6 sm:p-10 shadow-[0_4px_24px_rgba(28,28,26,0.02)]"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-28 h-28 rounded-full object-cover border-2 border-[#C8A97A]/40 group-hover:opacity-75 transition-all duration-300 shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-3xl font-semibold border-2 border-[#C8A97A]/40 group-hover:opacity-75 transition-all duration-300 shadow-md">
                    {initials}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="text-white w-6 h-6" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="mt-3 text-xs font-semibold text-[#4A6741] hover:underline"
              >
                Change Profile Image
              </button>
            </div>

            {/* Info Message Banner */}
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`p-4 rounded-xl text-xs font-semibold tracking-wide border flex items-center gap-2 ${
                    message.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {message.type === "success" ? <Check size={16} /> : <div className="w-4 h-4 rounded-full border border-red-500 flex items-center justify-center font-bold">!</div>}
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Fields */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5 uppercase tracking-wider">
                    First Name
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9088]" />
                    <input
                      required
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      placeholder="John"
                      className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5 uppercase tracking-wider">
                    Last Name
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9088]" />
                    <input
                      required
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9088]" />
                  <input
                    disabled
                    type="email"
                    value={profile.email}
                    className="w-full rounded-xl border border-[#E8DDD0] bg-gray-100 pl-10 pr-4 py-3 text-xs text-[#9E9088] cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-[#9E9088] mt-1.5 italic">
                  Email address cannot be changed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1C1A] mb-1.5 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9088]" />
                  <input
                    type="tel"
                    value={profile.mobile}
                    onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-[#E8DDD0] bg-[#FAF7F2] pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition text-[#1C1C1A]"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-[#ECE6DF] pt-6 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-xs font-semibold text-[#6B6560] hover:text-[#1C1C1A] hover:underline"
              >
                Go Back
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#4A6741] hover:bg-[#3a5233] text-white py-3 px-8 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-3.5 w-3.5" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
