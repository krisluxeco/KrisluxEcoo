import React from "react";

export default function QuoteCartLoading() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 max-w-[1400px] mx-auto text-[#141E17]">
      {/* Title Skeleton */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="h-3 w-28 bg-[#EAE3D6] rounded-full mb-3 animate-pulse" />
        <div className="h-10 w-72 bg-[#EAE3D6] rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Cart Items Skeleton */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="h-6 w-48 bg-[#EAE3D6] rounded-md animate-pulse mb-8" />
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-6 border-b border-[#EAE3D6] pb-6">
              <div className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl bg-[#F4EFE6] shrink-0 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-3 w-20 bg-[#EAE3D6] rounded-full animate-pulse" />
                <div className="h-5 w-3/4 bg-[#EAE3D6] rounded-md animate-pulse" />
                <div className="h-4 w-32 bg-[#EAE3D6]/70 rounded-md animate-pulse" />
                <div className="h-8 w-24 bg-[#EAE3D6]/50 rounded-lg animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Checkout Card Skeleton */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#FAF8F5] p-8 rounded-2xl border border-[#EAE3D6] space-y-5">
          <div className="h-6 w-56 bg-[#EAE3D6] rounded-md animate-pulse mb-6" />
          <div className="h-10 w-full bg-[#EAE3D6]/60 rounded-lg animate-pulse" />
          <div className="h-10 w-full bg-[#EAE3D6]/60 rounded-lg animate-pulse" />
          <div className="h-10 w-full bg-[#EAE3D6]/60 rounded-lg animate-pulse" />
          <div className="h-20 w-full bg-[#EAE3D6]/40 rounded-lg animate-pulse" />
          <div className="h-14 w-full bg-[#141E17]/20 rounded-xl animate-pulse mt-6" />
        </div>
      </div>
    </div>
  );
}
