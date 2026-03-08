
-- Student location history
CREATE TABLE public.student_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  distance_from_campus DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('inside', 'outside', 'offline')),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Boundary alerts log
CREATE TABLE public.boundary_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('exit', 'entry')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  distance DOUBLE PRECISION NOT NULL,
  direction TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boundary_alerts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read and insert (admin dashboard)
CREATE POLICY "Authenticated users can read locations"
  ON public.student_locations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert locations"
  ON public.student_locations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can read alerts"
  ON public.boundary_alerts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert alerts"
  ON public.boundary_alerts FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_student_locations_student_id ON public.student_locations (student_id);
CREATE INDEX idx_student_locations_recorded_at ON public.student_locations (recorded_at DESC);
CREATE INDEX idx_boundary_alerts_student_id ON public.boundary_alerts (student_id);
CREATE INDEX idx_boundary_alerts_created_at ON public.boundary_alerts (created_at DESC);
