'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-ink">Terjadi Kesalahan</h2>
      <p className="mb-8 text-muted">Maaf, ada sesuatu yang salah. Silakan coba lagi.</p>
      <button
        onClick={() => reset()}
        className="rounded-[10px] bg-cobalt px-6 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Coba Lagi
      </button>
    </div>
  )
}
