import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
}

export default function FormModal({ open, onClose, title, children, onSubmit, submitLabel = "Save" }: FormModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="bg-card rounded-2xl border border-border/50 shadow-elevated w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-display font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-4">{children}</div>
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

export const inputClass = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none";
export const selectClass = "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none";
