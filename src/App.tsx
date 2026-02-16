import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ModulePage } from "@/components/ModulePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/institutes" element={<ModulePage title="Institutes" description="Manage all 7 institutes, programs, batches, and academic configurations." />} />
          <Route path="/students" element={<ModulePage title="Student Lifecycle" description="Admissions, profiles, attendance, grades, transfers, and alumni conversion." />} />
          <Route path="/fees" element={<ModulePage title="Fees & Billing" description="Fee templates, scholarships, invoicing, collections, refunds, and GST compliance." />} />
          <Route path="/library" element={<ModulePage title="Library Management" description="Catalog, circulation, OPAC search, inventory, barcode/RFID integration." />} />
          <Route path="/documents" element={<ModulePage title="Document Management" description="Secure repository with versioning, expiry reminders, e-sign workflows." />} />
          <Route path="/academics" element={<ModulePage title="Academics" description="Programs, timetables, enrollments, attendance tracking, and grade management." />} />
          <Route path="/alumni" element={<ModulePage title="Alumni Portal" description="Directory, transcripts, experience letters, events, and donations." />} />
          <Route path="/reports" element={<ModulePage title="Reports & Analytics" description="Scheduled reports, pivot builder, revenue summaries, and compliance exports." />} />
          <Route path="/notifications" element={<ModulePage title="Notifications" description="Push, Email, SMS/WhatsApp channels with automated triggers and templates." />} />
          <Route path="/roles" element={<ModulePage title="User Roles" description="Role-based access control for Group Admin, Institute Admin, Faculty, and more." />} />
          <Route path="/settings" element={<ModulePage title="Settings" description="System configuration, payment gateways, integrations, and audit logs." />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
