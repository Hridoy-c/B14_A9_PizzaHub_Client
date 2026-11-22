const DashboardLoading = () => (
  <div aria-busy="true" className="flex flex-col gap-6">
    <div className="h-10 w-56 animate-pulse rounded-full bg-[#EADBC8]" />
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl border border-[#EADBC8] bg-[#FBF6EF]" />
      ))}
    </div>
    <div className="h-64 animate-pulse rounded-2xl border border-[#EADBC8] bg-[#FBF6EF]" />
  </div>
);

export default DashboardLoading;