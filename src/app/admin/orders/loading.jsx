import React from "react";

export default function AdminOrdersLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-44 bg-[#E8DDD0] rounded-xl mb-2 animate-pulse" />
          <div className="h-4 w-64 bg-[#E8DDD0]/50 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="rounded-2xl border border-[#ECE6DF] bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="h-10 w-full sm:w-72 rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
        <div className="h-10 w-36 rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
      </div>

      <div className="rounded-2xl border border-[#ECE6DF] bg-white shadow-sm overflow-hidden divide-y divide-[#ECE6DF]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-5 flex items-center justify-between gap-4 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-[#E8DDD0] rounded-md" />
              <div className="h-3 w-48 bg-[#E8DDD0]/60 rounded-full" />
            </div>
            <div className="h-4 w-24 bg-[#E8DDD0]/60 rounded-md" />
            <div className="h-6 w-20 rounded-full bg-amber-100/60" />
            <div className="h-8 w-24 rounded-lg bg-[#FAF7F2] border border-[#ECE6DF]" />
          </div>
        ))}
      </div>
    </div>
  );
}
