"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { ResultCard, profitStatus } from "@/components/ui/ResultCard";

export function KalkulatorProfitMarketplace() {
  const defaultVals = {
    hargaJual:       "120000",
    hpp:             "65000",
    qty:             "25",
    feePlatformPct:  "5",
    pack:            "2500",
    ongkirSeller:    "5000",
    voucherSeller:   "10000",
    adSpendPerOrder: "8000",
    biayaFixed:      "1000",
  };

  const [vals, setVals] = useState(defaultVals);

  const reset = () => setVals(defaultVals);

  const hargaJual       = safeNum(vals.hargaJual);
  const hpp             = safeNum(vals.hpp);
  const qty             = Math.max(1, safeNum(vals.qty, 1));
  const feePlatformPct  = Math.min(100, Math.max(0, safeNum(vals.feePlatformPct)));
  const pack            = safeNum(vals.pack);
  const ongkirSeller    = safeNum(vals.ongkirSeller);
  const voucherSeller   = safeNum(vals.voucherSeller);
  const adSpendPerOrder = safeNum(vals.adSpendPerOrder);
  const biayaFixed      = safeNum(vals.biayaFixed);

  const platformFeeUnit  = hargaJual * (Math.min(100, feePlatformPct) / 100);
  const opsCostUnit      = pack + ongkirSeller + voucherSeller + adSpendPerOrder + biayaFixed;
  const totalBebanPerUnit = hpp + platformFeeUnit + opsCostUnit;
  const profitUnit       = hargaJual - totalBebanPerUnit;
  const marginPct        = safeDivide(profitUnit, hargaJual) * 100;
  const markupPct        = safeDivide(profitUnit, totalBebanPerUnit) * 100;

  const omzetTotal       = hargaJual * qty;
  const totalProfit      = profitUnit * qty;
  const totalPlatformFee = platformFeeUnit * qty;
  const totalBeban       = totalBebanPerUnit * qty;

  const ratePlatform = feePlatformPct / 100;
  const hargaBEP     = ratePlatform < 1
    ? safeDivide(hpp + opsCostUnit, 1 - ratePlatform)
    : 0;
  const maxAdSpend   = Math.max(
    0,
    hargaJual - hpp - platformFeeUnit - pack - ongkirSeller - voucherSeller - biayaFixed
  );

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
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { id: "hargaJual",       label: "Harga Jual per Unit",         prefix: "Rp" },
            { id: "hpp",             label: "HPP / Modal per Unit",         prefix: "Rp" },
            { id: "qty",             label: "Jumlah Terjual",               min: 1 },
            { id: "feePlatformPct",  label: "Fee Marketplace (%)",          suffix: "%", max: 100 },
            { id: "pack",            label: "Packaging per Unit",           prefix: "Rp" },
            { id: "ongkirSeller",    label: "Subsidi Ongkir per Unit",      prefix: "Rp" },
            { id: "voucherSeller",   label: "Voucher / Diskon Seller",      prefix: "Rp" },
            { id: "adSpendPerOrder", label: "Biaya Iklan per Order (CPA)",  prefix: "Rp" },
            { id: "biayaFixed",      label: "Biaya Admin Tetap per Order",  prefix: "Rp" },
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
                  min={(f as { min?: number }).min ?? 0}
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
              { label: "Omzet Total",          value: formatRupiah(omzetTotal) },
              { label: "Total Profit Bersih",  value: formatRupiah(totalProfit) },
              { label: "Total Fee Platform",   value: formatRupiah(totalPlatformFee) },
              { label: "Total Beban",          value: formatRupiah(totalBeban) },
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
