import React from "react";

function ProductCardSkeleton() {
  return (
    <div className="relative w-full flex flex-col bg-white rounded-[2px] overflow-hidden border border-[#EAE3D6] shadow-[0_4px_16px_rgba(20,30,23,0.03)] transition-all">
      {/* ─── Product Image Stage Skeleton (Identical aspect-[4/5] & travertine wash) ─── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F4EFE6]">
        {/* Smooth luxury shimmer beam */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer pointer-events-none" />

        {/* Badge Placeholder (Top-Left) */}
        <div className="absolute top-3 left-3 z-10 h-5 w-20 bg-[#C29B5D]/25 rounded-[2px] border border-[#C29B5D]/30" />

        {/* Wishlist Button Placeholder (Top-Right) */}
        <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-[2px] bg-white/85 backdrop-blur-sm border border-[#EAE3D6] flex items-center justify-center shadow-sm">
          <div className="w-3.5 h-3.5 rounded-full bg-[#EAE3D6]" />
        </div>
      </div>

      {/* ─── Body & Procurement Details Skeleton (Identical p-5 & spacing) ─── */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white relative overflow-hidden">
        {/* Ambient subtle shimmer sweep */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none" />

        {/* Top Section: Category & Title */}
        <div>
          {/* Category & MOQ Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-3 w-20 bg-[#C29B5D]/25 rounded-[2px] animate-pulse" />
            <div className="h-4 w-24 bg-[#F4EFE6] border border-[#EAE3D6]/70 rounded-[2px] animate-pulse" />
          </div>

          {/* Product Name Title Lines (Serif Title Simulation) */}
          <div className="space-y-1.5 mb-4">
            <div className="h-4 w-5/6 bg-[#141E17]/15 rounded-[2px] animate-pulse" />
            <div className="h-4 w-3/5 bg-[#141E17]/10 rounded-[2px] animate-pulse" />
          </div>
        </div>

        {/* Bottom Section: Pricing & Action Buttons */}
        <div>
          {/* Pricing Row */}
          <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-[#F4EFE6]">
            <div className="flex items-baseline gap-2">
              <div className="h-5 w-20 bg-[#141E17]/20 rounded-[2px] animate-pulse" />
              <div className="h-3 w-16 bg-[#141E17]/10 rounded-[2px] animate-pulse" />
            </div>
            <div className="h-3.5 w-12 bg-[#9E9088]/20 rounded-[2px] animate-pulse" />
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {/* View Specifications Button Placeholder */}
            <div className="h-10 flex-1 bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] flex items-center justify-center animate-pulse">
              <div className="h-2.5 w-28 bg-[#141E17]/15 rounded-[2px]" />
            </div>

            {/* Cart Icon Button Placeholder */}
            <div className="w-10 h-10 flex-shrink-0 rounded-[2px] bg-[#141E17]/15 flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 rounded-[2px] bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <main className="relative min-h-screen pt-28 bg-[#FAF7F2] text-[#1C1C1A]">
      {/* ─── Top Utility Bar Skeleton (Matching ProductsListClient exactly) ─── */}
      <div className="bg-[#FAF7F2] border-b border-[#E8DDD0] py-4 px-6 relative">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Filter Toggle & Results Count */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="h-[38px] w-28 bg-[#1C1C1A]/10 rounded-full animate-pulse flex items-center justify-center gap-2 px-4">
              <div className="w-3.5 h-3.5 rounded-full bg-[#1C1C1A]/20" />
              <div className="w-12 h-2.5 rounded-full bg-[#1C1C1A]/20" />
            </div>
            <div className="h-3.5 w-20 bg-[#E8DDD0] rounded-full animate-pulse hidden sm:block" />
          </div>

          {/* Right: Search & Sort Skeletons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-[38px] w-full sm:w-64 rounded-full border border-[#E8DDD0] bg-white animate-pulse flex items-center px-4 gap-2.5 shadow-sm">
              <div className="w-3.5 h-3.5 rounded-full bg-[#E8DDD0]" />
              <div className="w-28 h-2.5 rounded-full bg-[#E8DDD0]/70" />
            </div>
            <div className="h-[38px] w-32 rounded-full border border-[#E8DDD0] bg-white animate-pulse flex items-center justify-between px-4 shadow-sm shrink-0">
              <div className="w-16 h-2.5 rounded-full bg-[#E8DDD0]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#E8DDD0]" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content Area: 8 Identical-Sized Skeleton Cards ────────── */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="product-card-wrap h-full flex">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
