import { useState } from "react";
import { Users, Plus, Briefcase, Clock, Calendar, IndianRupee, Edit, Eye } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const facultyData = [
  { id: 1, name: "Dr. Meena Sharma", designation: "Professor & HOD", department: "Nursing", qualification: "Ph.D Nursing", experience: 18, subjects: ["Anatomy", "Clinical Practice"], workload: 22, maxLoad: 24, leaves: { taken: 3, total: 30 }, salary: 125000, status: "Active", joinDate: "2012-06-15" },
  { id: 2, name: "Prof. Anil Deshmukh", designation: "Associate Professor", department: "Nursing", qualification: "M.Sc Nursing", experience: 12, subjects: ["Physiology", "Physiology Lab"], workload: 20, maxLoad: 24, leaves: { taken: 5, total: 30 }, salary: 95000, status: "Active", joinDate: "2015-07-01" },
  { id: 3, name: "Dr. Ravi Kumar", designation: "Assistant Professor", department: "Biochemistry", qualification: "Ph.D Biochemistry", experience: 8, subjects: ["Biochemistry"], workload: 18, maxLoad: 24, leaves: { taken: 2, total: 30 }, salary: 78000, status: "Active", joinDate: "2018-01-10" },
  { id: 4, name: "Dr. Anjali Desai", designation: "Professor", department: "Microbiology", qualification: "M.D Microbiology", experience: 15, subjects: ["Microbiology"], workload: 16, maxLoad: 24, leaves: { taken: 8, total: 30 }, salary: 110000, status: "Active", joinDate: "2014-03-20" },
  { id: 5, name: "Dr. Sharma", designation: "Associate Professor", department: "Pharmacology", qualification: "Ph.D Pharmacology", experience: 10, subjects: ["Pharmacology"], workload: 20, maxLoad: 24, leaves: { taken: 1, total: 30 }, salary: 92000, status: "Active", joinDate: "2017-08-15" },
  { id: 6, name: "Prof. Sunita Rao", designation: "Assistant Professor", department: "Nursing", qualification: "M.Sc Nursing", experience: 6, subjects: ["Nursing Foundation"], workload: 22, maxLoad: 24, leaves: { taken: 4, total: 30 }, salary: 68000, status: "Active", joinDate: "2020-01-05" },
  { id: 7, name: "Dr. Patil", designation: "Assistant Professor", department: "Community Health", qualification: "MPH", experience: 5, subjects: ["Community Health"], workload: 18, maxLoad: 24, leaves: { taken: 6, total: 30 }, salary: 65000, status: "On Leave", joinDate: "2021-06-01" },
];

const leaveRequests = [
  { id: 1, faculty: "Dr. Patil", type: "Medical Leave", from: "2025-07-15", to: "2025-07-20", days: 5, status: "Approved", reason: "Surgery recovery" },
  { id: 2, faculty: "Prof. Anil Deshmukh", type: "Casual Leave", from: "2025-07-22", to: "2025-07-23", days: 2, status: "Pending", reason: "Family function" },
  { id: 3, faculty: "Dr. Anjali Desai", type: "Conference Leave", from: "2025-08-01", to: "2025-08-03", days: 3, status: "Pending", reason: "National conference on Microbiology" },
];

export default function FacultyPage() {
  const [activeTab, setActiveTab] = useState<"profiles" | "workload" | "leaves" | "payroll">("profiles");
  const [selectedFaculty, setSelectedFaculty] = useState<typeof facultyData[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [leaves, setLeaves] = useState(leaveRequests);

  const handleApproveLeave = (id: number) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: "Approved" } : l));
    toast.success("Leave approved");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Faculty Management</h1><p className="text-sm text-muted-foreground">Profiles, workload, leaves & payroll</p></div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"><Plus className="w-4 h-4" /> Add Faculty</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{facultyData.length}</p><p className="text-sm text-muted-foreground">Total Faculty</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Briefcase className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{Math.round(facultyData.reduce((s, f) => s + f.workload, 0) / facultyData.length)}h</p><p className="text-sm text-muted-foreground">Avg Workload/Week</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Clock className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{leaves.filter(l => l.status === "Pending").length}</p><p className="text-sm text-muted-foreground">Pending Leaves</p></div></div>
        <div className="kpi-card flex items-center gap-3"><IndianRupee className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">₹{(facultyData.reduce((s, f) => s + f.salary, 0) / 100000).toFixed(1)}L</p><p className="text-sm text-muted-foreground">Monthly Payroll</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["profiles", "workload", "leaves", "payroll"] as const).map(t => (
          <button key={t} onClick={() => { setActiveTab(t); setSelectedFaculty(null); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {activeTab === "profiles" && !selectedFaculty && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {facultyData.map(f => (
            <div key={f.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all cursor-pointer" onClick={() => setSelectedFaculty(f)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{f.name.split(" ").slice(-1)[0][0]}{f.name.split(" ")[0][0]}</div>
                <div><h3 className="font-display font-semibold text-foreground text-sm">{f.name}</h3><p className="text-xs text-muted-foreground">{f.designation}</p></div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="text-foreground">{f.department}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Experience</span><span className="text-foreground">{f.experience} years</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className={`px-2 py-0.5 rounded-full ${f.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{f.status}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "profiles" && selectedFaculty && (
        <div className="space-y-4 animate-fade-in">
          <button onClick={() => setSelectedFaculty(null)} className="text-sm text-primary font-medium hover:underline">← Back to faculty</button>
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">{selectedFaculty.name[0]}</div>
              <div><h2 className="text-xl font-display font-bold text-foreground">{selectedFaculty.name}</h2><p className="text-sm text-muted-foreground">{selectedFaculty.designation} · {selectedFaculty.department}</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[["Qualification", selectedFaculty.qualification], ["Experience", `${selectedFaculty.experience} years`], ["Join Date", selectedFaculty.joinDate], ["Subjects", selectedFaculty.subjects.join(", ")], ["Workload", `${selectedFaculty.workload}/${selectedFaculty.maxLoad} hrs/week`], ["Leaves", `${selectedFaculty.leaves.taken}/${selectedFaculty.leaves.total} used`], ["Salary", `₹${selectedFaculty.salary.toLocaleString()}`], ["Status", selectedFaculty.status]].map(([l, v]) => (
                <div key={l as string}><p className="text-xs text-muted-foreground">{l}</p><p className="text-sm font-medium text-foreground">{v}</p></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "workload" && (
        <div className="space-y-4 animate-fade-in">
          {facultyData.map(f => (
            <div key={f.id} className="bg-card rounded-xl border border-border/50 shadow-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">{f.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1"><p className="text-sm font-medium text-foreground truncate">{f.name}</p><span className="text-xs text-muted-foreground">{f.workload}/{f.maxLoad} hrs</span></div>
                <div className="w-full bg-muted rounded-full h-2.5"><div className={`rounded-full h-2.5 transition-all ${f.workload / f.maxLoad > 0.9 ? "bg-destructive" : f.workload / f.maxLoad > 0.7 ? "bg-warning" : "bg-success"}`} style={{ width: `${(f.workload / f.maxLoad) * 100}%` }} /></div>
              </div>
              <div className="flex flex-wrap gap-1">{f.subjects.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s}</span>)}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "leaves" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Faculty</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Type</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Duration</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Reason</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Status</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Action</th>
          </tr></thead><tbody>{leaves.map(l => (
            <tr key={l.id} className="border-b border-border/50 hover:bg-muted/20">
              <td className="py-3 px-4 font-medium text-foreground">{l.faculty}</td>
              <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{l.type}</span></td>
              <td className="py-3 px-4 text-muted-foreground text-xs">{l.from} → {l.to} ({l.days}d)</td>
              <td className="py-3 px-4 text-muted-foreground text-sm">{l.reason}</td>
              <td className="py-3 px-4 text-center"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.status === "Approved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{l.status}</span></td>
              <td className="py-3 px-4 text-right">{l.status === "Pending" && <button onClick={() => handleApproveLeave(l.id)} className="text-xs px-3 py-1 rounded-md bg-success/10 text-success hover:bg-success/20">Approve</button>}</td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "payroll" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Faculty</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Designation</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Basic</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">HRA</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Deductions</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Net Pay</th>
          </tr></thead><tbody>{facultyData.map(f => {
            const basic = Math.round(f.salary * 0.5);
            const hra = Math.round(f.salary * 0.3);
            const deductions = Math.round(f.salary * 0.2);
            return (
              <tr key={f.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="py-3 px-4 font-medium text-foreground">{f.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{f.designation}</td>
                <td className="py-3 px-4 text-right text-foreground">₹{basic.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-foreground">₹{hra.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-destructive">-₹{deductions.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-semibold text-foreground">₹{(basic + hra - deductions).toLocaleString()}</td>
              </tr>
            );
          })}</tbody></table></div>
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Faculty" onSubmit={() => { setModalOpen(false); toast.success("Faculty added"); }} submitLabel="Add Faculty">
        <FormField label="Full Name" required><input className={inputClass} placeholder="Dr. Name" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Designation"><select className={selectClass}><option>Professor & HOD</option><option>Professor</option><option>Associate Professor</option><option>Assistant Professor</option></select></FormField>
          <FormField label="Department"><select className={selectClass}><option>Nursing</option><option>Biochemistry</option><option>Microbiology</option><option>Pharmacology</option><option>Community Health</option></select></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Qualification"><input className={inputClass} placeholder="Ph.D / M.Sc" /></FormField>
          <FormField label="Experience (years)"><input className={inputClass} type="number" placeholder="10" /></FormField>
        </div>
        <FormField label="Monthly Salary (₹)"><input className={inputClass} type="number" placeholder="80000" /></FormField>
      </FormModal>
    </div>
  );
}
