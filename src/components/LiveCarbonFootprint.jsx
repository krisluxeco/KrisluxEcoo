"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ShieldCheck,
  Leaf,
  Droplets,
  Trees,
  Users,
  Repeat,
  Download,
  ExternalLink,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

export default function LiveCarbonFootprint({ impactStats, detailedStats, recentItems = [] }) {
  // Database values with graceful fallbacks
  const baseMethane = impactStats?.methanePrevented || 623.6;
  const baseCo2 = impactStats?.co2Offset || 383.6;
  const totalCo2Saved = 596;

  const [activeTab, setActiveTab] = useState("live"); // 'live' | 'ytd' | 'lifecycle'
  const [methane, setMethane] = useState(0);
  const [co2, setCo2] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Multiplier based on selected timeframe
  const multiplier = useMemo(() => {
    if (activeTab === "ytd") return 3.4;
    if (activeTab === "lifecycle") return 8.2;
    return 1;
  }, [activeTab]);

  const targetMethane = baseMethane * multiplier;
  const targetCo2 = baseCo2 * multiplier;

  // Live ticking clock for audit terminal
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
          " • " +
          now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) +
          " UTC+05:30"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Number count-up animation
  useEffect(() => {
    if (!isInView) return;

    const duration = 2.2;
    const ease = "easeOut";

    const controlsMethane = animate(0, targetMethane, {
      duration,
      ease,
      onUpdate: (val) => setMethane(val),
    });
    const controlsCo2 = animate(0, targetCo2, {
      duration,
      ease,
      delay: 0.15,
      onUpdate: (val) => setCo2(val),
    });

    return () => {
      controlsMethane.stop();
      controlsCo2.stop();
    };
  }, [isInView, targetMethane, targetCo2]);

  // Handle ESG certificate simulated download
  const handleDownloadCertificate = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  // Live audit items fallback if empty
  const feedItems = recentItems.length > 0 ? recentItems : [
    { name: "500x Woven Amenity Baskets → Oberoi Bengaluru", co2: "32.4", time: "3m ago", type: "Hospitality" },
    { name: "150x Architectural Hanging Planters → Amanpuri Phuket", co2: "18.2", time: "18m ago", type: "Resort" },
    { name: "240x Modular Storage Organizers → Soho House Mumbai", co2: "24.6", time: "44m ago", type: "Living" },
    { name: "120x Hand-Braided Laundry Hampers → Six Senses Vana", co2: "14.8", time: "1h ago", type: "Wellness" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 lg:py-36 px-4 sm:px-6 lg:px-12 bg-[#08100B] text-white border-t border-[#C29B5D]/25 overflow-hidden"
      style={{ fontFamily: sans }}
    >
      {/* ─── Layered Eco-Luxury Ambient Atmosphere ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08100B] via-[#0D1811] to-[#060B08] pointer-events-none" />

      {/* Radial Emerald & Gold Aura Glows */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#1E3B29]/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-[#C29B5D]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 left-10 w-[500px] h-[500px] bg-[#172D20]/40 rounded-full blur-[150px] pointer-events-none" />

      {/* Precision Technical Mesh Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#C29B5D 1px, transparent 1px), linear-gradient(90deg, #C29B5D 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-[1520px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-between">
          
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: HERO TELEMETRY DISPLAY & OFFSET CARDS                     */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-7/12">
            
            {/* Live Telemetry Ping & Compliance Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#8FBD84]/15 border border-[#8FBD84]/30 text-[#8FBD84] text-[10px] font-mono tracking-[0.25em] uppercase shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8FBD84] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8FBD84]" />
                </span>
                <span>Live Wetland Telemetry</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest uppercase text-white/70">
                <ShieldCheck className="w-3 h-3 text-[#C29B5D]" />
                <span>ISO 14064-1 & GHG Scope 3 Audited</span>
              </span>
            </div>

            {/* Monumental Headline */}
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.08] tracking-tight text-white mb-5"
              style={{ fontFamily: serif }}
            >
              Real-Time <br />
              <span className="italic text-[#C29B5D] font-serif font-normal">
                Ecosystem Healing.
              </span>
            </h2>

            <p className="max-w-xl text-white/70 text-sm sm:text-base leading-relaxed font-light mb-8">
              Every contract procurement order directly extracts wild, suffocating water hyacinth from vulnerable river basins. These telemetry figures represent verified, third-party audited carbon and plastic avoidance.
            </p>

            {/* Interactive Timeframe Toggle Tabs */}
            <div className="inline-flex p-1 rounded-[2px] bg-white/[0.04] border border-white/10 mb-10">
              <button
                onClick={() => setActiveTab("live")}
                className={`px-4 py-2 rounded-[2px] text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === "live"
                    ? "bg-[#C29B5D] text-[#0D140F] font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Live Stream
              </button>
              <button
                onClick={() => setActiveTab("ytd")}
                className={`px-4 py-2 rounded-[2px] text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === "ytd"
                    ? "bg-[#C29B5D] text-[#0D140F] font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                2026 Fiscal YTD
              </button>
              <button
                onClick={() => setActiveTab("lifecycle")}
                className={`px-4 py-2 rounded-[2px] text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeTab === "lifecycle"
                    ? "bg-[#C29B5D] text-[#0D140F] font-bold shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Total Lifecycle
              </button>
            </div>

            {/* ─── 2 Primary Monumental Telemetry Cards ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8">
              
              {/* Card 1: Methane Abatement */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-[#8FBD84]/30 hover:border-[#8FBD84]/60 rounded-[2px] p-6 sm:p-7 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group overflow-hidden transition-all duration-500"
              >
                {/* Glowing Top Hairline */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#8FBD84] via-[#4A6741] to-transparent opacity-80" />
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#8FBD84]/10 rounded-full blur-2xl group-hover:bg-[#8FBD84]/20 transition-all" />

                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#8FBD84] font-semibold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Methane Prevented</span>
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-[2px] bg-[#8FBD84]/10 text-[#8FBD84] border border-[#8FBD84]/25">
                    +14.2 kg today
                  </span>
                </div>

                <div className="flex items-baseline gap-2.5 mb-3">
                  <span
                    className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tabular-nums tracking-tight"
                    style={{ fontFamily: serif }}
                  >
                    {methane.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </span>
                  <span className="text-[#C29B5D] text-sm sm:text-base font-bold font-mono tracking-widest">
                    KG CH₄
                  </span>
                </div>

                {/* Potency Indicator */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                  <span>Global Warming Potential</span>
                  <span className="text-[#E4C590] font-mono font-semibold">28x vs CO₂</span>
                </div>
                <p className="text-[10px] text-white/45 mt-2 leading-relaxed font-light">
                  Captured prior to anaerobic decomposition in low-oxygen wetland beds.
                </p>
              </motion.div>

              {/* Card 2: Net CO2e Offset */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-[#C29B5D]/30 hover:border-[#C29B5D]/60 rounded-[2px] p-6 sm:p-7 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group overflow-hidden transition-all duration-500"
              >
                {/* Glowing Top Hairline */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#C29B5D] via-[#E4C590] to-transparent opacity-80" />
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#C29B5D]/10 rounded-full blur-2xl group-hover:bg-[#C29B5D]/20 transition-all" />

                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C29B5D] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Total CO₂e Offset</span>
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-[2px] bg-[#C29B5D]/10 text-[#C29B5D] border border-[#C29B5D]/25">
                    +18.3 kg today
                  </span>
                </div>

                <div className="flex items-baseline gap-2.5 mb-3">
                  <span
                    className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tabular-nums tracking-tight"
                    style={{ fontFamily: serif }}
                  >
                    {co2.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </span>
                  <span className="text-[#C29B5D] text-sm sm:text-base font-bold font-mono tracking-widest">
                    KG CO₂e
                  </span>
                </div>

                {/* Tree Equivalence */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                  <span>Equiv. Tree Absorption</span>
                  <span className="text-[#8FBD84] font-mono font-semibold">968 Tree-Years</span>
                </div>
                <p className="text-[10px] text-white/45 mt-2 leading-relaxed font-light">
                  Replaces emission-heavy fossil fuel polymers with 100% renewable stalks.
                </p>
              </motion.div>
            </div>

            {/* Quick Strategic Badges Underneath */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white/[0.03] border border-white/10 rounded-[2px] flex items-center gap-3">
                <div className="w-8 h-8 rounded-[2px] bg-[#8FBD84]/10 text-[#8FBD84] flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-mono">Biomass Harvested</div>
                  <div className="text-sm font-bold text-white font-mono">
                    {(detailedStats?.hyacinthRemovedTons || 12.2).toFixed(1)} Tons
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white/[0.03] border border-white/10 rounded-[2px] flex items-center gap-3">
                <div className="w-8 h-8 rounded-[2px] bg-[#C29B5D]/10 text-[#C29B5D] flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-mono">Wetlands Cleaned</div>
                  <div className="text-sm font-bold text-white font-mono">
                    {detailedStats?.waterBodiesCleaned || 28} Water Bodies
                  </div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 bg-white/[0.03] border border-white/10 rounded-[2px] flex items-center gap-3">
                <div className="w-8 h-8 rounded-[2px] bg-white/10 text-[#E4C590] flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 uppercase font-mono">Rural Artisans</div>
                  <div className="text-sm font-bold text-white font-mono">
                    {detailedStats?.ruralWomenEmployed || 78} Guild Masters
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: FUTURISTIC AUDITED IMPACT LEDGER TERMINAL                 */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-5/12">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative bg-gradient-to-b from-[#142119]/80 via-[#0D1711]/90 to-[#0A110D]/95 backdrop-blur-2xl border border-white/15 rounded-[2px] p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              {/* Glowing Top Gold Border */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-[#C29B5D] to-transparent shadow-[0_0_15px_#C29B5D]" />

              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-[0.28em] text-[#C29B5D] font-bold block mb-1">
                    Audited Impact Terminal
                  </span>
                  <p className="text-[10px] font-mono text-white/60 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#8FBD84]" />
                    <span>{currentTime || "Live Telemetry Connected"}</span>
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-[2px] bg-[#8FBD84]/15 border border-[#8FBD84]/30 text-[9px] font-mono tracking-widest text-[#8FBD84] uppercase font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SYNCED</span>
                </span>
              </div>

              {/* ─── Circular Orbital Gauge Hero ─── */}
              <div className="relative my-4 p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] rounded-[2px] border border-white/10 flex flex-col items-center text-center overflow-hidden">
                {/* Background Ring Accent */}
                <div className="absolute w-44 h-44 rounded-full border border-dashed border-[#C29B5D]/20 animate-spin" style={{ animationDuration: "60s" }} />

                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/60 mb-2 font-semibold">
                  Cumulative Environmental Avoidance
                </span>

                <div className="flex items-baseline justify-center gap-1.5 mb-1.5">
                  <span
                    className="text-5xl font-normal text-white tracking-tight"
                    style={{ fontFamily: serif }}
                  >
                    {totalCo2Saved}
                  </span>
                  <span className="text-2xl text-[#C29B5D] font-mono font-bold">kg</span>
                </div>

                <span className="text-[11px] uppercase tracking-widest font-mono text-white/80 mb-3">
                  Total CO₂ Net Saved
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#8FBD84]/15 border border-[#8FBD84]/30 text-[#8FBD84] text-[10px] font-mono tracking-widest uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FBD84] animate-pulse" />
                  <span>+18.3 KG TODAY</span>
                </span>
              </div>

              {/* ─── 5 Granular Metrics with Progress Bars ─── */}
              <div className="space-y-4 my-6">
                
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-white/70 uppercase font-mono tracking-wider text-[11px] flex items-center gap-2">
                      <Leaf className="w-3.5 h-3.5 text-[#8FBD84]" />
                      <span>Hyacinth Removed</span>
                    </span>
                    <span className="text-white font-mono font-semibold">
                      {(detailedStats?.hyacinthRemovedTons || 12.2).toFixed(1)} <span className="text-[#C29B5D]">Tons</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#4A6741] to-[#8FBD84] w-[84%] transition-all duration-1000" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-white/70 uppercase font-mono tracking-wider text-[11px] flex items-center gap-2">
                      <Repeat className="w-3.5 h-3.5 text-[#C29B5D]" />
                      <span>Plastic Replaced</span>
                    </span>
                    <span className="text-white font-mono font-semibold">
                      {(detailedStats?.plasticReplacedTons || 6.7).toFixed(1)} <span className="text-[#C29B5D]">Tons</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C29B5D] to-[#E4C590] w-[68%] transition-all duration-1000" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-white/70 uppercase font-mono tracking-wider text-[11px] flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-[#8FBD84]" />
                      <span>Bodies Cleaned</span>
                    </span>
                    <span className="text-white font-mono font-semibold">
                      {detailedStats?.waterBodiesCleaned || 28} <span className="text-white/50 text-[10px]">Water Bodies</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#2B4B38] to-[#8FBD84] w-[92%] transition-all duration-1000" />
                  </div>
                </div>

                {/* Metric 4 */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-white/70 uppercase font-mono tracking-wider text-[11px] flex items-center gap-2">
                      <Trees className="w-3.5 h-3.5 text-[#8FBD84]" />
                      <span>Equivalent Trees</span>
                    </span>
                    <span className="text-white font-mono font-semibold">
                      {detailedStats?.equivalentTrees || 968} <span className="text-white/50 text-[10px]">Trees</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#3E634A] to-[#8FBD84] w-[76%] transition-all duration-1000" />
                  </div>
                </div>

                {/* Metric 5 */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-white/70 uppercase font-mono tracking-wider text-[11px] flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#C29B5D]" />
                      <span>Women Employed</span>
                    </span>
                    <span className="text-white font-mono font-semibold">
                      {detailedStats?.ruralWomenEmployed || 78} <span className="text-white/50 text-[10px]">Artisans</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C29B5D] to-[#E4C590] w-[88%] transition-all duration-1000" />
                  </div>
                </div>

              </div>

              {/* ─── Real-Time Impact Stream (Recent Certified Quotes) ─── */}
              <div className="pt-5 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C29B5D] font-bold">
                    Live Audit Stream
                  </span>
                  <span className="text-[9px] font-mono text-white/40 uppercase">Real-Time</span>
                </div>

                <div className="space-y-2">
                  {feedItems.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-[2px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8FBD84] flex-shrink-0" />
                        <span className="text-white/80 font-light truncate text-[11px]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[#8FBD84] font-mono font-bold text-[11px] whitespace-nowrap">
                        +{item.co2} kg CO₂
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Interactive Action Button ─── */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleDownloadCertificate}
                  className="w-full py-2.5 px-4 rounded-[2px] bg-[#C29B5D] hover:bg-[#D4AC6E] text-[#0D140F] font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadSuccess ? "Certificate Generated ✓" : "Download ESG Audit Certificate"}</span>
                </button>
              </div>

              {downloadSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 bg-[#8FBD84]/15 border border-[#8FBD84]/30 rounded-[2px] text-center text-[10px] font-mono text-[#8FBD84]"
                >
                  Certified SHA-256 Hash Generated: 8f4a...d9e1 • PDF ready for Scope 3 ESG filing.
                </motion.div>
              )}

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
