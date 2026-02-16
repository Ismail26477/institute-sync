import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "UPI", value: 42, color: "hsl(210, 90%, 55%)" },
  { name: "Card", value: 18, color: "hsl(195, 80%, 48%)" },
  { name: "Cash", value: 22, color: "hsl(152, 60%, 45%)" },
  { name: "NEFT/IMPS", value: 12, color: "hsl(38, 92%, 55%)" },
  { name: "Cheque", value: 6, color: "hsl(280, 60%, 60%)" },
];

export function PaymentModeMix() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-foreground">Payment Mode Mix</h3>
        <p className="text-sm text-muted-foreground">This month's distribution</p>
      </div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: number) => [`${val}%`]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid hsl(210, 20%, 90%)",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name} ({item.value}%)
          </div>
        ))}
      </div>
    </div>
  );
}
