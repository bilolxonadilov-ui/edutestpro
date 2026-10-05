import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Test, TestAttempt } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  Lightbulb, 
  Trophy, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TestResultsProps {
  test: Test;
  attempt: TestAttempt;
  onRetake: () => void;
  onBackToDashboard: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({
  test,
  attempt,
  onRetake,
  onBackToDashboard
}) => {
  const isPassed = attempt.percentage >= 70;

  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore
      }
    }
  }, [isPassed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl ${
              isPassed 
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/20' 
                : 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-rose-500/20'
            }`}>
              {attempt.percentage}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  isPassed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {isPassed ? "Muvaffaqiyatli topshirildi" : "Qayta urinib ko'ring"}
                </span>
                <span className="text-xs text-slate-400">{test.subject}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {test.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {attempt.studentName} · {attempt.completedAt}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 sm:border-l sm:border-slate-800 sm:pl-6 text-center">
            <div>
              <p className="text-xs text-slate-400">To'g'ri javob</p>
              <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
                {attempt.score} <span className="text-xs text-slate-500">/ {attempt.maxScore}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Sarflangan vaqt</p>
              <p className="text-xl font-extrabold text-blue-400 mt-0.5">
                {formatTime(attempt.timeSpentSeconds)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-800">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Testlar ro'yxatiga qaytish</span>
          </button>

          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Testni qayta topshirish</span>
          </button>
        </div>
      </div>

      {/* Question by Question Detailed Pedagogical Review */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Batafsil Savollar Tahlili</span>
          <span className="text-xs font-normal text-slate-400">({test.questions.length} ta savol)</span>
        </h3>

        {test.questions.map((q, idx) => {
          const userAns = attempt.answers.find(a => a.questionId === q.id);
          const isCorrect = userAns ? userAns.isCorrect : false;
          const userOptionIdx = userAns ? userAns.selectedOption : null;

          return (
            <div
              key={q.id}
              className={`glass-panel rounded-2xl p-5 border transition-all ${
                isCorrect 
                  ? 'border-emerald-500/30 bg-emerald-950/10' 
                  : 'border-rose-500/30 bg-rose-950/10'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                    isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {q.questionText}
                  </span>
                </div>
                {isCorrect ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>To'g'ri</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-rose-400 font-semibold shrink-0">
                    <XCircle className="w-4 h-4" />
                    <span>Xato</span>
                  </span>
                )}
              </div>

              {/* Options List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                {q.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isThisCorrect = optIdx === q.correctOptionIndex;
                  const isUserSelection = optIdx === userOptionIdx;

                  let optClass = "bg-slate-900/60 border-slate-800 text-slate-400";
                  if (isThisCorrect) {
                    optClass = "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium";
                  } else if (isUserSelection && !isThisCorrect) {
                    optClass = "bg-rose-500/15 border-rose-500/40 text-rose-300 line-through";
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optClass}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-300">{letter})</span>
                        <span>{opt}</span>
                      </div>
                      {isThisCorrect && (
                        <span className="text-[10px] text-emerald-400 font-semibold shrink-0">
                          To'g'ri kalit
                        </span>
                      )}
                      {isUserSelection && !isThisCorrect && (
                        <span className="text-[10px] text-rose-400 font-semibold shrink-0">
                          Sizning javob
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Note */}
              {q.explanation && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-400/90 mr-1">Izoh va tushuntirish:</strong>
                    <span>{q.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
