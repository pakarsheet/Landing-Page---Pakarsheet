import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export function StatCard({ value, label, description, icon: Icon }: StatCardProps) {
  return (
    <article className="reveal-item rounded-3xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <strong className="block font-primary text-3xl font-semibold tracking-[-1px] text-ink">{value}</strong>
          <span className="mt-2 block font-secondary text-sm font-semibold text-ink">{label}</span>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf text-cobalt">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 font-secondary text-sm leading-[1.56] text-muted">{description}</p>
    </article>
  );
}
