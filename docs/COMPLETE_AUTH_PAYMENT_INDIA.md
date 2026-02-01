# 🔐 COMPLETE AUTH + PAYMENT SYSTEM (India-Optimized)


## **NextAuth.js + Razorpay (Google, LinkedIn, GitHub + UPI, Net Banking)**

---


## **PART 1: AUTHENTICATION (OAuth + Email)**


### **1. Install Dependencies**

```bash
npm install next-auth @auth/prisma-adapter bcryptjs
npm install @types/bcryptjs -D
```

---


### **2. Setup OAuth Applications**


#### **A. Google OAuth**
1. Go to https://console.cloud.google.com
2. Create new project: "NeuroPrep AI"
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Authorized redirect: `https://your-domain.com/api/auth/callback/google`
6. Copy Client ID and Secret


#### **B. GitHub OAuth**
1. Go to https://github.com/settings/developers
2. New OAuth App
3. Authorization callback: `https://your-domain.com/api/auth/callback/github`
4. Copy Client ID and Secret


#### **C. LinkedIn OAuth**
1. Go to https://www.linkedin.com/developers/apps
2. Create app
3. Add redirect URL: `https://your-domain.com/api/auth/callback/linkedin`
4. Copy Client ID and Secret

---


### **3. Environment Variables**

Add to `frontend/.env.local`:

```env

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars


# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret


# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret


# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret


# Razorpay (India Payment Gateway)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx


# Database (use any from previous implementations)
DATABASE_URL=your-database-url
```

---


### **4. Update Database Schema**

Add to your Prisma schema:

```prisma
model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model User {
  id            String    @id @default(uuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?
  
  // Your existing fields
  isPremium     Boolean   @default(false)
  xp            Int       @default(0)
  level         Int       @default(1)
  streak        Int       @default(0)
  lastLogin     DateTime  @default(now())
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  
  // Your existing relations
  interviewSessions InterviewSession[]
  payments          Payment[]
  questions         QuestionHistory[]
  analytics         AnalyticsEvent[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

Run migration:
```bash
npx prisma db push
```

---


### **5. Create NextAuth Configuration**

Create `frontend/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import LinkedInProvider from 'next-auth/providers/linkedin';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    // LinkedIn OAuth
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: { scope: 'openid profile email' },
      },
      issuer: 'https://www.linkedin.com',
      jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),

    // Email/Password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  pages: {
    signIn: '/judge/login',
    error: '/auth/error',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Update last login on OAuth sign in
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
      }
      return true;
    },

    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        // Fetch full user data
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            isPremium: true,
            xp: true,
            level: true,
            streak: true,
          },
        });

        if (fullUser) {
          session.user = {
            ...session.user,
            ...fullUser,
          };
        }
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

---


### **6. Create Registration API**

Create `frontend/app/api/auth/register/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        emailVerified: new Date(), // Auto-verify for demo
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
      message: 'Registration successful! Please sign in.',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
```

---


### **7. Create Auth Context**

Create `frontend/components/Providers.tsx`:

```typescript
'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

Update `frontend/app/layout.tsx`:

```typescript
import { Providers } from '@/components/Providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---


### **8. Login Component Example**

Create `frontend/components/LoginForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        alert('Invalid credentials');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github' | 'linkedin') => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="max-w-md mx-auto watch-card p-8">
      <h2 className="watch-heading-lg text-center mb-8">Sign In</h2>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <motion.button
          onClick={() => handleOAuth('google')}
          className="watch-button-primary w-full py-3 flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            {/* Google icon SVG */}
          </svg>
          Continue with Google
        </motion.button>

        <motion.button
          onClick={() => handleOAuth('github')}
          className="watch-button-secondary w-full py-3 flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {/* GitHub icon */}
          Continue with GitHub
        </motion.button>

        <motion.button
          onClick={() => handleOAuth('linkedin')}
          className="watch-button-secondary w-full py-3 flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {/* LinkedIn icon */}
          Continue with LinkedIn
        </motion.button>
      </div>

      <div className="watch-divider"></div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Email</label>
          <input
            type="email"
            required
            className="watch-input w-full"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Password</label>
          <input
            type="password"
            required
            className="watch-input w-full"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>

        <motion.button
          type="submit"
          className="watch-button-primary w-full py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </form>
    </div>
  );
}
```

---


### **9. Logout Function**

```typescript
import { signOut } from 'next-auth/react';

// Usage in component
const handleLogout = async () => {
  await signOut({ callbackUrl: '/' });
};
```

---


## **PART 2: PAYMENT SYSTEM (UPI + Net Banking)**


### **1. Install Razorpay**

```bash
npm install razorpay
npm install @types/razorpay -D
```

---


### **2. Create Razorpay Client**

Create `frontend/lib/razorpay.ts`:

```typescript
import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Payment plans (in paise - 1 INR = 100 paise)
export const PAYMENT_PLANS = {
  MONTHLY: {
    amount: 99 * 100, // ₹99
    currency: 'INR',
    name: 'Premium Monthly',
  },
  YEARLY: {
    amount: 999 * 100, // ₹999 (save 17%)
    currency: 'INR',
    name: 'Premium Yearly',
  },
};
```

---


### **3. Create Order API**

Create `frontend/app/api/payments/create-order/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { razorpay, PAYMENT_PLANS } from '@/lib/razorpay';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { plan } = await request.json(); // 'MONTHLY' or 'YEARLY'
    const selectedPlan = PAYMENT_PLANS[plan as keyof typeof PAYMENT_PLANS];

    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        plan,
      },
    });

    // Save to database
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: selectedPlan.amount,
        currency: selectedPlan.currency,
        method: 'razorpay',
        razorpayOrderId: order.id,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

---


### **4. Verify Payment API**

Create `frontend/app/api/payments/verify/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Update payment in database
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    });

    // Upgrade user to premium
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isPremium: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully!',
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
```

---


### **5. Payment Component**

Create `frontend/components/PaymentModal.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentModal({ plan = 'MONTHLY' }: { plan?: 'MONTHLY' | 'YEARLY' }) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Create order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error('Failed to create order');
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'NeuroPrep AI',
        description: plan === 'MONTHLY' ? 'Premium Monthly' : 'Premium Yearly',
        image: '/logo.png',
        order_id: orderData.order.id,
        
        // Payment methods (India-optimized)
        method: {
          upi: true,
          netbanking: true,
          card: true,
          wallet: true,
        },
        
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        
        theme: {
          color: '#B76E79', // Rose gold
        },
        
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert('Payment successful! You are now Premium! 🎉');
            window.location.reload();
          } else {
            alert('Payment verification failed');
          }
        },
        
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <motion.button
        onClick={handlePayment}
        disabled={isLoading}
        className="watch-button-primary px-8 py-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? 'Processing...' : `Pay ₹${plan === 'MONTHLY' ? '99' : '999'}`}
      </motion.button>
    </>
  );
}
```

---


## **COMPLETE AUTH + PAYMENT SYSTEM READY! 🎉**

**Includes:**
- ✅ Google, GitHub, LinkedIn OAuth
- ✅ Email/Password registration & login
- ✅ Secure password hashing
- ✅ UPI payments (Razorpay)
- ✅ Net banking support
- ✅ Card & wallet payments
- ✅ Payment verification
- ✅ Premium upgrades
- ✅ Session management

**Production-ready for Indian market!** 🇮🇳
