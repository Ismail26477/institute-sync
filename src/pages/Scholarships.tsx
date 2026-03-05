import { useState } from "react";
import { Award, Plus, FileText, TrendingUp, Users, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const scholarshipsData = [
  { id: 1, name: "Merit Scholarship", type: "Merit-Based", amount: 25000, seats: 50, filled: 38, criteria: "Above 85% in previous year", renewalRequired: true, status: "Active" },
  { id: 2, name: "SC/ST Scholarship", type: "Government", amount: 50000, seats: 100, filled: 87, criteria: "Category certificate required", renewalRequired: false, status: "Active" },
  { id: 3, name: "OBC Scholarship", type: "Government", amount: 30000, seats: 80, filled: 65, criteria: "OBC certificate + income < 8L", renewalRequired: false, status: "Active" },
  { id: 4, name: "Sports Quota", type: "Institutional", amount: 20000, seats: 20, filled: 12, criteria: "State/National level achievement", renewalRequired: true, status: "Active" },
  { id: 5, name: "EWS Scholarship", type: "Government", amount: 40000, seats: 60, filled: 54, criteria: "EWS certificate + income < 3L", renewalRequired: false, status: "Active" },
  { id: 6, name: "Staff Ward Concession", type: "Institutional", amount: 15000, seats: 30, filled: 8, criteria: "Employee of institution", renewalRequired: true, status: "Active" },
];

const applicationsData = [
  { id: 1, student: "Priya Sharma", rollNo: "BSN-2024-012", scholarship: "Merit Scholarship", appliedDate: "2025-06-15", status: "Approved", amount: 25000 },
  { id: 2, student: "Rahul Patil", rollNo: "BSN-2024-045", scholarship: "SC/ST Scholarship", appliedDate: "2025-06-18", status: "Pending", amount: 50000 },
  { id: 3, student: "Sneha Deshmukh", rollNo: "GNM-2024-023", scholarship: "OBC Scholarship", appliedDate: "2025-06-20", status: "Approved", amount: 30000 },
  { id: 4, student: "Amit Kumar", rollNo: "BSN-2024-067", scholarship: "Sports Quota", appliedDate: "2025-06-22", status: "Under Review", amount: 20000 },
  { id: 5, student: "Kavita Joshi", rollNo: "PHY-2024-011", scholarship: "EWS Scholarship", appliedDate: "2025-06-25", status: "Rejected", amount: 40000 },
  { id: 6, student: "Deepak Singh", rollNo: "BSN-2024-089", scholarship: "Merit Scholarship", appliedDate: "2025-07-01", status: "Pending", amount: 25000 },
];

const statusIcon: Record<string, React.ReactNode> = { Approved: <CheckCircle className="w-4 h-4 text-success" />, Pending: <Clock className="w-4 h-4 text-warning" />, "Under Review": <Clock className="w-4 h-4 text-info" />, Rejected: <XCircle className="w-4 h-4 text-destructive" /> };
const statusClass: Record<string, string> = { Approved: "bg-success/10 text-success", Pending: "bg-warning/10 text-warning", "Under Review": "bg-info/10 text-info", Rejected: "bg-destructive/10 text-destructive" };

export default function ScholarshipsPage() {
  const [activeTab, setActiveTab] = useState<"schemes" | "applications" | "reports">("schemes");
  const [applications, setApplications] = useState(applicationsData);
  const [modalOpen, setModalOpen] = useState(false);

  const totalDisbursed = applications.filter(a => a.status === "Approved").reduce((s, a) => s + a.amount, 0);

  const handleApprove = (id: number) => {
    setApplications(applications.map(a => a.id === id ? { ...a, status: "Approved" } : a));
    toast.success("Application approved");
  };

  const handleDownloadReport = () => {
    const report = `SCHOLARSHIP UTILIZATION REPORT\n${"=".repeat(50)}\n\nTotal Schemes: ${scholarshipsData.length}\nTotal Disbursed: ₹${totalDisbursed.toLocaleString()}\nApplications Processed: ${applications.length}\nApproved: ${applications.filter(a => a.status === "Approved").length}\nPending: ${applications.filter(a => a.status === "Pending").length}\n\n${scholarshipsData.map(s => `${s.name}: ${s.filled}/${s.seats} seats filled (₹${(s.filled * s.amount).toLocaleString()} disbursed)`).join("\n")}`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "scholarship_report.txt"; a.click();
    toast.success("Report downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Scholarships & Financial Aid</h1><p className="text-sm text-muted-foreground">Track applications, eligibility, disbursement & renewal</p></div>
        <div className="flex gap-2">
          <button onClick={handleDownloadReport} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/80"><Download className="w-4 h-4" /> Export Report</button>
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"><Plus className="w-4 h-4" /> New Scheme</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><Award className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{scholarshipsData.length}</p><p className="text-sm text-muted-foreground">Active Schemes</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{scholarshipsData.reduce((s, d) => s + d.filled, 0)}</p><p className="text-sm text-muted-foreground">Beneficiaries</p></div></div>
        <div className="kpi-card flex items-center gap-3"><TrendingUp className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">₹{(totalDisbursed / 100000).toFixed(1)}L</p><p className="text-sm text-muted-foreground">Total Disbursed</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Clock className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{applications.filter(a => a.status === "Pending").length}</p><p className="text-sm text-muted-foreground">Pending Review</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["schemes", "applications", "reports"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {activeTab === "schemes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {scholarshipsData.map(s => (
            <div key={s.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div><h3 className="font-display font-semibold text-foreground">{s.name}</h3><span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s.type}</span></div>
                <p className="text-lg font-display font-bold text-primary">₹{s.amount.toLocaleString()}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{s.criteria}</p>
              <div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground">{s.filled}/{s.seats} seats filled</span><span className="text-xs font-medium text-foreground">{Math.round((s.filled / s.seats) * 100)}%</span></div>
              <div className="w-full bg-muted rounded-full h-2"><div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(s.filled / s.seats) * 100}%` }} /></div>
              {s.renewalRequired && <p className="text-xs text-warning mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Renewal required annually</p>}
            </div>
          ))}
        </div>
      )}

      {activeTab === "applications" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Student</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Roll No</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Scholarship</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Amount</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Status</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Action</th>
          </tr></thead><tbody>{applications.map(a => (
            <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20">
              <td className="py-3 px-4 font-medium text-foreground">{a.student}</td>
              <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{a.rollNo}</td>
              <td className="py-3 px-4">{a.scholarship}</td>
              <td className="py-3 px-4 font-medium text-foreground">₹{a.amount.toLocaleString()}</td>
              <td className="py-3 px-4 text-center"><span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusClass[a.status]}`}>{statusIcon[a.status]} {a.status}</span></td>
              <td className="py-3 px-4 text-right">{a.status === "Pending" && <button onClick={() => handleApprove(a.id)} className="text-xs px-3 py-1 rounded-md bg-success/10 text-success hover:bg-success/20">Approve</button>}</td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Utilization Summary</h3>
            <div className="space-y-4">
              {scholarshipsData.map(s => (
                <div key={s.id} className="flex items-center gap-4">
                  <span className="text-sm text-foreground w-40 truncate">{s.name}</span>
                  <div className="flex-1 bg-muted rounded-full h-3"><div className="bg-primary rounded-full h-3" style={{ width: `${(s.filled / s.seats) * 100}%` }} /></div>
                  <span className="text-sm font-medium text-foreground w-28 text-right">₹{(s.filled * s.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h4 className="font-medium text-foreground mb-3">By Category</h4>
              {["Government", "Merit-Based", "Institutional"].map(type => {
                const count = scholarshipsData.filter(s => s.type === type).reduce((c, s) => c + s.filled, 0);
                return <div key={type} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"><span className="text-sm text-muted-foreground">{type}</span><span className="text-sm font-medium text-foreground">{count} students</span></div>;
              })}
            </div>
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h4 className="font-medium text-foreground mb-3">Application Status</h4>
              {["Approved", "Pending", "Under Review", "Rejected"].map(status => {
                const count = applications.filter(a => a.status === status).length;
                return <div key={status} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"><span className="text-sm flex items-center gap-2">{statusIcon[status]} {status}</span><span className="text-sm font-medium text-foreground">{count}</span></div>;
              })}
            </div>
          </div>
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Scholarship Scheme" onSubmit={() => { setModalOpen(false); toast.success("Scheme added"); }} submitLabel="Create Scheme">
        <FormField label="Scheme Name" required><input className={inputClass} placeholder="e.g. Merit Scholarship" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Type"><select className={selectClass}><option>Merit-Based</option><option>Government</option><option>Institutional</option></select></FormField>
          <FormField label="Amount (₹)"><input className={inputClass} type="number" placeholder="25000" /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Total Seats"><input className={inputClass} type="number" placeholder="50" /></FormField>
          <FormField label="Renewal"><select className={selectClass}><option value="yes">Required</option><option value="no">Not Required</option></select></FormField>
        </div>
        <FormField label="Eligibility Criteria"><input className={inputClass} placeholder="Criteria description" /></FormField>
      </FormModal>
    </div>
  );
}
