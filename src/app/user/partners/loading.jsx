import React from "react";

export default function PartnersLoading() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#141E17]">
      {/* Hero Skeleton */}
      <div className="pt-36 pb-20 bg-[#0D140F] border-b border-[#C29B5D]/20 px-6 text-center space-y-4">
        <div className="h-4 w-64 bg-white/10 rounded-[2px] mx-auto animate-pulse" />
        <div className="h-12 w-3/4 max-w-xl bg-white/15 rounded-[2px] mx-auto animate-pulse" />
        <div className="h-4 w-4/5 max-w-lg bg-white/10 rounded-[2px] mx-auto animate-pulse" />
        <div className="max-w-6xl mx-auto mt-16 pt-10 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-8 w-24 bg-white/20 rounded-[2px] mx-auto animate-pulse" />
              <div className="h-3 w-32 bg-[#C29B5D]/25 rounded-[2px] mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[#EAE3D6] p-7 rounded-[2px] space-y-4 shadow-sm">
              <div className="h-3 w-24 bg-[#C29B5D]/25 rounded-[2px] animate-pulse" />
              <div className="h-6 w-3/4 bg-[#141E17]/20 rounded-[2px] animate-pulse" />
              <div className="h-3.5 w-32 bg-[#141E17]/10 rounded-[2px] animate-pulse" />
              <div className="h-12 w-full bg-[#FAF8F5] rounded-[2px] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
