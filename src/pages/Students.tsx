import { useState, useEffect } from "react";
import { Search, Plus, Download, Eye, Edit, GraduationCap, Loader2 } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const coursesList = ["B.Sc Nursing", "GNM", "Physiotherapy", "PB.B.Sc", "M.Sc Nursing", "ANM", "OT Technology"];
const feeStatusStyles: Record<string, string> = { paid: "bg-success/10 text-success", partial: "bg-warning/10 text-warning", overdue: "bg-destructive/10 text-destructive" };
const statusStyles: Record<string, string> = { active: "bg-success/10 text-success", suspended: "bg-destructive/10 text-destructive", alumni: "bg-info/10 text-info" };

type Student = {
  id: string;
  student_id: string;
  name: string;
  institute: string;
  course: string;
  program: string;
  batch: string;
  category: string;
  status: string;
  email: string;
  phone: string;
  guardian: string;
  fee_status: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", institute: "", course: "B.Sc Nursing", program: "", batch: "",
    category: "General", email: "", phone: "", guardian: "", password: "",
  });

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("students")
      .select("id, student_id, name, institute, course, program, batch, category, status, email, phone, guardian, fee_status")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load students");
      console.error(error);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.student_id.toLowerCase().includes(search.toLowerCase());
    const matchCourse = filterCourse === "all" || s.course === filterCourse;
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchCourse && matchStatus;
  });

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) return toast.error("Name, Email and Password are required");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await supabase.functions.invoke("create-student", {
        body: {
          name: form.name,
          email: form.email,
          password: form.password,
          institute: form.institute,
          course: form.course,
          program: form.program,
          batch: form.batch,
          category: form.category,
          phone: form.phone,
          guardian: form.guardian,
        },
      });

      if (resp.error || resp.data?.error) {
        toast.error(resp.data?.error || resp.error?.message || "Failed to add student");
      } else {
        toast.success(`Student "${form.name}" added successfully`);
        setModalOpen(false);
        setForm({ name: "", institute: "", course: "B.Sc Nursing", program: "", batch: "", category: "General", email: "", phone: "", guardian: "", password: "" });
        fetchStudents();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add student");
    }
    setSubmitting(false);
  };

  if (selectedStudent) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelectedStudent(null)} className="text-sm text-primary font-medium hover:underline">← Back to students</button>
        <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center"><GraduationCap className="w-8 h-8 text-primary-foreground" /></div>
            <div className="flex-1"><h2 className="text-xl font-display font-bold text-foreground">{selectedStudent.name}</h2><p className="text-sm text-muted-foreground">{selectedStudent.student_id} · {selectedStudent.program}</p></div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[selectedStudent.status]}`}>{selectedStudent.status}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {[
              ["Institute", selectedStudent.institute], ["Course", selectedStudent.course], ["Batch", selectedStudent.batch], ["Category", selectedStudent.category],
              ["Email", selectedStudent.email], ["Phone", selectedStudent.phone], ["Guardian", selectedStudent.guardian],
            ].map(([label, val]) => (
              <div key={label} className="p-3 bg-muted/30 rounded-lg"><p className="text-muted-foreground text-xs mb-1">{label}</p><p className="font-medium text-foreground">{val || "—"}</p></div>
            ))}
            <div className="p-3 bg-muted/30 rounded-lg"><p className="text-muted-foreground text-xs mb-1">Fee Status</p><p className={`font-medium capitalize ${feeStatusStyles[selectedStudent.fee_status]} inline-block px-2 py-0.5 rounded-full text-xs`}>{selectedStudent.fee_status}</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Students</h1><p className="text-sm text-muted-foreground">{students.length} total students</p></div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Add Student</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
        </div>
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
          <option value="all">All Courses</option>
          {coursesList.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">ID</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Institute</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Course</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Program</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Category</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Fee Status</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Actions</th>
          </tr></thead><tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="py-12 text-center text-muted-foreground">No students found. Click "Add Student" to get started.</td></tr>
            ) : filtered.map((s) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{s.student_id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{s.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{s.institute || "—"}</td>
                <td className="py-3 px-4 text-muted-foreground">{s.course}</td>
                <td className="py-3 px-4 text-muted-foreground">{s.program}</td>
                <td className="py-3 px-4 text-muted-foreground">{s.category}</td>
                <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${feeStatusStyles[s.fee_status]}`}>{s.fee_status}</span></td>
                <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[s.status]}`}>{s.status}</span></td>
                <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1">
                  <button onClick={() => setSelectedStudent(s)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"><Edit className="w-4 h-4" /></button>
                </div></td>
              </tr>
            ))}
          </tbody></table></div>
        )}
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Student" onSubmit={handleAdd} submitLabel={submitting ? "Adding..." : "Add Student"}>
        <FormField label="Full Name" required><input className={inputClass} placeholder="Student full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <FormField label="Institute"><input className={inputClass} placeholder="e.g. ABC Nursing College" value={form.institute} onChange={(e) => setForm({ ...form, institute: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Course" required><select className={selectClass} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>{coursesList.map(c => <option key={c} value={c}>{c}</option>)}</select></FormField>
          <FormField label="Program"><input className={inputClass} placeholder="e.g. B.Sc Year 1" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Batch"><input className={inputClass} placeholder="e.g. 2025-29" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} /></FormField>
          <FormField label="Category"><select className={selectClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{["General", "OBC", "SC", "ST"].map(c => <option key={c} value={c}>{c}</option>)}</select></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email" required><input className={inputClass} type="email" placeholder="student@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
          <FormField label="Password" required><input className={inputClass} type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone"><input className={inputClass} placeholder="+91 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
          <FormField label="Guardian Name"><input className={inputClass} placeholder="Mr./Mrs. Guardian Name" value={form.guardian} onChange={(e) => setForm({ ...form, guardian: e.target.value })} /></FormField>
        </div>
      </FormModal>
    </div>
  );
}
