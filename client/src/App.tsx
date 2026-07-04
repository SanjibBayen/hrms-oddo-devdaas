import React, { useState } from 'react';
import { useAuthStore } from './stores/authStore';
import Sidebar from './components/layout/Sidebar';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import DashboardPage from './pages/dashboard/DashboardPage';

import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';

import AttendancePage from './pages/attendance/AttendancePage';

import LeaveApprovalsPage from './pages/leave/LeaveApprovalsPage';
import MyLeavesPage from './pages/leave/MyLeavesPage';

import PayrollManagementPage from './pages/payroll/PayrollManagementPage';
import MyPayrollPage from './pages/payroll/MyPayrollPage';

import ProfilePage from './pages/profile/ProfilePage';

import AuditLogPage from './pages/audit/AuditLogPage';

import ForbiddenPage from './pages/errors/ForbiddenPage';
import NotFoundPage from './pages/errors/NotFoundPage';
import ServerErrorPage from './pages/errors/ServerErrorPage';

type AuthView = 'login' | 'signup' | 'forgot';

const App: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');

  // Loading state
  if (!isAuthenticated) {
    switch (authView) {
      case 'signup':
        return <SignupPage onNavigateToLogin={() => setAuthView('login')} />;
      case 'forgot':
        return <ForgotPasswordPage onNavigateToLogin={() => setAuthView('login')} />;
      case 'login':
      default:
        return (
          <LoginPage
            onNavigateToSignup={() => setAuthView('signup')}
            onNavigateToForgotPassword={() => setAuthView('forgot')}
          />
        );
    }
  }

  // Get user role in lowercase for comparison
  const role = user?.role?.toLowerCase();

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;

      case 'employees':
        if (role !== 'admin' && role !== 'super_admin') {
          return <ForbiddenPage onBackToDashboard={() => setActiveTab('dashboard')} />;
        }
        if (selectedEmployeeId) {
          return (
            <EmployeeDetailPage
              employeeId={selectedEmployeeId}
              onBack={() => setSelectedEmployeeId(null)}
            />
          );
        }
        return (
          <EmployeeListPage
            onViewEmployeeDetails={(emp) => setSelectedEmployeeId(emp.id)}
          />
        );

      case 'attendance':
        return <AttendancePage />;

      case 'leave':
        return role === 'admin' || role === 'super_admin' ? (
          <LeaveApprovalsPage />
        ) : (
          <MyLeavesPage />
        );

      case 'payroll':
        return role === 'admin' || role === 'super_admin' ? (
          <PayrollManagementPage />
        ) : (
          <MyPayrollPage />
        );

      case 'profile':
        return <ProfilePage />;

      case 'audit':
        if (role !== 'admin' && role !== 'super_admin') {
          return <ForbiddenPage onBackToDashboard={() => setActiveTab('dashboard')} />;
        }
        return <AuditLogPage />;

      default:
        return <NotFoundPage onBackToDashboard={() => setActiveTab('dashboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab: string) => {
          setActiveTab(tab);
          setSelectedEmployeeId(null);
        }}
        userRole={role || 'employee'}
      />
      <main className="flex-1 p-6 ml-64 min-h-screen">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;