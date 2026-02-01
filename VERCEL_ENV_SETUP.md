# 🔐 Deployment Environment & Security Config

To ensure **Authentication (NextAuth)** and **Payments (Razorpay)** work correctly on Vercel, you MUST configure the following Environment Variables in your Vercel Project Settings.


## 1. Vercel Project Settings > Environment Variables

Add these keys:

| Key | Value (Description) | 
| ----- | -------------------- | 
| `NEXT_PUBLIC_API_URL` | `https://neuroprep-ai.vercel.app` (Or your actual production URL) | 
| `NEXTAUTH_URL` | `https://neuroprep-ai.vercel.app` (Canonical URL) | 
| `NEXTAUTH_SECRET` | Generate one: `openssl rand -base64 32` (or just mash keyboard) | 
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_RuBymTWufgW3fT` (Or your real Key ID) | 
| `GEMINI_API_KEY` | (Your Google Gemini AI Key) | 
| `LINKEDIN_CLIENT_ID` | (From LinkedIn Developer Portal) | 
| `LINKEDIN_CLIENT_SECRET` | (From LinkedIn Developer Portal) | 

---


## 2. Authentication Logic (Configured)

- **Provider**: NextAuth.js (Email + Google)
- **Database Sync**: Defaulted to `demo` mode if backend is unreachable. 
- **Production URL**: Configured to use `NEXT_PUBLIC_API_URL`.


## 3. Payment Logic (Configured)

- **Provider**: Razorpay (UPI Simulated)
- **Fallback**: If the backend server (`/api/payment/create-order`) is unreachable (because we are on Vercel Edge), the frontend will **automatically fallback** to "Demo Mode."
- **Demo Mode**: Allows judges/users to complete the payment flow and see the "Pro" upgrade animation without a real backend transaction.


## 4. How to Verify

1. **Login**: Click "Login" -> Try "demo@example.com" or Google. 
  - *Result*: Should verify and show "Welcome back".
2. **Upgrade**: Click "Upgrade/Pricing" -> Click "I have Paid".
  - *Result*: Should show confetti and gold "Pro" badge.
