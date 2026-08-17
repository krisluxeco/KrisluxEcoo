import React from "react";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ─── Profile Header Skeleton ───────────────────────────── */}
      <div className="rounded-3xl border border-[#ECE6DF] bg-white p-6 sm:p-8 mb-10 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#E8DDD0] animate-pulse flex-shrink-0" />
        <div className="space-y-3 flex-1 text-center sm:text-left">
          <div className="h-7 w-48 bg-[#E8DDD0] rounded-xl animate-pulse mx-auto sm:mx-0" />
          <div className="h-4 w-64 bg-[#E8DDD0]/60 rounded-full animate-pulse mx-auto sm:mx-0" />
        </div>
        <div className="h-10 w-32 rounded-full bg-[#E8DDD0]/50 animate-pulse" />
      </div>

      {/* ─── Metrics Cards Skeleton ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-3xl border border-[#ECE6DF] bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-[#E8DDD0]/60 rounded-full" />
              <div className="w-8 h-8 rounded-xl bg-[#E8DDD0]/40" />
            </div>
            <div className="h-8 w-16 bg-[#E8DDD0] rounded-lg" />
          </div>
        ))}
      </div>

      {/* ─── Main Content Tabs & Cards Skeleton ────────────────── */}
      <div className="space-y-6">
        <div className="h-12 w-full sm:w-96 rounded-2xl bg-[#E8DDD0]/50 animate-pulse" />
        <div className="rounded-3xl border border-[#ECE6DF] bg-white p-8 shadow-sm space-y-6">
          <div className="h-6 w-40 bg-[#E8DDD0] rounded-md animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DF] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
