import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Shield,
  AlertTriangle,
  Users,
  WifiOff,
  RefreshCw,
  Search,
  Download,
  Database,
  Briefcase,
} from "lucide-react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ─── Campus config ───
const CAMPUS = {
  name: "EduManage Main Campus",
  lat: 28.6139,
  lng: 77.209,
  radius: 500,
};

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDirection(lat: number, lng: number): string {
  const dLat = lat - CAMPUS.lat;
  const dLng = lng - CAMPUS.lng;
  const ns = dLat > 0 ? "North" : "South";
  const ew = dLng > 0 ? "East" : "West";
  if (Math.abs(dLat) < 0.0005) return ew;
  if (Math.abs(dLng) < 0.0005) return ns;
  return `${ns}-${ew}`;
}

type PersonStatus = "inside" | "outside" | "offline";
type PersonType = "student" | "faculty";

interface TrackedPerson {
  id: string;
  name: string;
  rollNo: string;
  institute: string;
  lat: number;
  lng: number;
  status: PersonStatus;
  distance: number;
  lastSeen: string;
  battery: number;
  type: PersonType;
}

interface BoundaryAlert {
  id: string;
  studentName: string;
  studentId: string;
  rollNo: string;
  type: "exit" | "entry";
  time: string;
  distance: number;
  direction: string;
}

function generatePeople(): TrackedPerson[] {
  const studentNames = [
    "Aarav Sharma", "Priya Patel", "Rohan Gupta", "Sneha Reddy", "Vikram Singh",
    "Ananya Das", "Karthik Nair", "Meera Joshi", "Arjun Kumar", "Divya Menon",
    "Rahul Verma", "Pooja Iyer", "Siddharth Rao", "Neha Agarwal", "Amit Chauhan",
    "Kavya Pillai", "Deepak Tiwari", "Riya Banerjee", "Manish Yadav", "Swati Mishra",
    "Nikhil Saxena", "Tanvi Kapoor", "Rajesh Pandey", "Ishita Dhawan", "Suresh Patil",
  ];
  const facultyNames = [
    "Dr. Meena Sharma", "Prof. Anil Deshmukh", "Dr. Ravi Kumar", "Dr. Anjali Desai",
    "Dr. Sharma", "Prof. Sunita Rao", "Dr. Patil",
  ];
  const institutes = ["B.Sc Nursing", "GNM", "Physiotherapy", "PB.B.Sc", "M.Sc Nursing", "ANM"];
  const departments = ["Nursing", "Nursing", "Biochemistry", "Microbiology", "Pharmacology", "Nursing", "Community Health"];

  const makePerson = (name: string, i: number, type: PersonType): TrackedPerson => {
    const isOffline = Math.random() < 0.1;
    const isOutside = !isOffline && Math.random() < (type === "faculty" ? 0.1 : 0.15);

    const angle = Math.random() * 2 * Math.PI;
    const dist = isOutside
      ? CAMPUS.radius + 100 + Math.random() * 800
      : Math.random() * CAMPUS.radius * 0.85;
    const latOff = (dist * Math.cos(angle)) / 111320;
    const lngOff = (dist * Math.sin(angle)) / (111320 * Math.cos((CAMPUS.lat * Math.PI) / 180));

    const lat = CAMPUS.lat + latOff;
    const lng = CAMPUS.lng + lngOff;
    const actualDist = haversineDistance(CAMPUS.lat, CAMPUS.lng, lat, lng);
    const status: PersonStatus = isOffline ? "offline" : actualDist > CAMPUS.radius ? "outside" : "inside";
    const minsAgo = isOffline ? 5 + Math.floor(Math.random() * 55) : Math.floor(Math.random() * 2);

    const prefix = type === "faculty" ? "FAC" : "STU";
    const label = type === "faculty" ? departments[i % departments.length] : institutes[i % institutes.length];
    const rollNo = type === "faculty"
      ? `FAC${2020 + (i % 3)}${String(i + 1).padStart(3, "0")}`
      : `${institutes[i % institutes.length].substring(0, 3).toUpperCase()}${2023 + Math.floor(i / 6)}${String((i % 60) + 1).padStart(3, "0")}`;

    return {
      id: `${prefix}-${String(i + 1).padStart(4, "0")}`,
      name,
      rollNo,
      institute: label,
      lat, lng, status,
      distance: Math.round(actualDist),
      lastSeen: `${minsAgo}m ago`,
      battery: 15 + Math.floor(Math.random() * 80),
      type,
    };
  };

  return [
    ...studentNames.map((n, i) => makePerson(n, i, "student")),
    ...facultyNames.map((n, i) => makePerson(n, i, "faculty")),
  ];
}

// Custom marker icons
function makeIcon(color: string, size = 12) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const studentInsideIcon = makeIcon("#22c55e");
const studentOutsideIcon = makeIcon("#ef4444");
const facultyInsideIcon = makeIcon("#3b82f6", 14);
const facultyOutsideIcon = makeIcon("#f97316", 14);

function FitBounds({ people }: { people: TrackedPerson[] }) {
  const map = useMap();
  useEffect(() => {
    const pts: L.LatLngExpression[] = [
      [CAMPUS.lat, CAMPUS.lng],
      ...people.filter((s) => s.status !== "offline").map((s) => [s.lat, s.lng] as [number, number]),
    ];
    if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [40, 40] });
  }, []);
  return null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const GPSTrackingPage = () => {
  const [people, setPeople] = useState<TrackedPerson[]>(generatePeople);
  const [alerts, setAlerts] = useState<BoundaryAlert[]>([]);
  const [filter, setFilter] = useState<"all" | PersonStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | PersonType>("all");
  const [search, setSearch] = useState("");
  const [pollCount, setPollCount] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [persisting, setPersisting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    const { data, error } = await supabase
      .from("boundary_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data && !error) {
      setAlerts(data.map((a) => ({
        id: a.id,
        studentName: a.student_name,
        studentId: a.student_id,
        rollNo: a.student_id,
        type: a.alert_type as "exit" | "entry",
        time: timeAgo(a.created_at),
        distance: a.distance,
        direction: a.direction,
      })));
    }
  };

  const persistData = async (personList: TrackedPerson[]) => {
    setPersisting(true);
    try {
      const students = personList.filter((p) => p.type === "student");
      const faculty = personList.filter((p) => p.type === "faculty");

      // Persist student locations
      const studentRows = students.map((s) => ({
        student_id: s.id, student_name: s.name,
        latitude: s.lat, longitude: s.lng,
        distance_from_campus: s.distance, status: s.status,
      }));
      await supabase.from("student_locations").insert(studentRows);

      // Persist faculty locations
      const facultyRows = faculty.map((f) => ({
        faculty_id: f.id, faculty_name: f.name, department: f.institute,
        latitude: f.lat, longitude: f.lng,
        distance_from_campus: f.distance, status: f.status,
      }));
      await supabase.from("faculty_locations").insert(facultyRows);

      // Auto-mark faculty attendance for those inside campus
      const today = new Date().toISOString().split("T")[0];
      const insideFaculty = faculty.filter((f) => f.status === "inside");
      for (const f of insideFaculty) {
        await supabase.from("faculty_attendance").upsert({
          faculty_id: f.id,
          faculty_name: f.name,
          department: f.institute,
          date: today,
          status: "present",
          punch_in: new Date().toISOString(),
          auto_detected: true,
        }, { onConflict: "faculty_id,date" });
      }

      // Boundary alerts for outside people
      const outsidePeople = personList.filter((p) => p.status === "outside");
      if (outsidePeople.length > 0) {
        const alertRows = outsidePeople.map((p) => ({
          student_id: p.id, student_name: `${p.type === "faculty" ? "🎓 " : ""}${p.name}`,
          alert_type: "exit" as const,
          latitude: p.lat, longitude: p.lng,
          distance: p.distance, direction: getDirection(p.lat, p.lng),
        }));
        await supabase.from("boundary_alerts").insert(alertRows);
      }

      await loadAlerts();

      toast({
        title: "Data synced to Cloud",
        description: `${studentRows.length} students + ${facultyRows.length} faculty synced`,
      });
    } catch (err) {
      console.error("Persist error:", err);
    } finally {
      setPersisting(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newPeople = generatePeople();
      setPeople(newPeople);
      setPollCount((c) => c + 1);
      setLastRefresh(new Date());
      persistData(newPeople);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const manualRefresh = useCallback(() => {
    const newPeople = generatePeople();
    setPeople(newPeople);
    setPollCount((c) => c + 1);
    setLastRefresh(new Date());
    persistData(newPeople);
  }, []);

  const students = people.filter((p) => p.type === "student");
  const faculty = people.filter((p) => p.type === "faculty");

  const studentInside = students.filter((s) => s.status === "inside").length;
  const studentOutside = students.filter((s) => s.status === "outside").length;
  const facultyInside = faculty.filter((f) => f.status === "inside").length;
  const facultyOutside = faculty.filter((f) => f.status === "outside").length;
  const totalOffline = people.filter((p) => p.status === "offline").length;

  const filtered = people.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.rollNo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">GPS Tracking</h1>
          <p className="text-sm text-muted-foreground">
            Students & Faculty · Geofence {CAMPUS.radius}m · Poll #{pollCount} · {lastRefresh.toLocaleTimeString()}
            {persisting && <span className="ml-2 text-primary">⟳ Syncing…</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={manualRefresh} disabled={persisting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${persisting ? "animate-spin" : ""}`} /> Refresh & Sync
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Export Log
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Students Inside", value: studentInside, icon: Shield, color: "bg-success/15 text-success" },
          { label: "Students Outside", value: studentOutside, icon: AlertTriangle, color: "bg-destructive/15 text-destructive" },
          { label: "Faculty Inside", value: facultyInside, icon: Briefcase, color: "bg-info/15 text-info" },
          { label: "Faculty Outside", value: facultyOutside, icon: AlertTriangle, color: "bg-warning/15 text-warning" },
          { label: "Total Tracked", value: people.length, icon: Users, color: "bg-primary/15 text-primary" },
          { label: "Offline / Lost", value: totalOffline, icon: WifiOff, color: "bg-muted text-muted-foreground" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl border border-border/50 p-3 shadow-card flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${kpi.color}`}>
              <kpi.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud sync indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg w-fit">
        <Database className="w-3.5 h-3.5 text-primary" />
        <span>Location history & faculty attendance auto-synced to Cloud · {alerts.length} alerts logged</span>
      </div>

      {/* Map + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Live Campus Map
            </h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Student In</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" /> Student Out</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-info inline-block" /> Faculty In</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-warning inline-block" /> Faculty Out</span>
            </div>
          </div>
          <div className="h-[480px]">
            <MapContainer center={[CAMPUS.lat, CAMPUS.lng]} zoom={15} className="h-full w-full z-0" zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              <Circle center={[CAMPUS.lat, CAMPUS.lng]} radius={CAMPUS.radius}
                pathOptions={{ color: "hsl(var(--primary))", fillColor: "hsl(var(--primary))", fillOpacity: 0.08, weight: 2, dashArray: "8 4" }} />
              {people.filter((p) => p.status !== "offline").map((p) => (
                <Marker key={p.id} position={[p.lat, p.lng]}
                  icon={p.type === "faculty"
                    ? (p.status === "inside" ? facultyInsideIcon : facultyOutsideIcon)
                    : (p.status === "inside" ? studentInsideIcon : studentOutsideIcon)
                  }>
                  <Popup>
                    <div className="text-xs">
                      <p className="font-bold">{p.type === "faculty" ? "🎓 " : ""}{p.name}</p>
                      <p>{p.rollNo} · {p.institute}</p>
                      <p className="mt-1">{p.status === "inside" ? "✅ Inside" : "🚨 Outside"} — {p.distance}m</p>
                      <p>🔋 {p.battery}% · {p.lastSeen}</p>
                      <p className="mt-0.5 font-medium text-[10px] uppercase">{p.type}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <FitBounds people={people} />
            </MapContainer>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card rounded-xl border border-border/50 shadow-card flex flex-col">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> Boundary Alerts
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{alerts.filter((a) => a.type === "exit").length} exits · from Cloud</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[430px]">
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No alerts yet. Click "Refresh & Sync".</p>
            ) : alerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border text-sm ${alert.type === "exit" ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-success/10 border-success/20 text-success"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{alert.studentName}</span>
                  <span className="text-[10px] opacity-70">{alert.time}</span>
                </div>
                <p className="text-xs opacity-80 mt-0.5">{alert.type === "exit" ? "⚠️ Left campus" : "✅ Returned"} · {alert.distance}m · {alert.direction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* People Table */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-display font-semibold text-foreground">All Tracked People</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 text-sm">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-36" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
              <option value="all">All Types</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
            </select>
            <select className="text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
              <option value="all">All Status</option>
              <option value="inside">Inside</option>
              <option value="outside">Outside</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">ID</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Dept/Institute</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Distance</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Battery</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${p.type === "faculty" ? "bg-info/15 text-info" : "bg-primary/15 text-primary"}`}>
                      {p.type === "faculty" ? "🎓 Faculty" : "👤 Student"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.rollNo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.institute}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${p.status === "inside" ? "bg-success/15 text-success" : p.status === "outside" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === "inside" ? "bg-success" : p.status === "outside" ? "bg-destructive" : "bg-muted-foreground"}`} />
                      {p.status === "inside" ? "Inside" : p.status === "outside" ? "Outside" : "Offline"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.distance}m</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${p.battery < 20 ? "text-destructive" : p.battery < 50 ? "text-warning" : "text-success"}`}>🔋 {p.battery}%</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border/50 text-xs text-muted-foreground text-center">
          {filtered.length} of {people.length} people ({students.length} students + {faculty.length} faculty) · Auto-refresh 30s · ☁️ Cloud synced
        </div>
      </div>
    </div>
  );
};

export default GPSTrackingPage;
