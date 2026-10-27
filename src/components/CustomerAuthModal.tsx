import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, customerLogin, customerUser } = useShop();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const nameToUse = fullName.trim() || email.split('@')[0] || 'Valued Patron';
    customerLogin(email.trim(), nameToUse);
    setSuccessMsg(`Welcome, ${nameToUse}! You are now signed in.`);
    setTimeout(() => {
      setSuccessMsg(null);
      setIsAuthModalOpen(false);
    }, 1200);
  };

  const handleDemoLogin = (demoName: string, demoEmail: string) => {
    customerLogin(demoEmail, demoName);
    setSuccessMsg(`Signed in as ${demoName}.`);
    setTimeout(() => {
      setSuccessMsg(null);
      setIsAuthModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#121217] border border-[#252535] max-w-md w-full p-6 sm:p-8 text-white relative shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#20202c] mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1e1a10] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-brand text-base font-bold text-white tracking-wider">
                CHHAVA PATRON SANCTUARY
              </h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                Account & Atelier Privileges
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#181822] border border-[#242432] mb-6">
          <button
            onClick={() => setTab('login')}
            className={`py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              tab === 'login' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Patron Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              tab === 'register' ? 'bg-[#d4af37] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {tab === 'register' && (
            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arjun Patil"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b3b] py-2.5 px-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          )}

          <div>
            <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="patron@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b3b] py-2.5 pl-9 pr-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b3b] py-2.5 pl-9 pr-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Mobile Number (For dispatch updates)
              </label>
              <input
                type="tel"
                placeholder="+91 98200 12345"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#181822] border border-[#2b2b3b] py-2.5 px-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gold-metallic text-black font-semibold uppercase tracking-[0.2em] hover:opacity-95 shadow-md transition-all cursor-pointer"
          >
            {tab === 'login' ? 'ENTER SANCTUARY' : 'REGISTER PATRON PROFILE'}
          </button>
        </form>

        {/* 1-Click Fast Demo Logins */}
        <div className="mt-6 pt-5 border-t border-[#20202c]">
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2.5 text-center">
            Instant Test Patron Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('Prajwal Nimbalkar', 'prajwalnimbalkar300@gmail.com')}
              className="py-1.5 px-2 bg-[#171720] hover:bg-[#20202d] border border-[#d4af37]/50 text-[11px] text-[#f7df94] text-left transition-colors truncate"
            >
              👑 Prajwal N. (Saswad)
            </button>
            <button
              onClick={() => handleDemoLogin('Rohan Deshmukh', 'rohan.d@chhava.in')}
              className="py-1.5 px-2 bg-[#171720] hover:bg-[#20202d] border border-[#282838] text-[11px] text-zinc-300 hover:text-[#d4af37] text-left transition-colors truncate"
            >
              👑 Rohan D. (Pune)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
