import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, Linkedin } from 'lucide-react';

import { signIn } from 'next-auth/react';

export default function SideRegistration() {
  const handleLogin = (provider: string) => {
    signIn(provider.toLowerCase());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2 p-2 bg-white/5 backdrop-blur-xl border-l border-y border-white/10 rounded-l-2xl shadow-2xl"
    >
      <div className="text-[10px] text-gray-500 text-center font-medium writing-mode-vertical py-2">
        SIGN UP
      </div>
      
      {[
        { icon: 'https://www.google.com/favicon.ico', label: 'Google' },
        { icon: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', label: 'Microsoft' },
        { icon: <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, label: 'Facebook' },
        { icon: <Github className="w-4 h-4" />, label: 'GitHub' },
        { icon: <Linkedin className="w-4 h-4 text-[#0077b5]" />, label: 'LinkedIn' }
      ].map((item, i) => (
        <button
          key={i}
          onClick={() => handleLogin(item.label)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:scale-110 transition-all group relative"
        >
          {typeof item.icon === 'string' ? (
            <Image src={item.icon} alt={item.label} width={16} height={16} className="w-4 h-4" unoptimized />
          ) : (
            item.icon
          )}
          
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
            {item.label}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
