import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InstitutesPage from "./pages/Institutes";
import StudentsPage from "./pages/Students";
import FeesPage from "./pages/Fees";
import LibraryPage from "./pages/Library";
import DocumentsPage from "./pages/Documents";
import AcademicsPage from "./pages/Academics";
import AlumniPage from "./pages/Alumni";
import ReportsPage from "./pages/Reports";
import NotificationsPage from "./pages/Notifications";
import RolesPage from "./pages/Roles";
import SettingsPage from "./pages/Settings";
import ExamsPage from "./pages/Exams";
import AttendancePage from "./pages/Attendance";
import PaymentsPage from "./pages/Payments";
import HostelPage from "./pages/Hostel";
import AnalyticsPage from "./pages/Analytics";
import TimetablePage from "./pages/Timetable";
import ScholarshipsPage from "./pages/Scholarships";
import IDCardsPage from "./pages/IDCards";
import FacultyPage from "./pages/Faculty";
import EventsPage from "./pages/Events";
import LabBookingPage from "./pages/LabBooking";
import CertificatesPage from "./pages/Certificates";
import AssignmentsPage from "./pages/Assignments";

const queryClient = new QueryClient();

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <AppLayout>{children}</AppLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Wrap><Index /></Wrap>} />
          <Route path="/institutes" element={<Wrap><InstitutesPage /></Wrap>} />
          <Route path="/students" element={<Wrap><StudentsPage /></Wrap>} />
          <Route path="/attendance" element={<Wrap><AttendancePage /></Wrap>} />
          <Route path="/exams" element={<Wrap><ExamsPage /></Wrap>} />
          <Route path="/fees" element={<Wrap><FeesPage /></Wrap>} />
          <Route path="/payments" element={<Wrap><PaymentsPage /></Wrap>} />
          <Route path="/library" element={<Wrap><LibraryPage /></Wrap>} />
          <Route path="/documents" element={<Wrap><DocumentsPage /></Wrap>} />
          <Route path="/academics" element={<Wrap><AcademicsPage /></Wrap>} />
          <Route path="/hostel" element={<Wrap><HostelPage /></Wrap>} />
          <Route path="/alumni" element={<Wrap><AlumniPage /></Wrap>} />
          <Route path="/reports" element={<Wrap><ReportsPage /></Wrap>} />
          <Route path="/notifications" element={<Wrap><NotificationsPage /></Wrap>} />
          <Route path="/roles" element={<Wrap><RolesPage /></Wrap>} />
          <Route path="/settings" element={<Wrap><SettingsPage /></Wrap>} />
          <Route path="/analytics" element={<Wrap><AnalyticsPage /></Wrap>} />
          <Route path="/timetable" element={<Wrap><TimetablePage /></Wrap>} />
          <Route path="/scholarships" element={<Wrap><ScholarshipsPage /></Wrap>} />
          <Route path="/id-cards" element={<Wrap><IDCardsPage /></Wrap>} />
          <Route path="/faculty" element={<Wrap><FacultyPage /></Wrap>} />
          <Route path="/events" element={<Wrap><EventsPage /></Wrap>} />
          <Route path="/lab-booking" element={<Wrap><LabBookingPage /></Wrap>} />
          <Route path="/certificates" element={<Wrap><CertificatesPage /></Wrap>} />
          <Route path="/assignments" element={<Wrap><AssignmentsPage /></Wrap>} />
          <Route path="/gps-tracking" element={<Wrap><GPSTrackingPage /></Wrap>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
