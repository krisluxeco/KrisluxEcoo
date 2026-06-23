"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "About", href: "/user/about" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Distributors", href: "/distributors" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const utilityMessages = [
  "Free shipping on orders over ₹2,000",
  "Handcrafted in India · Shipped worldwide",
  "B2B bulk orders — request a custom quote",
];

/* Signature mark — draws itself in once on mount inside a thin seal ring. */
function LeafMark() {
  return (
    <div className="relative w-9 h-9 flex items-center justify-center">
      <svg width="36" height="36" viewBox="0 0 36 36" className="absolute inset-0" aria-hidden="true">
        <motion.circle
          cx="18"
          cy="18"
          r="16.5"
          fill="none"
          stroke="#C8A97A"
          strokeWidth="1"
          strokeDasharray="2 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.3, ease: "easeInOut", delay: 0.15 }}
        />
      </svg>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <motion.path
          d="M12 2C6.5 2 3 7 3 12c0 4 2.5 7.5 6 9l1-3c-2-1.5-3-4-3-6 0-3 2-6 5-7.5V22h2V4.5C17 6 19 9 19 12c0 2-1 4.5-3 6l1 3c3.5-1.5 6-5 6-9 0-5-3.5-10-9-10z"
          stroke="#4A6741"
          strokeWidth="0.5"
          fill="#4A6741"
          fillOpacity={0.85}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/* Slim rotating utility strip — dismissible, lives above the main nav row. */
function UtilityStrip({ visible, onDismiss }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % utilityMessages.length), 4000);
    return () => clearInterval(t);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1C1C1A] overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="text-[11px] tracking-[0.08em] text-[#C8A97A]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {utilityMessages[index]}
              </motion.p>
            </AnimatePresence>
            <button
              onClick={onDismiss}
              aria-label="Dismiss announcement"
              className="absolute right-6 text-white/40 hover:text-white/80 transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [utilityVisible, setUtilityVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef(null);

  const { scrollY, scrollYProgress } = useScroll();

  // The bar is NEVER transparent. It starts as a deliberate frosted scrim
  // (dark, translucent, legible against any hero image) and only firms up
  // into a solid card as the page scrolls — contrast never dips.
  const navBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(28,28,26,0.38)", "rgba(250,247,242,0.97)"]
  );
  const navBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0.14)", "rgba(28,28,26,0.08)"]
  );
  const navShadow = useTransform(
    scrollY,
    [0, 80],
    ["0px 1px 0px rgba(0,0,0,0)", "0px 1px 32px rgba(28,28,26,0.08)"]
  );
  const navPaddingY = useTransform(scrollY, [0, 80], ["1.25rem", "0.75rem"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    const focusTimer = setTimeout(() => {
      drawerRef.current?.querySelector("a")?.focus();
    }, 250);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
    };
  }, [mobileOpen]);

  const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");

  // Text/icon color flips as one unit with the background — always
  // high-contrast, never the "dark text on transparent" trap.
  const textTone = scrolled ? "text-[#1C1C1A]" : "text-white";
  const textToneMuted = scrolled ? "text-[#1C1C1A]/75" : "text-white/80";
  const logoSub = scrolled ? "text-[#8a6f3f]" : "text-[#E9D9B8]";

  return (
    <>
      <motion.header
        style={{ backgroundColor: navBg, boxShadow: navShadow, borderBottom: "1px solid" }}
        // borderColor can't be animated via style shorthand reliably across browsers,
        // so it's applied via motion below in a wrapping span-free approach:
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      >
        <motion.div style={{ borderColor: navBorder }} className="border-b-0">
          <UtilityStrip visible={utilityVisible} onDismiss={() => setUtilityVisible(false)} />

          <motion.div
            style={{ paddingTop: navPaddingY, paddingBottom: navPaddingY }}
            className="max-w-7xl mx-auto px-6 flex items-center justify-between"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="KrisluxECO home">
              <LeafMark />
              <div className="flex flex-col leading-none">
                <span
                  className={`font-bold tracking-wide transition-colors duration-300 ${textTone}`}
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", letterSpacing: "0.04em" }}
                >
                  Krislux<span className="text-[#7FA06B]">ECO</span>
                </span>
                <span
                  className={`text-[0.58rem] tracking-[0.2em] uppercase mt-0.5 transition-colors duration-300 ${logoSub}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Handcrafted · Sustainable
                </span>
              </div>
            </Link>

            {/* Desktop Links — refined underline indicator, no pill-fill */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.label} className="relative py-2">
                    <Link
                      href={link.href}
                      className={`relative text-sm tracking-wide outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#C8A97A]/50 rounded-sm ${active ? textTone : textToneMuted
                        } hover:${scrolled ? "text-[#1C1C1A]" : "text-white"}`}
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: active ? 600 : 500 }}
                    >
                      {link.label}
                      <span
                        className="absolute left-0 -bottom-1 h-[1.5px] bg-[#C8A97A] transition-all duration-300"
                        style={{ width: active ? "100%" : "0%" }}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="hidden lg:block">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#4A6741] text-white text-sm px-5 py-2.5 rounded-full tracking-wide hover:bg-[#3a5233] transition-colors shadow-[0_4px_20px_rgba(74,103,65,0.15)] hover:shadow-[0_4px_20px_rgba(74,103,65,0.4)]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Get Quote
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#C8A97A]/50"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-drawer"
              >
                <motion.span
                  className={`block w-6 h-0.5 rounded transition-colors duration-300 ${scrolled ? "bg-[#1C1C1A]" : "bg-white"}`}
                  animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
                  transition={{ duration: 0.25 }}
                />
                <motion.span
                  className={`block w-6 h-0.5 rounded transition-colors duration-300 ${scrolled ? "bg-[#1C1C1A]" : "bg-white"}`}
                  animate={{ opacity: mobileOpen ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className={`block w-6 h-0.5 rounded transition-colors duration-300 ${scrolled ? "bg-[#1C1C1A]" : "bg-white"}`}
                  animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
                  transition={{ duration: 0.25 }}
                />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll-progress hairline — the one signature flourish */}
        <motion.div
          style={{ width: progressWidth }}
          className="h-[2px] bg-gradient-to-r from-[#4A6741] to-[#C8A97A]"
        />
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[#1C1C1A]/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              id="mobile-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#FAF7F2] flex flex-col px-8 pt-8 pb-10 shadow-[-8px_0_40px_rgba(0,0,0,0.18)] lg:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2.5">
                  <LeafMark />
                  <span
                    className="font-bold text-[#1C1C1A]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.2rem" }}
                  >
                    Krislux<span className="text-[#4A6741]">ECO</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 -mr-2 rounded-md text-[#1C1C1A] outline-none focus-visible:ring-2 focus-visible:ring-[#4A6741]/40"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <ul className="flex flex-col gap-6">
                {navLinks.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`text-3xl font-light transition-colors outline-none focus-visible:text-[#4A6741] ${active ? "text-[#4A6741]" : "text-[#1C1C1A] hover:text-[#4A6741]"
                          }`}
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="mt-auto">
                <Link
                  href="/products"
                  className="block w-full text-center bg-[#4A6741] text-white text-base py-4 rounded-2xl tracking-wider hover:bg-[#3a5233] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Get a Quote
                </Link>
                <div className="flex items-center justify-center gap-3 mt-5 text-xs text-[#9E9088]">
                  <a href="mailto:hello@krisluxeco.com" className="hover:text-[#4A6741] transition-colors">hello@krisluxeco.com</a>
                  <span className="text-[#E8DDD0]">|</span>
                  <a href="tel:+910000000000" className="hover:text-[#4A6741] transition-colors">+91 00000 00000</a>
                </div>
                <p className="text-center text-xs text-[#C8A97A] mt-4 tracking-widest uppercase">
                  Crafted with purpose · Grown with care
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}