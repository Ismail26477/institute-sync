import { useState } from "react";
import { BarChart3, Download, FileText, Mail, Clock, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const tabs = ["Revenue", "Dues Aging", "Scholarships", "Library", "Collection Efficiency"];

const dailyRevenue = [
  { date: "Mon", bsc: 120000, gnm: 85000, physio: 65000, other: 90000 },
  { date: "Tue", bsc: 95000, gnm: 72000, physio: 58000, other: 78000 },
  { date: "Wed", bsc: 140000, gnm: 95000, physio: 72000, other: 105000 },
  { date: "Thu", bsc: 110000, gnm: 88000, physio: 62000, other: 82000 },
  { date: "Fri", bsc: 165000, gnm: 110000, physio: 80000, other: 120000 },
  { date: "Sat", bsc: 85000, gnm: 60000, physio: 45000, other: 55000 },
];

const agingData = [
  { bucket: "0–7 days", count: 45, amount: 1850000 },
  { bucket: "8–30 days", count: 28, amount: 1240000 },
  { bucket: "31–60 days", count: 15, amount: 890000 },
  { bucket: "61–90 days", count: 8, amount: 520000 },
  { bucket: ">90 days", count: 5, amount: 380000 },
];

const scholarshipLedger = [
  { program: "B.Sc Nursing", sanctioned: 850000, utilized: 720000, students: 34 },
  { program: "GNM", sanctioned: 450000, utilized: 380000, students: 18 },
  { program: "BPT", sanctioned: 350000, utilized: 280000, students: 12 },
  { program: "M.Sc Nursing", sanctioned: 400000, utilized: 320000, students: 10 },
  { program: "ANM", sanctioned: 200000, utilized: 180000, students: 8 },
];

const collectionData = [
  { month: "Jul", target: 2500000, actual: 2350000 },
  { month: "Aug", target: 3200000, actual: 3450000 },
  { month: "Sep", target: 2800000, actual: 2600000 },
  { month: "Oct", target: 2000000, actual: 1850000 },
  { month: "Nov", target: 1500000, actual: 1420000 },
  { month: "Dec", target: 1800000, actual: 1750000 },
  { month: "Jan", target: 3500000, actual: 3200000 },
  { month: "Feb", target: 2200000, actual: 2100000 },
];

const scheduledReports = [
  { name: "Daily Revenue Summary", frequency: "Daily 8:30 AM", recipients: "Group Admin, Finance", lastSent: "2025-07-16 08:30" },
  { name: "Fees Due/Overdue Report", frequency: "Weekly Monday", recipients: "Institute Admins", lastSent: "2025-07-14 09:00" },
  { name: "Scholarship Ledger", frequency: "Monthly 1st", recipients: "Finance, Group Admin", lastSent: "2025-07-01 09:00" },
  { name: "Collection Efficiency", frequency: "Weekly Friday", recipients: "Group Admin", lastSent: "2025-07-11 17:00" },
  { name: "Library KPI Report", frequency: "Monthly 1st", recipients: "Librarians, Admin", lastSent: "2025-07-01 09:00" },
];

const formatCurrency = (val: number) => `₹${(val / 100000).toFixed(1)}L`;

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("Revenue");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Scheduled reports, analytics, and ad-hoc exports</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"><Download className="w-4 h-4" /> Export All</button>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
        <h3 className="font-display font-semibold text-foreground mb-3">Scheduled Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scheduledReports.map((r, i) => (
            <div key={i} className="p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium text-foreground text-sm">{r.name}</p>
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.frequency}</div>
                <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{r.recipients}</div>
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />Last: {r.lastSent}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Revenue" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card p-5 animate-fade-in">
          <h3 className="font-display font-semibold text-foreground mb-1">Daily Revenue by Institute</h3>
          <p className="text-sm text-muted-foreground mb-4">This week's breakdown</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`]} contentStyle={{ borderRadius: "10px", border: "1px solid hsl(210, 20%, 90%)", fontSize: "13px" }} />
                <Bar dataKey="bsc" name="B.Sc" fill="hsl(210, 90%, 55%)" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="gnm" name="GNM" fill="hsl(195, 80%, 48%)" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="physio" name="Physio" fill="hsl(152, 60%, 45%)" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="other" name="Others" fill="hsl(38, 92%, 55%)" radius={[2, 2, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "Dues Aging" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Aging Bucket</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Students</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Amount</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Visual</th>
          </tr></thead><tbody>{agingData.map((a, i) => (
            <tr key={i} className="border-b border-border/50">
              <td className="py-3 px-4 font-medium text-foreground">{a.bucket}</td>
              <td className="py-3 px-4 text-center text-foreground">{a.count}</td>
              <td className="py-3 px-4 text-right font-medium text-foreground">₹{a.amount.toLocaleString("en-IN")}</td>
              <td className="py-3 px-4"><div className="h-3 bg-muted rounded-full overflow-hidden w-40"><div className="h-full rounded-full" style={{ width: `${(a.amount / 1850000) * 100}%`, backgroundColor: i < 2 ? "hsl(210, 90%, 55%)" : i < 4 ? "hsl(38, 92%, 55%)" : "hsl(0, 72%, 55%)" }} /></div></td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "Scholarships" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Program</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Students</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Sanctioned</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Utilized</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Utilization %</th>
          </tr></thead><tbody>{scholarshipLedger.map((s, i) => {
            const pct = Math.round((s.utilized / s.sanctioned) * 100);
            return (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{s.program}</td>
                <td className="py-3 px-4 text-center text-foreground">{s.students}</td>
                <td className="py-3 px-4 text-right text-foreground">₹{s.sanctioned.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-medium text-foreground">₹{s.utilized.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pct >= 80 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{pct}%</span></td>
              </tr>
            );
          })}</tbody></table></div>
        </div>
      )}

      {activeTab === "Library" && (
        <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ label: "Books Issued", value: "342", sub: "This month" }, { label: "Return Rate", value: "96.2%", sub: "On-time returns" }, { label: "Overdue", value: "4", sub: "Currently overdue" }, { label: "Fine Collected", value: "₹930", sub: "This month" }, { label: "Top Title", value: "Fund. of Nursing", sub: "Most borrowed" }, { label: "Active Borrowers", value: "218", sub: "Unique students" }, { label: "New Additions", value: "45", sub: "Books this month" }, { label: "Reservations", value: "12", sub: "Pending holds" }].map((kpi, i) => (
            <div key={i} className="kpi-card"><p className="text-lg font-display font-bold text-foreground">{kpi.value}</p><p className="text-sm text-muted-foreground">{kpi.label}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></div>
          ))}
        </div>
      )}

      {activeTab === "Collection Efficiency" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card p-5 animate-fade-in">
          <h3 className="font-display font-semibold text-foreground mb-1">Target vs Actual Collections</h3>
          <p className="text-sm text-muted-foreground mb-4">Monthly comparison (AY 2025-26)</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: "hsl(215, 15%, 50%)" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`]} contentStyle={{ borderRadius: "10px", border: "1px solid hsl(210, 20%, 90%)", fontSize: "13px" }} />
                <Bar dataKey="target" name="Target" fill="hsl(210, 60%, 85%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="hsl(210, 90%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
