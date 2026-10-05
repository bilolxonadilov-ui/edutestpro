import React, { useState, useRef } from 'react';
import { Question, Group, Test } from '../../types';
import { 
  extractTextFromDocx, 
  parseTestText, 
  SAMPLE_DOCX_TEXT, 
  ParseResult 
} from '../../utils/docxParser';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Sparkles, 
  Clock, 
  Layers, 
  X,
  Plus,
  Trash2,
  FileCode
} from 'lucide-react';
import { playSuccessSound } from '../../utils/audio';

interface DocxImporterProps {
  groups: Group[];
  authorName: string;
  onSaveTest: (newTest: Test) => void;
  onCancel: () => void;
}

export const DocxImporter: React.FC<DocxImporterProps> = ({
  groups,
  authorName,
  onSaveTest,
  onCancel
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'paste'>('upload');
  const [rawText, setRawText] = useState(SAMPLE_DOCX_TEXT);
  const [parseResult, setParseResult] = useState<ParseResult>(() => parseTestText(SAMPLE_DOCX_TEXT));
  const [testTitle, setTestTitle] = useState('Ingliz Tili & Grammatika Nazorati');
  const [subject, setSubject] = useState('Ingliz Tili');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file drop or selection
  const handleFileChange = async (file: File) => {
    setIsProcessingFile(true);
    setFileName(file.name);

    try {
      let extracted = '';
      if (file.name.endsWith('.docx')) {
        const buffer = await file.arrayBuffer();
        extracted = await extractTextFromDocx(buffer);
      } else {
        // Text or markdown
        extracted = await file.text();
      }

      setRawText(extracted);
      const res = parseTestText(extracted);
      setParseResult(res);

      // Auto deduce title from filename
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      if (cleanName && cleanName.length > 3) {
        setTestTitle(cleanName);
      }
    } catch (err) {
      console.error('File parsing error:', err);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handlePasteChange = (text: string) => {
    setRawText(text);
    const res = parseTestText(text);
    setParseResult(res);
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_DOCX_TEXT);
    setParseResult(parseTestText(SAMPLE_DOCX_TEXT));
    setFileName('namuna-test-savollari.docx');
  };

  // Modify individual question in parsed preview
  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    const updated = [...parseResult.questions];
    updated[qIdx].options[optIdx] = val;
    setParseResult({
      ...parseResult,
      questions: updated
    });
  };

  const handleSetCorrectOption = (qIdx: number, optIdx: number) => {
    const updated = [...parseResult.questions];
    updated[qIdx].correctOptionIndex = optIdx;
    setParseResult({
      ...parseResult,
      questions: updated
    });
  };

  const handleDeleteQuestion = (qIdx: number) => {
    const updated = parseResult.questions.filter((_, i) => i !== qIdx);
    setParseResult({
      ...parseResult,
      questions: updated,
      totalQuestions: updated.length
    });
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseResult.questions.length === 0) return;

    playSuccessSound();

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    const newTest: Test = {
      id: `test-${Date.now()}`,
      title: testTitle.trim() || 'Yangi Test',
      description: `${parseResult.questions.length} ta savoldan iborat yangi test sinovi.`,
      subject: subject.trim() || 'Umumiy',
      durationMinutes: Number(durationMinutes) || 20,
      questions: parseResult.questions,
      groupId: selectedGroupId,
      groupName: selectedGroup?.name || 'Umumiy Guruh',
      createdAt: new Date().toISOString().split('T')[0],
      authorName,
      isPublished: true,
      difficulty: "o'rta"
    };

    onSaveTest(newTest);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Word (.docx) & Matn Avto-Import</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Yangi Test Yaratish va Avto-Parser
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Word faylingizni yuklang yoki test matnini nusxalang. Tizim avtomatik savol va javoblarni ajratib oladi.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Meta Form: Title, Subject, Duration, Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Test Nomi
          </label>
          <input
            type="text"
            required
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            placeholder="Masalan: Unit 4 Grammar"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Fan
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ingliz Tili / Informatika"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Vaqt (daqiqa)
          </label>
          <input
            type="number"
            min={1}
            max={180}
            required
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Guruhni biriktirish
          </label>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {groups.map(g => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.studentsCount} o'quvchi)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Mode Selector: Upload or Paste */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveInputMode('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeInputMode === 'upload'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 inline mr-1.5" />
            .docx Fayl Yuklash
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeInputMode === 'paste'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 inline mr-1.5" />
            Matnni Qo'lda Kiritish
          </button>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2"
        >
          Namunaviy test matnini yuklash
        </button>
      </div>

      {/* Upload Zone or Raw Editor */}
      {activeInputMode === 'upload' ? (
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
              }
            }}
            className="border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-8 text-center bg-slate-900/40 hover:bg-slate-900/60 cursor-pointer transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".docx,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-200">
              Word (.docx) yoki matnli test faylini shu yerga tashlang yoki tanlang
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Qo'llab-quvvatlanadi: .docx, .txt (Savol matni, A) variant, *B) to'g'ri variant)
            </p>
            {fileName && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs">
                <FileCheck className="w-3.5 h-3.5" />
                <span>{fileName}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => handlePasteChange(e.target.value)}
            placeholder="Savollar matnini shu yerga yozing yoki Word fayldan nusxalang..."
            className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Parser Summary & Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Aniqlangan Savollar: {parseResult.questions.length} ta</span>
          </div>
          {parseResult.warnings.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>{parseResult.warnings.length} ta ogohlantirish</span>
            </div>
          )}
        </div>

        <span className="text-[11px] text-slate-400">
          Format: Har bir to'g'ri variant oldiga * (masalan: *B) yoki pastda Javob: B
        </span>
      </div>

      {/* Live Parsed Questions List with Editing */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Aniqlangan Savollar Namunasi (Parser Live Preview & Tahrirlash)
        </h4>

        {parseResult.questions.map((q, qIdx) => (
          <div
            key={q.id}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                  {qIdx + 1}
                </span>
                <span className="font-semibold text-white text-sm">
                  {q.questionText}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteQuestion(qIdx)}
                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                title="Savolni o'chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, optIdx) => {
                const isCorrect = optIdx === q.correctOptionIndex;
                const letter = String.fromCharCode(65 + optIdx);

                return (
                  <div
                    key={optIdx}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSetCorrectOption(qIdx, optIdx)}
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isCorrect
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                      title={isCorrect ? "To'g'ri javob kaliti" : "To'g'ri deb belgilash"}
                    >
                      {letter}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                      className="bg-transparent border-0 text-xs w-full focus:outline-none"
                    />
                    {isCorrect && (
                      <span className="text-[10px] font-bold text-emerald-400 shrink-0">
                        *To'g'ri
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation Preview */}
            {q.explanation && (
              <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-semibold mr-1">Izoh:</span>
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer Submit Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
        >
          Bekor qilish
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={parseResult.questions.length === 0}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          Testni E'lon Qilish va O'quvchilarga Jo'natish &rarr;
        </button>
      </div>
    </div>
  );
};
