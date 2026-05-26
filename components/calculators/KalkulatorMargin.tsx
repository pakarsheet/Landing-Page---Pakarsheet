"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { formatRupiah, formatPct, safeNum, safeDivide, inputClass, trackToolEvent } from "@/lib/tools";
import { ResultCard, marginStatus } from "@/components/ui/ResultCard";
import { CalcDisclaimer } from "@/components/ui/CalcDisclaimer";

const SLUG = "kalkulator-margin";

const defaultVals = {
  hargaBeli: "50000",
  hargaJual: "80000",
  biayaOps:  "5000",
  qty:       "100",
};

export function KalkulatorMargin() {
  const [vals, setVals] = useState(defaultVals);
  const [resetKey, setResetKey] = useState(0);
  const visitedFired     = useRef(false);
  const interactionCount = useRef(0);
  const calculatedFired  = useRef(false);

  // Guard against React Strict Mode double-invoke
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

  const fields: { id: keyof typeof defaultVals; label: string; prefix?: string; hint?: string }[] = [
    { id: "hargaBeli", label: "Harga Beli / Modal per Unit", prefix: "Rp", hint: "Harga beli atau biaya produksi per unit, belum termasuk biaya operasional." },
    { id: "hargaJual", label: "Harga Jual per Unit",         prefix: "Rp" },
    { id: "biayaOps",  label: "Biaya Operasional per Unit",  prefix: "Rp", hint: "Termasuk ongkir, kemasan, biaya admin, dan biaya lain per unit." },
    { id: "qty",       label: "Jumlah Unit" },
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
            aria-label="Reset kalkulator margin keuntungan ke nilai default"
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
                  inputMode={f.id === "qty" ? "numeric" : "decimal"}
                  pattern="[0-9]*"
                  min={f.id === "qty" ? 1 : 0}
                  value={vals[f.id]}
                  onChange={(e) => update(f.id, e.target.value)}
                  aria-describedby={f.hint ? `${f.id}-hint` : undefined}
                  className="w-full bg-transparent font-secondary text-base text-ink outline-none placeholder:text-muted/50"
                />
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

        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <ul className="space-y-4">
            {[
              { label: "Profit per Unit",        value: formatRupiah(profitUnit) },
              { label: "Markup",                 value: formatPct(markupPct) },
              { label: "Total Modal per Unit",   value: formatRupiah(totalModal) },
              { label: "Total Profit",           value: formatRupiah(totalProfit) },
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

      <CalcDisclaimer />
    </div>
  );
}
