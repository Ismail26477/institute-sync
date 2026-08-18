import { ReactNode, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell, User, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { displayName, roles, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleLabel = roles.includes("admin") ? "Admin" : roles.includes("hod") ? "HOD" : roles.includes("librarian") ? "Librarian" : "User";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-display font-semibold text-foreground text-lg truncate" id="page-title" />
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <div className="flex items-center gap-2 px-1 sm:px-3 py-1.5 rounded-lg">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground">{displayName || "User"}</p>
                <p className="text-[11px] text-muted-foreground">{roleLabel}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
