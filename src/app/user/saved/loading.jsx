import React from "react";

function ProductCardSkeleton() {
  return (
    <div className="relative w-full flex flex-col bg-white rounded-[2px] overflow-hidden border border-[#EAE3D6] shadow-[0_4px_16px_rgba(20,30,23,0.03)] transition-all">
      {/* ─── Product Image Stage Skeleton ─── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F4EFE6]">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer pointer-events-none" />
        <div className="absolute top-3 left-3 z-10 h-5 w-20 bg-[#C29B5D]/25 rounded-[2px] border border-[#C29B5D]/30" />
        <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-[2px] bg-white/85 backdrop-blur-sm border border-[#EAE3D6] flex items-center justify-center shadow-sm">
          <div className="w-3.5 h-3.5 rounded-full bg-[#C29B5D]/40" />
        </div>
      </div>

      {/* ─── Body & Procurement Details Skeleton ─── */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none" />
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-3 w-20 bg-[#C29B5D]/25 rounded-[2px] animate-pulse" />
            <div className="h-4 w-24 bg-[#F4EFE6] border border-[#EAE3D6]/70 rounded-[2px] animate-pulse" />
          </div>
          <div className="space-y-1.5 mb-4">
            <div className="h-4 w-5/6 bg-[#141E17]/15 rounded-[2px] animate-pulse" />
            <div className="h-4 w-3/5 bg-[#141E17]/10 rounded-[2px] animate-pulse" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-[#F4EFE6]">
            <div className="flex items-baseline gap-2">
              <div className="h-5 w-20 bg-[#141E17]/20 rounded-[2px] animate-pulse" />
              <div className="h-3 w-16 bg-[#141E17]/10 rounded-[2px] animate-pulse" />
            </div>
            <div className="h-3.5 w-12 bg-[#9E9088]/20 rounded-[2px] animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 flex-1 bg-[#FAF8F5] border border-[#EAE3D6] rounded-[2px] flex items-center justify-center animate-pulse">
              <div className="h-2.5 w-28 bg-[#141E17]/15 rounded-[2px]" />
            </div>
            <div className="w-10 h-10 flex-shrink-0 rounded-[2px] bg-[#141E17]/15 flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 rounded-[2px] bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SavedLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 pt-32 max-w-[1400px] mx-auto px-6">
      {/* Header & Back Link Skeleton */}
      <div className="mb-10">
        <div className="h-3.5 w-28 bg-[#EAE3D6] rounded-[2px] mb-4 animate-pulse" />
        <div className="h-10 w-72 bg-[#EAE3D6] rounded-[2px] mb-2 animate-pulse" />
        <div className="h-4 w-48 bg-[#EAE3D6]/70 rounded-[2px] animate-pulse" />
      </div>

      {/* 6-Card Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="product-card-wrap h-full flex">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
