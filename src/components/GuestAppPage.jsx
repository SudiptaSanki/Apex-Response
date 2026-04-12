import { useState } from "react";
import QRCode from "react-qr-code";
import PageNav from "./PageNav";

const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
];

const alerts = {
    en: { title: "🚨 Emergency Alert", body: "Please proceed to Stairwell B immediately. Do NOT use elevators. Assembly point is at the Main Lobby.", sos: "Silent SOS", checkout: "Mark Myself Safe", route: "View My Safe Route" },
    hi: { title: "🚨 आपातकालीन अलर्ट", body: "कृपया तुरंत सीढ़ी B की ओर जाएं। लिफ्ट का उपयोग न करें। सभा स्थल मुख्य लॉबी में है।", sos: "साइलेंट SOS", checkout: "मैं सुरक्षित हूँ", route: "सुरक्षित मार्ग देखें" },
    fr: { title: "🚨 Alerte d'urgence", body: "Veuillez vous diriger immédiatement vers l'escalier B. N'utilisez PAS les ascenseurs. Le point de rassemblement est au hall principal.", sos: "SOS silencieux", checkout: "Je suis en sécurité", route: "Voir mon itinéraire" },
    es: { title: "🚨 Alerta de emergencia", body: "Diríjase inmediatamente a la Escalera B. NO use los ascensores. El punto de reunión es en el Lobby Principal.", sos: "SOS silencioso", checkout: "Estoy a salvo", route: "Ver mi ruta segura" },
    ar: { title: "🚨 تنبيه طارئ", body: "يرجى التوجه فوراً إلى السلم B. لا تستخدم المصاعد. نقطة التجمع في الردهة الرئيسية.", sos: "إرسال SOS صامت", checkout: "أنا بأمان", route: "عرض طريقي الآمن" },
    ja: { title: "🚨 緊急アラート", body: "直ちに階段Bへ向かってください。エレベーターは使用しないでください。集合場所はメインロビーです。", sos: "サイレントSOS", checkout: "安全です", route: "安全ルートを見る" },
};

const qrGuests = [
    { id: "R-201", name: "Arjun Sharma", status: "safe", time: "18:47" },
    { id: "R-304", name: "Maria Lopez", status: "safe", time: "18:49" },
    { id: "R-512", name: "John Chen", status: "pending", time: "—" },
    { id: "R-118", name: "Fatima Al-Hassan", status: "sos", time: "18:45" },
    { id: "R-220", name: "Yuki Tanaka", status: "safe", time: "18:50" },
    { id: "R-309", name: "David Kumar", status: "pending", time: "—" },
];

export default function GuestAppPage({ navigate }) {
    const [lang, setLang] = useState("en");
    const [checkedIn, setCheckedIn] = useState([]);
    const [sosSent, setSosSent] = useState(false);
    const [largeText, setLargeText] = useState(false);
    const [scannedGuests, setScannedGuests] = useState(0);
    const content = alerts[lang];

    const baseEm = largeText ? 1.4 : 1;

    const handleQR = (id) => {
        if (!checkedIn.includes(id)) setCheckedIn(prev => [...prev, id]);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-body)", color: "var(--text-strong)", padding: "2rem" }}>
            {/* Header */}
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.04em", marginBottom: "0.5rem" }}>Guest Mobile Experience</h1>
                <p style={{ color: "var(--text-soft)", fontSize: "1.1rem", marginBottom: "3rem" }}>Real-time multilingual alerts, silent SOS, safe check-ins and accessible routing — all in the guest's hand.</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    {/* Left — Live Emergency Card */}
                    <div style={{ background: "rgba(255,51,51,0.08)", border: "1px solid rgba(255,51,51,0.3)", borderRadius: 24, padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                            <span style={{ fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ff6666" }}>🔴 Live Emergency Card</span>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                                <button onClick={() => setLargeText(!largeText)} style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: largeText ? "rgba(0,255,204,0.15)" : "transparent", color: largeText ? "var(--mint)" : "white", cursor: "pointer", fontWeight: 700, marginRight: "0.5rem" }}>
                                    aA
                                </button>
                                {languages.map(l => (
                                    <button key={l.code} onClick={() => setLang(l.code)} title={l.label}
                                        style={{ padding: "4px 8px", borderRadius: 8, border: lang === l.code ? "2px solid var(--mint)" : "1px solid rgba(255,255,255,0.15)", background: lang === l.code ? "rgba(0,255,204,0.15)" : "transparent", cursor: "pointer", fontSize: "1.1rem" }}>
                                        {l.flag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: "rgba(255,51,51,0.15)", borderRadius: 16, padding: "1.5rem" }}>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: `${1.6 * baseEm}rem`, marginBottom: "1rem", direction: lang === "ar" ? "rtl" : "ltr" }}>{content.title}</h2>
                            <p style={{ lineHeight: 1.7, color: "var(--text-light)", fontSize: `${1 * baseEm}rem`, direction: lang === "ar" ? "rtl" : "ltr" }}>{content.body}</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <button onClick={() => setSosSent(true)} style={{ padding: "0.9rem", borderRadius: 12, background: sosSent ? "#333" : "#ff3333", color: "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: `${1 * baseEm}rem`, transition: "all 0.3s" }}>
                                {sosSent ? "✅ Silent SOS Sent — Help Coming" : `🆘 ${content.sos}`}
                            </button>
                            <button style={{ padding: "0.9rem", borderRadius: 12, background: "rgba(0,255,204,0.15)", color: "var(--mint)", border: "1px solid var(--mint)", cursor: "pointer", fontSize: `${1 * baseEm}rem`, fontWeight: 600 }}>📍 {content.route}</button>
                            <button style={{ padding: "0.9rem", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", fontSize: `${1 * baseEm}rem`, fontWeight: 600 }}>✅ {content.checkout}</button>
                        </div>
                    </div>

                    {/* Right — QR Check-in Board */}
                    <div style={{ background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)", borderRadius: 24, padding: "2rem" }}>
                        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>QR Muster Board</h3>
                        <p style={{ color: "var(--text-soft)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Guests scan to mark themselves safe. Staff see headcount update in real-time.</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {qrGuests.map(g => {
                                const isChecked = checkedIn.includes(g.id);
                                const effectiveStatus = isChecked ? "safe" : g.status;
                                const colors = { safe: "#00ffcc", pending: "#ffaa00", sos: "#ff4444" };
                                return (
                                    <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: `1px solid ${colors[effectiveStatus]}33` }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{g.name}</div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>{g.id}</div>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                            <span style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: 999, background: `${colors[effectiveStatus]}22`, color: colors[effectiveStatus], fontWeight: 700 }}>
                                                {effectiveStatus === "safe" ? "✅ Safe" : effectiveStatus === "sos" ? "🆘 SOS" : "⏳ Pending"}
                                            </span>
                                            {effectiveStatus === "pending" && (
                                                <button onClick={() => handleQR(g.id)} style={{ padding: "4px 10px", borderRadius: 8, background: "var(--mint)", color: "#000", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem" }}>QR ✓</button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(0,255,204,0.08)", borderRadius: 12, display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-soft)" }}>Safe check-ins</span>
                            <span style={{ color: "var(--mint)", fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>
                                {qrGuests.filter(g => g.status === "safe" || checkedIn.includes(g.id)).length} / {qrGuests.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Safe Shelter QR Mode */}
                <div style={{ marginTop: "3rem" }}>
                    <div style={{ padding: "2rem", borderRadius: 24, background: "linear-gradient(135deg, rgba(20,25,35,0.9), rgba(0,255,204,0.05))", border: "1px solid rgba(0,255,204,0.3)" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
                            <div style={{ flex: 1, minWidth: 300 }}>
                                <div style={{ display: "inline-flex", padding: "0.4rem 1rem", borderRadius: 999, background: "rgba(0,255,204,0.1)", color: "var(--mint)", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                                    Offline Crisis Fallback
                                </div>
                                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem" }}>Safe Shelter Access QR</h2>
                                <p style={{ color: "var(--text-soft)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                                    If AI systems are down and voice commands fail, partnering businesses and designated safe places activate their Safe Shelter token. People scan this QR code to officially register into the safety network — ensuring nobody is left behind, entirely offline.
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <button onClick={() => setScannedGuests(c => c + 1)} style={{ padding: "0.8rem 1.5rem", borderRadius: 12, background: "var(--mint)", border: "none", cursor: "pointer", fontWeight: 700, color: "black" }}>
                                        Record Civilian (Demo)
                                    </button>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>
                                        Sheltered: <span style={{ color: "var(--mint)" }}>{scannedGuests}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: 180, height: 180, borderRadius: 16, background: "white", padding: "0.5rem", position: "relative", boxShadow: "0 0 30px rgba(0,255,204,0.2)" }}>
                                <QRCode value={`https://aegisstay.app/guest/offline-safe?id=${scannedGuests}`} size={164} style={{ width: "100%", height: "100%" }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accessibility Cards */}
                <div style={{ marginTop: "3rem" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1.5rem" }}>Accessibility & Inclusivity</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                        {[
                            { icon: "♿", title: "Wheelchair-Safe Routes", body: "Alternate evacuation paths avoiding stairs, optimized for mobility aids." },
                            { icon: "👁️", title: "Low-Vision Audio Guide", body: "Voice instructions read out emergency steps automatically." },
                            { icon: "👨‍👩‍👧", title: "Family Group Mode", body: "Keeps all guests in the same booking linked. One confirms, all are marked safe." },
                            { icon: "📡", title: "Offline Resilience", body: "Bluetooth mesh relay and cached route cards work even when Wi-Fi is down." },
                        ].map(c => (
                            <div key={c.title} style={{ padding: "1.5rem", background: "rgba(20,25,35,0.7)", border: "1px solid var(--line-soft)", borderRadius: 20, transition: "all 0.3s", cursor: "default" }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,255,204,0.4)"}
                                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line-soft)"}>
                                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{c.icon}</div>
                                <h4 style={{ fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>{c.title}</h4>
                                <p style={{ color: "var(--text-soft)", lineHeight: 1.6, fontSize: "0.95rem" }}>{c.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <PageNav currentPath="/guest-app" navigate={navigate} />
            </div>
        </div>
    );
}
