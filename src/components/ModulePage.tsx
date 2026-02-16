import { AppLayout } from "@/components/AppLayout";
import { Construction } from "lucide-react";

interface ModulePageProps {
  title: string;
  description: string;
}

export function ModulePage({ title, description }: ModulePageProps) {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
          <Construction className="w-8 h-8 text-accent-foreground" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-md">{description}</p>
        <div className="mt-6 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          Coming Soon
        </div>
      </div>
    </AppLayout>
  );
}
