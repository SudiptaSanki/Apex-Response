import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import MediaCapture from "./MediaCapture";

const NAV_ITEMS = [
    { path: "/", icon: "🏠", label: "Home", sublabel: "Overview & Hero" },
    { path: "/ai-advisor", icon: "🤖", label: "AI Advisor", sublabel: "Gemini Distress AI" },
    { path: "/platform", icon: "📡", label: "Platform", sublabel: "Architecture & Live Data" },
    { path: "/guest-app", icon: "📱", label: "Guest App", sublabel: "Alerts & QR Check-In" },
    { path: "/command-center", icon: "🖥️", label: "Command Center", sublabel: "Buildings & Modes" },
    { path: "/responders", icon: "🚒", label: "Responders", sublabel: "Knox Box & Field Teams" },
    { path: "/profile", icon: "🧑‍🚀", label: "My Profile", sublabel: "Identity & Tokens" },
];

export default function AppShell({ route, navigate, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showSOS, setShowSOS] = useState(false);
    const [globalVerifyState, setGlobalVerifyState] = useState(null); // null | { progress: number, count: number }
    const [liveLogs, setLiveLogs] = useState([]);
    const { account, connectApp, reputation, dispatchOnChainSOS } = useWeb3();

    const handleVerify = async (res) => {
        setShowSOS(false);
        setLiveLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `🤖 AI Triaging: ${res.desc}...`, type: "info" }]);
        
        // Start 7-second verification status bar
        setGlobalVerifyState({ progress: 0, count: 0 });
        let count = 0;
        const total = 50;
        const duration = 7000;
        const interval = duration / total;

        const timer = setInterval(async () => {
            count++;
            setGlobalVerifyState({ progress: Math.round((count / total) * 100), count });
            if (count >= total) {
                clearInterval(timer);
                await finalizeSOS();
            }
        }, interval);
    };

    const finalizeSOS = async () => {
        const success = await dispatchOnChainSOS(50, "ipfs://AegisSBT");
        if (success) {
            setLiveLogs(prev => [
                ...prev,
                { time: new Date().toLocaleTimeString(), msg: `✅ Hero SBT minted — ${account?.substring(0, 8)}...`, type: "success" },
                { time: new Date().toLocaleTimeString(), msg: `🚀 Crisis relayed to 10km responder radius`, type: "success" },
                { time: new Date().toLocaleTimeString(), msg: `📍 AR routing activated — guiding guests to safe zones`, type: "info" },
                { time: new Date().toLocaleTimeString(), msg: `🔒 Occupancy matrix locked. Lockdown enforced.`, type: "warning" },
            ]);
        } else {
            setLiveLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `❌ Chain TX aborted. Check wallet.`, type: "error" }]);
        }
        setTimeout(() => setGlobalVerifyState(null), 3000);
    };

    const logColors = { info: "var(--mint)", success: "#00ff88", warning: "#ffaa00", error: "#ff4444" };

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-body)", color: "var(--text-strong)", fontFamily: "var(--font-body)" }}>

            {/* ── SIDEBAR ── */}
            <aside style={{
                width: sidebarOpen ? 240 : 64,
                transition: "width 0.3s ease",
                background: "rgba(8,15,20,0.97)",
                borderRight: "1px solid rgba(0,255,204,0.12)",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                top: 0, left: 0, bottom: 0,
                zIndex: 200,
                overflow: "hidden",
                backdropFilter: "blur(20px)",
            }}>
                {/* Brand */}
                <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden", minHeight: 64 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #00ffcc, #0077ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: "0.95rem", flexShrink: 0 }}>A</div>
                    {sidebarOpen && (
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "white", whiteSpace: "nowrap" }}>AegisStay</div>
                            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>Web3 Crisis Protocol</div>
                        </div>
                    )}
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: "0.75rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem", overflowY: "auto" }}>
                    {NAV_ITEMS.map(item => {
                        const active = route === item.path;
                        return (
                            <button key={item.path} onClick={() => navigate(item.path)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0.75rem", borderRadius: 12, border: "none", cursor: "pointer", transition: "all 0.2s", textAlign: "left", width: "100%", overflow: "hidden",
                                    background: active ? "rgba(0,255,204,0.12)" : "transparent",
                                    boxShadow: active ? "inset 0 0 0 1px rgba(0,255,204,0.3)" : "none"
                                }}>
                                <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{item.icon}</span>
                                {sidebarOpen && (
                                    <div style={{ overflow: "hidden" }}>
                                        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: active ? "var(--mint)" : "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>{item.label}</div>
                                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{item.sublabel}</div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Web3 Connect */}
                <div style={{ padding: "0.75rem 0.5rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <button onClick={connectApp}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: 12, border: `1px solid ${account ? "rgba(0,255,204,0.4)" : "rgba(255,255,255,0.12)"}`, background: account ? "rgba(0,255,204,0.08)" : "transparent", cursor: "pointer", overflow: "hidden" }}>
                        <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{account ? "🟢" : "🦊"}</span>
                        {sidebarOpen && (
                            <div style={{ overflow: "hidden" }}>
                                <div style={{ fontWeight: 600, fontSize: "0.8rem", color: account ? "var(--mint)" : "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>{account ? `${account.substring(0, 8)}...` : "Connect Wallet"}</div>
                                {account && <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{reputation} FCR Points</div>}
                            </div>
                        )}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <button onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{ margin: "0.5rem", padding: "0.5rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.8rem" }}>
                    {sidebarOpen ? "◀ Collapse" : "▶"}
                </button>
            </aside>

            {/* ── MAIN AREA ── */}
            <div style={{ marginLeft: sidebarOpen ? 240 : 64, transition: "margin-left 0.3s ease", flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

                {/* Top Bar */}
                <header style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", height: 60, borderBottom: "1px solid rgba(0,255,204,0.1)", background: "rgba(5,13,17,0.9)", backdropFilter: "blur(20px)" }}>

                    {/* Breadcrumb */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                        <span style={{ color: "rgba(255,255,255,0.35)" }}>AegisStay</span>
                        <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
                        <span style={{ color: "white", fontWeight: 600 }}>{NAV_ITEMS.find(n => n.path === route)?.label || "Home"}</span>
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

                        {/* Quick-jump nav pills */}
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                            {NAV_ITEMS.filter(n => n.path !== route).map(n => (
                                <button key={n.path} onClick={() => navigate(n.path)} title={n.label}
                                    style={{ padding: "0.3rem 0.75rem", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500, transition: "all 0.2s", whiteSpace: "nowrap" }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,255,204,0.4)"; e.currentTarget.style.color = "var(--mint)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
                                    {n.icon} {n.label}
                                </button>
                            ))}
                        </div>

                        {/* SOS Button */}
                        <button onClick={() => setShowSOS(true)}
                            style={{ padding: "0.45rem 1.1rem", borderRadius: 999, border: "none", background: "var(--neon-red)", color: "white", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", animation: "pulse-red 2s infinite", letterSpacing: "0.05em" }}>
                            🚨 SOS
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1 }}>
                    {children}
                </main>

                {/* Footer */}
                <footer style={{ padding: "1rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>
                    <span>AegisStay © {new Date().getFullYear()} — Web3 Crisis Protocol</span>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        {NAV_ITEMS.map(n => (
                            <button key={n.path} onClick={() => navigate(n.path)}
                                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "0.78rem", padding: 0 }}
                                onMouseEnter={e => e.currentTarget.style.color = "var(--mint)"}
                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
                                {n.label}
                            </button>
                        ))}
                    </div>
                </footer>
            </div>

            {/* ── SOS MediaCapture Modal ── */}
            {showSOS && <MediaCapture onClose={() => setShowSOS(false)} onVerify={handleVerify} />}

            {/* ── GLOBAL 7-SECOND VERIFICATION STATUS BAR ── */}
            {globalVerifyState && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
                    <div style={{ padding: "3rem", borderRadius: 24, background: "rgba(20,25,35,0.95)", border: "1px solid rgba(255,51,51,0.3)", maxWidth: 600, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(255,51,51,0.2)" }}>
                        <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
                            <div style={{ fontSize: "4rem", animation: globalVerifyState.progress < 100 ? "pulse-red 1s infinite" : "none" }}>{globalVerifyState.progress < 100 ? "🚨" : "✅"}</div>
                        </div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "0.5rem" }}>
                            {globalVerifyState.progress < 100 ? "Verifying Crisis Incident..." : "Verification Complete"}
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", marginBottom: "2rem" }}>
                            {globalVerifyState.progress < 100 ? `Pinging ${globalVerifyState.count} of 50 nearest verified responders` : "10km Regional Firebase broadcast initiated."}
                        </p>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-soft)", fontWeight: 700 }}>
                            <span>VERIFICATION PROGRESS</span>
                            <span style={{ color: globalVerifyState.progress === 100 ? "var(--mint)" : "#ff6666" }}>{globalVerifyState.progress}%</span>
                        </div>
                        <div style={{ height: 24, background: "rgba(255,255,255,0.1)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
                            <div style={{ 
                                height: "100%", 
                                width: `${globalVerifyState.progress}%`, 
                                background: globalVerifyState.progress === 100 ? "var(--mint)" : "linear-gradient(90deg, #ff4444, #ff7733)", 
                                borderRadius: 999, 
                                transition: "width 0.15s linear" 
                            }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Live HUD Notification Stack ── */}
            {liveLogs.length > 0 && (
                <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", width: 360, display: "flex", flexDirection: "column-reverse", gap: "0.6rem", zIndex: 9999 }}>
                    {liveLogs.slice(-5).map((log, i) => (
                        <div key={i} style={{ padding: "0.9rem 1.1rem", background: "rgba(8,14,20,0.92)", backdropFilter: "blur(16px)", borderLeft: `4px solid ${logColors[log.type]}`, borderRadius: "0 10px 10px 0", color: "white", fontSize: "0.83rem", lineHeight: 1.5, animation: "slide-in 0.3s ease-out", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
                            <span style={{ color: logColors[log.type], fontWeight: 700, marginRight: "0.5rem" }}>[{log.time}]</span>
                            {log.msg}
                        </div>
                    ))}
                    <button onClick={() => setLiveLogs([])} style={{ padding: "0.4rem 0.8rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.72rem", alignSelf: "flex-end" }}>Clear log</button>
                </div>
            )}
        </div>
    );
}
