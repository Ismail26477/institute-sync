import { useState } from "react";
import { FileText, Download, Search, Printer, CheckCircle, Clock, Award } from "lucide-react";
import { toast } from "sonner";

const certificateTypes = [
  { id: "bonafide", name: "Bonafide Certificate", description: "Proof of enrollment for bank loans, visas, etc.", icon: "📜", avgTime: "1 day" },
  { id: "migration", name: "Migration Certificate", description: "For transfer to another university", icon: "🔄", avgTime: "3 days" },
  { id: "character", name: "Character Certificate", description: "Conduct and character attestation", icon: "⭐", avgTime: "1 day" },
  { id: "completion", name: "Course Completion", description: "Provisional certificate after final exams", icon: "🎓", avgTime: "5 days" },
  { id: "transcript", name: "Academic Transcript", description: "Detailed marks and grades for all semesters", icon: "📊", avgTime: "3 days" },
  { id: "noc", name: "No Objection Certificate", description: "NOC for various purposes", icon: "✅", avgTime: "2 days" },
];

const requestsData = [
  { id: 1, student: "Priya Sharma", rollNo: "BSN-2024-012", type: "Bonafide Certificate", purpose: "Education Loan - SBI", requestDate: "2025-07-15", status: "Ready", generatedDate: "2025-07-16" },
  { id: 2, student: "Rahul Patil", rollNo: "BSN-2024-045", type: "Character Certificate", purpose: "Job Application", requestDate: "2025-07-14", status: "Ready", generatedDate: "2025-07-15" },
  { id: 3, student: "Sneha Deshmukh", rollNo: "GNM-2024-023", type: "Migration Certificate", purpose: "University Transfer", requestDate: "2025-07-16", status: "Processing", generatedDate: null },
  { id: 4, student: "Amit Kumar", rollNo: "BSN-2024-067", type: "Academic Transcript", purpose: "Higher Studies Abroad", requestDate: "2025-07-15", status: "Processing", generatedDate: null },
  { id: 5, student: "Kavita Joshi", rollNo: "PHY-2024-011", type: "Bonafide Certificate", purpose: "Passport Application", requestDate: "2025-07-16", status: "Pending", generatedDate: null },
  { id: 6, student: "Deepak Singh", rollNo: "BSN-2024-089", type: "Course Completion", purpose: "Job Application", requestDate: "2025-07-10", status: "Ready", generatedDate: "2025-07-14" },
];

const statusColors: Record<string, string> = { Ready: "bg-success/10 text-success", Processing: "bg-info/10 text-info", Pending: "bg-warning/10 text-warning" };

export default function CertificatesPage() {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState(requestsData);
  const [activeTab, setActiveTab] = useState<"types" | "requests">("types");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filtered = requests.filter(r =>
    (!selectedType || r.type === selectedType) &&
    (r.student.toLowerCase().includes(search.toLowerCase()) || r.rollNo.toLowerCase().includes(search.toLowerCase()))
  );

  const handleGenerate = (id: number) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: "Ready", generatedDate: new Date().toISOString().split("T")[0] } : r));
    toast.success("Certificate generated");
  };

  const handleDownload = (req: typeof requestsData[0]) => {
    const cert = `${"=".repeat(60)}\n\nEDUMANAGE GROUP OF INSTITUTIONS\n${req.type.toUpperCase()}\n\n${"=".repeat(60)}\n\nCertificate No: EDU/${new Date().getFullYear()}/${String(req.id).padStart(4, "0")}\nDate: ${req.generatedDate || new Date().toISOString().split("T")[0]}\n\nThis is to certify that:\n\nName: ${req.student}\nRoll Number: ${req.rollNo}\nPurpose: ${req.purpose}\n\n${req.type === "Bonafide Certificate" ? "is a bonafide student of this institution enrolled in the academic year 2024-2025." : req.type === "Character Certificate" ? "has maintained good conduct and character during their tenure at this institution." : req.type === "Migration Certificate" ? "is hereby granted permission to migrate from this institution." : req.type === "Course Completion" ? "has successfully completed the required coursework." : "As per institutional records."}\n\n\n\nRegistrar\t\t\t\tPrincipal\nEduManage Group\t\t\tEduManage Group\n\n${"=".repeat(60)}\nVerification QR: EDU-CERT-${req.rollNo}-${req.id}\n${"=".repeat(60)}`;
    const blob = new Blob([cert], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${req.type.replace(/ /g, "_")}_${req.rollNo}.txt`; a.click();
    toast.success("Certificate downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Certificate Generator</h1><p className="text-sm text-muted-foreground">Auto-generate bonafide, migration, character & completion certificates</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="kpi-card flex items-center gap-3"><Award className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{requests.length}</p><p className="text-sm text-muted-foreground">Total Requests</p></div></div>
        <div className="kpi-card flex items-center gap-3"><CheckCircle className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{requests.filter(r => r.status === "Ready").length}</p><p className="text-sm text-muted-foreground">Ready for Collection</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Clock className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{requests.filter(r => r.status !== "Ready").length}</p><p className="text-sm text-muted-foreground">In Progress</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["types", "requests"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {activeTab === "types" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {certificateTypes.map(ct => (
            <div key={ct.id} onClick={() => { setSelectedType(ct.name); setActiveTab("requests"); }} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{ct.icon}</span>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{ct.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{ct.description}</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Avg. processing: {ct.avgTime}</p>
                  <p className="text-xs text-primary mt-1">{requests.filter(r => r.type === ct.name).length} requests</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "requests" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm flex-1 max-w-md"><Search className="w-4 h-4 text-muted-foreground" /><input className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <select className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border" value={selectedType || ""} onChange={e => setSelectedType(e.target.value || null)}>
              <option value="">All Types</option>{certificateTypes.map(ct => <option key={ct.id} value={ct.name}>{ct.name}</option>)}
            </select>
          </div>

          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Student</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Type</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Purpose</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Status</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Actions</th>
            </tr></thead><tbody>{filtered.map(r => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="py-3 px-4"><div><p className="font-medium text-foreground">{r.student}</p><p className="text-xs text-muted-foreground">{r.rollNo}</p></div></td>
                <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{r.type}</span></td>
                <td className="py-3 px-4 text-muted-foreground">{r.purpose}</td>
                <td className="py-3 px-4 text-center"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status]}`}>{r.status}</span></td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {r.status === "Pending" && <button onClick={() => handleGenerate(r.id)} className="text-xs px-3 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20">Generate</button>}
                    {r.status === "Ready" && <>
                      <button onClick={() => handleDownload(r)} className="p-1.5 rounded-md hover:bg-muted text-primary"><Download className="w-4 h-4" /></button>
                      <button onClick={() => toast.success("Sending to printer...")} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"><Printer className="w-4 h-4" /></button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}</tbody></table></div>
          </div>
        </div>
      )}
    </div>
  );
}
