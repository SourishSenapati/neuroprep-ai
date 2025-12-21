import { useState, useEffect } from "react";
import { 
  signInWithPopup, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export const useAuth = () => {
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
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          // photoURL: firebaseUser.photoURL // Backend doesn't strictly require this in User model, but good to have if updated
        }),
      });
      
      if (res.ok) {
        const dbUser = await res.json();
        setUser({ ...firebaseUser, ...dbUser }); // Combine Firebase + MongoDB data
      } else {
        console.warn('Backend sync failed');
        setUser(firebaseUser);
      }
    } catch (error) {
      console.error("Sync Error:", error);
      setUser(firebaseUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        syncUserWithBackend(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return { user, loading, loginWithGoogle, logout };
};
