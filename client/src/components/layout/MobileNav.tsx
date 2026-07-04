import React from "react";
import { Menu } from "lucide-react";

interface MobileNavProps {
  onToggle: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};

export default MobileNav;
