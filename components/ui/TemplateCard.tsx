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
    ctaUrl,
  } = template;

  return (
    <article className="shop-card group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">

      {/* Preview image — 1:1 square */}
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

        {/* Badges — pill pattern from design system */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-3 py-1 font-secondary text-xs font-bold text-ink backdrop-blur-sm">
            {badge}
          </span>
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
        </div>

        {/* Discount badge */}
        {originalPrice && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 font-secondary text-xs font-bold text-white">
            Diskon
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Title — h3 scale from design system */}
        <Link href={`/shop/${slug}`} className="group/title">
          <h3 className="font-primary text-2xl font-semibold leading-[1.25] tracking-[-0.6px] text-ink transition duration-300 group-hover/title:text-cobalt">
            {title}
          </h3>
        </Link>

        <p className="mt-3 font-secondary text-base leading-[1.56] text-muted line-clamp-2">
          {description}
        </p>

        {/* Feature checklist — 3 items max */}
        <ul className="mt-5 space-y-2">
          {features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-2.5 font-secondary text-sm font-medium text-ink">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf text-cobalt">
                <Check className="h-3 w-3" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="mt-6 border-t border-line" />

        {/* Price + CTA */}
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <strong className="font-primary text-[28px] font-semibold leading-none tracking-[-1px] text-ink">
                {price}
              </strong>
              {originalPrice && (
                <span className="font-secondary text-sm text-muted line-through">{originalPrice}</span>
              )}
            </div>
            <span className="mt-1 block font-secondary text-xs text-muted">sekali bayar</span>
          </div>

          <Link
            href={`/shop/${slug}`}
            className="group/cta inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-ink px-5 font-secondary text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt"
          >
            <span className="relative block overflow-hidden">
              <span className="block transition duration-300 group-hover/cta:-translate-y-full">Detail</span>
              <span className="absolute left-0 top-full block transition duration-300 group-hover/cta:-translate-y-full">Detail</span>
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
