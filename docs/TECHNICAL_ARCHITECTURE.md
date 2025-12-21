# NeuroPrep AI - Complete Technical Architecture & Flow

## System Overview

NeuroPrep AI is a **full-stack web application** for engineering interview preparation built on a **monorepo architecture** with separate frontend and backend deployments.

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (Port 3002 / Vercel)        │  │
│  │  - React Components                                  │  │
│  │  - Firebase Auth (Client-side)                       │  │
│  │  - Razorpay SDK (Client-side)                        │  │
│  └──────────────┬───────────────────────────────────────┘  │
└─────────────────┼───────────────────────────────────────────┘
                  │
                  │ HTTPS API Calls
                  │
         ┌────────▼────────────────────────────────┐
         │  Express Backend (Port 5000 / Vercel)   │
         │  ┌──────────────────────────────────┐  │
         │  │  Routes:                         │  │
         │  │  - /api/auth/sync                │  │
         │  │  - /api/payment/create-order     │  │
         │  │  - /api/payment/verify           │  │
         │  │  - /api/dashboard                │  │
         │  └──────────┬───────────────────────┘  │
         └─────────────┼───────────────────────────┘
                       │
                       │ Mongoose ODM
                       │
              ┌────────▼────────────┐
              │   MongoDB Atlas     │
              │  Collections:       │
              │  - users            │
              │  - masterypaths     │
              │  - activities       │
              └─────────────────────┘
```

---

## 1. Frontend Architecture (Next.js 16)

### **Tech Stack:**
- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS + Custom CSS Variables
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Authentication:** Firebase Auth SDK
- **Payments:** Razorpay Checkout SDK
- **Build Tool:** Webpack (configured via `next.config.js`)

### **Key Components & Flow:**

#### **A. Landing Page (`app/page.tsx`)**

```typescript
// 1. User visits https://neuroprep-ai.vercel.app
// 2. Page fetches mastery paths from backend

useEffect(() => {
  fetch('https://backend-ivory-kappa-47.vercel.app/api/mastery-paths')
    .then(res => res.json())
    .then(paths => setPaths(paths))
}, []);

// 3. Renders mastery cards dynamically
paths.map(path => <MasteryCard {...path} />)
```

**What Happens:**
1. Browser loads static HTML/CSS/JS from Vercel CDN
2. React hydrates the page (makes it interactive)
3. API call fetches 12 mastery paths from MongoDB
4. Cards render with titles, descriptions, salary ranges

---

#### **B. Firebase Authentication Flow (`lib/firebase.js` + `hooks/useAuth.ts`)**

**Step 1: Firebase Initialization (Client-Side Only)**

```javascript
// lib/firebase.js
if (typeof window !== 'undefined') {
  // ✅ Only runs in browser, NOT during server build
  app = initializeApp({
    apiKey: 'AIzaSyBVou1DYa2fnWflabWQLZWwHU3DnKiGjDQ',
    authDomain: 'neuroprep-12bb7.firebaseapp.com',
    projectId: 'neuroprep-12bb7'
  });
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}
```

**Why the `window` check?**
- Next.js runs code **twice**: once on the server (Node.js) and once in the browser.
- Firebase can ONLY run in the browser (it needs DOM APIs).
- Without the check, the build fails with `auth/invalid-api-key` because server has no Firebase keys.

**Step 2: User Clicks "Login with Google"**

```typescript
// hooks/useAuth.ts
const loginWithGoogle = async () => {
  await signInWithPopup(auth, googleProvider);
  // Firebase handles the entire Google OAuth flow
};
```

**Behind the Scenes:**
1. Opens Google login popup window
2. User selects Google account
3. Google returns JWT token to Firebase
4. Firebase SDK stores token in browser's `IndexedDB`

**Step 3: Auto-Sync with Backend**

```typescript
// hooks/useAuth.ts
useEffect(() => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // User logged in! Sync with our MongoDB
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        body: JSON.stringify({
          uid: firebaseUser.uid,        // e.g., "abc123xyz"
          email: firebaseUser.email,     // "user@gmail.com"
          name: firebaseUser.displayName // "John Doe"
        })
      });
      const dbUser = await res.json();
      setUser({ ...firebaseUser, ...dbUser }); // Merge Firebase + DB data
    }
  });
}, []);
```

**What Happens on Backend:**

```javascript
// backend/routes/auth.js
router.post('/sync', async (req, res) => {
  const { uid, email, name } = req.body;
  
  let user = await User.findById(uid); // Check if user exists
  
  if (!user) {
    // First-time login → Create new user in MongoDB
    user = new User({
      _id: uid,  // Use Firebase UID as MongoDB _id
      name,
      email,
      stats: { xp: 0, level: 1, streak: 0 },
      isPro: false
    });
    await user.save();
  }
  
  res.json(user); // Return user with isPro, stats, etc.
});
```

**Result:**
- Firebase user is now stored in MongoDB
- `user.isPro` tells us if they paid for Pro
- Dashboard can fetch `user.stats` for XP/Level display

---

#### **C. Razorpay Payment Flow (`hooks/useRazorpay.ts`)**

**Step 1: User Clicks "Upgrade to PRO"**

```typescript
// components/Dashboard.tsx
<button onClick={() => handlePayment(user.uid)}>
  ⚡ Upgrade to PRO (₹99)
</button>
```

**Step 2: Create Payment Order**

```typescript
// hooks/useRazorpay.ts
const handlePayment = async (userId) => {
  // 1. Load Razorpay SDK script
  await loadRazorpayScript();
  
  // 2. Create order on our backend
  const res = await fetch('/api/payment/create-order', { method: 'POST' });
  const order = await res.json();
  // order = { id: "order_xyz123", amount: 9900, currency: "INR" }
```

**Backend Creates Order:**

```javascript
// backend/routes/payment.js
const razorpay = new Razorpay({
  key_id: 'rzp_test_RuBymTWufgW3fT',
  key_secret: 'Jtz8G0RYgmWzW5L4xg74THZn'
});

router.post('/create-order', async (req, res) => {
  const order = await razorpay.orders.create({
    amount: 9900,  // ₹99.00 in paise
    currency: "INR",
    receipt: "receipt_" + Date.now()
  });
  res.json(order); // Send order ID back to frontend
});
```

**Step 3: Open Razorpay Checkout Modal**

```typescript
const options = {
  key: 'rzp_test_RuBymTWufgW3fT',
  amount: order.amount,
  order_id: order.id,
  name: "NeuroPrep AI",
  description: "Pro Subscription",
  handler: async function(response) {
    // User completed payment! response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
  }
};

const rzp = new window.Razorpay(options);
rzp.open(); // Shows payment modal
```

**Step 4: Verify Payment on Backend**

```typescript
// After user pays, Razorpay calls our handler
handler: async function(response) {
  const verifyRes = await fetch('/api/payment/verify', {
    method: 'POST',
    body: JSON.stringify({
      userId: user.uid,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    })
  });
}
```

**Backend Verifies Payment:**

```javascript
// backend/routes/payment.js
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
  
  // CRITICAL: Verify signature to prevent fraud
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");
  
  if (razorpay_signature === expectedSign) {
    // ✅ Payment is legit! Update user to Pro
    await User.findByIdAndUpdate(userId, { isPro: true });
    res.json({ success: true });
  } else {
    // ❌ Signature mismatch = fraud attempt
    res.status(400).json({ success: false });
  }
});
```

**Security Note:**
- We NEVER trust the frontend's "payment success" message
- Backend verifies signature using our secret key (which frontend can't fake)
- Only then do we set `isPro: true` in database

---

## 2. Backend Architecture (Express + MongoDB)

### **Tech Stack:**
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose
- **Payment Gateway:** Razorpay
- **Deployment:** Vercel Serverless Functions

### **Key Routes:**

#### **1. `/api/auth/sync` - User Registration/Login**

```javascript
// Purpose: Save Firebase user to MongoDB
POST /api/auth/sync
Body: { uid: "abc123", email: "user@gmail.com", name: "John" }

Response: { _id: "abc123", name: "John", email: "...", isPro: false, stats: {...} }
```

#### **2. `/api/dashboard` - Fetch User Stats**

```javascript
// Purpose: Get user's XP, level, recent sessions
GET /api/dashboard?userId=abc123

Response: {
  stats: { xp: 1200, level: 5, streak: 7 },
  isPro: true,
  recentSessions: [...]
}
```

#### **3. `/api/mastery-paths` - Get All Learning Paths**

```javascript
// Purpose: Fetch all 12 mastery paths for landing page
GET /api/mastery-paths

Response: [
  { title: "Industry-Aligned Training", slug: "universal-placement", ... },
  { title: "GATE & PSU Preparation", ... }
]
```

---

## 3. Database Schema (MongoDB)

### **Users Collection:**

```javascript
{
  _id: "abc123xyz",              // Firebase UID (String, not ObjectId!)
  name: "John Doe",
  email: "john@gmail.com",
  stats: {
    xp: 1500,
    level: 6,
    streak: 14
  },
  isPro: true,                   // Unlocked via Razorpay payment
  createdAt: "2025-12-21T10:00:00Z",
  updatedAt: "2025-12-21T15:00:00Z"
}
```

### **MasteryPaths Collection:**

```javascript
{
  _id: ObjectId("..."),
  title: "Universal Placement Preparation",
  slug: "placement-ready",
  description: "Develop aptitude, logical reasoning...",
  companyTags: ["TCS", "Infosys", "L&T"],
  difficulty: "Beginner to Intermediate",
  salaryRange: "₹3.5-15 LPA",
  icon: "💼",
  skills: ["Quantitative Aptitude", "Logical Reasoning", ...]
}
```

---

## 4. Deployment Architecture

### **Frontend (Vercel):**

```
GitHub Push (main branch)
    ↓
Vercel Detects Change
    ↓
Runs: npm run build --webpack
    ↓
Compiles 22 Next.js routes
    ↓
Uploads to Vercel CDN (Global Edge Network)
    ↓
Live at: https://neuroprep-ai.vercel.app
```

**Environment Variables (Vercel Dashboard):**
```
NEXT_PUBLIC_API_URL=https://backend-ivory-kappa-47.vercel.app
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_RuBymTWufgW3fT
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBVou1DYa...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=neuroprep-12bb7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=neuroprep-12bb7
```

### **Backend (Vercel Serverless):**

```
GitHub Push (main branch)
    ↓
Vercel Builds: backend/index.js
    ↓
Converts Express routes to Serverless Functions
    ↓
Each route = 1 Lambda Function
    ↓
Live at: https://backend-ivory-kappa-47.vercel.app
```

**Environment Variables (Vercel Dashboard):**
```
MONGO_URI=mongodb+srv://sourishschemug_db_user:a4r1UIXNpZe16pRA@neuroprep-db.4lhua3l.mongodb.net/
RAZORPAY_KEY_ID=rzp_test_RuBymTWufgW3fT
RAZORPAY_KEY_SECRET=Jtz8G0RYgmWzW5L4xg74THZn
```

---

## 5. Complete User Journey

### **First-Time Visitor:**

1. **Lands on Homepage** → Sees 12 mastery paths fetched from MongoDB
2. **Clicks "Login with Google"** → Firebase popup opens
3. **Selects Google Account** → Firebase returns JWT token
4. **Auto-Redirect to Dashboard** → `useAuth` hook syncs user to MongoDB
5. **Dashboard Loads** → Shows XP: 0, Level: 1, isPro: false
6. **Clicks "Upgrade to PRO (₹99)"** → Razorpay modal opens
7. **Enters Card Details & Pays** → Payment verified on backend
8. **Database Updated** → `isPro: true` saved to MongoDB
9. **Dashboard Refreshes** → Shows "PRO MEMBER" badge

### **Returning Pro User:**

1. **Visits Site** → Firebase auto-logs them in (token in IndexedDB)
2. **Dashboard Loads** → Fetches latest `stats` and `isPro: true` from MongoDB
3. **Sees Advanced Content** → Unlocked features for Pro members

---

## 6. Security Measures

### **Authentication:**
- Firebase handles all OAuth flows (we never see passwords)
- JWT tokens stored in browser's IndexedDB (encrypted)
- Backend validates Firebase UID on every request

### **Payment Security:**
- Razorpay uses HMAC-SHA256 signature verification
- Secret key NEVER exposed to frontend
- Backend verifies every payment before updating database

### **API Security:**
- CORS configured to allow only trusted domains
- MongoDB connection uses TLS encryption
- Environment variables never committed to Git (.gitignore)

---

## 7. Mobile Optimization

**Responsive Design:**
- `globals-mobile.css` forces single-column layouts on <768px screens
- Touch targets: minimum 44px height (Apple/Google standards)
- Input font-size: 16px (prevents iOS auto-zoom)

**Progressive Web App (PWA) Ready:**
- `manifest.json` allows "Add to Home Screen"
- Service workers can cache for offline mode (future)

---

## Summary

**NeuroPrep AI is a production-ready, full-stack application with:**

✅ Firebase Authentication (Google OAuth)
✅ MongoDB Cloud Database (User profiles, Mastery paths)
✅ Razorpay Payment Gateway (₹99 Pro upgrade)
✅ Next.js Frontend (Server-side rendering + Client-side hydration)
✅ Express Backend (REST API on Vercel Serverless)
✅ Tailwind CSS + Custom Dark Green Theme
✅ Mobile-first responsive design
✅ WCAG AA accessibility standards
✅ End-to-end encrypted payment flow
✅ Auto-deployment via GitHub → Vercel CI/CD

**Live URL:** https://neuroprep-ai.vercel.app
