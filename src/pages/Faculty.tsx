import { useState, useEffect } from "react";
import { Users, Plus, Briefcase, Clock, Calendar, IndianRupee, CheckCircle, XCircle, MapPin } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const facultyData = [
  { id: 1, facId: "FAC-0001", name: "Dr. Meena Sharma", designation: "Professor & HOD", department: "Nursing", qualification: "Ph.D Nursing", experience: 18, subjects: ["Anatomy", "Clinical Practice"], workload: 22, maxLoad: 24, leaves: { taken: 3, total: 30 }, salary: 125000, status: "Active", joinDate: "2012-06-15" },
  { id: 2, facId: "FAC-0002", name: "Prof. Anil Deshmukh", designation: "Associate Professor", department: "Nursing", qualification: "M.Sc Nursing", experience: 12, subjects: ["Physiology", "Physiology Lab"], workload: 20, maxLoad: 24, leaves: { taken: 5, total: 30 }, salary: 95000, status: "Active", joinDate: "2015-07-01" },
  { id: 3, facId: "FAC-0003", name: "Dr. Ravi Kumar", designation: "Assistant Professor", department: "Biochemistry", qualification: "Ph.D Biochemistry", experience: 8, subjects: ["Biochemistry"], workload: 18, maxLoad: 24, leaves: { taken: 2, total: 30 }, salary: 78000, status: "Active", joinDate: "2018-01-10" },
  { id: 4, facId: "FAC-0004", name: "Dr. Anjali Desai", designation: "Professor", department: "Microbiology", qualification: "M.D Microbiology", experience: 15, subjects: ["Microbiology"], workload: 16, maxLoad: 24, leaves: { taken: 8, total: 30 }, salary: 110000, status: "Active", joinDate: "2014-03-20" },
  { id: 5, facId: "FAC-0005", name: "Dr. Sharma", designation: "Associate Professor", department: "Pharmacology", qualification: "Ph.D Pharmacology", experience: 10, subjects: ["Pharmacology"], workload: 20, maxLoad: 24, leaves: { taken: 1, total: 30 }, salary: 92000, status: "Active", joinDate: "2017-08-15" },
  { id: 6, facId: "FAC-0006", name: "Prof. Sunita Rao", designation: "Assistant Professor", department: "Nursing", qualification: "M.Sc Nursing", experience: 6, subjects: ["Nursing Foundation"], workload: 22, maxLoad: 24, leaves: { taken: 4, total: 30 }, salary: 68000, status: "Active", joinDate: "2020-01-05" },
  { id: 7, facId: "FAC-0007", name: "Dr. Patil", designation: "Assistant Professor", department: "Community Health", qualification: "MPH", experience: 5, subjects: ["Community Health"], workload: 18, maxLoad: 24, leaves: { taken: 6, total: 30 }, salary: 65000, status: "On Leave", joinDate: "2021-06-01" },
];

interface AttendanceRecord {
  id: string;
  faculty_id: string;
  faculty_name: string;
  department: string;
  date: string;
  status: string;
  punch_in: string | null;
  punch_out: string | null;
  auto_detected: boolean;
  total_hours: number | null;
}

interface LeaveRequest {
  id: string;
  faculty_id: string;
  faculty_name: string;
  department: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  created_at: string;
}

export default function FacultyPage() {
  const [activeTab, setActiveTab] = useState<"profiles" | "attendance" | "workload" | "leaves" | "payroll">("profiles");
  const [selectedFaculty, setSelectedFaculty] = useState<typeof facultyData[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveForm, setLeaveForm] = useState({ facultyId: "", leaveType: "casual", startDate: "", endDate: "", reason: "" });

  useEffect(() => {
    loadAttendance();
    loadLeaveRequests();
  }, []);

  const loadAttendance = async () => {
    const { data } = await supabase
      .from("faculty_attendance")
      .select("*")
      .order("date", { ascending: false })
      .limit(50);
    if (data) setAttendance(data);
  };

  const loadLeaveRequests = async () => {
    const { data } = await supabase
      .from("leave_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) setLeaveRequests(data);
  };

  const handleApproveLeave = async (id: string) => {
    await supabase.from("leave_requests").update({ status: "approved", approved_by: "Admin" }).eq("id", id);
    toast.success("Leave approved");
    loadLeaveRequests();
  };

  const handleRejectLeave = async (id: string) => {
    await supabase.from("leave_requests").update({ status: "rejected" }).eq("id", id);
    toast.success("Leave rejected");
    loadLeaveRequests();
  };

  const handleSubmitLeave = async () => {
    const fac = facultyData.find((f) => f.facId === leaveForm.facultyId);
    if (!fac || !leaveForm.startDate || !leaveForm.endDate) {
      toast.error("Please fill all fields");
      return;
    }
    await supabase.from("leave_requests").insert({
      faculty_id: fac.facId,
      faculty_name: fac.name,
      department: fac.department,
      leave_type: leaveForm.leaveType,
      start_date: leaveForm.startDate,
      end_date: leaveForm.endDate,
      reason: leaveForm.reason,
    });
    toast.success("Leave request submitted");
    setLeaveModalOpen(false);
    setLeaveForm({ facultyId: "", leaveType: "casual", startDate: "", endDate: "", reason: "" });
    loadLeaveRequests();
  };

  const todayAttendance = attendance.filter((a) => a.date === new Date().toISOString().split("T")[0]);
  const presentToday = todayAttendance.filter((a) => a.status === "present").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Faculty Management</h1>
          <p className="text-sm text-muted-foreground">Profiles, attendance, workload, leaves & payroll</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLeaveModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted transition-colors">
            <Calendar className="w-4 h-4" /> Apply Leave
          </button>
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90">
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{facultyData.length}</p><p className="text-sm text-muted-foreground">Total Faculty</p></div></div>
        <div className="kpi-card flex items-center gap-3"><MapPin className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{presentToday}</p><p className="text-sm text-muted-foreground">Present Today</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Briefcase className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{Math.round(facultyData.reduce((s, f) => s + f.workload, 0) / facultyData.length)}h</p><p className="text-sm text-muted-foreground">Avg Workload</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Clock className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{leaveRequests.filter((l) => l.status === "pending").length}</p><p className="text-sm text-muted-foreground">Pending Leaves</p></div></div>
        <div className="kpi-card flex items-center gap-3"><IndianRupee className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">₹{(facultyData.reduce((s, f) => s + f.salary, 0) / 100000).toFixed(1)}L</p><p className="text-sm text-muted-foreground">Monthly Payroll</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["profiles", "attendance", "workload", "leaves", "payroll"] as const).map((t) => (
          <button key={t} onClick={() => { setActiveTab(t); setSelectedFaculty(null); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {/* PROFILES TAB */}
      {activeTab === "profiles" && !selectedFaculty && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {facultyData.map((f) => (
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

      {/* ATTENDANCE TAB (Cloud-powered) */}
      {activeTab === "attendance" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg w-fit">
            <MapPin className="w-3.5 h-3.5 text-success" />
            <span>Auto-detected via GPS geofence · Synced from Cloud</span>
          </div>

          {attendance.length === 0 ? (
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-12 text-center">
              <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">No attendance records yet</p>
              <p className="text-sm text-muted-foreground mt-1">Go to GPS Tracking → click "Refresh & Sync" to auto-mark faculty attendance via geofence</p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Faculty</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Department</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Date</th>
                      <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Status</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Punch In</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Detection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a) => (
                      <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="py-3 px-4 font-medium text-foreground">{a.faculty_name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{a.department}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{a.date}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === "present" ? "bg-success/10 text-success" : a.status === "late" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{a.punch_in ? new Date(a.punch_in).toLocaleTimeString() : "—"}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${a.auto_detected ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"}`}>
                            {a.auto_detected ? "🛰️ GPS Auto" : "Manual"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WORKLOAD TAB */}
      {activeTab === "workload" && (
        <div className="space-y-4 animate-fade-in">
          {facultyData.map((f) => (
            <div key={f.id} className="bg-card rounded-xl border border-border/50 shadow-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">{f.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1"><p className="text-sm font-medium text-foreground truncate">{f.name}</p><span className="text-xs text-muted-foreground">{f.workload}/{f.maxLoad} hrs</span></div>
                <div className="w-full bg-muted rounded-full h-2.5"><div className={`rounded-full h-2.5 transition-all ${f.workload / f.maxLoad > 0.9 ? "bg-destructive" : f.workload / f.maxLoad > 0.7 ? "bg-warning" : "bg-success"}`} style={{ width: `${(f.workload / f.maxLoad) * 100}%` }} /></div>
              </div>
              <div className="flex flex-wrap gap-1">{f.subjects.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s}</span>)}</div>
            </div>
          ))}
        </div>
      )}

      {/* LEAVES TAB (Cloud-powered) */}
      {activeTab === "leaves" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          {leaveRequests.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium">No leave requests yet</p>
              <p className="text-sm text-muted-foreground mt-1">Click "Apply Leave" to create one</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Faculty</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Type</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Duration</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Reason</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Status</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((l) => {
                    const days = Math.ceil((new Date(l.end_date).getTime() - new Date(l.start_date).getTime()) / 86400000) + 1;
                    return (
                      <tr key={l.id} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="py-3 px-4">
                          <p className="font-medium text-foreground">{l.faculty_name}</p>
                          <p className="text-[10px] text-muted-foreground">{l.department}</p>
                        </td>
                        <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize">{l.leave_type}</span></td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{l.start_date} → {l.end_date} ({days}d)</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{l.reason}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${l.status === "approved" ? "bg-success/10 text-success" : l.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{l.status}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {l.status === "pending" && (
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleApproveLeave(l.id)} className="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => handleRejectLeave(l.id)} className="p-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20" title="Reject"><XCircle className="w-4 h-4" /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PAYROLL TAB */}
      {activeTab === "payroll" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Faculty</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Designation</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Basic</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">HRA</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Deductions</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Net Pay</th>
                </tr>
              </thead>
              <tbody>
                {facultyData.map((f) => {
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Faculty Modal */}
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

      {/* Apply Leave Modal */}
      <FormModal open={leaveModalOpen} onClose={() => setLeaveModalOpen(false)} title="Apply Leave" onSubmit={handleSubmitLeave} submitLabel="Submit Request">
        <FormField label="Faculty" required>
          <select className={selectClass} value={leaveForm.facultyId} onChange={(e) => setLeaveForm({ ...leaveForm, facultyId: e.target.value })}>
            <option value="">Select faculty…</option>
            {facultyData.map((f) => <option key={f.facId} value={f.facId}>{f.name}</option>)}
          </select>
        </FormField>
        <FormField label="Leave Type">
          <select className={selectClass} value={leaveForm.leaveType} onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}>
            <option value="casual">Casual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="earned">Earned Leave</option>
            <option value="maternity">Maternity Leave</option>
            <option value="other">Other</option>
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" required><input className={inputClass} type="date" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} /></FormField>
          <FormField label="End Date" required><input className={inputClass} type="date" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} /></FormField>
        </div>
        <FormField label="Reason"><input className={inputClass} placeholder="Reason for leave…" value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} /></FormField>
      </FormModal>
    </div>
  );
}
