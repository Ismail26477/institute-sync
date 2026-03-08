
-- Allow anon access temporarily (until auth is added)
CREATE POLICY "Anon can read student_locations" ON public.student_locations FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert student_locations" ON public.student_locations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can read boundary_alerts" ON public.boundary_alerts FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert boundary_alerts" ON public.boundary_alerts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can read faculty_locations" ON public.faculty_locations FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert faculty_locations" ON public.faculty_locations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can read faculty_attendance" ON public.faculty_attendance FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert faculty_attendance" ON public.faculty_attendance FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update faculty_attendance" ON public.faculty_attendance FOR UPDATE TO anon USING (true);
CREATE POLICY "Anon can read leave_requests" ON public.leave_requests FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can insert leave_requests" ON public.leave_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update leave_requests" ON public.leave_requests FOR UPDATE TO anon USING (true);
