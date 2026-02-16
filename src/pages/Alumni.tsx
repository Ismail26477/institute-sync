import { useState } from "react";
import { Users, Search, Mail, Briefcase, GraduationCap, Calendar, MapPin, Download } from "lucide-react";

const alumniData = [
  { id: 1, name: "Dr. Shalini Mehta", program: "B.Sc Nursing", batch: "2012-16", graduationYear: 2016, email: "shalini.m@gmail.com", phone: "+91 98765 10001", currentRole: "Head Nurse", organization: "Apollo Hospital, Chennai", location: "Chennai" },
  { id: 2, name: "Rajesh Krishnan", program: "GNM", batch: "2014-17", graduationYear: 2017, email: "rajesh.k@gmail.com", phone: "+91 98765 10002", currentRole: "Senior Nurse", organization: "AIIMS, Delhi", location: "New Delhi" },
  { id: 3, name: "Pooja Agarwal", program: "BPT", batch: "2013-17", graduationYear: 2017, email: "pooja.a@gmail.com", phone: "+91 98765 10003", currentRole: "Physiotherapist", organization: "Max Hospital, Gurugram", location: "Gurugram" },
  { id: 4, name: "Suresh Nambiar", program: "M.Sc Nursing", batch: "2016-18", graduationYear: 2018, email: "suresh.n@gmail.com", phone: "+91 98765 10004", currentRole: "Nursing Educator", organization: "CMC Vellore", location: "Vellore" },
  { id: 5, name: "Nisha Gupta", program: "B.Sc Nursing", batch: "2015-19", graduationYear: 2019, email: "nisha.g@gmail.com", phone: "+91 98765 10005", currentRole: "ICU Nurse", organization: "Fortis Hospital, Mumbai", location: "Mumbai" },
  { id: 6, name: "Amit Sharma", program: "ANM", batch: "2018-20", graduationYear: 2020, email: "amit.s@gmail.com", phone: "+91 98765 10006", currentRole: "Community Health Worker", organization: "PHC Jaipur", location: "Jaipur" },
  { id: 7, name: "Divya Pillai", program: "PB.B.Sc", batch: "2019-21", graduationYear: 2021, email: "divya.p@gmail.com", phone: "+91 98765 10007", currentRole: "Ward In-charge", organization: "KMC Hospital, Mangalore", location: "Mangalore" },
  { id: 8, name: "Karan Singh", program: "OT Technology", batch: "2020-22", graduationYear: 2022, email: "karan.s@gmail.com", phone: "+91 98765 10008", currentRole: "OT Technician", organization: "Medanta, Lucknow", location: "Lucknow" },
];

export default function AlumniPage() {
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");

  const programs = [...new Set(alumniData.map(a => a.program))];
  const filtered = alumniData.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.organization.toLowerCase().includes(search.toLowerCase());
    const matchProgram = filterProgram === "all" || a.program === filterProgram;
    return matchSearch && matchProgram;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Alumni Portal</h1>
          <p className="text-sm text-muted-foreground">{alumniData.length} registered alumni</p>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"><Download className="w-4 h-4" /> Export Directory</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{alumniData.length}</p><p className="text-sm text-muted-foreground">Total Alumni</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Briefcase className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">94%</p><p className="text-sm text-muted-foreground">Employment Rate</p></div></div>
        <div className="kpi-card flex items-center gap-3"><MapPin className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">12</p><p className="text-sm text-muted-foreground">Cities</p></div></div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search alumni..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
        </div>
        <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
          <option value="all">All Programs</option>
          {programs.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <div key={a.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all animate-fade-in">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground truncate">{a.name}</h3>
                <p className="text-xs text-muted-foreground">{a.program} · Batch {a.batch}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Briefcase className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{a.currentRole} at {a.organization}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-3.5 h-3.5 shrink-0" />{a.location}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{a.email}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-3.5 h-3.5 shrink-0" />Graduated {a.graduationYear}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
