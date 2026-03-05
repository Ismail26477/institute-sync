import { useState } from "react";
import { FlaskConical, Plus, Clock, MapPin, CheckCircle, XCircle, Calendar } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const resources = [
  { id: 1, name: "Anatomy Lab (Lab-A)", type: "Laboratory", capacity: 40, equipment: ["Microscopes", "Skeleton Models", "Dissection Kits"], status: "Available" },
  { id: 2, name: "Physiology Lab (Lab-B)", type: "Laboratory", capacity: 35, equipment: ["ECG Machine", "Spirometer", "BP Apparatus"], status: "In Use" },
  { id: 3, name: "Microbiology Lab (Lab-C)", type: "Laboratory", capacity: 30, equipment: ["Autoclave", "Incubator", "Culture Media"], status: "Available" },
  { id: 4, name: "Seminar Hall", type: "Hall", capacity: 150, equipment: ["Projector", "Sound System", "Whiteboard"], status: "Available" },
  { id: 5, name: "Computer Lab", type: "Laboratory", capacity: 50, equipment: ["50 PCs", "Printer", "Scanner"], status: "Maintenance" },
  { id: 6, name: "Conference Room A", type: "Room", capacity: 20, equipment: ["Projector", "Video Conferencing", "Whiteboard"], status: "Available" },
  { id: 7, name: "Nursing Skills Lab", type: "Laboratory", capacity: 25, equipment: ["Mannequins", "IV Setup", "Wound Care Kits"], status: "In Use" },
  { id: 8, name: "Auditorium", type: "Hall", capacity: 500, equipment: ["Stage", "Sound System", "Lighting", "Projector"], status: "Available" },
];

const timeSlots = ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"];

const bookingsData = [
  { id: 1, resource: "Anatomy Lab (Lab-A)", bookedBy: "Dr. Meena Sharma", date: "2025-07-17", slot: "9:00-10:00", purpose: "Anatomy Practical - Year 1", status: "Confirmed" },
  { id: 2, resource: "Seminar Hall", bookedBy: "Prof. Anil Deshmukh", date: "2025-07-17", slot: "2:00-3:00", purpose: "Guest Lecture", status: "Confirmed" },
  { id: 3, resource: "Computer Lab", bookedBy: "Dr. Ravi Kumar", date: "2025-07-18", slot: "10:00-11:00", purpose: "Online Assessment", status: "Pending" },
  { id: 4, resource: "Nursing Skills Lab", bookedBy: "Prof. Sunita Rao", date: "2025-07-17", slot: "11:00-12:00", purpose: "Skills Practice Session", status: "Confirmed" },
  { id: 5, resource: "Auditorium", bookedBy: "Admin Office", date: "2025-07-25", slot: "9:00-10:00", purpose: "Guest Lecture Event", status: "Pending" },
];

const statusColors: Record<string, string> = { Available: "bg-success/10 text-success", "In Use": "bg-warning/10 text-warning", Maintenance: "bg-destructive/10 text-destructive", Confirmed: "bg-success/10 text-success", Pending: "bg-warning/10 text-warning" };
const statusIcons: Record<string, React.ReactNode> = { Available: <CheckCircle className="w-4 h-4 text-success" />, "In Use": <Clock className="w-4 h-4 text-warning" />, Maintenance: <XCircle className="w-4 h-4 text-destructive" /> };

export default function LabBookingPage() {
  const [activeTab, setActiveTab] = useState<"resources" | "bookings" | "schedule">("resources");
  const [bookings, setBookings] = useState(bookingsData);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState("");

  const handleBook = (resourceName?: string) => {
    if (resourceName) setSelectedResource(resourceName);
    setModalOpen(true);
  };

  const handleApproveBooking = (id: number) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: "Confirmed" } : b));
    toast.success("Booking confirmed");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Lab & Resource Booking</h1><p className="text-sm text-muted-foreground">Book labs, halls, projectors & equipment</p></div>
        <button onClick={() => handleBook()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"><Plus className="w-4 h-4" /> New Booking</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><FlaskConical className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{resources.length}</p><p className="text-sm text-muted-foreground">Total Resources</p></div></div>
        <div className="kpi-card flex items-center gap-3"><CheckCircle className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{resources.filter(r => r.status === "Available").length}</p><p className="text-sm text-muted-foreground">Available Now</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Clock className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{resources.filter(r => r.status === "In Use").length}</p><p className="text-sm text-muted-foreground">In Use</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Calendar className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{bookings.length}</p><p className="text-sm text-muted-foreground">Today's Bookings</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["resources", "bookings", "schedule"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {activeTab === "resources" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {resources.map(r => (
            <div key={r.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">{statusIcons[r.status]}<h3 className="font-display font-semibold text-foreground text-sm">{r.name}</h3></div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status]}`}>{r.status}</span>
              </div>
              <div className="space-y-2 text-xs mb-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground">{r.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Capacity</span><span className="text-foreground">{r.capacity} persons</span></div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">{r.equipment.map(e => <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{e}</span>)}</div>
              {r.status === "Available" && <button onClick={() => handleBook(r.name)} className="w-full text-xs py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">Book Now</button>}
            </div>
          ))}
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Resource</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Booked By</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Date</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Slot</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Purpose</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Status</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Action</th>
          </tr></thead><tbody>{bookings.map(b => (
            <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20">
              <td className="py-3 px-4 font-medium text-foreground">{b.resource}</td>
              <td className="py-3 px-4 text-muted-foreground">{b.bookedBy}</td>
              <td className="py-3 px-4 text-muted-foreground">{b.date}</td>
              <td className="py-3 px-4 font-mono text-xs">{b.slot}</td>
              <td className="py-3 px-4 text-muted-foreground">{b.purpose}</td>
              <td className="py-3 px-4 text-center"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>{b.status}</span></td>
              <td className="py-3 px-4 text-right">{b.status === "Pending" && <button onClick={() => handleApproveBooking(b.id)} className="text-xs px-3 py-1 rounded-md bg-success/10 text-success hover:bg-success/20">Confirm</button>}</td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-border"><h3 className="font-display font-semibold text-foreground">Today's Schedule — July 17, 2025</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase w-24">Slot</th>
                {resources.slice(0, 5).map(r => <th key={r.id} className="text-left py-3 px-2 text-muted-foreground font-medium text-[10px] uppercase">{r.name.split("(")[0].trim()}</th>)}
              </tr></thead>
              <tbody>{timeSlots.map(slot => (
                <tr key={slot} className="border-b border-border/50">
                  <td className="py-2 px-3 font-mono text-xs text-muted-foreground">{slot}</td>
                  {resources.slice(0, 5).map(r => {
                    const booking = bookings.find(b => b.resource === r.name && b.slot === slot);
                    return (
                      <td key={r.id} className="py-1.5 px-1.5">
                        {booking ? (
                          <div className="rounded-lg border border-primary/20 bg-primary/5 p-1.5 text-xs">
                            <p className="font-semibold text-primary truncate">{booking.bookedBy}</p>
                            <p className="text-muted-foreground truncate">{booking.purpose}</p>
                          </div>
                        ) : (
                          <div className="h-10 rounded-lg border border-dashed border-border/40 flex items-center justify-center text-muted-foreground/30 hover:bg-muted/20 cursor-pointer"><Plus className="w-3 h-3" /></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Book Resource" onSubmit={() => { setModalOpen(false); toast.success("Booking request submitted"); }} submitLabel="Submit Booking">
        <FormField label="Resource" required><select className={selectClass} value={selectedResource} onChange={e => setSelectedResource(e.target.value)}><option value="">Select resource</option>{resources.filter(r => r.status === "Available").map(r => <option key={r.id} value={r.name}>{r.name}</option>)}</select></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date" required><input className={inputClass} type="date" /></FormField>
          <FormField label="Time Slot" required><select className={selectClass}>{timeSlots.map(s => <option key={s} value={s}>{s}</option>)}</select></FormField>
        </div>
        <FormField label="Purpose"><input className={inputClass} placeholder="Practical session / Event" /></FormField>
        <FormField label="Booked By"><input className={inputClass} placeholder="Faculty name" /></FormField>
      </FormModal>
    </div>
  );
}
