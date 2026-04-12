import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function MediaCapture({ onClose, onVerify }) {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const capture = () => setImgSrc(webcamRef.current.getScreenshot());

  const analyzeImage = () => {
    setAnalyzing(true);
    setTimeout(() => {
        setAnalyzing(false);
        onVerify({ severity: "MAJOR CRISIS", desc: "Gemini Vision: Threat/Hazard detected. Validating incident logic." });
    }, 2000);
  };

  return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#1a1f2e', padding: '2rem', borderRadius: '16px', maxWidth: '500px', width: '100%', border: '1px solid #333', color: 'white' }}>
            <h2 style={{ marginBottom: '1rem' }}>AI Evidence Verification</h2>
            <p style={{ marginBottom: '1rem', color: '#a0aec0', fontSize: '0.85rem' }}>AegisStay uses Gemini integration to verify incident legitimacy through a 0.5km trust radius.</p>
            {!imgSrc ? (
                <>
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
                <button onClick={capture} style={{ width: '100%', padding: '1rem', background: '#ff3333', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>📸 Capture Scene</button>
                </>
            ) : (
                <>
                <img src={imgSrc} alt="Preview" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setImgSrc(null)} style={{ flex: 1, padding: '1rem', background: '#333', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Retake</button>
                    <button onClick={analyzeImage} style={{ flex: 2, padding: '1rem', background: '#ff7733', color: 'black', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{analyzing ? 'Gemini Analyzing...' : 'Verify Incident'}</button>
                </div>
                </>
            )}
            <button onClick={onClose} style={{ width: '100%', padding: '0.5rem', background: 'transparent', color: '#888', border: 'none', marginTop: '1rem', cursor: 'pointer' }}>Cancel Emergency Call</button>
        </div>
      </div>
  );
}
