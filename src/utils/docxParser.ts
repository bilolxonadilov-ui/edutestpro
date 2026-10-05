import mammoth from 'mammoth';
import { Question } from '../types';

export interface ParseResult {
  questions: Question[];
  rawText: string;
  totalQuestions: number;
  validQuestions: number;
  warnings: string[];
}

/**
 * Extracts raw text from a Word .docx file ArrayBuffer
 */
export async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

/**
 * Parses raw text into structured Question objects.
 * Supports:
 * 1) Standard school/university test formats:
 *    1. Savol matni...
 *    A) Variant 1
 *    *B) To'g'ri variant
 *    C) Variant 3
 *    D) Variant 4
 *    Izoh: Izoh matni...
 *
 * 2) Format with answer key line:
 *    1. Savol matni...
 *    A) ...
 *    B) ...
 *    C) ...
 *    D) ...
 *    Javob: B
 *    Izoh: ...
 *
 * 3) Plus sign prefix for correct answer:
 *    +B) To'g'ri variant
 */
export function parseTestText(rawContent: string): ParseResult {
  const warnings: string[] = [];
  const lines = rawContent
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    return {
      questions: [],
      rawText: rawContent,
      totalQuestions: 0,
      validQuestions: 0,
      warnings: ["Fayl yoki matn bo'sh!"]
    };
  }

  // Regex patterns
  // Matches question start like: "1.", "1)", "1 -", "Savol 1:", "1. "
  const questionStartRegex = /^(\d+[\.\)]|\bSavol\s+\d+[:\.]?)\s*(.*)/i;
  // Matches option line like: "A)", "*A)", "+A)", "A.", "*A.", "(A)", "A -"
  const optionRegex = /^([*+])?\s*(?:\(?([A-Da-d])[\.\)]|\(([A-Da-d])\))\s*(.*)/;
  // Matches key line like: "Javob: B", "To'g'ri javob: C", "Kalit: A", "Answer: D"
  const answerKeyRegex = /^(?:Javob|To'g'ri javob|To`g`ri javob|Kalit|Answer):\s*([A-Da-d])/i;
  // Matches explanation line like: "Izoh: ...", "Tushuntirish: ...", "Explanation: ..."
  const explanationRegex = /^(?:Izoh|Tushuntirish|Explanation|Qayd):\s*(.*)/i;

  interface TempQuestion {
    text: string[];
    options: { text: string; isCorrect: boolean; keyLetter: string }[];
    answerKey?: string;
    explanation?: string;
  }

  const rawQuestions: TempQuestion[] = [];
  let currentQ: TempQuestion | null = null;
  let capturingExplanation = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if new question started
    const qMatch = line.match(questionStartRegex);
    if (qMatch) {
      if (currentQ) {
        rawQuestions.push(currentQ);
      }
      currentQ = {
        text: [qMatch[2] || ''],
        options: []
      };
      capturingExplanation = false;
      continue;
    }

    if (!currentQ) {
      // First line might be question without number
      if (!line.match(optionRegex) && !line.match(answerKeyRegex)) {
        currentQ = {
          text: [line],
          options: []
        };
        continue;
      }
    }

    // Check explanation line
    const expMatch = line.match(explanationRegex);
    if (expMatch && currentQ) {
      currentQ.explanation = expMatch[1];
      capturingExplanation = true;
      continue;
    }

    // Check answer key line
    const keyMatch = line.match(answerKeyRegex);
    if (keyMatch && currentQ) {
      currentQ.answerKey = keyMatch[1].toUpperCase();
      continue;
    }

    // Check option line
    const optMatch = line.match(optionRegex);
    if (optMatch && currentQ) {
      capturingExplanation = false;
      const isMarkedCorrect = Boolean(optMatch[1]); // '*' or '+'
      const letter = (optMatch[2] || optMatch[3]).toUpperCase();
      const optionText = optMatch[4]?.trim() || '';

      currentQ.options.push({
        text: optionText,
        isCorrect: isMarkedCorrect,
        keyLetter: letter
      });
      continue;
    }

    // Continuation of explanation or question text or option
    if (currentQ) {
      if (capturingExplanation) {
        currentQ.explanation = (currentQ.explanation ? currentQ.explanation + ' ' : '') + line;
      } else if (currentQ.options.length > 0) {
        // Multi-line option text
        const lastOpt = currentQ.options[currentQ.options.length - 1];
        lastOpt.text += ' ' + line;
      } else {
        // Multi-line question text
        currentQ.text.push(line);
      }
    }
  }

  if (currentQ) {
    rawQuestions.push(currentQ);
  }

  // Convert to final Question objects and validate
  const parsedQuestions: Question[] = [];

  rawQuestions.forEach((rq, idx) => {
    const qText = rq.text.join(' ').trim();
    if (!qText && rq.options.length === 0) return;

    let correctIndex = -1;

    // Check if an option was marked with * or +
    const markedIndex = rq.options.findIndex(o => o.isCorrect);
    if (markedIndex !== -1) {
      correctIndex = markedIndex;
    } else if (rq.answerKey) {
      // Find option matching answerKey letter (A -> 0, B -> 1, C -> 2, D -> 3)
      const keyLetter = rq.answerKey.toUpperCase();
      const foundIdx = rq.options.findIndex(o => o.keyLetter === keyLetter);
      if (foundIdx !== -1) {
        correctIndex = foundIdx;
      } else {
        const letterCode = keyLetter.charCodeAt(0) - 65;
        if (letterCode >= 0 && letterCode < rq.options.length) {
          correctIndex = letterCode;
        }
      }
    }

    if (rq.options.length < 2) {
      warnings.push(`${idx + 1}-savolda kamida 2 ta variant bo'lishi kerak.`);
    }

    if (correctIndex === -1) {
      // Default to 0 and add warning
      correctIndex = 0;
      warnings.push(`${idx + 1}-savol uchun to'g'ri javob belgilanmagan, birinchi variant (A) olindi.`);
    }

    const cleanOptions = rq.options.map(o => o.text.trim());

    parsedQuestions.push({
      id: `q-${Date.now()}-${idx + 1}`,
      questionText: qText || `${idx + 1}-savol matni`,
      options: cleanOptions.length > 0 ? cleanOptions : ['Variant 1', 'Variant 2', 'Variant 3', 'Variant 4'],
      correctOptionIndex: correctIndex,
      explanation: rq.explanation?.trim(),
      points: 1
    });
  });

  return {
    questions: parsedQuestions,
    rawText: rawContent,
    totalQuestions: parsedQuestions.length,
    validQuestions: parsedQuestions.filter(q => q.options.length >= 2).length,
    warnings
  };
}

export const SAMPLE_DOCX_TEXT = `1. Which sentence uses the Second Conditional correctly?
A) If it will rain tomorrow, I stay at home.
*B) If I had enough money, I would travel around the world.
C) If I study hard, I would pass the exam yesterday.
D) If she comes early, we went to the cinema.
Izoh: Second Conditional formulasi: If + Past Simple, would + V1. Haqiqatga zid yoki xayoliy vaziyatlar uchun qo'llaniladi.

2. In Python, what is the output of len([1, 2, [3, 4]])?
A) 4
*B) 3
C) 2
D) TypeError
Izoh: Ro'yxat uchta elementdan iborat: 1, 2 sonlari va [3, 4] ichki ro'yxati. Shuning uchun umumiy uzunligi 3 ga teng.

3. O'zbekiston Respublikasi Konstitutsiyasining birinchi moddasiga ko'ra davlat shakli qanday belgilangan?
*A) Suveren, demokratik, huquqiy, ijtimoiy va dunyoviy davlat
B) Faqatgina unitar respublika
C) Federativ davlatlar ittifoqi
D) Monarxiya va xalq kengashi
Izoh: Yangi tahrirdagi Konstitutsiyaning 1-moddasida O'zbekiston boshqaruv shakli respublika bo'lgan suveren, demokratik, huquqiy, ijtimoiy va dunyoviy davlat deb mustahkamlangan.

4. Logarifm: log₂(32) ifodaning qiymatini toping.
A) 4
*B) 5
C) 6
D) 16
Izoh: 2 ning 5-darajasi 32 ga teng: 2^5 = 32. Shuning uchun log₂(32) = 5 bo'ladi.`;
