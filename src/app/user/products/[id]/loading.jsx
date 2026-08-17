import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-3 w-16 bg-[#E8DDD0] rounded-full animate-pulse" />
        <span className="text-[#E8DDD0]">/</span>
        <div className="h-3 w-20 bg-[#E8DDD0] rounded-full animate-pulse" />
        <span className="text-[#E8DDD0]">/</span>
        <div className="h-3 w-32 bg-[#E8DDD0]/60 rounded-full animate-pulse" />
      </div>

      {/* Main 2-Column Detail Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
        {/* Left: Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-[4/3] rounded-3xl bg-white border border-[#ECE6DF] p-4 shadow-sm overflow-hidden flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-[#E8DDD0]/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 rounded-2xl bg-white border border-[#ECE6DF] p-2 flex-shrink-0">
                <div className="w-full h-full rounded-xl bg-[#E8DDD0]/40 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Specifications & Actions Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="h-4 w-28 bg-[#4A6741]/15 rounded-full mb-3 animate-pulse" />
            <div className="h-8 sm:h-10 w-4/5 bg-[#E8DDD0] rounded-xl mb-3 animate-pulse" />
            <div className="h-4 w-40 bg-[#C8A97A]/20 rounded-full mb-4 animate-pulse" />
            <div className="h-8 w-32 bg-[#E8DDD0] rounded-lg animate-pulse" />
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#ECE6DF] space-y-3 shadow-sm">
            <div className="h-3.5 w-3/4 bg-[#E8DDD0]/60 rounded-full animate-pulse" />
            <div className="h-3.5 w-full bg-[#E8DDD0]/40 rounded-full animate-pulse" />
            <div className="h-3.5 w-5/6 bg-[#E8DDD0]/40 rounded-full animate-pulse" />
          </div>

          {/* MOQ / Quantity Selector */}
          <div className="space-y-3 pt-2">
            <div className="h-3 w-24 bg-[#E8DDD0] rounded-full animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-2xl bg-white border border-[#ECE6DF] animate-pulse" />
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-4">
            <div className="h-14 flex-1 rounded-full bg-[#4A6741]/20 animate-pulse" />
            <div className="h-14 w-14 rounded-full bg-white border border-[#ECE6DF] animate-pulse flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Similar Creations Skeleton */}
      <div className="pt-12 border-t border-[#ECE6DF]">
        <div className="h-6 w-48 bg-[#E8DDD0] rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-3xl border border-[#ECE6DF] bg-white p-4 shadow-sm space-y-3">
              <div className="aspect-square rounded-2xl bg-[#E8DDD0]/40 animate-pulse" />
              <div className="h-4 w-3/4 bg-[#E8DDD0] rounded-md" />
              <div className="h-4 w-1/3 bg-[#E8DDD0]/60 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
