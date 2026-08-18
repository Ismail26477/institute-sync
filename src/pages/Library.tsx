import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Plus, BookOpen, RotateCcw, AlertTriangle, Users, ArrowRightLeft, Camera,
  Upload, Sparkles, Loader2, Eye, Pencil, Trash2, CheckCircle2, PackagePlus, Download,
} from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  BOOK_CATEGORIES, Book, BookIssue, addDays, bookStatus, daysBetween, fileToDataUrl,
  isOverdue, logAudit, signCovers, toCsv, todayISO, uploadCover, validateImage,
} from "@/lib/library";

interface Student {
  id: string; student_id: string; name: string; email: string;
  course: string; institute: string; batch: string;
}

const TABS = ["Catalog", "Circulation", "Returns", "Overdue", "Inventory", "Reports"];

const emptyBookForm = {
  title: "", author: "", isbn: "", publisher: "", edition: "", category: "Nursing",
  language: "English", publication_year: "", description: "", copies: "1", location: "", shelf_number: "",
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-12 text-center text-sm text-muted-foreground">{message}</div>
);

const Th = ({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "center" | "right" }) => (
  <th className={`text-${align} py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider whitespace-nowrap`}>{children}</th>
);

const StatusPill = ({ status }: { status: string }) => {
  const tone =
    status === "Available" || status === "Returned" ? "bg-success/10 text-success"
      : status === "Partially Available" || status === "Issued" ? "bg-info/10 text-info"
      : status === "Overdue" || status === "Lost" ? "bg-destructive/10 text-destructive"
      : "bg-warning/10 text-warning";
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tone}`}>{status}</span>;
};

export default function LibraryPage() {
  const { isLibraryStaff, displayName } = useAuth();
  const [activeTab, setActiveTab] = useState("Catalog");
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [circFilter, setCircFilter] = useState("All");
  const [circSearch, setCircSearch] = useState("");

  // modals
  const [bookModal, setBookModal] = useState<{ open: boolean; editing: Book | null }>({ open: false, editing: null });
  const [bookForm, setBookForm] = useState(emptyBookForm);
  const [aiFields, setAiFields] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const [detailBook, setDetailBook] = useState<Book | null>(null);

  const [issueModal, setIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState({ bookId: "", studentId: "", issueDate: todayISO(), dueDate: addDays(14), notes: "" });
  const [studentQuery, setStudentQuery] = useState("");
  const [bookQuery, setBookQuery] = useState("");
  const [scanMatches, setScanMatches] = useState<Book[] | null>(null);
  const [issueConfirm, setIssueConfirm] = useState(false);

  const [returnTarget, setReturnTarget] = useState<BookIssue | null>(null);
  const [returnForm, setReturnForm] = useState({ date: todayISO(), condition: "Good", notes: "" });
  const [returnSearch, setReturnSearch] = useState("");

  const [adjustTarget, setAdjustTarget] = useState<Book | null>(null);
  const [adjustForm, setAdjustForm] = useState({ type: "add_copies", quantity: "1", reason: "" });

  const coverInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const scanInput = useRef<HTMLInputElement>(null);
  const scanCameraInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [b, i, s] = await Promise.all([
      supabase.from("books").select("*").order("title"),
      supabase.from("book_issues")
        .select("*, books(id,title,author,isbn,cover_image_url,location), students(id,student_id,name,course,institute,batch)")
        .order("issue_date", { ascending: false }),
      supabase.from("students").select("id,student_id,name,email,course,institute,batch").order("name"),
    ]);
    if (b.error) toast.error(`Could not load books: ${b.error.message}`);
    if (i.error) toast.error(`Could not load circulation: ${i.error.message}`);
    const bookRows = (b.data ?? []) as Book[];
    setBooks(bookRows);
    setIssues((i.data ?? []) as unknown as BookIssue[]);
    setStudents((s.data ?? []) as Student[]);
    setCovers(await signCovers(bookRows.map((x) => x.cover_image_url)));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const activeIssues = useMemo(() => issues.filter((i) => !i.returned_date), [issues]);
  const overdueIssues = useMemo(() => activeIssues.filter(isOverdue), [activeIssues]);
  const totalCopies = books.reduce((a, b) => a + b.total_copies, 0);
  const availableCopies = books.reduce((a, b) => a + b.available_copies, 0);
  const returnedCount = issues.filter((i) => i.status === "Returned").length;
  const returnRate = issues.length ? Math.round((returnedCount / issues.length) * 1000) / 10 : 0;
  const dueToday = activeIssues.filter((i) => i.due_date === todayISO()).length;
  const returnedToday = issues.filter((i) => i.returned_date === todayISO()).length;
  const studentsWithBooks = new Set(activeIssues.map((i) => i.student_id)).size;

  const filteredCatalog = books.filter((b) => {
    const q = search.toLowerCase();
    return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn ?? "").toLowerCase().includes(q);
  });

  const coverUrl = (b?: { cover_image_url?: string | null } | null) =>
    b?.cover_image_url ? covers[b.cover_image_url] : undefined;

  /* ---------------- Add / Edit book ---------------- */
  const openAddBook = () => {
    setBookForm(emptyBookForm); setAiFields([]); setCoverFile(null); setCoverPreview("");
    setManualMode(false); setBookModal({ open: true, editing: null });
  };

  const openEditBook = (b: Book) => {
    setBookForm({
      title: b.title, author: b.author, isbn: b.isbn ?? "", publisher: b.publisher ?? "", edition: b.edition ?? "",
      category: b.category, language: b.language ?? "English", publication_year: b.publication_year ? String(b.publication_year) : "",
      description: b.description ?? "", copies: String(b.total_copies), location: b.location, shelf_number: b.shelf_number ?? "",
    });
    setAiFields([]); setCoverFile(null); setCoverPreview(coverUrl(b) ?? "");
    setManualMode(true); setDetailBook(null); setBookModal({ open: true, editing: b });
  };

  const handleCoverPick = async (file?: File | null) => {
    if (!file) return;
    const err = validateImage(file);
    if (err) return toast.error(err);
    setCoverFile(file);
    setCoverPreview(await fileToDataUrl(file));
  };

  const analyzePhoto = async () => {
    if (!coverPreview.startsWith("data:image/")) return toast.error("Please upload or take a photo first");
    setAnalyzing(true);
    const { data, error } = await supabase.functions.invoke("extract-book-details", {
      body: { imageDataUrl: coverPreview },
    });
    setAnalyzing(false);
    if (error) return toast.error(`AI extraction failed: ${error.message}`);
    if ((data as { error?: string })?.error) return toast.error((data as { error: string }).error);
    const r = (data as { result: Record<string, string> }).result ?? {};
    const filled: string[] = [];
    setBookForm((prev) => {
      const next = { ...prev };
      (["title", "author", "isbn", "publisher", "edition", "description"] as const).forEach((k) => {
        if (r[k]) { next[k] = r[k]; filled.push(k); }
      });
      if (r.category && BOOK_CATEGORIES.includes(r.category)) { next.category = r.category; filled.push("category"); }
      if (r.language) { next.language = r.language; filled.push("language"); }
      if (r.publication_year && /^\d{4}$/.test(r.publication_year)) { next.publication_year = r.publication_year; filled.push("publication_year"); }
      return next;
    });
    setAiFields(filled);
    setManualMode(true);
    toast.success(filled.length ? "Book details extracted. Please verify before saving." : "No details could be read from the photo — please enter them manually.");
  };

  const saveBook = async () => {
    if (!bookForm.title.trim() || !bookForm.author.trim()) return toast.error("Title and Author are required");
    const copies = Number(bookForm.copies);
    if (!Number.isFinite(copies) || copies < 1) return toast.error("Copies must be at least 1");
    if (!bookForm.location.trim()) return toast.error("Location is required");
    setSaving(true);
    try {
      const isbn = bookForm.isbn.trim();
      if (isbn && !bookModal.editing) {
        const dup = books.find((b) => (b.isbn ?? "").trim() === isbn);
        if (dup) {
          setSaving(false);
          const addCopies = window.confirm(
            `A book with ISBN ${isbn} already exists ("${dup.title}").\n\nClick OK to add ${copies} more copies to the existing book, or Cancel to change the ISBN.`,
          );
          if (!addCopies) return;
          const { error } = await supabase.rpc("adjust_inventory", {
            p_book_id: dup.id, p_type: "add_copies", p_quantity: copies, p_reason: "Duplicate ISBN — copies added",
          });
          if (error) return toast.error(error.message);
          toast.success(`${copies} copies added to "${dup.title}"`);
          setBookModal({ open: false, editing: null });
          return load();
        }
      }

      let coverPath = bookModal.editing?.cover_image_url ?? null;
      if (coverFile) {
        coverPath = await uploadCover(coverFile, "covers");
        await logAudit("Book Photo Uploaded", "book", bookModal.editing?.id ?? null, coverPath);
      }

      const payload = {
        title: bookForm.title.trim(), author: bookForm.author.trim(), isbn: isbn || null,
        publisher: bookForm.publisher.trim() || null, edition: bookForm.edition.trim() || null,
        category: bookForm.category, language: bookForm.language.trim() || null,
        publication_year: bookForm.publication_year ? Number(bookForm.publication_year) : null,
        description: bookForm.description.trim() || null, cover_image_url: coverPath,
        location: bookForm.location.trim(), shelf_number: bookForm.shelf_number.trim() || null,
      };

      if (bookModal.editing) {
        const b = bookModal.editing;
        const delta = copies - b.total_copies;
        const { error } = await supabase.from("books").update({
          ...payload,
          total_copies: copies,
          available_copies: Math.max(b.available_copies + delta, 0),
        }).eq("id", b.id);
        if (error) throw new Error(error.message);
        await logAudit("Book Edited", "book", b.id, b.title);
        toast.success("Book updated");
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const { data, error } = await supabase.from("books").insert({
          ...payload, total_copies: copies, available_copies: copies, issued_copies: 0,
          created_by: userData.user?.id ?? null,
        }).select().single();
        if (error) throw new Error(error.message);
        await logAudit("Book Added", "book", data.id, payload.title);
        toast.success(`"${payload.title}" added to catalog`);
      }
      setBookModal({ open: false, editing: null });
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const deleteBook = async (b: Book) => {
    if (!window.confirm(`Delete "${b.title}"? All its circulation records will also be removed.`)) return;
    if (b.cover_image_url) await supabase.storage.from("library-books").remove([b.cover_image_url]);
    const { error } = await supabase.from("books").delete().eq("id", b.id);
    if (error) return toast.error(error.message);
    await logAudit("Book Deleted", "book", b.id, b.title);
    toast.success("Book deleted");
    setDetailBook(null);
    load();
  };

  /* ---------------- Issue ---------------- */
  const openIssue = (book?: Book) => {
    setIssueForm({ bookId: book?.id ?? "", studentId: "", issueDate: todayISO(), dueDate: addDays(14), notes: "" });
    setStudentQuery(""); setBookQuery(""); setScanMatches(null); setIssueConfirm(false);
    setDetailBook(null); setIssueModal(true);
  };

  const scanForIssue = async (file?: File | null) => {
    if (!file) return;
    const err = validateImage(file);
    if (err) return toast.error(err);
    setAnalyzing(true);
    const dataUrl = await fileToDataUrl(file);
    const { data, error } = await supabase.functions.invoke("extract-book-details", { body: { imageDataUrl: dataUrl } });
    setAnalyzing(false);
    if (error) return toast.error(`Scan failed: ${error.message}`);
    if ((data as { error?: string })?.error) return toast.error((data as { error: string }).error);
    const r = (data as { result: Record<string, string> }).result ?? {};
    const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
    const matches = books.filter((b) => {
      if (r.isbn && b.isbn && norm(b.isbn) === norm(r.isbn)) return true;
      if (r.title && norm(b.title).includes(norm(r.title).slice(0, 12)) && norm(r.title).length > 5) return true;
      if (r.title && norm(r.title).includes(norm(b.title).slice(0, 12)) && norm(b.title).length > 5) return true;
      return false;
    });
    if (matches.length === 1) {
      setIssueForm((f) => ({ ...f, bookId: matches[0].id }));
      setScanMatches(null);
      toast.success(`Matched "${matches[0].title}"`);
    } else if (matches.length > 1) {
      setScanMatches(matches);
      toast.info("Multiple books matched — pick the right one");
    } else {
      setScanMatches([]);
      toast.error("No matching book found. Please search manually.");
    }
  };

  const selectedBook = books.find((b) => b.id === issueForm.bookId) ?? null;
  const selectedStudent = students.find((s) => s.id === issueForm.studentId) ?? null;

  const submitIssue = async () => {
    if (!selectedBook) return toast.error("Please select a book");
    if (!selectedStudent) return toast.error("Please select a student");
    if (selectedBook.available_copies <= 0) return toast.error("No copies available");
    if (!issueForm.dueDate || issueForm.dueDate < issueForm.issueDate) return toast.error("Due date must be after the issue date");
    if (!issueConfirm) return setIssueConfirm(true);
    setSaving(true);
    const { error } = await supabase.rpc("issue_book", {
      p_book_id: selectedBook.id, p_student_id: selectedStudent.id,
      p_due_date: issueForm.dueDate, p_notes: issueForm.notes || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(`"${selectedBook.title}" issued to ${selectedStudent.name}`);
    setIssueModal(false);
    load();
  };

  /* ---------------- Return ---------------- */
  const openReturn = (issue: BookIssue) => {
    setReturnForm({ date: todayISO(), condition: "Good", notes: "" });
    setReturnTarget(issue);
  };

  const submitReturn = async () => {
    if (!returnTarget) return;
    setSaving(true);
    const { error } = await supabase.rpc("return_book", {
      p_issue_id: returnTarget.id, p_condition: returnForm.condition,
      p_notes: returnForm.notes || null, p_return_date: returnForm.date,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Book returned successfully.");
    setReturnTarget(null);
    load();
  };

  /* ---------------- Inventory ---------------- */
  const submitAdjust = async () => {
    if (!adjustTarget) return;
    const qty = Number(adjustForm.quantity);
    if (!Number.isFinite(qty) || qty < 1) return toast.error("Quantity must be at least 1");
    setSaving(true);
    const { error } = await supabase.rpc("adjust_inventory", {
      p_book_id: adjustTarget.id, p_type: adjustForm.type, p_quantity: qty, p_reason: adjustForm.reason || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Inventory updated");
    setAdjustTarget(null);
    load();
  };

  const aiTag = (field: string) =>
    aiFields.includes(field) ? <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-info/10 text-info">AI extracted – please verify</span> : null;

  const circulationRows = issues.filter((i) => {
    const status = isOverdue(i) ? "Overdue" : i.status;
    if (circFilter !== "All" && status !== circFilter) return false;
    const q = circSearch.toLowerCase();
    if (!q) return true;
    return [i.books?.title, i.books?.isbn, i.students?.name, i.students?.student_id]
      .some((v) => (v ?? "").toLowerCase().includes(q));
  });

  const returnRows = activeIssues.filter((i) => {
    const q = returnSearch.toLowerCase();
    if (!q) return true;
    return [i.books?.title, i.books?.isbn, i.students?.name, i.students?.student_id, i.id]
      .some((v) => (v ?? "").toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Library Management</h1>
          <p className="text-sm text-muted-foreground">Catalog, circulation, and inventory management</p>
        </div>
        {isLibraryStaff && (
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <button onClick={() => setActiveTab("Returns")} className="justify-center sm:justify-start inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"><RotateCcw className="w-4 h-4" /> Return Book</button>
            <button onClick={() => openIssue()} className="justify-center sm:justify-start inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"><ArrowRightLeft className="w-4 h-4" /> Issue Book</button>
            <button onClick={openAddBook} className="col-span-2 sm:col-span-1 justify-center sm:justify-start inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Add Book</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="kpi-card flex items-center gap-3"><BookOpen className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{totalCopies}</p><p className="text-sm text-muted-foreground">Total Books</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{activeIssues.length}</p><p className="text-sm text-muted-foreground">Books Issued</p></div></div>
        <div className="kpi-card flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{overdueIssues.length}</p><p className="text-sm text-muted-foreground">Overdue</p></div></div>
        <div className="kpi-card flex items-center gap-3"><RotateCcw className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{returnRate}%</p><p className="text-sm text-muted-foreground">Return Rate</p></div></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="kpi-card"><p className="text-lg font-display font-bold text-foreground">{availableCopies}</p><p className="text-xs text-muted-foreground">Available Copies</p></div>
        <div className="kpi-card"><p className="text-lg font-display font-bold text-foreground">{studentsWithBooks}</p><p className="text-xs text-muted-foreground">Students with Books</p></div>
        <div className="kpi-card"><p className="text-lg font-display font-bold text-foreground">{dueToday}</p><p className="text-xs text-muted-foreground">Books Due Today</p></div>
        <div className="kpi-card"><p className="text-lg font-display font-bold text-foreground">{returnedToday}</p><p className="text-xs text-muted-foreground">Returned Today</p></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-full sm:w-fit overflow-x-auto max-w-full scrollbar-none">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {loading && <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}

      {!loading && activeTab === "Catalog" && (
        <div className="space-y-4 animate-fade-in">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search by title, author, or ISBN..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto hidden md:block"><table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <Th>Cover</Th><Th>Title</Th><Th>Author</Th><Th>ISBN</Th><Th>Category</Th>
                <Th align="center">Copies</Th><Th align="center">Available</Th><Th>Location</Th><Th align="center">Status</Th><Th align="right">Actions</Th>
              </tr></thead>
              <tbody>{filteredCatalog.map((b) => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-2 px-4">
                    {coverUrl(b)
                      ? <img src={coverUrl(b)} alt={`${b.title} cover`} className="w-9 h-12 object-cover rounded" />
                      : <div className="w-9 h-12 rounded bg-muted flex items-center justify-center"><BookOpen className="w-4 h-4 text-muted-foreground" /></div>}
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground cursor-pointer hover:text-primary" onClick={() => setDetailBook(b)}>{b.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">{b.author}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{b.isbn || "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground">{b.category}</td>
                  <td className="py-3 px-4 text-center text-foreground">{b.total_copies}</td>
                  <td className="py-3 px-4 text-center text-foreground">{b.available_copies}</td>
                  <td className="py-3 px-4 text-muted-foreground">{b.location}</td>
                  <td className="py-3 px-4 text-center"><StatusPill status={bookStatus(b)} /></td>
                  <td className="py-3 px-4"><div className="flex items-center justify-end gap-1">
                    <button title="View" onClick={() => setDetailBook(b)} className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                    {isLibraryStaff && <>
                      <button title="Edit" onClick={() => openEditBook(b)} className="p-1.5 rounded-md hover:bg-muted"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                      <button title="Issue" onClick={() => openIssue(b)} className="p-1.5 rounded-md hover:bg-muted"><ArrowRightLeft className="w-4 h-4 text-primary" /></button>
                      <button title="Delete" onClick={() => deleteBook(b)} className="p-1.5 rounded-md hover:bg-muted"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </>}
                  </div></td>
                </tr>
              ))}</tbody>
            </table></div>
            {filteredCatalog.length === 0 && <EmptyState message={search ? "No matching books found." : "No books found."} />}
          </div>
        </div>
      )}

      {!loading && activeTab === "Circulation" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input placeholder="Search student, ID, book or ISBN..." value={circSearch} onChange={(e) => setCircSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <select className={`${selectClass} sm:max-w-[180px]`} value={circFilter} onChange={(e) => setCircFilter(e.target.value)}>
              {["All", "Issued", "Returned", "Overdue", "Lost", "Damaged"].map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto hidden md:block"><table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <Th>Book</Th><Th>Student</Th><Th>Student ID</Th><Th align="center">Issue Date</Th><Th align="center">Due Date</Th>
                <Th align="center">Return Date</Th><Th align="center">Status</Th><Th>Issued By</Th><Th align="right">Actions</Th>
              </tr></thead>
              <tbody>{circulationRows.map((i) => (
                <tr key={i.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{i.books?.title ?? "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground">{i.students?.name ?? "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground">{i.students?.student_id ?? "—"}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{i.issue_date}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{i.due_date}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{i.returned_date ?? "—"}</td>
                  <td className="py-3 px-4 text-center"><StatusPill status={isOverdue(i) ? "Overdue" : i.status} /></td>
                  <td className="py-3 px-4 text-muted-foreground">{i.issued_by_name || "—"}</td>
                  <td className="py-3 px-4 text-right">
                    {isLibraryStaff && !i.returned_date && (
                      <button onClick={() => openReturn(i)} className="text-xs text-primary font-medium hover:underline">Return</button>
                    )}
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
            {circulationRows.length === 0 && <EmptyState message="No circulation records found." />}
          </div>
        </div>
      )}

      {!loading && activeTab === "Returns" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input placeholder="Find by student, ID, book, ISBN or issue ID..." value={returnSearch} onChange={(e) => setReturnSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            {isLibraryStaff && (
              <button onClick={() => scanInput.current?.click()} disabled={analyzing} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted disabled:opacity-60">
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />} Scan Book
              </button>
            )}
            <input ref={scanInput} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0]; e.target.value = "";
              if (!file) return;
              const err = validateImage(file); if (err) return toast.error(err);
              setAnalyzing(true);
              const dataUrl = await fileToDataUrl(file);
              const { data, error } = await supabase.functions.invoke("extract-book-details", { body: { imageDataUrl: dataUrl } });
              setAnalyzing(false);
              if (error) return toast.error(`Scan failed: ${error.message}`);
              const r = (data as { result?: Record<string, string> })?.result ?? {};
              const term = r.isbn || r.title || "";
              if (!term) return toast.error("No matching book found.");
              setReturnSearch(term);
              toast.success(`Searching returns for "${term}"`);
            }} />
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto hidden md:block"><table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <Th>Book</Th><Th>Student</Th><Th>Student ID</Th><Th align="center">Issued</Th><Th align="center">Due</Th><Th align="center">Status</Th><Th align="right">Action</Th>
              </tr></thead>
              <tbody>{returnRows.map((i) => (
                <tr key={i.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{i.books?.title}</td>
                  <td className="py-3 px-4 text-muted-foreground">{i.students?.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{i.students?.student_id}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{i.issue_date}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{i.due_date}</td>
                  <td className="py-3 px-4 text-center"><StatusPill status={isOverdue(i) ? "Overdue" : i.due_date === todayISO() ? "Due Today" : "Issued"} /></td>
                  <td className="py-3 px-4 text-right">
                    {isLibraryStaff && <button onClick={() => openReturn(i)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"><RotateCcw className="w-3.5 h-3.5" /> Return Book</button>}
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
            {returnRows.length === 0 && <EmptyState message="No books are currently issued." />}
          </div>
        </div>
      )}

      {!loading && activeTab === "Overdue" && (
        <div className="animate-fade-in bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <div className="overflow-x-auto hidden md:block"><table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              <Th>Book</Th><Th>Student</Th><Th>Student ID</Th><Th align="center">Issue Date</Th><Th align="center">Due Date</Th><Th align="center">Days Overdue</Th><Th align="right">Actions</Th>
            </tr></thead>
            <tbody>{overdueIssues.map((i) => (
              <tr key={i.id} className="border-b border-border/50 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{i.books?.title}</td>
                <td className="py-3 px-4 text-muted-foreground">{i.students?.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{i.students?.student_id}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{i.issue_date}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{i.due_date}</td>
                <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">{daysBetween(i.due_date, todayISO())}d</span></td>
                <td className="py-3 px-4 text-right space-x-3">
                  <button onClick={() => { const b = books.find((x) => x.id === i.book_id); if (b) setDetailBook(b); }} className="text-xs text-primary font-medium hover:underline">View Book</button>
                  {isLibraryStaff && <button onClick={() => openReturn(i)} className="text-xs text-primary font-medium hover:underline">Return</button>}
                </td>
              </tr>
            ))}</tbody>
          </table></div>
          {overdueIssues.length === 0 && <EmptyState message="No overdue books. Great job!" />}
        </div>
      )}

      {!loading && activeTab === "Inventory" && (
        <div className="animate-fade-in space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="kpi-card"><p className="text-xl font-display font-bold text-foreground">{totalCopies}</p><p className="text-sm text-muted-foreground">Total Copies</p></div>
            <div className="kpi-card"><p className="text-xl font-display font-bold text-foreground">{availableCopies}</p><p className="text-sm text-muted-foreground">Available</p></div>
            <div className="kpi-card"><p className="text-xl font-display font-bold text-foreground">{books.reduce((a, b) => a + b.issued_copies, 0)}</p><p className="text-sm text-muted-foreground">Issued</p></div>
            <div className="kpi-card"><p className="text-xl font-display font-bold text-foreground">{books.reduce((a, b) => a + b.damaged_copies, 0)}</p><p className="text-sm text-muted-foreground">Damaged</p></div>
            <div className="kpi-card"><p className="text-xl font-display font-bold text-foreground">{books.reduce((a, b) => a + b.lost_copies, 0)}</p><p className="text-sm text-muted-foreground">Lost</p></div>
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto hidden md:block"><table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <Th>Title</Th><Th align="center">Total</Th><Th align="center">Available</Th><Th align="center">Issued</Th><Th align="center">Damaged</Th><Th align="center">Lost</Th><Th align="right">Actions</Th>
              </tr></thead>
              <tbody>{books.map((b) => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{b.title}</td>
                  <td className="py-3 px-4 text-center">{b.total_copies}</td>
                  <td className="py-3 px-4 text-center">{b.available_copies}</td>
                  <td className="py-3 px-4 text-center">{b.issued_copies}</td>
                  <td className="py-3 px-4 text-center">{b.damaged_copies}</td>
                  <td className="py-3 px-4 text-center">{b.lost_copies}</td>
                  <td className="py-3 px-4 text-right">
                    {isLibraryStaff && <button onClick={() => { setAdjustForm({ type: "add_copies", quantity: "1", reason: "" }); setAdjustTarget(b); }} className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"><PackagePlus className="w-3.5 h-3.5" /> Adjust</button>}
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
            {books.length === 0 && <EmptyState message="No books found." />}
          </div>
        </div>
      )}

      {!loading && activeTab === "Reports" && (
        <div className="animate-fade-in space-y-4">
          <div className="flex justify-end gap-2">
            <button onClick={() => toCsv(books.map((b) => ({ Title: b.title, Author: b.author, ISBN: b.isbn ?? "", Category: b.category, Total: b.total_copies, Available: b.available_copies, Issued: b.issued_copies, Location: b.location })), "library-inventory.csv")} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted"><Download className="w-4 h-4" /> Export Inventory</button>
            <button onClick={() => toCsv(issues.map((i) => ({ Book: i.books?.title ?? "", Student: i.students?.name ?? "", StudentID: i.students?.student_id ?? "", Issued: i.issue_date, Due: i.due_date, Returned: i.returned_date ?? "", Status: isOverdue(i) ? "Overdue" : i.status })), "library-circulation.csv")} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted"><Download className="w-4 h-4" /> Export Circulation</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-3">Most Issued Books</h3>
              <div className="space-y-2">
                {Object.entries(issues.reduce<Record<string, number>>((acc, i) => {
                  const t = i.books?.title ?? "—"; acc[t] = (acc[t] ?? 0) + 1; return acc;
                }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([title, count]) => (
                  <div key={title} className="flex justify-between text-sm"><span className="text-foreground">{title}</span><span className="text-muted-foreground">{count}</span></div>
                ))}
                {issues.length === 0 && <EmptyState message="No circulation data yet." />}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
              <h3 className="font-display font-semibold text-foreground mb-3">Most Active Borrowers</h3>
              <div className="space-y-2">
                {Object.entries(issues.reduce<Record<string, number>>((acc, i) => {
                  const n = i.students?.name ?? "—"; acc[n] = (acc[n] ?? 0) + 1; return acc;
                }, {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => (
                  <div key={name} className="flex justify-between text-sm"><span className="text-foreground">{name}</span><span className="text-muted-foreground">{count}</span></div>
                ))}
                {issues.length === 0 && <EmptyState message="No borrowing data yet." />}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5 lg:col-span-2">
              <h3 className="font-display font-semibold text-foreground mb-3">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><p className="text-muted-foreground">Total Titles</p><p className="font-semibold text-foreground">{books.length}</p></div>
                <div><p className="text-muted-foreground">Current Issues</p><p className="font-semibold text-foreground">{activeIssues.length}</p></div>
                <div><p className="text-muted-foreground">Returned Books</p><p className="font-semibold text-foreground">{returnedCount}</p></div>
                <div><p className="text-muted-foreground">Overdue Books</p><p className="font-semibold text-foreground">{overdueIssues.length}</p></div>
                <div><p className="text-muted-foreground">Lost Copies</p><p className="font-semibold text-foreground">{books.reduce((a, b) => a + b.lost_copies, 0)}</p></div>
                <div><p className="text-muted-foreground">Damaged Copies</p><p className="font-semibold text-foreground">{books.reduce((a, b) => a + b.damaged_copies, 0)}</p></div>
                <div><p className="text-muted-foreground">Available Copies</p><p className="font-semibold text-foreground">{availableCopies}</p></div>
                <div><p className="text-muted-foreground">Total Copies</p><p className="font-semibold text-foreground">{totalCopies}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Add / Edit Book Modal ---------- */}
      <FormModal
        open={bookModal.open}
        onClose={() => setBookModal({ open: false, editing: null })}
        title={bookModal.editing ? "Edit Book" : "Add Book"}
        onSubmit={saveBook}
        submitLabel={saving ? "Saving…" : bookModal.editing ? "Save Changes" : "Add Book"}
      >
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Scan Book / Upload Photo</p>
            {!manualMode && <button type="button" onClick={() => setManualMode(true)} className="text-xs text-primary font-medium hover:underline">Enter Manually</button>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => cameraInput.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted"><Camera className="w-4 h-4" /> Take Photo</button>
            <button type="button" onClick={() => coverInput.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted"><Upload className="w-4 h-4" /> Upload Photo</button>
            {coverPreview.startsWith("data:image/") && (
              <button type="button" onClick={analyzePhoto} disabled={analyzing} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60">
                {analyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Reading book details…</> : <><Sparkles className="w-4 h-4" /> Extract Book Details with AI</>}
              </button>
            )}
          </div>
          <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { handleCoverPick(e.target.files?.[0]); e.target.value = ""; }} />
          <input ref={coverInput} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={(e) => { handleCoverPick(e.target.files?.[0]); e.target.value = ""; }} />
          {coverPreview && <img src={coverPreview} alt="Book preview" className="h-32 rounded-lg border border-border object-contain bg-card" />}
        </div>

        <FormField label="Title" required><input className={inputClass} placeholder="Book title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} />{aiTag("title")}</FormField>
        <FormField label="Author" required><input className={inputClass} placeholder="Author name" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} />{aiTag("author")}</FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="ISBN"><input className={inputClass} placeholder="978-..." value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} />{aiTag("isbn")}</FormField>
          <FormField label="Publisher"><input className={inputClass} value={bookForm.publisher} onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })} />{aiTag("publisher")}</FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Edition"><input className={inputClass} value={bookForm.edition} onChange={(e) => setBookForm({ ...bookForm, edition: e.target.value })} />{aiTag("edition")}</FormField>
          <FormField label="Language"><input className={inputClass} value={bookForm.language} onChange={(e) => setBookForm({ ...bookForm, language: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Category"><select className={selectClass} value={bookForm.category} onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}>{BOOK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></FormField>
          <FormField label="Publication Year"><input className={inputClass} type="number" min="1500" max="2100" value={bookForm.publication_year} onChange={(e) => setBookForm({ ...bookForm, publication_year: e.target.value })} /></FormField>
        </div>
        <FormField label="Description"><textarea className={inputClass} rows={2} value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} /></FormField>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Copies" required><input className={inputClass} type="number" min="1" value={bookForm.copies} onChange={(e) => setBookForm({ ...bookForm, copies: e.target.value })} /></FormField>
          <FormField label="Location" required><input className={inputClass} placeholder="Shelf A-01" value={bookForm.location} onChange={(e) => setBookForm({ ...bookForm, location: e.target.value })} /></FormField>
          <FormField label="Shelf Number"><input className={inputClass} value={bookForm.shelf_number} onChange={(e) => setBookForm({ ...bookForm, shelf_number: e.target.value })} /></FormField>
        </div>
      </FormModal>

      {/* ---------- Book Details ---------- */}
      <FormModal open={!!detailBook} onClose={() => setDetailBook(null)} title="Book Details" onSubmit={() => setDetailBook(null)} submitLabel="Close">
        {detailBook && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {coverUrl(detailBook)
                ? <img src={coverUrl(detailBook)} alt={`${detailBook.title} cover`} className="w-32 h-44 object-cover rounded-lg border border-border" />
                : <div className="w-32 h-44 rounded-lg bg-muted flex items-center justify-center"><BookOpen className="w-8 h-8 text-muted-foreground" /></div>}
              <div className="flex-1 space-y-1">
                <h3 className="font-display font-bold text-lg text-foreground">{detailBook.title}</h3>
                <p className="text-sm text-muted-foreground">{detailBook.author}</p>
                <StatusPill status={bookStatus(detailBook)} />
                <p className="text-sm text-muted-foreground pt-2">{detailBook.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                ["ISBN", detailBook.isbn], ["Publisher", detailBook.publisher], ["Edition", detailBook.edition],
                ["Category", detailBook.category], ["Language", detailBook.language], ["Year", detailBook.publication_year],
                ["Total Copies", detailBook.total_copies], ["Available", detailBook.available_copies], ["Issued", detailBook.issued_copies],
                ["Location", detailBook.location], ["Shelf", detailBook.shelf_number], ["Added", detailBook.created_at.split("T")[0]],
              ].map(([label, value]) => (
                <div key={String(label)}><p className="text-muted-foreground text-xs">{label}</p><p className="text-foreground font-medium">{value === null || value === "" || value === undefined ? "—" : String(value)}</p></div>
              ))}
            </div>
            {isLibraryStaff && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <button type="button" onClick={() => openEditBook(detailBook)} className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Edit Book</button>
                <button type="button" onClick={() => openIssue(detailBook)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Issue Book</button>
                <button type="button" onClick={() => { setDetailBook(null); setCircSearch(detailBook.title); setActiveTab("Circulation"); }} className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">View Circulation</button>
                <button type="button" onClick={() => deleteBook(detailBook)} className="px-3 py-2 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10">Delete Book</button>
              </div>
            )}
          </div>
        )}
      </FormModal>

      {/* ---------- Issue Book ---------- */}
      <FormModal open={issueModal} onClose={() => setIssueModal(false)} title="Issue Book to Student" onSubmit={submitIssue} submitLabel={saving ? "Issuing…" : issueConfirm ? "Confirm Issue" : "Issue Book"}>
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Scan Book</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => scanCameraInput.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted"><Camera className="w-4 h-4" /> Take Photo</button>
            <button type="button" onClick={() => scanInput.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted"><Upload className="w-4 h-4" /> Upload Photo</button>
            {analyzing && <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Reading book details…</span>}
          </div>
          <input ref={scanCameraInput} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { scanForIssue(e.target.files?.[0]); e.target.value = ""; }} />
          {scanMatches?.length === 0 && <p className="text-sm text-destructive">No matching book found. Please search manually below.</p>}
          {!!scanMatches?.length && (
            <div className="space-y-1">
              {scanMatches.map((m) => (
                <button key={m.id} type="button" onClick={() => { setIssueForm((f) => ({ ...f, bookId: m.id })); setScanMatches(null); }} className="w-full text-left px-3 py-2 rounded-lg border border-border bg-card text-sm hover:bg-muted">{m.title} — {m.author}</button>
              ))}
            </div>
          )}
        </div>

        <FormField label="Select Book" required>
          <input className={inputClass} placeholder="Search by title, author or ISBN…" value={bookQuery} onChange={(e) => setBookQuery(e.target.value)} />
          <select className={`${selectClass} mt-2`} value={issueForm.bookId} onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}>
            <option value="">— Choose a book —</option>
            {books.filter((b) => {
              const q = bookQuery.toLowerCase();
              return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn ?? "").toLowerCase().includes(q);
            }).map((b) => <option key={b.id} value={b.id}>{b.title} ({b.available_copies} available)</option>)}
          </select>
        </FormField>

        {selectedBook && (
          <div className="flex gap-3 rounded-lg border border-border p-3">
            {coverUrl(selectedBook)
              ? <img src={coverUrl(selectedBook)} alt="cover" className="w-12 h-16 object-cover rounded" />
              : <div className="w-12 h-16 rounded bg-muted flex items-center justify-center"><BookOpen className="w-4 h-4 text-muted-foreground" /></div>}
            <div className="text-sm">
              <p className="font-medium text-foreground">{selectedBook.title}</p>
              <p className="text-muted-foreground">{selectedBook.author} · {selectedBook.isbn || "No ISBN"}</p>
              <p className="text-muted-foreground">{selectedBook.available_copies} available · {selectedBook.location}</p>
              {selectedBook.available_copies === 0 && <p className="text-destructive font-medium">No copies available.</p>}
            </div>
          </div>
        )}

        <FormField label="Select Student" required>
          <input className={inputClass} placeholder="Search by name, student ID or email…" value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} />
          <select className={`${selectClass} mt-2`} value={issueForm.studentId} onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}>
            <option value="">— Choose a student —</option>
            {students.filter((s) => {
              const q = studentQuery.toLowerCase();
              return !q || s.name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
            }).map((s) => <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>)}
          </select>
        </FormField>

        {selectedStudent && (
          <div className="rounded-lg border border-border p-3 text-sm">
            <p className="font-medium text-foreground">{selectedStudent.name} · {selectedStudent.student_id}</p>
            <p className="text-muted-foreground">{selectedStudent.institute} · {selectedStudent.course} · {selectedStudent.batch}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Issue Date"><input className={inputClass} type="date" value={issueForm.issueDate} onChange={(e) => setIssueForm({ ...issueForm, issueDate: e.target.value })} /></FormField>
          <FormField label="Due Date" required><input className={inputClass} type="date" value={issueForm.dueDate} onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })} /></FormField>
        </div>
        <FormField label="Notes"><textarea className={inputClass} rows={2} value={issueForm.notes} onChange={(e) => setIssueForm({ ...issueForm, notes: e.target.value })} /></FormField>

        {issueConfirm && selectedBook && selectedStudent && (
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 text-sm space-y-1">
            <p className="font-medium text-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Please confirm</p>
            <p className="text-muted-foreground">Book: {selectedBook.title}</p>
            <p className="text-muted-foreground">Student: {selectedStudent.name} ({selectedStudent.student_id})</p>
            <p className="text-muted-foreground">Issue Date: {issueForm.issueDate}</p>
            <p className="text-muted-foreground">Due Date: {issueForm.dueDate}</p>
          </div>
        )}
      </FormModal>

      {/* ---------- Return Book ---------- */}
      <FormModal open={!!returnTarget} onClose={() => setReturnTarget(null)} title="Return Book" onSubmit={submitReturn} submitLabel={saving ? "Returning…" : "Return Book"}>
        {returnTarget && (
          <>
            <div className="rounded-lg border border-border p-3 text-sm space-y-1">
              <p className="font-medium text-foreground">{returnTarget.books?.title}</p>
              <p className="text-muted-foreground">{returnTarget.students?.name} ({returnTarget.students?.student_id})</p>
              <p className="text-muted-foreground">Issued: {returnTarget.issue_date} · Due: {returnTarget.due_date}</p>
              {isOverdue(returnTarget) && (
                <p className="text-destructive font-medium">Days overdue: {daysBetween(returnTarget.due_date, returnForm.date)}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Return Date"><input className={inputClass} type="date" value={returnForm.date} onChange={(e) => setReturnForm({ ...returnForm, date: e.target.value })} /></FormField>
              <FormField label="Condition"><select className={selectClass} value={returnForm.condition} onChange={(e) => setReturnForm({ ...returnForm, condition: e.target.value })}>{["Good", "Damaged", "Lost"].map((c) => <option key={c} value={c}>{c}</option>)}</select></FormField>
            </div>
            <FormField label="Notes"><textarea className={inputClass} rows={2} value={returnForm.notes} onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })} /></FormField>
          </>
        )}
      </FormModal>

      {/* ---------- Adjust Inventory ---------- */}
      <FormModal open={!!adjustTarget} onClose={() => setAdjustTarget(null)} title="Adjust Inventory" onSubmit={submitAdjust} submitLabel={saving ? "Saving…" : "Apply Adjustment"}>
        {adjustTarget && (
          <>
            <p className="text-sm text-muted-foreground">{adjustTarget.title} — {adjustTarget.total_copies} total, {adjustTarget.available_copies} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Adjustment" required>
                <select className={selectClass} value={adjustForm.type} onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}>
                  <option value="add_copies">Add Copies</option>
                  <option value="remove_copies">Remove Copies</option>
                  <option value="mark_damaged">Mark Damaged</option>
                  <option value="mark_lost">Mark Lost</option>
                </select>
              </FormField>
              <FormField label="Quantity" required><input className={inputClass} type="number" min="1" value={adjustForm.quantity} onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })} /></FormField>
            </div>
            <FormField label="Reason"><input className={inputClass} value={adjustForm.reason} onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })} placeholder="New purchase, stock audit…" /></FormField>
            <p className="text-xs text-muted-foreground">Adjustment recorded against {displayName || "your account"} in the audit log.</p>
          </>
        )}
      </FormModal>
    </div>
  );
}
