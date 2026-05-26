"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { formatRupiah, formatMultiplier, safeNum, safeDivide, inputClass, trackToolEvent } from "@/lib/tools";
import { ResultCard, roasStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-roas";

const defaultVals = {
  adSpend:   "500000",
  revenue:   "2000000",
  hppProduk: "300000",
  qtyOrder:  "10",
};

export function KalkulatorROAS() {
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

  const reset = () => { setVals(defaultVals); setResetKey((k) => k + 1); };

  const update = (id: string, value: string) => {
    setVals((prev) => ({ ...prev, [id]: value }));
    interactionCount.current += 1;
    if (interactionCount.current >= 3 && !calculatedFired.current) {
      calculatedFired.current = true;
      trackToolEvent("tool_calculated", SLUG);
    }
  };

  const adSpend   = Math.max(0, safeNum(vals.adSpend));
  const revenue   = Math.max(0, safeNum(vals.revenue));
  const hppProduk = Math.max(0, safeNum(vals.hppProduk));
  const qtyOrder  = Math.max(1, safeNum(vals.qtyOrder, 1));

  const roas        = safeDivide(revenue, adSpend);
  const cpa         = safeDivide(adSpend, qtyOrder);
  const aov         = safeDivide(revenue, qtyOrder);
  const grossProfit = revenue - hppProduk * qtyOrder;
  const netProfit   = grossProfit - adSpend;
  const profitable  = netProfit > 0;

  // Warn when gross profit is negative despite potentially high ROAS
  const grossProfitNegative = grossProfit < 0;

  const fields: { id: keyof typeof defaultVals; label: string; prefix?: string; min?: number; hint?: string }[] = [
    { id: "adSpend",   label: "Budget Iklan",           prefix: "Rp", hint: "Total pengeluaran iklan dalam periode yang sama." },
    { id: "revenue",   label: "Revenue dari Iklan",     prefix: "Rp", hint: "Total omzet penjualan yang dihasilkan dari iklan tersebut." },
    { id: "hppProduk", label: "HPP / Modal per Produk", prefix: "Rp", hint: "Biaya pokok barang per unit, tidak termasuk biaya iklan." },
    { id: "qtyOrder",  label: "Jumlah Order",           min: 1,       hint: "Total transaksi sukses yang dihasilkan dari iklan." },
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
            aria-label="Reset kalkulator ROAS ke nilai default"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition hover:border-ink hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
        <div key={resetKey} className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
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
        </div>

        {/* Warning: gross profit negative despite ROAS */}
        {grossProfitNegative && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <p className="font-secondary text-sm text-orange-700">
              Laba kotor negatif — HPP × jumlah order melebihi revenue. Cek harga jual atau HPP produk kamu.
            </p>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="ROAS"
          value={formatMultiplier(roas)}
          {...roasStatus(roas)}
        />

        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <ul className="space-y-4">
            {[
              { label: "CPA (Cost per Acquisition)", value: formatRupiah(cpa),         colored: false },
              { label: "AOV (Avg Order Value)",      value: formatRupiah(aov),         colored: false },
              { label: "Laba Kotor",                 value: formatRupiah(grossProfit), colored: false, warn: grossProfitNegative },
              { label: "Laba Bersih",                value: formatRupiah(netProfit),   colored: false },
              { label: "Status",                     value: profitable ? "Profitable ✓" : "Tidak Profitable ✗", colored: true },
            ].map(({ label, value, colored, warn }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className={`font-secondary text-sm font-semibold ${
                  warn ? "text-orange-600" :
                  colored ? (profitable ? "text-green-600" : "text-red-600") :
                  "text-ink"
                }`}>
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CalcDisclaimer note="ROAS dihitung dari data yang kamu masukkan. Pastikan revenue dan HPP mencakup periode yang sama agar hasilnya akurat." />
    </div>
  );
}
