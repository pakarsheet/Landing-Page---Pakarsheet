import { Check } from "lucide-react";
import { Button } from "./Button";

type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  ctaUrl: string;
  highlighted?: boolean;
};

export function PricingCard({ name, price, description, features, cta, ctaUrl, highlighted }: PricingCardProps) {
  return (
    <article
      className={`reveal-item relative rounded-3xl border p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft ${
        highlighted ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"
      }`}
    >
      {highlighted ? (
        <span className="absolute right-5 top-5 rounded-full bg-sheet px-3 py-1 text-xs font-bold text-ink">
          Paling populer
        </span>
      ) : null}
      <h3 className="font-primary text-2xl font-semibold leading-[1.25] tracking-[-0.6px]">{name}</h3>
      <p className={`mt-3 font-secondary text-base leading-[1.56] ${highlighted ? "text-white/72" : "text-muted"}`}>{description}</p>
      <div className="mt-7 flex items-end gap-2">
        <strong className="font-primary text-[40px] font-semibold leading-none tracking-[-1.8px]">{price}</strong>
        <span className={highlighted ? "pb-1 text-white/65" : "pb-1 text-muted"}>/sekali bayar</span>
      </div>
      <ul className="mt-7 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm font-medium">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${highlighted ? "bg-white text-ink" : "bg-leaf text-cobalt"}`}>
              <Check className="h-4 w-4" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Button href={ctaUrl} variant={highlighted ? "secondary" : "primary"} className="mt-8 w-full">
        {cta}
      </Button>
    </article>
  );
}
