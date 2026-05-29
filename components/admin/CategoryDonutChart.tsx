"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = ["#023ffc", "#8bed02", "#8b5cf6", "#f59e0b", "#ec4899", "#14b8a6"];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 shadow-card text-xs">
      <p className="font-semibold text-ink">{payload[0].name}</p>
      <p className="text-muted">{payload[0].value} produk</p>
    </div>
  );
}

export function CategoryDonutChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="flex h-[160px] items-center justify-center text-sm text-muted">
        Belum ada data
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <div className="shrink-0">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={62}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="truncate text-xs text-muted flex-1">{item.name}</span>
            <span className="text-xs font-bold text-ink">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
