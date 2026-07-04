import React from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { Bell, HelpCircle } from "lucide-react";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="hidden lg:flex h-20 items-center justify-between px-8 bg-white border-b border-slate-200">
      <div>
        <h1 className="text-base font-bold text-slate-900 font-display tracking-tight uppercase">{title}</h1>
        <p className="text-[10px] text-slate-400 font-sans tracking-wider">Enterprise Management Environment</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
          <HelpCircle className="w-4 h-4" />
        </button>
        {user && (
          <div className="flex items-center gap-2.5 pl-4 border-l border-slate-100">
            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
            <div className="text-left font-sans">
              <span className="block text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
              <span className="block text-[9px] text-slate-450 uppercase font-semibold">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
