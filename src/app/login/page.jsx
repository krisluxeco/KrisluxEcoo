"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// ─── Shared Typography Helpers ─────────────────────────────────────────────────
const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

// ─── Floating Leaf Particle (reused from home / register) ──────────────────────
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

// ─── Eyebrow (matches home / register) ──────────────────────────────────────────
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

// ─── Floating label input ──────────────────────────────────────────────────────
// Note: autofill (browser/password-manager) sets the input value directly and
// does not reliably fire React's onChange, which desyncs a JS-state-driven label
// from the actual content. The :placeholder-shown CSS trick (via placeholder=" ")
// keeps the label position correct in all cases, including autofill.
//
// IMPORTANT: Tailwind's `peer` / `peer-*` pairing only works when the element
// carrying `peer` appears BEFORE the element using `peer-*` in the DOM, because
// it compiles to a CSS subsequent-sibling selector (.peer:focus ~ .peer-focus\:foo).
// The input must come first, with the label rendered after it and positioned
// absolutely back on top. That's why the input is no longer wrapped/preceded
// by the label below.
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
      className={`relative flex items-center gap-3 rounded-xl border bg-white/60 backdrop-blur-md px-5 transition-all duration-500 ${
        focused
          ? "border-[#C8A97A] shadow-[0_4px_20px_rgba(200,169,122,0.15)]"
          : "border-[#E8DDD0] hover:border-[#C8A97A]/50"
      }`}
      style={{ height: 64 }}
    >
      <span className={`shrink-0 transition-colors duration-500 ${focused ? "text-[#C8A97A]" : "text-[#9E9088]"}`}>
        {icon}
      </span>

      <div className="relative flex-1 h-full flex items-center">
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
          className="peer w-full bg-transparent outline-none text-[#1C1C1A] text-[15px]"
          style={{ fontFamily: sans }}
        />
        <label
          htmlFor={name}
          className="absolute left-0 top-1/2 -translate-y-1/2 origin-left select-none pointer-events-none transition-all duration-300 ease-out text-[#9E9088] uppercase tracking-[0.15em] text-[10px] peer-focus:-translate-y-[28px] peer-focus:scale-90 peer-focus:text-[#C8A97A] peer-[:not(:placeholder-shown)]:-translate-y-[28px] peer-[:not(:placeholder-shown)]:scale-90"
          style={{ fontFamily: sans }}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

// ─── Password field with visibility toggle ─────────────────────────────────────
function PasswordField({ label, name, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`relative flex items-center gap-3 rounded-xl border bg-white/60 backdrop-blur-md px-5 transition-all duration-500 ${
        focused
          ? "border-[#C8A97A] shadow-[0_4px_20px_rgba(200,169,122,0.15)]"
          : "border-[#E8DDD0] hover:border-[#C8A97A]/50"
      }`}
      style={{ height: 64 }}
    >
      <span className={`shrink-0 transition-colors duration-500 ${focused ? "text-[#C8A97A]" : "text-[#9E9088]"}`}>
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

      <div className="relative flex-1 h-full flex items-center">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          placeholder=" "
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="peer w-full bg-transparent outline-none text-[#1C1C1A] text-[15px]"
          style={{ fontFamily: sans }}
        />
        <label
          htmlFor={name}
          className="absolute left-0 top-1/2 -translate-y-1/2 origin-left select-none pointer-events-none transition-all duration-300 ease-out text-[#9E9088] uppercase tracking-[0.15em] text-[10px] peer-focus:-translate-y-[28px] peer-focus:scale-90 peer-focus:text-[#C8A97A] peer-[:not(:placeholder-shown)]:-translate-y-[28px] peer-[:not(:placeholder-shown)]:scale-90"
          style={{ fontFamily: sans }}
        >
          {label}
        </label>
      </div>

      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="shrink-0 text-[#9E9088] hover:text-[#C8A97A] transition-colors duration-300"
        aria-label="Toggle password visibility"
      >
        {visible ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
        )}
      </button>
    </div>
  );
}

// ─── Luxury Brand Philosophy Component ──────────────────────────────────────────
function BrandPhilosophy() {
  return (
    <div className="mt-10 p-8 rounded-2xl bg-[#1C1C1A]/40 backdrop-blur-xl border border-white/10 relative overflow-hidden flex flex-col justify-center gap-5 shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A97A] to-transparent opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A97A] to-transparent opacity-20" />
      
      <p
        className="text-[#E8DDD0] text-[16px] italic text-center leading-relaxed font-light"
        style={{ fontFamily: serif }}
      >
        "True luxury lies in the harmony between exquisite craftsmanship and profound respect for our natural world."
      </p>
      <div className="flex items-center justify-center gap-3 mt-2">
         <span className="h-px w-8 bg-[#C8A97A]/40" />
         <span className="text-[9px] uppercase tracking-[0.3em] text-[#C8A97A]">The KrisluxECO Promise</span>
         <span className="h-px w-8 bg-[#C8A97A]/40" />
      </div>
    </div>
  );
}

// ─── Google Button ──────────────────────────────────────────────────────────────
function GoogleButton() {
  return (
    <motion.button
      onClick={() => signIn("google", { callbackUrl: "/post-login" })}
      type="button"
      whileHover={{
        scale: 1.015,
        y: -1,
        boxShadow: "0 10px 30px rgba(28,28,26,0.08)",
      }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#E8DDD0] bg-white/70 hover:bg-white backdrop-blur-md px-5 py-4 text-sm font-medium text-[#1C1C1A] transition-all hover:border-[#C8A97A]/50"
      style={{ fontFamily: sans }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.14A6.96 6.96 0 0 1 5.43 12c0-.74.13-1.46.36-2.14V7.02H2.18A11.93 11.93 0 0 0 1 12c0 1.92.46 3.74 1.18 5.34l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.02l3.66 2.84c.87-2.6 3.3-4.48 6.16-4.48z"
        />
      </svg>
      Continue with Google
    </motion.button>
  );
}

// ─── Decorative orbiting ring accent behind the form heading ──────────────────
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

// ─── Main Login Page ────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    // pull the freshly-issued session to check role
    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();

    setLoading(false);

    if (sessionData?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  return (
    <main
      className="relative min-h-screen bg-[#FAF7F2] text-[#1C1C1A] overflow-hidden"
      style={{ fontFamily: sans }}
    >
      {/* Google Fonts */}
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: #1C1C1A !important;
    caret-color: #1C1C1A !important;
    transition: background-color 5000s ease-in-out 0s;
    box-shadow: 0 0 0px 1000px transparent inset !important;
  }
`}</style>

      <div className="relative min-h-screen grid lg:grid-cols-[1fr_1.05fr]">
        {/* ─────────────────────────────────────────────────────────────────────
            LEFT — Form panel (swapped side vs. register, for visual rhythm)
        ───────────────────────────────────────────────────────────────────── */}
        <section className="relative flex items-center justify-center px-6 sm:px-10 py-14 lg:py-12 order-2 lg:order-1">
          {/* Faint ambient leaves for mobile/full-width too */}
          <div className="absolute inset-0 z-0 lg:hidden opacity-60">
            {leaves.slice(0, 6).map((l) => (
              <Leaf key={l.id} style={l.style} />
            ))}
          </div>

          {/* Subtle radial glow behind the card */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[520px] h-[520px] rounded-full blur-[120px] opacity-[0.06] bg-[#4A6741]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-10 w-full max-w-[440px]"
          >
            {/* Mobile-only logo */}
            <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#4A6741">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4 .83-.83 3-2.67 4-5-2.5 1-5.33 2.5-7 4.5C9 8 8.5 11 9 14c-1-1.5-1.5-4-1-6-2 2-3 6-3 8a8 8 0 0 0 8 8c4-2 5-9 4-16z" />
              </svg>
              <span
                className="font-semibold text-[#1C1C1A]"
                style={{ fontFamily: serif, fontSize: "1.1rem" }}
              >
                Krislux<span className="text-[#4A6741]">ECO</span>
              </span>
            </div>

            {/* Heading */}
            <div className="relative">
              <OrbitAccent />
              <Eyebrow>Welcome Back</Eyebrow>
              <h2
                className="text-center text-[clamp(1.9rem,4vw,2.5rem)] leading-tight font-light mb-2"
                style={{ fontFamily: serif }}
              >
                <span className="text-[#1C1C1A]">Sign in to </span>
                <span className="italic text-[#4A6741]">continue</span>
              </h2>
            </div>
            <p className="text-center text-[13.5px] text-[#9E9088] mb-9">
              New to KrisluxECO?{" "}
              <Link
                href="/register"
                className="text-[#4A6741] font-medium hover:underline underline-offset-2"
              >
                Create an account
              </Link>
            </p>

            {/* Google Sign-in */}
            <GoogleButton />

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <span className="h-px flex-1 bg-[#E8DDD0]" />
              <span
                className="text-[11px] tracking-[0.2em] uppercase text-[#B7AFA4]"
                style={{ fontFamily: sans }}
              >
                or sign in with email
              </span>
              <span className="h-px flex-1 bg-[#E8DDD0]" />
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <FloatField
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                }
              />

              <PasswordField
                label="Password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              {error ? (
                <div className="rounded-2xl bg-[#FAD4D6] px-4 py-3 text-sm text-[#8B1C1C]">
                  {error}
                </div>
              ) : null}

              {/* Remember me + forgot password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <span className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="flex items-center justify-center w-[18px] h-[18px] rounded-md border-2 border-[#D8CFC2] bg-white peer-checked:bg-[#4A6741] peer-checked:border-[#4A6741] transition-all duration-200">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        className={`transition-opacity duration-150 ${remember ? "opacity-100" : "opacity-0"}`}
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </span>
                  <span
                    className="text-[13px] text-[#6B6560]"
                    style={{ fontFamily: sans }}
                  >
                    Remember me
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-[13px] text-[#4A6741] font-medium hover:underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                className="group relative w-full flex items-center justify-center gap-4 bg-gradient-to-r from-[#1C1C1A] to-[#2A2A28] text-[#E8DDD0] border border-[#333] px-8 py-4 rounded-xl overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(28,28,26,0.15)] mt-8"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10 text-[11px] uppercase tracking-[0.3em] font-medium text-[#E8DDD0]" style={{ fontFamily: sans }}>
                  Sign In
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative z-10 text-[#C8A97A] transform group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
            </form>

            {/* Bottom gold rule, mirrors home section underlines */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <span className="h-px w-8 bg-[#C8A97A]/50" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C8A97A]">
                Handcrafted · Sustainable
              </span>
              <span className="h-px w-8 bg-[#C8A97A]/50" />
            </div>
          </motion.div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────
            RIGHT — Editorial / brand panel
        ───────────────────────────────────────────────────────────────────── */}
        <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#1C1C1A] px-14 py-12 order-1 lg:order-2">
          {/* Background image with overlay, matching hero treatment */}
          <div className="absolute inset-0">
            <motion.div
              initial={{ scale: 1.08, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(/images/loginimg.png)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-[#1C1C1A]/60 to-transparent" />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Ambient floating leaves */}
          <div className="absolute inset-0 z-[1]">
            {leaves.map((l) => (
              <Leaf key={l.id} style={l.style} />
            ))}
          </div>

          {/* Soft glow */}
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 25, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full blur-[140px] opacity-25"
            style={{
              background:
                "radial-gradient(circle, #C8A97A 0%, transparent 70%)",
            }}
          />

          {/* Logo */}
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

          {/* Editorial copy block */}
          <div className="relative z-10 max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FBD84] animate-pulse" />
              Welcome back
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
                Pick up where{" "}
                <span className="italic font-normal text-[#C8A97A]">you</span>
              </span>
              <span className="block font-semibold">left off</span>
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
              Your saved pieces, order history and B2B pricing are right where
              you left them. Sign in to keep exploring sustainable, handcrafted
              living.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <BrandPhilosophy />
            </motion.div>
          </div>

          {/* Bottom trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative z-10 flex items-center gap-6 flex-wrap"
          >
            {["200+ Artisan Partners", "ISO Certified", "Zero Plastic"].map(
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
