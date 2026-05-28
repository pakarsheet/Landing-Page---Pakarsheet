"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  month: string;
  orders: number;
  deals: number;
}

interface Props {
  data: DataPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-card text-xs">
      <p className="mb-1.5 font-semibold text-ink">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-muted capitalize">{p.name === "orders" ? "Inquiry" : "Deal"}</span>
          <span className="ml-auto font-bold text-ink">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function OrdersChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="flex h-[180px] items-center justify-center text-sm text-muted">
        Belum ada data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8bed02" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#8bed02" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradDeals" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#023ffc" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#023ffc" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#d9e2f4" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#4c5a73" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#4c5a73" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="orders"
          stroke="#8bed02"
          strokeWidth={2.5}
          fill="url(#gradOrders)"
          dot={false}
          activeDot={{ r: 4, fill: "#8bed02", strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="deals"
          stroke="#023ffc"
          strokeWidth={2}
          fill="url(#gradDeals)"
          dot={false}
          activeDot={{ r: 4, fill: "#023ffc", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
