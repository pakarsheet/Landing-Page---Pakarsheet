"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";

export function KalkulatorHPP() {
  const defaultVals = {
    bahanBaku: "30000",
    tenagaKerja: "10000",
    overhead: "5000",
    targetMargin: "30",
    qtyProduksi: "1",
  };

  const [vals, setVals] = useState(defaultVals);

  const reset = () => setVals(defaultVals);

  const bahanBaku    = safeNum(vals.bahanBaku);
  const tenagaKerja  = safeNum(vals.tenagaKerja);
  const overhead     = safeNum(vals.overhead);
  const targetMargin = Math.min(99, Math.max(0, safeNum(vals.targetMargin)));
  const qtyProduksi  = Math.max(1, safeNum(vals.qtyProduksi, 1));

  const hpp          = bahanBaku + tenagaKerja + overhead;
  const hargaJualMin = targetMargin < 100
    ? safeDivide(hpp, 1 - targetMargin / 100)
    : 0;
  const profitUnit   = hargaJualMin - hpp;
  const totalHPP     = hpp * qtyProduksi;

  const bahanBakuPct   = safeDivide(bahanBaku, hpp) * 100;
  const tenagaKerjaPct = safeDivide(tenagaKerja, hpp) * 100;
  const overheadPct    = safeDivide(overhead, hpp) * 100;

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
            { id: "bahanBaku", label: "Biaya Bahan Baku per Unit", prefix: "Rp" },
            { id: "tenagaKerja", label: "Biaya Tenaga Kerja per Unit", prefix: "Rp" },
            { id: "overhead", label: "Biaya Overhead per Unit", prefix: "Rp" },
            { id: "targetMargin", label: "Target Margin (%)", suffix: "%", max: 99 },
            { id: "qtyProduksi", label: "Jumlah Unit Produksi", min: 1 },
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
                  max={(f as { max?: number }).max}
                  value={vals[f.id as keyof typeof vals]}
                  onChange={(e) => update(f.id, e.target.value)}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none"
                />
                {f.suffix && <span className="ml-2 font-secondary text-sm font-semibold text-muted">{f.suffix}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="HPP per Unit"
          value={formatRupiah(hpp)}
          subtitle={`Harga jual min: ${formatRupiah(hargaJualMin)}`}
          {...marginStatus(targetMargin)}
        />

        {/* Detail */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <ul className="space-y-4">
            {[
              { label: "Profit per Unit", value: formatRupiah(profitUnit) },
              { label: "Total HPP Produksi", value: formatRupiah(totalHPP) },
            ].map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0">
                <span className="font-secondary text-sm text-muted">{label}</span>
                <span className="font-secondary text-sm font-semibold text-ink">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Composition bar */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
            Komposisi HPP
          </p>
          {[
            { label: "Bahan Baku", pct: bahanBakuPct, color: "bg-cobalt" },
            { label: "Tenaga Kerja", pct: tenagaKerjaPct, color: "bg-sheet" },
            { label: "Overhead", pct: overheadPct, color: "bg-sky" },
          ].map(({ label, pct, color }) => (
            <div key={label} className="mb-3 last:mb-0">
              <div className="mb-1 flex justify-between font-secondary text-xs text-muted">
                <span>{label}</span>
                <span className="font-semibold text-ink">{formatPct(pct)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
