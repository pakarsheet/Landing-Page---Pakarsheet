"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ToolMeta } from "@/lib/tools";

const previewData: Record<string, { label: string; value: string; sub: string }> = {
  "kalkulator-margin": {
    label: "Margin Keuntungan",
    value: "37,5%",
    sub: "Sangat sehat ↑",
  },
  "kalkulator-hpp": {
    label: "HPP per Unit",
    value: "Rp 45.000",
    sub: "Harga jual min Rp 64.286",
  },
  "kalkulator-harga-jual": {
    label: "Harga Jual Min",
    value: "Rp 73.529",
    sub: "Fee Shopee 5% sudah dipotong",
  },
  "kalkulator-roas": {
    label: "ROAS",
    value: "4,00x",
    sub: "Sangat profitable ↑",
  },
  "kalkulator-diskon-bertingkat": {
    label: "Biaya Efektif",
    value: "Rp 163.800",
    sub: "Hemat Rp 86.200 (34,5%)",
  },
  "kalkulator-profit-marketplace": {
    label: "Profit Bersih",
    value: "Rp 28.500",
    sub: "Margin 23,8% — Sehat",
  },
};

type Props = {
  tool: ToolMeta;
};

export function ToolCard({ tool }: Props) {
  const Icon = tool.icon;
  const preview = previewData[tool.slug];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tool-card group flex flex-col rounded-3xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tool.accent}`}>
            <Icon className="h-5 w-5" />
          </span>
          <span className="rounded-full border border-line bg-white px-2.5 py-1 font-secondary text-[11px] font-bold text-cobalt shadow-card">
            {tool.badge}
          </span>
        </div>

        {/* Title + desc */}
        <h2 className="mt-4 font-primary text-[20px] font-semibold leading-[1.25] tracking-[-0.4px] text-ink">
          {tool.title}
        </h2>
        <p className="mt-1.5 flex-1 font-secondary text-sm leading-[1.56] text-muted">
          {tool.description}
        </p>

        {/* Preview result */}
        {preview && (
          <div className="mt-5 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-card">
            <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              {preview.label}
            </p>
            <p className="mt-1 font-primary text-[24px] font-semibold leading-none tracking-[-0.8px] text-ink">
              {preview.value}
            </p>
            <p className="mt-1 font-secondary text-[11px] text-muted">{preview.sub}</p>
          </div>
        )}

        {/* CTA row */}
        <div className="mt-5 flex items-center justify-between">
          <span className="font-secondary text-sm font-semibold text-cobalt transition duration-300 group-hover:text-ink">
            Hitung sekarang
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white shadow-card transition duration-300 group-hover:border-ink group-hover:bg-ink">
            <ArrowRight className="h-3.5 w-3.5 text-muted transition duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
          </span>
        </div>
      </div>
    </Link>
  );
}
