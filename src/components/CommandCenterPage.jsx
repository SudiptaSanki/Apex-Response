import { useState } from "react";
import PageNav from "./PageNav";

const BUILDINGS = [
    { id: "north", label: "North Wing", icon: "🏢", occupancy: 87, acknowledged: 72, status: "shelter", guests: 214, sos: 1 },
    { id: "south", label: "South Wing", icon: "🏗️", occupancy: 56, acknowledged: 89, status: "clear", guests: 140, sos: 0 },
    { id: "lobby", label: "Lobby & Conference", icon: "🏛️", occupancy: 34, acknowledged: 92, status: "clear", guests: 83, sos: 0 },
    { id: "west", label: "West Annex", icon: "🏚️", occupancy: 21, acknowledged: 44, status: "alert", guests: 52, sos: 3 },
    { id: "pool", label: "Pool & Spa Complex", icon: "🏊", occupancy: 12, acknowledged: 60, status: "evacuate", guests: 30, sos: 2 },
];

const MODES = [
    { id: "evacuation", label: "Evacuation", color: "#ff7733", icon: "🚪", desc: "Unlock exits, reroute around blocked zones, reconcile assembly check-ins." },
    { id: "shelter", label: "Shelter", color: "#00bfff", icon: "🛡️", desc: "Keep guests indoors, designate refuge zones, pause elevators, send calm instructions." },
    { id: "lockdown", label: "Lockdown", color: "#ff3333", icon: "🔒", desc: "Control access points, protect guest privacy, share selective data with responders only." },
];

const WARNING_TYPES = [
    { label: "Children / Minors", icon: "👶", count: 14, color: "#ffaa00" },
    { label: "Seniors (65+)", icon: "👴", count: 23, color: "#ff7733" },
    { label: "Mobility Needs", icon: "♿", count: 8, color: "#ff6666" },
    { label: "Unaccounted Rooms", icon: "❓", count: 6, color: "#ff3333" },
];

const TIMELINE = [
    { time: "18:47", actor: "System", msg: "NWS Alert ingested. Incident record created.", type: "alert" },
    { time: "18:48", actor: "Manager", msg: "Shelter mode activated across North Wing.", type: "action" },
    { time: "18:49", actor: "Warden F2", msg: "Floor sweep complete — West Annex L2 cleared.", type: "sweep" },
    { time: "18:50", actor: "System", msg: "37 guests acknowledged push notification.", type: "info" },
    { time: "18:52", actor: "Security", msg: "Suspicious SOS flag in West Annex. Dispatching warden.", type: "alert" },
    { time: "18:54", actor: "Manager", msg: "Simulator drill injected for Pool & Spa zone.", type: "drill" },
];

const STATUS_COLORS = { clear: "#00ffcc", shelter: "#00bfff", alert: "#ffaa00", evacuate: "#ff3333", lockdown: "#ff4444" };

export default function CommandCenterPage({ navigate }) {
    const [activeMode, setActiveMode] = useState("shelter");
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [simulatorOn, setSimulatorOn] = useState(false);
    const [simLog, setSimLog] = useState([]);

    const injectAlarm = () => {
        const msg = `🔔 [DRILL] Simulated smoke alarm triggered in ${BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)].label}`;
        setSimLog(prev => [{ time: new Date().toLocaleTimeString(), msg }, ...prev.slice(0, 4)]);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-body)", color: "var(--text-strong)", padding: "2rem" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.04em" }}>Command Center</h1>
                <p style={{ color: "var(--text-soft)", marginBottom: "2.5rem", fontSize: "1.05rem" }}>Live view across all hotel zones. Switch modes, dispatch wardens, track accountability.</p>

                {/* Mode Switcher */}
                <div style={{ marginBottom: "2rem" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>Operational Mode</h3>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        {MODES.map(m => (
                            <button key={m.id} onClick={() => setActiveMode(m.id)}
                                style={{ flex: "1 1 200px", padding: "1.25rem", borderRadius: 16, border: `2px solid ${activeMode === m.id ? m.color : "rgba(255,255,255,0.1)"}`, background: activeMode === m.id ? `${m.color}22` : "rgba(20,25,35,0.7)", cursor: "pointer", textAlign: "left", transition: "all 0.3s" }}>
                                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{m.icon}</div>
                                <div style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: activeMode === m.id ? m.color : "white", marginBottom: "0.4rem" }}>{m.label}</div>
                                <div style={{ fontSize: "0.83rem", color: "var(--text-soft)", lineHeight: 1.5 }}>{m.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Building Occupancy Heatmap */}
                <div style={{ marginBottom: "2rem" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>Building Occupancy Overview</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {BUILDINGS.map(b => {
                            const c = STATUS_COLORS[b.status];
                            const isSelected = selectedBuilding?.id === b.id;
                            return (
                                <button key={b.id} onClick={() => setSelectedBuilding(isSelected ? null : b)}
                                    style={{ padding: "1.5rem", borderRadius: 20, border: `2px solid ${isSelected ? c : `${c}44`}`, background: `${c}11`, cursor: "pointer", textAlign: "left", transition: "all 0.3s", boxShadow: isSelected ? `0 0 20px ${c}44` : "none" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                        <span style={{ fontSize: "2rem" }}>{b.icon}</span>
                                        <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: `${c}22`, color: c }}>{b.status.toUpperCase()}</span>
                                    </div>
                                    <div style={{ fontWeight: 700, fontFamily: "var(--font-display)", color: "white", marginBottom: "0.25rem" }}>{b.label}</div>
                                    <div style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>{b.guests} guests</div>
                                    <div style={{ marginTop: "0.75rem", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 999, overflow: "hidden" }}>
                                        <div style={{ width: `${b.acknowledged}%`, height: "100%", background: c, borderRadius: 999, transition: "width 1s ease" }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-soft)" }}>
                                        <span>{b.acknowledged}% ack'd</span>
                                        {b.sos > 0 && <span style={{ color: "#ff4444", fontWeight: 700 }}>🆘 {b.sos} SOS</span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {selectedBuilding && (
                        <div style={{ marginTop: "1rem", padding: "1.5rem", borderRadius: 16, background: "rgba(20,25,35,0.9)", border: `1px solid ${STATUS_COLORS[selectedBuilding.status]}66` }}>
                            <h4 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>{selectedBuilding.icon} {selectedBuilding.label} — Detailed View</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                                {[{ label: "Occupancy", val: `${selectedBuilding.occupancy}%` }, { label: "Acknowledged", val: `${selectedBuilding.acknowledged}%` }, { label: "Active SOS", val: selectedBuilding.sos }].map(s => (
                                    <div key={s.label} style={{ padding: "1rem", borderRadius: 12, background: "rgba(255,255,255,0.05)", textAlign: "center" }}>
                                        <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--mint)" }}>{s.val}</div>
                                        <div style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                    {/* Priority Queue */}
                    <div style={{ padding: "1.5rem", background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)", borderRadius: 20 }}>
                        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>⚠️ Priority Queue</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {WARNING_TYPES.map(w => (
                                <div key={w.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: 12, background: `${w.color}11`, border: `1px solid ${w.color}33` }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <span style={{ fontSize: "1.3rem" }}>{w.icon}</span>
                                        <span style={{ fontWeight: 600 }}>{w.label}</span>
                                    </span>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: w.color }}>{w.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Simulator Mode */}
                    <div style={{ padding: "1.5rem", background: simulatorOn ? "rgba(255,170,0,0.08)" : "rgba(20,25,35,0.8)", border: `1px solid ${simulatorOn ? "#ffaa0066" : "var(--line-soft)"}`, borderRadius: 20, transition: "all 0.3s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ fontFamily: "var(--font-display)" }}>🎮 Simulator Mode</h3>
                            <button onClick={() => setSimulatorOn(!simulatorOn)} style={{ padding: "0.4rem 1rem", borderRadius: 999, border: `1px solid ${simulatorOn ? "#ffaa00" : "rgba(255,255,255,0.2)"}`, background: simulatorOn ? "#ffaa0022" : "transparent", color: simulatorOn ? "#ffaa00" : "white", cursor: "pointer", fontWeight: 600 }}>
                                {simulatorOn ? "🟡 ON" : "⚫ OFF"}
                            </button>
                        </div>
                        <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", marginBottom: "1rem" }}>Inject scripted alarms for drills when real hardware is unavailable.</p>
                        {simulatorOn && (
                            <>
                                <button onClick={injectAlarm} style={{ width: "100%", padding: "0.75rem", borderRadius: 12, background: "#ffaa0022", border: "1px solid #ffaa0066", color: "#ffaa00", cursor: "pointer", fontWeight: 700, marginBottom: "1rem" }}>🔔 Inject Fake Alarm</button>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    {simLog.map((s, i) => (
                                        <div key={i} style={{ padding: "0.6rem 0.9rem", borderRadius: 8, background: "rgba(255,255,255,0.04)", fontSize: "0.85rem", color: "var(--text-soft)" }}>
                                            <span style={{ color: "#ffaa00", fontWeight: 600 }}>[{s.time}]</span> {s.msg}
                                        </div>
                                    ))}
                                    {simLog.length === 0 && <div style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>No drills injected yet.</div>}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem", alignItems: "start" }}>
                    {/* Warden Task Assignments */}
                    <div style={{ padding: "1.5rem", background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)", borderRadius: 20 }}>
                        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>👷‍♂️ Region Warden Dispatch</h3>
                        <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", marginBottom: "1rem" }}>Dispatch sweep teams to specific building regions.</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {[
                                { team: "Sweep-Alpha", region: "North Wing", status: "Active", time: "05:12" },
                                { team: "Sweep-Bravo", region: "Pool & Spa", status: "Deployed", time: "01:45" },
                                { team: "Med-1", region: "West Annex", status: "Standby", time: "--:--" }
                            ].map(w => (
                                <div key={w.team} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{w.team}</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>{w.region}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "0.75rem", padding: "3px 8px", borderRadius: 999, background: w.status === "Active" ? "rgba(0,255,204,0.15)" : "rgba(255,170,0,0.15)", color: w.status === "Active" ? "var(--mint)" : "#ffaa00", fontWeight: 700 }}>{w.status}</span>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-soft)", marginTop: "4px" }}>{w.time}</div>
                                    </div>
                                </div>
                            ))}
                            <button style={{ padding: "0.75rem", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "white", cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)", fontWeight: 600, marginTop: "0.5rem" }}>
                                + Dispatch New Team
                            </button>
                        </div>
                    </div>

                    {/* Assembly Accountability Board */}
                    <div style={{ padding: "1.5rem", background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)", borderRadius: 20 }}>
                        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>👥 Assembly Accountability</h3>
                        <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Live aggregation of all verification methods (QR + Roster + Sweep).</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ padding: "1rem", borderRadius: 12, background: "rgba(0,255,204,0.08)", border: "1px solid rgba(0,255,204,0.2)" }}>
                                <div style={{ fontSize: "2rem", fontFamily: "var(--font-display)", color: "var(--mint)", fontWeight: 700 }}>87%</div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>Total Verified Safe</div>
                            </div>
                            <div style={{ padding: "1rem", borderRadius: 12, background: "rgba(255,51,51,0.08)", border: "1px solid rgba(255,51,51,0.2)" }}>
                                <div style={{ fontSize: "2rem", fontFamily: "var(--font-display)", color: "#ff4444", fontWeight: 700 }}>42</div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>Guests Unaccounted</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-soft)", padding: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}><span>📱 QR Check-ins</span> <span style={{ color: "white", fontWeight: 600 }}>245</span></div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-soft)", padding: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}><span>📋 Manual Roster (Staff)</span> <span style={{ color: "white", fontWeight: 600 }}>82</span></div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-soft)", padding: "0.5rem" }}><span>👷 Sweep Team Vetted</span> <span style={{ color: "white", fontWeight: 600 }}>107</span></div>
                        </div>
                    </div>
                </div>

                {/* Leadership Timeline */}
                <div style={{ padding: "1.5rem", background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)", borderRadius: 20 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}>📋 Leadership Timeline</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {TIMELINE.map((t, i) => {
                            const typeColors = { alert: "#ff4444", action: "#00ffcc", sweep: "#00bfff", info: "#8ba2b0", drill: "#ffaa00" };
                            return (
                                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "0.75rem 1rem", borderRadius: 12, background: "rgba(255,255,255,0.03)", borderLeft: `4px solid ${typeColors[t.type]}` }}>
                                    <span style={{ color: "var(--text-soft)", fontSize: "0.85rem", minWidth: 50 }}>{t.time}</span>
                                    <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: 999, background: `${typeColors[t.type]}22`, color: typeColors[t.type], fontWeight: 700, minWidth: 60, textAlign: "center" }}>{t.actor}</span>
                                    <span style={{ color: "var(--text-light)", lineHeight: 1.5 }}>{t.msg}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <PageNav currentPath="/command-center" navigate={navigate} />
            </div>
        </div>
    );
}
