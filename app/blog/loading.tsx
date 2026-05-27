export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-[1068px] animate-pulse px-5 py-20 lg:px-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-line bg-white">
            <div className="h-44 w-full bg-gray-100" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-20 rounded-full bg-gray-100" />
              <div className="h-5 w-full rounded bg-gray-100" />
              <div className="h-5 w-4/5 rounded bg-gray-100" />
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-3/4 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
