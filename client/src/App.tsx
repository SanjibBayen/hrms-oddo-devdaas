import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext.tsx";
import { useAuth } from "./hooks/useAuth.ts";
import { HRMSProvider } from "./context/HRMSContext.tsx";
import Sidebar from "./components/layout/Sidebar.tsx";

// New directory-exact pages
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignupPage from "./pages/auth/SignupPage.tsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.tsx";

import DashboardPage from "./pages/dashboard/DashboardPage.tsx";

import EmployeeListPage from "./pages/employees/EmployeeListPage.tsx";
import EmployeeDetailPage from "./pages/employees/EmployeeDetailPage.tsx";

import AttendancePage from "./pages/attendance/AttendancePage.tsx";

import LeaveApprovalsPage from "./pages/leave/LeaveApprovalsPage.tsx";
import MyLeavesPage from "./pages/leave/MyLeavesPage.tsx";

import PayrollManagementPage from "./pages/payroll/PayrollManagementPage.tsx";
import MyPayrollPage from "./pages/payroll/MyPayrollPage.tsx";

import ProfilePage from "./pages/profile/ProfilePage.tsx";

import AuditLogPage from "./pages/audit/AuditLogPage.tsx";

// Error Pages
import ForbiddenPage from "./pages/errors/ForbiddenPage.tsx";
import NotFoundPage from "./pages/errors/NotFoundPage.tsx";
import ServerErrorPage from "./pages/errors/ServerErrorPage.tsx";

import { Clock } from "lucide-react";

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  
  // Auth navigation state
  const [authView, setAuthView] = useState<"login" | "signup" | "forgot">("login");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 gap-3">
        <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-xl animate-pulse">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold font-display text-slate-500 uppercase tracking-widest mt-1">
          <svg className="animate-spin h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Synchronizing HR Registry...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (authView) {
      case "signup":
        return <SignupPage onNavigateToLogin={() => setAuthView("login")} />;
      case "forgot":
        return <ForgotPasswordPage onNavigateToLogin={() => setAuthView("login")} />;
      case "login":
      default:
        return (
          <LoginPage 
            onNavigateToSignup={() => setAuthView("signup")} 
            onNavigateToForgotPassword={() => setAuthView("forgot")} 
          />
        );
    }
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "employees":
        if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
          return <ForbiddenPage onBackToDashboard={() => setActiveTab("dashboard")} />;
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
      case "attendance":
        return <AttendancePage />;
      case "leave":
        return user?.role === "ADMIN" || user?.role === "MANAGER" ? (
          <LeaveApprovalsPage />
        ) : (
          <MyLeavesPage />
        );
      case "payroll":
        return user?.role === "ADMIN" ? (
          <PayrollManagementPage />
        ) : (
          <MyPayrollPage />
        );
      case "profile":
        return <ProfilePage />;
      case "admin":
        if (user?.role !== "ADMIN") {
          return <ForbiddenPage onBackToDashboard={() => setActiveTab("dashboard")} />;
        }
        return <AuditLogPage />;
      default:
        return <NotFoundPage onBackToDashboard={() => setActiveTab("dashboard")} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col lg:flex-row">
      {/* Sidebar Panel */}
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedEmployeeId(null); // Reset detail view when changing tabs
      }} />

      {/* Main Panel Content Area */}
      <main className="flex-1 p-6 lg:p-8 pt-22 lg:pt-8 min-w-0 transition-all duration-300 ml-0 lg:ml-68">
        {renderActiveScreen()}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HRMSProvider>
        <MainAppContent />
      </HRMSProvider>
    </AuthProvider>
  );
}
