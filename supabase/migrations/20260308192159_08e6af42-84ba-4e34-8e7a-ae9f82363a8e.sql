
-- Faculty location tracking (same pattern as student_locations)
CREATE TABLE public.faculty_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id TEXT NOT NULL,
  faculty_name TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  distance_from_campus DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('inside', 'outside', 'offline')),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Faculty daily attendance (auto-marked via geofence)
CREATE TABLE public.faculty_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id TEXT NOT NULL,
  faculty_name TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  punch_in TIMESTAMP WITH TIME ZONE,
  punch_out TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave', 'half_day')) DEFAULT 'absent',
  auto_detected BOOLEAN NOT NULL DEFAULT true,
  total_hours DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(faculty_id, date)
);

-- Leave requests
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id TEXT NOT NULL,
  faculty_name TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT '',
  leave_type TEXT NOT NULL CHECK (leave_type IN ('sick', 'casual', 'earned', 'maternity', 'other')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faculty_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Authenticated can read faculty_locations"
  ON public.faculty_locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert faculty_locations"
  ON public.faculty_locations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can read faculty_attendance"
  ON public.faculty_attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert faculty_attendance"
  ON public.faculty_attendance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update faculty_attendance"
  ON public.faculty_attendance FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can read leave_requests"
  ON public.leave_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert leave_requests"
  ON public.leave_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update leave_requests"
  ON public.leave_requests FOR UPDATE TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_faculty_locations_faculty_id ON public.faculty_locations (faculty_id);
CREATE INDEX idx_faculty_locations_recorded_at ON public.faculty_locations (recorded_at DESC);
CREATE INDEX idx_faculty_attendance_faculty_id ON public.faculty_attendance (faculty_id);
CREATE INDEX idx_faculty_attendance_date ON public.faculty_attendance (date DESC);
CREATE INDEX idx_leave_requests_faculty_id ON public.leave_requests (faculty_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests (status);

-- Trigger for leave_requests updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
