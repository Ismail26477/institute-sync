import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  IndianRupee,
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Bell,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  UserCog,
  ClipboardList,
  CheckSquare,
  CreditCard,
  Home,
  Bus,
  PieChart,
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, path: "/" },
      { title: "Analytics", icon: PieChart, path: "/analytics" },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Institutes", icon: Building2, path: "/institutes" },
      { title: "Students", icon: GraduationCap, path: "/students" },
      { title: "Attendance", icon: CheckSquare, path: "/attendance" },
      { title: "Exams & Grading", icon: ClipboardList, path: "/exams" },
      { title: "Fees & Billing", icon: IndianRupee, path: "/fees" },
      { title: "Payments", icon: CreditCard, path: "/payments" },
      { title: "Library", icon: BookOpen, path: "/library" },
      { title: "Documents", icon: FileText, path: "/documents" },
      { title: "Academics", icon: CalendarDays, path: "/academics" },
    ],
  },
  {
    label: "Campus",
    items: [
      { title: "Hostel & Transport", icon: Home, path: "/hostel" },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Alumni", icon: Users, path: "/alumni" },
      { title: "Reports", icon: BarChart3, path: "/reports" },
      { title: "Notifications", icon: Bell, path: "/notifications" },
      { title: "User Roles", icon: UserCog, path: "/roles" },
      { title: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display font-bold text-foreground text-[15px] leading-tight truncate">
              EduManage
            </h1>
            <p className="text-[11px] text-muted-foreground truncate">College CMS</p>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 text-muted-foreground text-sm cursor-pointer hover:bg-muted transition-colors">
            <Search className="w-4 h-4 shrink-0" />
            <span>Search…</span>
            <kbd className="ml-auto text-[10px] bg-background px-1.5 py-0.5 rounded border border-border font-mono">
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-3">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      } ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-sidebar-border shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
