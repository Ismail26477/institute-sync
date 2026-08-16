-- Library staff helper
CREATE OR REPLACE FUNCTION public.is_library_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','librarian')
  )
$$;
REVOKE ALL ON FUNCTION public.is_library_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_library_staff(uuid) TO authenticated, service_role;

-- BOOKS
CREATE TABLE IF NOT EXISTS public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL DEFAULT '',
  isbn text,
  publisher text,
  edition text,
  category text NOT NULL DEFAULT 'General Reference',
  language text DEFAULT 'English',
  publication_year integer,
  description text,
  cover_image_url text,
  total_copies integer NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
  available_copies integer NOT NULL DEFAULT 1 CHECK (available_copies >= 0),
  issued_copies integer NOT NULL DEFAULT 0 CHECK (issued_copies >= 0),
  damaged_copies integer NOT NULL DEFAULT 0 CHECK (damaged_copies >= 0),
  lost_copies integer NOT NULL DEFAULT 0 CHECK (lost_copies >= 0),
  location text NOT NULL DEFAULT '',
  shelf_number text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS books_isbn_unique ON public.books (isbn) WHERE isbn IS NOT NULL AND isbn <> '';
CREATE INDEX IF NOT EXISTS books_title_idx ON public.books (lower(title));
CREATE INDEX IF NOT EXISTS books_category_idx ON public.books (category);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read books" ON public.books FOR SELECT TO authenticated USING (true);
CREATE POLICY "Library staff can insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (public.is_library_staff(auth.uid()));
CREATE POLICY "Library staff can update books" ON public.books FOR UPDATE TO authenticated USING (public.is_library_staff(auth.uid()));
CREATE POLICY "Library staff can delete books" ON public.books FOR DELETE TO authenticated USING (public.is_library_staff(auth.uid()));
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- BOOK ISSUES (circulation)
CREATE TABLE IF NOT EXISTS public.book_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  issued_by uuid,
  issued_by_name text NOT NULL DEFAULT '',
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  returned_date date,
  return_condition text,
  status text NOT NULL DEFAULT 'Issued',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS book_issues_book_idx ON public.book_issues (book_id);
CREATE INDEX IF NOT EXISTS book_issues_student_idx ON public.book_issues (student_id);
CREATE INDEX IF NOT EXISTS book_issues_status_idx ON public.book_issues (status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_issues TO authenticated;
GRANT ALL ON public.book_issues TO service_role;
ALTER TABLE public.book_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Library staff can read all issues" ON public.book_issues FOR SELECT TO authenticated
  USING (public.is_library_staff(auth.uid()) OR EXISTS (SELECT 1 FROM public.students s WHERE s.id = book_issues.student_id AND s.auth_user_id = auth.uid()));
CREATE POLICY "Library staff can insert issues" ON public.book_issues FOR INSERT TO authenticated WITH CHECK (public.is_library_staff(auth.uid()));
CREATE POLICY "Library staff can update issues" ON public.book_issues FOR UPDATE TO authenticated USING (public.is_library_staff(auth.uid()));
CREATE TRIGGER update_book_issues_updated_at BEFORE UPDATE ON public.book_issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AUDIT LOG
CREATE TABLE IF NOT EXISTS public.library_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text NOT NULL DEFAULT '',
  action text NOT NULL,
  record_type text NOT NULL DEFAULT '',
  record_id uuid,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.library_audit_log TO authenticated;
GRANT ALL ON public.library_audit_log TO service_role;
ALTER TABLE public.library_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Library staff can read audit log" ON public.library_audit_log FOR SELECT TO authenticated USING (public.is_library_staff(auth.uid()));
CREATE POLICY "Library staff can write audit log" ON public.library_audit_log FOR INSERT TO authenticated WITH CHECK (public.is_library_staff(auth.uid()));

-- INVENTORY ADJUSTMENTS
CREATE TABLE IF NOT EXISTS public.inventory_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  adjustment_type text NOT NULL,
  quantity integer NOT NULL,
  reason text,
  adjusted_by uuid,
  adjusted_by_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.inventory_adjustments TO authenticated;
GRANT ALL ON public.inventory_adjustments TO service_role;
ALTER TABLE public.inventory_adjustments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Library staff can read adjustments" ON public.inventory_adjustments FOR SELECT TO authenticated USING (public.is_library_staff(auth.uid()));
CREATE POLICY "Library staff can insert adjustments" ON public.inventory_adjustments FOR INSERT TO authenticated WITH CHECK (public.is_library_staff(auth.uid()));

-- ISSUE BOOK (atomic)
CREATE OR REPLACE FUNCTION public.issue_book(p_book_id uuid, p_student_id uuid, p_due_date date, p_notes text DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_avail integer;
  v_issue_id uuid;
  v_name text;
BEGIN
  IF NOT public.is_library_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized to issue books';
  END IF;
  SELECT available_copies INTO v_avail FROM public.books WHERE id = p_book_id FOR UPDATE;
  IF v_avail IS NULL THEN RAISE EXCEPTION 'Book not found'; END IF;
  IF v_avail <= 0 THEN RAISE EXCEPTION 'No copies available'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.students WHERE id = p_student_id) THEN
    RAISE EXCEPTION 'Student not found';
  END IF;
  SELECT COALESCE(display_name, '') INTO v_name FROM public.profiles WHERE user_id = auth.uid();

  UPDATE public.books SET available_copies = available_copies - 1, issued_copies = issued_copies + 1 WHERE id = p_book_id;
  INSERT INTO public.book_issues (book_id, student_id, issued_by, issued_by_name, due_date, notes, status)
  VALUES (p_book_id, p_student_id, auth.uid(), COALESCE(v_name,''), p_due_date, p_notes, 'Issued')
  RETURNING id INTO v_issue_id;

  INSERT INTO public.library_audit_log (user_id, user_name, action, record_type, record_id, details)
  VALUES (auth.uid(), COALESCE(v_name,''), 'Book Issued', 'book_issue', v_issue_id, 'Book issued to student');
  RETURN v_issue_id;
END;
$$;
REVOKE ALL ON FUNCTION public.issue_book(uuid, uuid, date, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.issue_book(uuid, uuid, date, text) TO authenticated;

-- RETURN BOOK (atomic)
CREATE OR REPLACE FUNCTION public.return_book(p_issue_id uuid, p_condition text DEFAULT 'Good', p_notes text DEFAULT NULL, p_return_date date DEFAULT CURRENT_DATE)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_book_id uuid;
  v_status text;
  v_name text;
BEGIN
  IF NOT public.is_library_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized to return books';
  END IF;
  SELECT book_id, status INTO v_book_id, v_status FROM public.book_issues WHERE id = p_issue_id FOR UPDATE;
  IF v_book_id IS NULL THEN RAISE EXCEPTION 'Issue record not found'; END IF;
  IF v_status = 'Returned' THEN RAISE EXCEPTION 'Book already returned'; END IF;
  SELECT COALESCE(display_name, '') INTO v_name FROM public.profiles WHERE user_id = auth.uid();

  PERFORM 1 FROM public.books WHERE id = v_book_id FOR UPDATE;

  IF p_condition = 'Lost' THEN
    UPDATE public.books SET issued_copies = GREATEST(issued_copies - 1, 0),
      total_copies = GREATEST(total_copies - 1, 0), lost_copies = lost_copies + 1 WHERE id = v_book_id;
    UPDATE public.book_issues SET status = 'Lost', returned_date = p_return_date, return_condition = p_condition,
      notes = COALESCE(p_notes, notes) WHERE id = p_issue_id;
  ELSIF p_condition = 'Damaged' THEN
    UPDATE public.books SET issued_copies = GREATEST(issued_copies - 1, 0),
      available_copies = available_copies + 1, damaged_copies = damaged_copies + 1 WHERE id = v_book_id;
    UPDATE public.book_issues SET status = 'Returned', returned_date = p_return_date, return_condition = p_condition,
      notes = COALESCE(p_notes, notes) WHERE id = p_issue_id;
  ELSE
    UPDATE public.books SET issued_copies = GREATEST(issued_copies - 1, 0),
      available_copies = available_copies + 1 WHERE id = v_book_id;
    UPDATE public.book_issues SET status = 'Returned', returned_date = p_return_date, return_condition = COALESCE(p_condition,'Good'),
      notes = COALESCE(p_notes, notes) WHERE id = p_issue_id;
  END IF;

  INSERT INTO public.library_audit_log (user_id, user_name, action, record_type, record_id, details)
  VALUES (auth.uid(), COALESCE(v_name,''), 'Book Returned', 'book_issue', p_issue_id, 'Condition: ' || COALESCE(p_condition,'Good'));
END;
$$;
REVOKE ALL ON FUNCTION public.return_book(uuid, text, text, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.return_book(uuid, text, text, date) TO authenticated;

-- ADJUST INVENTORY
CREATE OR REPLACE FUNCTION public.adjust_inventory(p_book_id uuid, p_type text, p_quantity integer, p_reason text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_name text;
BEGIN
  IF NOT public.is_library_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized to adjust inventory';
  END IF;
  IF p_quantity <= 0 THEN RAISE EXCEPTION 'Quantity must be positive'; END IF;
  SELECT COALESCE(display_name,'') INTO v_name FROM public.profiles WHERE user_id = auth.uid();
  PERFORM 1 FROM public.books WHERE id = p_book_id FOR UPDATE;

  IF p_type = 'add_copies' THEN
    UPDATE public.books SET total_copies = total_copies + p_quantity, available_copies = available_copies + p_quantity WHERE id = p_book_id;
  ELSIF p_type = 'remove_copies' THEN
    UPDATE public.books SET total_copies = GREATEST(total_copies - p_quantity, issued_copies),
      available_copies = GREATEST(available_copies - p_quantity, 0) WHERE id = p_book_id;
  ELSIF p_type = 'mark_damaged' THEN
    UPDATE public.books SET damaged_copies = damaged_copies + p_quantity,
      available_copies = GREATEST(available_copies - p_quantity, 0) WHERE id = p_book_id;
  ELSIF p_type = 'mark_lost' THEN
    UPDATE public.books SET lost_copies = lost_copies + p_quantity,
      available_copies = GREATEST(available_copies - p_quantity, 0),
      total_copies = GREATEST(total_copies - p_quantity, 0) WHERE id = p_book_id;
  ELSE
    RAISE EXCEPTION 'Unknown adjustment type';
  END IF;

  INSERT INTO public.inventory_adjustments (book_id, adjustment_type, quantity, reason, adjusted_by, adjusted_by_name)
  VALUES (p_book_id, p_type, p_quantity, p_reason, auth.uid(), COALESCE(v_name,''));
  INSERT INTO public.library_audit_log (user_id, user_name, action, record_type, record_id, details)
  VALUES (auth.uid(), COALESCE(v_name,''), 'Inventory Adjusted', 'book', p_book_id, p_type || ' x' || p_quantity);
END;
$$;
REVOKE ALL ON FUNCTION public.adjust_inventory(uuid, text, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.adjust_inventory(uuid, text, integer, text) TO authenticated;

-- Demo librarian auto-role assignment
CREATE OR REPLACE FUNCTION public.auto_assign_demo_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email = 'admin@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  ELSIF NEW.email = 'librarian@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'librarian') ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;