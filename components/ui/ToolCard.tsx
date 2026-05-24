"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ToolMeta } from "@/lib/tools";

type Props = {
  tool: ToolMeta;
};

export function ToolCard({ tool }: Props) {
  const Icon = tool.icon;

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
