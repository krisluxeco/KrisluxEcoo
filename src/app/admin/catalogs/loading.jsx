import React from "react";

export default function AdminCatalogsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-[#E8DDD0] rounded-xl mb-2 animate-pulse" />
          <div className="h-4 w-60 bg-[#E8DDD0]/50 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#ECE6DF] bg-white p-4 shadow-sm flex gap-4">
        <div className="h-10 flex-1 rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
        <div className="h-10 w-32 rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
      </div>

      <div className="rounded-2xl border border-[#ECE6DF] bg-white shadow-sm overflow-hidden divide-y divide-[#ECE6DF]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 flex items-center justify-between gap-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-[#E8DDD0] rounded-md" />
              <div className="h-3 w-56 bg-[#E8DDD0]/60 rounded-full" />
            </div>
            <div className="h-4 w-28 bg-[#E8DDD0]/60 rounded-md" />
            <div className="h-8 w-20 rounded-lg bg-[#FAF7F2] border border-[#ECE6DF]" />
          </div>
        ))}
      </div>
    </div>
  );
}
