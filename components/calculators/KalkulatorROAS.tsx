"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { formatRupiah, formatMultiplier, safeNum, safeDivide } from "@/lib/tools";
import { ResultCard, roasStatus } from "@/components/ui/ResultCard";

export function KalkulatorROAS() {
  const defaultVals = {
    adSpend: "500000",
    revenue: "2000000",
    hppProduk: "300000",
    qtyOrder: "10",
  };

  const emptyVals = {
    adSpend: "",
    revenue: "",
    hppProduk: "",
    qtyOrder: "",
  };

  const [vals, setVals] = useState(defaultVals);
  const [resetKey, setResetKey] = useState(0);

  const reset = () => { setVals(emptyVals); setResetKey((k) => k + 1); };

  const adSpend   = safeNum(vals.adSpend);
  const revenue   = safeNum(vals.revenue);
  const hppProduk = safeNum(vals.hppProduk);
  const qtyOrder  = Math.max(1, safeNum(vals.qtyOrder, 1));

  const roas        = safeDivide(revenue, adSpend);
  const cpa         = safeDivide(adSpend, qtyOrder);
  const aov         = safeDivide(revenue, qtyOrder);
  const grossProfit = revenue - hppProduk * qtyOrder;
  const netProfit   = grossProfit - adSpend;
  const profitable  = netProfit > 0;

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
        <div key={resetKey} className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { id: "adSpend",   label: "Budget Iklan",           prefix: "Rp" },
            { id: "revenue",   label: "Revenue dari Iklan",     prefix: "Rp" },
            { id: "hppProduk", label: "HPP / Modal per Produk", prefix: "Rp" },
            { id: "qtyOrder",  label: "Jumlah Order",           min: 1 },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block font-secondary text-sm font-semibold text-ink">
                {f.label}
              </label>
              <div className={inputClass}>
                {f.prefix && <span className="mr-2 font-secondary text-sm font-semibold text-muted">{f.prefix}</span>}
                <input
                  id={f.id}
                  type="number"
                  inputMode="decimal"
                  min={(f as { min?: number }).min ?? 0}
                  value={vals[f.id as keyof typeof vals]}
                  onChange={(e) => update(f.id, e.target.value)}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="ROAS"
          value={formatMultiplier(roas)}
          {...roasStatus(roas)}
        />

        {/* Detail */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <ul className="space-y-4">
            {[
              { label: "CPA (Cost per Acquisition)", value: formatRupiah(cpa) },
              { label: "AOV (Avg Order Value)",      value: formatRupiah(aov) },
              { label: "Laba Kotor",                 value: formatRupiah(grossProfit) },
              { label: "Laba Bersih",                value: formatRupiah(netProfit) },
              { label: "Status",                     value: profitable ? "Profitable ✓" : "Tidak Profitable ✗" },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className={`font-secondary text-sm font-semibold ${label === "Status" ? (profitable ? "text-green-600" : "text-red-600") : "text-ink"}`}>
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
