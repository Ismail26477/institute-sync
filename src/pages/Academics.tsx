import { useState } from "react";
import { CalendarDays, Clock, Users, BookOpen, Plus, Search } from "lucide-react";

const tabs = ["Programs", "Timetable", "Attendance"];

const programsData = [
  { id: 1, name: "B.Sc Nursing", institute: "B.Sc Nursing", duration: "4 years", degree: "Bachelor", batches: 4, students: 520, seats: 150, intake: "August" },
  { id: 2, name: "GNM", institute: "GNM Nursing", duration: "3.5 years", degree: "Diploma", batches: 3, students: 380, seats: 100, intake: "August" },
  { id: 3, name: "BPT", institute: "Physiotherapy", duration: "4.5 years", degree: "Bachelor", batches: 4, students: 290, seats: 80, intake: "September" },
  { id: 4, name: "PB.B.Sc Nursing", institute: "PB.B.Sc", duration: "2 years", degree: "Bachelor", batches: 2, students: 180, seats: 60, intake: "August" },
  { id: 5, name: "M.Sc Nursing", institute: "M.Sc Nursing", duration: "2 years", degree: "Master", batches: 2, students: 160, seats: 40, intake: "September" },
  { id: 6, name: "ANM", institute: "ANM", duration: "2 years", degree: "Diploma", batches: 2, students: 240, seats: 80, intake: "August" },
  { id: 7, name: "OT Technology", institute: "OT Technology", duration: "2 years", degree: "Diploma", batches: 2, students: 120, seats: 40, intake: "August" },
];

const timetableData = [
  { time: "08:00 – 09:00", mon: "Anatomy", tue: "Physiology", wed: "Nursing Fund.", thu: "Anatomy Lab", fri: "Pharmacology" },
  { time: "09:00 – 10:00", mon: "Physiology", tue: "Anatomy", wed: "Community Health", thu: "Physiology Lab", fri: "Nursing Fund." },
  { time: "10:00 – 10:30", mon: "Break", tue: "Break", wed: "Break", thu: "Break", fri: "Break" },
  { time: "10:30 – 11:30", mon: "Pharmacology", tue: "Nursing Fund.", wed: "Anatomy", thu: "Library", fri: "Community Health" },
  { time: "11:30 – 12:30", mon: "Nursing Fund.", tue: "Community Health", wed: "Pharmacology", thu: "Tutorial", fri: "Anatomy" },
  { time: "12:30 – 01:30", mon: "Lunch", tue: "Lunch", wed: "Lunch", thu: "Lunch", fri: "Lunch" },
  { time: "01:30 – 03:30", mon: "Clinical Practice", tue: "Clinical Practice", wed: "Lab Session", thu: "Clinical Practice", fri: "Sports/Extra" },
];

const attendanceData = [
  { id: "STU001", name: "Priya Sharma", program: "B.Sc Year 2", total: 120, present: 108, percentage: 90 },
  { id: "STU002", name: "Rahul Verma", program: "GNM Year 1", total: 100, present: 82, percentage: 82 },
  { id: "STU003", name: "Ananya Patel", program: "BPT Year 3", total: 120, present: 96, percentage: 80 },
  { id: "STU005", name: "Meera Joshi", program: "M.Sc Year 2", total: 110, present: 104, percentage: 95 },
  { id: "STU006", name: "Arjun Reddy", program: "B.Sc Year 1", total: 90, present: 65, percentage: 72 },
  { id: "STU007", name: "Kavita Nair", program: "ANM Year 1", total: 95, present: 89, percentage: 94 },
  { id: "STU009", name: "Sneha Iyer", program: "B.Sc Year 3", total: 115, present: 105, percentage: 91 },
  { id: "STU010", name: "Amit Tiwari", program: "GNM Year 2", total: 100, present: 74, percentage: 74 },
];

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState("Programs");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Academics</h1>
          <p className="text-sm text-muted-foreground">Programs, timetables, and attendance management</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Add Program</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><BookOpen className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">7</p><p className="text-sm text-muted-foreground">Programs</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">2,847</p><p className="text-sm text-muted-foreground">Total Students</p></div></div>
        <div className="kpi-card flex items-center gap-3"><CalendarDays className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">19</p><p className="text-sm text-muted-foreground">Active Batches</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Clock className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">86.2%</p><p className="text-sm text-muted-foreground">Avg Attendance</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Programs" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Program</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Institute</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Duration</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Degree</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Batches</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Students</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Seats/Year</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Intake</th>
          </tr></thead><tbody>{programsData.map((p) => (
            <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
              <td className="py-3 px-4 text-muted-foreground">{p.institute}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{p.duration}</td>
              <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">{p.degree}</span></td>
              <td className="py-3 px-4 text-center text-foreground">{p.batches}</td>
              <td className="py-3 px-4 text-center font-medium text-foreground">{p.students}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{p.seats}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{p.intake}</td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "Timetable" && (
        <div className="animate-fade-in space-y-3">
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
              <option>B.Sc Nursing — Year 1</option>
              <option>GNM — Year 1</option>
              <option>BPT — Year 1</option>
            </select>
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Time</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Monday</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Tuesday</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Wednesday</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Thursday</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Friday</th>
            </tr></thead><tbody>{timetableData.map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground font-medium">{row.time}</td>
                {[row.mon, row.tue, row.wed, row.thu, row.fri].map((cell, j) => (
                  <td key={j} className={`py-3 px-4 text-center text-sm ${cell === "Break" || cell === "Lunch" ? "text-muted-foreground italic bg-muted/20" : "text-foreground font-medium"}`}>{cell}</td>
                ))}
              </tr>
            ))}</tbody></table></div>
          </div>
        </div>
      )}

      {activeTab === "Attendance" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">ID</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Program</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Total</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Present</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">%</th>
          </tr></thead><tbody>{attendanceData.map((a) => (
            <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{a.id}</td>
              <td className="py-3 px-4 font-medium text-foreground">{a.name}</td>
              <td className="py-3 px-4 text-muted-foreground">{a.program}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{a.total}</td>
              <td className="py-3 px-4 text-center text-foreground">{a.present}</td>
              <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.percentage >= 85 ? "bg-success/10 text-success" : a.percentage >= 75 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{a.percentage}%</span></td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}
    </div>
  );
}
