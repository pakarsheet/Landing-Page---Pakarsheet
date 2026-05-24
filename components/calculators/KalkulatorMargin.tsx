"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { formatRupiah, formatPct, safeNum, safeDivide } from "@/lib/tools";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";

type Field = {
  id: string;
  label: string;
  defaultValue: number;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
};

const fields: Field[] = [
  { id: "hargaBeli", label: "Harga Beli / Modal per Unit", defaultValue: 50000, prefix: "Rp" },
  { id: "hargaJual", label: "Harga Jual per Unit", defaultValue: 80000, prefix: "Rp" },
  { id: "biayaOps", label: "Biaya Operasional per Unit", defaultValue: 5000, prefix: "Rp" },
  { id: "qty", label: "Jumlah Unit", defaultValue: 100, min: 1 },
];

export function KalkulatorMargin() {
  const defaultVals = {
    hargaBeli: "50000",
    hargaJual: "80000",
    biayaOps: "5000",
    qty: "100",
  };

  const [vals, setVals] = useState<Record<string, string>>(defaultVals);

  const reset = () => setVals(defaultVals);

  const hargaBeli = safeNum(vals.hargaBeli);
  const hargaJual = safeNum(vals.hargaJual);
  const biayaOps  = safeNum(vals.biayaOps);
  const qty       = Math.max(1, safeNum(vals.qty, 1));

  const totalModal  = hargaBeli + biayaOps;
  const profitUnit  = hargaJual - totalModal;
  const marginPct   = safeDivide(profitUnit, hargaJual) * 100;
  const markupPct   = safeDivide(profitUnit, totalModal) * 100;
  const totalProfit = profitUnit * qty;
  const bep         = profitUnit > 0 ? Math.ceil(totalModal / profitUnit) : 0;

  const update = (id: string, value: string) =>
    setVals((prev) => ({ ...prev, [id]: value }));

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
          {fields.map((f) => (
            <div key={f.id}>
              <label
                htmlFor={f.id}
                className="mb-1.5 block font-secondary text-sm font-semibold text-ink"
              >
                {f.label}
              </label>
              <div className="flex items-center rounded-2xl border border-line bg-white px-4 py-3 shadow-card focus-within:border-cobalt focus-within:ring-1 focus-within:ring-cobalt/20">
                {f.prefix && (
                  <span className="mr-2 font-secondary text-sm font-semibold text-muted">
                    {f.prefix}
                  </span>
                )}
                <input
                  id={f.id}
                  type="number"
                  inputMode={f.id === "qty" ? "numeric" : "decimal"}
                  min={f.min ?? 0}
                  max={f.max}
                  step={f.step ?? 1}
                  value={vals[f.id]}
                  onChange={(e) => update(f.id, e.target.value)}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none placeholder:text-muted/50"
                />
                {f.suffix && (
                  <span className="ml-2 font-secondary text-sm font-semibold text-muted">
                    {f.suffix}
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
          label="Margin Keuntungan"
          value={formatPct(marginPct)}
          {...marginStatus(marginPct)}
        />

        {/* Detail metrics */}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <ul className="space-y-4">
            {[
              { label: "Profit per Unit", value: formatRupiah(profitUnit) },
              { label: "Markup", value: formatPct(markupPct) },
              { label: "Total Modal per Unit", value: formatRupiah(totalModal) },
              { label: "Total Profit", value: formatRupiah(totalProfit) },
              { label: "Break-Even Point (BEP)", value: bep > 0 ? `${bep.toLocaleString("id-ID")} unit` : "—" },
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
