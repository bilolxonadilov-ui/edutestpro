import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  Send, 
  User as UserIcon, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Sparkles,
  ArrowRight,
  Bot
} from 'lucide-react';
import { playSuccessSound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [name, setName] = useState('Bilolxon Adilov');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [role, setRole] = useState<UserRole>('student');
  const [otpCode, setOtpCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(true);
  const [demoCode] = useState('849201');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendTelegramCode = () => {
    setIsOtpSent(true);
    setError(null);
  };

  const handleQuickFill = () => {
    setOtpCode(demoCode);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== demoCode && otpCode.trim().length !== 6) {
      setError("Tasdiqlash kodi 6 ta raqam bo'lishi kerak (namuna: 849201)");
      return;
    }

    playSuccessSound();

    const loggedUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Foydalanuvchi',
      phone: phone.trim() || '+998 90 123 45 67',
      role,
      telegramUsername: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'active',
      testsSolved: role === 'student' ? 19 : undefined,
      averageScore: role === 'student' ? 92 : undefined
    };

    onLoginSuccess(loggedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-black/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
            <Send className="w-6 h-6 transform -rotate-12 translate-x-0.5" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Tizimga Kirish</h2>
          <p className="text-xs text-slate-400 mt-1">
            Telegram Bot orqali bepul, xavfsiz va bir zumda avtorizatsiya
          </p>
        </div>

        {/* Role Selector Pill */}
        <div className="mb-5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 flex text-xs">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              role === 'student' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            O'quvchi
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              role === 'teacher' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            O'qituvchi
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              role === 'admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ism va Familiyangiz
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bilolxon Adilov"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Telefon Raqamingiz
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder-slate-600"
              />
            </div>
          </div>

          {/* Telegram OTP Simulator Box */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-blue-400" />
                <span>Telegram Tasdiqlash Kodi</span>
              </span>
              <button
                type="button"
                onClick={handleSendTelegramCode}
                className="text-blue-400 hover:text-blue-300 text-[11px] font-semibold underline underline-offset-2"
              >
                Kodni qayta jo'natish
              </button>
            </div>

            {/* Simulated Live Bot notification notice */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-900/30 border border-blue-500/20 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300 text-[11px]">
                  Bot kodi: <strong className="text-emerald-400 font-mono text-xs">{demoCode}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-400/30 transition-colors"
              >
                Avto-kiritish
              </button>
            </div>

            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6 xonali kod (masalan: 849201)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono text-lg tracking-widest text-blue-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium">{error}</p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Qurilmani 30 kun eslab qolish</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 font-bold text-sm text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Kirish va Boshqaruvga O'tish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
