import { useState } from "react";
import { Search, Plus, Download, Eye, Edit, GraduationCap } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const initialStudents = [
  { id: "STU001", name: "Priya Sharma", institute: "B.Sc Nursing", program: "B.Sc Year 2", batch: "2024-28", category: "General", status: "active", email: "priya.s@mail.com", phone: "+91 98765 11111", guardian: "Mr. Rajesh Sharma", feeStatus: "paid" },
  { id: "STU002", name: "Rahul Verma", institute: "GNM", program: "GNM Year 1", batch: "2025-28", category: "OBC", status: "active", email: "rahul.v@mail.com", phone: "+91 98765 22222", guardian: "Mrs. Sunita Verma", feeStatus: "partial" },
  { id: "STU003", name: "Ananya Patel", institute: "Physiotherapy", program: "BPT Year 3", batch: "2023-27", category: "General", status: "active", email: "ananya.p@mail.com", phone: "+91 98765 33333", guardian: "Mr. Dipak Patel", feeStatus: "overdue" },
  { id: "STU004", name: "Vikram Singh", institute: "PB.B.Sc", program: "PB.B.Sc Year 1", batch: "2025-27", category: "SC", status: "active", email: "vikram.s@mail.com", phone: "+91 98765 44444", guardian: "Mr. Harpal Singh", feeStatus: "paid" },
  { id: "STU005", name: "Meera Joshi", institute: "M.Sc Nursing", program: "M.Sc Year 2", batch: "2024-26", category: "General", status: "active", email: "meera.j@mail.com", phone: "+91 98765 55555", guardian: "Mr. Ashok Joshi", feeStatus: "paid" },
  { id: "STU006", name: "Arjun Reddy", institute: "B.Sc Nursing", program: "B.Sc Year 1", batch: "2025-29", category: "OBC", status: "active", email: "arjun.r@mail.com", phone: "+91 98765 66666", guardian: "Mr. Venkat Reddy", feeStatus: "partial" },
  { id: "STU007", name: "Kavita Nair", institute: "ANM", program: "ANM Year 1", batch: "2025-27", category: "General", status: "active", email: "kavita.n@mail.com", phone: "+91 98765 77777", guardian: "Mrs. Lakshmi Nair", feeStatus: "paid" },
  { id: "STU008", name: "Deepak Gupta", institute: "OT Technology", program: "OT Year 2", batch: "2024-26", category: "General", status: "suspended", email: "deepak.g@mail.com", phone: "+91 98765 88888", guardian: "Mr. Ramesh Gupta", feeStatus: "overdue" },
  { id: "STU009", name: "Sneha Iyer", institute: "B.Sc Nursing", program: "B.Sc Year 3", batch: "2023-27", category: "General", status: "active", email: "sneha.i@mail.com", phone: "+91 98765 99999", guardian: "Mr. Krishnan Iyer", feeStatus: "paid" },
  { id: "STU010", name: "Amit Tiwari", institute: "GNM", program: "GNM Year 2", batch: "2024-27", category: "SC", status: "active", email: "amit.t@mail.com", phone: "+91 98765 00000", guardian: "Mr. Sunil Tiwari", feeStatus: "partial" },
];

const feeStatusStyles: Record<string, string> = { paid: "bg-success/10 text-success", partial: "bg-warning/10 text-warning", overdue: "bg-destructive/10 text-destructive" };
const statusStyles: Record<string, string> = { active: "bg-success/10 text-success", suspended: "bg-destructive/10 text-destructive", alumni: "bg-info/10 text-info" };
const institutesList = ["B.Sc Nursing", "GNM", "Physiotherapy", "PB.B.Sc", "M.Sc Nursing", "ANM", "OT Technology"];

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [filterInstitute, setFilterInstitute] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<typeof initialStudents[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", institute: "B.Sc Nursing", program: "", batch: "", category: "General", email: "", phone: "", guardian: "" });

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchInst = filterInstitute === "all" || s.institute === filterInstitute;
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchInst && matchStatus;
  });

  const handleAdd = () => {
    if (!form.name || !form.program) return toast.error("Name and Program are required");
    const newId = `STU${String(students.length + 1).padStart(3, "0")}`;
    setStudents([...students, { ...form, id: newId, status: "active", feeStatus: "paid" }]);
    setModalOpen(false);
    setForm({ name: "", institute: "B.Sc Nursing", program: "", batch: "", category: "General", email: "", phone: "", guardian: "" });
    toast.success(`Student "${form.name}" added (${newId})`);
  };

  if (selectedStudent) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelectedStudent(null)} className="text-sm text-primary font-medium hover:underline">← Back to students</button>
        <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center"><GraduationCap className="w-8 h-8 text-primary-foreground" /></div>
            <div className="flex-1"><h2 className="text-xl font-display font-bold text-foreground">{selectedStudent.name}</h2><p className="text-sm text-muted-foreground">{selectedStudent.id} · {selectedStudent.program}</p></div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[selectedStudent.status]}`}>{selectedStudent.status}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {[
              ["Institute", selectedStudent.institute], ["Batch", selectedStudent.batch], ["Category", selectedStudent.category],
              ["Email", selectedStudent.email], ["Phone", selectedStudent.phone], ["Guardian", selectedStudent.guardian],
            ].map(([label, val]) => (
              <div key={label} className="p-3 bg-muted/30 rounded-lg"><p className="text-muted-foreground text-xs mb-1">{label}</p><p className="font-medium text-foreground">{val}</p></div>
            ))}
            <div className="p-3 bg-muted/30 rounded-lg"><p className="text-muted-foreground text-xs mb-1">Fee Status</p><p className={`font-medium capitalize ${feeStatusStyles[selectedStudent.feeStatus]} inline-block px-2 py-0.5 rounded-full text-xs`}>{selectedStudent.feeStatus}</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Students</h1><p className="text-sm text-muted-foreground">{students.length} total students across all institutes</p></div>
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
        <select value={filterInstitute} onChange={(e) => setFilterInstitute(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
          <option value="all">All Institutes</option>
          {institutesList.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">ID</th>
          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Institute</th>
          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Program</th>
          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Category</th>
          <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Fee Status</th>
          <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
          <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Actions</th>
        </tr></thead><tbody>{filtered.map((s) => (
          <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
            <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{s.id}</td>
            <td className="py-3 px-4 font-medium text-foreground">{s.name}</td>
            <td className="py-3 px-4 text-muted-foreground">{s.institute}</td>
            <td className="py-3 px-4 text-muted-foreground">{s.program}</td>
            <td className="py-3 px-4 text-muted-foreground">{s.category}</td>
            <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${feeStatusStyles[s.feeStatus]}`}>{s.feeStatus}</span></td>
            <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[s.status]}`}>{s.status}</span></td>
            <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1">
              <button onClick={() => setSelectedStudent(s)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"><Eye className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"><Edit className="w-4 h-4" /></button>
            </div></td>
          </tr>
        ))}</tbody></table></div>
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Student" onSubmit={handleAdd} submitLabel="Add Student">
        <FormField label="Full Name" required><input className={inputClass} placeholder="Student full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Institute" required><select className={selectClass} value={form.institute} onChange={(e) => setForm({ ...form, institute: e.target.value })}>{institutesList.map(i => <option key={i} value={i}>{i}</option>)}</select></FormField>
          <FormField label="Program" required><input className={inputClass} placeholder="e.g. B.Sc Year 1" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Batch"><input className={inputClass} placeholder="e.g. 2025-29" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} /></FormField>
          <FormField label="Category"><select className={selectClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{["General", "OBC", "SC", "ST"].map(c => <option key={c} value={c}>{c}</option>)}</select></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email"><input className={inputClass} type="email" placeholder="email@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
          <FormField label="Phone"><input className={inputClass} placeholder="+91 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
        </div>
        <FormField label="Guardian Name"><input className={inputClass} placeholder="Mr./Mrs. Guardian Name" value={form.guardian} onChange={(e) => setForm({ ...form, guardian: e.target.value })} /></FormField>
      </FormModal>
    </div>
  );
}
