export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-1.5 animate-bounce rounded-full bg-cobalt [animation-delay:-0.3s]"></div>
          <div className="h-6 w-1.5 animate-bounce rounded-full bg-cobalt [animation-delay:-0.15s]"></div>
          <div className="h-6 w-1.5 animate-bounce rounded-full bg-cobalt"></div>
        </div>
        <p className="animate-pulse text-sm font-semibold tracking-wide text-muted">Memuat halaman...</p>
      </div>
    </div>
  )
}
