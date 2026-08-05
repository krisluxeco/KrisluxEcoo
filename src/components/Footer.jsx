"use client";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/user/products" },
      { label: "Bulk Order", href: "/user/bulk-order" },
     
      { label: "Saved Products", href: "/user/saved" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/user/about/brand-story" },
      { label: "About Us", href: "/user/about" },
      { label: "Sustainability", href: "/user/sustainability" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/user/bulk-order" },
      { label: "Track Order", href: "user/profile" },
     
      { label: "FAQs", href: "/user/bulk-order" },
    ],
  },
  // {
  //   title: "Legal",
  //   links: [
  //     { label: "Privacy Policy", href: "/privacy-policy" },
  //     { label: "Terms of Service", href: "/terms" },
  //     { label: "Refund Policy", href: "/refund-policy" },
  //   ],
  // },
];

const socialLinks = [
  {
    label: "WhatsApp",
    href: "https://wa.me/9798611931",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.9 9.9 0 0 0 4.77 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.07h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.53 3.69-8.22 8.24-8.22a8.18 8.18 0 0 1 5.82 2.42 8.16 8.16 0 0 1 2.41 5.81c0 4.53-3.69 8.22-8.23 8.22zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.17-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01a.93.93 0 0 0-.67.31c-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.03 2.59.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/krisluxeco",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/krisluxeco",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 21v-7.7h2.6l.4-3h-3v-1.9c0-.87.24-1.46 1.5-1.46h1.6V4.3c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.42-3.9 4.02v2.1H7.7v3h2.7V21h3.1z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/krisluxeco-official/posts/?feedView=all",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.94 8.5H3.56V20.4h3.38V8.5zM5.25 3.6a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM20.45 20.4h-3.37v-6.24c0-1.49-.03-3.4-2.07-3.4-2.08 0-2.4 1.62-2.4 3.3v6.34H9.25V8.5h3.23v1.63h.05c.45-.85 1.56-1.75 3.21-1.75 3.43 0 4.06 2.26 4.06 5.2v6.82z" />
      </svg>
    ),
  },
];

/* Signature mark — using the provided logo image. */
function LeafMark() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 bg-white rounded-full overflow-hidden shadow-sm">
      <Image width={800} height={800} src="/logos.jpg" alt="KrisluxECO Logo" className="w-full h-full object-contain scale-[0.85]" />
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Wire this up to your actual newsletter endpoint.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative bg-[#1C1C1A] text-[#F0EBE3]" style={{ fontFamily: sans }}>
      {/* Top accent line, matches navbar's progress hairline gradient */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#4A6741] to-[#C8A97A]" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-4 w-fit">
              <LeafMark />
              <div className="flex flex-col leading-none">
                <span
                  className="font-bold tracking-wide text-white"
                  style={{ fontFamily: serif, fontSize: "1.4rem", letterSpacing: "0.04em" }}
                >
                  Krislux<span className="text-[#7FA06B]">ECO</span>
                </span>
                <span
                  className="text-[0.58rem] tracking-[0.2em] uppercase mt-0.5 text-[#E9D9B8]"
                >
                  Handcrafted · Sustainable
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-white/55 max-w-xs mb-6">
              Water-hyacinth craft, woven by rural artisans in Bihar — restoring rivers and
              building livelihoods, one product at a time.
            </p>



            {/* Socials */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-[#1C1C1A] hover:bg-[#C8A97A] hover:border-[#C8A97A] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[11px] tracking-[0.18em] uppercase text-[#C8A97A] mb-4">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact / WhatsApp CTA */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] tracking-[0.18em] uppercase text-[#C8A97A] mb-4">
              Talk to us
            </h3>
            <a
              href="https://wa.me/9798611931"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm px-4 py-2.5 rounded-full w-fit mb-4 hover:bg-[#25D366]/20 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.9 9.9 0 0 0 4.77 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
              </svg>
              WhatsApp
            </a>
            <ul className="flex flex-col gap-3 text-sm text-white/65">
              <li>
                <a href="mailto:krisluxeco@gmail.com" className="hover:text-white transition-colors">
                  krisluxeco@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919798611931" className="hover:text-white transition-colors">
                  +91 97986 11931
                </a>
              </li>
              <li className="text-white/45 leading-relaxed">
                Teghra, Begusarai,<br />Bihar, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center sm:text-left">
            © {new Date().getFullYear()} KrisluxECO · Gramin Hyacinth Craft. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/40">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Terms
            </Link>
            <Link href="/sustainability" className="hover:text-white/70 transition-colors">
              Sustainability
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}