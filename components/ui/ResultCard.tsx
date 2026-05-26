"use client";

import { type LucideIcon, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";

// ─── ResultCard ──────────────────────────────────────────────────────────────

/** Status-related props, grouped for cleaner spread at call sites */
export type ResultStatus = {
  /** 0–100, drives the progress bar */
  gaugeValue: number;
  statusColor: string;
  statusBg: string;
  statusBarColor: string;
  statusLabel: string;
  statusIcon?: LucideIcon;
};

export interface ResultCardProps extends ResultStatus {
  label: string;
  value: string;
  subtitle?: string;
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
    <div className={`relative overflow-hidden rounded-3xl border border-line p-6 shadow-card ${statusBg}`}>
      {/* Decorative glow blob */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl ${statusBarColor}`}
      />

      <div className="relative z-10">
        {/* Status badge — top */}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-secondary text-[11px] font-bold uppercase tracking-[0.08em] ${statusBg} ${statusColor} border border-current/20`}>
          {Icon && <Icon className="h-3 w-3" />}
          {statusLabel}
        </span>

        {/* Label */}
        <p className="mt-4 font-secondary text-xs font-semibold uppercase tracking-[0.1em] text-muted/70">
          {label}
        </p>

        {/* Value — hero number */}
        <p className="mt-1 font-primary text-[36px] font-semibold leading-none tracking-[-1.5px] text-ink sm:text-[52px] sm:tracking-[-2.5px]">
          {value}
        </p>

        {subtitle && (
          <p className="mt-2 font-secondary text-sm text-muted">{subtitle}</p>
        )}

        {/* Progress bar */}
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${statusBarColor}`}
            style={{ width: `${clamped}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-secondary text-[10px] text-muted/60">
          <span>0</span>
          <span>{Math.round(clamped)}%</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}

// ─── Status helpers ───────────────────────────────────────────────────────────

type StatusResult = ResultStatus;

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

export function adEfficiencyStatus(roas: number, roasTarget: number): StatusResult {
  const gaugeValue = Math.min(100, (roas / Math.max(roasTarget * 1.5, 6)) * 100);
  const targetTercapai = roas >= roasTarget;
  if (roas <= 0)          return { gaugeValue: 0, statusColor: "text-red-600",   statusBg: "bg-red-50",    statusBarColor: "bg-red-500",    statusLabel: "Tidak ada return",          statusIcon: TrendingDown };
  if (roas < 1.0)         return { gaugeValue,    statusColor: "text-red-600",   statusBg: "bg-red-50",    statusBarColor: "bg-red-500",    statusLabel: "Rugi besar",                statusIcon: TrendingDown };
  if (!targetTercapai)    return { gaugeValue,    statusColor: "text-orange-600", statusBg: "bg-orange-50", statusBarColor: "bg-orange-400", statusLabel: "Di bawah target, evaluasi", statusIcon: AlertTriangle };
  if (roas >= roasTarget * 1.5) return { gaugeValue, statusColor: "text-green-700", statusBg: "bg-green-50", statusBarColor: "bg-green-500", statusLabel: "Sangat efektif",           statusIcon: TrendingUp };
  return                        { gaugeValue,    statusColor: "text-green-600",  statusBg: "bg-green-50",  statusBarColor: "bg-green-400",  statusLabel: "Target tercapai",           statusIcon: TrendingUp };
}
