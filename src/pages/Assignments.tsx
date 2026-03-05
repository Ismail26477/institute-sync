import { useState } from "react";
import { BookOpen, Plus, Upload, Clock, CheckCircle, AlertTriangle, Users, Eye, FileText } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const assignmentsData = [
  { id: 1, title: "Anatomy Case Study Report", subject: "Anatomy", faculty: "Dr. Meena Sharma", dueDate: "2025-07-25", totalStudents: 60, submitted: 42, graded: 30, maxMarks: 50, rubric: ["Content (20)", "Analysis (15)", "Presentation (10)", "References (5)"], plagiarismCheck: true, status: "Active" },
  { id: 2, title: "Pharmacology Drug Interaction Chart", subject: "Pharmacology", faculty: "Dr. Sharma", dueDate: "2025-07-22", totalStudents: 60, submitted: 55, graded: 55, maxMarks: 30, rubric: ["Accuracy (15)", "Completeness (10)", "Formatting (5)"], plagiarismCheck: false, status: "Graded" },
  { id: 3, title: "Community Health Survey Project", subject: "Community Health", faculty: "Dr. Patil", dueDate: "2025-08-01", totalStudents: 45, submitted: 10, graded: 0, maxMarks: 100, rubric: ["Survey Design (25)", "Data Collection (25)", "Analysis (30)", "Report (20)"], plagiarismCheck: true, status: "Active" },
  { id: 4, title: "Nursing Care Plan - Diabetic Patient", subject: "Nursing Foundation", faculty: "Prof. Sunita Rao", dueDate: "2025-07-20", totalStudents: 60, submitted: 58, graded: 45, maxMarks: 40, rubric: ["Assessment (10)", "Diagnosis (10)", "Planning (10)", "Evaluation (10)"], plagiarismCheck: true, status: "Active" },
  { id: 5, title: "Microbiology Lab Report - Culture Techniques", subject: "Microbiology", faculty: "Dr. Anjali Desai", dueDate: "2025-07-18", totalStudents: 35, submitted: 35, graded: 35, maxMarks: 25, rubric: ["Methodology (10)", "Results (10)", "Conclusion (5)"], plagiarismCheck: false, status: "Graded" },
];

const submissionsData = [
  { id: 1, student: "Priya Sharma", rollNo: "BSN-2024-012", assignment: "Anatomy Case Study Report", submittedDate: "2025-07-20", file: "anatomy_case_study.pdf", marks: 42, plagiarism: 8, status: "Graded" },
  { id: 2, student: "Rahul Patil", rollNo: "BSN-2024-045", assignment: "Anatomy Case Study Report", submittedDate: "2025-07-21", file: "case_study_rahul.pdf", marks: null, plagiarism: 15, status: "Submitted" },
  { id: 3, student: "Sneha Deshmukh", rollNo: "GNM-2024-023", assignment: "Anatomy Case Study Report", submittedDate: "2025-07-22", file: "anatomy_sneha.pdf", marks: null, plagiarism: 45, status: "Flagged" },
  { id: 4, student: "Amit Kumar", rollNo: "BSN-2024-067", assignment: "Anatomy Case Study Report", submittedDate: null, file: null, marks: null, plagiarism: null, status: "Not Submitted" },
  { id: 5, student: "Kavita Joshi", rollNo: "PHY-2024-011", assignment: "Community Health Survey Project", submittedDate: "2025-07-18", file: "survey_kavita.pdf", marks: 85, plagiarism: 3, status: "Graded" },
];

const statusColors: Record<string, string> = { Active: "bg-success/10 text-success", Graded: "bg-primary/10 text-primary", Submitted: "bg-info/10 text-info", Flagged: "bg-destructive/10 text-destructive", "Not Submitted": "bg-muted text-muted-foreground" };

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<"assignments" | "submissions">("assignments");
  const [selectedAssignment, setSelectedAssignment] = useState<typeof assignmentsData[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Assignments & Projects</h1><p className="text-sm text-muted-foreground">Upload assignments, track submissions & grade with rubrics</p></div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"><Plus className="w-4 h-4" /> Create Assignment</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><BookOpen className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{assignmentsData.filter(a => a.status === "Active").length}</p><p className="text-sm text-muted-foreground">Active Assignments</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Upload className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{assignmentsData.reduce((s, a) => s + a.submitted, 0)}</p><p className="text-sm text-muted-foreground">Total Submissions</p></div></div>
        <div className="kpi-card flex items-center gap-3"><CheckCircle className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{assignmentsData.reduce((s, a) => s + a.graded, 0)}</p><p className="text-sm text-muted-foreground">Graded</p></div></div>
        <div className="kpi-card flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-destructive" /><div><p className="text-xl font-display font-bold text-foreground">{submissionsData.filter(s => s.status === "Flagged").length}</p><p className="text-sm text-muted-foreground">Plagiarism Flagged</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["assignments", "submissions"] as const).map(t => (
          <button key={t} onClick={() => { setActiveTab(t); setSelectedAssignment(null); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {activeTab === "assignments" && !selectedAssignment && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {assignmentsData.map(a => (
            <div key={a.id} onClick={() => setSelectedAssignment(a)} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold text-foreground">{a.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[a.status]}`}>{a.status}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3"><span>{a.subject}</span><span>·</span><span>{a.faculty}</span></div>
              <div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {a.dueDate}</span><span className="text-xs font-medium text-foreground">{a.maxMarks} marks</span></div>
              <div className="flex items-center justify-between mb-1"><span className="text-xs text-muted-foreground">{a.submitted}/{a.totalStudents} submitted</span><span className="text-xs text-muted-foreground">{Math.round((a.submitted / a.totalStudents) * 100)}%</span></div>
              <div className="w-full bg-muted rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: `${(a.submitted / a.totalStudents) * 100}%` }} /></div>
              <div className="flex items-center gap-2 mt-3">{a.plagiarismCheck && <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Plagiarism Check</span>}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "assignments" && selectedAssignment && (
        <div className="space-y-4 animate-fade-in">
          <button onClick={() => setSelectedAssignment(null)} className="text-sm text-primary font-medium hover:underline">← Back to assignments</button>
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
            <h2 className="text-xl font-display font-bold text-foreground mb-1">{selectedAssignment.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{selectedAssignment.subject} · {selectedAssignment.faculty}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div><p className="text-xs text-muted-foreground">Due Date</p><p className="text-sm font-medium text-foreground">{selectedAssignment.dueDate}</p></div>
              <div><p className="text-xs text-muted-foreground">Max Marks</p><p className="text-sm font-medium text-foreground">{selectedAssignment.maxMarks}</p></div>
              <div><p className="text-xs text-muted-foreground">Submitted</p><p className="text-sm font-medium text-foreground">{selectedAssignment.submitted}/{selectedAssignment.totalStudents}</p></div>
              <div><p className="text-xs text-muted-foreground">Graded</p><p className="text-sm font-medium text-foreground">{selectedAssignment.graded}/{selectedAssignment.submitted}</p></div>
            </div>
            <h4 className="font-medium text-foreground text-sm mb-2">Grading Rubric</h4>
            <div className="flex flex-wrap gap-2">{selectedAssignment.rubric.map(r => <span key={r} className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground">{r}</span>)}</div>
          </div>
        </div>
      )}

      {activeTab === "submissions" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Student</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Assignment</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Submitted</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Plagiarism</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Marks</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Status</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Actions</th>
          </tr></thead><tbody>{submissionsData.map(s => (
            <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
              <td className="py-3 px-4"><div><p className="font-medium text-foreground">{s.student}</p><p className="text-xs text-muted-foreground">{s.rollNo}</p></div></td>
              <td className="py-3 px-4 text-muted-foreground text-xs">{s.assignment}</td>
              <td className="py-3 px-4 text-muted-foreground text-xs">{s.submittedDate || "—"}</td>
              <td className="py-3 px-4 text-center">{s.plagiarism !== null ? <span className={`text-xs font-medium ${s.plagiarism > 30 ? "text-destructive" : s.plagiarism > 15 ? "text-warning" : "text-success"}`}>{s.plagiarism}%</span> : "—"}</td>
              <td className="py-3 px-4 text-center font-medium text-foreground">{s.marks !== null ? s.marks : "—"}</td>
              <td className="py-3 px-4 text-center"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[s.status]}`}>{s.status}</span></td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {s.file && <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground" title="View"><Eye className="w-4 h-4" /></button>}
                  {s.status === "Submitted" && <button onClick={() => toast.success("Grading panel opened")} className="text-xs px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20">Grade</button>}
                </div>
              </td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Assignment" onSubmit={() => { setModalOpen(false); toast.success("Assignment created"); }} submitLabel="Create">
        <FormField label="Title" required><input className={inputClass} placeholder="Assignment title" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Subject"><select className={selectClass}><option>Anatomy</option><option>Physiology</option><option>Pharmacology</option><option>Nursing Foundation</option><option>Community Health</option><option>Microbiology</option></select></FormField>
          <FormField label="Max Marks"><input className={inputClass} type="number" placeholder="50" /></FormField>
        </div>
        <FormField label="Due Date" required><input className={inputClass} type="date" /></FormField>
        <div className="flex items-center gap-2"><input type="checkbox" className="rounded border-border" defaultChecked /><span className="text-sm text-foreground">Enable Plagiarism Check</span></div>
        <FormField label="Rubric (comma separated)"><input className={inputClass} placeholder="Content (20), Analysis (15), Presentation (10)" /></FormField>
      </FormModal>
    </div>
  );
}
