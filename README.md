# Apex Response / AegisStay
**Accelerated Emergency Response and Crisis Coordination using Web3 & AI**

AegisStay solves a critical problem in the hospitality and infrastructure industry: **fragmented communication and verification during crises.** By blending decentralized blockchain identity (Soulbound Tokens) with AI-powered triaging (Gemini) and offline resiliency (QR nodes), AegisStay provides an unbreakable emergency network for guests and responders.

## 🚀 Key Features

### 1. Web3 Identity & Reputation
*   **Soulbound Tokens (SBT):** Verified responders and staff are minted a non-transferable SBT via Hardhat/MetaMask.
*   **Decentralized Verification:** Distress calls require consensus verification from the 50 nearest node-holders before triggering an irreversible 10km grid-wide alert, eliminating spoofed emergencies.
*   **Firebase Binding:** MetaMask wallets automatically bind to persistent Firebase Anonymous UUID profiles for seamless cross-platform identity mapping without massive onboarding friction.

### 2. Gemini AI Voice Triage
*   **Voice Fallback Engine:** Features a browser-resilient `SpeechRecognition` pipeline that triages crisis intensity using Gemini AI.
*   **Auto-Trigger:** If Gemini categorizes speech patterns or text as a severe risk level, it automatically initiates the Web3 50-node broadcast protocol.
*   **Simulated Resilience:** Automatically executes pre-programmed semantic pipelines if microphone access is disabled or offline, making it highly demo-able.

### 3. Offline Responder Mechanics
*   **Digital Knox Box:** Incoming emergency crews receive a secure responder link populated with Live CCTV snaps, hydrant grids, and chemical hazard ledgers.
*   **Safe Shelter QR:** When power grids fail, local businesses can deploy the "Safe Shelter Access QR" node to legally check-in guests offline.

---

## 📂 Architecture

```text
src/
├── App.jsx                # Main routing framework
├── context/
│   └── Web3Context.jsx    # Blockchain integration & Firebase Auth pipeline
├── components/
│   ├── AIAdvisePage.jsx   # Gemini voice recognition & distress intelligence
│   ├── ProfilePage.jsx    # User Reputation & SBT rendering module
│   ├── RespondersPage.jsx # Digital Knox Box & Safe Shelter QR nodes
│   └── GuestAppPage.jsx   # Live routing UI for active guests
├── firebaseConfig.js      # Environment-secured Firebase credentials
```

## 🛠️ Installation & Execution
This repository utilizes a full-stack infrastructure including a local Ethers.js block. 

### Prerequisites
*   Node.js & npm
*   MetaMask browser extension

### 1. Envorionment Setup
Copy the `.env.example` file securely into a new file named `.env`:
```bash
cp .env.example .env
```
Fill in your active `VITE_GEMINI_KEY` and Firebase variables into the `.env` file. These are explicitly excluded from `.gitignore`.

### 2. Build Instructions
Open **three parallel terminals** to launch the environment.

**Terminal 1 (Blockchain RPC Node)**
```bash
cd blockchain
npm install
npx hardhat node
```

**Terminal 2 (Smart Contract Deployer)**
*Wait for Terminal 1 to be fully live, then deploy:*
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

**Terminal 3 (Vite Front-end)**
```bash
npm install
npm run dev
```

Connect MetaMask to `http://127.0.0.1:8545` (Chain ID: 31337) with the first Hardhat account to mint your Responder Soulbound Tokens flawlessly!
