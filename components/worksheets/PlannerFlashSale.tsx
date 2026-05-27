"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import {
  formatRupiah, formatPct, safeNum, safeDivide,
  inputClass, marketplacePlatforms, trackToolEvent,
} from "@/lib/tools";
import { ResultCard, profitStatus } from "@/components/ui/ResultCard";

const SLUG = "planner-flash-sale";

const defaultVals = {
  hargaNormal:   "150000",
  hpp:           "70000",
  stokFlashSale: "50",
  targetDiskon:  "30",
  biayaPack:     "2500",
  ongkirSeller:  "5000",
  customFee:     "5",
};

export function PlannerFlashSale() {
  const [platformIdx, setPlatformIdx] = useState(0);
  const [vals, setVals]               = useState(defaultVals);
  const [resetKey, setResetKey]       = useState(0);
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

  const isCustom       = platformIdx === marketplacePlatforms.length - 1;
  const platform       = marketplacePlatforms[platformIdx];
  const feePlatformPct = isCustom
    ? Math.min(100, Math.max(0, safeNum(vals.customFee)))
    : platform.serviceFee + platform.adminFee;

  const hargaNormal  = Math.max(0, safeNum(vals.hargaNormal));
  const hpp          = Math.max(0, safeNum(vals.hpp));
  const stok         = Math.max(1, safeNum(vals.stokFlashSale, 1));
  const targetDiskon = Math.min(99, Math.max(0, safeNum(vals.targetDiskon)));
  const biayaPack    = Math.max(0, safeNum(vals.biayaPack));
  const ongkirSeller = Math.max(0, safeNum(vals.ongkirSeller));

  const feeRate            = feePlatformPct / 100;
  const biayaOps           = biayaPack + ongkirSeller;
  const hargaFlashSale     = hargaNormal * (1 - targetDiskon / 100);
  const feePlatformNominal = hargaFlashSale * feeRate;
  const profitUnit         = hargaFlashSale - hpp - feePlatformNominal - biayaOps;
  const marginPct          = safeDivide(profitUnit, hargaFlashSale) * 100;

  const denomMaxDiskon = hargaNormal * (1 - feeRate);
  const diskonMaksimal = denomMaxDiskon > 0
    ? Math.max(0, (1 - safeDivide(hpp + biayaOps, denomMaxDiskon)) * 100)
    : 0;
  const diskonTerlalu = targetDiskon > diskonMaksimal;

  const hargaBEP = (1 - feeRate) > 0
    ? safeDivide(hpp + biayaOps, 1 - feeRate)
    : 0;

  const totalRevenue = hargaFlashSale * stok;
  const totalProfit  = profitUnit * stok;
  const totalFee     = feePlatformNominal * stok;
  const totalHPP     = hpp * stok;

  const fields: { id: keyof typeof defaultVals; label: string; prefix?: string; suffix?: string; min?: number; max?: number; hint?: string }[] = [
    { id: "hargaNormal",   label: "Harga Normal (sebelum flash sale)", prefix: "Rp", hint: "Harga jual produk kamu di luar flash sale." },
    { id: "hpp",           label: "HPP / Modal per Unit",              prefix: "Rp", hint: "Biaya pokok barang per unit." },
    { id: "stokFlashSale", label: "Stok yang Mau Dipromo",             min: 1,       hint: "Berapa unit yang akan kamu ikutkan flash sale." },
    { id: "targetDiskon",  label: "Target Diskon (%)",                 suffix: "%",  min: 0, max: 99, hint: "Berapa persen diskon yang ingin kamu berikan." },
    { id: "biayaPack",     label: "Packaging per Unit",                prefix: "Rp" },
    { id: "ongkirSeller",  label: "Subsidi Ongkir per Unit",           prefix: "Rp", hint: "Biaya ongkir yang kamu tanggung per transaksi." },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* ── Inputs ── */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-primary text-xl font-semibold tracking-[-0.4px] text-ink">
            Detail Flash Sale
          </h2>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset planner flash sale ke nilai default"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        {/* Platform selector */}
        <div className="mt-5">
          <p className="mb-2 font-secondary text-sm font-semibold text-ink">Platform</p>
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
              Total fee estimasi: {feePlatformPct.toFixed(1)}%
            </p>
          )}
        </div>

        <div key={resetKey} className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                {f.label}
              </label>
              {f.hint && (
                <p id={`${f.id}-hint`} className="mb-1.5 font-secondary text-xs leading-[1.4] text-muted">
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
                  max={f.max}
                  value={vals[f.id]}
                  onChange={(e) => update(f.id, e.target.value)}
                  aria-describedby={f.hint ? `${f.id}-hint` : undefined}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
                {f.suffix && (
                  <span className="ml-2 font-secondary text-sm font-semibold text-muted" aria-hidden="true">{f.suffix}</span>
                )}
              </div>
            </div>
          ))}

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

        {diskonTerlalu && hargaNormal > 0 && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="font-secondary text-sm text-red-700">
              Diskon {formatPct(targetDiskon)} melebihi batas aman {formatPct(diskonMaksimal)}. Kamu akan rugi per unit yang terjual.
            </p>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="Profit per Unit di Flash Sale"
          value={formatRupiah(profitUnit)}
          subtitle={`Margin: ${formatPct(marginPct)} · Harga flash sale: ${formatRupiah(hargaFlashSale)}`}
          {...profitStatus(profitUnit, marginPct)}
        />

        {/* Batas aman */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Batas Aman Flash Sale
          </p>
          <ul className="space-y-4">
            {[
              { label: "Diskon Maksimal Aman",    value: formatPct(diskonMaksimal), warn: diskonTerlalu },
              { label: "Harga Flash Sale Kamu",   value: formatRupiah(hargaFlashSale) },
              { label: "Harga BEP (titik impas)", value: formatRupiah(hargaBEP) },
              { label: "Fee Platform per Unit",   value: formatRupiah(feePlatformNominal) },
            ].map(({ label, value, warn }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className={`font-secondary text-sm font-semibold ${warn ? "text-red-600" : "text-ink"}`}>{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Proyeksi total */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Proyeksi ({stok.toLocaleString("id-ID")} unit terjual)
          </p>
          <ul className="space-y-4">
            {[
              { label: "Total Revenue",       value: formatRupiah(totalRevenue) },
              { label: "Total HPP",           value: formatRupiah(totalHPP) },
              { label: "Total Fee Platform",  value: formatRupiah(totalFee) },
              { label: "Total Profit Bersih", value: formatRupiah(totalProfit), highlight: true },
            ].map(({ label, value, highlight }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className={`font-secondary text-sm ${highlight ? "font-bold text-ink" : "text-muted"}`}>{label}</span>
                <span className={`font-secondary text-sm font-semibold ${
                  highlight ? (totalProfit >= 0 ? "text-green-600" : "text-red-600") : "text-ink"
                }`}>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
