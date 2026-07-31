import React from "react";
import Image from "next/image";

const impactData = [
  {
    value: "120+",
    label: "B2B Partners",
    desc: "Partnering globally with premium boutique hotels and retailers to build sustainable, ethical supply chains from the ground up."
  },
  {
    value: "100%",
    label: "Biodegradable",
    desc: "From our packaging down to the product core, everything we create is meticulously designed to return safely back to the earth."
  },
  {
    value: "350+",
    label: "Artisans",
    desc: "Empowering rural communities through fair trade initiatives, preserving generations of heritage crafting techniques."
  },
  {
    value: "50K+",
    label: "Plastics Cut",
    desc: "Diverting thousands of single-use plastics from our oceans by replacing them with beautiful, highly renewable alternatives."
  }
];

export default function EditorialImpact() {
  return (
    <section className="relative py-24 md:py-32 px-6 bg-[#FAF7F2] overflow-hidden text-[#1C1C1A] border-y border-[#E8DDD0]">
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-20 md:mb-28">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-12 h-[1px] bg-[#C8A97A]" />
            <p className="text-[#C8A97A] text-xs tracking-[0.4em] uppercase font-bold">The Impact</p>
            <span className="w-12 h-[1px] bg-[#C8A97A]" />
          </div>
          <h2 className="text-5xl md:text-7xl font-light leading-tight mb-8" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Beyond <span className="italic text-[#C8A97A]">Aesthetics.</span>
          </h2>
          <p className="text-[#6B6560] text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            We measure our success not just in beauty, but in the acreage of wetlands restored, the carbon diverted, and the communities uplifted.
          </p>
        </div>

        {/* Simple Grid for Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {impactData.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <h3 
                className="text-6xl md:text-7xl font-light tracking-tighter leading-none text-[#1C1C1A] mb-6" 
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {item.value}
              </h3>
              <h4 className="text-sm md:text-base font-bold mb-4 uppercase tracking-[0.2em] text-[#C8A97A]">
                {item.label}
              </h4>
              <p className="text-[#6B6560] font-light leading-relaxed text-sm md:text-base max-w-xs">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
