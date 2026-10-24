"use client";

import React from "react";
import { ArrowUpRight, Newspaper, Award, ExternalLink, Sparkles, Bookmark, Pin } from "lucide-react";

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";

export default function AsFeaturedIn() {
  const articles = [
    {
      id: "jagran",
      publication: "DAINIK JAGRAN",
      publicationSub: "दैनिक जागरण • राष्ट्रीय संस्करण",
      edition: "Patna & Begusarai Bureau • Vol. XLVIII",
      date: "OCTOBER 2024",
      headlineHindi: "जलकुंभी से खुल रही रोजगार की राह, IIT पटना के छात्र के नए स्टार्टअप मॉडल से नदी भी होगी साफ",
      headlineEnglish: "Water Hyacinth Opening Employment Pathways: IIT Patna Student's Startup Cleans Rivers While Empowering Artisans",
      excerpt: "कृष्णा की प्राथमिक शिक्षा संत पाल पब्लिक स्कूल, तेघड़ा से हुई। 2021 में 10वीं एवं 2023 में 12वीं पास करने के बाद उन्होंने पहले प्रयास में ही सीयूईटी के जरिए आइआइटी पटना में दाखिला लिया। पढ़ाई के दौरान ही वस्त्र मंत्रालय के स्किल डेवलपमेंट प्रशिक्षण की जानकारी मिली... जिससे जलकुंभी से पर्यावरण और रोजगार दोनों का समाधान निकला।",
      penNote: "IIT Patna Innovation • Clean Rivers",
      penColor: "text-[#1E40AF]", // Ballpoint Blue
      penCircle: "border-[#2563EB]/70",
      stampText: "FIRST EDITION ARCHIVE",
      stampColor: "border-[#8C271E] text-[#8C271E]",
      tapeColor: "bg-amber-200/55 border-amber-300/40",
      tapeAngle: "-rotate-2",
      paperAngle: "-rotate-[1.2deg] hover:-rotate-0",
      paperBg: "bg-[#F7F4EB]",
      paperBorder: "border-[#D8CFBC]",
      url: "https://www.jagran.com/bihar/begusarai-new-model-of-economic-prosperity-from-water-hyacinth-startup-of-a-student-of-iit-patna-24032296.html",
      tornTopPolygon: "polygon(0% 4px, 4% 0px, 9% 5px, 14% 1px, 19% 6px, 24% 2px, 29% 5px, 35% 1px, 41% 6px, 47% 2px, 53% 5px, 59% 1px, 65% 6px, 71% 2px, 77% 5px, 83% 1px, 89% 6px, 94% 2px, 100% 4px, 100% calc(100% - 4px), 96% 100%, 91% calc(100% - 6px), 86% calc(100% - 2px), 81% calc(100% - 7px), 76% calc(100% - 1px), 70% calc(100% - 6px), 64% calc(100% - 2px), 58% calc(100% - 7px), 52% calc(100% - 1px), 46% calc(100% - 6px), 40% calc(100% - 2px), 34% calc(100% - 7px), 28% calc(100% - 1px), 22% calc(100% - 6px), 16% calc(100% - 2px), 10% calc(100% - 7px), 5% calc(100% - 1px), 0% calc(100% - 5px))",
    },
    {
      id: "economic-times",
      publication: "THE ECONOMIC TIMES",
      publicationSub: "India's Premier Financial Daily",
      edition: "Sustainable Enterprise & Circular Luxury",
      date: "SPECIAL REPORT 2026",
      headlineHindi: "सस्टेनेबल लग्जरी: वॉटर हायसिंथ उत्पादों का राष्ट्रीय विस्तार",
      headlineEnglish: "Sustainable Fashion: The Rise of Water Hyacinth Products in Luxury Hospitality",
      excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit. How indigenous wetland regeneration is turning ecological challenges into high-value architectural home decor, luxury hospitality amenities, and export-grade natural fiber collections.",
      penNote: "Scope 3 Decarbonization Mandate",
      penColor: "text-[#0F766E]", // Forest Ink
      penCircle: "border-[#0F766E]/70",
      stampText: "CERTIFIED CASE STUDY",
      stampColor: "border-[#C29B5D] text-[#8C6422]",
      tapeColor: "bg-emerald-200/50 border-emerald-300/40",
      tapeAngle: "rotate-2",
      paperAngle: "rotate-[1deg] hover:rotate-0",
      paperBg: "bg-[#F5F1E6]",
      paperBorder: "border-[#D5CBBA]",
      url: "https://www.krisluxeco.com/#",
      tornTopPolygon: "polygon(0% 2px, 5% 6px, 10% 1px, 15% 5px, 20% 0px, 26% 6px, 32% 2px, 38% 5px, 44% 1px, 50% 6px, 56% 2px, 62% 5px, 68% 0px, 74% 6px, 80% 2px, 86% 5px, 92% 1px, 97% 6px, 100% 2px, 100% calc(100% - 2px), 95% calc(100% - 7px), 90% calc(100% - 1px), 84% calc(100% - 6px), 79% calc(100% - 2px), 73% calc(100% - 7px), 67% calc(100% - 1px), 61% calc(100% - 6px), 55% calc(100% - 2px), 49% calc(100% - 7px), 43% calc(100% - 1px), 37% calc(100% - 6px), 31% calc(100% - 2px), 25% calc(100% - 7px), 19% calc(100% - 1px), 13% calc(100% - 6px), 7% calc(100% - 2px), 0% calc(100% - 7px))",
    },
    {
      id: "news18",
      publication: "NEWS 18 SPECIAL",
      publicationSub: "न्यूज़ 18 • Exclusive Ground Investigation",
      edition: "Rural Enterprise & Craft Guilds Bureau",
      date: "INVESTIGATIVE DISPATCH",
      headlineHindi: "तालाबों की खरपतवार से अंतरराष्ट्रीय फाइव-स्टार होटलों तक का सफर",
      headlineEnglish: "From Village Ponds to Premium Global Marketplaces",
      excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae. How wild wetland weeds from rural Bihar ponds are being transformed by 1,420+ skilled female artisans into export-grade architectural home decor commanding attention across luxury international hotel suites.",
      penNote: "1,420+ Rural Artisans Employed",
      penColor: "text-[#B91C1C]", // Red Ink
      penCircle: "border-[#DC2626]/70",
      stampText: "EXCLUSIVE GROUND REPORT",
      stampColor: "border-[#1D4E89] text-[#1D4E89]",
      tapeColor: "bg-fuchsia-200/50 border-fuchsia-300/40",
      tapeAngle: "-rotate-1",
      paperAngle: "-rotate-[0.8deg] hover:rotate-0",
      paperBg: "bg-[#F9F5EC]",
      paperBorder: "border-[#DAD0BC]",
      url: "https://www.krisluxeco.com/#",
      tornTopPolygon: "polygon(0% 5px, 6% 1px, 11% 6px, 17% 2px, 22% 5px, 28% 1px, 34% 6px, 40% 2px, 46% 5px, 52% 0px, 58% 6px, 64% 2px, 70% 5px, 76% 1px, 82% 6px, 88% 2px, 94% 5px, 100% 1px, 100% calc(100% - 5px), 94% calc(100% - 1px), 88% calc(100% - 7px), 82% calc(100% - 2px), 76% calc(100% - 6px), 70% calc(100% - 1px), 64% calc(100% - 7px), 58% calc(100% - 2px), 52% calc(100% - 6px), 46% calc(100% - 1px), 40% calc(100% - 7px), 34% calc(100% - 2px), 28% calc(100% - 6px), 22% calc(100% - 1px), 16% calc(100% - 7px), 10% calc(100% - 2px), 5% calc(100% - 6px), 0% calc(100% - 2px))",
    },
  ];

  return (
    <section
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-[#1A1816] text-[#141E17] border-b border-[#2C2925] overflow-hidden"
      style={{ fontFamily: sans }}
    >
      {/* ─── Vintage Newsroom Cutting Board / Dark Linen Mat ─── */}
      <div className="absolute inset-0 bg-[#161513] opacity-95 pointer-events-none" />
      
      {/* Subtle Blueprint / Cutting Mat Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#C29B5D 1px, transparent 1px), linear-gradient(90deg, #C29B5D 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Atmospheric Soft Light from Above */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#C29B5D]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-[1560px] mx-auto">
        
        {/* ─── Section Header ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.25em] text-[#C29B5D] mb-3">
              <span className="w-5 h-[1.5px] bg-[#C29B5D]" />
              <span>National Press Desk &amp; News Clippings</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.12] tracking-tight text-[#FAF8F5]"
              style={{ fontFamily: serif }}
            >
              As Featured <span className="italic text-[#C29B5D] font-serif font-normal">In</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#A89E92] mt-3 font-light leading-relaxed">
              Authentic archival press clippings and investigative features documenting our circular model from leading national publications.
            </p>
          </div>

          {/* Archival Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-white/[0.05] border border-white/10 text-xs font-mono text-[#E4C590] shadow-sm">
            <Bookmark className="w-3.5 h-3.5 text-[#C29B5D]" />
            <span>Verified Print &amp; Digital Newsstand Archive</span>
          </div>
        </div>

        {/* ─── 3 Ripped Newspaper Cutouts Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-8 items-start">
          {articles.map((art) => (
            <div
              key={art.id}
              className={`relative transition-all duration-500 ease-out transform ${art.paperAngle} hover:scale-[1.015] hover:z-20`}
              style={{
                filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.45)) drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
              }}
            >
              {/* ─── Semi-Transparent Frosted Washi Tape at Top ─── */}
              <div
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 sm:w-36 h-7 z-30 pointer-events-none transform ${art.tapeAngle} ${art.tapeColor} backdrop-blur-[1.5px] border-y shadow-xs`}
                style={{
                  clipPath:
                    "polygon(0% 2px, 3px 0%, 6px 3px, 9px 0%, 12px 3px, calc(100% - 12px) 0%, calc(100% - 9px) 3px, calc(100% - 6px) 0%, calc(100% - 3px) 3px, 100% 1px, 100% calc(100% - 1px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) 100%, calc(100% - 9px) calc(100% - 3px), calc(100% - 12px) 100%, 12px calc(100% - 3px), 9px 100%, 6px calc(100% - 3px), 3px 100%, 0% calc(100% - 2px))",
                }}
              />

              {/* ─── Torn Paper Shell ─── */}
              <article
                className={`relative ${art.paperBg} p-6 sm:p-8 pt-8 pb-9 flex flex-col justify-between border ${art.paperBorder} overflow-hidden`}
                style={{
                  clipPath: art.tornTopPolygon,
                }}
              >
                {/* Vintage Newsprint Texture Grain Layer */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply"
                  style={{
                    backgroundImage:
                      "radial-gradient(#000 0.8px, transparent 0.8px), radial-gradient(#000 0.8px, #F7F4EB 0.8px)",
                    backgroundSize: "6px 6px",
                  }}
                />

                {/* Aged Paper Burn / Vignette Edges */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#8C7A58]/10 via-transparent to-[#8C7A58]/15 pointer-events-none" />

                <div>
                  {/* ─── Newspaper Masthead Bar ─── */}
                  <div className="border-b-2 border-[#1C1A17] pb-3 mb-4 text-center">
                    <span className="block text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1C1A17]" style={{ fontFamily: serif }}>
                      {art.publication}
                    </span>
                    <span className="block text-[10px] font-mono tracking-widest text-[#423E37] uppercase font-semibold mt-0.5">
                      {art.publicationSub}
                    </span>
                    
                    {/* Newspaper Sub-rules with volume and date */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#5C564C] pt-2 mt-2 border-t border-[#1C1A17]/40 uppercase tracking-wider">
                      <span>{art.edition}</span>
                      <span>{art.date}</span>
                    </div>
                  </div>

                  {/* ─── Headline Block ─── */}
                  <div className="mb-4">
                    {art.headlineHindi && (
                      <h3
                        className="text-lg sm:text-[19px] font-bold leading-snug text-[#1C1A17] mb-2 tracking-tight"
                        style={{ fontFamily: serif }}
                      >
                        "{art.headlineHindi}"
                      </h3>
                    )}

                    <h4
                      className="text-xs sm:text-sm text-[#4A453C] italic font-serif leading-relaxed pb-3 border-b border-[#1C1A17]/20"
                    >
                      {art.headlineEnglish}
                    </h4>
                  </div>

                  {/* ─── Newspaper Column Body with Authentic Drop Cap ─── */}
                  <div className="relative text-xs sm:text-[13px] text-[#2B2721] font-serif leading-relaxed mb-6 space-y-3">
                    <p className="first-letter:float-left first-letter:text-3xl first-letter:font-black first-letter:mr-2 first-letter:leading-none first-letter:font-serif first-letter:text-[#1C1A17]">
                      {art.excerpt}
                    </p>
                  </div>

                  {/* ─── Handwritten Ballpoint Pen Note with Hand-Drawn Oval ─── */}
                  <div className="my-5 p-3 relative flex items-center justify-center">
                    <div
                      className={`relative px-4 py-2 border-2 ${art.penCircle} rounded-[60%_40%_55%_45%] transform -rotate-1 shadow-2xs bg-white/40`}
                    >
                      <span className={`text-xs sm:text-sm font-serif italic font-bold ${art.penColor} tracking-wide`}>
                        ✍︎ "{art.penNote}"
                      </span>
                    </div>
                  </div>
                </div>

                {/* ─── Bottom Stamped Archival Footer ─── */}
                <div className="pt-4 border-t-2 border-[#1C1A17]/30 flex flex-wrap items-center justify-between gap-3 mt-auto">
                  {/* Rubber Stamp Badge */}
                  <span
                    className={`text-[9px] uppercase font-mono tracking-widest font-black px-2 py-0.5 border-2 ${art.stampColor} rounded-[2px] transform -rotate-2 select-none`}
                  >
                    {art.stampText}
                  </span>

                  {/* Read Article Action */}
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase font-bold text-[#1C1A17] hover:text-[#8C271E] underline underline-offset-4 transition-colors cursor-pointer group/link"
                  >
                    <span>Read Full Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* ─── Bottom Press Desk Note ─── */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89E92]">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#C29B5D]" />
            <span>Looking for certified press kits, founder interview archives, or high-resolution field photography?</span>
          </div>

          <a
            href="mailto:press@krisluxeco.com"
            className="text-[#E4C590] hover:text-white font-mono uppercase tracking-wider font-semibold underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            press@krisluxeco.com →
          </a>
        </div>

      </div>
    </section>
  );
}
