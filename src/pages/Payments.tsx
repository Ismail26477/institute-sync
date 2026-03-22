import { useState } from "react";
import { CreditCard, IndianRupee, QrCode, Smartphone, Download, CheckCircle2, Receipt, Calendar, FileText, Printer } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const tabs = ["Pay Now", "Receipts", "Installment Plans", "Invoice Generator"];

interface PaymentReceipt {
  id: string; student: string; amount: number; mode: string; date: string; status: string; txnId: string; invoice: string;
}

const initialReceipts: PaymentReceipt[] = [
  { id: "RCP-001", student: "Priya Sharma", amount: 85000, mode: "UPI", date: "2025-06-15", status: "success", txnId: "TXN2025061501", invoice: "INV-2025-001" },
  { id: "RCP-002", student: "Vikram Singh", amount: 72000, mode: "Card", date: "2025-06-14", status: "success", txnId: "TXN2025061402", invoice: "INV-2025-004" },
  { id: "RCP-003", student: "Kavita Nair", amount: 48000, mode: "NetBanking", date: "2025-06-12", status: "success", txnId: "TXN2025061203", invoice: "INV-2025-007" },
  { id: "RCP-004", student: "Rahul Verma", amount: 38000, mode: "UPI", date: "2025-06-10", status: "success", txnId: "TXN2025061004", invoice: "INV-2025-002" },
  { id: "RCP-005", student: "Meera Joshi", amount: 55000, mode: "Card", date: "2025-06-08", status: "success", txnId: "TXN2025060805", invoice: "INV-2025-005" },
];

const installmentPlans = [
  { id: 1, student: "Rahul Verma", totalFee: 65000, plan: "3 EMIs", emiAmount: 21667, paid: 1, remaining: 2, nextDue: "2025-08-15", autopay: true },
  { id: 2, student: "Ananya Patel", totalFee: 95000, plan: "4 EMIs", emiAmount: 23750, paid: 1, remaining: 3, nextDue: "2025-08-01", autopay: false },
  { id: 3, student: "Arjun Reddy", totalFee: 85000, plan: "2 EMIs", emiAmount: 42500, paid: 1, remaining: 1, nextDue: "2025-09-15", autopay: true },
  { id: 4, student: "Deepak Gupta", totalFee: 55000, plan: "3 EMIs", emiAmount: 18334, paid: 2, remaining: 1, nextDue: "2025-07-20", autopay: false },
  { id: 5, student: "Amit Tiwari", totalFee: 65000, plan: "6 EMIs (UPI Autopay)", emiAmount: 10834, paid: 2, remaining: 4, nextDue: "2025-08-01", autopay: true },
];

const feeItems = [
  { name: "Tuition Fee", amount: 50000 },
  { name: "Lab Fee", amount: 8000 },
  { name: "Library Fee", amount: 3000 },
  { name: "Exam Fee", amount: 5000 },
  { name: "Registration Fee", amount: 2000 },
  { name: "Development Fee", amount: 4000 },
  { name: "Hostel Fee", amount: 24000 },
  { name: "Transport Fee", amount: 12000 },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("Pay Now");
  const [receipts, setReceipts] = useState(initialReceipts);
  const [paymentModal, setPaymentModal] = useState(false);
  const [processingModal, setProcessingModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [lastPayment, setLastPayment] = useState<{ student: string; amount: number; mode: string; txnId: string } | null>(null);
  const [form, setForm] = useState({ student: "", amount: "", mode: "UPI", invoice: "" });

  // Invoice state
  const [invoiceForm, setInvoiceForm] = useState({
    studentName: "", studentId: "", course: "B.Sc Nursing", institute: "",
    items: [{ name: "Tuition Fee", amount: 50000 }] as { name: string; amount: number }[],
    discount: 0, dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });
  const [invoicePreview, setInvoicePreview] = useState(false);
  const [invoiceNumber] = useState(`INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`);

  const totalCollected = receipts.reduce((a, b) => a + b.amount, 0);

  const handlePay = () => {
    if (!form.student || !form.amount) return toast.error("Student and amount are required");
    setPaymentModal(false);
    setProcessingModal(true);

    setTimeout(() => {
      const txnId = `TXN${Date.now()}`;
      const rcpId = `RCP-${String(receipts.length + 1).padStart(3, "0")}`;
      const newReceipt: PaymentReceipt = {
        id: rcpId, student: form.student, amount: Number(form.amount), mode: form.mode,
        date: new Date().toISOString().split("T")[0], status: "success", txnId, invoice: form.invoice || "N/A",
      };
      setReceipts([newReceipt, ...receipts]);
      setLastPayment({ student: form.student, amount: Number(form.amount), mode: form.mode, txnId });
      setProcessingModal(false);
      setSuccessModal(true);
      setForm({ student: "", amount: "", mode: "UPI", invoice: "" });
    }, 2500);
  };

  const handleDownloadReceipt = (r: PaymentReceipt) => {
    const lines = [
      "═══════════════════════════════════════",
      "        PAYMENT RECEIPT                ",
      "        City Nursing College           ",
      "═══════════════════════════════════════",
      `Receipt No:   ${r.id}`,
      `Date:         ${r.date}`,
      `Student:      ${r.student}`,
      `Invoice:      ${r.invoice}`,
      `Amount:       ₹${r.amount.toLocaleString("en-IN")}`,
      `Mode:         ${r.mode}`,
      `Txn ID:       ${r.txnId}`,
      `Status:       ${r.status.toUpperCase()}`,
      "",
      "─────────────────────────────────────────",
      "  Powered by Razorpay · QR Code Below   ",
      `  [QR: ${r.txnId}]`,
      "═══════════════════════════════════════",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `Receipt_${r.id}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Receipt ${r.id} downloaded`);
  };

  const invoiceSubtotal = invoiceForm.items.reduce((a, b) => a + b.amount, 0);
  const invoiceTotal = invoiceSubtotal - invoiceForm.discount;

  const addInvoiceItem = () => {
    setInvoiceForm({ ...invoiceForm, items: [...invoiceForm.items, { name: "", amount: 0 }] });
  };

  const removeInvoiceItem = (i: number) => {
    setInvoiceForm({ ...invoiceForm, items: invoiceForm.items.filter((_, idx) => idx !== i) });
  };

  const updateInvoiceItem = (i: number, field: "name" | "amount", value: string) => {
    const items = [...invoiceForm.items];
    if (field === "amount") items[i].amount = Number(value) || 0;
    else items[i].name = value;
    setInvoiceForm({ ...invoiceForm, items });
  };

  const handleDownloadInvoice = () => {
    if (!invoiceForm.studentName) return toast.error("Student name is required");
    const date = new Date().toISOString().split("T")[0];
    const lines = [
      "════════════════════════════════════════════════════════════",
      "                        INVOICE                            ",
      "                  City Nursing College                     ",
      "           123 Medical Road, Mumbai, MH 400001             ",
      "            Ph: +91 22 2345 6789 | GST: 27XXXXX           ",
      "════════════════════════════════════════════════════════════",
      "",
      `  Invoice No:    ${invoiceNumber}`,
      `  Date:          ${date}`,
      `  Due Date:      ${invoiceForm.dueDate}`,
      "",
      "  BILL TO:",
      `  Student:       ${invoiceForm.studentName}`,
      `  Student ID:    ${invoiceForm.studentId || "—"}`,
      `  Course:        ${invoiceForm.course}`,
      `  Institute:     ${invoiceForm.institute || "City Nursing College"}`,
      "",
      "────────────────────────────────────────────────────────────",
      "  # │ Description                          │ Amount (₹)   ",
      "────────────────────────────────────────────────────────────",
    ];

    invoiceForm.items.forEach((item, i) => {
      const num = String(i + 1).padStart(2, " ");
      const desc = (item.name || "—").padEnd(38, " ");
      const amt = `₹${item.amount.toLocaleString("en-IN")}`.padStart(12, " ");
      lines.push(`  ${num}│ ${desc}│${amt}`);
    });

    lines.push(
      "────────────────────────────────────────────────────────────",
      `                            Subtotal:  ₹${invoiceSubtotal.toLocaleString("en-IN")}`.padStart(58),
    );
    if (invoiceForm.discount > 0) {
      lines.push(`                            Discount:  -₹${invoiceForm.discount.toLocaleString("en-IN")}`.padStart(58));
    }
    lines.push(
      "────────────────────────────────────────────────────────────",
      `                            TOTAL:     ₹${invoiceTotal.toLocaleString("en-IN")}`.padStart(58),
      "════════════════════════════════════════════════════════════",
      "",
      "  Payment Modes: UPI / Card / NetBanking / Cash",
      "  UPI: collegefees@upi | A/C: 1234567890 (HDFC Bank)",
      "",
      "  Terms: Payment due within 30 days. Late fee of ₹500/month.",
      "",
      "  ___________________          ___________________",
      "    Student Signature             Authorized Sign  ",
      "",
      "════════════════════════════════════════════════════════════",
    );

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `Invoice_${invoiceNumber}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Invoice ${invoiceNumber} downloaded`);
  };

  const handlePrintInvoice = () => {
    if (!invoiceForm.studentName) return toast.error("Student name is required");
    setInvoicePreview(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Payments & Invoices</h1><p className="text-sm text-muted-foreground">UPI, Card, NetBanking payments with invoices & receipts</p></div>
        <button onClick={() => setPaymentModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><CreditCard className="w-4 h-4" /> Collect Payment</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="kpi-card flex items-center gap-3"><IndianRupee className="w-8 h-8 text-primary" /><div><p className="text-xl font-display font-bold text-foreground">₹{(totalCollected / 100000).toFixed(1)}L</p><p className="text-sm text-muted-foreground">Total Collected</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Receipt className="w-8 h-8 text-success" /><div><p className="text-xl font-display font-bold text-foreground">{receipts.length}</p><p className="text-sm text-muted-foreground">Receipts Generated</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Smartphone className="w-8 h-8 text-info" /><div><p className="text-xl font-display font-bold text-foreground">{installmentPlans.filter(p => p.autopay).length}</p><p className="text-sm text-muted-foreground">UPI Autopay Active</p></div></div>
        <div className="kpi-card flex items-center gap-3"><Calendar className="w-8 h-8 text-warning" /><div><p className="text-xl font-display font-bold text-foreground">{installmentPlans.reduce((a, b) => a + b.remaining, 0)}</p><p className="text-sm text-muted-foreground">EMIs Pending</p></div></div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "Pay Now" && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => { setForm({ ...form, mode: "UPI" }); setPaymentModal(true); }} className="bg-card rounded-xl border border-border/50 shadow-card p-6 hover:shadow-elevated transition-all text-left group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center"><Smartphone className="w-6 h-6 text-success" /></div>
                <div><h3 className="font-display font-semibold text-foreground">UPI Payment</h3><p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p></div>
              </div>
              <p className="text-sm text-muted-foreground">Instant payment via UPI ID or QR scan.</p>
              <div className="mt-4 text-primary text-sm font-medium group-hover:underline">Pay via UPI →</div>
            </button>
            <button onClick={() => { setForm({ ...form, mode: "Card" }); setPaymentModal(true); }} className="bg-card rounded-xl border border-border/50 shadow-card p-6 hover:shadow-elevated transition-all text-left group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center"><CreditCard className="w-6 h-6 text-info" /></div>
                <div><h3 className="font-display font-semibold text-foreground">Card Payment</h3><p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p></div>
              </div>
              <p className="text-sm text-muted-foreground">Debit or Credit card with 3D Secure.</p>
              <div className="mt-4 text-primary text-sm font-medium group-hover:underline">Pay via Card →</div>
            </button>
            <button onClick={() => { setForm({ ...form, mode: "NetBanking" }); setPaymentModal(true); }} className="bg-card rounded-xl border border-border/50 shadow-card p-6 hover:shadow-elevated transition-all text-left group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center"><IndianRupee className="w-6 h-6 text-warning" /></div>
                <div><h3 className="font-display font-semibold text-foreground">NetBanking</h3><p className="text-xs text-muted-foreground">All major banks supported</p></div>
              </div>
              <p className="text-sm text-muted-foreground">Direct bank transfer via internet banking.</p>
              <div className="mt-4 text-primary text-sm font-medium group-hover:underline">Pay via Bank →</div>
            </button>
          </div>
        </div>
      )}

      {activeTab === "Receipts" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Receipt</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Amount</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Mode</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Date</th>
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Txn ID</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Actions</th>
          </tr></thead><tbody>{receipts.map((r) => (
            <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-primary font-medium">{r.id}</td>
              <td className="py-3 px-4 font-medium text-foreground">{r.student}</td>
              <td className="py-3 px-4 text-right font-medium text-foreground">₹{r.amount.toLocaleString("en-IN")}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{r.mode}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{r.date}</td>
              <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{r.txnId}</td>
              <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success capitalize">{r.status}</span></td>
              <td className="py-3 px-4 text-right">
                <button onClick={() => handleDownloadReceipt(r)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground" title="Download Receipt"><Download className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "Installment Plans" && (
        <div className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Student</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Total Fee</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Plan</th>
            <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">EMI Amount</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Paid</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Remaining</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Next Due</th>
            <th className="text-center py-3 px-4 text-muted-foreground font-medium text-xs uppercase tracking-wider">Autopay</th>
          </tr></thead><tbody>{installmentPlans.map((p) => (
            <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{p.student}</td>
              <td className="py-3 px-4 text-right text-foreground">₹{p.totalFee.toLocaleString("en-IN")}</td>
              <td className="py-3 px-4 text-center text-muted-foreground">{p.plan}</td>
              <td className="py-3 px-4 text-right text-foreground">₹{p.emiAmount.toLocaleString("en-IN")}</td>
              <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">{p.paid}</span></td>
              <td className="py-3 px-4 text-center"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">{p.remaining}</span></td>
              <td className="py-3 px-4 text-center text-muted-foreground">{p.nextDue}</td>
              <td className="py-3 px-4 text-center">{p.autopay ? <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">Active</span> : <span className="text-xs text-muted-foreground">Off</span>}</td>
            </tr>
          ))}</tbody></table></div>
        </div>
      )}

      {activeTab === "Invoice Generator" && !invoicePreview && (
        <div className="animate-fade-in space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Student Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-muted-foreground block mb-1">Student Name *</label><input className={inputClass} placeholder="Full name" value={invoiceForm.studentName} onChange={e => setInvoiceForm({ ...invoiceForm, studentName: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground block mb-1">Student ID</label><input className={inputClass} placeholder="STU-001" value={invoiceForm.studentId} onChange={e => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-muted-foreground block mb-1">Course</label>
                  <select className={selectClass} value={invoiceForm.course} onChange={e => setInvoiceForm({ ...invoiceForm, course: e.target.value })}>
                    {["B.Sc Nursing", "GNM", "Physiotherapy", "PB.B.Sc", "M.Sc Nursing", "ANM", "OT Technology"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-muted-foreground block mb-1">Due Date</label><input className={inputClass} type="date" value={invoiceForm.dueDate} onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })} /></div>
              </div>

              <h3 className="text-sm font-semibold text-foreground pt-2">Fee Items</h3>
              <div className="space-y-2">
                {invoiceForm.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select className={selectClass + " flex-1"} value={item.name} onChange={e => updateInvoiceItem(i, "name", e.target.value)}>
                      <option value="">Select item</option>
                      {feeItems.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                      <option value="__custom">Custom item</option>
                    </select>
                    <input className={inputClass + " w-32"} type="number" placeholder="Amount" value={item.amount || ""} onChange={e => updateInvoiceItem(i, "amount", e.target.value)} />
                    {invoiceForm.items.length > 1 && (
                      <button onClick={() => removeInvoiceItem(i)} className="p-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors text-xs">✕</button>
                    )}
                  </div>
                ))}
                <button onClick={addInvoiceItem} className="text-xs text-primary font-medium hover:underline">+ Add Item</button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div><label className="text-xs text-muted-foreground block mb-1">Discount (₹)</label><input className={inputClass} type="number" placeholder="0" value={invoiceForm.discount || ""} onChange={e => setInvoiceForm({ ...invoiceForm, discount: Number(e.target.value) || 0 })} /></div>
                <div><label className="text-xs text-muted-foreground block mb-1">Institute</label><input className={inputClass} placeholder="City Nursing College" value={invoiceForm.institute} onChange={e => setInvoiceForm({ ...invoiceForm, institute: e.target.value })} /></div>
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="bg-card rounded-xl border border-border/50 shadow-card p-5 h-fit">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Invoice Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Invoice No</span><span className="font-mono text-xs text-foreground">{invoiceNumber}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Student</span><span className="text-foreground font-medium">{invoiceForm.studentName || "—"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Course</span><span className="text-foreground">{invoiceForm.course}</span></div>
              </div>
              <div className="border-t border-border/50 pt-3 space-y-1">
                {invoiceForm.items.filter(i => i.name).map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-foreground">₹{item.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/50 mt-3 pt-3 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">₹{invoiceSubtotal.toLocaleString("en-IN")}</span></div>
                {invoiceForm.discount > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span className="text-success">-₹{invoiceForm.discount.toLocaleString("en-IN")}</span></div>}
                <div className="flex justify-between text-sm font-bold"><span className="text-foreground">Total</span><span className="text-primary">₹{invoiceTotal.toLocaleString("en-IN")}</span></div>
              </div>
              <div className="mt-5 space-y-2">
                <button onClick={handlePrintInvoice} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"><Printer className="w-4 h-4" /> Preview Invoice</button>
                <button onClick={handleDownloadInvoice} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted"><Download className="w-4 h-4" /> Download Invoice</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Invoice Generator" && invoicePreview && (
        <div className="animate-fade-in">
          <button onClick={() => setInvoicePreview(false)} className="text-sm text-primary font-medium hover:underline mb-4 inline-block">← Back to editor</button>
          <div className="bg-white rounded-xl border border-border shadow-card p-8 max-w-2xl mx-auto text-black print:shadow-none">
            <div className="text-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold">{invoiceForm.institute || "City Nursing College"}</h2>
              <p className="text-xs text-gray-500 mt-1">123 Medical Road, Mumbai, MH 400001 | Ph: +91 22 2345 6789</p>
              <p className="text-xs text-gray-500">GST: 27XXXXX1234X1Z5</p>
            </div>
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Bill To</p>
                <p className="font-semibold">{invoiceForm.studentName}</p>
                <p className="text-sm text-gray-600">{invoiceForm.studentId}</p>
                <p className="text-sm text-gray-600">{invoiceForm.course}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Invoice</p>
                <p className="font-mono text-sm font-semibold">{invoiceNumber}</p>
                <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString("en-IN")}</p>
                <p className="text-sm text-gray-600">Due: {invoiceForm.dueDate}</p>
              </div>
            </div>
            <table className="w-full text-sm mb-6">
              <thead><tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 text-gray-500 text-xs uppercase">#</th>
                <th className="text-left py-2 text-gray-500 text-xs uppercase">Description</th>
                <th className="text-right py-2 text-gray-500 text-xs uppercase">Amount (₹)</th>
              </tr></thead>
              <tbody>{invoiceForm.items.filter(i => i.name).map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 text-gray-500">{i + 1}</td>
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-right">₹{item.amount.toLocaleString("en-IN")}</td>
                </tr>
              ))}</tbody>
            </table>
            <div className="flex justify-end">
              <div className="w-60 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>₹{invoiceSubtotal.toLocaleString("en-IN")}</span></div>
                {invoiceForm.discount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span className="text-green-600">-₹{invoiceForm.discount.toLocaleString("en-IN")}</span></div>}
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total</span><span>₹{invoiceTotal.toLocaleString("en-IN")}</span></div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t text-xs text-gray-400 text-center">
              <p>Payment Modes: UPI / Card / NetBanking / Cash | UPI: collegefees@upi</p>
              <p className="mt-1">Terms: Payment due within 30 days. Late fee ₹500/month applies.</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      <FormModal open={paymentModal} onClose={() => setPaymentModal(false)} title={`Pay via ${form.mode}`} onSubmit={handlePay} submitLabel="Pay with Razorpay">
        <div className="flex items-center gap-2 p-3 bg-info/10 rounded-lg border border-info/20 mb-2">
          <CreditCard className="w-4 h-4 text-info shrink-0" />
          <p className="text-xs text-info">This is a <strong>demo simulation</strong> of Razorpay payment gateway.</p>
        </div>
        <FormField label="Student Name" required><input className={inputClass} placeholder="Student name" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Amount (₹)" required><input className={inputClass} type="number" placeholder="85000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></FormField>
          <FormField label="Invoice (optional)"><input className={inputClass} placeholder="INV-2025-001" value={form.invoice} onChange={(e) => setForm({ ...form, invoice: e.target.value })} /></FormField>
        </div>
        <FormField label="Payment Mode">
          <select className={selectClass} value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
            {["UPI", "Card", "NetBanking"].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </FormField>
      </FormModal>

      {/* Processing Modal */}
      {processingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl border border-border/50 shadow-elevated p-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CreditCard className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground text-lg mb-2">Processing Payment...</h3>
            <p className="text-sm text-muted-foreground">Connecting to Razorpay gateway. Please wait.</p>
            <div className="mt-4 flex justify-center"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal && lastPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-2xl border border-border/50 shadow-elevated p-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-display font-bold text-foreground text-lg mb-1">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground mb-4">₹{lastPayment.amount.toLocaleString("en-IN")} via {lastPayment.mode}</p>
            <div className="bg-muted/50 rounded-lg p-3 text-left text-sm space-y-1 mb-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Student</span><span className="font-medium text-foreground">{lastPayment.student}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Txn ID</span><span className="font-mono text-xs text-foreground">{lastPayment.txnId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><span className="text-foreground">{lastPayment.mode}</span></div>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 bg-muted/30 rounded-lg mb-4">
              <QrCode className="w-12 h-12 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">QR Code for verification</p>
            </div>
            <button onClick={() => setSuccessModal(false)} className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
