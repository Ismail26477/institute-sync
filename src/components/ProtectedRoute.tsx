import { Navigate } from "react-router-dom";
import { useAuth, type AppRole } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
}

export function ProtectedRoute({ children, allowedRoles = ["admin", "hod"] }: Props) {
  const { user, loading, roles, isLibrarian, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-display font-bold text-foreground mb-2">Access Pending</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Your account has been created but you don't have a role assigned yet. Please contact an administrator to get access.
          </p>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const allowed = roles.some((r) => allowedRoles.includes(r));

  if (!allowed) {
    // Librarians only have library access — send them to their dashboard.
    if (isLibrarian) return <Navigate to="/library" replace />;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-display font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
