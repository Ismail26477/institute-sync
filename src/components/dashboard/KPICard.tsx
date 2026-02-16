import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: KPICardProps) {
  return (
    <div className="kpi-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            iconColor || "bg-accent text-accent-foreground"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              changeType === "up"
                ? "bg-success/10 text-success"
                : changeType === "down"
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {changeType === "up" && <TrendingUp className="w-3 h-3" />}
            {changeType === "down" && <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}
