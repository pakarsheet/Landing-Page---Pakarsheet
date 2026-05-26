"use client";

import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { useCalcTracking } from "@/hooks/useCalcTracking";
import { CalcInputPanel, type CalcFieldDef } from "./CalcInputPanel";
import { ResultCard } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-hpp";

const defaultVals = {
  bahanBaku:    "30000",
  tenagaKerja:  "10000",
  overhead:     "5000",
  targetMargin: "30",
  qtyProduksi:  "1",
};

const fields: CalcFieldDef[] = [
  { id: "bahanBaku",    label: "Biaya Bahan Baku",     hint: "Semua bahan mentah untuk 1 unit produk",         prefix: "Rp" },
  { id: "tenagaKerja",  label: "Biaya Tenaga Kerja",   hint: "Upah/gaji yang dialokasikan per unit",           prefix: "Rp" },
  { id: "overhead",     label: "Biaya Overhead",       hint: "Listrik, sewa, penyusutan alat per unit",        prefix: "Rp" },
  { id: "targetMargin", label: "Target Margin",        hint: "Persentase keuntungan yang ingin dicapai",       suffix: "%", max: 99 },
  { id: "qtyProduksi",  label: "Jumlah Unit Produksi", hint: "Untuk menghitung total HPP keseluruhan produksi" },
];

export function KalkulatorHPP() {
  const { vals, resetKey, reset, update } = useCalcTracking(SLUG, defaultVals);

  const bahanBaku    = Math.max(0, safeNum(vals.bahanBaku));
  const tenagaKerja  = Math.max(0, safeNum(vals.tenagaKerja));
  const overhead     = Math.max(0, safeNum(vals.overhead));
  const targetMargin = Math.min(99, Math.max(0, safeNum(vals.targetMargin)));
  const qtyProduksi  = Math.max(1, safeNum(vals.qtyProduksi, 1));

  const hpp          = bahanBaku + tenagaKerja + overhead;
  const hargaJualMin = targetMargin < 100 ? safeDivide(hpp, 1 - targetMargin / 100) : 0;
  const profitUnit   = hargaJualMin - hpp;
  const totalHPP     = hpp * qtyProduksi;

  const bahanBakuPct   = safeDivide(bahanBaku, hpp) * 100;
  const tenagaKerjaPct = safeDivide(tenagaKerja, hpp) * 100;
  const overheadPct    = safeDivide(overhead, hpp) * 100;

  const maxComponentPct = Math.max(bahanBakuPct, tenagaKerjaPct, overheadPct);
  const hppStatusResult = hpp === 0
    ? { gaugeValue: 0, statusColor: "text-muted", statusBg: "bg-sky", statusBarColor: "bg-line", statusLabel: "Isi data produksi" }
    : maxComponentPct >= 80
    ? { gaugeValue: Math.min(100, maxComponentPct), statusColor: "text-orange-600", statusBg: "bg-orange-50", statusBarColor: "bg-orange-400", statusLabel: "Satu komponen dominan" }
    : maxComponentPct >= 60
    ? { gaugeValue: Math.min(100, maxComponentPct), statusColor: "text-yellow-700", statusBg: "bg-yellow-50", statusBarColor: "bg-yellow-400", statusLabel: "Komposisi cukup seimbang" }
    : { gaugeValue: Math.min(100, maxComponentPct), statusColor: "text-green-700",  statusBg: "bg-green-50",  statusBarColor: "bg-green-500",  statusLabel: "Komposisi seimbang" };

  const compositions = [
    { label: "Bahan Baku",   pct: bahanBakuPct,   color: "bg-cobalt",   textColor: "text-cobalt" },
    { label: "Tenaga Kerja", pct: tenagaKerjaPct, color: "bg-sheet",    textColor: "text-ink" },
    { label: "Overhead",     pct: overheadPct,    color: "bg-muted/30", textColor: "text-muted" },
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
          { label: "HPP per Unit",    value: formatRupiah(hpp) },
          { label: "Harga Jual Min.", value: formatRupiah(hargaJualMin), valueColor: "text-cobalt" },
        ]}
      />

      {/* ── Result Panel ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6">
        <ResultCard
          label="HPP per Unit"
          value={formatRupiah(hpp)}
          subtitle={`Harga jual min: ${formatRupiah(hargaJualMin)} · Profit: ${formatRupiah(profitUnit)}`}
          {...hppStatusResult}
        />

        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Rincian
            </p>
          </div>
          <ul className="divide-y divide-line">
            {[
              { label: "Profit per Unit",    value: formatRupiah(profitUnit) },
              { label: "Total HPP Produksi", value: formatRupiah(totalHPP) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Composition visual */}
        <div className="rounded-3xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-6 py-4">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
              Komposisi HPP
            </p>
          </div>
          <div className="p-6">
            <div className="flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label="Komposisi HPP">
              {compositions.map(({ label, pct, color }) => (
                <div
                  key={label}
                  className={`h-full transition-all duration-700 ${color}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                  title={`${label}: ${formatPct(pct)}`}
                />
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {compositions.map(({ label, pct, color }) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${color}`} />
                    <span className="font-secondary text-sm text-muted">{label}</span>
                  </div>
                  <span className="font-secondary text-sm font-semibold text-ink">
                    {formatPct(pct)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CalcDisclaimer />
      </div>
    </div>
  );
}
