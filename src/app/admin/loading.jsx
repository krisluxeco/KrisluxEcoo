import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="w-full relative pb-20 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="h-8 w-48 bg-[#E8DDD0] rounded-xl mb-2 animate-pulse" />
          <div className="h-4 w-56 bg-[#E8DDD0]/50 rounded-full animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-full bg-white border border-[#E8DDD0] animate-pulse" />
      </div>

      {/* 3 Earnings Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-[#ECE6DF] bg-white p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-20 bg-[#E8DDD0]/60 rounded-full" />
              <div className="w-5 h-5 rounded-md bg-[#E8DDD0]/40" />
            </div>
            <div className="h-7 w-28 bg-[#E8DDD0] rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Big Dark Highlight Card Skeleton */}
      <div className="rounded-2xl bg-[#1C1C1A] p-6 sm:p-8 mb-6 shadow-lg space-y-3 relative overflow-hidden">
        <div className="h-4 w-32 bg-white/20 rounded-full" />
        <div className="h-10 w-48 bg-white/30 rounded-xl animate-pulse" />
        <div className="h-3 w-28 bg-white/10 rounded-full" />
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#4A6741]/20 blur-2xl" />
      </div>

      {/* 4 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-[#ECE6DF] bg-white p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 bg-[#E8DDD0]/60 rounded-full" />
              <div className="w-8 h-8 rounded-lg bg-[#4A6741]/10" />
            </div>
            <div className="h-8 w-16 bg-[#E8DDD0] rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton (Orders + Traffic Sources) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm space-y-4">
          <div className="h-5 w-36 bg-[#E8DDD0] rounded-md" />
          <div className="h-[240px] w-full rounded-xl bg-[#FAF7F2] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
        <div className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm space-y-4">
          <div className="h-5 w-32 bg-[#E8DDD0] rounded-md" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-50 border border-[#ECE6DF] animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* 4 Traffic Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-[#ECE6DF] bg-white p-5 shadow-sm space-y-3">
            <div className="h-3 w-20 bg-[#E8DDD0]/60 rounded-full" />
            <div className="h-7 w-20 bg-[#E8DDD0] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Website Traffic AreaChart Skeleton */}
      <div className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 w-44 bg-[#E8DDD0] rounded-md" />
          <div className="h-8 w-24 rounded-xl bg-[#C8A97A]/15" />
        </div>
        <div className="h-[280px] w-full rounded-xl bg-[#FAF7F2] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>
    </div>
  );
}
