import { useState } from "react";
import { Home, Bus, UtensilsCrossed, Plus, Users, MapPin, IndianRupee } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const tabs = ["Room Allocation", "Mess Billing", "Bus Routes", "Transport Fees"];

interface Room {
  id: number; room: string; floor: string; block: string; capacity: number; occupied: number; students: string[]; status: string;
}

const initialRooms: Room[] = [
  { id: 1, room: "A-101", floor: "Ground", block: "Block A (Girls)", capacity: 3, occupied: 3, students: ["Priya Sharma", "Ananya Patel", "Kavita Nair"], status: "full" },
  { id: 2, room: "A-102", floor: "Ground", block: "Block A (Girls)", capacity: 3, occupied: 2, students: ["Meera Joshi", "Sneha Iyer"], status: "available" },
  { id: 3, room: "A-201", floor: "First", block: "Block A (Girls)", capacity: 3, occupied: 3, students: ["Ritu Desai", "Pooja Mishra", "Swati Rao"], status: "full" },
  { id: 4, room: "B-101", floor: "Ground", block: "Block B (Boys)", capacity: 4, occupied: 3, students: ["Rahul Verma", "Vikram Singh", "Arjun Reddy"], status: "available" },
  { id: 5, room: "B-102", floor: "Ground", block: "Block B (Boys)", capacity: 4, occupied: 4, students: ["Deepak Gupta", "Amit Tiwari", "Rohan Mehta", "Karan Shah"], status: "full" },
  { id: 6, room: "B-201", floor: "First", block: "Block B (Boys)", capacity: 4, occupied: 2, students: ["Nikhil Jain", "Siddharth Das"], status: "available" },
  { id: 7, room: "C-101", floor: "Ground", block: "Block C (PG)", capacity: 2, occupied: 0, students: [], status: "vacant" },
  { id: 8, room: "C-102", floor: "Ground", block: "Block C (PG)", capacity: 2, occupied: 1, students: ["Dr. Anjali Kumar"], status: "available" },
];

const messBilling = [
  { id: 1, month: "June 2025", plan: "Veg Full Board", students: 124, ratePerDay: 120, workingDays: 26, totalBilled: 387360, collected: 320000, pending: 67360 },
  { id: 2, month: "June 2025", plan: "Non-Veg Full Board", students: 86, ratePerDay: 150, workingDays: 26, totalBilled: 335400, collected: 290000, pending: 45400 },
  { id: 3, month: "May 2025", plan: "Veg Full Board", students: 124, ratePerDay: 120, workingDays: 24, totalBilled: 357120, collected: 357120, pending: 0 },
  { id: 4, month: "May 2025", plan: "Non-Veg Full Board", students: 86, ratePerDay: 150, workingDays: 24, totalBilled: 309600, collected: 309600, pending: 0 },
];

const busRoutes = [
  { id: 1, route: "Route 1 — City Center", stops: ["Main Gate", "Clock Tower", "MG Road", "Railway Station", "Bus Stand"], distance: "12 km", bus: "KA-01-AB-1234", driver: "Rajesh Kumar", capacity: 45, booked: 38, fee: 1500, timing: "7:30 AM / 4:30 PM" },
  { id: 2, route: "Route 2 — Suburbs North", stops: ["Main Gate", "Nehru Nagar", "Gandhi Chowk", "Industrial Area", "Airport Road"], distance: "18 km", bus: "KA-01-CD-5678", driver: "Suresh Patil", capacity: 45, booked: 42, fee: 2000, timing: "7:15 AM / 4:30 PM" },
  { id: 3, route: "Route 3 — Suburbs South", stops: ["Main Gate", "Lake View", "IT Park", "Ring Road", "South Terminal"], distance: "15 km", bus: "KA-01-EF-9012", driver: "Manoj Singh", capacity: 40, booked: 28, fee: 1800, timing: "7:45 AM / 4:45 PM" },
  { id: 4, route: "Route 4 — Highway Belt", stops: ["Main Gate", "Bypass Junction", "Toll Plaza", "Highway Colony", "Satellite Town"], distance: "25 km", bus: "KA-01-GH-3456", driver: "Vinod Sharma", capacity: 40, booked: 35, fee: 2500, timing: "7:00 AM / 5:00 PM" },
];

const transportFees = [
  { id: 1, student: "Priya Sharma", route: "Route 1", fee: 1500, semester: "Sem 3", paid: true, mode: "Linked to Fees" },
  { id: 2, student: "Rahul Verma", route: "Route 2", fee: 2000, semester: "Sem 3", paid: false, mode: "Pending" },
  { id: 3, student: "Arjun Reddy", route: "Route 1", fee: 1500, semester: "Sem 3", paid: true, mode: "Linked to Fees" },
  { id: 4, student: "Meera Joshi", route: "Route 3", fee: 1800, semester: "Sem 3", paid: true, mode: "Linked to Fees" },
  { id: 5, student: "Amit Tiwari", route: "Route 4", fee: 2500, semester: "Sem 3", paid: false, mode: "Pending" },
  { id: 6, student: "Deepak Gupta", route: "Route 2", fee: 2000, semester: "Sem 3", paid: true, mode: "Linked to Fees" },
];

export default function HostelPage() {
  const [activeTab, setActiveTab] = useState("Room Allocation");
  const [rooms, setRooms] = useState(initialRooms);
  const [allocateModal, setAllocateModal] = useState(false);
  const [allocateForm, setAllocateForm] = useState({ studentName: "", room: "A-102" });

  const totalBeds = rooms.reduce((a, b) => a + b.capacity, 0);
  const occupiedBeds = rooms.reduce((a, b) => a + b.occupied, 0);

  const handleAllocate = () => {
    if (!allocateForm.studentName) return toast.error("Student name is required");
    const room = rooms.find(r => r.room === allocateForm.room);
    if (!room || room.occupied >= room.capacity) return toast.error("Room is full");
    setRooms(rooms.map(r => r.room === allocateForm.room ? { ...r, occupied: r.occupied + 1, students: [...r.students, allocateForm.studentName], status: r.occupied + 1 >= r.capacity ? "full" : "available" } : r));
    setAllocateModal(false);
    setAllocateForm({ studentName: "", room: "A-102" });
    toast.success(`${allocateForm.studentName} allocated to Room ${allocateForm.room}`);
  };

  const roomStatusStyle: Record<string, string> = { full: "bg-destructive/10 text-destructive", available: "bg-success/10 text-success", vacant: "bg-muted text-muted-foreground" };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Hostel & Transport</h1><p className="text-sm text-muted-foreground">Room allocation, mess billing, bus routes & transport fees</p></div>
        {activeTab === "Room Allocation" && (
          <button onClick={() => setAllocateModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Allocate Room</button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><Home className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{rooms.length}</p><p className="text-sm text-muted-foreground">Total Rooms</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{occupiedBeds}/{totalBeds}</p><p className="text-sm text-muted-foreground">Beds Occupied</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Bus className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{busRoutes.length}</p><p className="text-sm text-muted-foreground">Bus Routes</p></div></div>
        <div className="kpi-card flex items-center gap-3"><UtensilsCrossed className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{messBilling[0].students + messBilling[1].students}</p><p className="text-sm text-muted-foreground">Mess Subscribers</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Room Allocation" && (
        <div className="space-y-4 animate-fade-in">
          {/* Floor Map Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {["Block A (Girls)", "Block B (Boys)", "Block C (PG)"].map(block => {
              const blockRooms = rooms.filter(r => r.block === block);
              return (
                <div key={block} className="bg-card rounded-xl border border-border/50 shadow-card p-4">
                  <h3 className="font-display font-semibold text-foreground mb-3 text-sm">{block}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {blockRooms.map(r => (
                      <div key={r.id} className={`p-3 rounded-lg border text-center ${r.status === "full" ? "bg-destructive/5 border-destructive/20" : r.status === "vacant" ? "bg-muted/50 border-border" : "bg-success/5 border-success/20"}`}>
                        <p className="font-mono text-xs font-bold text-foreground">{r.room}</p>
                        <p className="text-[10px] text-muted-foreground">{r.floor}</p>
                        <p className="text-xs mt-1"><span className="font-medium">{r.occupied}</span>/<span className="text-muted-foreground">{r.capacity}</span></p>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${roomStatusStyle[r.status]}`}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Room Table */}
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Room</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Block</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Floor</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Capacity</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Occupied</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Students</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
            </tr></thead><tbody>{rooms.map((r) => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-mono text-sm font-bold text-foreground">{r.room}</td>
                <td className="py-3 px-4 text-muted-foreground">{r.block}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{r.floor}</td>
                <td className="py-3 px-4 text-center text-foreground">{r.capacity}</td>
                <td className="py-3 px-4 text-center text-foreground">{r.occupied}</td>
                <td className="py-3 px-4 text-muted-foreground text-xs">{r.students.join(", ") || "—"}</td>
                <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${roomStatusStyle[r.status]}`}>{r.status}</span></td>
              </tr>
            ))}</tbody></table></div>
          </div>
        </div>
      )}

      {activeTab === "Mess Billing" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Month</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Plan</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Students</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Rate/Day</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Days</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Total Billed</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Collected</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Pending</th>
          </tr></thead><tbody>{messBilling.map((m) => (
            <tr key={m.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{m.month}</td>
              <td className="py-3 px-4 text-muted-foreground">{m.plan}</td>
              <td className="py-3 px-4 text-center text-foreground">{m.students}</td>
              <td className="py-3 px-4 text-right text-foreground">₹{m.ratePerDay}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{m.workingDays}</td>
              <td className="py-3 px-4 text-right font-medium text-foreground">₹{m.totalBilled.toLocaleString("en-IN")}</td>
              <td className="py-3 px-4 text-right text-success font-medium">₹{m.collected.toLocaleString("en-IN")}</td>
              <td className="py-3 px-4 text-right"><span className={m.pending > 0 ? "text-destructive font-medium" : "text-success"}>₹{m.pending.toLocaleString("en-IN")}</span></td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "Bus Routes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
          {busRoutes.map((route) => (
            <div key={route.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center"><Bus className="w-5 h-5 text-info" /></div><div><h3 className="font-display font-semibold text-foreground text-sm">{route.route}</h3><p className="text-xs text-muted-foreground">{route.bus} · {route.driver}</p></div></div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{route.timing}</span>
              </div>
              <div className="flex items-center gap-1 mb-3 flex-wrap">{route.stops.map((stop, i) => (
                <span key={i} className="flex items-center gap-1 text-xs"><MapPin className="w-3 h-3 text-muted-foreground" /><span className="text-muted-foreground">{stop}</span>{i < route.stops.length - 1 && <span className="text-muted-foreground">→</span>}</span>
              ))}</div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-2 bg-muted/30 rounded-lg text-center"><p className="text-xs text-muted-foreground">Distance</p><p className="font-medium text-foreground">{route.distance}</p></div>
                <div className="p-2 bg-muted/30 rounded-lg text-center"><p className="text-xs text-muted-foreground">Seats</p><p className="font-medium text-foreground">{route.booked}/{route.capacity}</p></div>
                <div className="p-2 bg-muted/30 rounded-lg text-center"><p className="text-xs text-muted-foreground">Fee/Sem</p><p className="font-medium text-foreground">₹{route.fee.toLocaleString("en-IN")}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Transport Fees" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Route</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Fee</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Semester</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Mode</th>
          </tr></thead><tbody>{transportFees.map((t) => (
            <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{t.student}</td>
              <td className="py-3 px-4 text-muted-foreground">{t.route}</td>
              <td className="py-3 px-4 text-right text-foreground">₹{t.fee.toLocaleString("en-IN")}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{t.semester}</td>
              <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.paid ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{t.paid ? "Paid" : "Pending"}</span></td>
              <td className="py-3 px-4 text-muted-foreground text-xs">{t.mode}</td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      <FormModal open={allocateModal} onClose={() => setAllocateModal(false)} title="Allocate Room" onSubmit={handleAllocate} submitLabel="Allocate">
        <FormField label="Student Name" required><input className={inputClass} placeholder="Student full name" value={allocateForm.studentName} onChange={(e) => setAllocateForm({ ...allocateForm, studentName: e.target.value })} /></FormField>
        <FormField label="Room">
          <select className={selectClass} value={allocateForm.room} onChange={(e) => setAllocateForm({ ...allocateForm, room: e.target.value })}>
            {rooms.filter(r => r.occupied < r.capacity).map(r => <option key={r.room} value={r.room}>{r.room} ({r.block}) — {r.capacity - r.occupied} bed(s) free</option>)}
          </select>
        </FormField>
      </FormModal>
    </div>
  );
}
