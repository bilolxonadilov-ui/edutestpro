import React, { useState, useEffect } from 'react';
import { User, UserRole, Test, Group, TestAttempt, SystemLog } from './types';
import { 
  INITIAL_USERS, 
  INITIAL_TESTS, 
  INITIAL_GROUPS, 
  INITIAL_ATTEMPTS, 
  INITIAL_LOGS 
} from './data/mockData';
import { CanvasBackground } from './components/CanvasBackground';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { StudentView } from './components/student/StudentView';
import { TeacherView } from './components/teacher/TeacherView';
import { AdminView } from './components/admin/AdminView';
import { toggleSound, isSoundEnabled } from './utils/audio';

export default function App() {
  // Local storage assisted state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edutest_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (currentUser?.role as UserRole) || 'student';
  });

  const [tests, setTests] = useState<Test[]>(() => {
    const saved = localStorage.getItem('edutest_tests');
    return saved ? JSON.parse(saved) : INITIAL_TESTS;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('edutest_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [attempts, setAttempts] = useState<TestAttempt[]>(() => {
    const saved = localStorage.getItem('edutest_attempts');
    return saved ? JSON.parse(saved) : INITIAL_ATTEMPTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('edutest_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem('edutest_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edutest_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('edutest_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('edutest_tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('edutest_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('edutest_attempts', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem('edutest_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('edutest_logs', JSON.stringify(logs));
  }, [logs]);

  // Role switch handler
  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
  };

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundActive(newState);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveRole(user.role);

    // Add log
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      userName: user.name,
      role: user.role,
      phone: user.phone,
      action: 'Telegram OTP orqali tizimga kirdi',
      ip: '178.218.201.42 (Toshkent)',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'success'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  // Student completes attempt
  const handleSaveAttempt = (attempt: TestAttempt) => {
    setAttempts(prev => [attempt, ...prev]);

    // Update user stats
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        testsSolved: (currentUser.testsSolved || 0) + 1,
        averageScore: Math.round(((currentUser.averageScore || 85) + attempt.percentage) / 2)
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }

    // Add activity log
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      userName: attempt.studentName,
      role: 'student',
      phone: currentUser?.phone || '+998 90 123 45 67',
      action: `"${attempt.testTitle}" testini yakunladi (${attempt.percentage}%)`,
      ip: '178.218.201.42 (Toshkent)',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'success'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Teacher adds new test
  const handleAddTest = (newTest: Test) => {
    setTests(prev => [newTest, ...prev]);

    // Add log
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      userName: currentUser?.name || "O'qituvchi",
      role: 'teacher',
      phone: currentUser?.phone || '+998 91 765 43 21',
      action: `Word (.docx) orqali yangi "${newTest.title}" testini yukladi (${newTest.questions.length} ta savol)`,
      ip: '84.54.120.18 (Samarqand)',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'success'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteTest = (testId: string) => {
    setTests(prev => prev.filter(t => t.id !== testId));
  };

  const handleAddGroup = (newGroup: Group) => {
    setGroups(prev => [newGroup, ...prev]);
  };

  // Admin updates
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
      setActiveRole(newRole);
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const effectiveUser = currentUser || {
    id: 'guest',
    name: 'Bilolxon Adilov',
    phone: '+998 90 123 45 67',
    role: activeRole,
    registeredAt: '2026-03-01',
    status: 'active' as const
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[#090d16] text-slate-100 selection:bg-blue-600/30 selection:text-blue-200">
      {/* Dynamic Animated Particles Background */}
      <CanvasBackground />

      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeRole={activeRole}
        onSelectRole={handleSelectRole}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        soundActive={soundActive}
        onToggleSound={handleToggleSound}
      />

      {/* Main Role Content View */}
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col justify-center relative z-10">
        {activeRole === 'student' && (
          <StudentView
            currentUser={effectiveUser}
            tests={tests}
            attempts={attempts}
            onSaveAttempt={handleSaveAttempt}
          />
        )}

        {activeRole === 'teacher' && (
          <TeacherView
            currentUser={effectiveUser}
            tests={tests}
            groups={groups}
            attempts={attempts}
            onAddTest={handleAddTest}
            onDeleteTest={handleDeleteTest}
            onAddGroup={handleAddGroup}
          />
        )}

        {activeRole === 'admin' && (
          <AdminView
            currentUser={effectiveUser}
            users={users}
            logs={logs}
            onUpdateUserRole={handleUpdateUserRole}
            onToggleUserStatus={handleToggleUserStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-nav py-4 px-4 text-center text-xs text-slate-500 relative z-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between container mx-auto">
        <p>&copy; 2026 EduTest PRO Platformasi. Barcha huquqlar saqlangan.</p>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-[11px] text-slate-400">
          <span>Telegram Bot: @EduTestPro_bot</span>
          <span>·</span>
          <span>500 Slot Server: Onlayn</span>
          <span>·</span>
          <span>Vaqt: 2026-10-05</span>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
