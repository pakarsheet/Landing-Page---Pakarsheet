"use client";

import { useState, useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { formatRupiah, formatPct, safeNum, safeDivide, inputClass, trackToolEvent } from "@/lib/tools";
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

export function KalkulatorHPP() {
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

  // HPP status — based on composition balance, not margin
  // Healthy: no single component dominates > 70%
  const maxComponentPct = Math.max(bahanBakuPct, tenagaKerjaPct, overheadPct);
  const hppStatusResult = hpp === 0
    ? { gaugeValue: 0, statusColor: "text-muted", statusBg: "bg-sky", statusBarColor: "bg-line", statusLabel: "Isi data produksi" }
    : maxComponentPct >= 80
    ? { gaugeValue: Math.min(100, maxComponentPct), statusColor: "text-orange-600", statusBg: "bg-orange-50", statusBarColor: "bg-orange-400", statusLabel: "Satu komponen dominan" }
    : maxComponentPct >= 60
    ? { gaugeValue: Math.min(100, maxComponentPct), statusColor: "text-yellow-700", statusBg: "bg-yellow-50", statusBarColor: "bg-yellow-400", statusLabel: "Komposisi cukup seimbang" }
    : { gaugeValue: Math.min(100, maxComponentPct), statusColor: "text-green-700",  statusBg: "bg-green-50",  statusBarColor: "bg-green-500",  statusLabel: "Komposisi seimbang" };

  const fields: { id: keyof typeof defaultVals; label: string; prefix?: string; suffix?: string; min?: number; max?: number; hint?: string }[] = [
    { id: "bahanBaku",    label: "Biaya Bahan Baku per Unit",   prefix: "Rp", hint: "Semua bahan mentah yang digunakan untuk membuat 1 unit produk." },
    { id: "tenagaKerja",  label: "Biaya Tenaga Kerja per Unit", prefix: "Rp", hint: "Upah atau gaji yang dialokasikan untuk memproduksi 1 unit." },
    { id: "overhead",     label: "Biaya Overhead per Unit",     prefix: "Rp", hint: "Biaya tidak langsung: listrik, sewa, penyusutan alat, dll per unit." },
    { id: "targetMargin", label: "Target Margin (%)",           suffix: "%", max: 99 },
    { id: "qtyProduksi",  label: "Jumlah Unit Produksi",        min: 1 },
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
            aria-label="Reset kalkulator HPP ke nilai default"
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
        </div>
      </div>

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        <ResultCard
          label="HPP per Unit"
          value={formatRupiah(hpp)}
          subtitle={`Harga jual min: ${formatRupiah(hargaJualMin)}`}
          {...hppStatusResult}
        />

        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <ul className="space-y-4">
            {[
              { label: "Profit per Unit",    value: formatRupiah(profitUnit) },
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
            { label: "Bahan Baku",   pct: bahanBakuPct,   color: "bg-cobalt" },
            { label: "Tenaga Kerja", pct: tenagaKerjaPct, color: "bg-sheet" },
            { label: "Overhead",     pct: overheadPct,    color: "bg-sky" },
          ].map(({ label, pct, color }) => (
            <div key={label} className="mb-3 last:mb-0">
              <div className="mb-1 flex justify-between font-secondary text-xs text-muted">
                <span>{label}</span>
                <span className="font-semibold text-ink">{formatPct(pct)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
                <div
                  className={`h-full rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CalcDisclaimer />
    </div>
  );
}
