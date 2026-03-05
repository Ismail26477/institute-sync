import { useState } from "react";
import { Calendar, Plus, Bell, Users, MapPin, Clock, Eye, Send } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const eventsData = [
  { id: 1, title: "Annual Sports Day", date: "2025-08-15", time: "9:00 AM", venue: "College Ground", type: "Sports", description: "Inter-department sports competition with 15+ events", rsvps: 345, capacity: 500, status: "Upcoming" },
  { id: 2, title: "Guest Lecture: Healthcare Innovation", date: "2025-07-25", time: "2:00 PM", venue: "Seminar Hall", type: "Academic", description: "Dr. Rajesh Mehta on emerging trends in healthcare technology", rsvps: 120, capacity: 150, status: "Upcoming" },
  { id: 3, title: "Blood Donation Camp", date: "2025-07-30", time: "10:00 AM", venue: "College Auditorium", type: "Social", description: "In collaboration with Red Cross Society", rsvps: 89, capacity: 200, status: "Upcoming" },
  { id: 4, title: "Freshers Welcome Party", date: "2025-08-05", time: "5:00 PM", venue: "College Auditorium", type: "Cultural", description: "Welcome ceremony for new batch 2025-26", rsvps: 280, capacity: 400, status: "Upcoming" },
  { id: 5, title: "Mid-Semester Exam Review", date: "2025-07-18", time: "11:00 AM", venue: "LH-101", type: "Academic", description: "Faculty meeting for mid-semester evaluation review", rsvps: 25, capacity: 30, status: "Completed" },
  { id: 6, title: "Independence Day Celebration", date: "2025-08-15", time: "8:00 AM", venue: "Main Campus", type: "National", description: "Flag hoisting and cultural program", rsvps: 500, capacity: 1000, status: "Upcoming" },
];

const notices = [
  { id: 1, title: "Exam Schedule Published", date: "2025-07-16", priority: "High", audience: "All Students", content: "Mid-semester exam schedule for July 2025 has been published." },
  { id: 2, title: "Library Timing Change", date: "2025-07-15", priority: "Medium", audience: "All", content: "Library will remain open till 9 PM during exam period." },
  { id: 3, title: "Fee Payment Deadline", date: "2025-07-14", priority: "High", audience: "Defaulters", content: "Last date for fee payment is July 31, 2025." },
  { id: 4, title: "Hostel Maintenance", date: "2025-07-13", priority: "Low", audience: "Hostel Students", content: "Water supply will be disrupted on July 20 for maintenance." },
  { id: 5, title: "Placement Drive Registration", date: "2025-07-12", priority: "High", audience: "Final Year", content: "Register for upcoming placement drive by July 25." },
];

const typeColors: Record<string, string> = { Sports: "bg-success/10 text-success", Academic: "bg-primary/10 text-primary", Social: "bg-info/10 text-info", Cultural: "bg-warning/10 text-warning", National: "bg-destructive/10 text-destructive" };
const priorityColors: Record<string, string> = { High: "bg-destructive/10 text-destructive", Medium: "bg-warning/10 text-warning", Low: "bg-muted text-muted-foreground" };

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"events" | "notices">("events");
  const [modalOpen, setModalOpen] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);

  const handleRSVP = (title: string) => toast.success(`RSVP confirmed for "${title}"`);
  const handleSendNotification = (title: string) => toast.success(`Push notification sent for "${title}"`);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Events & Notice Board</h1><p className="text-sm text-muted-foreground">Campus events, circulars & notifications</p></div>
        <div className="flex gap-2">
          <button onClick={() => setNoticeModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/80"><Bell className="w-4 h-4" /> Post Notice</button>
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"><Plus className="w-4 h-4" /> Create Event</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><Calendar className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{eventsData.filter(e => e.status === "Upcoming").length}</p><p className="text-sm text-muted-foreground">Upcoming Events</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{eventsData.reduce((s, e) => s + e.rsvps, 0)}</p><p className="text-sm text-muted-foreground">Total RSVPs</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Bell className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{notices.length}</p><p className="text-sm text-muted-foreground">Active Notices</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Send className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">12</p><p className="text-sm text-muted-foreground">Notifications Sent</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["events", "notices"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {activeTab === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {eventsData.map(e => (
            <div key={e.id} className="bg-card rounded-xl border border-border/50 shadow-card p-5 hover:shadow-elevated transition-all">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[e.type] || "bg-muted text-muted-foreground"}`}>{e.type}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === "Upcoming" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{e.status}</span>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{e.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{e.description}</p>
              <div className="space-y-1 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-2"><Calendar className="w-3 h-3" />{e.date}</div>
                <div className="flex items-center gap-2"><Clock className="w-3 h-3" />{e.time}</div>
                <div className="flex items-center gap-2"><MapPin className="w-3 h-3" />{e.venue}</div>
              </div>
              <div className="flex items-center justify-between">
                <div><div className="flex items-center gap-1 mb-1"><Users className="w-3 h-3 text-muted-foreground" /><span className="text-xs text-muted-foreground">{e.rsvps}/{e.capacity} RSVPs</span></div>
                  <div className="w-32 bg-muted rounded-full h-1.5"><div className="bg-primary rounded-full h-1.5" style={{ width: `${(e.rsvps / e.capacity) * 100}%` }} /></div>
                </div>
                {e.status === "Upcoming" && <button onClick={() => handleRSVP(e.title)} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">RSVP</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "notices" && (
        <div className="space-y-3 animate-fade-in">
          {notices.map(n => (
            <div key={n.id} className="bg-card rounded-xl border border-border/50 shadow-card p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Bell className="w-5 h-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><h3 className="font-medium text-foreground text-sm">{n.title}</h3><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColors[n.priority]}`}>{n.priority}</span></div>
                <p className="text-sm text-muted-foreground mb-1">{n.content}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground"><span>{n.date}</span><span>·</span><span>{n.audience}</span></div>
              </div>
              <button onClick={() => handleSendNotification(n.title)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground shrink-0" title="Send push notification"><Send className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Event" onSubmit={() => { setModalOpen(false); toast.success("Event created"); }} submitLabel="Create Event">
        <FormField label="Event Title" required><input className={inputClass} placeholder="Annual Sports Day" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date" required><input className={inputClass} type="date" /></FormField>
          <FormField label="Time"><input className={inputClass} type="time" /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Venue"><input className={inputClass} placeholder="Seminar Hall" /></FormField>
          <FormField label="Type"><select className={selectClass}><option>Academic</option><option>Sports</option><option>Cultural</option><option>Social</option><option>National</option></select></FormField>
        </div>
        <FormField label="Capacity"><input className={inputClass} type="number" placeholder="200" /></FormField>
        <FormField label="Description"><input className={inputClass} placeholder="Event details..." /></FormField>
      </FormModal>

      <FormModal open={noticeModal} onClose={() => setNoticeModal(false)} title="Post Notice" onSubmit={() => { setNoticeModal(false); toast.success("Notice published"); }} submitLabel="Publish">
        <FormField label="Title" required><input className={inputClass} placeholder="Notice title" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Priority"><select className={selectClass}><option>High</option><option>Medium</option><option>Low</option></select></FormField>
          <FormField label="Audience"><select className={selectClass}><option>All</option><option>All Students</option><option>Final Year</option><option>Hostel Students</option><option>Faculty</option></select></FormField>
        </div>
        <FormField label="Content"><input className={inputClass} placeholder="Notice content..." /></FormField>
      </FormModal>
    </div>
  );
}
