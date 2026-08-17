import React from "react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-[#C8A97A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-72 h-72 bg-[#4A6741]/10 rounded-full blur-3xl -bottom-10 -right-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Shimmering Logo Mark */}
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DDD0] shadow-sm flex items-center justify-center p-3 mb-6 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A6741]/20 to-[#C8A97A]/20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Brand Text Skeleton */}
        <div className="h-6 w-36 bg-[#E8DDD0]/70 rounded-full mb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        <div className="h-3.5 w-48 bg-[#E8DDD0]/40 rounded-full mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Luxury Progress Bar */}
        <div className="w-48 h-1 bg-[#E8DDD0]/50 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-[#4A6741] via-[#C8A97A] to-[#4A6741] rounded-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
