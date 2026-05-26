"use client";

import { marketplacePlatforms } from "@/lib/tools";

type Props = {
  platformIdx: number;
  onChange: (idx: number) => void;
  /** Optional note shown below the selector. Defaults to the platform's feeNote. */
  note?: string;
};

/**
 * PlatformSelector — shared marketplace platform pill-selector.
 * Used by KalkulatorHargaJual and KalkulatorProfitMarketplace.
 */
export function PlatformSelector({ platformIdx, onChange, note }: Props) {
  const platform = marketplacePlatforms[platformIdx];
  const isCustom = platformIdx === marketplacePlatforms.length - 1;
  const displayNote = note ?? platform.feeNote;

  return (
    <div className="border-b border-line px-6 py-5">
      <p className="mb-3 font-secondary text-sm font-semibold text-ink">
        Platform Marketplace
      </p>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Pilih platform marketplace"
      >
        {marketplacePlatforms.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(i)}
            aria-pressed={platformIdx === i}
            className={`rounded-full border px-4 py-1.5 font-secondary text-sm font-semibold transition ${
              platformIdx === i
                ? "border-cobalt bg-cobalt text-white shadow-card"
                : "border-line bg-white text-ink hover:border-cobalt hover:text-cobalt"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {!isCustom && (
        <p className="mt-2.5 font-secondary text-xs text-muted/70">
          {displayNote}
        </p>
      )}
      {isCustom && (
        <p className="mt-2.5 font-secondary text-xs text-muted/70">
          {marketplacePlatforms[marketplacePlatforms.length - 1].feeNote}
        </p>
      )}
    </div>
  );
}
