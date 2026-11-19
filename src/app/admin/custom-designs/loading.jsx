import React from "react";

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 animate-pulse">
      <div>
        <div className="h-8 w-44 bg-[#E8DDD0] rounded-xl mb-2" />
        <div className="h-4 w-60 bg-[#E8DDD0]/50 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-[#ECE6DF] bg-white space-y-2">
              <div className="h-4 w-32 bg-[#E8DDD0] rounded-md" />
              <div className="h-3 w-48 bg-[#E8DDD0]/50 rounded-full" />
            </div>
          ))}
        </div>
        <div className="md:col-span-2 rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm min-h-[400px]" />
      </div>
    </div>
  );
}
