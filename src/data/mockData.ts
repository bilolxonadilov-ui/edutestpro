import { Test, Group, User, TestAttempt, SystemLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Bilolxon Adilov',
    phone: '+998 90 123 45 67',
    role: 'student',
    telegramUsername: '@bilol_adilov',
    registeredAt: '2026-02-14',
    status: 'active',
    testsSolved: 19,
    averageScore: 92
  },
  {
    id: 'user-2',
    name: 'Ustoz Nodirbek Ziyokor',
    phone: '+998 91 765 43 21',
    role: 'teacher',
    telegramUsername: '@ziyokor_teacher',
    registeredAt: '2026-01-10',
    status: 'active'
  },
  {
    id: 'user-3',
    name: 'Admin Nazoratchi',
    phone: '+998 93 999 88 77',
    role: 'admin',
    telegramUsername: '@edutest_admin',
    registeredAt: '2025-12-01',
    status: 'active'
  },
  {
    id: 'user-4',
    name: 'Malika Karimova',
    phone: '+998 99 345 67 89',
    role: 'student',
    telegramUsername: '@malika_k',
    registeredAt: '2026-02-20',
    status: 'active',
    testsSolved: 14,
    averageScore: 88
  },
  {
    id: 'user-5',
    name: 'Jasur Bekmurodov',
    phone: '+998 97 456 78 90',
    role: 'student',
    telegramUsername: '@jasur_b',
    registeredAt: '2026-03-01',
    status: 'active',
    testsSolved: 22,
    averageScore: 95
  }
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'grp-1',
    name: 'Ziyokor Pre-Intermediate',
    subject: 'Ingliz Tili',
    studentsCount: 28,
    createdAt: '2026-02-01',
    inviteCode: 'ZIYO-PRE-2026',
    teacherName: 'Ustoz Nodirbek Ziyokor',
    description: 'Ingliz tili grammatikasi va so`z boyligi bo`yicha intensiv o`quv guruhi.'
  },
  {
    id: 'grp-2',
    name: '8-Sinf IT Dasturlash',
    subject: 'Informatika',
    studentsCount: 32,
    createdAt: '2026-02-15',
    inviteCode: 'IT-DEV-8A',
    teacherName: 'Ustoz Nodirbek Ziyokor',
    description: 'Python asoslari, algoritmlar va ma`lumotlar tuzilmasi amaliy kursi.'
  },
  {
    id: 'grp-3',
    name: 'Abituriyent-2026 Tarix',
    subject: 'Tarix',
    studentsCount: 45,
    createdAt: '2026-01-20',
    inviteCode: 'TARIX-2026',
    teacherName: 'Ustoz Sardor Rasulov',
    description: 'Davlat test markazi (DTM) standarti bo`yicha O`zbekiston va Jahon tarixi.'
  }
];

export const INITIAL_TESTS: Test[] = [
  {
    id: 'test-1',
    title: 'Life Vision: Unit 4 Grammar & Conditionals',
    description: 'Zero, First, Second Conditionals, qiyosiy sifatlar va zamonlar uyg`unligi bo`yicha chuqurlashtirilgan nazorat.',
    subject: 'Ingliz Tili',
    durationMinutes: 25,
    authorName: 'Ustoz Nodirbek Ziyokor',
    groupId: 'grp-1',
    groupName: 'Ziyokor Pre-Intermediate',
    createdAt: '2026-03-10',
    attemptsAllowed: 3,
    isPublished: true,
    difficulty: "o'rta",
    questions: [
      {
        id: 't1-q1',
        questionText: 'If I _____ more time, I would study diplomacy and international law in detail.',
        options: ['have', 'had', 'will have', 'would have'],
        correctOptionIndex: 1,
        explanation: 'Second Conditional ifodalashda "if" qismida Past Simple (had), asosiy qismida esa "would + V1" ishlatiladi.',
        points: 1
      },
      {
        id: 't1-q2',
        questionText: 'Unless you _____ your homework right now, the teacher will not allow you to participate in the seminar.',
        options: ['do', "don't do", 'will do', 'did'],
        correctOptionIndex: 0,
        explanation: '"Unless" so`zining o`zi inkor ma`nosini bildiradi ("if not"). Shuning uchun ketidan inkor emas, ijobiy fe`l (do) ishlatiladi.',
        points: 1
      },
      {
        id: 't1-q3',
        questionText: 'This laptop is _____ faster than the previous version we tested in the computer lab.',
        options: ['more', 'much', 'very', 'as'],
        correctOptionIndex: 1,
        explanation: 'Qiyosiy darajadagi sifatlar (faster) oldidan darajani kuchaytirish uchun "much", "far", yoki "a lot" qo`llaniladi, "very" esa oddiy daraja bilan keladi.',
        points: 1
      },
      {
        id: 't1-q4',
        questionText: 'If plants do not get sunlight and water, they _____.',
        options: ['die', 'would die', 'died', 'will have died'],
        correctOptionIndex: 0,
        explanation: 'Zero Conditional tabiat qonunlari va doimiy haqiqatlarni bildiradi: If + Present Simple, Present Simple (die).',
        points: 1
      },
      {
        id: 't1-q5',
        questionText: 'Had we known about the schedule change yesterday, we _____ the presentation earlier.',
        options: ['would prepare', 'would have prepared', 'had prepared', 'prepared'],
        correctOptionIndex: 1,
        explanation: 'Third conditional inversiyasi: "Had we known..." = "If we had known...". Asosiy qism "would have + V3" (would have prepared) bo`ladi.',
        points: 1
      }
    ]
  },
  {
    id: 'test-2',
    title: 'Python & Algoritmlar Asoslari',
    description: "Ro'yxatlar (lists), lug'atlar (dicts), rekursiya va vaqt murakkabligi (Big-O) bo'yicha amaliy test.",
    subject: 'Informatika',
    durationMinutes: 30,
    authorName: 'Ustoz Nodirbek Ziyokor',
    groupId: 'grp-2',
    groupName: '8-Sinf IT Dasturlash',
    createdAt: '2026-03-08',
    attemptsAllowed: 2,
    isPublished: true,
    difficulty: 'qiyin',
    questions: [
      {
        id: 't2-q1',
        questionText: 'Python dasturlash tilida `len([1, 2, [3, 4]])` ifodasining natijasi qanday bo`ladi?',
        options: ['4', '3', '2', 'TypeError xatosi'],
        correctOptionIndex: 1,
        explanation: 'Ro`yxat 3 ta elementdan iborat: 1, 2 butun sonlari va [3, 4] ro`yxati (1 ta element sifatida hisoblanadi).',
        points: 1
      },
      {
        id: 't2-q2',
        questionText: 'Lug`atda (dictionary) kalit (key) sifatida quyidagilardan qaysi birini ishlatib bo`lmaydi?',
        options: ['Matn (str)', 'Butun son (int)', "Ro'yxat (list)", 'Kortej (tuple)'],
        correctOptionIndex: 2,
        explanation: 'Python lug`atlarida faqat o`zgarmas (immutable / hashable) turlar kalit bo`la oladi. `list` esa o`zgaruvchan (mutable) bo`lgani sababli kalit bo`la olmaydi.',
        points: 1
      },
      {
        id: 't2-q3',
        questionText: 'Ikkilik qidiruv (Binary Search) algoritmining o`rtacha vaqt murakkabligi qanday?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctOptionIndex: 2,
        explanation: 'Tartiblangan ro`yxatda qidiruv har bir qadamda qidiruv maydonini yarmiga qisqartiradi, bu esa O(log n) logarifmik murakkablikni beradi.',
        points: 1
      },
      {
        id: 't2-q4',
        questionText: 'Quyidagi kod natijasini toping:\nx = [1, 2]\ny = x\ny.append(3)\nprint(x)',
        options: ['[1, 2]', '[1, 2, 3]', '[3]', 'AttributeError'],
        correctOptionIndex: 1,
        explanation: 'Python-da `y = x` havolani (reference) nusxalaydi. Shu sababli `y` ga element qo`shilsa, asl `x` ro`yxati ham o`zgaradi: [1, 2, 3].',
        points: 1
      }
    ]
  },
  {
    id: 'test-3',
    title: 'Jahon Tarixi: Diplomatiya va Xalqaro Munosabatlar',
    description: 'Vestfaliya tinchlik shartnomasidan to hozirgi zamon global institutlarigacha bo`lgan asosiy voqealar.',
    subject: 'Tarix',
    durationMinutes: 20,
    authorName: 'Ustoz Sardor Rasulov',
    groupId: 'grp-3',
    groupName: 'Abituriyent-2026 Tarix',
    createdAt: '2026-03-05',
    attemptsAllowed: 1,
    isPublished: true,
    difficulty: "o'rta",
    questions: [
      {
        id: 't3-q1',
        questionText: '1648-yilda tuzilgan Vestfaliya tinchligi xalqaro huquqqa qaysi muhim tamoyilni kiritdi?',
        options: [
          'Global iqtisodiy erkin savdo',
          'Davlat suvereniteti va ichki ishlarga aralashmaslik tamoyili',
          'Yagona umumiy Yevropa valyutasi',
          'Dengiz yo`llarini xalqarolashtirish'
        ],
        correctOptionIndex: 1,
        explanation: 'Vestfaliya sulhi milliy davlatlarning suverenitetini tan oldi va zamonaviy xalqaro munosabatlar tizimining (Vestfaliya tizimi) poydevori bo`ldi.',
        points: 1
      },
      {
        id: 't3-q2',
        questionText: 'BMT (Birlashgan Millatlar Tashkiloti) qaysi yilda va qayerda rasman ta`sis etilgan?',
        options: ['1919-yil, Jeneva', '1945-yil, San-Fransisko', '1949-yil, Vashington', '1955-yil, Rim'],
        correctOptionIndex: 1,
        explanation: '1945-yil 26-iyunda San-Fransiskoda 50 ta davlat vakillari tomonidan BMT Nizomi imzolandi va 1945-yil 24-oktabrda kuchga kirdi.',
        points: 1
      },
      {
        id: 't3-q3',
        questionText: 'O`zbekiston Respublikasi qachon BMTning to`laqonli a`zosi bo`ldi?',
        options: ['1991-yil 1-sentabr', '1992-yil 2-mart', '1993-yil 8-dekabr', '1995-yil 15-may'],
        correctOptionIndex: 1,
        explanation: '1992-yil 2-mart kuni Nyu-York shahrida BMT Bosh Assambleyasining 46-sessiyasida O`zbekiston Respublikasi bir ovozdan BMT safiga qabul qilindi.',
        points: 1
      }
    ]
  }
];

export const INITIAL_ATTEMPTS: TestAttempt[] = [
  {
    id: 'att-1',
    testId: 'test-1',
    testTitle: 'Life Vision: Unit 4 Grammar & Conditionals',
    subject: 'Ingliz Tili',
    studentId: 'user-1',
    studentName: 'Bilolxon Adilov',
    score: 5,
    maxScore: 5,
    percentage: 100,
    timeSpentSeconds: 420,
    completedAt: '2026-03-12 14:30',
    answers: [
      { questionId: 't1-q1', selectedOption: 1, isCorrect: true },
      { questionId: 't1-q2', selectedOption: 0, isCorrect: true },
      { questionId: 't1-q3', selectedOption: 1, isCorrect: true },
      { questionId: 't1-q4', selectedOption: 0, isCorrect: true },
      { questionId: 't1-q5', selectedOption: 1, isCorrect: true }
    ]
  },
  {
    id: 'att-2',
    testId: 'test-2',
    testTitle: 'Python & Algoritmlar Asoslari',
    subject: 'Informatika',
    studentId: 'user-1',
    studentName: 'Bilolxon Adilov',
    score: 3,
    maxScore: 4,
    percentage: 75,
    timeSpentSeconds: 680,
    completedAt: '2026-03-11 11:15',
    answers: [
      { questionId: 't2-q1', selectedOption: 1, isCorrect: true },
      { questionId: 't2-q2', selectedOption: 2, isCorrect: true },
      { questionId: 't2-q3', selectedOption: 2, isCorrect: true },
      { questionId: 't2-q4', selectedOption: 0, isCorrect: false }
    ]
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-1',
    userName: 'Bilolxon Adilov',
    role: 'student',
    phone: '+998 90 123 45 67',
    action: 'Telegram OTP orqali muvaffaqiyatli kirdi',
    ip: '178.218.201.42 (Toshkent)',
    timestamp: '2026-03-12 14:22',
    status: 'success'
  },
  {
    id: 'log-2',
    userName: 'Ustoz Nodirbek Ziyokor',
    role: 'teacher',
    phone: '+998 91 765 43 21',
    action: 'Word (.docx) orqali yangi test yukladi (20 ta savol)',
    ip: '84.54.120.18 (Samarqand)',
    timestamp: '2026-03-12 13:50',
    status: 'success'
  },
  {
    id: 'log-3',
    userName: 'Jasur Bekmurodov',
    role: 'student',
    phone: '+998 97 456 78 90',
    action: 'Life Vision testini yakunladi (100% natija)',
    ip: '213.230.87.11 (Buxoro)',
    timestamp: '2026-03-12 12:10',
    status: 'success'
  },
  {
    id: 'log-4',
    userName: 'Malika Karimova',
    role: 'student',
    phone: '+998 99 345 67 89',
    action: 'Telegram OTP kodi so`raldi',
    ip: '94.158.52.9 (Farg`ona)',
    timestamp: '2026-03-12 11:05',
    status: 'success'
  }
];
