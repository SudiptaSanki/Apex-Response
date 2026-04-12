/**
 * Shared bottom navigation bar — renders "Go to X" buttons for all sections
 * so users can hop between pages without scrolling to the sidebar.
 */
export default function PageNav({ currentPath, navigate }) {
    const PAGES = [
        { path: "/", icon: "🏠", label: "Home" },
        { path: "/ai-advisor", icon: "🤖", label: "AI Advisor" },
        { path: "/platform", icon: "📡", label: "Platform" },
        { path: "/guest-app", icon: "📱", label: "Guest App" },
        { path: "/command-center", icon: "🖥️", label: "Command" },
        { path: "/responders", icon: "🚒", label: "Responders" },
    ];

    return (
        <nav style={{
            margin: "3rem 2.5rem 0",
            padding: "1.5rem 2rem",
            borderRadius: 20,
            background: "rgba(0,255,204,0.04)",
            border: "1px solid rgba(0,255,204,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
        }}>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Jump to Section
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {PAGES.map(p => {
                    const active = p.path === currentPath;
                    return (
                        <button key={p.path} onClick={() => navigate(p.path)} disabled={active}
                            style={{
                                padding: "0.5rem 1.1rem",
                                borderRadius: 999,
                                border: `1px solid ${active ? "rgba(0,255,204,0.5)" : "rgba(255,255,255,0.1)"}`,
                                background: active ? "rgba(0,255,204,0.12)" : "rgba(255,255,255,0.03)",
                                color: active ? "var(--mint)" : "rgba(255,255,255,0.55)",
                                cursor: active ? "default" : "pointer",
                                fontWeight: active ? 700 : 500,
                                fontSize: "0.82rem",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "rgba(0,255,204,0.35)"; e.currentTarget.style.color = "var(--mint)"; } }}
                            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; } }}>
                            {p.icon} {p.label}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
