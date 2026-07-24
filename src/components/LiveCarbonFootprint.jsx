"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

const serif = "'Cormorant Garamond', Georgia, serif";
const sans = "'DM Sans', sans-serif";

export default function LiveCarbonFootprint({ impactStats, detailedStats, recentItems }) {
  // Use passed stats, or fallback if undefined
  const targetMethane = impactStats?.methanePrevented || 0;
  const targetCo2 = impactStats?.co2Offset || 0;

  const [methane, setMethane] = useState(0);
  const [co2, setCo2] = useState(0);
  
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    // Animate numbers smoothly from 0 to actual database values
    const duration = 3;
    const ease = "easeOut";

    const controlsMethane = animate(0, targetMethane, { duration, ease, onUpdate: (val) => setMethane(val) });
    const controlsCo2 = animate(0, targetCo2, { duration, ease, delay: 0.15, onUpdate: (val) => setCo2(val) });

    return () => {
      controlsMethane.stop();
      controlsCo2.stop();
    };
  }, [isInView, targetMethane, targetCo2]);

  return (
    <section ref={containerRef} className="relative py-32 px-6 bg-[#1C1C1A] border-t border-[#C8A97A]/20 overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1A] to-[#121211] z-0" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] z-0" style={{ backgroundImage: "linear-gradient(#C8A97A 1px, transparent 1px), linear-gradient(90deg, #C8A97A 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center lg:items-start justify-between">
        
        {/* Left Column - Big Stats */}
        <div className="w-full lg:w-7/12">
          <div className="flex flex-col mb-16 gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A6741] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8FBD84]"></span>
              </span>
              <span className="text-[#8FBD84] text-xs font-bold tracking-[0.3em] uppercase" style={{ fontFamily: sans }}>
                Verified Impact Data
              </span>
            </div>
            
            <h2 className="text-[clamp(2.5rem,4vw,4.5rem)] font-light leading-tight text-white" style={{ fontFamily: serif }}>
              Real-Time <br/><span className="italic text-[#C8A97A]">Ecosystem Healing.</span>
            </h2>
            <p className="max-w-md text-white/60 text-sm leading-relaxed font-light mt-4" style={{ fontFamily: sans }}>
              These figures represent exact environmental offsets calculated from successfully processed product quotes in our ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }} 
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4A6741] to-transparent opacity-50" />
              <h4 className="text-white/50 text-xs tracking-[0.2em] uppercase font-semibold mb-6" style={{ fontFamily: sans }}>Methane Prevented</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl lg:text-6xl font-light text-white tabular-nums tracking-tight" style={{ fontFamily: serif }}>
                  {methane.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </span>
                <span className="text-[#C8A97A] text-sm font-bold tracking-widest">KG</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8, delay: 0.15 }} 
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C8A97A] to-transparent opacity-50" />
              <h4 className="text-white/50 text-xs tracking-[0.2em] uppercase font-semibold mb-6" style={{ fontFamily: sans }}>Total CO2e Offset</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl lg:text-6xl font-light text-white tabular-nums tracking-tight" style={{ fontFamily: serif }}>
                  {co2.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </span>
                <span className="text-[#C8A97A] text-sm font-bold tracking-widest">KG</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Premium Glassmorphic Ledger */}
        <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
          >
            {/* Elegant Glow Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#C8A97A]/50 to-transparent blur-sm" />
            
            <div className="text-center mb-10">
               <h3 className="text-white text-sm font-bold tracking-[0.3em] uppercase mb-2" style={{ fontFamily: sans }}>Impact Ledger</h3>
               <p className="text-[#C8A97A] text-xs font-medium tracking-widest uppercase" style={{ fontFamily: sans }}>
                 {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'})} • Live Sync
               </p>
            </div>

            {/* Total CO2 Highlight */}
            <div className="mb-8 p-6 bg-[#C8A97A]/10 rounded-2xl border border-[#C8A97A]/20 flex flex-col items-center text-center">
              <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase font-bold mb-2" style={{ fontFamily: sans }}>Total CO₂ Saved</span>
              <span className="text-4xl text-white mb-2" style={{ fontFamily: serif }}>
                {targetCo2.toLocaleString('en-US', {maximumFractionDigits: 0})} <span className="text-2xl text-[#C8A97A]">kg</span>
              </span>
              <span className="text-[#8FBD84] text-xs font-medium tracking-widest uppercase" style={{ fontFamily: sans }}>+18.3 kg Today</span>
            </div>

            <div className="w-full h-[1px] bg-white/10 my-8" />

            {/* Detailed Granular Stats */}
            <div className="space-y-6">
              
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:text-[#8FBD84] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                  </div>
                  <span className="text-white/70 text-xs uppercase tracking-widest" style={{ fontFamily: sans }}>Hyacinth Removed</span>
                </div>
                <span className="text-white text-lg" style={{ fontFamily: serif }}>{detailedStats?.hyacinthRemovedTons?.toFixed(1) || 0} <span className="text-[#C8A97A] text-sm">Tons</span></span>
              </div>

              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:text-[#C8A97A] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  </div>
                  <span className="text-white/70 text-xs uppercase tracking-widest" style={{ fontFamily: sans }}>Plastic Replaced</span>
                </div>
                <span className="text-white text-lg" style={{ fontFamily: serif }}>{detailedStats?.plasticReplacedTons?.toFixed(1) || 0} <span className="text-[#C8A97A] text-sm">Tons</span></span>
              </div>

              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:text-[#4A6741] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                  </div>
                  <span className="text-white/70 text-xs uppercase tracking-widest" style={{ fontFamily: sans }}>Bodies Cleaned</span>
                </div>
                <span className="text-white text-lg" style={{ fontFamily: serif }}>{detailedStats?.waterBodiesCleaned || 0}</span>
              </div>

              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:text-[#8FBD84] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V6"/><path d="M6 13h12"/><path d="M9 9h6"/></svg>
                  </div>
                  <span className="text-white/70 text-xs uppercase tracking-widest" style={{ fontFamily: sans }}>Equivalent Trees</span>
                </div>
                <span className="text-white text-lg" style={{ fontFamily: serif }}>{detailedStats?.equivalentTrees || 0}</span>
              </div>

              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/50 group-hover:text-[#C8A97A] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <span className="text-white/70 text-xs uppercase tracking-widest" style={{ fontFamily: sans }}>Women Employed</span>
                </div>
                <span className="text-white text-lg" style={{ fontFamily: serif }}>{detailedStats?.ruralWomenEmployed || 0}</span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/10 my-8" />

            {/* Timeline Feed */}
            <div>
              <p className="text-[#C8A97A] text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ fontFamily: sans }}>Recent Impact Stream</p>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent pl-6">
                
                {recentItems?.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between mb-5 last:mb-0">
                    {/* Timeline dot */}
                    <div className="absolute -left-6 w-3 h-3 bg-[#1C1C1A] border-2 border-[#8FBD84] rounded-full"></div>
                    
                    <span className="text-white/80 text-sm font-medium tracking-wide truncate pr-4" style={{ fontFamily: sans }}>{item.name}</span>
                    <span className="text-[#8FBD84] text-xs font-bold tracking-widest uppercase">+{item.co2} kg CO₂</span>
                  </div>
                ))}

              </div>
            </div>
            
          </motion.div>
        </div>

      </div>
    </section>
  );
}
