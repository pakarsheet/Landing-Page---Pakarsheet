"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";

type Platform = {
  label: string;
  serviceFee: number;
  adminFee: number;
};

const platforms: Platform[] = [
  { label: "Shopee",      serviceFee: 3.0, adminFee: 2.0 },
  { label: "Tokopedia",   serviceFee: 1.8, adminFee: 1.0 },
  { label: "TikTok Shop", serviceFee: 1.8, adminFee: 3.0 },
  { label: "Lazada",      serviceFee: 2.0, adminFee: 2.0 },
  { label: "Custom",      serviceFee: 0,   adminFee: 0   },
];

export function KalkulatorHargaJual() {
  const defaultVals = {
    modalHpp: "50000",
    targetMargin: "20",
    subsidiOngkir: "0",
    biayaPack: "2000",
    customService: "0",
    customAdmin: "0",
  };

  const [platformIdx, setPlatformIdx] = useState(0);
  const [vals, setVals] = useState(defaultVals);

  const reset = () => { setVals(defaultVals); setPlatformIdx(0); };

  const isCustom = platformIdx === platforms.length - 1;
  const platform = platforms[platformIdx];

  const serviceFee = isCustom ? safeNum(vals.customService) : platform.serviceFee;
  const adminFee   = isCustom ? safeNum(vals.customAdmin)   : platform.adminFee;

  const modalHpp      = safeNum(vals.modalHpp);
  const targetMargin  = Math.min(90, Math.max(0, safeNum(vals.targetMargin)));
  const subsidiOngkir = safeNum(vals.subsidiOngkir);
  const biayaPack     = safeNum(vals.biayaPack);

  const totalModal = modalHpp + subsidiOngkir + biayaPack;
  const feeRate    = (serviceFee + adminFee) / 100;
  const divisor    = 1 - feeRate - targetMargin / 100;
  const hargaJual  = divisor > 0 ? safeDivide(totalModal, divisor) : 0;
  const feePlatform = hargaJual * feeRate;
  const profitUnit  = hargaJual - totalModal - feePlatform;
  const actualMargin = safeDivide(profitUnit, hargaJual) * 100;

  const update = (id: string, value: string) =>
    setVals((prev) => ({ ...prev, [id]: value }));

  const inputClass =
    "flex items-center rounded-2xl border border-line bg-white px-4 py-3 shadow-card focus-within:border-cobalt focus-within:ring-1 focus-within:ring-cobalt/20";

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
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        {/* Platform selector */}
        <div className="mt-5">
          <p className="mb-2 font-secondary text-sm font-semibold text-ink">Platform Marketplace</p>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p, i) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setPlatformIdx(i)}
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
              Service fee {serviceFee}% + Admin fee {adminFee}% = Total {(serviceFee + adminFee).toFixed(1)}%
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { id: "modalHpp", label: "Modal / HPP per Unit", prefix: "Rp" },
            { id: "targetMargin", label: "Target Margin (%)", suffix: "%", max: 90 },
            { id: "subsidiOngkir", label: "Subsidi Ongkir per Unit", prefix: "Rp" },
            { id: "biayaPack", label: "Biaya Packaging per Unit", prefix: "Rp" },
            ...(isCustom
              ? [
                  { id: "customService", label: "Service Fee (%)", suffix: "%" },
                  { id: "customAdmin", label: "Admin Fee (%)", suffix: "%" },
                ]
              : []),
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                {f.label}
              </label>
              <div className={inputClass}>
                {(f as { prefix?: string }).prefix && (
                  <span className="mr-2 font-secondary text-sm font-semibold text-muted">
                    {(f as { prefix?: string }).prefix}
                  </span>
                )}
                <input
                  id={f.id}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={(f as { max?: number }).max}
                  value={vals[f.id as keyof typeof vals]}
                  onChange={(e) => update(f.id, e.target.value)}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
                {(f as { suffix?: string }).suffix && (
                  <span className="ml-2 font-secondary text-sm font-semibold text-muted">
                    {(f as { suffix?: string }).suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="Harga Jual Minimum"
          value={formatRupiah(hargaJual)}
          subtitle={`Margin aktual: ${formatPct(actualMargin)}`}
          {...marginStatus(actualMargin)}
        />

        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <ul className="space-y-4">
            {[
              { label: "Potongan Fee Platform", value: formatRupiah(feePlatform) },
              { label: "Profit Bersih per Unit", value: formatRupiah(profitUnit) },
              { label: "Total Modal per Unit", value: formatRupiah(totalModal) },
              { label: "Total Fee Rate", value: formatPct(feeRate * 100) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
