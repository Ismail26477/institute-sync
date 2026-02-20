import { useState } from "react";
import { ClipboardList, Plus, Download, Eye, FileText, Award } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const tabs = ["Exams", "Mark Entry", "Report Cards"];

const subjects = ["Anatomy", "Physiology", "Pharmacology", "Nursing Fundamentals", "Community Health", "Microbiology", "Biochemistry", "Pathology"];
const programs = ["B.Sc Nursing", "GNM", "Physiotherapy", "PB.B.Sc", "M.Sc Nursing", "ANM", "OT Technology"];

const gradeMap = (pct: number) => {
  if (pct >= 90) return { grade: "A+", gpa: 10 };
  if (pct >= 80) return { grade: "A", gpa: 9 };
  if (pct >= 70) return { grade: "B+", gpa: 8 };
  if (pct >= 60) return { grade: "B", gpa: 7 };
  if (pct >= 50) return { grade: "C", gpa: 6 };
  if (pct >= 40) return { grade: "D", gpa: 5 };
  return { grade: "F", gpa: 0 };
};

interface Exam {
  id: number; name: string; program: string; semester: string; date: string; totalMarks: number; subjects: string[]; status: string;
}

interface MarkEntry {
  studentId: string; studentName: string; subject: string; maxMarks: number; obtained: number; percentage: number; grade: string; gpa: number;
}

const initialExams: Exam[] = [
  { id: 1, name: "Mid-Term Exam 2025", program: "B.Sc Nursing", semester: "Semester 3", date: "2025-09-15", totalMarks: 100, subjects: ["Anatomy", "Physiology", "Pharmacology", "Nursing Fundamentals"], status: "completed" },
  { id: 2, name: "End-Term Exam 2025", program: "B.Sc Nursing", semester: "Semester 3", date: "2025-12-10", totalMarks: 100, subjects: ["Anatomy", "Physiology", "Pharmacology", "Nursing Fundamentals", "Community Health"], status: "upcoming" },
  { id: 3, name: "Internal Assessment 1", program: "GNM", semester: "Semester 2", date: "2025-08-20", totalMarks: 50, subjects: ["Anatomy", "Physiology", "Community Health"], status: "completed" },
  { id: 4, name: "Practical Exam 2025", program: "Physiotherapy", semester: "Semester 5", date: "2025-10-05", totalMarks: 100, subjects: ["Pathology", "Pharmacology", "Anatomy"], status: "ongoing" },
];

const initialMarks: MarkEntry[] = [
  { studentId: "STU001", studentName: "Priya Sharma", subject: "Anatomy", maxMarks: 100, obtained: 88, percentage: 88, grade: "A", gpa: 9 },
  { studentId: "STU001", studentName: "Priya Sharma", subject: "Physiology", maxMarks: 100, obtained: 92, percentage: 92, grade: "A+", gpa: 10 },
  { studentId: "STU001", studentName: "Priya Sharma", subject: "Pharmacology", maxMarks: 100, obtained: 76, percentage: 76, grade: "B+", gpa: 8 },
  { studentId: "STU001", studentName: "Priya Sharma", subject: "Nursing Fundamentals", maxMarks: 100, obtained: 85, percentage: 85, grade: "A", gpa: 9 },
  { studentId: "STU002", studentName: "Rahul Verma", subject: "Anatomy", maxMarks: 100, obtained: 62, percentage: 62, grade: "B", gpa: 7 },
  { studentId: "STU002", studentName: "Rahul Verma", subject: "Physiology", maxMarks: 100, obtained: 55, percentage: 55, grade: "C", gpa: 6 },
  { studentId: "STU002", studentName: "Rahul Verma", subject: "Pharmacology", maxMarks: 100, obtained: 71, percentage: 71, grade: "B+", gpa: 8 },
  { studentId: "STU002", studentName: "Rahul Verma", subject: "Nursing Fundamentals", maxMarks: 100, obtained: 68, percentage: 68, grade: "B", gpa: 7 },
  { studentId: "STU003", studentName: "Ananya Patel", subject: "Anatomy", maxMarks: 100, obtained: 45, percentage: 45, grade: "D", gpa: 5 },
  { studentId: "STU003", studentName: "Ananya Patel", subject: "Physiology", maxMarks: 100, obtained: 52, percentage: 52, grade: "C", gpa: 6 },
  { studentId: "STU005", studentName: "Meera Joshi", subject: "Anatomy", maxMarks: 100, obtained: 95, percentage: 95, grade: "A+", gpa: 10 },
  { studentId: "STU005", studentName: "Meera Joshi", subject: "Physiology", maxMarks: 100, obtained: 91, percentage: 91, grade: "A+", gpa: 10 },
];

const statusStyle: Record<string, string> = { completed: "bg-success/10 text-success", upcoming: "bg-info/10 text-info", ongoing: "bg-warning/10 text-warning" };

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState("Exams");
  const [exams, setExams] = useState(initialExams);
  const [marks, setMarks] = useState(initialMarks);
  const [modalOpen, setModalOpen] = useState(false);
  const [markModalOpen, setMarkModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", program: "B.Sc Nursing", semester: "", date: "", totalMarks: "100", subjects: "" });
  const [markForm, setMarkForm] = useState({ studentId: "", studentName: "", subject: "Anatomy", maxMarks: "100", obtained: "" });

  const handleAddExam = () => {
    if (!form.name || !form.semester) return toast.error("Exam name and semester are required");
    const subjectList = form.subjects ? form.subjects.split(",").map(s => s.trim()) : [];
    setExams([...exams, { id: Date.now(), name: form.name, program: form.program, semester: form.semester, date: form.date, totalMarks: Number(form.totalMarks), subjects: subjectList, status: "upcoming" }]);
    setModalOpen(false);
    setForm({ name: "", program: "B.Sc Nursing", semester: "", date: "", totalMarks: "100", subjects: "" });
    toast.success(`Exam "${form.name}" created`);
  };

  const handleAddMark = () => {
    if (!markForm.studentId || !markForm.obtained) return toast.error("Student ID and marks are required");
    const obtained = Number(markForm.obtained);
    const max = Number(markForm.maxMarks);
    const pct = Math.round((obtained / max) * 100);
    const { grade, gpa } = gradeMap(pct);
    setMarks([...marks, { studentId: markForm.studentId, studentName: markForm.studentName || markForm.studentId, subject: markForm.subject, maxMarks: max, obtained, percentage: pct, grade, gpa }]);
    setMarkModalOpen(false);
    setMarkForm({ studentId: "", studentName: "", subject: "Anatomy", maxMarks: "100", obtained: "" });
    toast.success(`Marks entered: ${markForm.studentId} → ${markForm.subject}: ${obtained}/${max} (${grade})`);
  };

  // Report card data
  const studentIds = [...new Set(marks.map(m => m.studentId))];
  const reportCards = studentIds.map(sid => {
    const entries = marks.filter(m => m.studentId === sid);
    const name = entries[0]?.studentName || sid;
    const totalObt = entries.reduce((a, b) => a + b.obtained, 0);
    const totalMax = entries.reduce((a, b) => a + b.maxMarks, 0);
    const avgPct = totalMax > 0 ? Math.round((totalObt / totalMax) * 100) : 0;
    const avgGpa = entries.length > 0 ? (entries.reduce((a, b) => a + b.gpa, 0) / entries.length).toFixed(1) : "0";
    const { grade } = gradeMap(avgPct);
    return { studentId: sid, name, subjects: entries.length, totalObt, totalMax, avgPct, avgGpa, grade, entries };
  });

  const handleDownloadTranscript = (card: typeof reportCards[0]) => {
    const lines = [
      "═══════════════════════════════════════",
      "          ACADEMIC TRANSCRIPT          ",
      "═══════════════════════════════════════",
      `Student: ${card.name}  (${card.studentId})`,
      `Date: ${new Date().toLocaleDateString("en-IN")}`,
      "",
      "Subject               Marks    Grade  GPA",
      "─────────────────────────────────────────",
      ...card.entries.map(e => `${e.subject.padEnd(22)}${String(e.obtained).padStart(3)}/${e.maxMarks}   ${e.grade.padEnd(5)}  ${e.gpa}`),
      "─────────────────────────────────────────",
      `TOTAL                 ${card.totalObt}/${card.totalMax}`,
      `PERCENTAGE            ${card.avgPct}%`,
      `CGPA                  ${card.avgGpa}`,
      `OVERALL GRADE         ${card.grade}`,
      "═══════════════════════════════════════",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `Transcript_${card.studentId}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Transcript downloaded for ${card.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Exams & Grading</h1><p className="text-sm text-muted-foreground">Create exams, enter marks, generate report cards</p></div>
        <div className="flex gap-2">
          {activeTab === "Mark Entry" && (
            <button onClick={() => setMarkModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Enter Marks</button>
          )}
          {activeTab === "Exams" && (
            <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Create Exam</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><ClipboardList className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{exams.length}</p><p className="text-sm text-muted-foreground">Total Exams</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Award className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{exams.filter(e => e.status === "completed").length}</p><p className="text-sm text-muted-foreground">Completed</p></div></div>
        <div className="kpi-card flex items-center gap-3"><FileText className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{marks.length}</p><p className="text-sm text-muted-foreground">Marks Entered</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Award className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{reportCards.length > 0 ? reportCards.reduce((a, b) => a + Number(b.avgGpa), 0) / reportCards.length : 0}</p><p className="text-sm text-muted-foreground">Avg GPA</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Exams" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Exam</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Program</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Semester</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Date</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Total Marks</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Subjects</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
          </tr></thead><tbody>{exams.map((ex) => (
            <tr key={ex.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{ex.name}</td>
              <td className="py-3 px-4 text-muted-foreground">{ex.program}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{ex.semester}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{ex.date}</td>
              <td className="py-3 px-4 text-center text-foreground">{ex.totalMarks}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{ex.subjects.length}</td>
              <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle[ex.status]}`}>{ex.status}</span></td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "Mark Entry" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student ID</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Subject</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Marks</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">%</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Grade</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">GPA</th>
          </tr></thead><tbody>{marks.map((m, i) => (
            <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{m.studentId}</td>
              <td className="py-3 px-4 font-medium text-foreground">{m.studentName}</td>
              <td className="py-3 px-4 text-muted-foreground">{m.subject}</td>
              <td className="py-3 px-4 text-center text-foreground">{m.obtained}/{m.maxMarks}</td>
              <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.percentage >= 75 ? "bg-success/10 text-success" : m.percentage >= 50 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{m.percentage}%</span></td>
              <td className="py-3 px-4 text-center font-bold text-foreground">{m.grade}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{m.gpa}</td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "Report Cards" && (
        <div className="space-y-4 animate-fade-in">
          {reportCards.map((card) => (
            <div key={card.studentId} className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center"><Award className="w-5 h-5 text-primary-foreground" /></div>
                  <div><h3 className="font-display font-semibold text-foreground">{card.name}</h3><p className="text-xs text-muted-foreground">{card.studentId} · {card.subjects} subjects</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right"><p className="text-2xl font-display font-bold text-foreground">{card.avgGpa}</p><p className="text-xs text-muted-foreground">CGPA</p></div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${Number(card.avgPct) >= 75 ? "bg-success/10 text-success" : Number(card.avgPct) >= 50 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{card.grade}</span>
                </div>
              </div>

              {selectedStudent === card.studentId ? (
                <div className="space-y-3">
                  <table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-2 px-3 text-muted-foreground text-xs uppercase">Subject</th>
                    <th className="text-center py-2 px-3 text-muted-foreground text-xs uppercase">Marks</th>
                    <th className="text-center py-2 px-3 text-muted-foreground text-xs uppercase">%</th>
                    <th className="text-center py-2 px-3 text-muted-foreground text-xs uppercase">Grade</th>
                    <th className="text-center py-2 px-3 text-muted-foreground text-xs uppercase">GPA</th>
                  </tr></thead><tbody>{card.entries.map((e, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 px-3 text-foreground">{e.subject}</td>
                      <td className="py-2 px-3 text-center">{e.obtained}/{e.maxMarks}</td>
                      <td className="py-2 px-3 text-center"><span className={`text-xs px-2 py-0.5 rounded-full ${e.percentage >= 75 ? "bg-success/10 text-success" : e.percentage >= 50 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{e.percentage}%</span></td>
                      <td className="py-2 px-3 text-center font-bold">{e.grade}</td>
                      <td className="py-2 px-3 text-center text-muted-foreground">{e.gpa}</td>
                    </tr>
                  ))}</tbody></table>
                  <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                    <div className="text-sm"><span className="text-muted-foreground">Total: </span><span className="font-bold text-foreground">{card.totalObt}/{card.totalMax}</span><span className="text-muted-foreground ml-4">Percentage: </span><span className="font-bold text-foreground">{card.avgPct}%</span></div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDownloadTranscript(card)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"><Download className="w-3.5 h-3.5" /> Download Transcript</button>
                      <button onClick={() => setSelectedStudent(null)} className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted">Collapse</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                  <div className="text-sm"><span className="text-muted-foreground">Percentage: </span><span className="font-bold text-foreground">{card.avgPct}%</span><span className="text-muted-foreground ml-4">Total: </span><span className="font-bold text-foreground">{card.totalObt}/{card.totalMax}</span></div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedStudent(card.studentId)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted"><Eye className="w-3.5 h-3.5" /> View Details</button>
                    <button onClick={() => handleDownloadTranscript(card)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"><Download className="w-3.5 h-3.5" /> Transcript</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Exam" onSubmit={handleAddExam} submitLabel="Create Exam">
        <FormField label="Exam Name" required><input className={inputClass} placeholder="e.g. Mid-Term Exam 2025" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Program"><select className={selectClass} value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })}>{programs.map(p => <option key={p} value={p}>{p}</option>)}</select></FormField>
          <FormField label="Semester" required><input className={inputClass} placeholder="e.g. Semester 3" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date"><input className={inputClass} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
          <FormField label="Total Marks"><input className={inputClass} type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} /></FormField>
        </div>
        <FormField label="Subjects (comma-separated)"><input className={inputClass} placeholder="Anatomy, Physiology, ..." value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} /></FormField>
      </FormModal>

      <FormModal open={markModalOpen} onClose={() => setMarkModalOpen(false)} title="Enter Marks" onSubmit={handleAddMark} submitLabel="Save Marks">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Student ID" required><input className={inputClass} placeholder="STU001" value={markForm.studentId} onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })} /></FormField>
          <FormField label="Student Name"><input className={inputClass} placeholder="Student name" value={markForm.studentName} onChange={(e) => setMarkForm({ ...markForm, studentName: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Subject"><select className={selectClass} value={markForm.subject} onChange={(e) => setMarkForm({ ...markForm, subject: e.target.value })}>{subjects.map(s => <option key={s} value={s}>{s}</option>)}</select></FormField>
          <FormField label="Max Marks"><input className={inputClass} type="number" value={markForm.maxMarks} onChange={(e) => setMarkForm({ ...markForm, maxMarks: e.target.value })} /></FormField>
          <FormField label="Obtained" required><input className={inputClass} type="number" placeholder="85" value={markForm.obtained} onChange={(e) => setMarkForm({ ...markForm, obtained: e.target.value })} /></FormField>
        </div>
      </FormModal>
    </div>
  );
}
