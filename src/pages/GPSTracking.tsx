import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Shield,
  AlertTriangle,
  Users,
  Wifi,
  WifiOff,
  RefreshCw,
  Search,
  Download,
  ChevronDown,
} from "lucide-react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Campus config ───
const CAMPUS = {
  name: "EduManage Main Campus",
  lat: 28.6139,
  lng: 77.209,
  radius: 500, // meters
};

// Haversine formula
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type StudentStatus = "inside" | "outside" | "offline";

interface TrackedStudent {
  id: string;
  name: string;
  rollNo: string;
  institute: string;
  lat: number;
  lng: number;
  status: StudentStatus;
  distance: number;
  lastSeen: string;
  battery: number;
}

interface BoundaryAlert {
  id: number;
  studentName: string;
  rollNo: string;
  type: "exit" | "entry";
  time: string;
  distance: number;
  direction: string;
}

// Generate realistic mock students around campus
function generateStudents(): TrackedStudent[] {
  const names = [
    "Aarav Sharma", "Priya Patel", "Rohan Gupta", "Sneha Reddy", "Vikram Singh",
    "Ananya Das", "Karthik Nair", "Meera Joshi", "Arjun Kumar", "Divya Menon",
    "Rahul Verma", "Pooja Iyer", "Siddharth Rao", "Neha Agarwal", "Amit Chauhan",
    "Kavya Pillai", "Deepak Tiwari", "Riya Banerjee", "Manish Yadav", "Swati Mishra",
    "Nikhil Saxena", "Tanvi Kapoor", "Rajesh Pandey", "Ishita Dhawan", "Suresh Patil",
  ];
  const institutes = ["B.Sc Nursing", "GNM", "Physiotherapy", "PB.B.Sc", "M.Sc Nursing", "ANM"];

  return names.map((name, i) => {
    const isOffline = Math.random() < 0.12;
    const isOutside = !isOffline && Math.random() < 0.15;

    // scatter inside or outside
    const angle = Math.random() * 2 * Math.PI;
    const dist = isOutside
      ? CAMPUS.radius + 100 + Math.random() * 800
      : Math.random() * CAMPUS.radius * 0.85;
    const latOff = (dist * Math.cos(angle)) / 111320;
    const lngOff = (dist * Math.sin(angle)) / (111320 * Math.cos((CAMPUS.lat * Math.PI) / 180));

    const lat = CAMPUS.lat + latOff;
    const lng = CAMPUS.lng + lngOff;
    const actualDist = haversineDistance(CAMPUS.lat, CAMPUS.lng, lat, lng);

    const status: StudentStatus = isOffline ? "offline" : actualDist > CAMPUS.radius ? "outside" : "inside";
    const minsAgo = isOffline ? 5 + Math.floor(Math.random() * 55) : Math.floor(Math.random() * 2);

    return {
      id: `STU-${String(i + 1).padStart(4, "0")}`,
      name,
      rollNo: `${institutes[i % institutes.length].substring(0, 3).toUpperCase()}${2023 + Math.floor(i / 6)}${String((i % 60) + 1).padStart(3, "0")}`,
      institute: institutes[i % institutes.length],
      lat,
      lng,
      status,
      distance: Math.round(actualDist),
      lastSeen: `${minsAgo}m ago`,
      battery: 15 + Math.floor(Math.random() * 80),
    };
  });
}

function generateAlerts(): BoundaryAlert[] {
  return [
    { id: 1, studentName: "Vikram Singh", rollNo: "PHY2023005", type: "exit", time: "2 min ago", distance: 620, direction: "North-East" },
    { id: 2, studentName: "Neha Agarwal", rollNo: "PBB2024014", type: "exit", time: "8 min ago", distance: 890, direction: "South" },
    { id: 3, studentName: "Rajesh Pandey", rollNo: "GNM2024023", type: "entry", time: "12 min ago", distance: 340, direction: "West" },
    { id: 4, studentName: "Manish Yadav", rollNo: "ANM2023019", type: "exit", time: "18 min ago", distance: 1100, direction: "South-West" },
    { id: 5, studentName: "Tanvi Kapoor", rollNo: "BSC2024022", type: "entry", time: "25 min ago", distance: 210, direction: "East" },
    { id: 6, studentName: "Suresh Patil", rollNo: "MSC2024025", type: "exit", time: "31 min ago", distance: 750, direction: "North" },
  ];
}

// Custom marker icons
function makeIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

const insideIcon = makeIcon("#22c55e");
const outsideIcon = makeIcon("#ef4444");
const offlineIcon = makeIcon("#94a3b8");

// Auto-fit map bounds
function FitBounds({ students }: { students: TrackedStudent[] }) {
  const map = useMap();
  useEffect(() => {
    const pts: L.LatLngExpression[] = [
      [CAMPUS.lat, CAMPUS.lng],
      ...students.filter((s) => s.status !== "offline").map((s) => [s.lat, s.lng] as [number, number]),
    ];
    if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [40, 40] });
  }, []);
  return null;
}

const GPSTrackingPage = () => {
  const [students, setStudents] = useState<TrackedStudent[]>(generateStudents);
  const [alerts] = useState<BoundaryAlert[]>(generateAlerts);
  const [filter, setFilter] = useState<"all" | StudentStatus>("all");
  const [search, setSearch] = useState("");
  const [pollCount, setPollCount] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-poll every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setStudents(generateStudents());
      setPollCount((c) => c + 1);
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const manualRefresh = useCallback(() => {
    setStudents(generateStudents());
    setPollCount((c) => c + 1);
    setLastRefresh(new Date());
  }, []);

  const insideCount = students.filter((s) => s.status === "inside").length;
  const outsideCount = students.filter((s) => s.status === "outside").length;
  const offlineCount = students.filter((s) => s.status === "offline").length;

  const filtered = students.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.rollNo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">GPS Tracking</h1>
          <p className="text-sm text-muted-foreground">
            Real-time student location · Geofence radius {CAMPUS.radius}m · Poll #{pollCount} · Last: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={manualRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Now
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Export Log
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Tracked", value: students.length, icon: Users, color: "bg-primary/15 text-primary" },
          { label: "Inside Campus", value: insideCount, icon: Shield, color: "bg-success/15 text-success" },
          { label: "Outside Campus", value: outsideCount, icon: AlertTriangle, color: "bg-destructive/15 text-destructive" },
          { label: "Offline / Lost", value: offlineCount, icon: WifiOff, color: "bg-muted text-muted-foreground" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card rounded-xl border border-border/50 p-4 shadow-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: Map + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 shadow-card overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Live Campus Map
            </h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Inside</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" /> Outside</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-muted-foreground inline-block" /> Offline</span>
            </div>
          </div>
          <div className="h-[480px]">
            <MapContainer
              center={[CAMPUS.lat, CAMPUS.lng]}
              zoom={15}
              className="h-full w-full z-0"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              {/* Geofence */}
              <Circle
                center={[CAMPUS.lat, CAMPUS.lng]}
                radius={CAMPUS.radius}
                pathOptions={{
                  color: "hsl(var(--primary))",
                  fillColor: "hsl(var(--primary))",
                  fillOpacity: 0.08,
                  weight: 2,
                  dashArray: "8 4",
                }}
              />
              {/* Student markers */}
              {students
                .filter((s) => s.status !== "offline")
                .map((s) => (
                  <Marker
                    key={s.id}
                    position={[s.lat, s.lng]}
                    icon={s.status === "inside" ? insideIcon : outsideIcon}
                  >
                    <Popup>
                      <div className="text-xs">
                        <p className="font-bold">{s.name}</p>
                        <p>{s.rollNo} · {s.institute}</p>
                        <p className="mt-1">
                          {s.status === "inside" ? "✅ Inside" : "🚨 Outside"} — {s.distance}m from center
                        </p>
                        <p>🔋 {s.battery}% · Last seen {s.lastSeen}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              <FitBounds students={students} />
            </MapContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-card rounded-xl border border-border/50 shadow-card flex flex-col">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> Boundary Alerts
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{alerts.filter(a => a.type === 'exit').length} exits detected today</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border text-sm ${
                  alert.type === "exit"
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-success/10 border-success/20 text-success"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{alert.studentName}</span>
                  <span className="text-[10px] opacity-70">{alert.time}</span>
                </div>
                <p className="text-xs opacity-80 mt-0.5">
                  {alert.type === "exit" ? "⚠️ Left campus" : "✅ Returned to campus"} · {alert.distance}m · {alert.direction}
                </p>
                <p className="text-[10px] opacity-60 mt-0.5">{alert.rollNo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-card rounded-xl border border-border/50 shadow-card">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-display font-semibold text-foreground">Student Locations</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 text-sm">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-40"
                placeholder="Search student…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
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
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Student</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Roll No</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Institute</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Distance</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Battery</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{s.rollNo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.institute}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        s.status === "inside"
                          ? "bg-success/15 text-success"
                          : s.status === "outside"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        s.status === "inside" ? "bg-success" : s.status === "outside" ? "bg-destructive" : "bg-muted-foreground"
                      }`} />
                      {s.status === "inside" ? "Inside" : s.status === "outside" ? "Outside" : "Offline"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.distance}m</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${s.battery < 20 ? "text-destructive" : s.battery < 50 ? "text-warning" : "text-success"}`}>
                      🔋 {s.battery}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{s.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border/50 text-xs text-muted-foreground text-center">
          Showing {filtered.length} of {students.length} students · Auto-refresh every 30s · Geofence: {CAMPUS.radius}m radius
        </div>
      </div>
    </div>
  );
};

export default GPSTrackingPage;
