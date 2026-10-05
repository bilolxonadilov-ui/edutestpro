import React from 'react';
import { User, UserRole } from '../types';
import { 
  GraduationCap, 
  Presentation, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  LogIn, 
  LogOut, 
  Activity,
  Layers
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  soundActive: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeRole,
  onSelectRole,
  onOpenAuth,
  onLogout,
  soundActive,
  onToggleSound
}) => {
  return (
    <header className="glass-nav sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between border-b border-white/10">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer select-none group"
        onClick={() => onSelectRole('student')}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
          E
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
              EduTest
            </span>
            <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              PRO
            </span>
          </div>
          <p className="text-[10px] uppercase font-medium tracking-widest text-slate-400">
            Premium Testing System
          </p>
        </div>
      </div>

      {/* Role Navigation Switcher Tabs (Anti-pill clean segmented style) */}
      <nav className="hidden md:flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
        <button
          onClick={() => onSelectRole('student')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeRole === 'student'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>O'quvchi</span>
        </button>

        <button
          onClick={() => onSelectRole('teacher')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeRole === 'teacher'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>O'qituvchi</span>
        </button>

        <button
          onClick={() => onSelectRole('admin')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeRole === 'admin'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </nav>

      {/* Right Controls & Profile */}
      <div className="flex items-center gap-3">
        {/* Live Slot Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-tight">500 Slot Faol</span>
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={onToggleSound}
          title={soundActive ? "Ovozni o'chirish" : "Ovozni yoqish"}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Sound Toggle"
        >
          {soundActive ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* User Status / Login */}
        {currentUser ? (
          <div className="flex items-center gap-2.5 pl-1">
            <div className="hidden lg:block text-right">
              <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">
                {currentUser.role === 'student' ? "O'quvchi" : currentUser.role === 'teacher' ? "O'qituvchi" : 'Admin'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold ring-1 ring-white/20">
              {currentUser.name.charAt(0)}
            </div>
            <button
              onClick={onLogout}
              title="Chiqish"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Kirish</span>
          </button>
        )}
      </div>
    </header>
  );
};
