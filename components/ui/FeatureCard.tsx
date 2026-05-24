import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  className?: string;
};

export function FeatureCard({ icon: Icon, title, description, accent, className = "" }: FeatureCardProps) {
  return (
    <article className={`reveal-item group relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft ${className}`}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sheet/0 blur-2xl transition duration-500 group-hover:bg-sheet/35" />
      <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${accent}`}>
        <Icon className="h-6 w-6 transition duration-300 group-hover:-rotate-6" />
      </div>
      <h3 className="font-primary text-2xl font-semibold leading-[1.25] tracking-[-0.6px] text-ink">{title}</h3>
      <p className="mt-3 font-secondary text-base leading-[1.56] text-muted">{description}</p>
    </article>
  );
}
