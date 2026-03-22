import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Users, Search, BarChart3, Calendar } from "lucide-react";

const programs = ["B.Sc Nursing — Year 1", "B.Sc Nursing — Year 2", "GNM — Year 1", "GNM — Year 2", "Physiotherapy — Year 1"];

interface StudentRecord {
  id: string; name: string; course: string; totalClasses: number; present: number; absent: number; late: number; percentage: number;
}

const studentRecords: StudentRecord[] = [
  { id: "STU001", name: "Priya Sharma", course: "B.Sc Nursing", totalClasses: 120, present: 108, absent: 8, late: 4, percentage: 90 },
  { id: "STU002", name: "Rahul Verma", course: "B.Sc Nursing", totalClasses: 120, present: 96, absent: 18, late: 6, percentage: 80 },
  { id: "STU003", name: "Ananya Patel", course: "GNM", totalClasses: 120, present: 114, absent: 4, late: 2, percentage: 95 },
  { id: "STU005", name: "Meera Joshi", course: "Physiotherapy", totalClasses: 120, present: 84, absent: 30, late: 6, percentage: 70 },
  { id: "STU006", name: "Arjun Reddy", course: "B.Sc Nursing", totalClasses: 120, present: 78, absent: 36, late: 6, percentage: 65 },
  { id: "STU007", name: "Kavita Nair", course: "GNM", totalClasses: 120, present: 102, absent: 12, late: 6, percentage: 85 },
  { id: "STU009", name: "Sneha Iyer", course: "Physiotherapy", totalClasses: 120, present: 110, absent: 6, late: 4, percentage: 92 },
  { id: "STU010", name: "Amit Tiwari", course: "B.Sc Nursing", totalClasses: 120, present: 90, absent: 24, late: 6, percentage: 75 },
];

const monthlyData = [
  { month: "Jan 2025", workingDays: 24, avgPresent: 88, avgAbsent: 10, avgLate: 2 },
  { month: "Feb 2025", workingDays: 20, avgPresent: 85, avgAbsent: 12, avgLate: 3 },
  { month: "Mar 2025", workingDays: 22, avgPresent: 90, avgAbsent: 8, avgLate: 2 },
  { month: "Apr 2025", workingDays: 20, avgPresent: 82, avgAbsent: 15, avgLate: 3 },
  { month: "May 2025", workingDays: 18, avgPresent: 87, avgAbsent: 10, avgLate: 3 },
  { month: "Jun 2025", workingDays: 22, avgPresent: 91, avgAbsent: 7, avgLate: 2 },
];

const tabs = ["Student Records", "Monthly Summary"];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("Student Records");
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");

  const filtered = studentRecords.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchProgram = filterProgram === "all" || s.course.includes(filterProgram.split(" —")[0]);
    return matchSearch && matchProgram;
  });

  const avgAttendance = Math.round(studentRecords.reduce((a, s) => a + s.percentage, 0) / studentRecords.length);
  const belowThreshold = studentRecords.filter(s => s.percentage < 75).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Student Attendance</h1><p className="text-sm text-muted-foreground">View attendance records and monthly reports</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{studentRecords.length}</p><p className="text-sm text-muted-foreground">Total Students</p></div></div>
        <div className="kpi-card flex items-center gap-3"><BarChart3 className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{avgAttendance}%</p><p className="text-sm text-muted-foreground">Avg Attendance</p></div></div>
        <div className="kpi-card flex items-center gap-3"><CheckCircle2 className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{studentRecords.filter(s => s.percentage >= 75).length}</p><p className="text-sm text-muted-foreground">Above 75%</p></div></div>
        <div className="kpi-card flex items-center gap-3"><XCircle className="w-8 h-8 text-destructive" /><div><p className="text-xl font-display font-bold text-foreground">{belowThreshold}</p><p className="text-sm text-muted-foreground">Below 75%</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Student Records" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
            </div>
            <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
              <option value="all">All Programs</option>
              {programs.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">ID</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Course</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Total</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Present</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Absent</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Late</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Attendance %</th>
            </tr></thead><tbody>{filtered.map((s) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{s.id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{s.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{s.course}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{s.totalClasses}</td>
                <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">{s.present}</span></td>
                <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">{s.absent}</span></td>
                <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">{s.late}</span></td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-2"><div className={`rounded-full h-2 ${s.percentage >= 75 ? "bg-success" : "bg-destructive"}`} style={{ width: `${s.percentage}%` }} /></div>
                    <span className={`text-xs font-semibold ${s.percentage >= 75 ? "text-success" : "text-destructive"}`}>{s.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}</tbody></table></div>
          </div>
        </div>
      )}

      {activeTab === "Monthly Summary" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Month</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Working Days</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Avg Present %</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Avg Absent %</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Avg Late %</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Overall</th>
          </tr></thead><tbody>{monthlyData.map((m) => (
            <tr key={m.month} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{m.month}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{m.workingDays}</td>
              <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">{m.avgPresent}%</span></td>
              <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">{m.avgAbsent}%</span></td>
              <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">{m.avgLate}%</span></td>
              <td className="py-3 px-4 text-center">
                <div className="w-full bg-muted rounded-full h-2 max-w-[120px] mx-auto"><div className="bg-success rounded-full h-2" style={{ width: `${m.avgPresent}%` }} /></div>
              </td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}
    </div>
  );
}
