import { useState } from "react";
import { IndianRupee, Search, Plus, Download, Eye, Send, FileText } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const tabs = ["Invoices", "Fee Templates", "Scholarships"];
const institutesList = ["B.Sc Nursing", "GNM", "Physiotherapy", "PB.B.Sc", "M.Sc Nursing", "ANM", "OT Technology"];

const initialInvoices = [
  { id: "INV-2025-001", student: "Priya Sharma", institute: "B.Sc Nursing", amount: 85000, paid: 85000, balance: 0, dueDate: "2025-07-15", status: "paid", mode: "UPI" },
  { id: "INV-2025-002", student: "Rahul Verma", institute: "GNM", amount: 65000, paid: 38000, balance: 27000, dueDate: "2025-07-15", status: "partial", mode: "Card" },
  { id: "INV-2025-003", student: "Ananya Patel", institute: "Physiotherapy", amount: 95000, paid: 33000, balance: 62000, dueDate: "2025-06-01", status: "overdue", mode: "NEFT" },
  { id: "INV-2025-004", student: "Vikram Singh", institute: "PB.B.Sc", amount: 72000, paid: 72000, balance: 0, dueDate: "2025-07-15", status: "paid", mode: "Cash" },
  { id: "INV-2025-005", student: "Meera Joshi", institute: "M.Sc Nursing", amount: 110000, paid: 55000, balance: 55000, dueDate: "2025-06-10", status: "overdue", mode: "UPI" },
  { id: "INV-2025-006", student: "Arjun Reddy", institute: "B.Sc Nursing", amount: 85000, paid: 44000, balance: 41000, dueDate: "2025-08-01", status: "partial", mode: "Card" },
  { id: "INV-2025-007", student: "Kavita Nair", institute: "ANM", amount: 48000, paid: 48000, balance: 0, dueDate: "2025-07-15", status: "paid", mode: "Cheque" },
  { id: "INV-2025-008", student: "Deepak Gupta", institute: "OT Technology", amount: 55000, paid: 33000, balance: 22000, dueDate: "2025-05-20", status: "overdue", mode: "Cash" },
];

const feeTemplates = [
  { id: 1, name: "B.Sc Nursing 2025-26", program: "B.Sc Nursing", year: "2025-26", tuition: 60000, exam: 5000, library: 3000, hostel: 12000, transport: 5000, total: 85000, status: "active", version: "v2025-26" },
  { id: 2, name: "GNM 2025-26", program: "GNM", year: "2025-26", tuition: 45000, exam: 4000, library: 2500, hostel: 10000, transport: 3500, total: 65000, status: "active", version: "v2025-26" },
  { id: 3, name: "BPT 2025-26", program: "Physiotherapy", year: "2025-26", tuition: 70000, exam: 5000, library: 3000, hostel: 12000, transport: 5000, total: 95000, status: "active", version: "v2025-26" },
  { id: 4, name: "M.Sc Nursing 2025-26", program: "M.Sc Nursing", year: "2025-26", tuition: 80000, exam: 6000, library: 4000, hostel: 15000, transport: 5000, total: 110000, status: "active", version: "v2025-26" },
  { id: 5, name: "ANM 2025-26", program: "ANM", year: "2025-26", tuition: 30000, exam: 3000, library: 2000, hostel: 8000, transport: 5000, total: 48000, status: "active", version: "v2025-26" },
];

const scholarships = [
  { id: 1, name: "Merit Scholarship", type: "Percentage", value: "50%", eligibility: "Score ≥ 85%", applied: 34, totalAmount: 520000, status: "active" },
  { id: 2, name: "SC/ST Scholarship", type: "Fixed", value: "₹25,000", eligibility: "SC/ST Category", applied: 28, totalAmount: 700000, status: "active" },
  { id: 3, name: "Management Quota", type: "Slab", value: "₹10K-50K", eligibility: "Management Decision", applied: 12, totalAmount: 360000, status: "active" },
  { id: 4, name: "Need-Based Aid", type: "Fixed", value: "₹15,000", eligibility: "Income < ₹2.5L", applied: 45, totalAmount: 675000, status: "active" },
  { id: 5, name: "Govt Scheme A", type: "Percentage", value: "100%", eligibility: "BPL + Score ≥ 70%", applied: 8, totalAmount: 640000, status: "active" },
];

const statusStyle: Record<string, string> = { paid: "bg-success/10 text-success", partial: "bg-warning/10 text-warning", overdue: "bg-destructive/10 text-destructive", active: "bg-success/10 text-success", draft: "bg-muted text-muted-foreground" };

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState("Invoices");
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState(initialInvoices);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ student: "", institute: "B.Sc Nursing", amount: "", dueDate: "", mode: "UPI" });

  const totalInvoiced = invoices.reduce((a, b) => a + b.amount, 0);
  const totalCollected = invoices.reduce((a, b) => a + b.paid, 0);
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((a, b) => a + b.balance, 0);
  const totalPartial = invoices.filter(i => i.status === "partial").reduce((a, b) => a + b.balance, 0);

  const handleCreate = () => {
    if (!form.student || !form.amount) return toast.error("Student name and amount are required");
    const amt = Number(form.amount);
    const newInv = {
      id: `INV-2025-${String(invoices.length + 1).padStart(3, "0")}`,
      student: form.student, institute: form.institute, amount: amt, paid: 0, balance: amt,
      dueDate: form.dueDate || "2025-08-15", status: "partial" as const, mode: form.mode,
    };
    setInvoices([...invoices, newInv]);
    setModalOpen(false);
    setForm({ student: "", institute: "B.Sc Nursing", amount: "", dueDate: "", mode: "UPI" });
    toast.success(`Invoice ${newInv.id} created for ${form.student}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Fees & Billing</h1><p className="text-sm text-muted-foreground">Manage invoices, fee templates, and scholarships</p></div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Create Invoice</button>
        </div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Invoices" && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="kpi-card"><p className="text-xl font-display font-bold text-foreground">₹{(totalInvoiced / 100).toFixed(0).replace(/\B(?=(\d{2})+(?!\d))/g, ",")}K</p><p className="text-sm text-muted-foreground">Total Invoiced</p></div>
            <div className="kpi-card"><p className="text-xl font-display font-bold text-success">₹{(totalCollected / 100).toFixed(0).replace(/\B(?=(\d{2})+(?!\d))/g, ",")}K</p><p className="text-sm text-muted-foreground">Collected</p></div>
            <div className="kpi-card"><p className="text-xl font-display font-bold text-warning">₹{totalPartial.toLocaleString("en-IN")}</p><p className="text-sm text-muted-foreground">Partially Paid</p></div>
            <div className="kpi-card"><p className="text-xl font-display font-bold text-destructive">₹{totalOverdue.toLocaleString("en-IN")}</p><p className="text-sm text-muted-foreground">Overdue</p></div>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Invoice</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Institute</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Amount</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Balance</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Due Date</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Mode</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Actions</th>
            </tr></thead><tbody>{invoices.filter(i => i.student.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())).map((inv) => (
              <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-primary font-medium">{inv.id}</td>
                <td className="py-3 px-4 font-medium text-foreground">{inv.student}</td>
                <td className="py-3 px-4 text-muted-foreground">{inv.institute}</td>
                <td className="py-3 px-4 text-right font-medium text-foreground">₹{inv.amount.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-medium text-foreground">₹{inv.balance.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{inv.dueDate}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{inv.mode}</td>
                <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle[inv.status]}`}>{inv.status}</span></td>
                <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1">
                  <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground" title="View"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground" title="Send Reminder"><Send className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground" title="Download PDF"><FileText className="w-4 h-4" /></button>
                </div></td>
              </tr>
            ))}</tbody></table></div>
          </div>
        </div>
      )}

      {activeTab === "Fee Templates" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Template</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Program</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Tuition</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Exam</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Library</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Hostel</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Total</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Version</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
            </tr></thead><tbody>{feeTemplates.map((t) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{t.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{t.program}</td>
                <td className="py-3 px-4 text-right text-foreground">₹{t.tuition.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right text-foreground">₹{t.exam.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right text-foreground">₹{t.library.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right text-foreground">₹{t.hostel.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-bold text-foreground">₹{t.total.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-center text-xs text-muted-foreground font-mono">{t.version}</td>
                <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle[t.status]}`}>{t.status}</span></td>
              </tr>
            ))}</tbody></table></div>
          </div>
        </div>
      )}

      {activeTab === "Scholarships" && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scholarships.map((s) => (
              <div key={s.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all">
                <div className="flex items-center justify-between mb-3"><h3 className="font-display font-semibold text-foreground">{s.name}</h3><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyle[s.status]}`}>{s.status}</span></div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium text-foreground">{s.type}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Value</span><span className="font-medium text-foreground">{s.value}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Eligibility</span><span className="font-medium text-foreground text-right">{s.eligibility}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Students Applied</span><span className="font-medium text-foreground">{s.applied}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 mt-2"><span className="text-muted-foreground">Total Disbursed</span><span className="font-bold text-foreground">₹{s.totalAmount.toLocaleString("en-IN")}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Invoice" onSubmit={handleCreate} submitLabel="Create Invoice">
        <FormField label="Student Name" required><input className={inputClass} placeholder="Student full name" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Institute" required><select className={selectClass} value={form.institute} onChange={(e) => setForm({ ...form, institute: e.target.value })}>{institutesList.map(i => <option key={i} value={i}>{i}</option>)}</select></FormField>
          <FormField label="Amount (₹)" required><input className={inputClass} type="number" placeholder="85000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Due Date"><input className={inputClass} type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></FormField>
          <FormField label="Payment Mode"><select className={selectClass} value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>{["UPI", "Card", "Cash", "NEFT", "Cheque"].map(m => <option key={m} value={m}>{m}</option>)}</select></FormField>
        </div>
      </FormModal>
    </div>
  );
}
