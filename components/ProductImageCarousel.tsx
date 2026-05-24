"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Zap } from "lucide-react";

interface Props {
  images: string[];
  title: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  discountPct?: number | null;
}

export function ProductImageCarousel({
  images,
  title,
  isNew,
  isBestSeller,
  discountPct,
}: Props) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  if (!images.length) return null;

  return (
    <div className="select-none">
      {/* Main image — 1:1 */}
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-sky/30">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-300 ${
              i === active ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={src}
              alt={`Preview ${title} ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
          </div>
        ))}

        {/* Badges */}
        <div className="absolute left-4 top-4 z-10 flex gap-2">
          {isNew && (
            <span className="flex items-center gap-1 rounded-full bg-sheet px-3 py-1 font-secondary text-xs font-bold text-ink">
              <Zap className="h-3 w-3" />
              Baru
            </span>
          )}
          {isBestSeller && (
            <span className="flex items-center gap-1 rounded-full bg-cobalt px-3 py-1 font-secondary text-xs font-bold text-white">
              <Star className="h-3 w-3" />
              Terlaris
            </span>
          )}
          {discountPct && (
            <span className="rounded-full bg-ink px-3 py-1 font-secondary text-xs font-bold text-white">
              Hemat {discountPct}%
            </span>
          )}
        </div>

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur-sm transition hover:bg-white hover:shadow-soft"
            >
              <ChevronLeft className="h-4 w-4 text-ink" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur-sm transition hover:bg-white hover:shadow-soft"
            >
              <ChevronRight className="h-4 w-4 text-ink" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-5 bg-ink" : "w-1.5 bg-ink/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip — 1:1 */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Pilih foto ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-sky/20 transition duration-200 ${
                i === active
                  ? "border-ink shadow-soft"
                  : "border-line hover:border-ink/40"
              }`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${title} ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
