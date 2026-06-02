"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Zap, X, ZoomIn } from "lucide-react";

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, next, prev]);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  if (!images.length) return null;

  return (
    <div className="select-none">
      {/* Main image — 1:1 */}
      <div 
        className="group relative aspect-square overflow-hidden rounded-3xl border border-line bg-sky/30 cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Hover zoom-in icon hint */}
        <div className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-ink/40 text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
          <ZoomIn className="h-5 w-5" />
        </div>

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
        <div className="absolute left-4 top-4 z-10 flex gap-2" onClick={(e) => e.stopPropagation()}>
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
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur-sm transition hover:bg-white hover:shadow-soft"
            >
              <ChevronLeft className="h-4 w-4 text-ink" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur-sm transition hover:bg-white hover:shadow-soft"
            >
              <ChevronRight className="h-4 w-4 text-ink" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5" onClick={(e) => e.stopPropagation()}>
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

      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-md"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-8 sm:top-8"
            aria-label="Tutup"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Lightbox Image */}
          <div 
            className="relative h-full max-h-[90vh] w-full max-w-[90vw] sm:max-h-[85vh] sm:max-w-[85vw]"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing lightbox
          >
            <Image
              src={images[active]}
              alt={`Zoomed ${title} ${active + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Prev / Next arrows (Lightbox) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 z-[110] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-8"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 z-[110] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-8"
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 font-secondary text-sm font-medium text-white sm:bottom-8">
            {active + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
