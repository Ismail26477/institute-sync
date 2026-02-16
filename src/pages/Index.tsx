import {
  IndianRupee,
  TrendingUp,
  GraduationCap,
  UserPlus,
  BookOpen,
  Clock,
  Award,
  AlertTriangle,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CollectionsByInstitute } from "@/components/dashboard/CollectionsByInstitute";
import { PaymentModeMix } from "@/components/dashboard/PaymentModeMix";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { OverdueTable } from "@/components/dashboard/OverdueTable";

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Multi-institute overview · Academic Year 2025–26
          </p>
        </div>
        <div className="flex gap-2">
          <select className="text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-ring outline-none">
            <option>All Institutes</option>
            <option>B.Sc Nursing</option>
            <option>GNM</option>
            <option>Physiotherapy</option>
            <option>PB.B.Sc</option>
            <option>M.Sc Nursing</option>
            <option>ANM</option>
            <option>OT Tech</option>
          </select>
          <select className="text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-ring outline-none">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Today's Revenue"
          value="₹4,82,500"
          change="+12.5%"
          changeType="up"
          icon={IndianRupee}
          iconColor="gradient-primary text-primary-foreground"
        />
        <KPICard
          title="MTD Revenue"
          value="₹38,45,000"
          change="+8.2%"
          changeType="up"
          icon={TrendingUp}
          iconColor="bg-success/15 text-success"
        />
        <KPICard
          title="Active Students"
          value="2,847"
          change="+142"
          changeType="up"
          icon={GraduationCap}
          iconColor="bg-info/15 text-info"
        />
        <KPICard
          title="Fees Due (7 days)"
          value="₹12,30,000"
          change="89 students"
          changeType="neutral"
          icon={Clock}
          iconColor="bg-warning/15 text-warning"
        />
      </div>

      {/* Second KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Overdue Amount"
          value="₹8,65,000"
          change="-3.1%"
          changeType="down"
          icon={AlertTriangle}
          iconColor="bg-destructive/15 text-destructive"
        />
        <KPICard
          title="New Admissions"
          value="156"
          change="This month"
          changeType="neutral"
          icon={UserPlus}
          iconColor="bg-accent text-accent-foreground"
        />
        <KPICard
          title="Library Activity"
          value="342"
          change="Books issued today"
          changeType="neutral"
          icon={BookOpen}
          iconColor="bg-info/15 text-info"
        />
        <KPICard
          title="Scholarship Spend"
          value="₹5,20,000"
          change="78 students"
          changeType="neutral"
          icon={Award}
          iconColor="bg-success/15 text-success"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <CollectionsByInstitute />
      </div>

      {/* Payment mix + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PaymentModeMix />
        <div className="lg:col-span-2">
          <AlertsPanel />
        </div>
      </div>

      {/* Overdue table */}
      <OverdueTable />
    </div>
  );
};

export default Index;
