import React, { useState } from 'react';
import { Group } from '../../types';
import { 
  Users, 
  Plus, 
  Copy, 
  Check, 
  BookOpen, 
  X,
  Share2
} from 'lucide-react';
import { playSuccessSound } from '../../utils/audio';

interface GroupManagerProps {
  groups: Group[];
  teacherName: string;
  onAddGroup: (newGroup: Group) => void;
}

export const GroupManager: React.FC<GroupManagerProps> = ({
  groups,
  teacherName,
  onAddGroup
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !subject.trim()) return;

    playSuccessSound();

    const codePart = groupName.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'GRP');
    const randomNum = Math.floor(100 + Math.random() * 900);

    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name: groupName.trim(),
      subject: subject.trim(),
      studentsCount: 1, // teacher added
      createdAt: new Date().toISOString().split('T')[0],
      inviteCode: `${codePart}-${randomNum}`,
      teacherName,
      description: description.trim() || 'Yangi o`quv guruhi.'
    };

    onAddGroup(newGroup);
    setGroupName('');
    setSubject('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header and Add button */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span>Mening Guruhlarim ({groups.length})</span>
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi Guruh</span>
        </button>
      </div>

      {/* Groups List */}
      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {group.name}
                </h4>
                <p className="text-xs text-blue-400 font-medium mt-0.5">
                  {group.subject}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {group.description}
                </p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium shrink-0">
                Faol
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{group.studentsCount} ta o'quvchi</span>
              </span>

              {/* Copy Invite Code */}
              <button
                onClick={() => handleCopyCode(group.inviteCode, group.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors"
                title="Taklif kodini nusxalash"
              >
                {copiedId === group.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>{group.inviteCode}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 max-w-md w-full border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Yangi Guruh Ochish</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Guruh Nomi
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Masalan: Ziyokor Pre-Intermediate"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Fan yoki Yo'nalish
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Masalan: Ingliz Tili"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Tavsif (ixtiyoriy)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Guruh maqsadlari va talablari..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
                >
                  Guruhni Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
