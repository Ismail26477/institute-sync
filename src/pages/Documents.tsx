import { useState } from "react";
import { FileText, Upload, Search, Eye, Download, Clock, Folder, AlertTriangle, Plus } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const categories = ["All", "Admission", "Academic", "Identity", "Accreditation", "Financial", "Staff"];

const initialDocs = [
  { id: 1, name: "NAAC Certificate — B.Sc Nursing", category: "Accreditation", owner: "B.Sc Nursing Institute", uploadedBy: "Admin", date: "2024-08-15", expiresAt: "2025-08-15", status: "valid", size: "2.4 MB", version: "v3" },
  { id: 2, name: "Affiliation Letter 2025-26", category: "Accreditation", owner: "GNM Institute", uploadedBy: "Admin", date: "2025-01-20", expiresAt: "2026-01-20", status: "valid", size: "1.8 MB", version: "v1" },
  { id: 3, name: "Priya Sharma — Admission Docs", category: "Admission", owner: "Priya Sharma (STU001)", uploadedBy: "Registrar", date: "2024-06-10", expiresAt: null, status: "valid", size: "5.2 MB", version: "v1" },
  { id: 4, name: "INC Recognition — Physiotherapy", category: "Accreditation", owner: "Physiotherapy Institute", uploadedBy: "Admin", date: "2023-03-01", expiresAt: "2025-03-01", status: "expired", size: "3.1 MB", version: "v2" },
  { id: 5, name: "Faculty ID Cards — Batch 2025", category: "Identity", owner: "All Institutes", uploadedBy: "HR", date: "2025-02-01", expiresAt: "2026-02-01", status: "valid", size: "12.8 MB", version: "v1" },
  { id: 6, name: "Scholarship Proof — Vikram Singh", category: "Financial", owner: "Vikram Singh (STU004)", uploadedBy: "Accounts", date: "2025-03-15", expiresAt: null, status: "valid", size: "850 KB", version: "v1" },
  { id: 7, name: "Annual Audit Report 2024", category: "Financial", owner: "HQ", uploadedBy: "Finance", date: "2024-12-10", expiresAt: null, status: "valid", size: "4.6 MB", version: "v1" },
  { id: 8, name: "Staff Appointment Letters", category: "Staff", owner: "HR Department", uploadedBy: "HR", date: "2025-01-05", expiresAt: null, status: "valid", size: "8.3 MB", version: "v2" },
  { id: 9, name: "NAAC Certificate — GNM", category: "Accreditation", owner: "GNM Institute", uploadedBy: "Admin", date: "2023-07-20", expiresAt: "2025-08-01", status: "expiring", size: "2.1 MB", version: "v2" },
  { id: 10, name: "Exam Results Template", category: "Academic", owner: "All Institutes", uploadedBy: "Registrar", date: "2025-04-01", expiresAt: null, status: "valid", size: "340 KB", version: "v4" },
];

const statusStyle: Record<string, string> = { valid: "bg-success/10 text-success", expired: "bg-destructive/10 text-destructive", expiring: "bg-warning/10 text-warning" };

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [docs, setDocs] = useState(initialDocs);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Admission", owner: "", uploadedBy: "", expiresAt: "" });

  const filtered = docs.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || d.category === filterCategory;
    return matchSearch && matchCat;
  });

  const expiring = docs.filter(d => d.status === "expiring" || d.status === "expired").length;

  const handleUpload = () => {
    if (!form.name || !form.owner) return toast.error("Document name and owner are required");
    const today = new Date().toISOString().split("T")[0];
    setDocs([...docs, { id: Date.now(), name: form.name, category: form.category, owner: form.owner, uploadedBy: form.uploadedBy || "Admin", date: today, expiresAt: form.expiresAt || null, status: "valid", size: "1.0 MB", version: "v1" }]);
    setModalOpen(false);
    setForm({ name: "", category: "Admission", owner: "", uploadedBy: "", expiresAt: "" });
    toast.success(`Document "${form.name}" uploaded`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Document Management</h1>
          <p className="text-sm text-muted-foreground">{docs.length} documents · {expiring} need attention</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"><Upload className="w-4 h-4" /> Bulk Upload</button>
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Upload Document</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><Folder className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{docs.length}</p><p className="text-sm text-muted-foreground">Total Documents</p></div></div>
        <div className="kpi-card flex items-center gap-3"><FileText className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">38.5 MB</p><p className="text-sm text-muted-foreground">Storage Used</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Clock className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{docs.filter(d => d.status === "expiring").length}</p><p className="text-sm text-muted-foreground">Expiring Soon</p></div></div>
        <div className="kpi-card flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-destructive" /><div><p className="text-xl font-display font-bold text-foreground">{docs.filter(d => d.status === "expired").length}</p><p className="text-sm text-muted-foreground">Expired</p></div></div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterCategory === cat ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Document</th>
          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Category</th>
          <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Owner</th>
          <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Version</th>
          <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Size</th>
          <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Expires</th>
          <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
          <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Actions</th>
        </tr></thead><tbody>{filtered.map((d) => (
          <tr key={d.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
            <td className="py-3 px-4"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary shrink-0" /><span className="font-medium text-foreground">{d.name}</span></div></td>
            <td className="py-3 px-4"><span className="px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">{d.category}</span></td>
            <td className="py-3 px-4 text-muted-foreground">{d.owner}</td>
            <td className="py-3 px-4 text-center text-xs text-muted-foreground font-mono">{d.version}</td>
            <td className="py-3 px-4 text-center text-muted-foreground">{d.size}</td>
            <td className="py-3 px-4 text-center text-muted-foreground">{d.expiresAt || "—"}</td>
            <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle[d.status]}`}>{d.status}</span></td>
            <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1">
              <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"><Eye className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"><Download className="w-4 h-4" /></button>
            </div></td>
          </tr>
        ))}</tbody></table></div>
      </div>

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Document" onSubmit={handleUpload} submitLabel="Upload">
        <FormField label="Document Name" required><input className={inputClass} placeholder="e.g. NAAC Certificate" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" required><select className={selectClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}</select></FormField>
          <FormField label="Owner" required><input className={inputClass} placeholder="Institute or person" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Uploaded By"><input className={inputClass} placeholder="Admin" value={form.uploadedBy} onChange={(e) => setForm({ ...form, uploadedBy: e.target.value })} /></FormField>
          <FormField label="Expires At"><input className={inputClass} type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></FormField>
        </div>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Drag & drop files here or <span className="text-primary font-medium cursor-pointer">browse</span></p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, JPG up to 20MB</p>
        </div>
      </FormModal>
    </div>
  );
}
