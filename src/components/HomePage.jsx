import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

const FEATURES = [
    { icon: "🤖", title: "AI Advisor", desc: "Gemini-powered distress detection. Speak or type, AI verifies with 50 responders and broadcasts 10km alert.", path: "/ai-advisor", color: "#ff6666" },
    { icon: "📱", title: "Guest App", desc: "Multilingual alerts, silent SOS, QR safe check-in, offline-ready cards.", path: "/guest-app", color: "#00ffcc" },
    { icon: "🖥️", title: "Command Center", desc: "Live building heatmap, mode switching, priority queue, leadership timeline.", path: "/command-center", color: "#00bfff" },
    { icon: "🚒", title: "Responders", desc: "Digital Knox Box, hazard maps, expiring link, shared field feed.", path: "/responders", color: "#ff7733" },
    { icon: "📡", title: "Platform", desc: "NWS alerts, FEMA risk intel, indoor routing, 4-phase pipeline.", path: "/platform", color: "#aa88ff" },
];

const METRICS = [
    { label: "Response Time", value: "28s", sub: "Alert to action" },
    { label: "Languages", value: "6", sub: "Multilingual delivery" },
    { label: "Buildings", value: "12+", sub: "City-wide coverage" },
    { label: "Chain Proof", value: "SBT", sub: "Soulbound hero badge" },
];

const SCENARIOS = [
    { id: "storm", label: "Coastal Storm", icon: "🌩️", mode: "Shelter", color: "#00ffcc", desc: "NWS severe weather auto-triggers shelter coordination across all downtown buildings." },
    { id: "smoke", label: "Smoke Event", icon: "🔥", mode: "Evacuation", color: "#ff7733", desc: "Kitchen incident spreads. Routes adapt building-by-building around the affected zone." },
    { id: "threat", label: "Security Threat", icon: "🔒", mode: "Lockdown", color: "#ff3333", desc: "Armed suspect near a building cluster. Selective lockdown with silent coordination." },
];

const CITY_BUILDINGS = [
    { id: "hotel-a", name: "AegisGrand Hotel", zone: "Central Business District", status: "shelter", guests: 214, ack: 79 },
    { id: "hotel-b", name: "Harbour View Inn", zone: "Waterfront District", status: "alert", guests: 88, ack: 45 },
    { id: "conf", name: "Convention Center", zone: "Event Quarter", status: "clear", guests: 560, ack: 91 },
    { id: "apt", name: "Residences West", zone: "West Quarter", status: "evacuate", guests: 130, ack: 34 },
    { id: "mall", name: "Central Mall Hub", zone: "Shopping District", status: "clear", guests: 820, ack: 97 },
];

const STATUS_COLORS = { clear: "#00ffcc", shelter: "#00bfff", alert: "#ffaa00", evacuate: "#ff4444" };

export default function HomePage({ navigate, activeScenario, liveAlerts, nwsState }) {
    const { account, connectApp, reputation } = useWeb3();
    const [activeScId, setActiveScId] = useState("storm");
    const sc = SCENARIOS.find(s => s.id === activeScId);

    return (
        <div style={{ color: "var(--text-strong)" }}>

            {/* ═══ HERO ═══ */}
            <section style={{ padding: "4rem 2.5rem 3rem", background: "radial-gradient(ellipse at 20% 0%, rgba(0,255,204,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(255,119,51,0.1) 0%, transparent 50%), var(--bg-dark)", borderBottom: "1px solid rgba(0,255,204,0.1)", position: "relative", overflow: "hidden" }}>
                {/* Grid lines background */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,255,204,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

                <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: 999, background: "rgba(0,255,204,0.1)", border: "1px solid rgba(0,255,204,0.3)", marginBottom: "1.5rem" }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--mint)", animation: "pulse-red 1.5s infinite" }} />
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mint)" }}>Live Crisis Protocol Active</span>
                    </div>

                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: "1.5rem", color: "white" }}>
                        Hotels don't need<br />another alarm.<br /><span style={{ color: "var(--mint)" }}>They need AegisStay.</span>
                    </h1>

                    <p style={{ maxWidth: "60ch", color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                        Real-time city-wide crisis coordination powered by Web3, AI evidence verification, and live hazard feeds — turning a hotel emergency into a structured, transparent response in under 30 seconds.
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
                        <button onClick={() => navigate("/command-center")} style={{ padding: "0.85rem 2rem", borderRadius: 12, background: "var(--mint)", color: "#000", border: "none", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "all 0.3s" }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(0,255,204,0.5)"}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                            🖥️ Open Command Center
                        </button>
                        <button onClick={() => navigate("/guest-app")} style={{ padding: "0.85rem 2rem", borderRadius: 12, background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)", fontWeight: 600, fontSize: "1rem", cursor: "pointer", transition: "all 0.3s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--mint)"; e.currentTarget.style.color = "var(--mint)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "white"; }}>
                            📱 Guest Experience
                        </button>
                        <button onClick={connectApp} style={{ padding: "0.85rem 2rem", borderRadius: 12, background: "transparent", color: account ? "var(--mint)" : "rgba(255,255,255,0.6)", border: `1px solid ${account ? "rgba(0,255,204,0.4)" : "rgba(255,255,255,0.12)"}`, fontWeight: 600, fontSize: "1rem", cursor: "pointer", transition: "all 0.3s" }}>
                            {account ? `🟢 ${account.substring(0, 8)}... (${reputation} FCR)` : "🦊 Connect Web3 Wallet"}
                        </button>
                    </div>

                    {/* Metrics Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
                        {METRICS.map(m => (
                            <div key={m.label} style={{ padding: "1.25rem", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--mint)", letterSpacing: "-0.05em" }}>{m.value}</div>
                                <div style={{ fontWeight: 600, marginTop: "0.25rem", fontSize: "0.85rem" }}>{m.label}</div>
                                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", marginTop: "0.2rem" }}>{m.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SECTION NAVIGATION CARDS ═══ */}
            <section style={{ padding: "3rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ marginBottom: "2rem" }}>
                        <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mint)", marginBottom: "0.5rem" }}>Explore Sections</p>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,3rem)", letterSpacing: "-0.04em", margin: 0 }}>Navigate to any module</h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
                        {FEATURES.map(f => (
                            <button key={f.path} onClick={() => navigate(f.path)}
                                style={{ padding: "1.75rem", borderRadius: 20, border: `1px solid ${f.color}33`, background: `linear-gradient(135deg, ${f.color}08, transparent)`, cursor: "pointer", textAlign: "left", transition: "all 0.3s", position: "relative", overflow: "hidden" }}
                                onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${f.color}88`; e.currentTarget.style.boxShadow = `0 20px 40px ${f.color}15`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.border = `1px solid ${f.color}33`; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{f.icon}</div>
                                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", color: "white", marginBottom: "0.5rem" }}>{f.title}</div>
                                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", lineHeight: 1.6 }}>{f.desc}</div>
                                <div style={{ marginTop: "1.25rem", fontSize: "0.78rem", color: f.color, fontWeight: 600 }}>Open {f.title} →</div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CITY-WIDE BUILDING MAP ═══ */}
            <section style={{ padding: "3rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                            <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#00bfff", marginBottom: "0.5rem" }}>City Region View</p>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", letterSpacing: "-0.04em", margin: 0 }}>All buildings at a glance</h2>
                        </div>
                        <button onClick={() => navigate("/command-center")} style={{ padding: "0.6rem 1.5rem", borderRadius: 999, border: "1px solid rgba(0,191,255,0.4)", background: "rgba(0,191,255,0.08)", color: "#00bfff", cursor: "pointer", fontWeight: 600 }}>
                            Full command view →
                        </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {CITY_BUILDINGS.map(b => {
                            const c = STATUS_COLORS[b.status];
                            return (
                                <div key={b.id} style={{ padding: "1.5rem", borderRadius: 20, border: `1px solid ${c}44`, background: `${c}08`, cursor: "default", transition: "all 0.3s" }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px ${c}22`}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                        <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", padding: "3px 10px", borderRadius: 999, background: `${c}22`, color: c }}>{b.status}</span>
                                    </div>
                                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "0.2rem" }}>{b.name}</div>
                                    <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>{b.zone}</div>
                                    <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                                        <div style={{ width: `${b.ack}%`, height: "100%", background: c, borderRadius: 999 }} />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                                        <span>{b.guests} people</span>
                                        <span style={{ color: c }}>{b.ack}% ack'd</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ SCENARIO SIMULATOR ═══ */}
            <section style={{ padding: "3rem 2.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#aa88ff", marginBottom: "0.5rem" }}>Interactive Demo</p>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", letterSpacing: "-0.04em", marginBottom: "1.5rem" }}>Switch crisis scenario</h2>

                    {/* Scenario Tabs */}
                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                        {SCENARIOS.map(s => (
                            <button key={s.id} onClick={() => setActiveScId(s.id)}
                                style={{ padding: "0.65rem 1.5rem", borderRadius: 999, border: `2px solid ${activeScId === s.id ? s.color : "rgba(255,255,255,0.12)"}`, background: activeScId === s.id ? `${s.color}22` : "transparent", color: activeScId === s.id ? s.color : "rgba(255,255,255,0.6)", cursor: "pointer", fontWeight: 700, transition: "all 0.25s" }}>
                                {s.icon} {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Active Scenario Card */}
                    <div style={{ padding: "2rem", borderRadius: 24, background: `${sc.color}08`, border: `1px solid ${sc.color}44` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
                            <div>
                                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{sc.icon}</div>
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: sc.color, margin: 0 }}>{sc.label}</h3>
                            </div>
                            <span style={{ padding: "0.5rem 1.25rem", borderRadius: 999, background: `${sc.color}22`, color: sc.color, fontWeight: 700, fontSize: "0.88rem" }}>{sc.mode} Mode</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "1rem" }}>{sc.desc}</p>
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                            <button onClick={() => navigate("/command-center")} style={{ padding: "0.6rem 1.25rem", borderRadius: 12, background: sc.color, color: "#000", border: "none", fontWeight: 700, cursor: "pointer" }}>🖥️ Open Command Center</button>
                            <button onClick={() => navigate("/responders")} style={{ padding: "0.6rem 1.25rem", borderRadius: 12, background: "transparent", color: sc.color, border: `1px solid ${sc.color}66`, cursor: "pointer", fontWeight: 600 }}>🚒 Responder Brief</button>
                            <button onClick={() => navigate("/guest-app")} style={{ padding: "0.6rem 1.25rem", borderRadius: 12, background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontWeight: 600 }}>📱 Guest View</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section style={{ padding: "3rem 2.5rem" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mint)", marginBottom: "0.5rem" }}>4-Step Flow</p>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", letterSpacing: "-0.04em", marginBottom: "2rem" }}>Detect → Coordinate → Respond → Prove</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                        {[
                            { n: "01", name: "Detect", icon: "📡", color: "var(--mint)", desc: "NWS hazard alerts + hotel telemetry create one incident record automatically." },
                            { n: "02", name: "Coordinate", icon: "📢", color: "#00bfff", desc: "Broadcast guest alerts city-wide, track per-building acknowledgements." },
                            { n: "03", name: "Respond", icon: "🚒", color: "#ff7733", desc: "Responder brief deployed, blocked zones rerouted, field notes synced back." },
                            { n: "04", name: "Prove", icon: "⛓️", color: "#aa88ff", desc: "Assembly counts reconciled, SBT badge minted on-chain, audit log preserved." },
                        ].map(p => (
                            <div key={p.n} style={{ padding: "1.75rem", borderRadius: 20, border: `1px solid ${p.color}33`, background: `${p.color}06`, position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: -10, right: 10, fontSize: "4rem", fontFamily: "var(--font-display)", fontWeight: 900, opacity: 0.06, color: p.color }}>{p.n}</div>
                                <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{p.icon}</div>
                                <div style={{ fontFamily: "var(--font-display)", color: p.color, fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{p.name}</div>
                                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", lineHeight: 1.65 }}>{p.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA bar */}
                    <div style={{ marginTop: "2.5rem", padding: "2rem", borderRadius: 20, background: "rgba(0,255,204,0.05)", border: "1px solid rgba(0,255,204,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "0.3rem" }}>Ready to see it in action?</div>
                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>Connect your MetaMask wallet, trigger an SOS, and watch the chain respond.</div>
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                            <button onClick={() => navigate("/platform")} style={{ padding: "0.7rem 1.5rem", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontWeight: 600 }}>📡 Platform Docs</button>
                            <button onClick={connectApp} style={{ padding: "0.7rem 1.5rem", borderRadius: 12, background: "var(--mint)", border: "none", color: "#000", cursor: "pointer", fontWeight: 700 }}>
                                {account ? `✅ ${account.substring(0, 8)}...` : "🦊 Connect & Start"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
