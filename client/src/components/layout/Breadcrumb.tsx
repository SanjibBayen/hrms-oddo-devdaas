import React from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  items: string[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans mb-4">
      <Home className="w-3.5 h-3.5 text-slate-350" />
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className={idx === items.length - 1 ? "text-slate-750" : ""}>{item}</span>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
