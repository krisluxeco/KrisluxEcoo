import React from "react";

export default function AdminProductsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top action bar skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-8 w-40 bg-[#E8DDD0] rounded-xl mb-2 animate-pulse" />
          <div className="h-4 w-60 bg-[#E8DDD0]/50 rounded-full animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-full bg-[#4A6741]/20 animate-pulse" />
      </div>

      {/* Search and filter bar skeleton */}
      <div className="rounded-2xl border border-[#ECE6DF] bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="h-10 w-full sm:w-72 rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-10 w-32 rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
          <div className="h-10 w-32 rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
        </div>
      </div>

      {/* Table Rows Skeleton */}
      <div className="rounded-2xl border border-[#ECE6DF] bg-white shadow-sm overflow-hidden divide-y divide-[#ECE6DF]">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#E8DDD0]/50" />
              <div className="space-y-2">
                <div className="h-4 w-44 bg-[#E8DDD0] rounded-md" />
                <div className="h-3 w-28 bg-[#E8DDD0]/60 rounded-full" />
              </div>
            </div>
            <div className="hidden sm:block h-4 w-20 bg-[#E8DDD0]/60 rounded-md" />
            <div className="hidden sm:block h-4 w-16 bg-[#E8DDD0]/60 rounded-md" />
            <div className="h-8 w-20 rounded-lg bg-[#FAF7F2] border border-[#ECE6DF]" />
          </div>
        ))}
      </div>
    </div>
  );
}
