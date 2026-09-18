import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TrendPoint = {
  period: string;
  cobertura: number;
  confianza: number;
  horas?: number;
  decisiones?: number;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-200 bg-surface-0 px-3 py-2 text-sm shadow-[var(--shadow-elevated)]">
      <p className="font-display font-semibold text-text-900">{label}</p>
      <ul className="mt-1 space-y-0.5">
        {payload.map((item) => (
          <li key={String(item.name)} className="flex items-center gap-2 text-text-700">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: item.color }}
              aria-hidden
            />
            {item.name}: <strong className="text-text-900">{item.value}</strong>
            {item.name === "Horas estimadas" ? "" : "%"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrendChart({
  data,
  ariaLabel,
}: {
  data: TrendPoint[];
  ariaLabel: string;
}) {
  return (
    <div className="h-72 w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillCobertura" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#12506A" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#12506A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillConfianza" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19B5D1" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#19B5D1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#D0DAE4" strokeDasharray="2 6" vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fill: "#5C6B7A", fontSize: 12, fontFamily: "IBM Plex Sans" }}
            axisLine={{ stroke: "#B3C0CD" }}
            tickLine={false}
          />
          <YAxis
            unit="%"
            domain={[50, 100]}
            tick={{ fill: "#5C6B7A", fontSize: 12, fontFamily: "IBM Plex Sans" }}
            axisLine={false}
            tickLine={false}
            width={42}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 13, fontFamily: "IBM Plex Sans", color: "#3D4B5A" }}
          />
          <Area
            type="monotone"
            dataKey="cobertura"
            name="Cobertura"
            stroke="transparent"
            fill="url(#fillCobertura)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="confianza"
            name="Confianza"
            stroke="transparent"
            fill="url(#fillConfianza)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="cobertura"
            name="Cobertura"
            stroke="#12506A"
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 0, fill: "#12506A" }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="confianza"
            name="Confianza"
            stroke="#19B5D1"
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 0, fill: "#19B5D1" }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
