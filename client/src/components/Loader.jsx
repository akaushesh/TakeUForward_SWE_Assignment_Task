// Auth loader — shown during the initial authentication check in App.jsx
export default function Loader() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6">
      {/* Skeleton shimmer of the calendar card */}
      <div className="w-full max-w-[1000px] mx-auto px-4">
        {/* Hero skeleton */}
        <div className="skeleton-bone rounded-xl h-[140px] md:h-[180px] w-full mb-4" />
        {/* Grid + notes row */}
        <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8 skeleton-bone rounded-xl h-[420px]" />
          <div className="xl:col-span-4 flex flex-col gap-3">
            <div className="skeleton-bone rounded-xl h-[240px]" />
            <div className="skeleton-bone rounded-xl h-[160px]" />
          </div>
        </div>
      </div>
      {/* Subtle label */}
      <p className="text-on-surface-variant/40 text-xs tracking-widest uppercase font-medium">
        Loading…
      </p>
    </div>
  );
}
