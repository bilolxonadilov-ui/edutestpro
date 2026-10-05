import React, { useState, useEffect, useCallback } from 'react';
import { Test, TestAttempt, QuestionAnswer } from '../../types';
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  CheckCircle2,
  HelpCircle,
  Flag
} from 'lucide-react';
import { playSelectSound, playTickSound, playSuccessSound } from '../../utils/audio';

interface TestRunnerProps {
  test: Test;
  studentName: string;
  studentId: string;
  onFinishTest: (attempt: TestAttempt) => void;
  onExit: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  test,
  studentName,
  studentId,
  onFinishTest,
  onExit
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(test.durationMinutes * 60);
  const [isConfirmingFinish, setIsConfirmingFinish] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQ = test.questions[currentIdx];
  const totalQuestions = test.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // Complete Quiz handler
  const handleFinish = useCallback(() => {
    playSuccessSound();
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    
    let score = 0;
    const answers: QuestionAnswer[] = test.questions.map((q) => {
      const selected = selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : null;
      const isCorrect = selected === q.correctOptionIndex;
      if (isCorrect) score += (q.points || 1);
      return {
        questionId: q.id,
        selectedOption: selected,
        isCorrect
      };
    });

    const maxScore = test.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const percentage = Math.round((score / maxScore) * 100);

    const now = new Date();
    const completedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      subject: test.subject,
      studentId,
      studentName,
      score,
      maxScore,
      percentage,
      timeSpentSeconds: timeSpent,
      completedAt,
      answers
    };

    onFinishTest(attempt);
  }, [test, selectedAnswers, startTime, studentId, studentName, onFinishTest]);

  // Timer Countdown Effect
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        if (prev <= 30 && prev % 2 === 0) {
          playTickSound();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds, handleFinish]);

  // Option selection
  const handleSelectOption = (optIndex: number) => {
    playSelectSound();
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  // Toggle flag for question review
  const toggleFlag = (qId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isConfirmingFinish) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQ && currentQ.options[idx]) {
          handleSelectOption(idx);
        }
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        const idx = e.key.toLowerCase().charCodeAt(0) - 97;
        if (currentQ && currentQ.options[idx]) {
          handleSelectOption(idx);
        }
      } else if (e.key === 'ArrowRight' && currentIdx < totalQuestions - 1) {
        setCurrentIdx(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIdx > 0) {
        setCurrentIdx(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, currentQ, totalQuestions, isConfirmingFinish]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const isTimeLow = timeLeftSeconds < 120;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Runner Top Bar */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-white/10">
        <div>
          <h2 className="text-sm font-bold text-white leading-tight truncate max-w-[280px] sm:max-w-md">
            {test.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {test.subject} · {answeredCount}/{totalQuestions} ta javob berildi
          </p>
        </div>

        {/* Real-time countdown timer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold tracking-wider border transition-all ${
          isTimeLow 
            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse' 
            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
        }`}>
          <Clock className="w-4 h-4" />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Question Selector Strip */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10 flex items-center gap-1.5 overflow-x-auto py-2.5">
        {test.questions.map((q, idx) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCurrent = idx === currentIdx;
          const isFlagged = flaggedQuestions[q.id];

          let btnClass = "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white";
          if (isCurrent) {
            btnClass = "bg-blue-600 text-white font-bold ring-2 ring-blue-400 border-blue-500 shadow-md shadow-blue-500/30";
          } else if (isAnswered) {
            btnClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold";
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`relative min-w-9 h-9 rounded-xl border text-xs flex items-center justify-center transition-all ${btnClass}`}
            >
              {idx + 1}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        {/* Question Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Savol {currentIdx + 1} / {totalQuestions}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.questionText}
            </h3>
          </div>

          <button
            onClick={() => toggleFlag(currentQ.id)}
            title="Savolni belgilab qo'yish"
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              flaggedQuestions[currentQ.id]
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Belgilash</span>
          </button>
        </div>

        {/* Options Selection List */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const isSelected = selectedAnswers[currentQ.id] === optIdx;

            return (
              <label
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold mr-3.5 transition-colors ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {letter}
                </div>
                <span className="text-sm font-medium flex-1">
                  {option}
                </span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-700'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>

        {/* Navigation & Submit Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Oldingi</span>
          </button>

          <div className="flex items-center gap-2">
            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all"
              >
                <span>Keyingi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsConfirmingFinish(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Testni Yakunlash</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Finish Modal */}
      {isConfirmingFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 max-w-md w-full border border-white/10 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Testni yakunlashga ishonchingiz komilmi?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Jami {totalQuestions} ta savoldan {answeredCount} tasiga javob berdingiz. 
                {totalQuestions - answeredCount > 0 && (
                  <span className="text-amber-400 block mt-1">
                    {totalQuestions - answeredCount} ta savol hali javobsiz qoldi!
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsConfirmingFinish(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Davom etish
              </button>
              <button
                onClick={handleFinish}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
              >
                Ha, yakunlayman
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
