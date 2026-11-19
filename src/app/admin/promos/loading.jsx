import React from "react";

export default function Loading() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-44 bg-[#E8DDD0] rounded-xl mb-2" />
          <div className="h-4 w-60 bg-[#E8DDD0]/50 rounded-full" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-[#E8DDD0]" />
      </div>

      <div className="rounded-2xl border border-[#ECE6DF] bg-white shadow-sm overflow-hidden divide-y divide-[#ECE6DF]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-[#E8DDD0] rounded-md" />
              <div className="h-3 w-40 bg-[#E8DDD0]/50 rounded-full" />
            </div>
            <div className="h-8 w-16 rounded-lg bg-[#FAF7F2] border border-[#ECE6DF]" />
          </div>
        ))}
      </div>
    </div>
  );
}
