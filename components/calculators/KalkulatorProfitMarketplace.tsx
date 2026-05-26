"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import {
  formatRupiah, formatPct, safeNum, safeDivide,
  inputClass, marketplacePlatforms, trackToolEvent,
} from "@/lib/tools";
import { ResultCard, profitStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-profit-marketplace";

const defaultVals = {
  hargaJual:       "120000",
  hpp:             "65000",
  qty:             "25",
  pack:            "2500",
  ongkirSeller:    "5000",
  voucherSeller:   "10000",
  adSpendPerOrder: "8000",
  biayaFixed:      "1000",
  customFee:       "5",
};

export function KalkulatorProfitMarketplace() {
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

  // Platform fee resolution
  const isCustom = platformIdx === marketplacePlatforms.length - 1;
  const platform = marketplacePlatforms[platformIdx];
  const feePlatformPct = isCustom
    ? Math.min(100, Math.max(0, safeNum(vals.customFee)))
    : platform.serviceFee + platform.adminFee;

  const hargaJual       = Math.max(0, safeNum(vals.hargaJual));
  const hpp             = Math.max(0, safeNum(vals.hpp));
  const qty             = Math.max(1, safeNum(vals.qty, 1));
  const pack            = Math.max(0, safeNum(vals.pack));
  const ongkirSeller    = Math.max(0, safeNum(vals.ongkirSeller));
  const voucherSeller   = Math.max(0, safeNum(vals.voucherSeller));
  const adSpendPerOrder = Math.max(0, safeNum(vals.adSpendPerOrder));
  const biayaFixed      = Math.max(0, safeNum(vals.biayaFixed));

  const platformFeeUnit   = hargaJual * (Math.min(100, feePlatformPct) / 100);
  const opsCostUnit       = pack + ongkirSeller + voucherSeller + adSpendPerOrder + biayaFixed;
  const totalBebanPerUnit = hpp + platformFeeUnit + opsCostUnit;
  const profitUnit        = hargaJual - totalBebanPerUnit;
  const marginPct         = safeDivide(profitUnit, hargaJual) * 100;
  const markupPct         = safeDivide(profitUnit, totalBebanPerUnit) * 100;

  const omzetTotal       = hargaJual * qty;
  const totalProfit      = profitUnit * qty;
  const totalPlatformFee = platformFeeUnit * qty;
  const totalBeban       = totalBebanPerUnit * qty;

  const ratePlatform = feePlatformPct / 100;
  const hargaBEP     = ratePlatform < 1 ? safeDivide(hpp + opsCostUnit, 1 - ratePlatform) : 0;
  const maxAdSpend   = Math.max(
    0,
    hargaJual - hpp - platformFeeUnit - pack - ongkirSeller - voucherSeller - biayaFixed
  );

  const baseFields: { id: keyof typeof defaultVals; label: string; prefix?: string; min?: number; hint?: string }[] = [
    { id: "hargaJual",       label: "Harga Jual per Unit",        prefix: "Rp" },
    { id: "hpp",             label: "HPP / Modal per Unit",        prefix: "Rp" },
    { id: "qty",             label: "Jumlah Terjual",              min: 1 },
    { id: "pack",            label: "Packaging per Unit",          prefix: "Rp" },
    { id: "ongkirSeller",    label: "Subsidi Ongkir per Unit",     prefix: "Rp", hint: "Biaya ongkir yang kamu tanggung per transaksi (bukan per kg)." },
    { id: "voucherSeller",   label: "Voucher / Diskon Seller",     prefix: "Rp", hint: "Nominal diskon produk yang ditanggung oleh toko kamu." },
    { id: "adSpendPerOrder", label: "Biaya Iklan per Order (CPA)", prefix: "Rp", hint: "Rata-rata biaya iklan untuk menghasilkan 1 transaksi." },
    { id: "biayaFixed",      label: "Biaya Admin Tetap per Order", prefix: "Rp" },
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
            aria-label="Reset kalkulator profit marketplace ke nilai default"
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
              Service fee {platform.serviceFee}% + Admin fee {platform.adminFee}% = Total {feePlatformPct.toFixed(1)}% &mdash; {platform.feeNote}
            </p>
          )}
          {isCustom && (
            <p className="mt-2 font-secondary text-xs text-muted">
              {marketplacePlatforms[marketplacePlatforms.length - 1].feeNote}
            </p>
          )}
        </div>

        <div key={resetKey} className="mt-5 grid gap-4 sm:grid-cols-2">
          {baseFields.map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                {f.label}
              </label>
              {f.hint && (
                <p id={`${f.id}-hint`} className="mb-1.5 font-secondary text-xs text-muted">
                  {f.hint}
                </p>
              )}
              <div className={inputClass}>
                {f.prefix && (
                  <span className="mr-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">{f.prefix}</span>
                )}
                <input
                  id={f.id}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  min={f.min ?? 0}
                  value={vals[f.id]}
                  onChange={(e) => update(f.id, e.target.value)}
                  aria-describedby={f.hint ? `${f.id}-hint` : undefined}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
              </div>
            </div>
          ))}

          {/* Custom fee input */}
          {isCustom && (
            <div>
              <label htmlFor="customFee" className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                Fee Marketplace (%)
              </label>
              <div className={inputClass}>
                <input
                  id="customFee"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={vals.customFee}
                  onChange={(e) => update("customFee", e.target.value)}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
                <span className="ml-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="Profit Bersih per Unit"
          value={formatRupiah(profitUnit)}
          subtitle={`Margin: ${formatPct(marginPct)}`}
          {...profitStatus(profitUnit, marginPct)}
        />

        {/* Per-unit detail */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">Per Unit</p>
          <ul className="space-y-4">
            {[
              { label: "Margin Bersih",          value: formatPct(marginPct) },
              { label: "Markup Bersih",           value: formatPct(markupPct) },
              { label: "Fee Platform",            value: formatRupiah(platformFeeUnit) },
              { label: "Total Biaya Ops",         value: formatRupiah(opsCostUnit) },
              { label: "Harga BEP Minimum",       value: formatRupiah(hargaBEP) },
              { label: "Maks. Biaya Iklan/Order", value: formatRupiah(maxAdSpend) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total summary */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Total ({qty.toLocaleString("id-ID")} unit)
          </p>
          <ul className="space-y-4">
            {[
              { label: "Omzet Total",         value: formatRupiah(omzetTotal) },
              { label: "Total Profit Bersih", value: formatRupiah(totalProfit) },
              { label: "Total Fee Platform",  value: formatRupiah(totalPlatformFee) },
              { label: "Total Beban",         value: formatRupiah(totalBeban) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CalcDisclaimer note="Fee marketplace bervariasi per kategori, tier seller, dan program promo. Selalu verifikasi fee aktual di Seller Centre sebelum menetapkan harga jual." />
    </div>
  );
}
