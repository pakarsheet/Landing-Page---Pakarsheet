"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Store } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { type ShopTemplate, type ShopCategory } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { site } from "@/lib/site";
import { Button } from "./ui/Button";
import { FilterBar } from "./FilterBar";
import { TemplateCard } from "./ui/TemplateCard";

gsap.registerPlugin(ScrollTrigger);

type SortOption = "terbaru" | "terpopuler" | "harga-asc" | "harga-desc";

type Props = {
  templates: ShopTemplate[];
};

export function TemplateGrid({ templates }: Props) {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("Semua");
  const [activeSort, setActiveSort] = useState<SortOption>("terbaru");
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const filtered = useMemo(() => {
    let list = [...templates];

    if (activeCategory !== "Semua") {
      list = list.filter((t) => t.category === activeCategory);
    }

    switch (activeSort) {
      case "harga-asc":
        list.sort((a, b) => a.priceRaw - b.priceRaw);
        break;
      case "harga-desc":
        list.sort((a, b) => b.priceRaw - a.priceRaw);
        break;
      case "terpopuler":
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case "terbaru":
      default:
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return list;
  }, [activeCategory, activeSort]);

  // Stagger animate cards on filter change — same pattern as Features section
  useLayoutEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".shop-card");
    if (!cards.length) return;

    // Kill any running tweens on these elements first
    gsap.killTweensOf(cards);

    // Make sure cards are visible before animating (avoid flash of invisible)
    gsap.set(cards, { autoAlpha: 1, y: 0 });

    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 32 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
      }
    );
  }, [filtered, prefersReducedMotion]);

  return (
    // Section pattern from design system
    <section id="templates" className="bg-white px-5 py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">
        <FilterBar
          activeCategory={activeCategory}
          activeSort={activeSort}
          onCategoryChange={setActiveCategory}
          onSortChange={setActiveSort}
          resultCount={filtered.length}
        />

        <div ref={gridRef} className="mt-10">
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((template) => (
                <TemplateCard key={template.slug} template={template} />
              ))}
            </div>
          ) : (
            // Empty state — same rounded panel pattern
            <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-sky/30 py-24 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky text-cobalt">
                <Store className="h-7 w-7" />
              </span>
              <p className="mt-5 font-primary text-2xl font-semibold leading-[1.25] tracking-[-0.6px] text-ink">
                Belum ada template di kategori ini.
              </p>
              <p className="mt-3 font-secondary text-base leading-[1.56] text-muted">
                Mau template spesifik? Konsultasikan kebutuhan kamu.
              </p>
              <div className="mt-7">
                <Button href={site.contactUrl} size="md">
                  Konsultasi Kebutuhan
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
