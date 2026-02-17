import { useState } from "react";
import { Shield, Users, Plus, Edit, Trash2, Check, X } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const rolesData = [
  { id: 1, name: "Group Admin (HQ)", description: "Cross-institute settings, fee templates, approvals, analytics, user management.", users: 2, permissions: ["All Institutes", "Settings", "Approvals", "Analytics", "User Management"] },
  { id: 2, name: "Institute Admin", description: "Manage fees, students, library, documents for one institute.", users: 7, permissions: ["Own Institute", "Students", "Fees", "Library", "Documents"] },
  { id: 3, name: "Accounts / Finance", description: "Billing, collections, refunds, scholarships, financial reports.", users: 5, permissions: ["Billing", "Collections", "Refunds", "Scholarships", "Reports"] },
  { id: 4, name: "Registrar / Academics", description: "Programs, batches, timetables, enrollments, attendance.", users: 4, permissions: ["Programs", "Batches", "Timetables", "Enrollments", "Attendance"] },
  { id: 5, name: "Librarian", description: "Catalog, issues/returns, fines, holds, vendor records.", users: 3, permissions: ["Catalog", "Circulation", "Fines", "Inventory", "Vendors"] },
  { id: 6, name: "Faculty", description: "Attendance marking, grades, internal document access.", users: 85, permissions: ["Attendance", "Grades", "Own Documents"] },
  { id: 7, name: "Student", description: "Mobile app access — library, fees, notices, profile.", users: 2847, permissions: ["Own Profile", "Library Search", "Fee Status", "Notifications"] },
  { id: 8, name: "Alumni", description: "Limited portal access for certificates and events.", users: 450, permissions: ["Own Profile", "Certificates", "Events"] },
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
        <div><h1 className="text-2xl font-display font-bold text-foreground">User Roles & Access</h1><p className="text-sm text-muted-foreground">Role-based access control (RBAC) management</p></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {rolesData.map((role) => (
            <div key={role.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all cursor-pointer" onClick={() => setSelectedRole(role)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /><h3 className="font-display font-semibold text-foreground">{role.name}</h3></div>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{role.users} users</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.slice(0, 4).map((p) => (<span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{p}</span>))}
                {role.permissions.length > 4 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{role.permissions.length - 4}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Roles" && selectedRole && (
        <div className="space-y-4 animate-fade-in">
          <button onClick={() => setSelectedRole(null)} className="text-sm text-primary font-medium hover:underline">← Back to roles</button>
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6">
            <div className="flex items-start gap-3 mb-4"><Shield className="w-8 h-8 text-primary" /><div><h2 className="text-xl font-display font-bold text-foreground">{selectedRole.name}</h2><p className="text-sm text-muted-foreground">{selectedRole.description}</p></div></div>
            <h4 className="font-medium text-foreground mb-2 text-sm">Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {selectedRole.permissions.map((p) => (<span key={p} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-success/10 text-success font-medium"><Check className="w-3 h-3" />{p}</span>))}
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
