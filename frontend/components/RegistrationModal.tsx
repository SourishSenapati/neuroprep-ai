import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  forced?: boolean;
}

export default function RegistrationModal({ isOpen, onClose, forced = false }: RegistrationModalProps) {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mobile })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Registered:', data);
        localStorage.setItem('user_registered', 'true');
        localStorage.setItem('userId', data.userId);
        alert(data.message || 'Account created successfully!');
        onClose();
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSocialLogin = async (provider: string) => {
    // Mock social login for now, but hit backend to register "user"
    const mockEmail = `user_${Date.now()}@${provider.toLowerCase()}.com`;
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mockEmail, provider })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user_registered', 'true');
        localStorage.setItem('auth_provider', provider);
        localStorage.setItem('userId', data.userId);
        alert(`Successfully signed in with ${provider}!`);
        onClose();
      }
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {forced ? (
            // Forced Modal (Full Screen)
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl relative"
              >
                 <button 
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                 >
                    <X className="w-6 h-6" />
                 </button>

                 <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">Session Limit Reached</h2>
                  <p className="text-gray-500 text-xs font-mono">Authentication required to proceed.</p>
                </div>
                {/* ... (rest of form for forced) ... */}
                 <div className="space-y-3 mb-6">
                  {['Google', 'Microsoft', 'Facebook'].map(provider => (
                    <button 
                      key={provider}
                      onClick={() => handleSocialLogin(provider)}
                      className="w-full py-3 border border-white/10 hover:bg-white/5 text-white text-sm font-mono uppercase transition-colors flex items-center justify-center gap-2"
                    >
                      Continue with {provider}
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/10 my-6"></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent border border-white/10 p-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-mono text-sm"
                    placeholder="EMAIL_ADDRESS"
                  />
                  <input 
                    type="tel" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-transparent border border-white/10 p-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-mono text-sm"
                    placeholder="MOBILE_OPTIONAL"
                  />
                  <button type="submit" className="w-full py-3 bg-white text-black font-bold uppercase text-sm hover:bg-gray-200">
                    Create Account
                  </button>
                </form>
              </motion.div>
            </div>
          ) : (
            // Subtle Toast (Bottom Right)
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="fixed bottom-4 right-4 z-50 w-80 bg-[#0a0a0a] border border-white/10 shadow-2xl p-4"
            >
              <button onClick={onClose} aria-label="Close" className="absolute top-2 right-2 text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold text-white uppercase mb-1">Save Progress?</h3>
              <p className="text-xs text-gray-500 font-mono mb-4">Register to track your performance stats.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSocialLogin('Google')}
                  className="flex-1 py-2 bg-white text-black text-xs font-bold uppercase hover:bg-gray-200"
                >
                  Register
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-2 border border-white/10 text-gray-400 text-xs font-bold uppercase hover:bg-white/5"
                >
                  Later
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
