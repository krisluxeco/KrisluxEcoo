import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const serif = "var(--font-playfair), Georgia, serif";
const sans = "var(--font-montserrat), sans-serif";
const INK = "#1C1C1A";
const BRASS = "#C8A97A";
const FOREST = "#4A5D23";

function GlobeMark({ className = "" }) {
  const reduce = useReducedMotion();
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i = 0) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: 2, delay: i * 0.15, ease: "easeInOut" }, opacity: { duration: 0.5, delay: i * 0.15 } },
    }),
  };

  return (
    <motion.svg viewBox="0 0 220 220" className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      <motion.circle custom={0} variants={draw} cx="110" cy="110" r="60" stroke={INK} strokeWidth="1.6" fill="none" />
      <motion.ellipse custom={0.2} variants={draw} cx="110" cy="110" rx="20" ry="60" stroke={INK} strokeWidth="1.2" fill="none" opacity="0.4" />
      <motion.ellipse custom={0.4} variants={draw} cx="110" cy="110" rx="60" ry="20" stroke={INK} strokeWidth="1.2" fill="none" opacity="0.4" />
      <motion.path custom={0.6} variants={draw} d="M90 120 C 60 90, 70 50, 140 40 C 180 30, 200 60, 180 90" stroke={BRASS} strokeWidth="1.6" fill="none" strokeDasharray="4 4" />
      <motion.path custom={0.8} variants={draw} d="M170 85 L 180 90 L 175 80 Z" stroke={BRASS} strokeWidth="1.6" fill="none" />
    </motion.svg>
  );
}

function BoxMark({ className = "" }) {
  const reduce = useReducedMotion();
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i = 0) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: 2, delay: i * 0.15, ease: "easeInOut" }, opacity: { duration: 0.5, delay: i * 0.15 } },
    }),
  };

  return (
    <motion.svg viewBox="0 0 220 220" className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      <motion.path custom={0} variants={draw} d="M110 50 L 170 80 L 110 110 L 50 80 Z" stroke={INK} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
      <motion.path custom={0.2} variants={draw} d="M50 80 L 50 140 L 110 170 L 110 110" stroke={INK} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
      <motion.path custom={0.4} variants={draw} d="M170 80 L 170 140 L 110 170" stroke={INK} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
      <motion.path custom={0.5} variants={draw} d="M110 50 L 80 20 L 20 50 L 50 80" stroke={INK} strokeWidth="1.2" fill="none" opacity="0.6" strokeLinejoin="round" />
      <motion.path custom={0.6} variants={draw} d="M110 50 L 140 20 L 200 50 L 170 80" stroke={INK} strokeWidth="1.2" fill="none" opacity="0.6" strokeLinejoin="round" />
      <motion.path custom={0.7} variants={draw} d="M80 95 L 140 65" stroke={BRASS} strokeWidth="4" fill="none" strokeLinecap="round" />
      <motion.path custom={0.8} variants={draw} d="M110 80 C 90 60, 100 30, 110 10 C 120 30, 130 60, 110 80" stroke={FOREST} strokeWidth="1.6" fill="none" />
    </motion.svg>
  );
}

export default function Platforms() {
  const marketplaces = [
    {
      name: "IndiaMART",
      color: "#FFFFFF",
      desc: "Connect with us for wholesale queries and bulk orders across India.",
      link: "https://www.indiamart.com",
      customLabel: (
        <div className="flex items-center text-[#1C1C1A]">
          <span className="font-extrabold text-2xl tracking-tight">india</span>
          <span className="font-light text-2xl tracking-tight">MART</span>
        </div>
      )
    },
    {
      name: "ExportersIndia",
      color: "#1C1C1A",
      desc: "Explore our export-ready catalog for international B2B partnerships.",
      link: "https://www.exportersindia.com",
      customLabel: (
        <span className="text-white font-serif italic font-bold text-4xl">ei</span>
      )
    }
  ];

  const newsArticles = [
    {
      publisher: "Jagran",
      headline: "जलकुंभी से खुल रही रोजगार की राह, IIT पटना के छात्र के नए स्टार्टअप मॉडल से नदी भी होगी साफ",
      snippet: "कृष्णा की प्राथमिक शिक्षा संत पाल पब्लिक स्कूल, तेघड़ा से हुई। 2021 में 10वीं एवं 2023 में 12वीं पास करने के बाद उन्होंने पहले प्रयास में ही सीयूईटी के जरिए आइआइटी पटना में दाखिला लिया। पढ़ाई के दौरान ही वस्त्र मंत्रालय के स्किल डेवलपमेंट प्रशिक्षण की जानकारी मिली...",
      link: "https://www.jagran.com/bihar/begusarai-new-model-of-economic-prosperity-from-water-hyacinth-startup-of-a-student-of-iit-patna-24032296.html"
    },
    {
      publisher: "Economic Times",
      headline: "Sustainable Fashion: The Rise of Water Hyacinth Products",
      snippet: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit."
    },
    {
      publisher: "News18",
      headline: "From Village Ponds to Premium Global Marketplaces",
      snippet: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae."
    }
  ];

  return (
    <section className="bg-[#FAF7F2] text-[#1C1C1A] py-16 md:py-24 overflow-hidden border-y border-[#E8DDD0] relative">

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Subtle diagonal stripes */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(139, 41, 53, 0.04) 4px, rgba(139, 41, 53, 0.04) 5px)"
        }}></div>

        {/* Ambient lighting glows */}
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-[#E8DDD0] rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#D4C3B3] rounded-full blur-[120px] opacity-40"></div>

        {/* Animated Background SVGs */}
        <div className="absolute top-[10%] -left-12 opacity-[0.04] scale-[2.5] md:scale-[3] pointer-events-none rotate-12">
          <GlobeMark className="w-[300px]" />
        </div>
        <div className="absolute top-[60%] -right-12 opacity-[0.04] scale-[2.5] md:scale-[3] pointer-events-none -rotate-12">
          <BoxMark className="w-[300px]" />
        </div>

        {/* Massive faint watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] md:text-[18vw] font-black text-black/[0.015] tracking-tighter whitespace-nowrap select-none"
          style={{ fontFamily: serif }}
        >
          KRISLUX ECO
        </motion.div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">

        {/* Marketplaces Section */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bold uppercase tracking-[0.1em] text-[#8B2935] mb-3"
          style={{ fontFamily: serif }}
        >
          AVAILABLE ACROSS INDIA
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#1C1C1A] text-sm md:text-base font-medium mb-12"
          style={{ fontFamily: sans }}
        >
          Trusted marketplaces where you can buy Krislux Eco products
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12 max-w-4xl mx-auto px-2">
          {marketplaces.map((m, i) => (
            <motion.a
              href={m.link}
              target="_blank"
              rel="noreferrer"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-10 md:p-12 rounded-2xl shadow-sm border border-[#E8DDD0] flex flex-col items-center justify-center text-center group transition-all hover:shadow-xl hover:border-[#D4C3B3]"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-md mb-8 transition-transform group-hover:scale-110 duration-500"
                style={{ backgroundColor: m.color, border: m.color === '#FFFFFF' ? '1px solid #E8DDD0' : 'none' }}
              >
                {m.customLabel}
              </div>
              <h4 className="text-xl md:text-2xl font-bold mb-4 text-[#1C1C1A] tracking-wide" style={{ fontFamily: serif }}>{m.name}</h4>
              <p className="text-sm text-[#6B6560] leading-relaxed mb-8 max-w-[250px]" style={{ fontFamily: sans }}>
                {m.desc}
              </p>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#8B2935] flex items-center gap-2 group-hover:text-[#1C1C1A] transition-colors">
                Visit Store <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-20 md:mb-32"
        >
          <Link href="/user/products">
            <button className="w-full md:w-[600px] px-8 py-5 bg-[#8B2935] hover:bg-[#681e27] text-white text-sm font-bold tracking-[0.1em] uppercase rounded-md shadow-md transition-colors" style={{ fontFamily: sans }}>
              View products
            </button>
          </Link>
        </motion.div>

        {/* Featured In Section */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-bold tracking-wider mb-14 text-[#1C1C1A]"
          style={{ fontFamily: sans }}
        >
          As Featured In
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {newsArticles.map((article, i) => (
            <motion.a
              href={article.link || "#"}
              target={article.link ? "_blank" : "_self"}
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }}
              className="relative aspect-square md:aspect-[4/5] bg-[#F4EFE6] border border-[#D4C3B3] p-4 md:p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col group cursor-pointer overflow-hidden transform transition-all duration-300"
            >
              <div className="w-full h-full border border-black/10 p-4 flex flex-col bg-[#FAF7F0] shadow-inner relative z-10 group-hover:bg-white transition-colors">
                <div className="border-b-[3px] border-black/80 pb-3 mb-4 text-center">
                  <h4 className="font-serif font-black text-sm md:text-base uppercase tracking-[0.2em] text-black/90">{article.publisher}</h4>
                </div>
                <h5 className="font-serif font-bold text-xl md:text-2xl leading-tight mb-4 text-[#1C1C1A]">{article.headline}</h5>
                <div className="h-[2px] w-12 bg-[#8B2935] mb-4"></div>
                <p className="text-[11px] md:text-xs text-black/70 text-justify leading-relaxed">
                  {article.snippet}
                </p>
                <div className="mt-auto pt-4 border-t border-black/10 flex justify-between items-center text-[9px] uppercase tracking-widest text-[#8B2935] font-bold">
                  <span>Read Full Article</span>
                  <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
              
              {/* Decorative tape effect */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm shadow-sm transform -rotate-2 z-20"></div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
