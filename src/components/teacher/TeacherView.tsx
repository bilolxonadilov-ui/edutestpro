import React, { useState } from 'react';
import { User, Test, Group, TestAttempt } from '../../types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  BarChart2, 
  Clock, 
  Users, 
  BookOpen, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DocxImporter } from './DocxImporter';
import { GroupManager } from './GroupManager';
import { TestStatsModal } from './TestStatsModal';

interface TeacherViewProps {
  currentUser: User;
  tests: Test[];
  groups: Group[];
  attempts: TestAttempt[];
  onAddTest: (test: Test) => void;
  onDeleteTest: (testId: string) => void;
  onAddGroup: (group: Group) => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  currentUser,
  tests,
  groups,
  attempts,
  onAddTest,
  onDeleteTest,
  onAddGroup
}) => {
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [inspectedTest, setInspectedTest] = useState<Test | null>(null);

  const teacherTests = tests.filter(
    t => t.authorName === currentUser.name || t.authorName.includes('Ziyokor') || true
  );

  const handleSavedNewTest = (newTest: Test) => {
    onAddTest(newTest);
    setIsImporterOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Teacher Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>O'qituvchi Boshqaruv Paneli</span>
            <span className="text-slate-600">·</span>
            <span>{currentUser.name}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Guruhlar va Testlar Nazorati
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Word (.docx) fayllar orqali testlarni soniyalarda platformaga yuklang va tahlil qiling.
          </p>
        </div>

        <button
          onClick={() => setIsImporterOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <FileText className="w-4 h-4" />
          <span>Word (.docx) dan Test Yuklash</span>
        </button>
      </div>

      {/* Main Layout: Word Importer or Grid with Tests & Groups */}
      {isImporterOpen ? (
        <DocxImporter
          groups={groups}
          authorName={currentUser.name}
          onSaveTest={handleSavedNewTest}
          onCancel={() => setIsImporterOpen(false)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Tests List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Mavjud Testlar ({teacherTests.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {teacherTests.map((test) => {
                const testSubmissions = attempts.filter(a => a.testId === test.id);
                return (
                  <div
                    key={test.id}
                    className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-blue-400">
                            {test.subject}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">
                            {test.groupName || 'Umumiy Guruh'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">
                          {test.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {test.description}
                        </p>
                      </div>

                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium shrink-0">
                        Nashr qilingan
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-4 text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{test.durationMinutes} min</span>
                        </span>
                        <span>{test.questions.length} ta savol</span>
                        <span className="text-blue-400 font-medium">
                          {testSubmissions.length} ta topshirildi
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInspectedTest(test)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-colors"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                          <span>Natijalar</span>
                        </button>

                        <button
                          onClick={() => onDeleteTest(test.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Testni o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Group Management */}
          <div>
            <GroupManager
              groups={groups}
              teacherName={currentUser.name}
              onAddGroup={onAddGroup}
            />
          </div>
        </div>
      )}

      {/* Inspect test stats modal */}
      {inspectedTest && (
        <TestStatsModal
          test={inspectedTest}
          attempts={attempts}
          onClose={() => setInspectedTest(null)}
        />
      )}
    </div>
  );
};
