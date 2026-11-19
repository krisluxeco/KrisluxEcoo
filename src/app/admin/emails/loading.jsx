import React from "react";

export default function EmailsLoading() {
  return (
    <div className="h-[calc(100vh-120px)] w-full flex bg-white rounded-2xl shadow-sm border border-[#E8DDD0] overflow-hidden animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="w-56 bg-[#FAF7F2] border-r border-[#E8DDD0] p-4 flex flex-col gap-4">
        <div className="h-10 w-full rounded-xl bg-[#E8DDD0]" />
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-full rounded-xl bg-[#E8DDD0]/40" />
          ))}
        </div>
      </div>

      {/* List Skeleton */}
      <div className="w-96 border-r border-[#E8DDD0] p-4 flex flex-col gap-3">
        <div className="h-10 w-full rounded-xl bg-[#FAF7F2] border border-[#E8DDD0]" />
        <div className="space-y-3 pt-2 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3 rounded-xl border border-[#ECE6DF] space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-28 bg-[#E8DDD0] rounded-md" />
                <div className="h-3 w-12 bg-[#E8DDD0]/50 rounded-full" />
              </div>
              <div className="h-3 w-3/4 bg-[#E8DDD0]/70 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8DDD0] mb-4" />
        <div className="h-5 w-44 bg-[#E8DDD0] rounded-md mb-2" />
        <div className="h-3 w-64 bg-[#E8DDD0]/50 rounded-full" />
      </div>
    </div>
  );
}
