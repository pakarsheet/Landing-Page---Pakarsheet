export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-[760px] animate-pulse px-5 py-20 lg:px-6">
      <div className="mb-6 h-4 w-32 rounded-full bg-gray-100" />
      <div className="flex gap-3">
        <div className="h-6 w-24 rounded-full bg-gray-100" />
        <div className="h-6 w-20 rounded-full bg-gray-100" />
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-8 w-full rounded-xl bg-gray-100" />
        <div className="h-8 w-4/5 rounded-xl bg-gray-100" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-4 w-3/4 rounded bg-gray-100" />
      </div>
      <div className="mt-8 h-64 w-full rounded-2xl bg-gray-100" />
      <div className="mt-8 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
