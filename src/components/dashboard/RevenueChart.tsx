import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "1 Jan", revenue: 185000 },
  { date: "5 Jan", revenue: 220000 },
  { date: "10 Jan", revenue: 195000 },
  { date: "15 Jan", revenue: 310000 },
  { date: "20 Jan", revenue: 280000 },
  { date: "25 Jan", revenue: 350000 },
  { date: "30 Jan", revenue: 420000 },
  { date: "5 Feb", revenue: 380000 },
  { date: "10 Feb", revenue: 290000 },
  { date: "15 Feb", revenue: 445000 },
  { date: "20 Feb", revenue: 520000 },
  { date: "23 Feb", revenue: 480000 },
];

const formatCurrency = (val: number) =>
  `₹${(val / 1000).toFixed(0)}K`;

export function RevenueChart() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-foreground">Revenue Trend</h3>
          <p className="text-sm text-muted-foreground">Daily collections – last 30 days</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          {["7D", "30D", "90D"].map((f) => (
            <button
              key={f}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                f === "30D"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(210, 90%, 55%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(210, 90%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`, "Revenue"]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid hsl(210, 20%, 90%)",
                boxShadow: "0 4px 12px hsl(210, 20%, 50%, 0.1)",
                fontSize: "13px",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(210, 90%, 55%)"
              strokeWidth={2.5}
              fill="url(#blueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
