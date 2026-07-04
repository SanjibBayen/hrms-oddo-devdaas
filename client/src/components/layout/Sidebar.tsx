import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  FileText,
  Banknote,
  UserCircle,
  ShieldCheck,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole }) => {
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const allLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'admin', 'super_admin'] },
    { id: 'employees', label: 'Employees', icon: Users, roles: ['admin', 'super_admin'] },
    { id: 'attendance', label: 'Attendance', icon: CalendarClock, roles: ['employee', 'admin', 'super_admin'] },
    { id: 'leave', label: 'Leave', icon: FileText, roles: ['employee', 'admin', 'super_admin'] },
    { id: 'payroll', label: 'Payroll', icon: Banknote, roles: ['employee', 'admin', 'super_admin'] },
    { id: 'profile', label: 'Profile', icon: UserCircle, roles: ['employee', 'admin', 'super_admin'] },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck, roles: ['admin', 'super_admin'] },
  ];

  const visibleLinks = allLinks.filter((link) => link.roles.includes(userRole));

  const roleBadge: Record<string, { label: string; color: string }> = {
    admin: { label: 'Admin', color: 'bg-red-100 text-red-700' },
    super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
    employee: { label: 'Employee', color: 'bg-blue-100 text-blue-700' },
  };

  const currentRole = roleBadge[userRole] || { label: 'User', color: 'bg-gray-100 text-gray-700' };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40">
        <span className="font-bold text-gray-900 text-sm">HRMS</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col fixed top-14 lg:top-0 bottom-0 left-0 z-40 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-60'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="hidden lg:flex h-14 items-center justify-between px-4 border-b border-gray-100">
          {!isCollapsed && <span className="font-bold text-gray-900 text-sm">HRMS Enterprise</span>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Info */}
        <div className={`p-3 border-b border-gray-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-2.5 bg-gray-50 p-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
              {user.name?.charAt(0) || 'U'}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                <span className={`inline-block text-[9px] px-1.5 py-0 rounded-full mt-1 ${currentRole.color}`}>
                  {currentRole.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={link.label}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
                {!isCollapsed && <span>{link.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;