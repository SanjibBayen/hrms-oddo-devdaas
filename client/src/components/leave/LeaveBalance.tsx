import React from "react";
import { Card, CardContent } from "../ui/Card.tsx";
import { Activity, Calendar, HeartPulse, UserCheck } from "lucide-react";

interface LeaveBalanceProps {
  sickTaken: number;
  casualTaken: number;
  annualRemaining: number;
}

export const LeaveBalance: React.FC<LeaveBalanceProps> = ({
  sickTaken,
  casualTaken,
  annualRemaining,
}) => {
  const annualTotal = 18;
  const sickTotal = 10;
  const casualTotal = 12;

  const cards = [
    {
      title: "Annual Leave",
      subtitle: "Vacation / personal time off",
      value: `${annualRemaining} / ${annualTotal} days`,
      percent: Math.min(100, Math.max(0, (annualRemaining / annualTotal) * 100)),
      color: "bg-[#0F172A]",
      textColor: "text-slate-800",
      icon: Calendar,
    },
    {
      title: "Sick Leave",
      subtitle: "Medical and healthcare absences",
      value: `${sickTaken} days taken`,
      percent: Math.min(100, Math.max(0, (sickTaken / sickTotal) * 100)),
      color: "bg-rose-500",
      textColor: "text-rose-800",
      icon: HeartPulse,
    },
    {
      title: "Casual Leave",
      subtitle: "Unplanned short-term absences",
      value: `${casualTaken} days taken`,
      percent: Math.min(100, Math.max(0, (casualTaken / casualTotal) * 100)),
      color: "bg-amber-500",
      textColor: "text-amber-800",
      icon: UserCheck,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <Card key={idx} className="border border-slate-100 bg-white hover:shadow-sm transition-shadow">
            <CardContent className="p-5 font-sans space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-display leading-tight">{c.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{c.subtitle}</p>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Balance</span>
                  <span className="text-slate-800 font-mono font-bold">{c.value}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${c.percent}%` }} 
                    className={`h-full ${c.color} rounded-full transition-all duration-500`} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LeaveBalance;
