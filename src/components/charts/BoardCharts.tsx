import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#16875B", "#E7A11A", "#C93C43", "#12506A", "#19B5D1", "#667085"];

export function RubroBarChart({
  data,
  ariaLabel,
}: {
  data: Array<{ name: string; cobertura: number; documentos: number }>;
  ariaLabel: string;
}) {
  return (
    <div className="h-64 w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#D0DAE4" strokeDasharray="2 6" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#5C6B7A", fontSize: 11 }} tickLine={false} />
          <YAxis unit="%" tick={{ fill: "#5C6B7A", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="cobertura" name="Cobertura %" fill="#12506A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HealthPieChart({
  data,
  ariaLabel,
}: {
  data: Array<{ name: string; value: number }>;
  ariaLabel: string;
}) {
  return (
    <div className="h-64 w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
