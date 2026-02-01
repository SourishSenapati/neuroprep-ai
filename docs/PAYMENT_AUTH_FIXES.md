# 🚨 CRITICAL ISSUES TO FIX


## User-Reported Problems (Testing in Chrome):


### 1. ❌ Payment Terminal - UPI Not Working
**Issue:** Payment collection system not accepting UPI payments  
**Current:** Stripe-based (US-focused)  
**Required:** Indian UPI integration (Razorpay/PhonePe/Paytm)

**Fix Needed:**
- Replace Stripe with Razorpay
- Add UPI payment flow
- Support: Google Pay, PhonePe, Paytm, BHIM
- QR code generation for UPI
- Payment verification webhook

**Priority:** CRITICAL ⚠️

---


### 2. ❌ SQL/Database Not Working
**Issue:** User registration/data not persisting  
**Symptoms:** 
- Registration data not saved
- Login fails after signup
- Session data lost

**Possible Causes:**
- No database configured (using localStorage only)
- Supabase not connected
- SQL queries failing

**Fix Needed:**
- Connect Supabase properly
- Create user tables
- Implement proper auth flow
- Add session management

**Priority:** CRITICAL ⚠️

---


### 3. ❌ GitHub/LinkedIn OAuth Not Working
**Issue:** Social login buttons don't work  
**Current State:** Buttons exist but no integration

**Fix Needed:**
- Set up NextAuth providers
- Configure GitHub OAuth app
- Configure LinkedIn OAuth app
- Add callback URLs
- Store social profile data

**Files to Update:**
- `app/api/auth/[...nextauth]/route.ts`
- `.env.local` - add OAuth credentials

**Priority:** HIGH

---


### 4. ❌ Payment Collection Not Working
**Issue:** Users can't actually pay for premium  
**Related to:** #1 (UPI terminal)

**Current Flow:**
1. User clicks "Upgrade to Pro" ✓
2. Modal shows pricing ✓
3. "Pay Now" button... does nothing ❌
4. No payment processing ❌
5. No premium activation ❌

**Fix Needed:**
- Integrate Razorpay SDK
- Create payment order API
- Handle payment success/failure
- Update user to premium in DB
- Send confirmation email

**Priority:** CRITICAL ⚠️

---


## Implementation Plan:


### Phase 1: Database Setup (30 min)
```sql
-- User table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  github_id TEXT,
  linkedin_id TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT, -- 'upi', 'card', 'netbanking'
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```


### Phase 2: Razorpay Integration (1 hour)
```typescript
// Install: npm install razorpay

// API route: /api/payment/create-order
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

// Create order
const order = await razorpay.orders.create({
  amount: 9900, // ₹99 in paise
  currency: 'INR',
  receipt: `receipt_${Date.now()}`,
  payment_capture: 1
});
```


### Phase 3: UPI Payment Flow (1 hour)
```typescript
// Frontend: Razorpay Checkout
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: order.amount,
  currency: order.currency,
  name: 'NeuroPrep AI',
  description: 'Pro Subscription',
  order_id: order.id,
  handler: async (response) => {
    // Verify payment
    await fetch('/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      })
    });
  },
  prefill: {
    email: user.email,
    contact: '9999999999'
  },
  theme: {
    color: '#667eea'
  }
};

const rzp = new window.Razorpay(options);
rzp.open();
```


### Phase 4: OAuth Setup (1 hour)
```typescript
// NextAuth configuration
import GithubProvider from 'next-auth/providers/github';
import LinkedInProvider from 'next-auth/providers/linkedin';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID!,
      clientSecret: process.env.LINKEDIN_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Save to Supabase
      const { data } = await supabase
        .from('users')
        .upsert({
          email: user.email,
          name: user.name,
          github_id: account.provider === 'github' ? profile.id : null,
          linkedin_id: account.provider === 'linkedin' ? profile.id : null
        });
      return true;
    }
  }
};
```

---


## Environment Variables Needed:

```env

# Razorpay (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...


# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_ID=...
GITHUB_SECRET=...


# LinkedIn OAuth (create at https://www.linkedin.com/developers)
LINKEDIN_ID=...
LINKEDIN_SECRET=...


# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<random-string>


# Supabase (already have)
NEXT_PUBLIC_SUPABASE_URL=https://skfnofbcompycyxrvmeo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---


## Testing Checklist:

- [ ] Build passes without errors
- [ ] User can sign up with email
- [ ] User can login with GitHub
- [ ] User can login with LinkedIn
- [ ] User data persists in Supabase
- [ ] "Upgrade to Pro" opens Razorpay
- [ ] UPI payment works (Google Pay/PhonePe)
- [ ] Payment success updates user to premium
- [ ] Premium features unlock after payment
- [ ] Payment fails gracefully with error message

---

**Status:** Documentation complete, ready to implement fixes 🔧
