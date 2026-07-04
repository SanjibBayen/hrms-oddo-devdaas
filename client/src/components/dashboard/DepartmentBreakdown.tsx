import React from "react";

export const DepartmentBreakdown: React.FC = () => {
  const departments = [
    { name: "Engineering", count: 12, pct: "48%", color: "bg-indigo-500" },
    { name: "HR", count: 3, pct: "12%", color: "bg-emerald-500" },
    { name: "Sales", count: 5, pct: "20%", color: "bg-amber-500" },
    { name: "Marketing", count: 3, pct: "12%", color: "bg-rose-500" },
    { name: "Finance", count: 2, pct: "8%", color: "bg-sky-500" },
  ];

  return (
    <div className="space-y-3.5 font-sans">
      {departments.map((dept) => (
        <div key={dept.name} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">{dept.name}</span>
            <span className="text-slate-500">{dept.count} ({dept.pct})</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${dept.color}`} style={{ width: dept.pct }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentBreakdown;
