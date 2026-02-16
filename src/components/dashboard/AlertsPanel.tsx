import { AlertTriangle, Clock, FileWarning, BookOpen } from "lucide-react";

const alerts = [
  {
    icon: FileWarning,
    title: "Accreditation expiry — GNM Institute",
    description: "NAAC certificate expires in 23 days. Upload renewal docs.",
    type: "critical" as const,
    time: "2 hours ago",
  },
  {
    icon: Clock,
    title: "Fee schedule pending — PB.B.Sc 2025‑26",
    description: "Draft fee template not yet published for upcoming year.",
    type: "warning" as const,
    time: "5 hours ago",
  },
  {
    icon: BookOpen,
    title: "Library overdue spike — Physiotherapy",
    description: "32 books overdue > 14 days. 12 students affected.",
    type: "warning" as const,
    time: "1 day ago",
  },
  {
    icon: AlertTriangle,
    title: "Low balance — Scholarship fund",
    description: "Only ₹45,000 remaining in management scholarship pool.",
    type: "info" as const,
    time: "1 day ago",
  },
];

const typeStyles = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-info/10 text-info border-info/20",
};

export function AlertsPanel() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-5 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-foreground">Active Alerts</h3>
          <p className="text-sm text-muted-foreground">{alerts.length} items need attention</p>
        </div>
        <button className="text-sm text-primary font-medium hover:underline">View all</button>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg border ${typeStyles[alert.type]} transition-all hover:shadow-sm`}
          >
            <alert.icon className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{alert.title}</p>
              <p className="text-xs opacity-80 mt-0.5">{alert.description}</p>
            </div>
            <span className="text-[10px] opacity-60 shrink-0 mt-0.5">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
