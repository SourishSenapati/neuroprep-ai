import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_secret",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "mock_github_id",
      clientSecret: process.env.GITHUB_SECRET || "mock_github_secret",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "mock_linkedin_id",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "mock_linkedin_secret",
    }),
    CredentialsProvider({
      name: 'Email Access',
      credentials: {
        email: { label: "Email Address", type: "email", placeholder: "quantum@nexus.ai" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          // Sync with backend to get/create user
          const res = await fetch(`${apiUrl}/api/register`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ 
               email: credentials.email,
               provider: 'credentials'
             })
          }); // Note: Using localhost directly might be an issue in Docker/containerized but OK for local dev.
          
          if (res.ok) {
             const user = await res.json();
             return { id: user.id || `user_${Date.now()}`, name: credentials.email.split('@')[0], email: credentials.email };
          }
           // Fallback for demo if backend unreachable
           return { id: 'demo_user', name: 'Demo User', email: credentials.email };
        } catch (e) {
          console.error("Auth Error", e);
          return { id: 'offline_user', name: 'Offline User', email: credentials.email };
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user }: { user: any }) {
      try {
        if (user?.email) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          // Sync with backend
          await fetch(`${apiUrl}/api/register`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ 
               email: user.email,
               provider: 'next-auth'
             })
          }).catch(err => console.error("Backend sync failed:", err));
        }
        return true;
      } catch (e) {
        console.error("SignIn callback error:", e);
        return true; // Allow signin even if sync fails (offline mode)
      }
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};
