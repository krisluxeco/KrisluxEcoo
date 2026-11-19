import React from "react";

export default function LeadsLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 animate-pulse">
      <div>
        <div className="h-8 w-44 bg-[#E8DDD0] rounded-xl mb-2" />
        <div className="h-4 w-60 bg-[#E8DDD0]/50 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-[#ECE6DF] bg-white p-5 shadow-sm space-y-3">
            <div className="h-3.5 w-20 bg-[#E8DDD0]/60 rounded-full" />
            <div className="h-7 w-24 bg-[#E8DDD0] rounded-lg" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#ECE6DF] bg-white shadow-sm overflow-hidden divide-y divide-[#ECE6DF]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-[#E8DDD0] rounded-md" />
              <div className="h-3 w-64 bg-[#E8DDD0]/50 rounded-full" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-[#FAF7F2] border border-[#ECE6DF]" />
          </div>
        ))}
      </div>
    </div>
  );
}
