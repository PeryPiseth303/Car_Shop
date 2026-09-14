export default function Loading() {
  return (
    <div className="container py-14">
      <div className="mb-10 space-y-3">
        <div className="h-4 w-32 animate-pulse rounded-full bg-neutral-200/80" />
        <div className="h-10 w-72 animate-pulse rounded-2xl bg-neutral-200/70" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs"
          >
            <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-neutral-200/80" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-20 animate-pulse rounded-full bg-neutral-200/80" />
              <div className="h-5 w-44 animate-pulse rounded-lg bg-neutral-200/90" />
              <div className="h-6 w-28 animate-pulse rounded-lg bg-neutral-200/90" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-8 animate-pulse rounded-lg bg-neutral-100" />
              <div className="h-8 animate-pulse rounded-lg bg-neutral-100" />
              <div className="h-8 animate-pulse rounded-lg bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
