'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const Navbar = () => {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
        NeuroPrep AI
      </Link>

      <div className="flex gap-4 items-center">
        {!user ? (
          <button 
            onClick={loginWithGoogle}
            className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Login with Google
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-gray-300 hidden md:inline">Hi, {user.name?.split(' ')[0]}</span>
            <Link href="/dashboard" className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500">
              Dashboard
            </Link>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-white">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
