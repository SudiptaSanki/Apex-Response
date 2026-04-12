import { useState, useEffect, useRef, useCallback } from "react";
import { useWeb3 } from "../context/Web3Context";
import PageNav from "./PageNav";

// ── Simulated nearby responders ──
const NEARBY_RESPONDERS = [
  { id: 1, name: "Priya Sharma", dist: "0.3km", zone: "Central Business District" },
  { id: 2, name: "Raj Gupta",    dist: "0.6km", zone: "Waterfront District" },
  { id: 3, name: "Fatima K.",    dist: "0.8km", zone: "West Quarter" },
  { id: 4, name: "Chen Wei",     dist: "1.1km", zone: "Event Quarter" },
  { id: 5, name: "Maria L.",     dist: "1.4km", zone: "Shopping District" },
  { id: 6, name: "Arjun Singh",  dist: "1.7km", zone: "Central Business District" },
  { id: 7, name: "Yuki T.",      dist: "2.0km", zone: "Waterfront District" },
  { id: 8, name: "David K.",     dist: "2.3km", zone: "West Quarter" },
  { id: 9, name: "Sara Ali",     dist: "2.6km", zone: "Event Quarter" },
  { id: 10,"name": "Omar P.",    dist: "2.9km", zone: "Shopping District" },
];

const FIREBASE_ZONES = [
  { name: "Central Business District", people: 214, alerted: false, color: "#00ffcc" },
  { name: "Waterfront District",       people: 88,  alerted: false, color: "#00bfff" },
  { name: "Event Quarter",             people: 560, alerted: false, color: "#ff7733" },
  { name: "West Quarter",              people: 130, alerted: false, color: "#aa88ff" },
  { name: "Shopping District",         people: 820, alerted: false, color: "#ffaa00" },
];

// ── Gemini API wrapper (real call with fallback) ──
async function callGemini(prompt) {
  const API_KEY = import.meta.env.VITE_GEMINI_KEY || "";
  if (!API_KEY) {
    // Simulated response for demo
    await new Promise(r => setTimeout(r, 1200));
    return simulateGeminiResponse(prompt);
  }
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    );
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || simulateGeminiResponse(prompt);
  } catch { return simulateGeminiResponse(prompt); }
}

function simulateGeminiResponse(prompt) {
  const lower = prompt.toLowerCase();
  const isDistress = lower.includes("help") || lower.includes("fire") || lower.includes("danger") ||
    lower.includes("emergency") || lower.includes("attack") || lower.includes("hurt") ||
    lower.includes("smoke") || lower.includes("flood") || lower.includes("stuck") ||
    lower.includes("threat") || lower.includes("distress");

  if (isDistress) {
    return `⚠️ DISTRESS DETECTED — I've analyzed your message and identified a possible emergency situation.\n\n**Immediate Actions:**\n• Stay calm and move to a safe location away from the threat\n• Do NOT use elevators — use nearest stairwell\n• If fire/smoke: stay low, cover mouth with cloth\n• If security threat: lock door, stay silent, send quiet SOS\n\n**AegisStay Protocol:**\nYour location has been flagged. I'm triggering verification with the 50 nearest verified responders in your area. Once confirmed, a 10km region alert will be broadcasted via Firebase to all registered users.\n\n**Stay on the line. Help is coordinating.** 🚨`;
  }
  return `✅ **AegisStay AI Advisory**\n\nThank you for your query: "${prompt.slice(0, 60)}..."\n\n**General Safety Advice:**\n• In any hotel emergency, first check your evacuation map (usually on the back of your door)\n• Assembly point for this property: Main Lobby / Parking P1\n• Emergency contact: Front Desk ext. 0 | Security ext. 9\n\n**AegisStay Status:**\nNo active alerts in your immediate 500m radius. All building systems normal. Stay aware of NWS weather alerts for your region.`;
}

function analyzeDistressVoice(transcript) {
  const DISTRESS_WORDS = ["help", "fire", "danger", "attack", "emergency", "hurt", "smoke", "flood", "stuck", "please help", "call police", "threat", "gun", "knife", "scared", "save me"];
  const score = DISTRESS_WORDS.filter(w => transcript.toLowerCase().includes(w)).length;
  return { isDistress: score >= 1, score, level: score >= 3 ? "CRITICAL" : score >= 1 ? "HIGH" : "NORMAL" };
}

// ── Verification animation state machine ──
const PHASES = ["idle", "listening", "analyzing", "confirming", "verifying", "broadcasting", "complete"];

export default function AIAdvisePage({ navigate }) {
  const { account, connectApp, dispatchOnChainSOS, reputation } = useWeb3();

  // ── Core state ──
  const [phase, setPhase]           = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [inputText, setInputText]   = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [distressAnalysis, setDistressAnalysis] = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);  // 0-100
  const [verifiedCount, setVerifiedCount]   = useState(0);   // out of 50
  const [firebaseZones, setFirebaseZones]   = useState(FIREBASE_ZONES);
  const [chainTxHash, setChainTxHash]       = useState(null);
  const [audioLevel, setAudioLevel]         = useState(0);
  const [errorMsg, setErrorMsg]             = useState("");
  const [mode, setMode]                     = useState("text"); // "text" | "voice"

  const recognitionRef = useRef(null);
  const progressTimerRef = useRef(null);
  const audioAnimRef = useRef(null);

  // ── 1. Finalize Flow ──
  const finalizeCrisis = useCallback(async () => {
    setPhase("broadcasting");

    if (account) {
      const success = await dispatchOnChainSOS(50, "ipfs://AIDistressVerified");
      if (success) setChainTxHash(`0x${Math.random().toString(16).slice(2, 18)}...`);
    }

    FIREBASE_ZONES.forEach((_, i) => {
      setTimeout(() => {
        setFirebaseZones(prev => prev.map((z, idx) => idx === i ? { ...z, alerted: true } : z));
      }, i * 600);
    });

    await new Promise(r => setTimeout(r, 3500));
    setPhase("complete");
  }, [account, dispatchOnChainSOS]);

  // ── 2. Trigger Verification Flow ──
  const triggerVerificationFlow = useCallback(async () => {
    setPhase("confirming");
    await new Promise(r => setTimeout(r, 1500));
    setPhase("verifying");

    let count = 0;
    const total = 50;
    const duration = 7000;
    const interval = duration / total;

    progressTimerRef.current = setInterval(() => {
      count++;
      setVerifiedCount(count);
      setVerifyProgress(Math.round((count / total) * 100));
      if (count >= total) {
        clearInterval(progressTimerRef.current);
        finalizeCrisis();
      }
    }, interval);
  }, [finalizeCrisis]);

  // ── 3. Core analysis flow ──
  const analyzeAndRespond = useCallback(async (text, fromVoice = false) => {
    if (!text.trim()) return;
    setIsLoading(true);
    setPhase("analyzing");
    setAiResponse("");
    setDistressAnalysis(null);
    setVerifyProgress(0);
    setVerifiedCount(0);
    setChainTxHash(null);
    setFirebaseZones(FIREBASE_ZONES);

    const analysis = analyzeDistressVoice(text);
    setDistressAnalysis(analysis);

    const prompt = fromVoice
      ? `A person said via voice in an emergency app: "${text}". Analyze if this is a distress call. If distress, give immediate safety advice and explain what AegisStay will do. If not distress, give general safety advice.`
      : `AegisStay Crisis AI: The user typed: "${text}". Give calm, clear emergency advice. Check if it's a distress situation and recommend actions.`;
    const response = await callGemini(prompt);
    setAiResponse(response);
    setIsLoading(false);

    if (analysis.isDistress) {
      setTimeout(() => triggerVerificationFlow(), 800);
    } else {
      setPhase("idle");
    }
  }, [triggerVerificationFlow]);

  const handleTextSubmit = () => {
    if (!inputText.trim()) return;
    analyzeAndRespond(inputText, false);
    setInputText("");
  };

  // ── 4. Voice recording setup ──
  const stopVoice = useCallback((isSimulated = false, simulatedTranscript = "") => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
    setVoiceActive(false);
    clearInterval(audioAnimRef.current);
    setAudioLevel(0);
    
    const finalTranscript = isSimulated ? simulatedTranscript : transcript;
    if (finalTranscript.trim()) {
        setTranscript(finalTranscript);
        analyzeAndRespond(finalTranscript, true);
    }
  }, [transcript, analyzeAndRespond]);

  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setErrorMsg("");
    
    if (!SR) {
      setVoiceActive(true);
      setPhase("listening");
      setTranscript("");
      audioAnimRef.current = setInterval(() => {
        setAudioLevel(Math.random() * 70 + 30);
      }, 200);
      setTimeout(() => {
        stopVoice(true, "Help, there is a fire in the corridor and we are trapped!");
      }, 4000);
      return;
    }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => { setVoiceActive(true); setPhase("listening"); setErrorMsg(""); };
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join(" ");
      setTranscript(t);
      setAudioLevel(Math.random() * 70 + 30);
    };
    rec.onerror = (e) => { 
      console.warn("Speech API error, falling back to simulation.", e.error);
      stopVoice(true, "Help, there is a fire in the corridor and we are trapped!");
    };
    recognitionRef.current = rec;
    
    try {
      rec.start();
    } catch (err) {
      console.warn("Speech API denied or failed to start, actively simulating...", err);
      setVoiceActive(true);
      setPhase("listening");
      setTranscript("");
      audioAnimRef.current = setInterval(() => {
        setAudioLevel(Math.random() * 70 + 30);
      }, 200);
      setTimeout(() => {
        stopVoice(true, "Help, there is a fire in the corridor and we are trapped!");
      }, 4000);
      return;
    }

    audioAnimRef.current = setInterval(() => {
      setAudioLevel(prev => Math.min(100, Math.max(10, prev + (Math.random() - 0.5) * 30)));
    }, 200);
  }, [stopVoice]);

  // ── Manual trigger button flow ──
  const manualTrigger = async () => {
    setDistressAnalysis({ isDistress: true, score: 5, level: "CRITICAL" });
    setAiResponse("🆘 **Manual SOS Activated**\n\nYou have manually triggered the AegisStay distress protocol.\n\n**Immediate Actions:**\n• Stay where you are if it is safe to do so\n• Alert nearby staff immediately\n• The system is now coordinating your 50 nearest verified responders\n\n**Status: BROADCASTING TO 10km REGION** 🚨");
    setPhase("confirming");
    await new Promise(r => setTimeout(r, 1000));
    triggerVerificationFlow();
  };

  // ── Reset ──
  const reset = () => {
    clearInterval(progressTimerRef.current);
    clearInterval(audioAnimRef.current);
    recognitionRef.current?.stop();
    setPhase("idle"); setTranscript(""); setInputText(""); setAiResponse("");
    setDistressAnalysis(null); setVoiceActive(false); setVerifyProgress(0);
    setVerifiedCount(0); setChainTxHash(null); setFirebaseZones(FIREBASE_ZONES);
    setAudioLevel(0); setErrorMsg("");
  };

  useEffect(() => () => {
    clearInterval(progressTimerRef.current);
    clearInterval(audioAnimRef.current);
    recognitionRef.current?.stop();
  }, []);

  // ── Derived ──
  const isActive     = phase !== "idle";
  const isVerifying  = phase === "verifying";
  const isBroadcast  = phase === "broadcasting" || phase === "complete";
  const isComplete   = phase === "complete";

  return (
    <div style={{ color: "var(--text-strong)", minHeight: "100vh", background: "var(--bg-body)" }}>

      {/* ══ PAGE HERO ══ */}
      <section style={{ padding: "3rem 2.5rem 2rem", background: "radial-gradient(ellipse at 30% 0%, rgba(255,51,51,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(170,136,255,0.1) 0%, transparent 50%), var(--bg-dark)", borderBottom: "1px solid rgba(255,51,51,0.15)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,51,51,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,51,51,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: 999, background: "rgba(255,51,51,0.12)", border: "1px solid rgba(255,51,51,0.3)", marginBottom: "1.25rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff3333", animation: "pulse-red 1.5s infinite" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#ff6666" }}>AegisStay AI Crisis Advisor</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,4rem)", letterSpacing: "-0.05em", lineHeight: 1.05, marginBottom: "1rem" }}>
            AI-Powered<br /><span style={{ color: "#ff6666" }}>Distress Detection</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "60ch" }}>
            Speak or type your situation. Gemini AI detects distress in real-time, verifies with 50 nearest responders, and broadcasts a 10km Firebase alert — all in one seamless flow.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2.5rem 2.5rem" }}>

        {/* ══ MODE SWITCHER ══ */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
          {[{ id: "text", icon: "⌨️", label: "Text Input" }, { id: "voice", icon: "🎙️", label: "Voice Detection" }, { id: "manual", icon: "🆘", label: "Manual SOS" }].map(m => (
            <button key={m.id} onClick={() => { reset(); setMode(m.id); if (m.id === "manual") manualTrigger(); }}
              style={{ padding: "0.65rem 1.5rem", borderRadius: 12, border: `2px solid ${mode === m.id ? "#ff4444" : "rgba(255,255,255,0.1)"}`, background: mode === m.id ? "rgba(255,68,68,0.15)" : "rgba(255,255,255,0.03)", color: mode === m.id ? "#ff6666" : "rgba(255,255,255,0.6)", cursor: "pointer", fontWeight: 700, transition: "all 0.25s", fontSize: "0.9rem" }}>
              {m.icon} {m.label}
            </button>
          ))}
          {/* Wallet status */}
          <button onClick={connectApp} style={{ marginLeft: "auto", padding: "0.65rem 1.25rem", borderRadius: 12, border: `1px solid ${account ? "rgba(0,255,204,0.4)" : "rgba(255,255,255,0.12)"}`, background: account ? "rgba(0,255,204,0.08)" : "transparent", color: account ? "var(--mint)" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
            {account ? `🟢 ${account.substring(0, 8)}... (${reputation} FCR)` : "🦊 Connect Wallet"}
          </button>
        </div>

        {/* ══ TEXT INPUT ══ */}
        {mode === "text" && !isActive && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ position: "relative" }}>
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleTextSubmit())}
                placeholder="Describe your situation... (e.g. 'There is smoke coming from the kitchen on level 2 and guests are panicking')"
                rows={4}
                style={{ width: "100%", padding: "1.25rem", borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(20,25,35,0.8)", color: "white", fontSize: "1rem", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "rgba(255,68,68,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"} />
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
              <button onClick={handleTextSubmit} disabled={!inputText.trim()}
                style={{ flex: 1, padding: "0.85rem", borderRadius: 12, background: inputText.trim() ? "linear-gradient(135deg, #ff4444, #cc0000)" : "rgba(255,255,255,0.06)", border: "none", color: "white", fontWeight: 700, cursor: inputText.trim() ? "pointer" : "default", fontSize: "1rem", transition: "all 0.3s" }}>
                🤖 Analyze with Gemini AI
              </button>
              <button onClick={() => { setMode("voice"); reset(); }}
                style={{ padding: "0.85rem 1.5rem", borderRadius: 12, background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontWeight: 600 }}>
                🎙️ Switch to Voice
              </button>
            </div>
          </div>
        )}

        {/* ══ VOICE UI ══ */}
        {mode === "voice" && !isActive && (
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            {/* Big mic button */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: "1.5rem" }}>
              {/* Ripples when active */}
              {voiceActive && [1, 2, 3].map(i => (
                <div key={i} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 80 + i * 40, height: 80 + i * 40, borderRadius: "50%", border: "2px solid rgba(255,51,51,0.4)", animation: `ripple ${i * 0.4 + 0.6}s ease-out infinite`, animationDelay: `${i * 0.2}s` }} />
              ))}
              <button onClick={voiceActive ? stopVoice : startVoice}
                style={{ width: 100, height: 100, borderRadius: "50%", border: `4px solid ${voiceActive ? "#ff4444" : "rgba(255,68,68,0.5)"}`, background: voiceActive ? "rgba(255,51,51,0.25)" : "rgba(20,25,35,0.9)", cursor: "pointer", fontSize: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", boxShadow: voiceActive ? "0 0 40px rgba(255,51,51,0.5)" : "none", position: "relative", zIndex: 1 }}>
                {voiceActive ? "⏹️" : "🎙️"}
              </button>
            </div>

            {/* Audio waveform visualization */}
            {voiceActive && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 48, marginBottom: "1rem" }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} style={{ width: 4, borderRadius: 2, background: "#ff4444", height: `${10 + Math.random() * audioLevel * 0.5}%`, transition: "height 0.15s ease", minHeight: 4, maxHeight: 44 }} />
                ))}
              </div>
            )}

            <div style={{ color: voiceActive ? "#ff6666" : "rgba(255,255,255,0.5)", fontWeight: voiceActive ? 700 : 400, fontSize: "0.95rem", marginBottom: "1rem" }}>
              {voiceActive ? "🔴 Listening for distress... say anything" : "Tap microphone to begin — AI will analyze for distress patterns"}
            </div>

            {transcript && (
              <div style={{ padding: "1rem 1.5rem", borderRadius: 16, background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.25)", textAlign: "left", fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: "1rem" }}>
                <span style={{ fontWeight: 700, color: "#ff6666", display: "block", marginBottom: "0.4rem", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Live Transcript</span>
                {transcript}
              </div>
            )}

            {transcript && !voiceActive && (
              <button onClick={() => analyzeAndRespond(transcript, true)}
                style={{ padding: "0.85rem 2rem", borderRadius: 12, background: "linear-gradient(135deg, #ff4444, #cc0000)", border: "none", color: "white", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>
                🤖 Analyze Transcript
              </button>
            )}

            {errorMsg && (
              <div style={{ padding: "1rem", borderRadius: 12, background: "rgba(255,170,0,0.1)", border: "1px solid rgba(255,170,0,0.3)", marginTop: "1.5rem" }}>
                <div style={{ color: "#ffaa00", fontSize: "0.9rem", marginBottom: "0.75rem", fontWeight: 600 }}>{errorMsg}</div>
                <button onClick={() => { setErrorMsg(""); analyzeAndRespond("Help, there's a big fire here and smoke is everywhere!", true); }}
                  style={{ padding: "0.6rem 1.25rem", borderRadius: 8, background: "rgba(255,170,0,0.2)", border: "1px solid rgba(255,170,0,0.4)", color: "#ffaa00", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem" }}>
                  💉 Inject Mock Voice Command (Demo)
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══ LOADING STATE ══ */}
        {isLoading && (
          <div style={{ padding: "2rem", borderRadius: 20, background: "rgba(170,136,255,0.06)", border: "1px solid rgba(170,136,255,0.2)", textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", animation: "float 2s ease-in-out infinite" }}>🤖</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "#aa88ff", marginBottom: "0.5rem" }}>Gemini AI Analyzing...</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Detecting distress patterns • Cross-referencing emergency protocols</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "1.25rem" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#aa88ff", animation: `pulse-red 1.2s infinite`, animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* ══ AI RESPONSE ══ */}
        {aiResponse && (
          <div style={{ marginBottom: "2rem", padding: "1.75rem", borderRadius: 20, background: distressAnalysis?.isDistress ? "rgba(255,51,51,0.08)" : "rgba(0,255,204,0.05)", border: `1px solid ${distressAnalysis?.isDistress ? "rgba(255,51,51,0.3)" : "rgba(0,255,204,0.2)"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🤖</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700 }}>Gemini AI Response</span>
              {distressAnalysis && (
                <span style={{ marginLeft: "auto", padding: "0.3rem 0.9rem", borderRadius: 999, background: distressAnalysis.isDistress ? "rgba(255,51,51,0.2)" : "rgba(0,255,204,0.12)", color: distressAnalysis.isDistress ? "#ff6666" : "var(--mint)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {distressAnalysis.isDistress ? `⚠️ ${distressAnalysis.level} DISTRESS` : "✅ Normal"}
                </span>
              )}
            </div>
            <div style={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.8, fontSize: "0.97rem", whiteSpace: "pre-line" }}>
              {aiResponse}
            </div>
          </div>
        )}

        {/* ══ CONFIRMATION PHASE ══ */}
        {phase === "confirming" && (
          <div style={{ padding: "2rem", borderRadius: 20, background: "rgba(255,170,0,0.08)", border: "1px solid rgba(255,170,0,0.3)", textAlign: "center", marginBottom: "2rem", animation: "slide-in 0.4s ease-out" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "#ffaa00", marginBottom: "0.5rem" }}>Distress Confirmed — Initiating Protocol</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem" }}>Alerting 50 nearest verified responders within your region...</p>
          </div>
        )}

        {/* ══ VERIFICATION ANIMATION ══ */}
        {(isVerifying || isBroadcast || isComplete) && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ padding: "2rem", borderRadius: 20, background: "rgba(255,51,51,0.06)", border: "1px solid rgba(255,51,51,0.25)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "0.25rem" }}>
                    {isComplete ? "✅ All 50 Responders Verified" : `🔄 Verifying: ${verifiedCount} / 50`}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
                    {isComplete ? "Crisis confirmed. 10km alert broadcasted." : "Nearest verified responders acknowledging your distress signal..."}
                  </p>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: isComplete ? "var(--mint)" : "#ff6666" }}>
                  {verifyProgress}%
                </div>
              </div>

              {/* Main progress bar */}
              <div style={{ height: 16, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden", marginBottom: "1.25rem", position: "relative" }}>
                <div style={{ height: "100%", width: `${verifyProgress}%`, background: isComplete ? "linear-gradient(90deg, var(--mint), #00ff88)" : "linear-gradient(90deg, #ff4444, #ff7733)", borderRadius: 999, transition: "width 0.15s ease", boxShadow: isComplete ? "0 0 15px rgba(0,255,204,0.5)" : "0 0 15px rgba(255,68,68,0.5)" }} />
              </div>

              {/* Responder grid — shows up to 10 avatar dots */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                {NEARBY_RESPONDERS.slice(0, 10).map((r, i) => {
                  const isVerified = verifiedCount > i * 5;
                  return (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.8rem", borderRadius: 999, background: isVerified ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${isVerified ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.08)"}`, transition: "all 0.4s", fontSize: "0.78rem", color: isVerified ? "#00ff88" : "rgba(255,255,255,0.4)" }}>
                      <span>{isVerified ? "✅" : "⏳"}</span>
                      <span style={{ fontWeight: isVerified ? 700 : 400 }}>{r.name}</span>
                      <span style={{ opacity: 0.6 }}>· {r.dist}</span>
                    </div>
                  );
                })}
                {verifiedCount > 10 && (
                  <div style={{ padding: "0.4rem 0.8rem", borderRadius: 999, background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.4)", fontSize: "0.78rem", color: "#00ff88", fontWeight: 700 }}>
                    +{verifiedCount - 10} more verified
                  </div>
                )}
              </div>

              {chainTxHash && (
                <div style={{ padding: "0.75rem 1rem", borderRadius: 12, background: "rgba(0,255,204,0.08)", border: "1px solid rgba(0,255,204,0.2)", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ color: "var(--mint)", fontWeight: 700 }}>⛓️ On-Chain TX:</span>
                  <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.7)" }}>{chainTxHash}</span>
                  <span style={{ marginLeft: "auto", padding: "2px 8px", borderRadius: 999, background: "rgba(0,255,204,0.15)", color: "var(--mint)", fontSize: "0.72rem", fontWeight: 700 }}>CONFIRMED</span>
                </div>
              )}
            </div>

            {/* ══ FIREBASE 10KM ZONE ALERTS ══ */}
            {isBroadcast && (
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "1rem" }}>
                  📡 Firebase Alert — 10km Region Broadcast
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                  {firebaseZones.map(z => (
                    <div key={z.name} style={{ padding: "1rem", borderRadius: 16, background: z.alerted ? `${z.color}12` : "rgba(255,255,255,0.03)", border: `1px solid ${z.alerted ? `${z.color}55` : "rgba(255,255,255,0.08)"}`, transition: "all 0.5s", boxShadow: z.alerted ? `0 0 20px ${z.color}22` : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: z.alerted ? z.color : "rgba(255,255,255,0.2)", transition: "all 0.5s", boxShadow: z.alerted ? `0 0 8px ${z.color}` : "none", animation: z.alerted ? "pulse-red 1.5s infinite" : "none" }} />
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: z.alerted ? z.color : "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          {z.alerted ? "ALERTED" : "PENDING"}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.2rem", color: z.alerted ? "white" : "rgba(255,255,255,0.5)" }}>{z.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{z.people.toLocaleString()} people</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ COMPLETE BANNER ══ */}
        {isComplete && (
          <div style={{ padding: "2rem", borderRadius: 20, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem", animation: "slide-in 0.5s ease-out" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "#00ff88", marginBottom: "0.4rem" }}>
                ✅ Crisis Protocol Complete
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                50 responders verified · Blockchain SBT minted · 5 city zones alerted via Firebase
              </p>
            </div>
            <button onClick={reset} style={{ padding: "0.75rem 1.75rem", borderRadius: 12, background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.4)", color: "#00ff88", fontWeight: 700, cursor: "pointer" }}>
              🔄 New Incident
            </button>
          </div>
        )}

        {/* ══ HOW IT WORKS ══ */}
        {!isActive && (
          <div style={{ marginTop: "2rem", padding: "2rem", borderRadius: 20, background: "rgba(20,25,35,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.25rem" }}>How the AI Distress Flow Works</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              {[
                { n: "1", icon: "🎙️", label: "Detect",    desc: "Voice or text analyzed by Gemini AI for distress keywords and patterns" },
                { n: "2", icon: "🤖", label: "Analyze",   desc: "Gemini classifies severity and provides immediate safety advice" },
                { n: "3", icon: "👥", label: "Verify",    desc: "50 nearest verified responders acknowledge within 7 seconds" },
                { n: "4", icon: "⛓️", label: "Chain TX",  desc: "Blockchain SBT minted, incident recorded immutably on Hardhat" },
                { n: "5", icon: "📡", label: "Broadcast", desc: "Firebase FCM alert sent to all users in 10km radius across city zones" },
              ].map(s => (
                <div key={s.n} style={{ padding: "1.25rem", borderRadius: 16, background: "rgba(255,51,51,0.05)", border: "1px solid rgba(255,51,51,0.12)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -8, right: 8, fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 900, opacity: 0.05, color: "#ff4444" }}>{s.n}</div>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, color: "#ff8888", fontSize: "0.88rem", marginBottom: "0.3rem" }}>{s.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <PageNav currentPath="/ai-advisor" navigate={navigate} />
      </div>

      {/* CSS for ripple animation */}
      <style>{`
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
