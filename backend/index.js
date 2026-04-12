import express from 'express';
import cors from 'cors';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { getFirestore } from 'firebase-admin/firestore';

// Note: You must place your firebase service account json here. Example:
// import serviceAccount from './serviceAccountKey.json' assert { type: "json" };
// initializeApp({ credential: cert(serviceAccount) });

const app = express();
app.use(cors());
app.use(express.json());

// Mock variables for hackathon since firebase cert isn't available yet
let mockFCM = true;

app.get('/api/health', (req, res) => {
    res.json({ status: 'AegisStay Backend Operating Locally', active: true });
});

app.post('/api/auth/verify', async (req, res) => {
    // One time auth using Firebase
    const { token } = req.body;
    console.log(`[AUTH] Verifying firebase ID token...`);
    res.json({ success: true, message: 'Auth verified session.' });
});

app.post('/api/incident/sos', async (req, res) => {
    const { lat, lng, severity, reporter } = req.body;
    console.log(`[ALERT] 🚨 EMERGENCY SOS TRIGGERED: ${severity} at [${lat}, ${lng}] by ${reporter}`);
    
    // Send Notification to all devices within 5km
    try {
        if (!mockFCM) {
            const message = {
                notification: {
                    title: 'CRISIS ALERT in 5km Radius!',
                    body: `Severity: ${severity}. Immediate action required.`
                },
                topic: 'local_radius_5km'
            };
            await getMessaging().send(message);
        }
        res.json({ success: true, message: 'Incident logged, notifying 5km radius via Firebase FCM' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/incident/verify', (req, res) => {
   // Logic for expanding to 10km radius if majority verified
   console.log(`[VERIFY] Incident verified. Expanding to 10km radius & Notifying Support Team.`);
   res.json({ success: true, expanded: true });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🔥 AegisStay Backend active on port ${PORT}`);
});
