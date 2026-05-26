"use client";

import { type ReactNode } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { formatThousands } from "@/lib/formatInput";

// ─── Shared input style constants ────────────────────────────────────────────
// Exported so individual calculators can use them for custom field sections
// (e.g. KalkulatorEfektivitasIklan's "biaya tersembunyi" block).
export const inputWrap =
  "flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-4 shadow-card transition focus-within:border-cobalt focus-within:ring-2 focus-within:ring-cobalt/10";
export const inputBase =
  "w-full bg-transparent font-secondary text-base font-semibold text-ink outline-none placeholder:text-muted/40";
export const prefixCls =
  "shrink-0 font-secondary text-sm font-semibold text-muted/60";

// ─── Field definition ─────────────────────────────────────────────────────────
export type CalcFieldDef = {
  id: string;
  label: string;
  hint: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  /** When true, formats value with thousand separators (overrides prefix check) */
  currency?: boolean;
};

// ─── Summary strip item ───────────────────────────────────────────────────────
export type SummaryItem = {
  label: string;
  value: string;
  /** Optional color class for the value, e.g. "text-green-600" */
  valueColor?: string;
};

// ─── Warning config ───────────────────────────────────────────────────────────
export type CalcWarning = {
  show: boolean;
  message: string;
};

// ─── Props ────────────────────────────────────────────────────────────────────
type CalcInputPanelProps = {
  /** Field definitions */
  fields: CalcFieldDef[];
  /** Current string values keyed by field id */
  vals: Record<string, string>;
  /** Called when a field value changes */
  onUpdate: (id: string, value: string) => void;
  /** Called when the reset button is clicked */
  onReset: () => void;
  /** Key to force re-render of controlled inputs after reset */
  resetKey: number;
  /** Two items shown in the bottom summary strip */
  summary: [SummaryItem, SummaryItem];
  /** Optional warning alert shown above the summary strip */
  warning?: CalcWarning;
  /** Optional content rendered between the field grid and the summary strip
   *  (e.g. platform selector, channel selector, grouped field sections) */
  children?: ReactNode;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function CalcInputPanel({
  fields,
  vals,
  onUpdate,
  onReset,
  resetKey,
  summary,
  warning,
  children,
}: CalcInputPanelProps) {
  return (
    <div className="rounded-3xl border border-line bg-white shadow-card">
      {/* Panel header */}
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
        <div>
          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.1em] text-muted/60">
            Kalkulator
          </p>
          <h2 className="mt-0.5 font-primary text-lg font-semibold tracking-[-0.3px] text-ink">
            Parameter Input
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          aria-label="Hapus semua data"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-semibold text-muted shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-soft"
        >
          <Trash2 className="h-3 w-3" />
          Hapus Data
        </button>
      </div>

      {/* Optional slot: platform/channel selector, grouped sections, etc. */}
      {children}

      {/* Field grid */}
      {fields.length > 0 && (
        <div key={resetKey} className="grid gap-6 p-6 sm:grid-cols-2">
          {fields.map((f) => {
            const isCurrency = f.currency ?? !!f.prefix;
            const displayValue = isCurrency
              ? formatThousands(vals[f.id] ?? "")
              : (vals[f.id] ?? "");

            return (
              <div key={f.id}>
                <label
                  htmlFor={f.id}
                  className="mb-1 block font-secondary text-[15px] font-semibold text-ink"
                >
                  {f.label}
                </label>
                <p className="mb-2 font-secondary text-sm text-muted/60">{f.hint}</p>
                <div className={inputWrap}>
                  {f.prefix && (
                    <span className={prefixCls} aria-hidden="true">
                      {f.prefix}
                    </span>
                  )}
                  <input
                    id={f.id}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    min={f.min ?? 0}
                    max={f.max}
                    value={displayValue}
                    onChange={(e) => onUpdate(f.id, e.target.value)}
                    className={inputBase}
                  />
                  {f.suffix && (
                    <span className={prefixCls} aria-hidden="true">
                      {f.suffix}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Warning alert */}
      {warning?.show && (
        <div
          role="alert"
          className="mx-6 mb-6 flex items-start gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
          <p className="font-secondary text-sm text-orange-700">{warning.message}</p>
        </div>
      )}

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-b-3xl border-t border-line bg-line">
        {summary.map(({ label, value, valueColor }) => (
          <div key={label} className="bg-white px-6 py-5">
            <p className="font-secondary text-xs text-muted/60">{label}</p>
            <p
              className={`mt-1 font-secondary text-lg font-semibold ${
                valueColor ?? "text-ink"
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
