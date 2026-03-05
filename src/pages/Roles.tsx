import { useState } from "react";
import { Shield, Users, Plus, Edit, Trash2, Check, X } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const allPermissions = [
  { module: "Dashboard", actions: ["View Analytics", "Export Reports", "View KPIs"] },
  { module: "Students", actions: ["View", "Add", "Edit", "Delete", "Bulk Import"] },
  { module: "Fees", actions: ["View", "Collect", "Generate Receipts", "Manage Waivers", "Refund"] },
  { module: "Attendance", actions: ["View", "Mark", "Edit", "Reports"] },
  { module: "Exams", actions: ["View", "Create", "Grade Entry", "Publish Results", "Transcripts"] },
  { module: "Library", actions: ["View Catalog", "Issue", "Return", "Add Books", "Manage Fines"] },
  { module: "Timetable", actions: ["View", "Create", "Edit", "Manage Substitutions"] },
  { module: "Hostel", actions: ["View", "Allocate Rooms", "Mess Billing", "Transport"] },
  { module: "Documents", actions: ["View Own", "Upload", "Verify", "Manage All"] },
  { module: "Certificates", actions: ["Request", "Generate", "Approve", "Print"] },
  { module: "Events", actions: ["View", "Create", "RSVP", "Publish Notices"] },
  { module: "Settings", actions: ["View", "Modify Institute", "Modify System", "Manage Users"] },
];

const rolesData = [
  { id: 1, name: "Admin", description: "Full system access across all institutes — settings, users, analytics, approvals.", users: 2, permissions: allPermissions.flatMap(p => p.actions.map(a => `${p.module}: ${a}`)), color: "bg-destructive/10 text-destructive" },
  { id: 2, name: "HOD", description: "Department-level management — faculty, attendance, exams, timetable for own department.", users: 6, permissions: ["Dashboard: View Analytics", "Students: View", "Attendance: View", "Attendance: Mark", "Exams: View", "Exams: Grade Entry", "Timetable: View", "Timetable: Manage Substitutions", "Documents: View Own"], color: "bg-primary/10 text-primary" },
  { id: 3, name: "Faculty", description: "Teaching operations — attendance marking, grade entry, assignment management, own documents.", users: 85, permissions: ["Dashboard: View KPIs", "Students: View", "Attendance: View", "Attendance: Mark", "Exams: View", "Exams: Grade Entry", "Library: View Catalog", "Documents: View Own", "Documents: Upload", "Events: View"], color: "bg-info/10 text-info" },
  { id: 4, name: "Accountant", description: "Financial operations — fee collection, receipts, waivers, refunds, and financial reports.", users: 5, permissions: ["Dashboard: View KPIs", "Students: View", "Fees: View", "Fees: Collect", "Fees: Generate Receipts", "Fees: Manage Waivers", "Fees: Refund", "Dashboard: Export Reports"], color: "bg-success/10 text-success" },
  { id: 5, name: "Student", description: "Self-service access — view own profile, attendance, grades, fee status, library, and events.", users: 2847, permissions: ["Dashboard: View KPIs", "Attendance: View", "Exams: View", "Library: View Catalog", "Documents: View Own", "Certificates: Request", "Events: View", "Events: RSVP"], color: "bg-warning/10 text-warning" },
  { id: 6, name: "Parent", description: "View child's attendance, grades, fee status, and receive notifications.", users: 1200, permissions: ["Dashboard: View KPIs", "Attendance: View", "Exams: View", "Fees: View", "Events: View"], color: "bg-accent text-accent-foreground" },
];

const initialUsers = [
  { id: 1, name: "Sudhir Patil", email: "sudhir.p@edumanage.in", role: "Group Admin (HQ)", institute: "All", status: "active", lastLogin: "2025-07-16 10:30" },
  { id: 2, name: "Dr. Meena Sharma", email: "meena.s@edumanage.in", role: "Institute Admin", institute: "B.Sc Nursing", status: "active", lastLogin: "2025-07-16 09:15" },
  { id: 3, name: "Rajiv Kumar", email: "rajiv.k@edumanage.in", role: "Accounts / Finance", institute: "All", status: "active", lastLogin: "2025-07-16 08:45" },
  { id: 4, name: "Dr. Ravi Kumar", email: "ravi.k@edumanage.in", role: "Institute Admin", institute: "GNM", status: "active", lastLogin: "2025-07-15 17:20" },
  { id: 5, name: "Sunita Rao", email: "sunita.r@edumanage.in", role: "Librarian", institute: "All", status: "active", lastLogin: "2025-07-16 11:00" },
  { id: 6, name: "Prof. Anil Deshmukh", email: "anil.d@edumanage.in", role: "Faculty", institute: "B.Sc Nursing", status: "active", lastLogin: "2025-07-16 08:30" },
  { id: 7, name: "Dr. Anjali Desai", email: "anjali.d@edumanage.in", role: "Institute Admin", institute: "Physiotherapy", status: "active", lastLogin: "2025-07-15 16:45" },
  { id: 8, name: "Ramesh Verma", email: "ramesh.v@edumanage.in", role: "Registrar / Academics", institute: "All", status: "active", lastLogin: "2025-07-16 09:00" },
];

const institutesList = ["All", "B.Sc Nursing", "GNM", "Physiotherapy", "PB.B.Sc", "M.Sc Nursing", "ANM", "OT Technology"];
const roleNames = rolesData.map(r => r.name);
const tabsList = ["Roles", "Users"];

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState("Roles");
  const [selectedRole, setSelectedRole] = useState<typeof rolesData[0] | null>(null);
  const [users, setUsers] = useState(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Faculty", institute: "All" });

  const handleAddUser = () => {
    if (!form.name || !form.email) return toast.error("Name and email are required");
    const newUser = { id: Date.now(), name: form.name, email: form.email, role: form.role, institute: form.institute, status: "active", lastLogin: "—" };
    setUsers([...users, newUser]);
    setModalOpen(false);
    setForm({ name: "", email: "", role: "Faculty", institute: "All" });
    toast.success(`User "${form.name}" added as ${form.role}`);
  };

  const handleDeleteUser = (user: typeof initialUsers[0]) => {
    setUsers(users.filter(u => u.id !== user.id));
    toast.success(`User "${user.name}" removed`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Role-Based Access Control</h1><p className="text-sm text-muted-foreground">Granular permissions for Admin, HOD, Faculty, Student, Parent & Accountant</p></div>
        <button onClick={() => { setActiveTab("Users"); setModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Add User</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="kpi-card flex items-center gap-3"><Shield className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{rolesData.length}</p><p className="text-sm text-muted-foreground">Roles Defined</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{users.length}</p><p className="text-sm text-muted-foreground">Admin Users</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Check className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">100%</p><p className="text-sm text-muted-foreground">Active Rate</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabsList.map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSelectedRole(null); }} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Roles" && !selectedRole && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {rolesData.map((role) => (
            <div key={role.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all cursor-pointer" onClick={() => setSelectedRole(role)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2"><div className={`w-8 h-8 rounded-lg ${role.color} flex items-center justify-center`}><Shield className="w-4 h-4" /></div><h3 className="font-display font-semibold text-foreground">{role.name}</h3></div>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{role.users} users</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.slice(0, 3).map((p) => (<span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{p}</span>))}
                {role.permissions.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{role.permissions.length - 3} more</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Roles" && selectedRole && (
        <div className="space-y-4 animate-fade-in">
          <button onClick={() => setSelectedRole(null)} className="text-sm text-primary font-medium hover:underline">← Back to roles</button>
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
            <div className="flex items-start gap-3 mb-6"><div className={`w-12 h-12 rounded-xl ${selectedRole.color} flex items-center justify-center`}><Shield className="w-6 h-6" /></div><div><h2 className="text-xl font-display font-bold text-foreground">{selectedRole.name}</h2><p className="text-sm text-muted-foreground">{selectedRole.description}</p><p className="text-xs text-muted-foreground mt-1">{selectedRole.users} users assigned · {selectedRole.permissions.length} permissions</p></div></div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Permission Matrix</h4>
            <div className="space-y-3">
              {allPermissions.map(mod => {
                const granted = mod.actions.filter(a => selectedRole.permissions.includes(`${mod.module}: ${a}`));
                const denied = mod.actions.filter(a => !selectedRole.permissions.includes(`${mod.module}: ${a}`));
                return (
                  <div key={mod.module} className="border border-border/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-foreground">{mod.module}</span><span className="text-[10px] text-muted-foreground">{granted.length}/{mod.actions.length} enabled</span></div>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.actions.map(a => {
                        const isGranted = selectedRole.permissions.includes(`${mod.module}: ${a}`);
                        return <span key={a} className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${isGranted ? "bg-success/10 text-success" : "bg-muted text-muted-foreground line-through opacity-50"}`}>{isGranted ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}{a}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Users" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Name</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Email</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Role</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Institute</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Last Login</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Actions</th>
          </tr></thead><tbody>{users.map((u) => (
            <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{u.name}</td>
              <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
              <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{u.role}</span></td>
              <td className="py-3 px-4 text-muted-foreground">{u.institute}</td>
              <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success capitalize">{u.status}</span></td>
              <td className="py-3 px-4 text-center text-xs text-muted-foreground">{u.lastLogin}</td>
              <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1">
                <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteUser(u)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div></td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add User" onSubmit={handleAddUser} submitLabel="Add User">
        <FormField label="Full Name" required><input className={inputClass} placeholder="User full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <FormField label="Email" required><input className={inputClass} type="email" placeholder="user@edumanage.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Role" required><select className={selectClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roleNames.map(r => <option key={r} value={r}>{r}</option>)}</select></FormField>
          <FormField label="Institute"><select className={selectClass} value={form.institute} onChange={(e) => setForm({ ...form, institute: e.target.value })}>{institutesList.map(i => <option key={i} value={i}>{i}</option>)}</select></FormField>
        </div>
      </FormModal>
    </div>
  );
}
