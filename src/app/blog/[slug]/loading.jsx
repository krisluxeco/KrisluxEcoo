import React from "react";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back Link Skeleton */}
      <div className="h-4 w-28 bg-[#E8DDD0] rounded-full mb-8 animate-pulse" />

      {/* Article Title & Metadata Skeleton */}
      <div className="space-y-4 mb-10">
        <div className="h-4 w-24 bg-[#4A6741]/20 rounded-full animate-pulse" />
        <div className="h-10 sm:h-14 w-full bg-[#E8DDD0] rounded-2xl animate-pulse" />
        <div className="h-4 w-48 bg-[#E8DDD0]/60 rounded-full animate-pulse" />
      </div>

      {/* Cover Image Skeleton */}
      <div className="aspect-[16/9] rounded-3xl bg-[#E8DDD0]/50 mb-12 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Article Body Paragraphs Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-full bg-[#E8DDD0]/60 rounded-full" />
        <div className="h-4 w-11/12 bg-[#E8DDD0]/60 rounded-full" />
        <div className="h-4 w-4/5 bg-[#E8DDD0]/60 rounded-full" />
        <div className="h-8 w-1/3 bg-[#E8DDD0] rounded-lg my-6" />
        <div className="h-4 w-full bg-[#E8DDD0]/60 rounded-full" />
        <div className="h-4 w-5/6 bg-[#E8DDD0]/60 rounded-full" />
      </div>
    </div>
  );
}
