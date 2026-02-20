import { useState } from "react";
import { BarChart3, TrendingUp, Users, GraduationCap, IndianRupee, CheckCircle2, Clock, BookOpen, Eye, LogIn } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const tabs = ["BI Dashboard", "Parent Portal"];

// BI Dashboard data
const collectionEfficiency = [
  { month: "Jan", target: 1200000, collected: 1050000, efficiency: 87.5 },
  { month: "Feb", target: 1000000, collected: 920000, efficiency: 92 },
  { month: "Mar", target: 1100000, collected: 1045000, efficiency: 95 },
  { month: "Apr", target: 900000, collected: 810000, efficiency: 90 },
  { month: "May", target: 1300000, collected: 1170000, efficiency: 90 },
  { month: "Jun", target: 1500000, collected: 1350000, efficiency: 90 },
];

const scholarshipImpact = [
  { name: "Merit", students: 34, amount: 520000 },
  { name: "SC/ST", students: 28, amount: 700000 },
  { name: "Need-Based", students: 45, amount: 675000 },
  { name: "Govt Scheme", students: 8, amount: 640000 },
  { name: "Mgmt Quota", students: 12, amount: 360000 },
];

const attendanceTrends = [
  { month: "Jan", bsc: 88, gnm: 85, bpt: 90, anm: 82 },
  { month: "Feb", bsc: 85, gnm: 82, bpt: 88, anm: 80 },
  { month: "Mar", bsc: 90, gnm: 87, bpt: 91, anm: 85 },
  { month: "Apr", bsc: 82, gnm: 78, bpt: 85, anm: 77 },
  { month: "May", bsc: 87, gnm: 84, bpt: 89, anm: 83 },
  { month: "Jun", bsc: 91, gnm: 88, bpt: 92, anm: 86 },
];

const instituteBreakdown = [
  { name: "B.Sc Nursing", students: 520, revenue: 4420000, attendance: 88 },
  { name: "GNM", students: 380, revenue: 2470000, attendance: 84 },
  { name: "Physiotherapy", students: 290, revenue: 2755000, attendance: 89 },
  { name: "PB.B.Sc", students: 180, revenue: 1296000, attendance: 86 },
  { name: "M.Sc Nursing", students: 160, revenue: 1760000, attendance: 91 },
  { name: "ANM", students: 240, revenue: 1152000, attendance: 83 },
  { name: "OT Technology", students: 120, revenue: 660000, attendance: 80 },
];

const COLORS = ["hsl(210, 90%, 55%)", "hsl(152, 60%, 45%)", "hsl(38, 92%, 55%)", "hsl(0, 72%, 55%)", "hsl(270, 60%, 55%)"];

// Parent portal mock
interface ParentView {
  studentId: string; name: string; program: string; batch: string; institute: string;
  attendance: { subject: string; total: number; present: number; pct: number }[];
  fees: { invoice: string; amount: number; paid: number; status: string }[];
  grades: { subject: string; marks: number; maxMarks: number; grade: string }[];
  notifications: { date: string; message: string; type: string }[];
}

const parentData: ParentView = {
  studentId: "STU001", name: "Priya Sharma", program: "B.Sc Nursing Year 2", batch: "2024-28", institute: "B.Sc Nursing",
  attendance: [
    { subject: "Anatomy", total: 30, present: 28, pct: 93 },
    { subject: "Physiology", total: 30, present: 27, pct: 90 },
    { subject: "Pharmacology", total: 28, present: 25, pct: 89 },
    { subject: "Nursing Fund.", total: 30, present: 29, pct: 97 },
    { subject: "Community Health", total: 26, present: 24, pct: 92 },
  ],
  fees: [
    { invoice: "INV-2025-001", amount: 85000, paid: 85000, status: "paid" },
    { invoice: "INV-2025-009", amount: 12000, paid: 0, status: "upcoming" },
  ],
  grades: [
    { subject: "Anatomy", marks: 88, maxMarks: 100, grade: "A" },
    { subject: "Physiology", marks: 92, maxMarks: 100, grade: "A+" },
    { subject: "Pharmacology", marks: 76, maxMarks: 100, grade: "B+" },
    { subject: "Nursing Fund.", marks: 85, maxMarks: 100, grade: "A" },
  ],
  notifications: [
    { date: "2025-06-18", message: "Mid-term exam results published. Your ward scored 85.25% overall.", type: "grades" },
    { date: "2025-06-15", message: "Fee payment of ₹85,000 received successfully. Receipt: RCP-001.", type: "fees" },
    { date: "2025-06-10", message: "Hostel mess menu updated for June. Check noticeboard for details.", type: "general" },
    { date: "2025-06-05", message: "Your ward had 97% attendance in Nursing Fundamentals this month.", type: "attendance" },
    { date: "2025-05-28", message: "Annual sports day on July 15. Parents invited.", type: "general" },
  ],
};

const feeStatusStyle: Record<string, string> = { paid: "bg-success/10 text-success", upcoming: "bg-info/10 text-info", overdue: "bg-destructive/10 text-destructive" };
const notifTypeIcon: Record<string, string> = { grades: "📊", fees: "💰", attendance: "📋", general: "📢" };

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("BI Dashboard");
  const [parentLoggedIn, setParentLoggedIn] = useState(false);
  const [parentId, setParentId] = useState("STU001");

  const avgEfficiency = (collectionEfficiency.reduce((a, b) => a + b.efficiency, 0) / collectionEfficiency.length).toFixed(1);
  const totalScholarship = scholarshipImpact.reduce((a, b) => a + b.amount, 0);
  const totalRevenue = instituteBreakdown.reduce((a, b) => a + b.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Analytics & Parent Portal</h1><p className="text-sm text-muted-foreground">BI dashboards and parent access</p></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "BI Dashboard" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="kpi-card flex items-center gap-3"><TrendingUp className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{avgEfficiency}%</p><p className="text-sm text-muted-foreground">Avg Collection Efficiency</p></div></div>
            <div className="kpi-card flex items-center gap-3"><IndianRupee className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</p><p className="text-sm text-muted-foreground">Total Revenue</p></div></div>
            <div className="kpi-card flex items-center gap-3"><GraduationCap className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{scholarshipImpact.reduce((a, b) => a + b.students, 0)}</p><p className="text-sm text-muted-foreground">Scholarship Recipients</p></div></div>
            <div className="kpi-card flex items-center gap-3"><BookOpen className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">₹{(totalScholarship / 100000).toFixed(1)}L</p><p className="text-sm text-muted-foreground">Scholarship Disbursed</p></div></div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Collection Efficiency (Monthly)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={collectionEfficiency}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} /><YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} /><Tooltip /><Bar dataKey="target" fill="hsl(var(--muted))" name="Target" radius={[4, 4, 0, 0]} /><Bar dataKey="collected" fill="hsl(210, 90%, 55%)" name="Collected" radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Scholarship Impact</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart><Pie data={scholarshipImpact} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="amount" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {scholarshipImpact.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Attendance Trends by Program</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceTrends}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} /><YAxis domain={[70, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} /><Tooltip /><Legend />
                  <Line type="monotone" dataKey="bsc" stroke="hsl(210, 90%, 55%)" name="B.Sc" strokeWidth={2} />
                  <Line type="monotone" dataKey="gnm" stroke="hsl(152, 60%, 45%)" name="GNM" strokeWidth={2} />
                  <Line type="monotone" dataKey="bpt" stroke="hsl(38, 92%, 55%)" name="BPT" strokeWidth={2} />
                  <Line type="monotone" dataKey="anm" stroke="hsl(0, 72%, 55%)" name="ANM" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Institute-wise Summary</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-muted-foreground text-xs uppercase">Institute</th>
                <th className="text-center py-2 px-2 text-muted-foreground text-xs uppercase">Students</th>
                <th className="text-right py-2 px-2 text-muted-foreground text-xs uppercase">Revenue</th>
                <th className="text-center py-2 px-2 text-muted-foreground text-xs uppercase">Attendance</th>
              </tr></thead><tbody>{instituteBreakdown.map((inst) => (
                <tr key={inst.name} className="border-b border-border/50">
                  <td className="py-2 px-2 text-foreground text-xs font-medium">{inst.name}</td>
                  <td className="py-2 px-2 text-center text-muted-foreground text-xs">{inst.students}</td>
                  <td className="py-2 px-2 text-right text-foreground text-xs">₹{(inst.revenue / 100000).toFixed(1)}L</td>
                  <td className="py-2 px-2 text-center"><span className={`text-xs px-1.5 py-0.5 rounded-full ${inst.attendance >= 85 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{inst.attendance}%</span></td>
                </tr>
              ))}</tbody></table></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Parent Portal" && (
        <div className="animate-fade-in">
          {!parentLoggedIn ? (
            <div className="max-w-md mx-auto bg-card rounded-xl border border-border/50 shadow-card p-8 text-center">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4"><Users className="w-8 h-8 text-primary-foreground" /></div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">Parent Portal Login</h3>
              <p className="text-sm text-muted-foreground mb-6">Enter your ward's Student ID to view their academic details</p>
              <input value={parentId} onChange={(e) => setParentId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none mb-4" placeholder="Enter Student ID (e.g. STU001)" />
              <button onClick={() => { setParentLoggedIn(true); toast.success("Welcome to Parent Portal!"); }} className="w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><LogIn className="w-4 h-4" /> View Dashboard</button>
              <p className="text-xs text-muted-foreground mt-3">Demo: Use STU001 for Priya Sharma</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center"><GraduationCap className="w-6 h-6 text-primary-foreground" /></div>
                  <div><h3 className="font-display font-bold text-foreground">{parentData.name}</h3><p className="text-sm text-muted-foreground">{parentData.studentId} · {parentData.program} · {parentData.institute}</p></div>
                </div>
                <button onClick={() => setParentLoggedIn(false)} className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Logout</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Attendance */}
                <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Attendance</h3>
                  <div className="space-y-2">{parentData.attendance.map((a) => (
                    <div key={a.subject} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <span className="text-sm text-foreground">{a.subject}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2"><div className={`rounded-full h-2 ${a.pct >= 85 ? "bg-success" : a.pct >= 75 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${a.pct}%` }} /></div>
                        <span className={`text-xs font-medium ${a.pct >= 85 ? "text-success" : a.pct >= 75 ? "text-warning" : "text-destructive"}`}>{a.pct}%</span>
                      </div>
                    </div>
                  ))}</div>
                </div>

                {/* Grades */}
                <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Grades</h3>
                  <div className="space-y-2">{parentData.grades.map((g) => (
                    <div key={g.subject} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <span className="text-sm text-foreground">{g.subject}</span>
                      <div className="flex items-center gap-3"><span className="text-sm text-muted-foreground">{g.marks}/{g.maxMarks}</span><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${g.marks >= 80 ? "bg-success/10 text-success" : g.marks >= 60 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{g.grade}</span></div>
                    </div>
                  ))}</div>
                </div>

                {/* Fees */}
                <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-warning" /> Fee Status</h3>
                  <div className="space-y-2">{parentData.fees.map((f) => (
                    <div key={f.invoice} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div><span className="text-sm font-medium text-foreground">{f.invoice}</span><p className="text-xs text-muted-foreground">₹{f.amount.toLocaleString("en-IN")}</p></div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${feeStatusStyle[f.status]}`}>{f.status}</span>
                    </div>
                  ))}</div>
                </div>

                {/* Notifications */}
                <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-info" /> Notifications</h3>
                  <div className="space-y-2">{parentData.notifications.map((n, i) => (
                    <div key={i} className="p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-start gap-2"><span className="text-sm">{notifTypeIcon[n.type]}</span><div><p className="text-xs text-foreground">{n.message}</p><p className="text-[10px] text-muted-foreground mt-0.5">{n.date}</p></div></div>
                    </div>
                  ))}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
