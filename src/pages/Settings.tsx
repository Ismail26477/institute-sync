import { useState } from "react";
import { Settings as SettingsIcon, Building2, CreditCard, Bell, Shield, Database, Globe, Save } from "lucide-react";

const tabs = ["General", "Payment Gateway", "Notifications", "Security", "Integrations"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">System configuration and integrations</p>
        </div>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === "General" && (
        <div className="space-y-4 animate-fade-in max-w-2xl">
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> Organization Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Organization Name</label><input type="text" defaultValue="EduManage College Group" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Short Code</label><input type="text" defaultValue="EMCG" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Email</label><input type="email" defaultValue="admin@edumanage.in" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Phone</label><input type="tel" defaultValue="+91 98765 43210" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
              <div className="sm:col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Address</label><textarea defaultValue="123 Education Lane, Knowledge City, Maharashtra 411001" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none resize-none h-20" /></div>
            </div>
            <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"><Save className="w-4 h-4" /> Save Changes</button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Localization</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"><option>Asia/Kolkata (IST)</option></select>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Currency</label>
                <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"><option>INR (₹)</option></select>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Date Format</label>
                <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Language</label>
                <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"><option>English</option><option>Hindi</option></select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Database className="w-5 h-5 text-primary" /> Academic Year</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Current Academic Year</label>
                <select className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"><option>2025-26</option><option>2024-25</option></select>
              </div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Year Start</label><input type="date" defaultValue="2025-07-01" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Payment Gateway" && (
        <div className="space-y-4 animate-fade-in max-w-2xl">
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment Gateway Configuration</h3>
            {[
              { name: "Razorpay", status: "active", desc: "UPI, Cards, NetBanking" },
              { name: "PhonePe", status: "inactive", desc: "UPI Autopay for installments" },
              { name: "PayU", status: "inactive", desc: "Alternative gateway" },
            ].map((gw) => (
              <div key={gw.name} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                <div>
                  <p className="font-medium text-foreground">{gw.name}</p>
                  <p className="text-xs text-muted-foreground">{gw.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${gw.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{gw.status}</span>
                  <button className="text-xs text-primary font-medium hover:underline">Configure</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">GST Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">GST Number</label><input type="text" defaultValue="27AABCE1234F1Z5" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">HSN/SAC Code</label><input type="text" defaultValue="999293" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Notifications" && (
        <div className="space-y-4 animate-fade-in max-w-2xl">
          {[
            { name: "Email (Amazon SES)", fields: ["SMTP Host", "Port", "API Key"], status: "active" },
            { name: "SMS/WhatsApp (MSG91)", fields: ["API Key", "Sender ID"], status: "active" },
            { name: "Push (FCM)", fields: ["Server Key", "Project ID"], status: "active" },
          ].map((provider) => (
            <div key={provider.name} className="bg-card rounded-xl border border-border/50 shadow-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Bell className="w-5 h-5 text-primary" />{provider.name}</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">{provider.status}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {provider.fields.map((field) => (
                  <div key={field}><label className="block text-sm font-medium text-foreground mb-1">{field}</label><input type="password" defaultValue="••••••••••" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">Quiet Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-foreground mb-1">Start</label><input type="time" defaultValue="22:00" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">End</label><input type="time" defaultValue="07:00" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Security" && (
        <div className="space-y-4 animate-fade-in max-w-2xl">
          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Authentication</h3>
            {[
              { name: "Multi-Factor Authentication (MFA)", desc: "Require TOTP for admin users", enabled: true },
              { name: "Passwordless OTP Login", desc: "Allow phone + OTP login for students", enabled: true },
              { name: "SSO / OAuth2", desc: "Enable SSO for institutional login", enabled: false },
              { name: "IP Allowlisting", desc: "Restrict finance module to specific IPs", enabled: false },
            ].map((setting) => (
              <div key={setting.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <p className="text-sm font-medium text-foreground">{setting.name}</p>
                  <p className="text-xs text-muted-foreground">{setting.desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${setting.enabled ? "bg-primary" : "bg-border"}`}>
                  <div className={`w-4 h-4 rounded-full bg-card absolute top-1 transition-all ${setting.enabled ? "left-5" : "left-1"}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl border border-border/50 shadow-card p-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">Session Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-foreground mb-1">Session Timeout (minutes)</label><input type="number" defaultValue="30" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Max Concurrent Sessions</label><input type="number" defaultValue="3" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" /></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Integrations" && (
        <div className="space-y-4 animate-fade-in max-w-2xl">
          {[
            { name: "RFID/Barcode Scanner", desc: "Library and attendance devices", status: "connected", type: "Hardware" },
            { name: "ZKTeco Biometric", desc: "Attendance terminals", status: "connected", type: "Hardware" },
            { name: "eSign (eMudhra)", desc: "Document e-signing", status: "disconnected", type: "Software" },
            { name: "KOHA Library", desc: "Optional data import from KOHA", status: "disconnected", type: "Software" },
            { name: "Google Classroom", desc: "LMS integration", status: "disconnected", type: "Software" },
          ].map((int) => (
            <div key={int.name} className="bg-card rounded-xl border border-border/50 shadow-card p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-foreground">{int.name}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{int.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">{int.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${int.status === "connected" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{int.status}</span>
                <button className="text-xs text-primary font-medium hover:underline">{int.status === "connected" ? "Configure" : "Connect"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
