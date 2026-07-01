"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { label: "Products", href: "/user/products" },
  {
    label: "About",
    href: "/user/about",
    children: [
      {
        label: "Brand Story",
        href: "/user/about/brand-story",
        desc: "How KrisluxECO began and where we're headed",
      },
      {
        label: "About Us",
        href: "/user/about",
        desc: "Our team, mission and values",
      },
    ],
  },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Distributors", href: "/distributors" },
  { label: "Blog", href: "/blog" },

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

  // Desktop hover dropdown (e.g. About → Brand Story / About Us).
  // A short close-delay keeps the panel open while the cursor travels
  // from the link down into the menu, so it doesn't flicker shut.
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  const openDropdownNow = (label) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };
  const closeDropdownSoon = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  // Mobile drawer accordion for nav items with sub-links.
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const { data: session, status } = useSession();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setOpenDropdown(null);
    setMobileExpanded(null);
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
                const hasChildren = !!link.children;
                const active =
                  isActive(link.href) ||
                  (hasChildren && link.children.some((c) => isActive(c.href)));
                const isOpen = openDropdown === link.label;
                return (
                  <li
                    key={link.label}
                    className="relative py-2"
                    onMouseEnter={() => hasChildren && openDropdownNow(link.label)}
                    onMouseLeave={() => hasChildren && closeDropdownSoon()}
                  >
                    <Link
                      href={link.href}
                      className={`relative inline-flex items-center gap-1 text-sm tracking-wide outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#C8A97A]/50 rounded-sm ${active ? textTone : textToneMuted
                        } hover:${scrolled ? "text-[#1C1C1A]" : "text-white"}`}
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: active ? 600 : 500 }}
                      aria-haspopup={hasChildren ? "true" : undefined}
                      aria-expanded={hasChildren ? isOpen : undefined}
                    >
                      {link.label}
                      {hasChildren && (
                        <motion.svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-[1px]"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </motion.svg>
                      )}
                      <span
                        className="absolute left-0 -bottom-1 h-[1.5px] bg-[#C8A97A] transition-all duration-300"
                        style={{ width: active ? "100%" : "0%" }}
                      />
                    </Link>

                    {hasChildren && (
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            onMouseEnter={() => openDropdownNow(link.label)}
                            onMouseLeave={() => closeDropdownSoon()}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 rounded-2xl border border-[#E8DDD0] bg-[#FAF7F2] shadow-xl p-2 z-50"
                          >
                            {link.children.map((child) => {
                              const childActive = isActive(child.href);
                              return (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  className="group flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-white transition-colors"
                                >
                                  <span
                                    className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors ${childActive ? "bg-[#4A6741]" : "bg-[#C8A97A] group-hover:bg-[#4A6741]"
                                      }`}
                                  />
                                  <span>
                                    <span
                                      className={`block text-sm font-medium transition-colors ${childActive ? "text-[#4A6741]" : "text-[#1C1C1A] group-hover:text-[#4A6741]"
                                        }`}
                                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    >
                                      {child.label}
                                    </span>
                                    <span className="block text-[11px] text-[#9E9088] mt-0.5 leading-snug">
                                      {child.desc}
                                    </span>
                                  </span>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
              {/* Profile Dropdown (Desktop) */}
              {status === "authenticated" ? (
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 outline-none focus:ring-2 focus:ring-[#C8A97A]/40 rounded-full cursor-pointer"
                    aria-label="User menu"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover border border-[#C8A97A]/30"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-sm font-semibold tracking-wide border border-[#C8A97A]/30">
                        {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2.5 w-56 bg-[#FAF7F2] border border-[#E8DDD0] rounded-2xl shadow-xl py-2 z-50 text-left"
                      >
                        <div className="px-4 py-2 border-b border-[#ECE6DF] mb-1">
                          <p className="text-[10px] text-[#9E9088] font-medium uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-semibold text-[#1C1C1A] truncate">{session.user.name}</p>
                          <p className="text-[11px] text-[#6B6560] truncate">{session.user.email}</p>
                        </div>
                        {session.user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="block px-4 py-2 text-xs font-semibold text-[#4A6741] hover:bg-[#FAF7F2] hover:bg-black/5 transition-colors"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <Link
                          href="/user/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-[#1C1C1A] hover:bg-[#FAF7F2] hover:bg-black/5 transition-colors"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/user/saved"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-[#1C1C1A] hover:bg-[#FAF7F2] hover:bg-black/5 transition-colors"
                        >
                          Saved Products
                        </Link>
                        <hr className="border-[#ECE6DF] my-1" />
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 hover:bg-red-500/10 transition-colors font-medium cursor-pointer"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : status === "unauthenticated" ? (
                <div className="hidden lg:block mr-2">
                  <Link
                    href="/login"
                    className={`text-sm font-semibold tracking-wide outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#C8A97A]/50 rounded-sm ${scrolled ? "text-[#1C1C1A]" : "text-white"
                      } hover:text-[#C8A97A]`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <div className="hidden lg:block w-8 h-8 rounded-full bg-white/10 animate-pulse mr-2" />
              )}

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="hidden lg:block">
                <Link
                  href="/user/bulk-order"
                  className="inline-flex items-center gap-2 bg-[#4A6741] text-white text-sm px-5 py-2.5 rounded-full tracking-wide hover:bg-[#3a5233] transition-colors shadow-[0_4px_20px_rgba(74,103,65,0.15)] hover:shadow-[0_4px_20px_rgba(74,103,65,0.4)]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Bulk Order
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

              <ul className="flex flex-col gap-2">
                {navLinks.map((link, i) => {
                  const hasChildren = !!link.children;
                  const active =
                    isActive(link.href) ||
                    (hasChildren && link.children.some((c) => isActive(c.href)));
                  const isExpanded = mobileExpanded === link.label;

                  return (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                      className="border-b border-[#ECE6DF] last:border-none pb-2"
                    >
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() =>
                              setMobileExpanded(isExpanded ? null : link.label)
                            }
                            aria-expanded={isExpanded}
                            className={`w-full flex items-center justify-between text-3xl font-light transition-colors outline-none focus-visible:text-[#4A6741] ${active ? "text-[#4A6741]" : "text-[#1C1C1A]"
                              }`}
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                          >
                            {link.label}
                            <motion.svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-2 flex-shrink-0"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </motion.svg>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="flex flex-col gap-3 pt-3 pb-1 pl-1">
                                  {/* Optional: still let "About" itself be a direct link */}
                                  <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`text-base font-medium transition-colors ${isActive(link.href)
                                      ? "text-[#4A6741]"
                                      : "text-[#1C1C1A]/70 hover:text-[#4A6741]"
                                      }`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                  >
                                    {link.label} overview
                                  </Link>

                                  {link.children.map((child) => {
                                    const childActive = isActive(child.href);
                                    return (
                                      <Link
                                        key={child.label}
                                        href={child.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-start gap-3"
                                      >
                                        <span
                                          className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${childActive ? "bg-[#4A6741]" : "bg-[#C8A97A]"
                                            }`}
                                        />
                                        <span>
                                          <span
                                            className={`block text-base font-medium ${childActive ? "text-[#4A6741]" : "text-[#1C1C1A]"
                                              }`}
                                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                                          >
                                            {child.label}
                                          </span>
                                          <span className="block text-xs text-[#9E9088] mt-0.5 leading-snug">
                                            {child.desc}
                                          </span>
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block text-3xl font-light transition-colors outline-none focus-visible:text-[#4A6741] ${active ? "text-[#4A6741]" : "text-[#1C1C1A] hover:text-[#4A6741]"
                            }`}
                          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              {/* Mobile Drawer Auth Actions */}
              <div className="mt-8 border-t border-[#E8DDD0] pt-6 flex flex-col gap-4 text-left">
                {status === "authenticated" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-[#C8A97A]/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-base font-semibold tracking-wide border border-[#C8A97A]/30">
                          {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[#1C1C1A]">{session.user.name}</p>
                        <p className="text-xs text-[#6B6560] truncate max-w-[200px]">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileOpen(false)}
                          className="text-sm font-semibold text-[#4A6741]"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/user/profile"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-medium text-[#1C1C1A]"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/user/saved"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-medium text-[#1C1C1A]"
                      >
                        Saved Products
                      </Link>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="text-sm text-red-600 font-semibold text-left cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold text-[#1C1C1A] hover:text-[#4A6741] transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>

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