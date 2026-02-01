import { useState, useEffect } from "react";
import { 
  signInWithPopup, 
  onAuthStateChanged,
  signOut as firebaseSignOut
} from "firebase/auth";
// @ts-ignore
import { auth, googleProvider } from "@/lib/firebase";
import { useSession, signOut as nextAuthSignOut, signIn } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sync user with backend after login
  const syncUserWithBackend = async (firebaseUser: any) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: firebaseUser.uid || firebaseUser.id,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.name,
        }),
      });
      
      if (res.ok) {
        const dbUser = await res.json();
        return { ...firebaseUser, ...dbUser };
      }
      return firebaseUser;
    } catch (error) {
      console.error("Sync Error:", error);
      return firebaseUser;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
       // 1. Check for Judge/VIP Backdoor (LocalStorage)
       if (typeof window !== 'undefined') {
           const vipUser = localStorage.getItem('user');
           if (vipUser) {
               try {
                   const parsed = JSON.parse(vipUser);
                   if (parsed.isJudge || parsed.id?.startsWith('judge')) {
                       console.log("👑 VIP Judge Access Detected");
                       setUser(parsed);
                       setLoading(false);
                       return;
                   }
               } catch(e) {}
           }
       }

       // 2. Check NextAuth Session (Priority)
       if (status === 'authenticated' && session?.user) {
           const enrichedUser = {
               ...session.user,
               uid: (session.user as any).id || session.user.email, // Ensure uid exists
               // Add stats if available in session
               isPro: (session.user as any).isPro || false
           };
           setUser(enrichedUser);
           setLoading(false);
           return;
       }

       if (status === 'loading') return;

       // 3. Fallback to Firebase (Legacy)
       const unsubscribe = onAuthStateChanged(auth as any, async (currentUser) => {
          if (currentUser) {
            const synced = await syncUserWithBackend(currentUser);
            setUser(synced);
          } else {
             // If NextAuth also failed, then we are truly logged out
             if (status === 'unauthenticated') {
                 setUser(null);
             }
          }
          setLoading(false);
       });
       
       return () => unsubscribe();
    };

    initAuth();
  }, [session, status]);

  const loginWithGoogle = async () => {
    // Prefer NextAuth for new flows
    await signIn('google');
  };

  const logout = async () => {
    await nextAuthSignOut();
    await firebaseSignOut(auth as any);
    localStorage.removeItem('user'); 
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, loginWithGoogle, logout };
};
