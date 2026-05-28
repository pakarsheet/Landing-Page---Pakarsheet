"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";

interface MobileStickyCTAProps {
  price: string;
  originalPrice?: string | null;
  discountPct?: number | null;
  ctaUrl: string;
  contactUrl: string;
}

export function MobileStickyCTA({
  price,
  originalPrice,
  discountPct,
  ctaUrl,
  contactUrl,
}: MobileStickyCTAProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel */}
      <div ref={sentinelRef} aria-hidden="true" className="h-0 w-full" />

      {/* Sticky bar */}
      <div
        aria-hidden={!visible}
        className={[
          "lg:hidden",
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-white px-5 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)]",
          "border-t border-line shadow-[0_-8px_32px_rgba(0,0,0,0.10)]",
          "transition-transform duration-300 ease-out",
          visible ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        {/* Single row: price left — buttons right */}
        <div className="flex items-center gap-3">

          {/* Price block */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              <span className="font-primary text-[22px] font-semibold leading-none tracking-[-0.8px] text-ink">
                {price}
              </span>
              {originalPrice && (
                <span className="font-secondary text-sm leading-none text-muted line-through">
                  {originalPrice}
                </span>
              )}
            </div>
            {discountPct && discountPct > 0 ? (
              <span className="w-fit rounded-full bg-[#b8ff4f] px-2 py-0.5 font-secondary text-[11px] font-bold leading-none text-ink">
                Hemat {discountPct}%
              </span>
            ) : (
              <span className="font-secondary text-xs text-muted">Sekali bayar, akses selamanya</span>
            )}
          </div>

          {/* WhatsApp button */}
          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tanya dulu via WhatsApp"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink"
          >
            <MessageCircle className="h-5 w-5" />
          </a>

          {/* Buy button */}
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-full bg-ink px-5 font-secondary text-sm font-semibold text-white transition-colors duration-300 hover:bg-cobalt"
          >
            Beli Sekarang
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </>
  );
}
