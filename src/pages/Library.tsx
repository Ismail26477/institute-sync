import { useState } from "react";
import { Search, Plus, BookOpen, RotateCcw, AlertTriangle, Users, Barcode, ArrowRightLeft } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const tabs = ["Catalog", "Circulation", "Overdue", "Inventory"];

const initialCatalog = [
  { id: 1, title: "Textbook of Medical-Surgical Nursing", author: "Brunner & Suddarth", isbn: "978-1496355157", copies: 12, available: 5, category: "Nursing", location: "Shelf A-12" },
  { id: 2, title: "Anatomy & Physiology", author: "Tortora & Derrickson", isbn: "978-1119585299", copies: 15, available: 8, category: "Basic Sciences", location: "Shelf B-03" },
  { id: 3, title: "Fundamentals of Nursing", author: "Kozier & Erb", isbn: "978-0134879079", copies: 20, available: 3, category: "Nursing", location: "Shelf A-01" },
  { id: 4, title: "Pharmacology for Nurses", author: "Adams & Urban", isbn: "978-0135218334", copies: 10, available: 6, category: "Pharmacology", location: "Shelf C-07" },
  { id: 5, title: "Community Health Nursing", author: "Stanhope & Lancaster", isbn: "978-0323554718", copies: 8, available: 2, category: "Nursing", location: "Shelf A-15" },
  { id: 6, title: "Physiotherapy in Orthopaedics", author: "Atkinson, Coutts & Hassenkamp", isbn: "978-0702031748", copies: 6, available: 4, category: "Physiotherapy", location: "Shelf D-02" },
  { id: 7, title: "Clinical Nursing Procedures", author: "Annamma Jacob", isbn: "978-8131234587", copies: 18, available: 10, category: "Nursing", location: "Shelf A-05" },
  { id: 8, title: "Essentials of Pediatric Nursing", author: "Palani Velu", isbn: "978-8131235690", copies: 9, available: 7, category: "Nursing", location: "Shelf A-20" },
];

const initialCirculation = [
  { id: 1, book: "Textbook of Medical-Surgical Nursing", borrower: "Priya Sharma", borrowerId: "STU001", issuedDate: "2025-07-01", dueDate: "2025-07-15", status: "active" },
  { id: 2, book: "Anatomy & Physiology", borrower: "Rahul Verma", borrowerId: "STU002", issuedDate: "2025-06-28", dueDate: "2025-07-12", status: "active" },
  { id: 3, book: "Fundamentals of Nursing", borrower: "Ananya Patel", borrowerId: "STU003", issuedDate: "2025-06-15", dueDate: "2025-06-29", status: "overdue" },
  { id: 4, book: "Pharmacology for Nurses", borrower: "Meera Joshi", borrowerId: "STU005", issuedDate: "2025-07-05", dueDate: "2025-07-19", status: "active" },
  { id: 5, book: "Community Health Nursing", borrower: "Sneha Iyer", borrowerId: "STU009", issuedDate: "2025-06-10", dueDate: "2025-06-24", status: "overdue" },
  { id: 6, book: "Fundamentals of Nursing", borrower: "Kavita Nair", borrowerId: "STU007", issuedDate: "2025-07-02", dueDate: "2025-07-16", status: "active" },
];

const overdueData = [
  { id: 1, book: "Fundamentals of Nursing", borrower: "Ananya Patel", dueDate: "2025-06-29", daysOverdue: 17, fine: 170, contact: "+91 98765 33333" },
  { id: 2, book: "Community Health Nursing", borrower: "Sneha Iyer", dueDate: "2025-06-24", daysOverdue: 22, fine: 220, contact: "+91 98765 99999" },
  { id: 3, book: "Textbook of Medical-Surgical Nursing", borrower: "Deepak Gupta", dueDate: "2025-06-20", daysOverdue: 26, fine: 260, contact: "+91 98765 88888" },
  { id: 4, book: "Anatomy & Physiology", borrower: "Amit Tiwari", dueDate: "2025-06-18", daysOverdue: 28, fine: 280, contact: "+91 98765 00000" },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("Catalog");
  const [search, setSearch] = useState("");
  const [catalog, setCatalog] = useState(initialCatalog);
  const [circulation, setCirculation] = useState(initialCirculation);
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [issueBookOpen, setIssueBookOpen] = useState(false);
  const [bookForm, setBookForm] = useState({ title: "", author: "", isbn: "", copies: "1", category: "Nursing", location: "" });
  const [issueForm, setIssueForm] = useState({ bookId: "", borrower: "", borrowerId: "", dueDate: "" });

  const filteredCatalog = catalog.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search)
  );

  const handleAddBook = () => {
    if (!bookForm.title || !bookForm.author) return toast.error("Title and Author are required");
    const copies = Number(bookForm.copies) || 1;
    setCatalog([...catalog, { id: Date.now(), title: bookForm.title, author: bookForm.author, isbn: bookForm.isbn, copies, available: copies, category: bookForm.category, location: bookForm.location }]);
    setAddBookOpen(false);
    setBookForm({ title: "", author: "", isbn: "", copies: "1", category: "Nursing", location: "" });
    toast.success(`"${bookForm.title}" added to catalog`);
  };

  const handleIssueBook = () => {
    if (!issueForm.bookId || !issueForm.borrower || !issueForm.borrowerId) return toast.error("All fields are required");
    const book = catalog.find(b => b.id === Number(issueForm.bookId));
    if (!book) return toast.error("Book not found");
    if (book.available <= 0) return toast.error("No copies available");
    setCatalog(catalog.map(b => b.id === book.id ? { ...b, available: b.available - 1 } : b));
    const today = new Date().toISOString().split("T")[0];
    const due = issueForm.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
    setCirculation([...circulation, { id: Date.now(), book: book.title, borrower: issueForm.borrower, borrowerId: issueForm.borrowerId, issuedDate: today, dueDate: due, status: "active" }]);
    setIssueBookOpen(false);
    setIssueForm({ bookId: "", borrower: "", borrowerId: "", dueDate: "" });
    toast.success(`"${book.title}" issued to ${issueForm.borrower}`);
  };

  const handleReturn = (loan: typeof initialCirculation[0]) => {
    setCirculation(circulation.map(c => c.id === loan.id ? { ...c, status: "returned" } : c));
    setCatalog(catalog.map(b => b.title === loan.book ? { ...b, available: b.available + 1 } : b));
    toast.success(`"${loan.book}" returned by ${loan.borrower}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Library Management</h1><p className="text-sm text-muted-foreground">Catalog, circulation, and inventory management</p></div>
        <div className="flex gap-2">
          <button onClick={() => setIssueBookOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"><ArrowRightLeft className="w-4 h-4" /> Issue Book</button>
          <button onClick={() => setAddBookOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Add Book</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><BookOpen className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">{catalog.reduce((a, b) => a + b.copies, 0)}</p><p className="text-sm text-muted-foreground">Total Books</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Users className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{circulation.filter(c => c.status === "active" || c.status === "overdue").length}</p><p className="text-sm text-muted-foreground">Books Issued</p></div></div>
        <div className="kpi-card flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{overdueData.length}</p><p className="text-sm text-muted-foreground">Overdue</p></div></div>
        <div className="kpi-card flex items-center gap-3"><RotateCcw className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">96.2%</p><p className="text-sm text-muted-foreground">Return Rate</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Catalog" && (
        <div className="space-y-4 animate-fade-in">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search by title, author, or ISBN..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Title</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Author</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">ISBN</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Category</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Copies</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Available</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Location</th>
            </tr></thead><tbody>{filteredCatalog.map((b) => (
              <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{b.title}</td>
                <td className="py-3 px-4 text-muted-foreground">{b.author}</td>
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{b.isbn}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">{b.category}</span></td>
                <td className="py-3 px-4 text-center text-foreground">{b.copies}</td>
                <td className="py-3 px-4 text-center"><span className={`font-medium ${b.available <= 3 ? "text-destructive" : "text-success"}`}>{b.available}</span></td>
                <td className="py-3 px-4 text-muted-foreground text-xs">{b.location}</td>
              </tr>
            ))}</tbody></table></div>
          </div>
        </div>
      )}

      {activeTab === "Circulation" && (
        <div className="animate-fade-in bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Book</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Borrower</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Issued</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Due Date</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Action</th>
          </tr></thead><tbody>{circulation.filter(c => c.status !== "returned").map((c) => (
            <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{c.book}</td>
              <td className="py-3 px-4 text-muted-foreground">{c.borrower} <span className="text-xs text-muted-foreground">({c.borrowerId})</span></td>
              <td className="py-3 px-4 text-center text-muted-foreground">{c.issuedDate}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{c.dueDate}</td>
              <td className="py-3 px-4 text-center"><span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${c.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{c.status}</span></td>
              <td className="py-3 px-4 text-right"><button onClick={() => handleReturn(c)} className="text-xs text-primary font-medium hover:underline">Return</button></td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "Overdue" && (
        <div className="animate-fade-in bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Book</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Borrower</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Due Date</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Days Overdue</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Fine (₹)</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Action</th>
          </tr></thead><tbody>{overdueData.map((o) => (
            <tr key={o.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{o.book}</td>
              <td className="py-3 px-4 text-muted-foreground">{o.borrower}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{o.dueDate}</td>
              <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">{o.daysOverdue}d</span></td>
              <td className="py-3 px-4 text-right font-medium text-destructive">₹{o.fine}</td>
              <td className="py-3 px-4 text-right"><button onClick={() => toast.info(`Reminder sent to ${o.borrower}`)} className="text-xs text-primary font-medium hover:underline">Send Reminder</button></td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "Inventory" && (
        <div className="animate-fade-in space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="kpi-card"><p className="text-xl font-display font-bold text-foreground">{catalog.reduce((a, b) => a + b.copies, 0)}</p><p className="text-sm text-muted-foreground">Total Volumes</p></div>
            <div className="kpi-card"><p className="text-xl font-display font-bold text-foreground">{catalog.length}</p><p className="text-sm text-muted-foreground">Unique Titles</p></div>
            <div className="kpi-card"><p className="text-xl font-display font-bold text-foreground">₹24.5L</p><p className="text-sm text-muted-foreground">Total Value</p></div>
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">Category Distribution</h3>
            <div className="space-y-3">
              {[{ name: "Nursing", count: 4200, pct: 50 }, { name: "Basic Sciences", count: 1690, pct: 20 }, { name: "Pharmacology", count: 845, pct: 10 }, { name: "Physiotherapy", count: 845, pct: 10 }, { name: "General Reference", count: 870, pct: 10 }].map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-foreground font-medium">{cat.name}</span><span className="text-muted-foreground">{cat.count} ({cat.pct}%)</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${cat.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      <FormModal open={addBookOpen} onClose={() => setAddBookOpen(false)} title="Add Book" onSubmit={handleAddBook} submitLabel="Add Book">
        <FormField label="Title" required><input className={inputClass} placeholder="Book title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} /></FormField>
        <FormField label="Author" required><input className={inputClass} placeholder="Author name" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="ISBN"><input className={inputClass} placeholder="978-..." value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} /></FormField>
          <FormField label="Copies"><input className={inputClass} type="number" min="1" value={bookForm.copies} onChange={(e) => setBookForm({ ...bookForm, copies: e.target.value })} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category"><select className={selectClass} value={bookForm.category} onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}>{["Nursing", "Basic Sciences", "Pharmacology", "Physiotherapy", "General Reference"].map(c => <option key={c} value={c}>{c}</option>)}</select></FormField>
          <FormField label="Location"><input className={inputClass} placeholder="Shelf A-01" value={bookForm.location} onChange={(e) => setBookForm({ ...bookForm, location: e.target.value })} /></FormField>
        </div>
      </FormModal>

      {/* Issue Book Modal */}
      <FormModal open={issueBookOpen} onClose={() => setIssueBookOpen(false)} title="Issue Book to Student" onSubmit={handleIssueBook} submitLabel="Issue Book">
        <FormField label="Select Book" required>
          <select className={selectClass} value={issueForm.bookId} onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}>
            <option value="">— Choose a book —</option>
            {catalog.filter(b => b.available > 0).map(b => <option key={b.id} value={b.id}>{b.title} ({b.available} available)</option>)}
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Student Name" required><input className={inputClass} placeholder="Borrower name" value={issueForm.borrower} onChange={(e) => setIssueForm({ ...issueForm, borrower: e.target.value })} /></FormField>
          <FormField label="Student ID" required><input className={inputClass} placeholder="STU001" value={issueForm.borrowerId} onChange={(e) => setIssueForm({ ...issueForm, borrowerId: e.target.value })} /></FormField>
        </div>
        <FormField label="Due Date"><input className={inputClass} type="date" value={issueForm.dueDate} onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })} /></FormField>
      </FormModal>
    </div>
  );
}
