import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const DEMO_LIBRARIAN = { email: "librarian@gmail.com", password: "123456", name: "Demo Librarian" };

const BOOKS = [
  { title: "Textbook of Medical-Surgical Nursing", author: "Brunner & Suddarth", isbn: "978-1496355157", category: "Nursing", total_copies: 12, location: "Shelf A-12", publisher: "Wolters Kluwer", publication_year: 2020 },
  { title: "Anatomy & Physiology", author: "Tortora & Derrickson", isbn: "978-1119585299", category: "Basic Sciences", total_copies: 15, location: "Shelf B-03", publisher: "Wiley", publication_year: 2019 },
  { title: "Fundamentals of Nursing", author: "Kozier & Erb", isbn: "978-0134879079", category: "Nursing", total_copies: 20, location: "Shelf A-01", publisher: "Pearson", publication_year: 2020 },
  { title: "Pharmacology for Nurses", author: "Adams & Urban", isbn: "978-0135218334", category: "Pharmacology", total_copies: 10, location: "Shelf C-07", publisher: "Pearson", publication_year: 2018 },
  { title: "Community Health Nursing", author: "Stanhope & Lancaster", isbn: "978-0323554718", category: "Nursing", total_copies: 8, location: "Shelf A-15", publisher: "Elsevier", publication_year: 2019 },
  { title: "Physiotherapy in Orthopaedics", author: "Atkinson, Coutts & Hassenkamp", isbn: "978-0702031748", category: "Physiotherapy", total_copies: 6, location: "Shelf D-02", publisher: "Churchill Livingstone", publication_year: 2017 },
  { title: "Clinical Nursing Procedures", author: "Annamma Jacob", isbn: "978-8131234587", category: "Nursing", total_copies: 18, location: "Shelf A-05", publisher: "Jaypee", publication_year: 2019 },
  { title: "Essentials of Pediatric Nursing", author: "Palani Velu", isbn: "978-8131235690", category: "Nursing", total_copies: 9, location: "Shelf A-20", publisher: "Jaypee", publication_year: 2018 },
];

const STUDENTS = [
  { student_id: "STU001", name: "Priya Sharma", email: "priya.sharma@edumanage.in", institute: "B.Sc Nursing", course: "B.Sc Nursing", batch: "2023-27" },
  { student_id: "STU002", name: "Rahul Verma", email: "rahul.verma@edumanage.in", institute: "B.Sc Nursing", course: "B.Sc Nursing", batch: "2023-27" },
  { student_id: "STU003", name: "Ananya Patel", email: "ananya.patel@edumanage.in", institute: "GNM", course: "GNM", batch: "2024-27" },
  { student_id: "STU005", name: "Meera Joshi", email: "meera.joshi@edumanage.in", institute: "Physiotherapy", course: "BPT", batch: "2022-26" },
  { student_id: "STU009", name: "Sneha Iyer", email: "sneha.iyer@edumanage.in", institute: "B.Sc Nursing", course: "B.Sc Nursing", batch: "2023-27" },
];

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Demo librarian account
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    let librarian = list?.users?.find((u) => u.email === DEMO_LIBRARIAN.email);
    if (!librarian) {
      const { data, error } = await admin.auth.admin.createUser({
        email: DEMO_LIBRARIAN.email,
        password: DEMO_LIBRARIAN.password,
        email_confirm: true,
        user_metadata: { display_name: DEMO_LIBRARIAN.name },
      });
      if (error) return json({ error: error.message }, 400);
      librarian = data.user;
    }
    if (librarian) {
      await admin.from("user_roles").upsert(
        { user_id: librarian.id, role: "librarian" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );
    }

    // 2. Books
    for (const b of BOOKS) {
      const { data: existing } = await admin.from("books").select("id").eq("isbn", b.isbn).maybeSingle();
      if (!existing) {
        await admin.from("books").insert({
          ...b,
          available_copies: b.total_copies,
          issued_copies: 0,
          language: "English",
          created_by: librarian?.id ?? null,
        });
      }
    }

    // 3. Students
    for (const s of STUDENTS) {
      const { data: existing } = await admin.from("students").select("id").eq("student_id", s.student_id).maybeSingle();
      if (!existing) await admin.from("students").insert(s);
    }

    // 4. Circulation records (only if none exist)
    const { count } = await admin.from("book_issues").select("*", { count: "exact", head: true });
    if (!count) {
      const { data: books } = await admin.from("books").select("id, title, available_copies, issued_copies");
      const { data: students } = await admin.from("students").select("id, student_id");
      const byTitle = (t: string) => books?.find((b) => b.title === t);
      const byStu = (s: string) => students?.find((x) => x.student_id === s);

      const seed = [
        { title: "Textbook of Medical-Surgical Nursing", stu: "STU001", issue: daysFromNow(-6), due: daysFromNow(8) },
        { title: "Anatomy & Physiology", stu: "STU002", issue: daysFromNow(-9), due: daysFromNow(5) },
        { title: "Fundamentals of Nursing", stu: "STU003", issue: daysFromNow(-28), due: daysFromNow(-14) },
        { title: "Pharmacology for Nurses", stu: "STU005", issue: daysFromNow(-3), due: daysFromNow(11) },
        { title: "Community Health Nursing", stu: "STU009", issue: daysFromNow(-35), due: daysFromNow(-21) },
      ];

      for (const row of seed) {
        const book = byTitle(row.title);
        const stu = byStu(row.stu);
        if (!book || !stu) continue;
        await admin.from("book_issues").insert({
          book_id: book.id,
          student_id: stu.id,
          issued_by: librarian?.id ?? null,
          issued_by_name: DEMO_LIBRARIAN.name,
          issue_date: row.issue,
          due_date: row.due,
          status: "Issued",
        });
        await admin.from("books").update({
          available_copies: book.available_copies - 1,
          issued_copies: book.issued_copies + 1,
        }).eq("id", book.id);
      }
    }

    return json({ ok: true, librarian: DEMO_LIBRARIAN.email });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
