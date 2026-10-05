import React, { useState } from 'react';
import { User, Test, TestAttempt } from '../../types';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  History, 
  Search, 
  BookOpen, 
  Sparkles, 
  BarChart3, 
  Award,
  ChevronRight
} from 'lucide-react';
import { TestRunner } from './TestRunner';
import { TestResults } from './TestResults';

interface StudentViewProps {
  currentUser: User;
  tests: Test[];
  attempts: TestAttempt[];
  onSaveAttempt: (attempt: TestAttempt) => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  currentUser,
  tests,
  attempts,
  onSaveAttempt
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'history'>('tests');
  const [selectedSubject, setSelectedSubject] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<TestAttempt | null>(null);

  const subjects = ['Barchasi', 'Ingliz Tili', 'Informatika', 'Tarix', 'Matematika'];

  const filteredTests = tests.filter(test => {
    const matchesSubject = selectedSubject === 'Barchasi' || test.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const studentAttempts = attempts.filter(a => a.studentId === currentUser.id);

  // Start test
  const handleStartTest = (test: Test) => {
    setCurrentAttempt(null);
    setActiveTest(test);
  };

  // Complete test
  const handleFinishTest = (attempt: TestAttempt) => {
    onSaveAttempt(attempt);
    setCurrentAttempt(attempt);
  };

  // Retake test
  const handleRetake = () => {
    if (activeTest) {
      setCurrentAttempt(null);
    }
  };

  // Back to test list
  const handleBackToList = () => {
    setActiveTest(null);
    setCurrentAttempt(null);
  };

  // If in results mode
  if (activeTest && currentAttempt) {
    return (
      <TestResults
        test={activeTest}
        attempt={currentAttempt}
        onRetake={handleRetake}
        onBackToDashboard={handleBackToList}
      />
    );
  }

  // If in test running mode
  if (activeTest) {
    return (
      <TestRunner
        test={activeTest}
        studentName={currentUser.name}
        studentId={currentUser.id}
        onFinishTest={handleFinishTest}
        onExit={handleBackToList}
      />
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden border border-white/10">
        <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-blue-400 font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>O'quvchi Paneli</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">{currentUser.phone}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Xush kelibsiz, {currentUser.name}! 👋
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Bugungi faol testlar, guruh topshiriqlari va shaxsiy bilim ko'rsatkichlaringiz.
          </p>
        </div>

        {tests.length > 0 && (
          <button
            onClick={() => handleStartTest(tests[0])}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-xs sm:text-sm text-white shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Demo Testni Boshlash</span>
          </button>
        )}
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs (tests vs history) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tests'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Faol Testlar ({tests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Natijalarim ({studentAttempts.length})</span>
          </button>
        </div>

        {/* Search */}
        {activeTab === 'tests' && (
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Test yoki mavzu qidirish..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === 'tests' ? (
        <div className="space-y-4">
          {/* Subject Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {subjects.map(subj => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedSubject === subj
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-blue-400">
                      {test.subject}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{test.durationMinutes} daqiqa</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {test.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {test.questions.length} ta savol
                  </span>
                  <button
                    onClick={() => handleStartTest(test)}
                    className="flex items-center gap-1 text-blue-400 font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    <span>Topshirish</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-2xl border border-white/5">
              <p className="text-sm text-slate-400">Bunday mezon bo'yicha testlar topilmadi.</p>
            </div>
          )}
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-4">
          {studentAttempts.length > 0 ? (
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Test Nomi</th>
                      <th className="p-4">Fan</th>
                      <th className="p-4">Ball / Natija</th>
                      <th className="p-4">Vaqt</th>
                      <th className="p-4">Sana</th>
                      <th className="p-4 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {studentAttempts.map((att) => {
                      const isSuccess = att.percentage >= 70;
                      const matchedTest = tests.find(t => t.id === att.testId);

                      return (
                        <tr key={att.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-semibold text-white">
                            {att.testTitle}
                          </td>
                          <td className="p-4 text-slate-400">
                            {att.subject}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 font-bold ${
                              isSuccess ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {att.score} / {att.maxScore} ({att.percentage}%)
                            </span>
                          </td>
                          <td className="p-4 font-mono text-slate-400">
                            {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                          </td>
                          <td className="p-4 text-slate-400">
                            {att.completedAt}
                          </td>
                          <td className="p-4 text-right">
                            {matchedTest && (
                              <button
                                onClick={() => {
                                  setActiveTest(matchedTest);
                                  setCurrentAttempt(att);
                                }}
                                className="text-blue-400 hover:text-blue-300 font-semibold"
                              >
                                Tahlilni ko'rish &rarr;
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 glass-panel rounded-2xl border border-white/5">
              <p className="text-sm text-slate-400">Hozircha hech qanday test topshirilmagan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
