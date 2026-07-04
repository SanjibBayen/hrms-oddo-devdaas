import React from "react";
import { Card, CardContent } from "../ui/Card.tsx";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend }) => {
  return (
    <Card hoverable>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-xl font-bold text-slate-900 font-display leading-none">{value}</h3>
          {(description || trend) && (
            <p className="text-[10px] text-slate-450 mt-1 font-sans">
              {trend && <span className="text-emerald-600 font-semibold mr-1">{trend}</span>}
              {description}
            </p>
          )}
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
