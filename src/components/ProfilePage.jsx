import { useEffect, useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import PageNav from "./PageNav";

export default function ProfilePage({ navigate }) {
    const { account, reputation, firebaseUser, connectApp } = useWeb3();

    // Simulated SBT badges
    const sbtBadges = [
        { id: 1, title: "Aegis Crisis Responder", date: "2026-04-11", iconUrl: "/sbt_badge.png", desc: "Verified response participation in 10+ alerts." },
        { id: 2, title: "First-Aid Certified", date: "2025-11-20", icon: "⚕️", desc: "Successfully completed medical triage verification." }
    ];

    if (!account) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--bg-body)", color: "var(--text-strong)", padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", padding: "3rem", background: "rgba(20,25,35,0.8)", border: "1px solid var(--line-soft)", borderRadius: 24, maxWidth: 500 }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🦊</div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem" }}>Connect Wallet Required</h2>
                    <p style={{ color: "var(--text-soft)", lineHeight: 1.6, marginBottom: "2rem" }}>
                        Please connect your MetaMask wallet via the top bar or the button below to view your AegisStay identity, reputation, and Soulbound Tokens.
                    </p>
                    <button onClick={connectApp} style={{ padding: "0.85rem 2rem", borderRadius: 12, background: "rgba(0,255,204,0.15)", border: "1px solid var(--mint)", color: "var(--mint)", fontWeight: 700, cursor: "pointer", fontSize: "1.1rem" }}>
                        🦊 Connect with MetaMask
                    </button>
                    <div style={{ marginTop: "2rem" }}><PageNav currentPath="/profile" navigate={navigate} /></div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-body)", color: "var(--text-strong)", padding: "2rem" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", letterSpacing: "-0.04em", marginBottom: "1.5rem" }}>
                    Hero Identity
                </h1>

                {/* Profile Overview Card */}
                <div style={{ padding: "2rem", borderRadius: 24, background: "rgba(20,25,35,0.8)", border: "1px solid var(--mint)", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap", marginBottom: "2rem", boxShadow: "0 0 30px rgba(0,255,204,0.05)" }}>
                    <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, var(--mint), #00bfff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", boxShadow: "0 0 20px rgba(0,255,204,0.2)" }}>
                        🧑‍🚀
                    </div>
                    <div style={{ flex: 1, minWidth: 250 }}>
                        <h2 style={{ fontFamily: "monospace", fontSize: "1.2rem", color: "white", marginBottom: "0.5rem" }}>
                            {account}
                        </h2>
                        <div style={{ display: "flex", gap: "1rem", color: "var(--text-soft)", fontSize: "0.9rem", flexWrap: "wrap" }}>
                            <div style={{ padding: "0.4rem 0.8rem", borderRadius: 8, background: "rgba(255,255,255,0.05)" }}>
                                🛡️ Verified Responder Role
                            </div>
                            <div style={{ padding: "0.4rem 0.8rem", borderRadius: 8, background: "rgba(255,255,255,0.05)" }}>
                                🔗 1-Time Firebase Auth Active
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--text-soft)", fontSize: "0.9rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Reputation Points</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", color: "var(--mint)", lineHeight: 1 }}>{reputation}</div>
                        <div style={{ color: "var(--mint)", fontSize: "0.8rem", fontWeight: 700 }}>FCR / On-chain</div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
                    
                    {/* Data Authentication Info */}
                    <div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "1rem" }}>Identity Layer Sync</h3>
                        <div style={{ padding: "1.5rem", borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1rem" }}>
                                <span style={{ color: "var(--text-soft)" }}>Web3 Wallet (MetaMask)</span>
                                <span style={{ padding: "0.2rem 0.6rem", borderRadius: 6, background: "rgba(0,255,204,0.15)", color: "var(--mint)", fontSize: "0.75rem", fontWeight: 700 }}>✅ CONNECTED</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: "1rem" }}>
                                <span style={{ color: "var(--text-soft)" }}>Firebase Cloud Auth</span>
                                <span style={{ padding: "0.2rem 0.6rem", borderRadius: 6, background: firebaseUser ? "rgba(0,255,204,0.15)" : "rgba(255,170,0,0.1)", color: firebaseUser ? "var(--mint)" : "#ffaa00", fontSize: "0.75rem", fontWeight: 700 }}>{firebaseUser ? "✅ LINKED" : "⚠️ PENDING"}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "var(--text-soft)" }}>Decentralized ID (DID)</span>
                                <span style={{ fontFamily: "monospace", color: "var(--text-light)", fontSize: "0.8rem" }}>did:ethr:{account.substring(0,6)}...</span>
                            </div>
                            <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                                AegisStay uses a one-time Firebase authentication handshake bound transparently to your Web3 wallet signature, ensuring resilient local-first identity even without mobile networks.
                            </p>
                        </div>
                    </div>

                    {/* SBT Badges */}
                    <div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "1rem" }}>Soulbound Tokens (SBT)</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {sbtBadges.map(b => (
                                <div key={b.id} style={{ display: "flex", gap: "1.25rem", padding: "1.25rem", borderRadius: 20, background: "linear-gradient(135deg, rgba(20,25,35,0.9), rgba(0,191,255,0.05))", border: "1px solid rgba(0,191,255,0.2)", alignItems: "center" }}>
                                    {b.iconUrl ? (
                                        <img src={b.iconUrl} alt="SBT Badge" style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 10, border: "2px solid rgba(0,191,255,0.4)", boxShadow: "0 0 15px rgba(0,191,255,0.3)" }} />
                                    ) : (
                                        <div style={{ fontSize: "2.5rem", WebkitFilter: "drop-shadow(0 0 10px rgba(0,191,255,0.5))" }}>{b.icon}</div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                                            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#00bfff" }}>{b.title}</div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-soft)" }}>Minted: {b.date}</div>
                                        </div>
                                        <div style={{ color: "var(--text-light)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                                            {b.desc}
                                            <br/>
                                            <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace", fontSize: "0.7rem", marginTop: "0.3rem", display: "inline-block" }}>NON-TRANSFERABLE SBT • ON-CHAIN</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {reputation >= 50 && (
                                <div style={{ display: "flex", gap: "1rem", padding: "1.25rem", borderRadius: 20, background: "linear-gradient(135deg, rgba(20,25,35,0.9), rgba(255,170,0,0.08))", border: "1px dashed #ffaa00" }}>
                                    <div style={{ fontSize: "2.5rem", WebkitFilter: "drop-shadow(0 0 10px rgba(255,170,0,0.5))", alignSelf: "center" }}>🦸</div>
                                    <div>
                                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#ffaa00", marginBottom: "0.2rem" }}>Aegis Commendation</div>
                                        <div style={{ color: "var(--text-light)", fontSize: "0.85rem", lineHeight: 1.5 }}>Awarded for verifying a critical distress incident.</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <PageNav currentPath="/profile" navigate={navigate} />
            </div>
        </div>
    );
}
