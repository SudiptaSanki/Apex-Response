import { useState } from "react";
import QRCode from "react-qr-code";
import PageNav from "./PageNav";

const HAZARD_ZONES = [
    { id: "north", label: "North Wing", icon: "🏢", ingress: "Gate A — Main Avenue", hydrant: "2 hydrants near Gate A & C", chemicals: "Pool chemicals in basement B2", status: "clear" },
    { id: "west", label: "West Annex", icon: "🏚️", ingress: "West Service Road", hydrant: "1 hydrant near West Gate", chemicals: "Kitchen fuel store near L2", status: "alert" },
    { id: "pool", label: "Pool & Spa", icon: "🏊", ingress: "South Side via parking P2", hydrant: "Hydrant near Spa entrance", chemicals: "Chlorine tank — marked red", status: "evacuate" },
    { id: "lobby", label: "Lobby Complex", icon: "🏛️", ingress: "Main Lobby Drop-off", hydrant: "3 hydrants along frontage road", chemicals: "None flagged", status: "clear" },
];

const FIELD_NOTES = [
    { time: "18:47", team: "Engine 7", msg: "Staging at Gate A. Requesting lobby floor plan." },
    { time: "18:49", team: "Hotel CMD", msg: "Floor plan shared. West corridor blocked - use stairwell B." },
    { time: "18:51", team: "Paramedic 3", msg: "West Annex — 2 elderly guests assisting, ETA 3 min." },
    { time: "18:53", team: "Engine 7", msg: "Utility shutoff completed. Pool chemicals secured." },
];

const STATUS_COLORS = { clear: "#00ffcc", alert: "#ffaa00", evacuate: "#ff3333" };

export default function RespondersPage({ navigate }) {
    const [selectedZone, setSelectedZone] = useState(null);
    const [linkGenerated, setLinkGenerated] = useState(false);
    const [linkExpiry] = useState("18:00 remaining");
    const [scannedCitizens, setScannedCitizens] = useState(0);
    const [pinnedZones, setPinnedZones] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [fieldNotes, setFieldNotes] = useState(FIELD_NOTES);

    const togglePin = (id) => {
        setPinnedZones(prev => prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id]);
    };

    const addNote = () => {
        if (!newNote.trim()) return;
        setFieldNotes(prev => [...prev, { time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }), team: "You", msg: newNote }]);
        setNewNote("");
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-body)", color: "var(--text-strong)", padding: "2rem" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.04em" }}>Responder Link</h1>
                <p style={{ color: "var(--text-soft)", fontSize: "1.05rem", marginBottom: "2.5rem" }}>Digital Knox Box. Everything fire, police, and paramedics need before and after they arrive — no hotel login required.</p>

                {/* Expiring QR Code Card */}
                <div style={{ padding: "1.5rem 2rem", borderRadius: 20, background: linkGenerated ? "rgba(0,255,204,0.08)" : "rgba(20,25,35,0.8)", border: `1px solid ${linkGenerated ? "rgba(0,255,204,0.35)" : "var(--line-soft)"}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", marginBottom: "2rem", transition: "all 0.4s" }}>
                    <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "0.3rem" }}>
                            {linkGenerated ? "📱 Secure Responder QR Active" : "🔒 Generate Responder Access QR"}
                        </div>
                        <div style={{ color: "var(--text-soft)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                            {linkGenerated ? `Expires in ${linkExpiry} · No hotel login needed · Auto-revokeable` : "One scan gives dispatch a secure, expiring floor brief — no login required."}
                        </div>
                        <button onClick={() => setLinkGenerated(!linkGenerated)} style={{ padding: "0.75rem 1.5rem", borderRadius: 12, border: "none", background: linkGenerated ? "#ff444422" : "var(--mint)", color: linkGenerated ? "#ff4444" : "#000", fontWeight: 700, cursor: "pointer", transition: "all 0.3s" }}>
                            {linkGenerated ? "🔴 Revoke QR" : "⚡ Generate QR Code"}
                        </button>
                    </div>
                    
                    {/* The QR Code Graphic */}
                    {linkGenerated && (
                        <div style={{ width: 140, height: 140, borderRadius: 12, background: "white", padding: "0.5rem", position: "relative", boxShadow: "0 0 25px rgba(0,255,204,0.15)", overflow: "hidden" }}>
                            <QRCode value="https://aegisstay.app/respond/auth-x9a2k" size={124} style={{ width: "100%", height: "100%" }} />
                        </div>
                    )}
                </div>

                {/* Safe Shelter Fallback QR Mode */}
                <div style={{ marginBottom: "3rem" }}>
                    <div style={{ padding: "2rem", borderRadius: 24, background: "linear-gradient(135deg, rgba(20,25,35,0.9), rgba(0,255,204,0.05))", border: "1px solid rgba(0,255,204,0.3)" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
                            <div style={{ flex: 1, minWidth: 300 }}>
                                <div style={{ display: "inline-flex", padding: "0.4rem 1rem", borderRadius: 999, background: "rgba(0,255,204,0.1)", color: "var(--mint)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                                    Partner & Citizen Registration
                                </div>
                                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem" }}>Safe Shelter Access QR</h2>
                                <p style={{ color: "var(--text-soft)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                                    When power grids crash or AI grid networking fails, partnering businesses and local shelters can deploy this Safe Shelter offline QR. Responders scan it locally to legally register their position into the safety network, freely guiding people without relying on active cloud connections.
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <button onClick={() => setScannedCitizens(c => c + 1)} style={{ padding: "0.8rem 1.5rem", borderRadius: 12, background: "var(--mint)", border: "none", cursor: "pointer", fontWeight: 700, color: "black" }}>
                                        Simulate Scanner (Add Person)
                                    </button>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>
                                        Checked-in: <span style={{ color: "var(--mint)" }}>{scannedCitizens}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: 150, height: 150, borderRadius: 16, background: "white", padding: "0.5rem", position: "relative", boxShadow: "0 0 30px rgba(0,255,204,0.2)" }}>
                                <QRCode value={`https://aegisstay.app/shelter/checkin?p=${scannedCitizens}`} size={134} style={{ width: "100%", height: "100%" }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hazard Zone Grid */}
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", marginBottom: "1rem" }}>Building Hazard Zones</h2>
                <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Click any building zone to expand hazard notes, ingress points, and utility details.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
                    {HAZARD_ZONES.map(z => {
                        const c = STATUS_COLORS[z.status];
                        const isOpen = selectedZone?.id === z.id;
                        const isPinned = pinnedZones.includes(z.id);
                        return (
                            <div key={z.id} style={{ borderRadius: 20, border: `2px solid ${isOpen ? c : `${c}33`}`, background: `${c}0a`, overflow: "hidden", cursor: "pointer", transition: "all 0.3s", boxShadow: isOpen ? `0 0 25px ${c}33` : "none" }}>
                                <div onClick={() => setSelectedZone(isOpen ? null : z)} style={{ padding: "1.25rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "2rem" }}>{z.icon}</span>
                                        <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: `${c}22`, color: c }}>{z.status.toUpperCase()}</span>
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginTop: "0.75rem", fontSize: "1.1rem" }}>{z.label}</div>
                                    <div style={{ color: "var(--text-soft)", fontSize: "0.85rem", marginTop: "0.25rem" }}>{z.ingress}</div>
                                </div>
                                {isOpen && (
                                    <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                        <div style={{ padding: "0.75rem", borderRadius: 12, background: "rgba(255,255,255,0.04)", fontSize: "0.88rem" }}>
                                            <div style={{ color: "#ffaa00", fontWeight: 700, marginBottom: "0.3rem" }}>🚒 Ingress</div>
                                            <div style={{ color: "var(--text-light)" }}>{z.ingress}</div>
                                        </div>
                                        <div style={{ padding: "0.75rem", borderRadius: 12, background: "rgba(255,255,255,0.04)", fontSize: "0.88rem" }}>
                                            <div style={{ color: "#00bfff", fontWeight: 700, marginBottom: "0.3rem" }}>💧 Hydrant</div>
                                            <div style={{ color: "var(--text-light)" }}>{z.hydrant}</div>
                                        </div>
                                        <div style={{ padding: "0.75rem", borderRadius: 12, background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)", fontSize: "0.88rem" }}>
                                            <div style={{ color: "#ff6666", fontWeight: 700, marginBottom: "0.3rem" }}>⚠️ Chemicals / Utilities</div>
                                            <div style={{ color: "var(--text-light)" }}>{z.chemicals}</div>
                                        </div>
                                        <button onClick={() => togglePin(z.id)} style={{ padding: "0.5rem", borderRadius: 10, border: `1px solid ${isPinned ? c : "rgba(255,255,255,0.15)"}`, background: isPinned ? `${c}22` : "transparent", color: isPinned ? c : "white", cursor: "pointer", fontWeight: 600 }}>
                                            {isPinned ? "📌 Zone Pinned (Cleared)" : "📍 Pin as Cleared Zone"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                    {/* CCTV Snapshots */}
                    <div style={{ padding: "1.5rem", background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)", borderRadius: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ fontFamily: "var(--font-display)" }}>📷 Live CCTV Snapshots</h3>
                            <button style={{ padding: "0.2rem 0.5rem", borderRadius: 8, background: "rgba(0,191,255,0.15)", color: "#00bfff", border: "1px solid rgba(0,191,255,0.3)", fontSize: "0.75rem", fontWeight: 700 }}>Request Access</button>
                        </div>
                        <p style={{ color: "var(--text-soft)", fontSize: "0.85rem", marginBottom: "1rem" }}>Building security feeds can be attached directly to the Knox Box data stream.</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <div style={{ height: 100, borderRadius: 12, background: "rgba(0,0,0,0.5)", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", flexDirection: "column" }}>
                                <span>🎥 Cam 14</span>
                                <span style={{ fontSize: "0.7rem", marginTop: 4 }}>North Lobby</span>
                            </div>
                            <div style={{ height: 100, borderRadius: 12, background: "rgba(0,0,0,0.5)", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", flexDirection: "column" }}>
                                <span>🎥 Cam 02</span>
                                <span style={{ fontSize: "0.7rem", marginTop: 4 }}>Pool Gate</span>
                            </div>
                        </div>
                    </div>

                    {/* Fallback Mode Indicator */}
                    <div style={{ padding: "1.5rem", background: "rgba(255,170,0,0.08)", border: "1px solid rgba(255,170,0,0.3)", borderRadius: 20, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📶</div>
                        <h3 style={{ fontFamily: "var(--font-display)", color: "#ffaa00", marginBottom: "0.5rem" }}>Fallback Mode Enabled</h3>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                            If connection drops during the response, this digital knox box collapses to a lightweight, read-only cached page. Critical maps and egress points remain available offline automatically.
                        </p>
                    </div>
                </div>

                {/* Shared Field Timeline */}
                <div style={{ padding: "1.5rem", background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)", borderRadius: 20 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "1rem" }}>📻 Shared Field Timeline</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                        {fieldNotes.map((n, i) => (
                            <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "0.75rem 1rem", borderRadius: 12, background: "rgba(255,255,255,0.03)", borderLeft: "4px solid rgba(0,255,204,0.4)" }}>
                                <span style={{ color: "var(--text-soft)", fontSize: "0.82rem", minWidth: 45 }}>{n.time}</span>
                                <span style={{ fontSize: "0.8rem", padding: "2px 8px", borderRadius: 999, background: "rgba(0,255,204,0.1)", color: "var(--mint)", fontWeight: 700, whiteSpace: "nowrap" }}>{n.team}</span>
                                <span style={{ color: "var(--text-light)", fontSize: "0.93rem" }}>{n.msg}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote()} placeholder="Add a field note..." style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "0.95rem", outline: "none" }} />
                        <button onClick={addNote} style={{ padding: "0.75rem 1.5rem", borderRadius: 12, background: "var(--mint)", border: "none", color: "#000", fontWeight: 700, cursor: "pointer" }}>Post</button>
                    </div>
                </div>
                <PageNav currentPath="/responders" navigate={navigate} />
            </div>
        </div>
    );
}
