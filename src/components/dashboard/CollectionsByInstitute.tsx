import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { institute: "B.Sc", collected: 820000, pending: 180000 },
  { institute: "GNM", collected: 650000, pending: 120000 },
  { institute: "Physio", collected: 540000, pending: 200000 },
  { institute: "PB.B.Sc", collected: 480000, pending: 90000 },
  { institute: "M.Sc", collected: 390000, pending: 150000 },
  { institute: "ANM", collected: 310000, pending: 80000 },
  { institute: "OT Tech", collected: 280000, pending: 60000 },
];

const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

export function CollectionsByInstitute() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-foreground">Collections by Institute</h3>
          <p className="text-sm text-muted-foreground">Current academic year</p>
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" vertical={false} />
            <XAxis dataKey="institute" tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid hsl(210, 20%, 90%)",
                boxShadow: "0 4px 12px hsl(210, 20%, 50%, 0.1)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="collected" name="Collected" fill="hsl(210, 90%, 55%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill="hsl(210, 60%, 85%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
