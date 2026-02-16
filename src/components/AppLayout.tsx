import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell, User } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
          <div>
            <h2 className="font-display font-semibold text-foreground text-lg" id="page-title" />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="w-px h-6 bg-border" />
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-[11px] text-muted-foreground">Group Admin</p>
              </div>
            </button>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
