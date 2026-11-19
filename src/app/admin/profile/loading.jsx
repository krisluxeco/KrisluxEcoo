import React from "react";

export default function Loading() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 animate-pulse">
      <div>
        <div className="h-8 w-44 bg-[#E8DDD0] rounded-xl mb-2" />
        <div className="h-4 w-60 bg-[#E8DDD0]/50 rounded-full" />
      </div>

      <div className="rounded-2xl border border-[#ECE6DF] bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border border-[#ECE6DF]" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-[#E8DDD0] rounded-md" />
            <div className="h-4 w-52 bg-[#E8DDD0]/50 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#ECE6DF]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3.5 w-24 bg-[#E8DDD0]/60 rounded-full" />
              <div className="h-10 w-full rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
