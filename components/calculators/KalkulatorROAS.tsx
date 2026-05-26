"use client";

import { AlertTriangle } from "lucide-react";
import { formatRupiah, formatMultiplier, safeNum, safeDivide } from "@/lib/tools";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef } from "./CalcInputPanel";
import { ResultCard, roasStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-roas";

const defaultVals = {
  adSpend:   "500000",
  revenue:   "2000000",
  hppProduk: "300000",
  qtyOrder:  "10",
};

const fields: CalcFieldDef[] = [
  { id: "adSpend",   label: "Budget Iklan",           hint: "Total pengeluaran iklan dalam periode yang sama",   prefix: "Rp" },
  { id: "revenue",   label: "Revenue dari Iklan",     hint: "Total omzet penjualan yang dihasilkan dari iklan",  prefix: "Rp" },
  { id: "hppProduk", label: "HPP / Modal per Produk", hint: "Biaya pokok barang per unit, tidak termasuk iklan", prefix: "Rp" },
  { id: "qtyOrder",  label: "Jumlah Order",           hint: "Total transaksi sukses yang dihasilkan dari iklan" },
];

export function KalkulatorROAS() {
  const { vals, resetKey, reset, update } = useCalcTracking(SLUG, defaultVals);

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
  const grossProfitNegative = grossProfit < 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <CalcInputPanel
        fields={fields}
        vals={vals}
        onUpdate={update}
        onReset={reset}
        resetKey={resetKey}
        warning={
          grossProfitNegative
            ? {
                show: true,
                message:
                  "Laba kotor negatif — HPP × jumlah order melebihi revenue. Cek harga jual atau HPP produk.",
              }
            : undefined
        }
        summary={[
          { label: "CPA", value: formatRupiah(cpa) },
          { label: "AOV", value: formatRupiah(aov) },
        ]}
      />

      {/* ── Result Panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="ROAS"
          value={formatMultiplier(roas)}
          subtitle={`Laba bersih: ${formatRupiah(netProfit)}`}
          {...roasStatus(roas)}
        />

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Rincian Kalkulasi
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "CPA (Cost per Acquisition)", value: formatRupiah(cpa),         warn: false },
              { label: "AOV (Avg Order Value)",      value: formatRupiah(aov),         warn: false },
              { label: "Laba Kotor",                 value: formatRupiah(grossProfit), warn: grossProfitNegative },
              { label: "Laba Bersih",                value: formatRupiah(netProfit),   warn: false },
              {
                label: "Status",
                value: profitable ? "Profitable ✓" : "Tidak Profitable ✗",
                warn: !profitable,
              },
            ].map(({ label, value, warn }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span
                  className={`font-secondary text-sm font-semibold ${
                    warn
                      ? "text-red-600"
                      : label === "Status"
                      ? profitable
                        ? "text-green-600"
                        : "text-red-600"
                      : "text-ink"
                  }`}
                >
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <CalcDisclaimer note="Pastikan revenue dan HPP mencakup periode yang sama agar hasilnya akurat." />
      </div>
    </div>
  );
}
