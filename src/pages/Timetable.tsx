import { useState } from "react";
import { CalendarDays, Plus, Clock, MapPin, User, RefreshCw, X, Pencil, Trash2 } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = ["9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00"];

type CellData = { subject: string; teacher: string; room: string };

const initialSchedule: Record<string, Record<string, CellData>> = {
  Monday: { "9:00-10:00": { subject: "Anatomy", teacher: "Dr. Meena", room: "LH-101" }, "10:00-11:00": { subject: "Physiology", teacher: "Prof. Anil", room: "LH-102" }, "11:00-12:00": { subject: "Biochemistry", teacher: "Dr. Ravi", room: "Lab-A" }, "2:00-3:00": { subject: "Microbiology", teacher: "Dr. Anjali", room: "LH-103" } },
  Tuesday: { "9:00-10:00": { subject: "Pharmacology", teacher: "Dr. Sharma", room: "LH-104" }, "10:00-11:00": { subject: "Anatomy", teacher: "Dr. Meena", room: "LH-101" }, "1:00-2:00": { subject: "Nursing Foundation", teacher: "Prof. Sunita", room: "LH-201" }, "3:00-4:00": { subject: "Community Health", teacher: "Dr. Patil", room: "LH-202" } },
  Wednesday: { "9:00-10:00": { subject: "Physiology Lab", teacher: "Prof. Anil", room: "Lab-B" }, "11:00-12:00": { subject: "Anatomy", teacher: "Dr. Meena", room: "LH-101" }, "2:00-3:00": { subject: "Pharmacology", teacher: "Dr. Sharma", room: "LH-104" } },
  Thursday: { "9:00-10:00": { subject: "Biochemistry", teacher: "Dr. Ravi", room: "Lab-A" }, "10:00-11:00": { subject: "Microbiology", teacher: "Dr. Anjali", room: "LH-103" }, "1:00-2:00": { subject: "Nursing Foundation", teacher: "Prof. Sunita", room: "LH-201" }, "3:00-4:00": { subject: "Physiology", teacher: "Prof. Anil", room: "LH-102" } },
  Friday: { "9:00-10:00": { subject: "Community Health", teacher: "Dr. Patil", room: "LH-202" }, "10:00-11:00": { subject: "Clinical Practice", teacher: "Dr. Meena", room: "Hospital" }, "11:00-12:00": { subject: "Clinical Practice", teacher: "Dr. Meena", room: "Hospital" }, "2:00-3:00": { subject: "Pharmacology", teacher: "Dr. Sharma", room: "LH-104" } },
  Saturday: { "9:00-10:00": { subject: "Anatomy Lab", teacher: "Dr. Meena", room: "Lab-C" }, "10:00-11:00": { subject: "Anatomy Lab", teacher: "Dr. Meena", room: "Lab-C" } },
};

const rooms = ["LH-101", "LH-102", "LH-103", "LH-104", "LH-201", "LH-202", "Lab-A", "Lab-B", "Lab-C", "Hospital", "Seminar Hall"];
const teachers = ["Dr. Meena", "Prof. Anil", "Dr. Ravi", "Dr. Anjali", "Dr. Sharma", "Prof. Sunita", "Dr. Patil"];
const subjects = ["Anatomy", "Anatomy Lab", "Physiology", "Physiology Lab", "Biochemistry", "Microbiology", "Pharmacology", "Nursing Foundation", "Community Health", "Clinical Practice"];
const colors: Record<string, string> = { Anatomy: "bg-primary/10 text-primary border-primary/20", "Anatomy Lab": "bg-primary/15 text-primary border-primary/25", Physiology: "bg-info/10 text-info border-info/20", "Physiology Lab": "bg-info/15 text-info border-info/25", Biochemistry: "bg-warning/10 text-warning border-warning/20", Microbiology: "bg-success/10 text-success border-success/20", Pharmacology: "bg-destructive/10 text-destructive border-destructive/20", "Nursing Foundation": "bg-accent text-accent-foreground border-accent", "Community Health": "bg-muted text-foreground border-border", "Clinical Practice": "bg-primary/20 text-primary border-primary/30" };

const substitutions = [
  { id: 1, date: "2025-07-17", original: "Dr. Meena", substitute: "Dr. Ravi", subject: "Anatomy", slot: "9:00-10:00", reason: "Medical Leave" },
  { id: 2, date: "2025-07-18", original: "Prof. Anil", substitute: "Dr. Anjali", subject: "Physiology", slot: "10:00-11:00", reason: "Conference" },
];

export default function TimetablePage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [activeTab, setActiveTab] = useState<"timetable" | "rooms" | "substitutions">("timetable");
  const [selectedProgram, setSelectedProgram] = useState("B.Sc Nursing - Year 1");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{ day: string; slot: string } | null>(null);
  const [form, setForm] = useState({ subject: subjects[0], teacher: teachers[0], room: rooms[0] });

  const handleAutoGenerate = () => {
    toast.success("Timetable auto-generated for " + selectedProgram);
  };

  const openAddModal = (day: string, slot: string) => {
    setEditTarget({ day, slot });
    const existing = schedule[day]?.[slot];
    if (existing) {
      setForm({ subject: existing.subject, teacher: existing.teacher, room: existing.room });
    } else {
      setForm({ subject: subjects[0], teacher: teachers[0], room: rooms[0] });
    }
    setModalOpen(true);
  };

  const handleSaveSlot = () => {
    if (!editTarget) return;
    const { day, slot } = editTarget;

    // Check for conflicts
    const conflict = Object.entries(schedule).find(([d, slots]) => {
      if (d === day) return false;
      const s = slots[slot];
      return s && (s.teacher === form.teacher || s.room === form.room);
    });

    if (conflict) {
      const [cDay, cSlots] = conflict;
      const c = cSlots[slot];
      if (c.teacher === form.teacher) {
        toast.error(`${form.teacher} is already assigned on ${cDay} at ${slot}`);
        return;
      }
      if (c.room === form.room) {
        toast.error(`${form.room} is already booked on ${cDay} at ${slot}`);
        return;
      }
    }

    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [slot]: { subject: form.subject, teacher: form.teacher, room: form.room } },
    }));
    setModalOpen(false);
    setEditTarget(null);
    toast.success(`${schedule[day]?.[slot] ? "Updated" : "Added"} ${form.subject} on ${day} ${slot}`);
  };

  const handleDeleteSlot = (day: string, slot: string) => {
    setSchedule(prev => {
      const newDay = { ...prev[day] };
      delete newDay[slot];
      return { ...prev, [day]: newDay };
    });
    toast.success(`Removed class from ${day} ${slot}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Timetable & Scheduling</h1><p className="text-sm text-muted-foreground">Class schedules, room allocation & teacher substitutions</p></div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-lg bg-muted text-foreground text-sm border border-border" value={selectedProgram} onChange={e => setSelectedProgram(e.target.value)}>
            <option>B.Sc Nursing - Year 1</option><option>B.Sc Nursing - Year 2</option><option>GNM - Year 1</option><option>Physiotherapy - Year 1</option>
          </select>
          <button onClick={handleAutoGenerate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"><RefreshCw className="w-4 h-4" /> Auto-Generate</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="kpi-card flex items-center gap-3"><CalendarDays className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{Object.values(schedule).reduce((c, d) => c + Object.keys(d).length, 0)}</p><p className="text-sm text-muted-foreground">Classes/Week</p></div></div>
        <div className="kpi-card flex items-center gap-3"><MapPin className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{rooms.length}</p><p className="text-sm text-muted-foreground">Rooms Available</p></div></div>
        <div className="kpi-card flex items-center gap-3"><User className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{teachers.length}</p><p className="text-sm text-muted-foreground">Faculty Assigned</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["timetable", "rooms", "substitutions"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${activeTab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {activeTab === "timetable" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase w-24">Time</th>
                {days.map(d => <th key={d} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase">{d}</th>)}
              </tr></thead>
              <tbody>{timeSlots.map(slot => (
                <tr key={slot} className="border-b border-border/50">
                  <td className="py-2 px-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{slot}</td>
                  {days.map(day => {
                    const cell = schedule[day]?.[slot];
                    return (
                      <td key={day} className="py-1.5 px-1.5">
                        {cell ? (
                          <div className={`rounded-lg border p-2 text-xs relative group ${colors[cell.subject] || "bg-muted text-foreground border-border"}`}>
                            <p className="font-semibold truncate">{cell.subject}</p>
                            <p className="opacity-75 truncate">{cell.teacher}</p>
                            <p className="opacity-60 truncate flex items-center gap-1"><MapPin className="w-3 h-3" />{cell.room}</p>
                            <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-0.5">
                              <button onClick={(e) => { e.stopPropagation(); openAddModal(day, slot); }} className="p-1 rounded bg-card/80 hover:bg-card shadow-sm"><Pencil className="w-3 h-3" /></button>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteSlot(day, slot); }} className="p-1 rounded bg-card/80 hover:bg-destructive/20 shadow-sm text-destructive"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => openAddModal(day, slot)} className="w-full h-16 rounded-lg border border-dashed border-border/40 flex items-center justify-center text-muted-foreground/40 hover:bg-muted/30 hover:border-primary/40 hover:text-primary/60 cursor-pointer transition-colors"><Plus className="w-3 h-3" /></button>
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

      {activeTab === "rooms" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {rooms.map(room => {
            const occupiedSlots = Object.values(schedule).reduce((c, daySlots) => c + Object.values(daySlots).filter(s => s.room === room).length, 0);
            const utilization = Math.round((occupiedSlots / (timeSlots.length * days.length)) * 100);
            return (
              <div key={room} className="bg-card rounded-xl border border-border/50 shadow-card p-4">
                <div className="flex items-center justify-between mb-3"><h3 className="font-display font-semibold text-foreground">{room}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${utilization > 50 ? "bg-success/10 text-success" : utilization > 20 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{utilization}% used</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2"><div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${utilization}%` }} /></div>
                <p className="text-xs text-muted-foreground">{occupiedSlots} of {timeSlots.length * days.length} slots occupied</p>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "substitutions" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Date</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Original</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Substitute</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Subject</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Slot</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">Reason</th>
          </tr></thead><tbody>{substitutions.map(s => (
            <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20"><td className="py-3 px-4 font-medium text-foreground">{s.date}</td><td className="py-3 px-4 text-muted-foreground">{s.original}</td><td className="py-3 px-4 text-foreground">{s.substitute}</td><td className="py-3 px-4">{s.subject}</td><td className="py-3 px-4 font-mono text-xs">{s.slot}</td><td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">{s.reason}</span></td></tr>
          ))}</tbody></table></div>
        </div>
      )}

      <FormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} title={editTarget && schedule[editTarget.day]?.[editTarget.slot] ? "Edit Class" : "Add Class"} onSubmit={handleSaveSlot} submitLabel="Save">
        {editTarget && (
          <div className="p-3 bg-muted/50 rounded-lg mb-2">
            <p className="text-sm text-foreground font-medium">{editTarget.day} · {editTarget.slot}</p>
          </div>
        )}
        <FormField label="Subject" required>
          <select className={selectClass} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Teacher" required>
          <select className={selectClass} value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })}>
            {teachers.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Room" required>
          <select className={selectClass} value={form.room} onChange={e => setForm({ ...form, room: e.target.value })}>
            {rooms.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </FormField>
      </FormModal>
    </div>
  );
}
