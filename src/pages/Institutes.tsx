import { useState } from "react";
import { Building2, Users, GraduationCap, MapPin, Phone, Mail, Plus, Search, Eye } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const initialInstitutes = [
  { id: 1, name: "B.Sc Nursing", code: "BSN", programs: 2, students: 520, faculty: 28, location: "Main Campus, Block A", phone: "+91 98765 43210", email: "bsc@edumanage.in", status: "active", established: "2008", accreditation: "NAAC A+", dean: "Dr. Meena Sharma" },
  { id: 2, name: "GNM Nursing", code: "GNM", programs: 1, students: 380, faculty: 18, location: "Main Campus, Block B", phone: "+91 98765 43211", email: "gnm@edumanage.in", status: "active", established: "2010", accreditation: "NAAC A", dean: "Dr. Ravi Kumar" },
  { id: 3, name: "Physiotherapy", code: "PHY", programs: 2, students: 290, faculty: 22, location: "Health Sciences Block", phone: "+91 98765 43212", email: "physio@edumanage.in", status: "active", established: "2012", accreditation: "NAAC A", dean: "Dr. Anjali Desai" },
  { id: 4, name: "PB.B.Sc Nursing", code: "PBN", programs: 1, students: 180, faculty: 12, location: "Main Campus, Block C", phone: "+91 98765 43213", email: "pbbsc@edumanage.in", status: "active", established: "2014", accreditation: "NAAC B+", dean: "Dr. Suresh Patel" },
  { id: 5, name: "M.Sc Nursing", code: "MSN", programs: 4, students: 160, faculty: 15, location: "PG Block", phone: "+91 98765 43214", email: "msc@edumanage.in", status: "active", established: "2015", accreditation: "NAAC A", dean: "Dr. Priya Nair" },
  { id: 6, name: "ANM", code: "ANM", programs: 1, students: 240, faculty: 10, location: "Annex Building", phone: "+91 98765 43215", email: "anm@edumanage.in", status: "active", established: "2016", accreditation: "Under Review", dean: "Dr. Kavita Singh" },
  { id: 7, name: "OT Technology", code: "OTT", programs: 1, students: 120, faculty: 8, location: "Health Sciences Block", phone: "+91 98765 43216", email: "ot@edumanage.in", status: "active", established: "2018", accreditation: "NAAC B+", dean: "Dr. Arun Mehta" },
];

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState(initialInstitutes);
  const [search, setSearch] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState<typeof initialInstitutes[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", location: "", phone: "", email: "", dean: "", established: new Date().getFullYear().toString(), accreditation: "" });

  const filtered = institutes.filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = institutes.reduce((a, b) => a + b.students, 0);
  const totalFaculty = institutes.reduce((a, b) => a + b.faculty, 0);

  const handleAdd = () => {
    if (!form.name || !form.code) return toast.error("Name and Code are required");
    const newInst = { id: Date.now(), ...form, programs: 0, students: 0, faculty: 0, status: "active" };
    setInstitutes([...institutes, newInst]);
    setModalOpen(false);
    setForm({ name: "", code: "", location: "", phone: "", email: "", dean: "", established: new Date().getFullYear().toString(), accreditation: "" });
    toast.success(`Institute "${form.name}" added successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Institutes</h1>
          <p className="text-sm text-muted-foreground">{institutes.length} institutes · {totalStudents} students · {totalFaculty} faculty</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Institute
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search institutes..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
        </div>
      </div>

      {selectedInstitute ? (
        <div className="space-y-4 animate-fade-in">
          <button onClick={() => setSelectedInstitute(null)} className="text-sm text-primary font-medium hover:underline">← Back to all institutes</button>
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0"><Building2 className="w-7 h-7 text-primary-foreground" /></div>
              <div><h2 className="text-xl font-display font-bold text-foreground">{selectedInstitute.name}</h2><p className="text-sm text-muted-foreground">Code: {selectedInstitute.code} · Est. {selectedInstitute.established}</p></div>
              <span className="ml-auto px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium capitalize">{selectedInstitute.status}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="kpi-card"><p className="text-2xl font-display font-bold text-foreground">{selectedInstitute.students}</p><p className="text-sm text-muted-foreground">Active Students</p></div>
              <div className="kpi-card"><p className="text-2xl font-display font-bold text-foreground">{selectedInstitute.faculty}</p><p className="text-sm text-muted-foreground">Faculty Members</p></div>
              <div className="kpi-card"><p className="text-2xl font-display font-bold text-foreground">{selectedInstitute.programs}</p><p className="text-sm text-muted-foreground">Programs</p></div>
              <div className="kpi-card"><p className="text-2xl font-display font-bold text-foreground">{selectedInstitute.accreditation}</p><p className="text-sm text-muted-foreground">Accreditation</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="w-4 h-4" /> Dean: <span className="text-foreground font-medium">{selectedInstitute.dean}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> {selectedInstitute.location}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4" /> {selectedInstitute.phone}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" /> {selectedInstitute.email}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((inst) => (
            <div key={inst.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all animate-fade-in">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-primary-foreground" /></div>
                <div className="flex-1 min-w-0"><h3 className="font-display font-semibold text-foreground truncate">{inst.name}</h3><p className="text-xs text-muted-foreground">{inst.code} · Est. {inst.established}</p></div>
                <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-medium capitalize">{inst.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold text-foreground">{inst.students}</p><p className="text-[10px] text-muted-foreground">Students</p></div>
                <div className="text-center p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold text-foreground">{inst.faculty}</p><p className="text-[10px] text-muted-foreground">Faculty</p></div>
                <div className="text-center p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold text-foreground">{inst.programs}</p><p className="text-[10px] text-muted-foreground">Programs</p></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{inst.accreditation}</span>
                <button onClick={() => setSelectedInstitute(inst)} className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"><Eye className="w-3 h-3" /> View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Institute" onSubmit={handleAdd} submitLabel="Add Institute">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Institute Name" required><input className={inputClass} placeholder="e.g. B.Sc Nursing" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Code" required><input className={inputClass} placeholder="e.g. BSN" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} maxLength={5} /></FormField>
        </div>
        <FormField label="Dean / Head"><input className={inputClass} placeholder="Dr. Name" value={form.dean} onChange={(e) => setForm({ ...form, dean: e.target.value })} /></FormField>
        <FormField label="Location"><input className={inputClass} placeholder="Campus Block" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone"><input className={inputClass} placeholder="+91 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
          <FormField label="Email"><input className={inputClass} type="email" placeholder="inst@edumanage.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Established Year"><input className={inputClass} placeholder="2025" value={form.established} onChange={(e) => setForm({ ...form, established: e.target.value })} /></FormField>
          <FormField label="Accreditation"><input className={inputClass} placeholder="NAAC A+" value={form.accreditation} onChange={(e) => setForm({ ...form, accreditation: e.target.value })} /></FormField>
        </div>
      </FormModal>
    </div>
  );
}
