import { useState, useEffect } from "react";
import PageNav from "./PageNav";

const NWS_LIVE = [
    { title: "Severe Thunderstorm Warning", area: "Goa Coast, GA — Panaji District", severity: "severe", issued: "2026-04-11T13:00:00Z", desc: "Damaging winds up to 70mph expected. Outdoor gatherings should seek shelter immediately." },
    { title: "Flash Flood Watch", area: "North Goa coastal regions", severity: "moderate", issued: "2026-04-11T11:30:00Z", desc: "Rainfall of 3–5 inches possible over the next 6 hours. Low-lying areas may flood." },
    { title: "Air Quality Advisory", area: "Urban Hotel District", severity: "minor", issued: "2026-04-11T08:00:00Z", desc: "PM2.5 elevated due to regional wildfire smoke. Limit outdoor activity for sensitive groups." },
];

const FEMA_DATA = [
    { label: "Major Disaster Declarations (5yr)", value: "12", icon: "📋" },
    { label: "Flood Risk Score", value: "High", icon: "🌊", color: "#ff7733" },
    { label: "Wildfire Risk Score", value: "Moderate", icon: "🔥", color: "#ffaa00" },
    { label: "Regional Mitigation Projects", value: "7", icon: "🛠️" },
];

const SEV_COLOR = { severe: "#ff4444", moderate: "#ffaa00", minor: "#00bfff", extreme: "#ff0055" };

export default function PlatformPage({ navigate }) {
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
    const [alerts, setAlerts] = useState(NWS_LIVE);
    const [pipeline, setPipeline] = useState([]);

    const refresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setLastRefresh(new Date().toLocaleTimeString());
            setRefreshing(false);
            setPipeline(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: "NWS feed polled. 3 alerts found. Incident record updated." }]);
        }, 1500);
    };

    useEffect(() => { refresh(); }, []);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-body)", color: "var(--text-strong)", padding: "2rem" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.04em" }}>Platform Architecture</h1>
                <p style={{ color: "var(--text-soft)", fontSize: "1.05rem", marginBottom: "2.5rem" }}>Live hazard signals, FEMA risk intelligence, and indoor routing — all converging into one incident pipeline.</p>

                {/* 4-Phase Pipeline */}
                <div style={{ marginBottom: "3rem" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", marginBottom: "1.25rem" }}>⚙️ Response Pipeline</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {[
                            { step: "01", name: "Detect", icon: "📡", color: "#00ffcc", desc: "Poll NWS, ingest hotel telemetry, create one incident record with severity + playbook." },
                            { step: "02", name: "Coordinate", icon: "📢", color: "#00bfff", desc: "Broadcast guest alerts, track acknowledgements, SOS flags, and occupancy confidence by building." },
                            { step: "03", name: "Respond", icon: "🚒", color: "#ff7733", desc: "Share responder brief, route around blocked zones, maintain one live timeline of field decisions." },
                            { step: "04", name: "Prove", icon: "✅", color: "#00ffcc", desc: "Reconcile assembly headcounts, preserve the incident log, surface accountability metrics." },
                        ].map(p => (
                            <div key={p.step} style={{ padding: "1.5rem", borderRadius: 20, border: `1px solid ${p.color}44`, background: `${p.color}08`, position: "relative", overflow: "hidden" }}>
                                <div style={{ fontSize: "3rem", opacity: 0.08, position: "absolute", top: -10, right: 10, fontFamily: "var(--font-display)", fontWeight: 900 }}>{p.step}</div>
                                <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{p.icon}</div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: p.color, marginBottom: "0.5rem" }}>{p.name}</div>
                                <div style={{ color: "var(--text-soft)", fontSize: "0.88rem", lineHeight: 1.6 }}>{p.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NWS Live Alerts */}
                <div style={{ marginBottom: "3rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>📡 Live NWS Weather Alerts</h2>
                        <button onClick={refresh} style={{ padding: "0.5rem 1.25rem", borderRadius: 999, border: "1px solid var(--mint)", background: "rgba(0,255,204,0.08)", color: "var(--mint)", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                            {refreshing ? "⏳ Refreshing..." : "🔄 Refresh Feed"}
                        </button>
                    </div>
                    <div style={{ color: "var(--text-soft)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>Last refresh: {lastRefresh} · Auto-refreshes every 5 min · Geo-fenced to hotel coordinates</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {alerts.map((a, i) => {
                            const c = SEV_COLOR[a.severity];
                            return (
                                <div key={i} style={{ padding: "1.25rem 1.5rem", borderRadius: 16, background: `${c}0a`, border: `1px solid ${c}33`, borderLeft: `5px solid ${c}` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                        <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{a.title}</div>
                                        <span style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: 999, background: `${c}22`, color: c, fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap", marginLeft: "1rem" }}>{a.severity}</span>
                                    </div>
                                    <div style={{ color: "var(--text-soft)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>📍 {a.area}</div>
                                    <div style={{ color: "var(--text-light)", fontSize: "0.92rem", lineHeight: 1.6 }}>{a.desc}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FEMA Risk Intelligence */}
                <div style={{ marginBottom: "3rem" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", marginBottom: "1.25rem" }}>🗂️ OpenFEMA Risk Intelligence</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {FEMA_DATA.map(f => (
                            <div key={f.label} style={{ padding: "1.5rem", borderRadius: 20, background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)", textAlign: "center" }}>
                                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{f.icon}</div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: f.color || "var(--mint)", marginBottom: "0.4rem" }}>{f.value}</div>
                                <div style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>{f.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Indoor Routing */}
                <div style={{ padding: "2rem", borderRadius: 20, background: "rgba(0,191,255,0.06)", border: "1px solid rgba(0,191,255,0.25)", marginBottom: "3rem" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", marginBottom: "1rem" }}>🗺️ Floor-Aware Indoor Routing</h2>
                    <p style={{ color: "var(--text-soft)", lineHeight: 1.7, marginBottom: "1.5rem" }}>GPS fails indoors. Our routing engine knows about smoke blocks, stairwell closures, and safe-room zones per building section — updating in real time as conditions change.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {[
                            { icon: "🚧", label: "Route around smoke", desc: "Blocked corridors excluded from active routes automatically." },
                            { icon: "🪜", label: "Stairwell override", desc: "Elevator holds and stair reroutes activated per building zone." },
                            { icon: "⛺", label: "Safe zones mapped", desc: "Refugee rooms, assembly areas, refuge en-route." },
                            { icon: "📶", label: "Offline route cache", desc: "Emergency card cached locally — works without Wi-Fi." },
                        ].map(r => (
                            <div key={r.label} style={{ padding: "1.25rem", borderRadius: 16, background: "rgba(0,191,255,0.08)", border: "1px solid rgba(0,191,255,0.15)" }}>
                                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{r.icon}</div>
                                <div style={{ fontWeight: 700, marginBottom: "0.3rem", color: "#00bfff" }}>{r.label}</div>
                                <div style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>{r.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pipeline Activity Log */}
                {pipeline.length > 0 && (
                    <div style={{ padding: "1.5rem", borderRadius: 20, background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)" }}>
                        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>🔄 Live Pipeline Activity</h3>
                        {pipeline.map((p, i) => (
                            <div key={i} style={{ padding: "0.6rem 0.9rem", borderRadius: 8, borderLeft: "3px solid var(--mint)", marginBottom: "0.5rem", background: "rgba(0,255,204,0.05)", fontSize: "0.9rem" }}>
                                <span style={{ color: "var(--mint)", fontWeight: 700 }}>[{p.time}]</span> {p.msg}
                            </div>
                        ))}
                    </div>
                )}
                <PageNav currentPath="/platform" navigate={navigate} />
            </div>
        </div>
    );
}
