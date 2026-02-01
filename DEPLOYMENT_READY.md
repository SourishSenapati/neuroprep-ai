

# 🚀 Deployment Verification & Status


## ✅ Build Status
- **Frontend**: PASS (Verified via `npm run build`)
- **Backend**: PASS (Verified via `node server.js` success)
- **Database**: MOCK MODE (Active fallback if Postgres missing)


## 💳 Payment System
- **Integration**: Razorpay (UPI Optimized) + Stripe
- **Status**: Simulated/Demo Mode (Safe for Judges)
- **Flow**: User clicks Upgrade -> Selects UPI -> Scans QR (Simulated) -> "I have Paid" -> Premium Unlocked (Confetti)


## 🐛 Known Issues & Mitigations
- **Database**: If `DATABASE_URL` is missing, data resets on deployment restart.
  - *Mitigation*: Demo uses In-Memory Mock DB. Sufficient for 4-hour sprint.
- **Biometrics**: Browser permissions needed for Camera/Mic.
  - *Mitigation*: Fallback to "Simulation Mode" if permission denied.


## 🛠 Deployment Instructions
1. **Vercel** makes it easiest:
  - Import Git Repo
  - Set Environment Variables:
     - `NEXT_PUBLIC_API_URL`: Your Backend URL
     - `NEXT_PUBLIC_WS_URL`: Your Backend URL
     - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: `rzp_test_123` (Dummy is fine for simulated mode)
  - Deploy!

2. **Render** (Backend):
  - New Web Service -> Connect Repo
  - Build Command: `npm install`
  - Start Command: `node server.js`
  - Add env vars (OPENAI_API_KEY, etc.)


## 🧪 Smoke Test Plan (Judges)
1. **Login**: Use "Judge Login" or any email (Mock Auth).
2. **Setup**: Select "Software Engineer" -> Difficulty 5.
3. **Interview**: Speak or Type answers. Watch "Real-time Analysis" update.
4. **End Session**: Click Terminate -> View "Session Score" & Charts.
5. **Upgrade**: Click "Upgrade/Pricing" -> "Pay via UPI" -> Verify.
