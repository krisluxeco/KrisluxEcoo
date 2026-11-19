import React from "react";

export default function Loading() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 animate-pulse">
      <div>
        <div className="h-8 w-44 bg-[#E8DDD0] rounded-xl mb-2" />
        <div className="h-4 w-60 bg-[#E8DDD0]/50 rounded-full" />
      </div>

      <div className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm space-y-4">
        <div className="h-10 w-full rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-[#ECE6DF] bg-[#FAF7F2]/50 flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-[#E8DDD0] rounded-md" />
                <div className="h-3 w-56 bg-[#E8DDD0]/50 rounded-full" />
              </div>
              <div className="h-8 w-20 rounded-lg bg-[#E8DDD0]/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
