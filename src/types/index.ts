export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  telegramUsername?: string;
  registeredAt: string;
  status: 'active' | 'suspended';
  testsSolved?: number;
  averageScore?: number;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  points?: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  subject: string;
  durationMinutes: number;
  questions: Question[];
  groupId?: string;
  groupName?: string;
  createdAt: string;
  attemptsAllowed?: number;
  authorName: string;
  isPublished: boolean;
  difficulty?: 'oson' | "o'rta" | 'qiyin';
}

export interface Group {
  id: string;
  name: string;
  subject: string;
  studentsCount: number;
  createdAt: string;
  inviteCode: string;
  teacherName: string;
  description: string;
}

export interface QuestionAnswer {
  questionId: string;
  selectedOption: number | null;
  isCorrect: boolean;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  subject: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: QuestionAnswer[];
}

export interface SystemLog {
  id: string;
  userName: string;
  role: UserRole;
  phone: string;
  action: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}
