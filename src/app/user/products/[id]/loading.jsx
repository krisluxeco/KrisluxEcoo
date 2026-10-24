import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white text-[#141E17] pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2 mb-10 pb-4 border-b border-[#EAE3D6]/60">
        <div className="h-3 w-12 bg-[#EAE3D6] rounded-full animate-pulse" />
        <span className="text-[#EAE3D6]">/</span>
        <div className="h-3 w-16 bg-[#EAE3D6] rounded-full animate-pulse" />
        <span className="text-[#EAE3D6]">/</span>
        <div className="h-3 w-32 bg-[#EAE3D6] rounded-full animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Gallery Skeleton */}
        <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-hidden md:w-20 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 md:w-full h-20 md:h-24 rounded-lg bg-[#F4EFE6] animate-pulse" />
            ))}
          </div>

          <div className="relative aspect-square w-full bg-[#F4EFE6] rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>

        {/* Right Column: Details & Pricing Skeleton */}
        <div className="lg:col-span-6 flex flex-col space-y-6 lg:pl-6">
          <div className="space-y-3">
            <div className="h-3.5 w-24 bg-[#EAE3D6] rounded-full animate-pulse" />
            <div className="h-10 w-3/4 bg-[#EAE3D6] rounded-xl animate-pulse" />
            <div className="h-4 w-1/2 bg-[#EAE3D6]/70 rounded-full animate-pulse" />
          </div>

          {/* Price & MOQ Skeleton */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EAE3D6] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-8 w-44 bg-[#EAE3D6] rounded-md animate-pulse" />
              <div className="h-5 w-24 bg-[#759E81]/20 rounded-md animate-pulse" />
            </div>
            <div className="h-4 w-40 bg-[#EAE3D6]/70 rounded-full animate-pulse" />
          </div>

          {/* Volume Tier Matrix Skeleton */}
          <div className="grid grid-cols-3 gap-2.5">
            {[1, 2, 3].map((t) => (
              <div key={t} className="p-3 bg-white border border-[#EAE3D6] rounded-lg space-y-2">
                <div className="h-3 w-16 bg-[#EAE3D6]/60 rounded-full animate-pulse mx-auto" />
                <div className="h-5 w-20 bg-[#EAE3D6] rounded-md animate-pulse mx-auto" />
                <div className="h-2.5 w-12 bg-[#EAE3D6]/50 rounded-full animate-pulse mx-auto" />
              </div>
            ))}
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-3 pt-3">
            <div className="flex-[2] h-14 bg-[#141E17]/10 rounded-xl animate-pulse" />
            <div className="flex-1 h-14 bg-[#EAE3D6]/60 rounded-xl animate-pulse" />
            <div className="w-14 h-14 bg-[#EAE3D6]/50 rounded-xl animate-pulse shrink-0" />
          </div>

          {/* Accordion Skeletons */}
          <div className="space-y-4 pt-6 border-t border-[#EAE3D6]">
            {[1, 2, 3].map((acc) => (
              <div key={acc} className="flex items-center justify-between py-3 border-b border-[#EAE3D6]/60">
                <div className="h-4 w-32 bg-[#EAE3D6] rounded-full animate-pulse" />
                <div className="h-4 w-4 bg-[#EAE3D6] rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
