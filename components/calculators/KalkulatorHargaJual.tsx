"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import {
  formatRupiah, formatPct, safeNum, safeDivide,
  inputClass, marketplacePlatforms, trackToolEvent,
} from "@/lib/tools";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-harga-jual";

const defaultVals = {
  modalHpp:      "50000",
  targetMargin:  "20",
  subsidiOngkir: "0",
  biayaPack:     "2000",
  customService: "0",
  customAdmin:   "0",
};

export function KalkulatorHargaJual() {
  const [platformIdx, setPlatformIdx] = useState(0);
  const [vals, setVals] = useState(defaultVals);
  const [resetKey, setResetKey] = useState(0);
  const visitedFired     = useRef(false);
  const interactionCount = useRef(0);
  const calculatedFired  = useRef(false);

  useEffect(() => {
    if (visitedFired.current) return;
    visitedFired.current = true;
    trackToolEvent("tool_visited", SLUG);
  }, []);

  const reset = () => { setVals(defaultVals); setPlatformIdx(0); setResetKey((k) => k + 1); };

  const update = (id: string, value: string) => {
    setVals((prev) => ({ ...prev, [id]: value }));
    interactionCount.current += 1;
    if (interactionCount.current >= 3 && !calculatedFired.current) {
      calculatedFired.current = true;
      trackToolEvent("tool_calculated", SLUG);
    }
  };

  const isCustom   = platformIdx === marketplacePlatforms.length - 1;
  const platform   = marketplacePlatforms[platformIdx];
  // Clamp custom fees to [0, 100] — negative fee makes no sense
  const serviceFee = isCustom ? Math.min(100, Math.max(0, safeNum(vals.customService))) : platform.serviceFee;
  const adminFee   = isCustom ? Math.min(100, Math.max(0, safeNum(vals.customAdmin)))   : platform.adminFee;

  const modalHpp      = Math.max(0, safeNum(vals.modalHpp));
  const targetMargin  = Math.min(90, Math.max(0, safeNum(vals.targetMargin)));
  const subsidiOngkir = Math.max(0, safeNum(vals.subsidiOngkir));
  const biayaPack     = Math.max(0, safeNum(vals.biayaPack));

  const totalModal  = modalHpp + subsidiOngkir + biayaPack;
  const feeRate     = (serviceFee + adminFee) / 100;
  const divisor     = 1 - feeRate - targetMargin / 100;

  // Warn when target margin + fee ≥ 100% — mathematically impossible
  const isImpossible = divisor <= 0;
  const hargaJual    = isImpossible ? 0 : safeDivide(totalModal, divisor);
  const feePlatform  = hargaJual * feeRate;
  const profitUnit   = hargaJual - totalModal - feePlatform;
  const actualMargin = safeDivide(profitUnit, hargaJual) * 100;

  const baseFields: { id: keyof typeof defaultVals; label: string; prefix?: string; suffix?: string; max?: number; hint?: string }[] = [
    { id: "modalHpp",      label: "Modal / HPP per Unit",     prefix: "Rp" },
    { id: "targetMargin",  label: "Target Margin (%)",        suffix: "%", max: 90, hint: "Persentase keuntungan yang ingin kamu capai dari harga jual." },
    { id: "subsidiOngkir", label: "Subsidi Ongkir per Unit",  prefix: "Rp", hint: "Biaya ongkir yang kamu tanggung sendiri per transaksi (bukan per kg)." },
    { id: "biayaPack",     label: "Biaya Packaging per Unit", prefix: "Rp" },
  ];

  const customFields: { id: keyof typeof defaultVals; label: string; suffix: string }[] = [
    { id: "customService", label: "Service Fee (%)", suffix: "%" },
    { id: "customAdmin",   label: "Admin Fee (%)",   suffix: "%" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* ── Inputs ── */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-primary text-xl font-semibold tracking-[-0.4px] text-ink">
            Parameter Input
          </h2>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset kalkulator harga jual marketplace ke nilai default"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        {/* Platform selector */}
        <div className="mt-5">
          <p className="mb-2 font-secondary text-sm font-semibold text-ink">Platform Marketplace</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih platform marketplace">
            {marketplacePlatforms.map((p, i) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setPlatformIdx(i)}
                aria-pressed={platformIdx === i}
                className={`rounded-full border px-4 py-1.5 font-secondary text-sm font-semibold transition ${
                  platformIdx === i
                    ? "border-cobalt bg-cobalt text-white"
                    : "border-line bg-white text-ink hover:border-cobalt hover:text-cobalt"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {!isCustom && (
            <p className="mt-2 font-secondary text-xs text-muted">
              Service fee {serviceFee}% + Admin fee {adminFee}% = Total {(serviceFee + adminFee).toFixed(1)}% &mdash; {platform.feeNote}
            </p>
          )}
          {isCustom && (
            <p className="mt-2 font-secondary text-xs text-muted">
              {marketplacePlatforms[marketplacePlatforms.length - 1].feeNote}
            </p>
          )}
        </div>

        <div key={resetKey} className="mt-5 grid gap-4 sm:grid-cols-2">
          {[...baseFields, ...(isCustom ? customFields : [])].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                {f.label}
              </label>
              {(f as { hint?: string }).hint && (
                <p id={`${f.id}-hint`} className="mb-1.5 font-secondary text-xs text-muted">
                  {(f as { hint?: string }).hint}
                </p>
              )}
              <div className={inputClass}>
                {(f as { prefix?: string }).prefix && (
                  <span className="mr-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">
                    {(f as { prefix?: string }).prefix}
                  </span>
                )}
                <input
                  id={f.id}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  max={(f as { max?: number }).max}
                  value={vals[f.id]}
                  onChange={(e) => update(f.id, e.target.value)}
                  aria-describedby={(f as { hint?: string }).hint ? `${f.id}-hint` : undefined}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
                {(f as { suffix?: string }).suffix && (
                  <span className="ml-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">
                    {(f as { suffix?: string }).suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Warning: impossible combination */}
        {isImpossible && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <p className="font-secondary text-sm text-orange-700">
              Target margin + fee platform melebihi 100%. Turunkan target margin atau pilih platform dengan fee lebih rendah.
            </p>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="Harga Jual Minimum"
          value={isImpossible ? "—" : formatRupiah(hargaJual)}
          subtitle={isImpossible ? "Kombinasi tidak valid" : `Margin aktual: ${formatPct(actualMargin)}`}
          {...marginStatus(isImpossible ? 0 : actualMargin)}
        />

        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <ul className="space-y-4">
            {[
              { label: "Potongan Fee Platform",  value: isImpossible ? "—" : formatRupiah(feePlatform) },
              { label: "Profit Bersih per Unit", value: isImpossible ? "—" : formatRupiah(profitUnit) },
              { label: "Total Modal per Unit",   value: formatRupiah(totalModal) },
              { label: "Total Fee Rate",         value: formatPct(feeRate * 100) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CalcDisclaimer note="Fee marketplace bervariasi per kategori, tier seller, dan program promo. Selalu cek Seller Centre platform kamu untuk angka terkini." />
    </div>
  );
}
