"use client";
import Image from "next/image";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

const initialNavLinks = [
  {
    label: "Products",
    href: "/user/products",
    children: [
      {
        label: "All Products",
        href: "/user/products",
        desc: "Browse our full catalog",
      },
    ]
  },
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
  { label: "Sustainability", href: "/user/sustainability" },
  {
    label: "Partners",
    href: "/user/partners",
    children: [
      {
        label: "Partners Overview",
        href: "/user/partners",
        desc: "Learn about our partnerships",
      },
      {
        label: "Share Catalog",
        href: "/share-catalog",
        desc: "Share our product catalog",
      },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Custom Design", href: "/user/custom-design" },
];

const utilityMessages = [
  "Global B2B Wholesale & Hospitality Supply · Custom MOQ Available",
  "Export-Grade Certified · 100% Sustainable Natural Fibers",
  "Direct From Bihar Artisan Cooperatives · Verified ESG Impact",
];

/* Signature mark — using the provided logo image with refined editorial frame. */
function LeafMark() {
  return (
    <div className="relative w-14 h-12 sm:w-16 sm:h-14 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
      <Image
        width={554}
        height={416}
        src="/logotrans.png"
        alt="KrisluxECO Logo"
        className="w-full h-full object-contain"
        priority
      />
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
          className="bg-[#0D140F] border-b border-[#EAE3D6]/10 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="text-[10px] tracking-[0.18em] uppercase text-[#C29B5D] font-mono font-medium"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                {utilityMessages[index]}
              </motion.p>
            </AnimatePresence>
            <button
              onClick={onDismiss}
              aria-label="Dismiss announcement"
              className="absolute right-6 text-[#FAF8F5]/40 hover:text-[#FAF8F5] transition-colors p-1"
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
  const [navLinks, setNavLinks] = useState(initialNavLinks);
  const drawerRef = useRef(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const categories = await res.json();
          setNavLinks((prev) => {
            const newLinks = [...prev];
            const productsLink = newLinks.find((link) => link.label === "Products");
            if (productsLink) {
              productsLink.children = [
                {
                  label: "All Products",
                  href: "/user/products",
                  desc: "Browse our full catalog",
                },
                ...categories.map((category) => ({
                  label: category,
                  href: `/user/products?category=${encodeURIComponent(category)}`,
                  desc: `Browse ${category}`,
                })),
              ];
            }
            return newLinks;
          });
        }
      } catch (err) {
        console.error("Error fetching categories for navbar:", err);
      }
    }
    fetchCategories();
  }, []);

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

  const { cartCount, isLoaded } = useCart();

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
    ["rgba(13,20,15,0.88)", "rgba(13,20,15,0.98)"]
  );
  const navBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(194,155,93,0.18)", "rgba(194,155,93,0.35)"]
  );
  const navShadow = useTransform(
    scrollY,
    [0, 80],
    ["0px 1px 0px rgba(0,0,0,0)", "0px 10px 32px rgba(0,0,0,0.35)"]
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

  // Editorial luxury tones matching the homepage palette
  const textTone = "text-[#FAF8F5]";
  const textToneMuted = "text-[#FAF8F5]/75";
  const logoSub = "text-[#C29B5D]";

  return (
    <>
      <motion.header
        style={{ backgroundColor: navBg, boxShadow: navShadow, borderBottom: "1px solid" }}
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
                  className={`font-bold tracking-normal transition-colors duration-300 ${textTone}`}
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.6rem" }}
                >
                  Krislux<span className="text-[#C29B5D]">ECO</span>
                </span>
                <span
                  className={`text-[8px] tracking-[0.24em] uppercase mt-0.5 transition-colors duration-300 ${logoSub} font-mono`}
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Handcrafted · Sustainable Luxury
                </span>
              </div>
            </Link>

            {/* Desktop Links — refined gold underline indicator */}
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
                      className={`relative inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase outline-none transition-colors duration-300 focus-visible:ring-1 focus-visible:ring-[#C29B5D]/50 rounded-[2px] ${active ? "text-[#C29B5D] font-semibold" : textToneMuted
                        } hover:text-[#C29B5D]`}
                      style={{ fontFamily: "var(--font-montserrat), sans-serif", fontWeight: active ? 600 : 500 }}
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
                          className="mt-[1px] opacity-70 group-hover:opacity-100"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </motion.svg>
                      )}
                      <span
                        className="absolute left-0 -bottom-1 h-[1.5px] bg-[#C29B5D] transition-all duration-300"
                        style={{ width: active ? "100%" : "0%" }}
                      />
                    </Link>

                    {hasChildren && (
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            onMouseEnter={() => openDropdownNow(link.label)}
                            onMouseLeave={() => closeDropdownSoon()}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-80 rounded-[2px] border border-[#C29B5D]/25 bg-[#0D140F]/95 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.5)] p-2 z-50 overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3E634A] via-[#C29B5D] to-[#7FA06B]" />
                            {link.children.map((child, i) => {
                              const childActive = isActive(child.href);
                              return (
                                <motion.div
                                  key={child.label}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.03 + 0.02 }}
                                >
                                  <Link
                                    href={child.href}
                                    onClick={() => setOpenDropdown(null)}
                                    className="group flex items-start gap-3 rounded-[2px] px-3.5 py-2.5 hover:bg-[#16231A] transition-all duration-200 relative overflow-hidden border border-transparent hover:border-[#C29B5D]/20"
                                  >
                                    <span
                                      className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors duration-200 ${childActive ? "bg-[#C29B5D]" : "bg-[#7FA06B]/50 group-hover:bg-[#C29B5D]"
                                        }`}
                                    />
                                    <span className="relative z-10 flex-1">
                                      <span
                                        className={`block text-[11px] tracking-[0.08em] font-semibold transition-colors duration-200 uppercase ${childActive ? "text-[#C29B5D]" : "text-[#FAF8F5] group-hover:text-[#C29B5D]"
                                          }`}
                                        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                      >
                                        {child.label}
                                      </span>
                                      {child.desc && (
                                        <span className="block text-[11px] text-[#FAF8F5]/60 mt-0.5 leading-snug group-hover:text-[#FAF8F5]/85 transition-colors duration-200">
                                          {child.desc}
                                        </span>
                                      )}
                                    </span>
                                  </Link>
                                </motion.div>
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

            {/* CTA + Actions + Mobile Toggle */}
            <div className="flex items-center gap-3.5">
              {/* Profile Avatar (Desktop) */}
              {status === "authenticated" ? (
                <div className="hidden lg:block mr-1">
                  <Link
                    href={session.user.role === "admin" ? "/admin" : "/user/profile"}
                    className="flex items-center gap-2 outline-none focus:ring-1 focus:ring-[#C29B5D]/60 rounded-full cursor-pointer transition-transform hover:scale-105"
                    aria-label="User Profile Dashboard"
                  >
                    {session.user.image ? (
                      <Image width={800} height={800}
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover border border-[#C29B5D]/50 hover:border-[#C29B5D] transition-colors"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#141E17] text-[#C29B5D] flex items-center justify-center text-xs font-bold tracking-wide border border-[#C29B5D]/50 hover:border-[#C29B5D] transition-colors">
                        {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </Link>
                </div>
              ) : status === "unauthenticated" ? (
                <div className="hidden lg:block mr-1">
                  <Link
                    href="/login"
                    className={`relative flex items-center justify-center w-9 h-9 rounded-[2px] transition-all duration-200 ${textTone} hover:text-[#C29B5D] hover:bg-white/5 border border-transparent hover:border-[#C29B5D]/30 outline-none focus-visible:ring-1 focus-visible:ring-[#C29B5D]/50`}
                    aria-label="Sign In"
                  >
                    <User size={18} strokeWidth={1.5} />
                  </Link>
                </div>
              ) : (
                <div className="hidden lg:block w-8 h-8 rounded-full bg-white/10 animate-pulse mr-1" />
              )}

              {/* Saved Products Icon (Desktop) */}
              {status === "authenticated" && (
                <Link
                  href="/user/saved"
                  className={`relative flex items-center justify-center w-9 h-9 rounded-[2px] transition-all duration-200 ${textTone} hover:text-[#C29B5D] hover:bg-white/5 border border-transparent hover:border-[#C29B5D]/30`}
                  aria-label="Saved Products"
                >
                  <Heart size={18} strokeWidth={1.5} />
                </Link>
              )}

              {/* Cart Icon (Desktop) */}
              {isLoaded && (
                <Link
                  href="/user/quote-cart"
                  className={`relative flex items-center justify-center w-9 h-9 rounded-[2px] transition-all duration-200 ${textTone} hover:text-[#C29B5D] hover:bg-white/5 border border-transparent hover:border-[#C29B5D]/30`}
                  aria-label="Quote Cart"
                >
                  <ShoppingCart size={18} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-[#C29B5D] text-[#0D140F] text-[9px] font-bold rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Editorial Luxury CTA Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden lg:block">
                <Link
                  href="/user/bulk-order"
                  className="inline-flex items-center gap-2 bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] text-[11px] font-bold px-4.5 py-2.5 rounded-[2px] tracking-[0.16em] uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(194,155,93,0.25)] hover:shadow-[0_4px_24px_rgba(194,155,93,0.45)]"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Bulk Order
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2 rounded-[2px] outline-none focus-visible:ring-1 focus-visible:ring-[#C29B5D]/60"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-drawer"
              >
                <motion.span
                  className="block w-6 h-0.5 rounded bg-[#FAF8F5] transition-colors duration-300"
                  animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
                  transition={{ duration: 0.25 }}
                />
                <motion.span
                  className="block w-6 h-0.5 rounded bg-[#FAF8F5] transition-colors duration-300"
                  animate={{ opacity: mobileOpen ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="block w-6 h-0.5 rounded bg-[#FAF8F5] transition-colors duration-300"
                  animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
                  transition={{ duration: 0.25 }}
                />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll-progress hairline matching the brand tri-color gradient */}
        <motion.div
          style={{ width: progressWidth }}
          className="h-[1.5px] bg-gradient-to-r from-[#3E634A] via-[#C29B5D] to-[#7FA06B]"
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
              className="fixed inset-0 z-40 bg-[#0D140F]/60 backdrop-blur-sm lg:hidden"
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
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#FAF8F5] border-l border-[#EAE3D6] flex flex-col px-8 pt-8 pb-10 shadow-[-12px_0_48px_rgba(0,0,0,0.25)] lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE3D6]">
                <div className="flex items-center gap-2.5">
                  <LeafMark />
                  <span
                    className="font-bold text-[#0D140F]"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.3rem" }}
                  >
                    Krislux<span className="text-[#C29B5D]">ECO</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 -mr-2 rounded-[2px] text-[#0D140F] outline-none focus-visible:ring-1 focus-visible:ring-[#C29B5D]"
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
                      className="border-b border-[#EAE3D6] last:border-none pb-2.5"
                    >
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() =>
                              setMobileExpanded(isExpanded ? null : link.label)
                            }
                            aria-expanded={isExpanded}
                            className={`w-full flex items-center justify-between text-2xl font-light transition-colors outline-none focus-visible:text-[#C29B5D] ${active ? "text-[#C29B5D] font-medium" : "text-[#0D140F]"
                              }`}
                            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
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
                              className="ml-2 flex-shrink-0 text-[#C29B5D]"
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
                                <div className="flex flex-col gap-2.5 pt-3 pb-1 pl-3 border-l-2 border-[#C29B5D]/30 ml-1 mt-2">
                                  <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`text-xs uppercase tracking-wider font-semibold transition-colors ${isActive(link.href)
                                      ? "text-[#C29B5D]"
                                      : "text-[#0D140F]/70 hover:text-[#C29B5D]"
                                      }`}
                                    style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                  >
                                    {link.label} Overview
                                  </Link>

                                  {link.children.map((child) => {
                                    const childActive = isActive(child.href);
                                    return (
                                      <Link
                                        key={child.label}
                                        href={child.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-start gap-2.5 group py-1"
                                      >
                                        <span
                                          className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors ${childActive ? "bg-[#C29B5D]" : "bg-[#7FA06B]/50 group-hover:bg-[#C29B5D]"
                                            }`}
                                        />
                                        <span>
                                          <span
                                            className={`block text-sm font-medium transition-colors ${childActive ? "text-[#C29B5D]" : "text-[#0D140F] group-hover:text-[#C29B5D]"
                                              }`}
                                            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                                          >
                                            {child.label}
                                          </span>
                                          {child.desc && (
                                            <span className="block text-xs text-[#7A7369] mt-0.5 leading-snug">
                                              {child.desc}
                                            </span>
                                          )}
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
                          className={`block text-2xl font-light transition-colors outline-none focus-visible:text-[#C29B5D] ${active ? "text-[#C29B5D] font-medium" : "text-[#0D140F] hover:text-[#C29B5D]"
                            }`}
                          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              {/* Mobile Drawer Auth Actions */}
              <div className="mt-8 border-t border-[#EAE3D6] pt-6 flex flex-col gap-4 text-left">
                {status === "authenticated" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {session.user.image ? (
                        <Image width={800} height={800}
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-[#C29B5D]/40"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#141E17] text-[#C29B5D] flex items-center justify-center text-base font-semibold tracking-wide border border-[#C29B5D]/40">
                          {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[#0D140F]">{session.user.name}</p>
                        <p className="text-xs text-[#7A7369] truncate max-w-[200px]">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5 pt-2">
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileOpen(false)}
                          className="text-xs uppercase tracking-wider font-bold text-[#C29B5D]"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/user/profile"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-medium text-[#0D140F] hover:text-[#C29B5D]"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/user/saved"
                        onClick={() => setMobileOpen(false)}
                        className="text-sm font-medium text-[#0D140F] hover:text-[#C29B5D]"
                      >
                        Saved Products
                      </Link>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="text-xs uppercase tracking-wider text-red-600 font-semibold text-left cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 w-full py-3 px-4 bg-white border border-[#EAE3D6] rounded-[2px] text-[#0D140F] shadow-sm active:scale-95 transition-all hover:border-[#C29B5D]/50"
                  >
                    <User size={18} className="text-[#C29B5D]" />
                    <span className="text-xs tracking-wider uppercase font-semibold">Sign In / Register</span>
                  </Link>
                )}
              </div>

              {/* Cart Button (Mobile) */}
              <div className="mt-3">
                <Link
                  href="/user/quote-cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between w-full py-3 px-4 bg-white border border-[#EAE3D6] rounded-[2px] text-[#0D140F] shadow-sm active:scale-95 transition-all hover:border-[#C29B5D]/50"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={18} className="text-[#C29B5D]" />
                    <span className="text-xs tracking-wider uppercase font-semibold">Quote Cart</span>
                  </div>
                  {isLoaded && cartCount > 0 && (
                    <span className="bg-[#C29B5D] text-[#0D140F] text-xs font-bold px-2 py-0.5 rounded-full">
                      {cartCount} items
                    </span>
                  )}
                </Link>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="mt-auto pt-6">
                <Link
                  href="/user/bulk-order"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-[#C29B5D] hover:bg-[#D4AD6F] text-[#0D140F] font-bold text-xs py-3.5 rounded-[2px] tracking-[0.18em] uppercase transition-all shadow-md"
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Request B2B Quote
                </Link>
                <div className="flex items-center justify-center gap-3 mt-4 text-[11px] text-[#7A7369]">
                  <a href="mailto:krisluxeco@gmail.com" className="hover:text-[#C29B5D] transition-colors">krisluxeco@gmail.com</a>
                  <span className="text-[#EAE3D6]">|</span>
                  <a href="tel:+919798611931" className="hover:text-[#C29B5D] transition-colors">+91 97986 11931</a>
                </div>
                <p className="text-center text-[9px] text-[#C29B5D] mt-3 tracking-[0.2em] uppercase font-mono">
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