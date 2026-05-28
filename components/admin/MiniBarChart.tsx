"use client";

import { BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: { value: number }[];
  color?: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-white px-2.5 py-1.5 shadow-card text-xs font-semibold text-ink">
      {payload[0].value}
    </div>
  );
}

export function MiniBarChart({ data, color = "#8bed02" }: Props) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <BarChart data={data} barSize={6} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} />
        <Tooltip content={<CustomTooltip />} cursor={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
