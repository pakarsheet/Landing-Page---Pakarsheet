import Image from "next/image";
import Link from "next/link";
import { Check, LayoutDashboard, Star, Zap } from "lucide-react";
import type { ClientProduct } from "@/lib/types";

type TemplateCardProps = {
  template: ClientProduct;
};

export function TemplateCard({ template }: TemplateCardProps) {
  const {
    slug,
    title,
    description,
    badge,
    price,
    originalPrice,
    accent,
    features,
    previewImages,
    isNew,
    isBestSeller,
  } = template;

  return (
    <article className="shop-card group flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">

      {/* ── Image — 1:1 ─────────────────────────────────────── */}
      <Link href={`/shop/${slug}`} className="relative block aspect-square overflow-hidden">
        {previewImages[0] ? (
          <Image
            src={previewImages[0]}
            alt={`Preview ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${accent}`}>
            <LayoutDashboard className="h-16 w-16 opacity-30" />
          </div>
        )}

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-3 py-1 font-secondary text-xs font-bold text-ink backdrop-blur-sm shadow-card">
            {badge}
          </span>
          {isNew && (
            <span className="flex items-center gap-1 rounded-full bg-sheet px-3 py-1 font-secondary text-xs font-bold text-ink shadow-card">
              <Zap className="h-3 w-3" />
              Baru
            </span>
          )}
          {isBestSeller && (
            <span className="flex items-center gap-1 rounded-full bg-cobalt px-3 py-1 font-secondary text-xs font-bold text-white shadow-card">
              <Star className="h-3 w-3" />
              Terlaris
            </span>
          )}
        </div>

        {/* Top-right discount badge */}
        {originalPrice && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 font-secondary text-xs font-bold text-white shadow-card">
            Diskon
          </span>
        )}
      </Link>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">

        {/* Title */}
        <Link href={`/shop/${slug}`}>
          <h3 className="font-primary text-[20px] font-semibold leading-[1.25] tracking-[-0.4px] text-ink transition duration-300 hover:text-cobalt">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 font-secondary text-sm leading-[1.56] text-muted line-clamp-2">
          {description}
        </p>

        {/* Feature checklist — 3 items max */}
        <ul className="mt-4 space-y-2">
          {features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-2.5 font-secondary text-sm font-medium text-ink">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf text-cobalt">
                <Check className="h-3 w-3" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="mt-5 border-t border-line" />

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <strong className="font-primary text-[26px] font-semibold leading-none tracking-[-1px] text-ink">
                {price}
              </strong>
              {originalPrice && (
                <span className="font-secondary text-sm text-muted line-through">
                  {originalPrice}
                </span>
              )}
            </div>
            <span className="mt-0.5 block font-secondary text-xs text-muted">sekali bayar</span>
          </div>

          <Link
            href={`/shop/${slug}`}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-ink px-6 font-secondary text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt"
          >
            Detail
          </Link>
        </div>
      </div>

    </article>
  );
}
