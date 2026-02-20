import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Users, Bell, Calendar, Search, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const subjects = ["Anatomy", "Physiology", "Pharmacology", "Nursing Fundamentals", "Community Health"];
const programs = ["B.Sc Nursing — Year 1", "B.Sc Nursing — Year 2", "GNM — Year 1", "GNM — Year 2", "Physiotherapy — Year 1"];

interface StudentAttendance {
  id: string; name: string; phone: string; parentPhone: string; status: "present" | "absent" | "late" | "";
}

const initialStudents: StudentAttendance[] = [
  { id: "STU001", name: "Priya Sharma", phone: "+91 98765 11111", parentPhone: "+91 98765 00001", status: "" },
  { id: "STU002", name: "Rahul Verma", phone: "+91 98765 22222", parentPhone: "+91 98765 00002", status: "" },
  { id: "STU003", name: "Ananya Patel", phone: "+91 98765 33333", parentPhone: "+91 98765 00003", status: "" },
  { id: "STU005", name: "Meera Joshi", phone: "+91 98765 55555", parentPhone: "+91 98765 00005", status: "" },
  { id: "STU006", name: "Arjun Reddy", phone: "+91 98765 66666", parentPhone: "+91 98765 00006", status: "" },
  { id: "STU007", name: "Kavita Nair", phone: "+91 98765 77777", parentPhone: "+91 98765 00007", status: "" },
  { id: "STU009", name: "Sneha Iyer", phone: "+91 98765 99999", parentPhone: "+91 98765 00009", status: "" },
  { id: "STU010", name: "Amit Tiwari", phone: "+91 98765 00000", parentPhone: "+91 98765 00010", status: "" },
];

// Monthly summary data
const monthlyData = [
  { month: "Jan 2025", workingDays: 24, avgPresent: 88, avgAbsent: 10, avgLate: 2 },
  { month: "Feb 2025", workingDays: 20, avgPresent: 85, avgAbsent: 12, avgLate: 3 },
  { month: "Mar 2025", workingDays: 22, avgPresent: 90, avgAbsent: 8, avgLate: 2 },
  { month: "Apr 2025", workingDays: 20, avgPresent: 82, avgAbsent: 15, avgLate: 3 },
  { month: "May 2025", workingDays: 18, avgPresent: 87, avgAbsent: 10, avgLate: 3 },
  { month: "Jun 2025", workingDays: 22, avgPresent: 91, avgAbsent: 7, avgLate: 2 },
];

const tabs = ["Mark Attendance", "Monthly Reports", "Alerts Log"];

const alertsLog = [
  { id: 1, student: "Arjun Reddy", date: "2025-06-18", type: "SMS", parentPhone: "+91 98765 00006", message: "Your ward Arjun was absent on 18-Jun-2025 for Anatomy.", status: "sent" },
  { id: 2, student: "Amit Tiwari", date: "2025-06-18", type: "WhatsApp", parentPhone: "+91 98765 00010", message: "Your ward Amit was absent on 18-Jun-2025 for Physiology.", status: "sent" },
  { id: 3, student: "Ananya Patel", date: "2025-06-17", type: "SMS", parentPhone: "+91 98765 00003", message: "Your ward Ananya was late on 17-Jun-2025 for Pharmacology.", status: "sent" },
  { id: 4, student: "Arjun Reddy", date: "2025-06-16", type: "WhatsApp", parentPhone: "+91 98765 00006", message: "Your ward Arjun was absent on 16-Jun-2025 for Nursing Fund.", status: "delivered" },
  { id: 5, student: "Rahul Verma", date: "2025-06-15", type: "SMS", parentPhone: "+91 98765 00002", message: "Your ward Rahul has attendance below 75%. Please contact college.", status: "sent" },
];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("Mark Attendance");
  const [students, setStudents] = useState(initialStudents);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [selectedProgram, setSelectedProgram] = useState(programs[0]);
  const [submitted, setSubmitted] = useState(false);

  const markStatus = (id: string, status: "present" | "absent" | "late") => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const markAll = (status: "present" | "absent" | "late") => {
    setStudents(students.map(s => ({ ...s, status })));
  };

  const handleSubmit = () => {
    const unmarked = students.filter(s => !s.status);
    if (unmarked.length > 0) return toast.error(`${unmarked.length} students are unmarked`);
    const absentees = students.filter(s => s.status === "absent");
    setSubmitted(true);
    toast.success(`Attendance saved for ${selectedDate} · ${selectedSubject}`);
    if (absentees.length > 0) {
      setTimeout(() => {
        toast.info(`📱 SMS/WhatsApp alerts sent to ${absentees.length} parent(s) for absent students`);
      }, 1000);
    }
  };

  const resetAttendance = () => {
    setStudents(initialStudents.map(s => ({ ...s, status: "" as const })));
    setSubmitted(false);
  };

  const presentCount = students.filter(s => s.status === "present").length;
  const absentCount = students.filter(s => s.status === "absent").length;
  const lateCount = students.filter(s => s.status === "late").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Student Attendance</h1><p className="text-sm text-muted-foreground">Daily subject-wise attendance with parent alerts</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{students.length}</p><p className="text-sm text-muted-foreground">Total Students</p></div></div>
        <div className="kpi-card flex items-center gap-3"><CheckCircle2 className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{presentCount}</p><p className="text-sm text-muted-foreground">Present</p></div></div>
        <div className="kpi-card flex items-center gap-3"><XCircle className="w-8 h-8 text-destructive" /><div><p className="text-xl font-display font-bold text-foreground">{absentCount}</p><p className="text-sm text-muted-foreground">Absent</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Clock className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{lateCount}</p><p className="text-sm text-muted-foreground">Late</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Mark Attendance" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center gap-3">
            <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
              {programs.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" />
            <div className="flex gap-1 ml-auto">
              <button onClick={() => markAll("present")} className="px-3 py-2 rounded-lg bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors">All Present</button>
              <button onClick={() => markAll("absent")} className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">All Absent</button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">ID</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Actions</th>
            </tr></thead><tbody>{students.map((s) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{s.id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{s.name}</td>
                <td className="py-3 px-4 text-center">
                  {s.status === "present" && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">Present</span>}
                  {s.status === "absent" && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Absent</span>}
                  {s.status === "late" && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">Late</span>}
                  {!s.status && <span className="text-xs text-muted-foreground">—</span>}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button disabled={submitted} onClick={() => markStatus(s.id, "present")} className={`p-1.5 rounded-md transition-colors ${s.status === "present" ? "bg-success text-success-foreground" : "hover:bg-success/10 text-muted-foreground"}`} title="Present"><CheckCircle2 className="w-4 h-4" /></button>
                    <button disabled={submitted} onClick={() => markStatus(s.id, "absent")} className={`p-1.5 rounded-md transition-colors ${s.status === "absent" ? "bg-destructive text-destructive-foreground" : "hover:bg-destructive/10 text-muted-foreground"}`} title="Absent"><XCircle className="w-4 h-4" /></button>
                    <button disabled={submitted} onClick={() => markStatus(s.id, "late")} className={`p-1.5 rounded-md transition-colors ${s.status === "late" ? "bg-warning text-warning-foreground" : "hover:bg-warning/10 text-muted-foreground"}`} title="Late"><Clock className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}</tbody></table></div>
          </div>

          <div className="flex justify-end gap-2">
            {submitted ? (
              <button onClick={resetAttendance} className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">Reset & Mark Again</button>
            ) : (
              <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">Submit Attendance & Send Alerts</button>
            )}
          </div>
        </div>
      )}

      {activeTab === "Monthly Reports" && (
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

      {activeTab === "Alerts Log" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 p-3 bg-info/10 rounded-lg border border-info/20">
            <Bell className="w-5 h-5 text-info shrink-0" />
            <p className="text-sm text-info">Auto SMS/WhatsApp alerts are sent to parents when a student is marked absent. Below is the log of all sent notifications.</p>
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Date</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Type</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Parent Phone</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Message</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
            </tr></thead><tbody>{alertsLog.map((a) => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{a.student}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{a.date}</td>
                <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.type === "SMS" ? "bg-info/10 text-info" : "bg-success/10 text-success"}`}>{a.type}</span></td>
                <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{a.parentPhone}</td>
                <td className="py-3 px-4 text-muted-foreground text-xs max-w-[300px] truncate">{a.message}</td>
                <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success capitalize">{a.status}</span></td>
              </tr>
            ))}</tbody></table></div>
          </div>
        </div>
      )}
    </div>
  );
}
