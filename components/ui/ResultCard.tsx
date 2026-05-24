"use client";

import { type LucideIcon, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

// ─── ResultCard ──────────────────────────────────────────────────────────────
export interface ResultCardProps {
  label: string;
  value: string;
  subtitle?: string;
  /** 0–100, drives the progress bar */
  gaugeValue: number;
  statusColor: string;   // tailwind text color, e.g. "text-green-600"
  statusBg: string;      // tailwind bg color, e.g. "bg-green-50"
  statusBarColor: string; // tailwind bg for bar fill, e.g. "bg-green-500"
  statusLabel: string;
  statusIcon?: LucideIcon;
}

export function ResultCard({
  label,
  value,
  subtitle,
  gaugeValue,
  statusColor,
  statusBg,
  statusBarColor,
  statusLabel,
  statusIcon: Icon,
}: ResultCardProps) {
  const clamped = Math.min(100, Math.max(0, gaugeValue));

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
      {/* Label */}
      <p className="font-secondary text-xs font-bold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>

      {/* Value */}
      <p className="mt-2 font-primary text-[40px] font-semibold leading-none tracking-[-1.8px] text-ink">
        {value}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 font-secondary text-sm text-muted">{subtitle}</p>
      )}

      {/* Progress bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full transition-all duration-500 ${statusBarColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      {/* Status badge */}
      <div className="mt-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-secondary text-xs font-bold ${statusBg} ${statusColor}`}>
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

// ─── Status helpers ───────────────────────────────────────────────────────────

type StatusResult = Pick<ResultCardProps, "statusColor" | "statusBg" | "statusBarColor" | "statusLabel" | "statusIcon" | "gaugeValue">;

export function marginStatus(pct: number): StatusResult {
  const gaugeValue = Math.min(100, Math.max(0, pct));
  if (pct >= 30) return { gaugeValue, statusColor: "text-green-700",  statusBg: "bg-green-50",  statusBarColor: "bg-green-500",  statusLabel: "Sangat sehat",             statusIcon: TrendingUp };
  if (pct >= 20) return { gaugeValue, statusColor: "text-green-600",  statusBg: "bg-green-50",  statusBarColor: "bg-green-400",  statusLabel: "Sehat",                    statusIcon: TrendingUp };
  if (pct >= 10) return { gaugeValue, statusColor: "text-yellow-700", statusBg: "bg-yellow-50", statusBarColor: "bg-yellow-400", statusLabel: "Cukup, bisa ditingkatkan", statusIcon: AlertTriangle };
  if (pct >  0)  return { gaugeValue, statusColor: "text-orange-600", statusBg: "bg-orange-50", statusBarColor: "bg-orange-400", statusLabel: "Tipis, perlu evaluasi",    statusIcon: AlertTriangle };
  return              { gaugeValue: 0, statusColor: "text-red-600",   statusBg: "bg-red-50",    statusBarColor: "bg-red-500",    statusLabel: "Rugi",                     statusIcon: TrendingDown };
}

export function roasStatus(roas: number): StatusResult {
  const gaugeValue = Math.min(100, (roas / 6) * 100);
  if (roas >= 4.0) return { gaugeValue, statusColor: "text-green-700",  statusBg: "bg-green-50",  statusBarColor: "bg-green-500",  statusLabel: "Sangat profitable",         statusIcon: TrendingUp };
  if (roas >= 3.0) return { gaugeValue, statusColor: "text-green-600",  statusBg: "bg-green-50",  statusBarColor: "bg-green-400",  statusLabel: "Profitable",                statusIcon: TrendingUp };
  if (roas >= 2.0) return { gaugeValue, statusColor: "text-yellow-700", statusBg: "bg-yellow-50", statusBarColor: "bg-yellow-400", statusLabel: "Break-even, perlu optimasi", statusIcon: AlertTriangle };
  if (roas >= 1.0) return { gaugeValue, statusColor: "text-orange-600", statusBg: "bg-orange-50", statusBarColor: "bg-orange-400", statusLabel: "Rugi, segera evaluasi",     statusIcon: AlertTriangle };
  return               { gaugeValue: 0, statusColor: "text-red-600",   statusBg: "bg-red-50",    statusBarColor: "bg-red-500",    statusLabel: "Rugi besar",               statusIcon: TrendingDown };
}

export function savingsStatus(pct: number): StatusResult {
  const gaugeValue = Math.min(100, Math.max(0, pct));
  if (pct >= 40) return { gaugeValue, statusColor: "text-green-700",  statusBg: "bg-green-50",  statusBarColor: "bg-green-500",  statusLabel: "Hemat banget",       statusIcon: TrendingUp };
  if (pct >= 20) return { gaugeValue, statusColor: "text-green-600",  statusBg: "bg-green-50",  statusBarColor: "bg-green-400",  statusLabel: "Lumayan hemat",      statusIcon: TrendingUp };
  if (pct >= 10) return { gaugeValue, statusColor: "text-yellow-700", statusBg: "bg-yellow-50", statusBarColor: "bg-yellow-400", statusLabel: "Sedikit hemat",      statusIcon: Minus };
  return              { gaugeValue: 0, statusColor: "text-muted",     statusBg: "bg-sky",       statusBarColor: "bg-line",       statusLabel: "Hampir tidak hemat", statusIcon: Minus };
}

export function profitStatus(profitUnit: number, marginPct: number): StatusResult {
  const gaugeValue = Math.min(100, Math.max(0, marginPct));
  if (profitUnit <= 0) return { gaugeValue: 0, statusColor: "text-red-600",   statusBg: "bg-red-50",    statusBarColor: "bg-red-500",    statusLabel: "Rugi, cek harga",        statusIcon: TrendingDown };
  if (marginPct >= 20) return { gaugeValue,    statusColor: "text-green-700",  statusBg: "bg-green-50",  statusBarColor: "bg-green-500",  statusLabel: "Sehat",                  statusIcon: TrendingUp };
  if (marginPct >= 10) return { gaugeValue,    statusColor: "text-yellow-700", statusBg: "bg-yellow-50", statusBarColor: "bg-yellow-400", statusLabel: "Tipis tapi masih jalan", statusIcon: AlertTriangle };
  return                      { gaugeValue,    statusColor: "text-red-500",    statusBg: "bg-red-50",    statusBarColor: "bg-red-400",    statusLabel: "Terlalu tipis",          statusIcon: AlertTriangle };
}
