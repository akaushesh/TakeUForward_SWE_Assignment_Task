function Bone({ className = "" }) {
  return <div className={`skeleton-bone rounded-lg ${className}`} />;
}

function HeroSkeleton() {
  return (
    <div className="skeleton-bone rounded-xl h-[140px] md:h-[180px] xl:h-[220px] w-full relative overflow-hidden">
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 space-y-2">
        <Bone className="h-10 w-16 md:h-14 md:w-20" />
        <Bone className="h-4 w-32 md:h-5 md:w-40" />
      </div>
      <div className="absolute top-3 right-3 flex gap-2">
        <Bone className="h-6 w-20 rounded-full" />
        <Bone className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

function CalendarGridSkeleton() {
  const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return (
    <div className="bg-surface-container-low rounded-xl p-4 md:p-6 flex flex-col h-full border border-outline-variant/15">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center gap-3 md:gap-5">
          <Bone className="h-9 w-9 rounded-full" />
          <div className="text-center space-y-1.5 min-w-[140px]">
            <Bone className="h-6 w-24 mx-auto" />
            <Bone className="h-3 w-12 mx-auto" />
          </div>
          <Bone className="h-9 w-9 rounded-full" />
        </div>
        <Bone className="h-4 w-20 hidden sm:block" />
      </div>

      <div className="grid grid-cols-7 mb-2 border-b border-outline-variant/20 pb-2">
        {DAY_LABELS.map((d) => (
          <Bone key={d} className="h-3 w-6 mx-auto" />
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 flex-1">
        {Array.from({ length: 42 }).map((_, i) => (
          <Bone key={i} className="h-10 md:h-11 mx-0.5" />
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-outline-variant/15 flex flex-wrap gap-x-2 gap-y-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bone key={i} className="h-5 w-14 rounded-full" />
        ))}
      </div>
    </div>
  );
}

function NotesPanelSkeleton() {
  return (
    <div className="flex flex-col gap-3 md:gap-4 h-full">
      <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 h-[240px] shrink-0 border border-outline-variant/15">
        <div className="flex items-center justify-between shrink-0">
          <div className="space-y-1.5">
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-28" />
          </div>
          <Bone className="h-7 w-7 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bone key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
        <Bone className="flex-1 rounded-lg" />
      </div>

      <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 h-[300px] shrink-0 border border-outline-variant/15">
        <div className="flex items-center border-b border-outline-variant/20 pb-2 shrink-0">
          <Bone className="h-5 w-28" />
        </div>
        <div className="space-y-2 flex-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 pl-2 border-l-2 border-outline-variant/20">
              <Bone className="h-3 w-8 shrink-0" />
              <Bone className="h-3 w-16 rounded-full" />
              <Bone className={`h-3 flex-1 ${i % 3 === 2 ? "w-1/2" : ""}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CalendarSkeleton() {
  return (
    <div className="bg-surface text-on-surface rounded-3xl relative overflow-hidden border border-outline-variant/30 max-w-[1000px] mx-auto">
      <div className="p-4 md:p-6 space-y-4 w-full">
        <HeroSkeleton />
        <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4 xl:items-stretch">
          <div className="xl:col-span-8">
            <CalendarGridSkeleton />
          </div>
          <div className="xl:col-span-4">
            <NotesPanelSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
