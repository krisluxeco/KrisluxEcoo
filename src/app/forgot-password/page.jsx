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
  autoComplete,
  value,
  onChange,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative flex items-center gap-3 rounded-2xl border bg-white/70 backdrop-blur-sm px-5 transition-all duration-300 ${
        focused
          ? "border-[#4A6741] shadow-[0_0_0_4px_rgba(74,103,65,0.08)]"
          : "border-[#E8DDD0]"
      }`}
      style={{ height: 58 }}
    >
      <span
        className={`shrink-0 transition-colors duration-300 ${focused ? "text-[#4A6741]" : "text-[#B7AFA4]"}`}
      >
        {icon}
      </span>

      <div className="relative flex-1 h-full">
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder=" "
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="peer absolute inset-x-0 bottom-0 w-full bg-transparent outline-none text-[#1C1C1A] text-[15px] h-[24px]"
          style={{ fontFamily: sans }}
        />
        <label
          htmlFor={name}
          className="absolute left-0 bottom-[6px] origin-left select-none pointer-events-none transition-all duration-200 ease-out text-[#9E9088] peer-focus:-translate-y-[20px] peer-focus:scale-[0.78] peer-focus:text-[#4A6741] peer-[:not(:placeholder-shown)]:-translate-y-[20px] peer-[:not(:placeholder-shown)]:scale-[0.78]"
          style={{ fontFamily: sans }}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

function PasswordField({ label, name, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`relative flex items-center gap-3 rounded-2xl border bg-white/70 backdrop-blur-sm px-5 transition-all duration-300 ${
        focused
          ? "border-[#4A6741] shadow-[0_0_0_4px_rgba(74,103,65,0.08)]"
          : "border-[#E8DDD0]"
      }`}
      style={{ height: 58 }}
    >
      <span
        className={`shrink-0 transition-colors duration-300 ${focused ? "text-[#4A6741]" : "text-[#B7AFA4]"}`}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="4" y="11" width="16" height="9" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </span>

      <div className="relative flex-1 h-full">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder=" "
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="peer absolute inset-x-0 bottom-0 w-full bg-transparent outline-none text-[#1C1C1A] text-[15px] h-[24px]"
          style={{ fontFamily: sans }}
        />
        <label
          htmlFor={name}
          className="absolute left-0 bottom-[6px] origin-left select-none pointer-events-none transition-all duration-200 ease-out text-[#9E9088] peer-focus:-translate-y-[20px] peer-focus:scale-[0.78] peer-focus:text-[#4A6741] peer-[:not(:placeholder-shown)]:-translate-y-[20px] peer-[:not(:placeholder-shown)]:scale-[0.78]"
          style={{ fontFamily: sans }}
        >
          {label}
        </label>
      </div>

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="shrink-0 text-[#B7AFA4] hover:text-[#4A6741] transition-colors duration-200"
        aria-label="Toggle password visibility"
      >
        {visible ? (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a13.16 13.16 0 0 1 2.16-3.19m3.9-2.27A9.77 9.77 0 0 1 12 5c5 0 9.27 3.11 11 7.5a13.06 13.06 0 0 1-1.67 2.68M9.9 9.9a3 3 0 1 0 4.2 4.2" />
            <path d="M2 2l20 20" />
          </svg>
        ) : (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M1 12s4-7.5 11-7.5S23 12 23 12s-4 7.5-11 7.5S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // step = 1 (Request OTP), step = 2 (Verify OTP and Reset)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message);
      } else {
        setSuccess(data.message);
        setStep(2);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message);
      } else {
        setSuccess(data.message);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen bg-[#FAF7F2] text-[#1C1C1A] overflow-hidden"
      style={{ fontFamily: sans }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div className="relative min-h-screen grid lg:grid-cols-[1fr_1.05fr]">
        {/* LEFT — Form panel */}
        <section className="relative flex items-center justify-center px-6 sm:px-10 py-14 lg:py-12 order-2 lg:order-1">
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
              <Eyebrow>Account Recovery</Eyebrow>
              <h2
                className="text-center text-[clamp(1.9rem,4vw,2.5rem)] leading-tight font-light mb-2"
                style={{ fontFamily: serif }}
              >
                <span className="text-[#1C1C1A]">Reset your </span>
                <span className="italic text-[#4A6741]">password</span>
              </h2>
            </div>
            
            <p className="text-center text-[13.5px] text-[#9E9088] mb-9 px-4">
              {step === 1 
                ? "Enter your email address to receive a 6-digit verification code."
                : "Enter the code sent to your email along with your new password."}
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

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4" 
                  onSubmit={handleRequestOtp}
                >
                  <FloatField
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M3 7l9 6 9-6" />
                      </svg>
                    }
                  />

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.015, boxShadow: "0 14px 36px rgba(74,103,65,0.38)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-[#4A6741] text-white py-4 rounded-2xl text-sm tracking-wide font-medium transition-all disabled:opacity-70"
                    style={{ fontFamily: sans }}
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4" 
                  onSubmit={handleResetPassword}
                >
                  <FloatField
                    label="6-Digit Verification Code"
                    name="otp"
                    type="text"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                      </svg>
                    }
                  />

                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.015, boxShadow: "0 14px 36px rgba(74,103,65,0.38)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-[#4A6741] text-white py-4 rounded-2xl text-sm tracking-wide font-medium transition-all disabled:opacity-70"
                    style={{ fontFamily: sans }}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="text-[13px] text-[#9E9088] hover:text-[#4A6741] transition-colors"
              >
                &larr; Back to login
              </Link>
            </div>
            
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
        <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#1C1C1A] px-14 py-12 order-1 lg:order-2">
          {/* Background image */}
          <div className="absolute inset-0">
            <motion.div
              initial={{ scale: 1.08, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600)",
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
              Security First
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
                Regain access{" "}
                <span className="italic font-normal text-[#C8A97A]">securely</span>
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
              Your security is our priority. A verification code will be sent to your registered email to ensure only you can regain access to your account.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative z-10 flex items-center gap-6 flex-wrap"
          >
            {["Encrypted Reset", "Time-sensitive OTP"].map(
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
