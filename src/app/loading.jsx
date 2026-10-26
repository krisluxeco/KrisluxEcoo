import React from "react";
import Image from "next/image";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-[#C29B5D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-72 h-72 bg-[#759E81]/10 rounded-full blur-3xl -bottom-10 -right-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Shimmering Logo Mark */}
        <div className="w-24 h-20 flex items-center justify-center mb-6 relative">
          <Image
            width={200}
            height={150}
            src="/logotrans.png"
            alt="KrisluxECO Logo"
            className="w-full h-full object-contain animate-pulse drop-shadow-md"
          />
        </div>

        {/* Brand Text Skeleton */}
        <div className="h-6 w-36 bg-[#EAE3D6]/70 rounded-full mb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        <div className="h-3.5 w-48 bg-[#EAE3D6]/40 rounded-full mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Luxury Progress Bar */}
        <div className="w-48 h-1 bg-[#EAE3D6]/50 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-[#1E3125] via-[#C29B5D] to-[#1E3125] rounded-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
