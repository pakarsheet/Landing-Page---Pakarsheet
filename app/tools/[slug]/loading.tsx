/**
 * Skeleton loading state for /tools/[slug]
 * Shown while the page is streaming / navigating.
 */
export default function ToolLoading() {
  return (
    <div className="animate-pulse bg-white">
      {/* Hero panel skeleton */}
      <div className="px-3 pb-0 pt-3 sm:px-5 sm:pt-5 lg:px-10">
        <div className="mx-auto h-[320px] max-w-[1380px] rounded-[20px] bg-sky/60 sm:rounded-[32px] sm:h-[380px]" />
      </div>

      {/* Calculator skeleton */}
      <div className="mx-auto max-w-[1068px] px-5 py-12 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Input panel */}
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <div className="mb-5 h-6 w-40 rounded-full bg-line" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="mb-1.5 h-4 w-32 rounded-full bg-line" />
                  <div className="h-12 rounded-2xl bg-line" />
                </div>
              ))}
            </div>
          </div>

          {/* Result panel */}
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
              <div className="h-4 w-24 rounded-full bg-line" />
              <div className="mt-3 h-10 w-48 rounded-full bg-line" />
              <div className="mt-4 h-2 w-full rounded-full bg-line" />
              <div className="mt-3 h-7 w-32 rounded-full bg-line" />
            </div>
            <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-4 flex justify-between last:mb-0">
                  <div className="h-4 w-28 rounded-full bg-line" />
                  <div className="h-4 w-20 rounded-full bg-line" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
