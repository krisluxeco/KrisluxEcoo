"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Database,
  CheckCircle2,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  FileCheck
} from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

function Eyebrow({ children, dark = true }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <span className={`h-px w-8 ${dark ? "bg-[#C8A97A]" : "bg-[#C8A97A]/60"}`} />
      <p
        className="text-xs tracking-[0.25em] uppercase text-[#C8A97A] font-semibold"
        style={{ fontFamily: sans }}
      >
        {children}
      </p>
      <span className={`h-px w-8 ${dark ? "bg-[#C8A97A]" : "bg-[#C8A97A]/60"}`} />
    </div>
  );
}

const policyCategories = [
  { id: "all", label: "Complete Charter" },
  { id: "collection", label: "I. Data Collection" },
  { id: "usage", label: "II. Purpose & Usage" },
  { id: "analytics", label: "III. Web Analytics" },
  { id: "security", label: "IV. Security Architecture" },
  { id: "rights", label: "V. Your Rights" },
  { id: "concierge", label: "VI. Privacy Concierge" },
];

const faqs = [
  {
    q: "Do you monetize or trade our corporate gifting or catalog inquiry data?",
    a: "Never. KrisluxECO strictly adheres to zero data commercialization. We do not sell, rent, or lease any client telemetry, company purchase profiles, or contact registers to third-party marketing networks."
  },
  {
    q: "How are custom B2B catalog configurations and MOQs safeguarded?",
    a: "All proprietary business information—including custom branding files, target budgets, and wholesale specifications—is stored inside encrypted database environments with restricted, multi-tier staff access."
  },
  {
    q: "Can our organization request permanent erasure of our historical data?",
    a: "Yes. In accordance with global privacy governance standards, you may contact our Privacy Concierge at any time to request complete, verified purging of all non-statutory records within 14 business days."
  },
  {
    q: "Do you use invasive third-party tracking or advertising cookies?",
    a: "No. Our digital footprint is powered strictly by privacy-conscious, first-party telemetry. We do not deploy cross-site tracking pixels or invasive behavioral profiling tools."
  }
];

export default function PrivacyPolicyPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  const filterSection = (id) => activeTab === "all" || activeTab === id;

  return (
    <main className="bg-[#1C1C1A] text-white min-h-screen selection:bg-[#C8A97A] selection:text-[#1C1C1A]" style={{ fontFamily: sans }}>
      {/* ─── 1. Cinematic Hero Section ───────────────────────────── */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6 md:px-16 overflow-hidden text-center border-b border-white/10">
        {/* Subtle Luxury Ambient Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[500px] bg-gradient-to-b from-[#C8A97A]/15 via-[#4A6741]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Eyebrow>Legal & Data Governance</Eyebrow>

            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.05] text-white mb-6"
              style={{ fontFamily: serif }}
            >
              Privacy <span className="italic text-[#C8A97A]">Policy.</span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10" style={{ fontFamily: serif }}>
              "True sustainable luxury is rooted in transparency, artisanal dignity, and unwavering client confidentiality."
            </p>

            {/* Luxury Metadata Bar */}
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-light text-white/70">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97A]" />
                Effective: August 2026
              </span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7FA06B]" />
                Zero Data Commercialization
              </span>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#C8A97A]" />
                256-Bit TLS Encrypted
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. Pillars of Data Ethics (3 Premium Glass Cards) ─────── */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "Zero Data Selling",
              desc: "We never sell, trade, or commercialize your personal inquiries, corporate orders, or company contact registers.",
              icon: Shield
            },
            {
              num: "02",
              title: "Enterprise Encryption",
              desc: "All custom wholesale catalog requests, payments, and client communications operate over encrypted channels.",
              icon: Lock
            },
            {
              num: "03",
              title: "Full Client Sovereignty",
              desc: "You retain total authority to inspect, export, or permanently erase your recorded information on demand.",
              icon: Eye
            }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group relative bg-white/5 border border-white/10 hover:border-[#C8A97A]/40 backdrop-blur-md rounded-3xl p-8 md:p-10 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-3xl font-light text-white/10 group-hover:text-[#C8A97A]/20 transition-colors" style={{ fontFamily: serif }}>
                  {card.num}
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#C8A97A] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#C8A97A] group-hover:text-[#1C1C1A] transition-all duration-500">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-xl md:text-2xl font-light text-white mb-3" style={{ fontFamily: serif }}>
                  {card.title}
                </h3>
                <p className="text-white/60 text-sm font-light leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── 3. Navigation Filter Bar ──────────────────────────────── */}
      <section className="sticky top-20 z-30 px-6 py-4 bg-[#1C1C1A]/90 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {policyCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2 rounded-full text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-300 font-medium ${
                activeTab === cat.id
                  ? "bg-[#C8A97A] text-[#1C1C1A] shadow-[0_0_20px_rgba(200,169,122,0.3)] font-semibold"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ─── 4. Detailed Policy Articles (Editorial Layout) ────────── */}
      <section className="py-24 px-6 md:px-16 max-w-5xl mx-auto space-y-16">
        {/* Article I */}
        {filterSection("collection") && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#C8A97A] font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C8A97A]" />
              Article I
            </div>

            <h2 className="text-3xl md:text-4xl font-light text-white mb-8" style={{ fontFamily: serif }}>
              Information Collection & Categorization
            </h2>

            <div className="space-y-6 text-white/70 text-base md:text-lg font-light leading-relaxed">
              <p>
                At KrisluxECO, data collection is guided by the philosophy of <em>data minimalism</em>. We never indiscriminately harvest personal information. Every record collected serves an explicit operational purpose required to craft, coordinate, or dispatch authentic sustainable products.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-[#C8A97A]" />
                    <h4 className="text-sm uppercase tracking-wider text-white font-medium">1. Active Client Inputs</h4>
                  </div>
                  <ul className="text-sm space-y-2 text-white/60 list-disc list-inside">
                    <li>Representative & Organization Name</li>
                    <li>Verified Business Email & Contact Number</li>
                    <li>Shipping Destinations & GST / Tax IDs</li>
                    <li>Bespoke Product Requests & Volume MOQs</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-[#7FA06B]" />
                    <h4 className="text-sm uppercase tracking-wider text-white font-medium">2. System Telemetry</h4>
                  </div>
                  <ul className="text-sm space-y-2 text-white/60 list-disc list-inside">
                    <li>Anonymized IP Address (Unique Traffic Counters)</li>
                    <li>Traffic Source Referrals (LinkedIn, Instagram)</li>
                    <li>Browser & Device Architecture</li>
                    <li>Catalog Interaction & Session Analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* Article II */}
        {filterSection("usage") && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#C8A97A] font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C8A97A]" />
              Article II
            </div>

            <h2 className="text-3xl md:text-4xl font-light text-white mb-8" style={{ fontFamily: serif }}>
              Purpose of Processing & Operational Use
            </h2>

            <div className="space-y-6 text-white/70 text-base md:text-lg font-light leading-relaxed">
              <p>
                We strictly process collected information under clear contractual, legal, and operational grounds:
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Bespoke Quotations & Catalog Dispatch",
                    desc: "Calculating customized volume pricing, minimum order quantities (MOQ), and artisan production lead-times for corporate and hospitality clients."
                  },
                  {
                    title: "Sustainable Logistics Execution",
                    desc: "Coordinating domestic and international dispatch via certified low-emission freight partners with direct tracking notifications."
                  },
                  {
                    title: "Environmental Impact Reporting",
                    desc: "Issuing authenticated impact certificates quantifying the square meters of water hyacinth cleared from Bihar's wetlands for your specific purchase."
                  },
                  {
                    title: "Statutory Tax & Regulatory Compliance",
                    desc: "Maintaining mandatory records for GST invoicing, e-way bill generation, and export customs declarations under Indian commercial law."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
                    <h3 className="text-white text-lg font-normal mb-1.5" style={{ fontFamily: serif }}>
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        )}

        {/* Article III */}
        {filterSection("analytics") && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#C8A97A] font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C8A97A]" />
              Article III
            </div>

            <h2 className="text-3xl md:text-4xl font-light text-white mb-8" style={{ fontFamily: serif }}>
              Web Analytics & First-Party Metrics
            </h2>

            <div className="space-y-6 text-white/70 text-base md:text-lg font-light leading-relaxed">
              <p>
                Our digital platform uses clean, first-party analytics engineered strictly to understand traffic growth and improve interface performance.
              </p>
              
              <div className="p-8 rounded-2xl bg-gradient-to-br from-[#4A6741]/10 to-transparent border border-[#4A6741]/30">
                <h4 className="text-white text-lg font-medium mb-2" style={{ fontFamily: serif }}>
                  No Invasive Cross-Site Ad Tracking
                </h4>
                <p className="text-white/70 text-sm font-light leading-relaxed">
                  We do not embed third-party surveillance scripts or behavioral ad trackers. When you visit KrisluxECO, your browsing journey remains entirely private to our domain.
                </p>
              </div>
            </div>
          </motion.article>
        )}

        {/* Article IV */}
        {filterSection("security") && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#C8A97A] font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C8A97A]" />
              Article IV
            </div>

            <h2 className="text-3xl md:text-4xl font-light text-white mb-8" style={{ fontFamily: serif }}>
              Security Architecture & Data Retention
            </h2>

            <div className="space-y-6 text-white/70 text-base md:text-lg font-light leading-relaxed">
              <p>
                We deploy robust technological and organizational security measures to protect your digital assets:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="text-white text-base font-medium mb-1">Encrypted In Transit & At Rest</h4>
                  <p className="text-white/60 text-xs leading-relaxed">256-bit TLS/SSL encryption across all server endpoints and automated encrypted backups.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="text-white text-base font-medium mb-1">Strict Access Control</h4>
                  <p className="text-white/60 text-xs leading-relaxed">Role-based administrative credentials ensuring only verified fulfillment staff can view orders.</p>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* Article V */}
        {filterSection("rights") && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#C8A97A] font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#C8A97A]" />
              Article V
            </div>

            <h2 className="text-3xl md:text-4xl font-light text-white mb-8" style={{ fontFamily: serif }}>
              Your Statutory Sovereignty & Rights
            </h2>

            <div className="space-y-6 text-white/70 text-base md:text-lg font-light leading-relaxed">
              <p>
                You retain comprehensive control over your personal and organizational records:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { title: "Right to Inspect", desc: "Obtain a complete report of all historical orders and contact logs." },
                  { title: "Right to Rectify", desc: "Correct outdated corporate addresses, tax information, or phone numbers." },
                  { title: "Right to Permanent Erasure", desc: "Request full purging of non-mandatory telemetry and contact accounts." },
                  { title: "Right to Restrict", desc: "Opt out of seasonal artisan collection bulletins at any point." }
                ].map((right, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C8A97A] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">{right.title}</h4>
                      <p className="text-white/60 text-xs leading-relaxed">{right.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        )}

        {/* Article VI: Concierge */}
        {filterSection("concierge") && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-[#1C1C1A] via-white/5 to-[#1C1C1A] border border-[#C8A97A]/40 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-md overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A97A]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#C8A97A] font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-[#C8A97A]" />
                Article VI
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: serif }}>
                Dedicated Privacy Concierge
              </h2>

              <p className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-10 max-w-2xl">
                For corporate Data Protection Addendums (DPA), statutory inquiries, or verified data deletion requests, contact our dedicated governance team:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <a
                  href="mailto:krisluxeco@gmail.com"
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C8A97A] hover:bg-white/10 transition-all duration-300 group"
                >
                  <Mail className="w-6 h-6 text-[#C8A97A] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Direct Inquiries</span>
                  <strong className="text-sm text-white font-medium break-all">krisluxeco@gmail.com</strong>
                </a>

                <a
                  href="https://wa.me/9798611931"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#25D366] hover:bg-white/10 transition-all duration-300 group"
                >
                  <Phone className="w-6 h-6 text-[#25D366] mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Hotline & WhatsApp</span>
                  <strong className="text-sm text-white font-medium">+91 97986 11931</strong>
                </a>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <MapPin className="w-6 h-6 text-[#C8A97A] mb-3" />
                  <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">Registered Entity</span>
                  <strong className="text-sm text-white font-medium block leading-tight">Teghra, Begusarai, Bihar, India</strong>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* ─── 5. Frequently Asked Inquiries ───────────────────────── */}
        <div className="pt-10 border-t border-white/10">
          <div className="text-center mb-12">
            <Eyebrow>Client Inquiries</Eyebrow>
            <h3 className="text-3xl md:text-5xl font-light text-white mb-4" style={{ fontFamily: serif }}>
              Frequently Clarified Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="text-base md:text-lg font-light text-white group-hover:text-[#C8A97A] transition-colors" style={{ fontFamily: serif }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C8A97A] transition-transform duration-300 flex-shrink-0 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 text-sm text-white/60 leading-relaxed font-light pt-3 border-t border-white/5"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
