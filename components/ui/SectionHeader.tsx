import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  icon?: LucideIcon;
};

export function SectionHeader({ eyebrow, title, description, align = "left", theme = "light", icon: Icon = Sparkles }: SectionHeaderProps) {
  const isDark = theme === "dark";

  return (
    <div className={`reveal-item max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 font-secondary text-sm font-semibold leading-none shadow-card ${isDark ? "bg-white text-ink" : "border border-line bg-white text-cobalt"}`}>
        <Icon className="h-4 w-4" />
        {eyebrow}
      </p>
      <h2 className={`text-balance font-primary text-[30px] font-semibold leading-[1.2] tracking-[-0.2px] sm:text-[40px] sm:tracking-[-1px] lg:text-[48px] lg:tracking-[-1.8px] ${isDark ? "text-white" : "text-ink"}`}>{title}</h2>
      <p className={`mt-4 text-pretty font-secondary text-[18px] font-normal leading-[1.56] ${isDark ? "text-white/68" : "text-muted"}`}>{description}</p>
    </div>
  );
}
