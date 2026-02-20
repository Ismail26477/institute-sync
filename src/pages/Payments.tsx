import { useState } from "react";
import { CreditCard, IndianRupee, QrCode, Smartphone, Download, CheckCircle2, X, Receipt, Calendar } from "lucide-react";
import FormModal, { FormField, inputClass, selectClass } from "@/components/FormModal";
import { toast } from "sonner";

const tabs = ["Pay Now", "Receipts", "Installment Plans"];

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

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("Pay Now");
  const [receipts, setReceipts] = useState(initialReceipts);
  const [paymentModal, setPaymentModal] = useState(false);
  const [processingModal, setProcessingModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [lastPayment, setLastPayment] = useState<{ student: string; amount: number; mode: string; txnId: string } | null>(null);
  const [form, setForm] = useState({ student: "", amount: "", mode: "UPI", invoice: "" });

  const totalCollected = receipts.reduce((a, b) => a + b.amount, 0);

  const handlePay = () => {
    if (!form.student || !form.amount) return toast.error("Student and amount are required");
    setPaymentModal(false);
    setProcessingModal(true);

    // Simulate Razorpay processing
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
      "        EduManage College CMS          ",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl font-display font-bold text-foreground">Payments (Razorpay)</h1><p className="text-sm text-muted-foreground">UPI, Card, NetBanking payments with auto receipts</p></div>
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
            {/* UPI */}
            <button onClick={() => { setForm({ ...form, mode: "UPI" }); setPaymentModal(true); }} className="bg-card rounded-xl border border-border/50 shadow-card p-6 hover:shadow-elevated transition-all text-left group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center"><Smartphone className="w-6 h-6 text-success" /></div>
                <div><h3 className="font-display font-semibold text-foreground">UPI Payment</h3><p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</p></div>
              </div>
              <p className="text-sm text-muted-foreground">Instant payment via UPI ID or QR scan. Most popular payment method.</p>
              <div className="mt-4 text-primary text-sm font-medium group-hover:underline">Pay via UPI →</div>
            </button>
            {/* Card */}
            <button onClick={() => { setForm({ ...form, mode: "Card" }); setPaymentModal(true); }} className="bg-card rounded-xl border border-border/50 shadow-card p-6 hover:shadow-elevated transition-all text-left group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center"><CreditCard className="w-6 h-6 text-info" /></div>
                <div><h3 className="font-display font-semibold text-foreground">Card Payment</h3><p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p></div>
              </div>
              <p className="text-sm text-muted-foreground">Debit or Credit card payment with 3D Secure authentication.</p>
              <div className="mt-4 text-primary text-sm font-medium group-hover:underline">Pay via Card →</div>
            </button>
            {/* NetBanking */}
            <button onClick={() => { setForm({ ...form, mode: "NetBanking" }); setPaymentModal(true); }} className="bg-card rounded-xl border border-border/50 shadow-card p-6 hover:shadow-elevated transition-all text-left group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center"><IndianRupee className="w-6 h-6 text-warning" /></div>
                <div><h3 className="font-display font-semibold text-foreground">NetBanking</h3><p className="text-xs text-muted-foreground">All major banks supported</p></div>
              </div>
              <p className="text-sm text-muted-foreground">Direct bank transfer via internet banking. NEFT/RTGS supported.</p>
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

      {/* Payment Form Modal */}
      <FormModal open={paymentModal} onClose={() => setPaymentModal(false)} title={`Pay via ${form.mode}`} onSubmit={handlePay} submitLabel={`Pay with Razorpay`}>
        <div className="flex items-center gap-2 p-3 bg-info/10 rounded-lg border border-info/20 mb-2">
          <CreditCard className="w-4 h-4 text-info shrink-0" />
          <p className="text-xs text-info">This is a <strong>demo simulation</strong> of Razorpay payment gateway. No real money will be charged.</p>
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
