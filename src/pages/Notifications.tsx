import { useState } from "react";
import { Bell, Check, Clock, AlertTriangle, Send, Filter, Search, Mail, MessageSquare, Smartphone } from "lucide-react";

const tabs = ["All", "Fee Reminders", "Library", "Academic", "System"];

const notificationsData = [
  { id: 1, title: "Fee due reminder sent to 89 students", description: "Automated reminder for fees due within 7 days. Channels: Push, SMS, Email.", type: "Fee Reminders", channel: "Multi", time: "2 hours ago", status: "sent", recipients: 89 },
  { id: 2, title: "Library overdue notice — Ananya Patel", description: "Book 'Fundamentals of Nursing' overdue by 17 days. Fine: ₹170.", type: "Library", channel: "Push", time: "3 hours ago", status: "sent", recipients: 1 },
  { id: 3, title: "Invoice INV-2025-003 overdue", description: "Invoice for Ananya Patel (₹62,000 balance) is 46 days overdue. Escalated.", type: "Fee Reminders", channel: "Email", time: "5 hours ago", status: "sent", recipients: 1 },
  { id: 4, title: "NAAC certificate expiring — GNM", description: "NAAC certificate for GNM Institute expires in 23 days. Action needed.", type: "System", channel: "Email", time: "1 day ago", status: "sent", recipients: 3 },
  { id: 5, title: "Timetable updated — B.Sc Year 1", description: "Monday schedule changed: Pharmacology moved to 10:30 AM slot.", type: "Academic", channel: "Push", time: "1 day ago", status: "sent", recipients: 130 },
  { id: 6, title: "Scholarship approved — Vikram Singh", description: "SC/ST Scholarship (₹25,000) approved for Vikram Singh (STU004).", type: "Fee Reminders", channel: "SMS", time: "2 days ago", status: "sent", recipients: 1 },
  { id: 7, title: "Library book available — Reserved hold", description: "Book 'Anatomy & Physiology' is now available for Meera Joshi.", type: "Library", channel: "Push", time: "2 days ago", status: "sent", recipients: 1 },
  { id: 8, title: "Daily revenue report delivered", description: "Daily revenue summary for 15 Jul 2025 sent to 5 stakeholders.", type: "System", channel: "Email", time: "3 days ago", status: "sent", recipients: 5 },
  { id: 9, title: "Attendance alert — Arjun Reddy", description: "Attendance dropped below 75% (currently 72%). Guardian notification triggered.", type: "Academic", channel: "SMS", time: "3 days ago", status: "sent", recipients: 2 },
  { id: 10, title: "Fee schedule published — 2025-26", description: "All institute fee templates for AY 2025-26 have been published.", type: "System", channel: "Multi", time: "1 week ago", status: "sent", recipients: 12 },
];

const channelIcon: Record<string, typeof Mail> = {
  Email: Mail,
  SMS: MessageSquare,
  Push: Smartphone,
  Multi: Send,
};

const typeColor: Record<string, string> = {
  "Fee Reminders": "bg-warning/10 text-warning",
  Library: "bg-info/10 text-info",
  Academic: "bg-accent text-accent-foreground",
  System: "bg-muted text-muted-foreground",
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = notificationsData.filter((n) => {
    const matchTab = activeTab === "All" || n.type === activeTab;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">Notification center and communication logs</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Send className="w-4 h-4" /> Send Notification</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><Send className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">1,245</p><p className="text-sm text-muted-foreground">Total Sent</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Mail className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">486</p><p className="text-sm text-muted-foreground">Emails</p></div></div>
        <div className="kpi-card flex items-center gap-3"><MessageSquare className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">312</p><p className="text-sm text-muted-foreground">SMS/WhatsApp</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Smartphone className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">447</p><p className="text-sm text-muted-foreground">Push</p></div></div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search notifications..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
        </div>
      </div>

      <div className="space-y-3 animate-fade-in">
        {filtered.map((n) => {
          const ChannelIcon = channelIcon[n.channel] || Send;
          return (
            <div key={n.id} className="bg-card rounded-xl border border-border/50 shadow-card p-4 hover:shadow-elevated transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ChannelIcon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-foreground text-sm">{n.title}</h3>
                    <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeColor[n.type]}`}>{n.type}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{n.recipients} recipient{n.recipients > 1 ? "s" : ""}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-success font-medium flex items-center gap-0.5"><Check className="w-3 h-3" />{n.status}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
