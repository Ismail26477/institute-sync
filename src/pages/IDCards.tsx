import { useState } from "react";
import { CreditCard, Download, Printer, Search, QrCode, User } from "lucide-react";
import { toast } from "sonner";

const studentsData = [
  { id: 1, name: "Priya Sharma", rollNo: "BSN-2024-012", program: "B.Sc Nursing", year: "1st Year", dob: "2005-03-15", blood: "B+", phone: "9876543210", address: "Pune, Maharashtra", photo: null, idGenerated: true },
  { id: 2, name: "Rahul Patil", rollNo: "BSN-2024-045", program: "B.Sc Nursing", year: "1st Year", dob: "2004-08-22", blood: "O+", phone: "9876543211", address: "Mumbai, Maharashtra", photo: null, idGenerated: true },
  { id: 3, name: "Sneha Deshmukh", rollNo: "GNM-2024-023", program: "GNM", year: "1st Year", dob: "2005-01-10", blood: "A+", phone: "9876543212", address: "Nagpur, Maharashtra", photo: null, idGenerated: false },
  { id: 4, name: "Amit Kumar", rollNo: "BSN-2024-067", program: "B.Sc Nursing", year: "2nd Year", dob: "2003-12-05", blood: "AB+", phone: "9876543213", address: "Delhi", photo: null, idGenerated: true },
  { id: 5, name: "Kavita Joshi", rollNo: "PHY-2024-011", program: "Physiotherapy", year: "1st Year", dob: "2005-06-20", blood: "O-", phone: "9876543214", address: "Nashik, Maharashtra", photo: null, idGenerated: false },
  { id: 6, name: "Deepak Singh", rollNo: "BSN-2024-089", program: "B.Sc Nursing", year: "1st Year", dob: "2004-09-18", blood: "B-", phone: "9876543215", address: "Kolhapur, Maharashtra", photo: null, idGenerated: false },
];

export default function IDCardsPage() {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<typeof studentsData[0] | null>(null);
  const [filterProgram, setFilterProgram] = useState("All");

  const filtered = studentsData.filter(s =>
    (filterProgram === "All" || s.program === filterProgram) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()))
  );

  const handleGenerate = (student: typeof studentsData[0]) => {
    setSelectedStudent(student);
    toast.success(`ID Card generated for ${student.name}`);
  };

  const handlePrint = () => {
    toast.success("Sending to printer...");
  };

  const handleDownload = () => {
    if (!selectedStudent) return;
    const card = `STUDENT IDENTITY CARD\n${"=".repeat(40)}\nEduManage Group of Institutions\n\nName: ${selectedStudent.name}\nRoll No: ${selectedStudent.rollNo}\nProgram: ${selectedStudent.program}\nYear: ${selectedStudent.year}\nDOB: ${selectedStudent.dob}\nBlood Group: ${selectedStudent.blood}\nPhone: ${selectedStudent.phone}\nAddress: ${selectedStudent.address}\n\nQR Code: EDU-${selectedStudent.rollNo}\nBarcode: ${selectedStudent.rollNo.replace(/-/g, "")}\n\nValid: 2024-2025\nIssued: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([card], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `ID_${selectedStudent.rollNo}.txt`; a.click();
    toast.success("ID Card downloaded");
  };

  const handleBulkGenerate = () => {
    toast.success(`Generated ${filtered.length} ID cards`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Student ID Card Generator</h1><p className="text-sm text-muted-foreground">Generate digital & printable ID cards with QR codes</p></div>
        <button onClick={handleBulkGenerate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"><CreditCard className="w-4 h-4" /> Bulk Generate</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="kpi-card flex items-center gap-3"><CreditCard className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{studentsData.filter(s => s.idGenerated).length}</p><p className="text-sm text-muted-foreground">IDs Generated</p></div></div>
        <div className="kpi-card flex items-center gap-3"><User className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{studentsData.filter(s => !s.idGenerated).length}</p><p className="text-sm text-muted-foreground">Pending</p></div></div>
        <div className="kpi-card flex items-center gap-3"><QrCode className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{studentsData.length}</p><p className="text-sm text-muted-foreground">Total Students</p></div></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm flex-1 max-w-md"><Search className="w-4 h-4 text-muted-foreground" /><input className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground" placeholder="Search by name or roll no..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border" value={filterProgram} onChange={e => setFilterProgram(e.target.value)}>
          <option value="All">All Programs</option><option>B.Sc Nursing</option><option>GNM</option><option>Physiotherapy</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student List */}
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <div className="p-4 border-b border-border"><h3 className="font-display font-semibold text-foreground">Select Student</h3></div>
          <div className="divide-y divide-border/50 max-h-[500px] overflow-y-auto">
            {filtered.map(s => (
              <div key={s.id} onClick={() => handleGenerate(s)} className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/30 ${selectedStudent?.id === s.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">{s.name.split(" ").map(n => n[0]).join("")}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{s.name}</p><p className="text-xs text-muted-foreground">{s.rollNo} · {s.program}</p></div>
                {s.idGenerated ? <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Generated</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">Pending</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ID Card Preview */}
        <div className="space-y-4">
          {selectedStudent ? (
            <>
              <div className="bg-card rounded-xl border-2 border-primary/20 shadow-card overflow-hidden">
                {/* Front */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
                  <div className="flex items-center justify-between">
                    <div><p className="text-xs opacity-80">EduManage Group of Institutions</p><p className="font-display font-bold text-lg">STUDENT IDENTITY CARD</p></div>
                    <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center"><QrCode className="w-8 h-8" /></div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex gap-4">
                    <div className="w-24 h-28 rounded-lg bg-muted flex items-center justify-center border border-border"><User className="w-10 h-10 text-muted-foreground" /></div>
                    <div className="flex-1 space-y-1.5">
                      <div><p className="text-xs text-muted-foreground">Name</p><p className="text-sm font-semibold text-foreground">{selectedStudent.name}</p></div>
                      <div><p className="text-xs text-muted-foreground">Roll Number</p><p className="text-sm font-mono text-foreground">{selectedStudent.rollNo}</p></div>
                      <div className="flex gap-4">
                        <div><p className="text-xs text-muted-foreground">Program</p><p className="text-sm text-foreground">{selectedStudent.program}</p></div>
                        <div><p className="text-xs text-muted-foreground">Year</p><p className="text-sm text-foreground">{selectedStudent.year}</p></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 gap-2 text-center">
                    <div><p className="text-[10px] text-muted-foreground">DOB</p><p className="text-xs font-medium text-foreground">{selectedStudent.dob}</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Blood</p><p className="text-xs font-medium text-foreground">{selectedStudent.blood}</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Valid</p><p className="text-xs font-medium text-foreground">2024-25</p></div>
                  </div>
                  <div className="mt-3 flex items-center justify-center"><div className="bg-muted rounded px-4 py-1.5 font-mono text-xs tracking-widest text-foreground">||| {selectedStudent.rollNo.replace(/-/g, " ")} |||</div></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleDownload} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"><Download className="w-4 h-4" /> Download</button>
                <button onClick={handlePrint} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/80"><Printer className="w-4 h-4" /> Print</button>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-12 flex flex-col items-center justify-center text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-foreground font-medium">Select a student</p>
              <p className="text-sm text-muted-foreground">Click on a student to preview their ID card</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
