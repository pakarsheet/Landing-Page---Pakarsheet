"use client";

interface FunnelStep {
  label: string;
  count: number;
  color: string;
  bg: string;
}

interface Props {
  baru: number;
  dihubungi: number;
  negosiasi: number;
  deal: number;
  tidakJadi: number;
}

export function OrderFunnelChart({ baru, dihubungi, negosiasi, deal, tidakJadi }: Props) {
  const total = baru + dihubungi + negosiasi + deal + tidakJadi;

  const steps: FunnelStep[] = [
    { label: "Baru",       count: baru,       color: "#023ffc", bg: "bg-cobalt"  },
    { label: "Dihubungi",  count: dihubungi,  color: "#8b5cf6", bg: "bg-purple-500" },
    { label: "Negosiasi",  count: negosiasi,  color: "#f59e0b", bg: "bg-amber-400"  },
    { label: "Deal",       count: deal,       color: "#8bed02", bg: "bg-sheet"   },
    { label: "Tidak Jadi", count: tidakJadi,  color: "#d1d9e8", bg: "bg-line"    },
  ];

  const conversionRate = total > 0 ? Math.round((deal / total) * 100) : 0;

  return (
    <div className="space-y-3">
      {steps.map((step) => {
        const pct = total > 0 ? (step.count / total) * 100 : 0;
        return (
          <div key={step.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs font-semibold text-muted text-right">
              {step.label}
            </span>
            <div className="flex-1 h-7 rounded-lg bg-[#f4f6fb] overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-500"
                style={{ width: `${Math.max(pct, pct > 0 ? 4 : 0)}%`, background: step.color }}
              />
            </div>
            <span className="w-6 shrink-0 text-xs font-bold text-ink text-right">
              {step.count}
            </span>
          </div>
        );
      })}

      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f4f6fb] px-4 py-3">
        <span className="text-xs font-semibold text-muted">Conversion Rate</span>
        <span className="text-sm font-bold text-ink">{conversionRate}%</span>
      </div>
    </div>
  );
}
