import React from "react";

export default function SocialHubLoading() {
  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20 space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-44 bg-[#E8DDD0] rounded-xl mb-2" />
        <div className="h-4 w-72 bg-[#E8DDD0]/50 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#ECE6DF]" />
                <div className="space-y-2">
                  <div className="h-5 w-36 bg-[#E8DDD0] rounded-md" />
                  <div className="h-3 w-48 bg-[#E8DDD0]/50 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="p-4 rounded-xl border border-[#ECE6DF] bg-[#FAF7F2] space-y-2">
                    <div className="h-3 w-16 bg-[#E8DDD0]/60 rounded-full" />
                    <div className="h-6 w-20 bg-[#E8DDD0] rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#ECE6DF] bg-white p-6 shadow-sm space-y-4">
          <div className="h-5 w-40 bg-[#E8DDD0] rounded-md" />
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4].map((k) => (
              <div key={k} className="p-4 rounded-xl border border-[#ECE6DF] bg-[#FAF7F2] space-y-2">
                <div className="h-3 w-20 bg-[#E8DDD0]/60 rounded-full" />
                <div className="h-4 w-full bg-[#E8DDD0]/80 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
