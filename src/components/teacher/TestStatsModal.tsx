import React from 'react';
import { Test, TestAttempt } from '../../types';
import { 
  X, 
  Users, 
  BarChart, 
  Clock, 
  Trophy, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TestStatsModalProps {
  test: Test;
  attempts: TestAttempt[];
  onClose: () => void;
}

export const TestStatsModal: React.FC<TestStatsModalProps> = ({
  test,
  attempts,
  onClose
}) => {
  const testAttempts = attempts.filter(a => a.testId === test.id);
  const totalSubmissions = testAttempts.length;
  const avgPercentage = totalSubmissions > 0
    ? Math.round(testAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalSubmissions)
    : 0;
  const passedCount = testAttempts.filter(a => a.percentage >= 70).length;
  const passRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
              {test.subject} · {test.groupName || 'Umumiy Guruh'}
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              {test.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              O'quvchilar natijalari va statistik tahlil
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <div>
            <p className="text-xs text-slate-400">Topshirganlar</p>
            <p className="text-xl font-black text-white mt-1">{totalSubmissions}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">O'rtacha Ball</p>
            <p className="text-xl font-black text-blue-400 mt-1">{avgPercentage}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">O'tish Ko'rsatkichi</p>
            <p className="text-xl font-black text-emerald-400 mt-1">{passRate}%</p>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Topshirgan O'quvchilar Ro'yxati
          </h4>

          {testAttempts.length > 0 ? (
            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 sticky top-0 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">O'quvchi</th>
                    <th className="p-3">Natija</th>
                    <th className="p-3">Vaqt</th>
                    <th className="p-3">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {testAttempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">
                        {att.studentName}
                      </td>
                      <td className="p-3">
                        <span className={`font-bold ${att.percentage >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {att.score}/{att.maxScore} ({att.percentage}%)
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-mono">
                        {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                      </td>
                      <td className="p-3 text-slate-400">
                        {att.completedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
              Bu testni hali hech bir o'quvchi topshirmagan.
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
