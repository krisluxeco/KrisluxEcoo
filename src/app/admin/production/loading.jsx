export default function ProductionLoading() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-10 bg-white/5 rounded-xl w-72" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white/5 rounded-xl" />
        ))}
      </div>
      <div className="h-14 bg-white/5 rounded-xl" />
      <div className="h-96 bg-white/5 rounded-xl" />
    </div>
  );
}
