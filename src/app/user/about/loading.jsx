export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] animate-pulse">
      {/* Hero Skeleton */}
      <section className="bg-[#0D140F] pt-32 pb-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-6 w-72 bg-white/10 rounded-[2px]" />
          <div className="h-16 w-3/4 max-w-2xl bg-white/15 rounded-[2px]" />
          <div className="h-6 w-full max-w-xl bg-white/10 rounded-[2px]" />
          <div className="h-6 w-2/3 max-w-lg bg-white/10 rounded-[2px]" />

          <div className="flex gap-4 pt-4">
            <div className="h-12 w-48 bg-[#C29B5D]/40 rounded-[2px]" />
            <div className="h-12 w-48 bg-white/10 rounded-[2px]" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-16 border-t border-white/10 mt-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 w-20 bg-[#C29B5D]/30 rounded-[2px]" />
                <div className="h-4 w-28 bg-white/15 rounded-[2px]" />
                <div className="h-3 w-36 bg-white/10 rounded-[2px]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story 2-Col Skeleton */}
      <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-4 w-32 bg-[#EAE3D6] rounded-[2px]" />
            <div className="h-10 w-4/5 bg-[#EAE3D6] rounded-[2px]" />
            <div className="h-4 w-full bg-[#EAE3D6] rounded-[2px]" />
            <div className="h-4 w-full bg-[#EAE3D6] rounded-[2px]" />
            <div className="h-4 w-3/4 bg-[#EAE3D6] rounded-[2px]" />
            <div className="h-28 w-full bg-[#F4EFE6] border border-[#EAE3D6] rounded-[2px]" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-[4/5] bg-white border border-[#EAE3D6] rounded-[2px]" />
            <div className="h-20 bg-white border border-[#EAE3D6] rounded-[2px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
