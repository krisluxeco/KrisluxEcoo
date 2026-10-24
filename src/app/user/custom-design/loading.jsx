import React from "react";

export default function CustomDesignLoading() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#141E17]">
      {/* ─── Hero Skeleton (Dark Forest Obsidian) ─── */}
      <div className="pt-36 pb-20 bg-[#0D140F] border-b border-[#C29B5D]/20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="h-4 w-64 bg-white/10 rounded-[2px] mx-auto animate-pulse" />
          <div className="h-12 w-3/4 max-w-xl bg-white/15 rounded-[2px] mx-auto animate-pulse" />
          <div className="h-4 w-4/5 max-w-lg bg-white/10 rounded-[2px] mx-auto animate-pulse" />
          <div className="flex justify-center gap-4 pt-4">
            <div className="h-11 w-44 bg-[#C29B5D]/30 rounded-[2px] animate-pulse" />
            <div className="h-11 w-44 bg-white/10 rounded-[2px] animate-pulse" />
          </div>
        </div>

        {/* Metric Ribbon Skeleton */}
        <div className="max-w-6xl mx-auto mt-16 pt-10 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-8 w-24 bg-white/20 rounded-[2px] mx-auto animate-pulse" />
              <div className="h-3 w-32 bg-[#C29B5D]/25 rounded-[2px] mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main Content Skeleton ─── */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="h-4 w-32 bg-[#EAE3D6] rounded-[2px] animate-pulse" />
            <div className="h-10 w-64 bg-[#EAE3D6] rounded-[2px] animate-pulse" />
            <div className="h-16 w-full bg-[#EAE3D6]/60 rounded-[2px] animate-pulse" />
          </div>

          <div className="lg:col-span-7 bg-white border border-[#EAE3D6] rounded-[2px] p-8 sm:p-12 space-y-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-11 bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] animate-pulse" />
              <div className="h-11 bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] animate-pulse" />
            </div>
            <div className="h-11 bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] animate-pulse" />
            <div className="h-28 bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] animate-pulse" />
            <div className="h-20 bg-[#FAF8F5] border border-dashed border-[#EAE3D6] rounded-[2px] animate-pulse" />
            <div className="h-12 bg-[#141E17]/20 rounded-[2px] animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
