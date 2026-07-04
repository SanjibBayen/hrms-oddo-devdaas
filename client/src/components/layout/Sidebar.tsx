import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  FileSpreadsheet, 
  Banknote, 
  UserCircle, 
  ShieldCheck, 
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.ts";
import Badge from "../ui/Badge.tsx";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const allLinks = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { id: "employees", label: "Employees", icon: Users, roles: ["ADMIN", "MANAGER"] },
    { id: "attendance", label: "Attendance", icon: CalendarClock, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { id: "leave", label: "Leave Requests", icon: FileSpreadsheet, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { id: "payroll", label: "Payroll Manager", icon: Banknote, roles: ["ADMIN", "EMPLOYEE"] },
    { id: "profile", label: "My Profile", icon: UserCircle, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { id: "admin", label: "System Audit", icon: ShieldCheck, roles: ["ADMIN"] },
  ];

  const visibleLinks = allLinks.filter(link => link.roles.includes(user.role));

  const roleLabels = {
    ADMIN: { label: "HR Admin", variant: "danger" as const },
    MANAGER: { label: "Manager", variant: "warning" as const },
    EMPLOYEE: { label: "Employee", variant: "brand" as const },
  };

  const currentRole = roleLabels[user.role] || { label: "Employee", variant: "neutral" as const };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#0F172A] flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-display font-bold text-slate-900 text-sm tracking-tight">HRMS ENTERPRISE</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-950/20 z-40" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`bg-white text-slate-750 border-r border-slate-200 flex flex-col fixed top-16 lg:top-0 bottom-0 left-0 z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-68"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Banner (Desktop only) */}
        <div className="hidden lg:flex h-20 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#0F172A] flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            {!isCollapsed && (
              <span className="font-display font-bold text-[#0F172A] text-sm tracking-tight">
                HRMS ENTERPRISE
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Active User Profile Card */}
        <div className={`p-4.5 border-b border-slate-100 ${isCollapsed ? "flex justify-center" : ""}`}>
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-2xs"
              referrerPolicy="no-referrer"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 font-display truncate leading-tight">{user.name}</h4>
                <p className="text-[9px] text-slate-450 truncate mb-1">{user.email}</p>
                <Badge variant={currentRole.variant} className="text-[8px] px-1.5 py-0">
                  {currentRole.label}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {visibleLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold font-display rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-[#F1F5F9] text-[#0F172A]"
                    : "hover:bg-slate-50/80 hover:text-[#0F172A] text-[#64748B]"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={link.label}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#0F172A]" : "text-[#64748B]"}`} />
                {!isCollapsed && <span>{link.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Control */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold font-display rounded-lg text-rose-600 hover:bg-rose-50/60 hover:text-rose-700 transition-all duration-150 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title="Log Out"
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
