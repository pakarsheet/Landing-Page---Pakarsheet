"use client";

import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { formatThousands } from "@/lib/formatInput";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef } from "./CalcInputPanel";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-margin";

const defaultVals = {
  hargaBeli: "50000",
  hargaJual: "80000",
  biayaOps:  "5000",
  qty:       "100",
};

const fields: CalcFieldDef[] = [
  { id: "hargaBeli", label: "Harga Beli / Modal",  hint: "Biaya beli atau produksi per unit",         prefix: "Rp" },
  { id: "hargaJual", label: "Harga Jual",          hint: "Harga yang dibayar pembeli per unit",       prefix: "Rp" },
  { id: "biayaOps",  label: "Biaya Operasional",   hint: "Ongkir, kemasan, biaya admin per unit",     prefix: "Rp" },
  { id: "qty",       label: "Jumlah Unit",         hint: "Target penjualan untuk hitung total profit", currency: false },
];

export function KalkulatorMargin() {
  const { vals, resetKey, reset, update } = useCalcTracking(SLUG, defaultVals);

  const hargaBeli = Math.max(0, safeNum(vals.hargaBeli));
  const hargaJual = Math.max(0, safeNum(vals.hargaJual));
  const biayaOps  = Math.max(0, safeNum(vals.biayaOps));
  const qty       = Math.max(1, safeNum(vals.qty, 1));

  const totalModal  = hargaBeli + biayaOps;
  const profitUnit  = hargaJual - totalModal;
  const marginPct   = safeDivide(profitUnit, hargaJual) * 100;
  const markupPct   = safeDivide(profitUnit, totalModal) * 100;
  const totalProfit = profitUnit * qty;
  const bep         = profitUnit > 0 ? Math.ceil(totalModal / profitUnit) : 0;

  const metrics = [
    { label: "Profit per Unit",        value: formatRupiah(profitUnit),  highlight: profitUnit > 0 },
    { label: "Markup",                 value: formatPct(markupPct),      highlight: false },
    { label: "Total Modal per Unit",   value: formatRupiah(totalModal),  highlight: false },
    { label: "Total Profit",           value: formatRupiah(totalProfit), highlight: totalProfit > 0 },
    { label: "Break-Even Point (BEP)", value: bep > 0 ? `${bep.toLocaleString("id-ID")} unit` : "—", highlight: false },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <CalcInputPanel
        fields={fields}
        vals={vals}
        onUpdate={update}
        onReset={reset}
        resetKey={resetKey}
        summary={[
          { label: "Total Modal", value: formatRupiah(totalModal) },
          {
            label: "Profit / Unit",
            value: formatRupiah(profitUnit),
            valueColor: profitUnit >= 0 ? "text-green-600" : "text-red-600",
          },
        ]}
      />

      {/* ── Result Panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="Margin Keuntungan"
          value={formatPct(marginPct)}
          subtitle={`Dari ${qty.toLocaleString("id-ID")} unit → total profit ${formatRupiah(totalProfit)}`}
          {...marginStatus(marginPct)}
        />

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Rincian Kalkulasi
            </p>
          </div>
          <ul className="divide-y divide-line">
            {metrics.map(({ label, value, highlight }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span
                  className={`font-secondary text-sm font-semibold ${
                    highlight ? "text-green-600" : "text-ink"
                  }`}
                >
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <CalcDisclaimer />
      </div>
    </div>
  );
}
