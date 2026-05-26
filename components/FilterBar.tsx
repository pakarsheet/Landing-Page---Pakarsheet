"use client";

import { ChevronDown } from "lucide-react";
import { shopCategories, type ShopCategory } from "@/lib/types";

type SortOption = "terbaru" | "terpopuler" | "harga-asc" | "harga-desc";

type FilterBarProps = {
  activeCategory: ShopCategory;
  activeSort: SortOption;
  onCategoryChange: (cat: ShopCategory) => void;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
};

const sortLabels: Record<SortOption, string> = {
  terbaru: "Terbaru",
  terpopuler: "Terpopuler",
  "harga-asc": "Harga: Rendah → Tinggi",
  "harga-desc": "Harga: Tinggi → Rendah",
};

export function FilterBar({
  activeCategory,
  activeSort,
  onCategoryChange,
  onSortChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="sticky top-6 z-30">
      {/* Container — same border/shadow pattern as Navbar */}
      <div className="flex flex-col gap-2 rounded-[18px] border border-white/80 bg-white px-3 py-2 shadow-[0_16px_48px_rgba(1,17,43,0.12)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">

        {/* Category tabs — pill pattern from design system */}
        <div
          className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter kategori"
        >
          {shopCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => onCategoryChange(cat)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 font-secondary text-sm font-semibold leading-none transition duration-200 ${
                activeCategory === cat
                  ? "bg-ink text-white"
                  : "text-muted hover:bg-sky hover:text-cobalt"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort + count */}
        <div className="flex shrink-0 items-center gap-3 pl-1 sm:pl-0">
          <span className="font-secondary text-sm text-muted">{resultCount} template</span>
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Urutkan template"
              className="h-9 appearance-none rounded-full border border-line bg-white pl-3.5 pr-8 font-secondary text-sm font-medium text-ink transition hover:border-ink focus:outline-none focus:ring-2 focus:ring-cobalt/30"
            >
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
