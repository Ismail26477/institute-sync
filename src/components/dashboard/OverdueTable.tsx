const overdueData = [
  { id: 1, name: "Priya Sharma", institute: "B.Sc Nursing", amount: 45000, daysOverdue: 67, program: "B.Sc Year 2" },
  { id: 2, name: "Rahul Verma", institute: "GNM", amount: 38000, daysOverdue: 52, program: "GNM Year 1" },
  { id: 3, name: "Ananya Patel", institute: "Physiotherapy", amount: 62000, daysOverdue: 45, program: "BPT Year 3" },
  { id: 4, name: "Vikram Singh", institute: "PB.B.Sc", amount: 28000, daysOverdue: 38, program: "PB.B.Sc Year 1" },
  { id: 5, name: "Meera Joshi", institute: "M.Sc Nursing", amount: 55000, daysOverdue: 32, program: "M.Sc Year 2" },
  { id: 6, name: "Arjun Reddy", institute: "B.Sc Nursing", amount: 41000, daysOverdue: 28, program: "B.Sc Year 1" },
  { id: 7, name: "Kavita Nair", institute: "ANM", amount: 18000, daysOverdue: 25, program: "ANM Year 1" },
  { id: 8, name: "Deepak Gupta", institute: "OT Tech", amount: 22000, daysOverdue: 21, program: "OT Year 2" },
];

function AgingBadge({ days }: { days: number }) {
  const style =
    days > 60
      ? "bg-destructive/10 text-destructive"
      : days > 30
      ? "bg-warning/10 text-warning"
      : "bg-info/10 text-info";

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style}`}>
      {days}d
    </span>
  );
}

export function OverdueTable() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-foreground">Top Overdue Accounts</h3>
          <p className="text-sm text-muted-foreground">Sorted by days overdue</p>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">See all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
              <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Institute</th>
              <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Program</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Amount</th>
              <th className="text-center py-2.5 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Overdue</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {overdueData.map((row) => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-medium text-foreground">{row.name}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{row.institute}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{row.program}</td>
                <td className="py-2.5 px-3 text-right font-medium text-foreground">₹{row.amount.toLocaleString("en-IN")}</td>
                <td className="py-2.5 px-3 text-center">
                  <AgingBadge days={row.daysOverdue} />
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button className="text-xs text-primary font-medium hover:underline">Send Reminder</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
