"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Truck, CheckCircle2, Building2, Globe2, Sparkles } from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

export default function TrustedMarketplaces() {
  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-12 bg-[#FAF8F5] border-b border-[#EAE3D6]" style={{ fontFamily: sans }}>
      <div className="max-w-[1520px] mx-auto">
        
        {/* ─── Header ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.25em] text-[#C29B5D] mb-3">
              <span className="w-5 h-[1.5px] bg-[#C29B5D]" />
              <span>Nationwide B2B Procurement</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.12] tracking-tight text-[#141E17]"
              style={{ fontFamily: serif }}
            >
              Available Across <span className="italic text-[#C29B5D] font-serif font-normal">India</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#5C665F] mt-3 font-light leading-relaxed">
              Trusted national marketplaces and verified digital corridors where institutional buyers, hotel procurement desks, and retail chains can acquire certified KrisluxECO collections.
            </p>
          </div>

          {/* Pan-India Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-white border border-[#EAE3D6] text-xs font-mono text-[#141E17] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#3E634A] animate-pulse" />
            <span>Serving All 28 States &amp; 8 Union Territories</span>
          </div>
        </div>

        {/* ─── Marketplaces Cards Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 pt-8 mb-8">
          
          {/* Card 1: IndiaMART */}
          <div className="relative bg-white rounded-[2px] border border-[#EAE3D6] hover:border-[#C29B5D] p-7 sm:p-10 pt-10 sm:pt-12 shadow-[0_4px_24px_rgba(20,30,23,0.04)] hover:shadow-[0_20px_45px_rgba(20,30,23,0.08)] transition-all duration-500 flex flex-col justify-between group">
            {/* Top Glowing Hairline */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#1D4E89] via-[#C29B5D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
              {/* Badge & Branding Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 -mt-16 sm:-mt-20">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Corner Brand Hallmark / Big Logo Box */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2px] bg-white border border-[#EAE3D6] p-3 sm:p-4 flex items-center justify-center flex-shrink-0 shadow-[0_8px_24px_rgba(20,30,23,0.08)] group-hover:border-[#C29B5D] group-hover:shadow-[0_12px_32px_rgba(20,30,23,0.12)] transition-all z-10">
                    <Image
                      src="/images/indiamart_corner_logo.png"
                      alt="IndiaMART Official Logo"
                      width={100}
                      height={100}
                      className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="pt-6 sm:pt-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#141E17] tracking-tight" style={{ fontFamily: serif }}>
                      IndiaMART
                    </h3>
                    <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-[#1D4E89] font-bold block mt-1">
                      Verified B2B Marketplace Partner
                    </span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-8 self-start sm:self-auto">
                  <span className="text-[9px] uppercase font-mono tracking-widest px-3 py-1.5 rounded-[2px] bg-[#EBF2ED] text-[#2B4B38] font-bold border border-[#2B4B38]/15 whitespace-nowrap shadow-xs">
                    TrustSEAL Verified
                  </span>
                </div>
              </div>

              {/* Tagline */}
              <h4 className="text-base sm:text-lg text-[#141E17] font-medium mb-3" style={{ fontFamily: serif }}>
                Wholesale Queries &amp; Bulk Orders Across India
              </h4>

              <p className="text-xs sm:text-sm text-[#5C665F] font-light leading-relaxed mb-6">
                Connect directly with our institutional sales division for factory-direct container quotes, volume tier pricing, and GST-compliant invoicing with pan-India road &amp; rail freight dispatch.
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-[#F0ECE3] mb-8">
                <div className="flex items-center gap-2 text-xs text-[#141E17]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3E634A] flex-shrink-0" />
                  <span className="text-[11px] font-mono">Verified Supplier</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#141E17]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3E634A] flex-shrink-0" />
                  <span className="text-[11px] font-mono">MOQ: 25+ Units</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#141E17]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3E634A] flex-shrink-0" />
                  <span className="text-[11px] font-mono">GST B2B Invoicing</span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F0ECE3]">
              <span className="text-xs text-[#78857C] font-mono">
                Catalog: Over 80+ Sustainable SKUs
              </span>

              <a
                href="https://www.indiamart.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#141E17] hover:bg-[#1D4E89] text-[#FAF8F5] rounded-[2px] text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 shadow-sm cursor-pointer group/btn"
              >
                <span>Visit IndiaMART Store</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Card 2: ExportersIndia */}
          <div className="relative bg-white rounded-[2px] border border-[#EAE3D6] hover:border-[#C29B5D] p-7 sm:p-10 pt-10 sm:pt-12 shadow-[0_4px_24px_rgba(20,30,23,0.04)] hover:shadow-[0_20px_45px_rgba(20,30,23,0.08)] transition-all duration-500 flex flex-col justify-between group">
            {/* Top Glowing Hairline */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#0B7A75] via-[#C29B5D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
              {/* Badge & Branding Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 -mt-16 sm:-mt-20">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Corner Brand Hallmark / Big Logo Box */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2px] bg-white border border-[#EAE3D6] p-3 sm:p-4 flex items-center justify-center flex-shrink-0 shadow-[0_8px_24px_rgba(20,30,23,0.08)] group-hover:border-[#C29B5D] group-hover:shadow-[0_12px_32px_rgba(20,30,23,0.12)] transition-all z-10">
                    <Image
                      src="/images/exportersindia_icon.svg"
                      alt="ExportersIndia Official Logo"
                      width={100}
                      height={100}
                      className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="pt-6 sm:pt-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#141E17] tracking-tight" style={{ fontFamily: serif }}>
                      ExportersIndia
                    </h3>
                    <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-[#0B7A75] font-bold block mt-1">
                      Certified Export &amp; Domestic Member
                    </span>
                  </div>
                </div>

                <div className="pt-2 sm:pt-8 self-start sm:self-auto">
                  <span className="text-[9px] uppercase font-mono tracking-widest px-3 py-1.5 rounded-[2px] bg-[#FAF3E8] text-[#8C6422] font-bold border border-[#8C6422]/15 whitespace-nowrap shadow-xs">
                    Premier Member
                  </span>
                </div>
              </div>

              {/* Tagline */}
              <h4 className="text-base sm:text-lg text-[#141E17] font-medium mb-3" style={{ fontFamily: serif }}>
                Export Inquiries &amp; Domestic Distribution Hub
              </h4>

              <p className="text-xs sm:text-sm text-[#5C665F] font-light leading-relaxed mb-6">
                Streamlined container procurement for corporate retail chains, export consolidators, and international hospitality operators seeking certified bio-based water hyacinth goods with export customs clearance.
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-[#F0ECE3] mb-8">
                <div className="flex items-center gap-2 text-xs text-[#141E17]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A75] flex-shrink-0" />
                  <span className="text-[11px] font-mono">Export Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#141E17]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A75] flex-shrink-0" />
                  <span className="text-[11px] font-mono">FOB / CIF Pricing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#141E17]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7A75] flex-shrink-0" />
                  <span className="text-[11px] font-mono">Phyto-Sanitary QA</span>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F0ECE3]">
              <span className="text-xs text-[#78857C] font-mono">
                Logistics: Mumbai, Kolkata &amp; Delhi Ports
              </span>

              <a
                href="https://www.exportersindia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#141E17] hover:bg-[#0B7A75] text-[#FAF8F5] rounded-[2px] text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 shadow-sm cursor-pointer group/btn"
              >
                <span>Visit ExportersIndia Store</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>

        </div>

        {/* ─── Direct Factory Procurement Assurance Bar ─── */}
        <div className="p-6 sm:p-7 bg-white rounded-[2px] border border-[#EAE3D6] flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[2px] bg-[#C29B5D]/15 text-[#C29B5D] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#141E17]">
                Prefer Direct Factory Procurement &amp; Bespoke Dimensions?
              </h4>
              <p className="text-xs text-[#68736B] font-light">
                Submit your project specifications or custom drawings directly to our Patna production desk for tailored commercial quotes within 24 hours.
              </p>
            </div>
          </div>

          <Link
            href="/user/bulk-order"
            className="w-full md:w-auto whitespace-nowrap py-2.5 px-6 rounded-[2px] border border-[#141E17] hover:bg-[#141E17] text-[#141E17] hover:text-[#FAF8F5] text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 text-center"
          >
            Direct Factory RFQ →
          </Link>
        </div>

      </div>
    </section>
  );
}
