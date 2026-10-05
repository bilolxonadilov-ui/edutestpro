import React, { useState } from 'react';
import { User, SystemLog, UserRole } from '../../types';
import { 
  ShieldCheck, 
  Users, 
  FileCheck2, 
  Activity, 
  Zap, 
  Bot, 
  Database, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Send,
  UserCog
} from 'lucide-react';
import { playSuccessSound } from '../../utils/audio';

interface AdminViewProps {
  currentUser: User;
  users: User[];
  logs: SystemLog[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  users,
  logs,
  onUpdateUserRole,
  onToggleUserStatus
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'telegram'>('overview');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.phone.includes(userSearchQuery);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    playSuccessSound();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tizim Ma'murlari Boshqaruvi</span>
            <span className="text-slate-600">·</span>
            <span>Baza & Server Nazorati</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Tizim Administratsiyasi (Admin)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Foydalanuvchilar, server barqarorligi va Telegram Bot integratsiyasi holati.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Health: 99.9%</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-white/5 space-y-1">
          <p className="text-xs text-slate-400 flex items-center justify-between">
            <span>Jami O'quvchilar</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </p>
          <p className="text-2xl font-black text-white">1,482</p>
          <span className="text-[11px] text-emerald-400 font-medium">↑ +12% bu hafta</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/5 space-y-1">
          <p className="text-xs text-slate-400 flex items-center justify-between">
            <span>Yechilgan Testlar</span>
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
          </p>
          <p className="text-2xl font-black text-blue-400">28,940</p>
          <span className="text-[11px] text-slate-500">PostgreSQL Cloud SQL</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/5 space-y-1">
          <p className="text-xs text-slate-400 flex items-center justify-between">
            <span>Server Response</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </p>
          <p className="text-2xl font-black text-purple-400">18ms</p>
          <span className="text-[11px] text-emerald-400 font-medium">Ultra Fast Ping</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/5 space-y-1">
          <p className="text-xs text-slate-400 flex items-center justify-between">
            <span>Telegram Bot API</span>
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
          </p>
          <p className="text-2xl font-black text-emerald-400">Online</p>
          <span className="text-[11px] text-slate-500">Webhook Polling: 0ms</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Umumiy Ko'rinish
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Foydalanuvchilar ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Kirish Loglari ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('telegram')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'telegram'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Telegram Bot Xabarnoma
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent audit log preview */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center justify-between">
              <span>So'nggi Kirishlar va Faoliyat Logi</span>
              <button
                onClick={() => setActiveTab('logs')}
                className="text-xs text-blue-400 hover:underline font-normal"
              >
                Barchasini ko'rish &rarr;
              </button>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Foydalanuvchi</th>
                    <th className="p-3">Roli</th>
                    <th className="p-3">Harakat</th>
                    <th className="p-3">IP Manzil</th>
                    <th className="p-3">Vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logs.slice(0, 4).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-semibold text-white">
                        {log.userName}
                      </td>
                      <td className="p-3">
                        <span className="capitalize text-slate-300">
                          {log.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-200">
                        {log.action}
                      </td>
                      <td className="p-3 text-slate-500 font-mono">
                        {log.ip}
                      </td>
                      <td className="p-3 text-slate-400">
                        {log.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Foydalanuvchini qidirish..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Rol:</span>
              {['all', 'student', 'teacher', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs capitalize ${
                    roleFilter === r
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r === 'all' ? 'Barchasi' : r}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Ism</th>
                  <th className="p-3">Telefon</th>
                  <th className="p-3">Roli</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Rolni O'zgartirish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-white">
                      {user.name}
                    </td>
                    <td className="p-3 text-slate-400 font-mono">
                      {user.phone}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        user.role === 'admin'
                          ? 'bg-rose-500/20 text-rose-300'
                          : user.role === 'teacher'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => onToggleUserStatus(user.id)}
                        className={`text-xs font-medium px-2 py-0.5 rounded transition-colors ${
                          user.status === 'active'
                            ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                            : 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                        }`}
                      >
                        {user.status === 'active' ? 'Faol' : 'Bloklangan'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={user.role}
                        onChange={(e) => onUpdateUserRole(user.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="student">O'quvchi</option>
                        <option value="teacher">O'qituvchi</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Detailed Logs */}
      {activeTab === 'logs' && (
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <h3 className="font-bold text-base text-white">
            Tizimdagi Barcha Audit Loglari
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Foydalanuvchi</th>
                  <th className="p-3">Telefon</th>
                  <th className="p-3">Roli</th>
                  <th className="p-3">Harakat</th>
                  <th className="p-3">IP Manzil</th>
                  <th className="p-3">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-white">{log.userName}</td>
                    <td className="p-3 text-slate-400 font-mono">{log.phone}</td>
                    <td className="p-3 capitalize">{log.role}</td>
                    <td className="p-3 text-slate-200">{log.action}</td>
                    <td className="p-3 text-slate-500 font-mono">{log.ip}</td>
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Telegram Broadcast */}
      {activeTab === 'telegram' && (
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Telegram Bot orqali Ommaviy Xabarnoma
              </h3>
              <p className="text-xs text-slate-400">
                Ro'yxatdan o'tgan barcha 1,482 ta o'quvchi va o'qituvchilarga muhim xabarlarni yuborish.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Xabar Matni
              </label>
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Diqqat! Ertaga soat 18:00 da Ingliz tili bo'yicha Respublika bosqichi saralash testi bo'lib o'tadi..."
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Webhook: https://api.telegram.org/bot718.../sendMessage
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Telegram Bot orqali Tarqatish</span>
              </button>
            </div>

            {broadcastSent && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Xabar barcha faol foydalanuvchilarning Telegram botiga muvaffaqiyatli yetkazildi!</span>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
