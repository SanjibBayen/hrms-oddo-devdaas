import React from "react";
import { Card, CardContent } from "../ui/Card.tsx";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface AttendanceStatsProps {
  presentDays: number;
  lateDays: number;
  totalHours: number;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ presentDays, lateDays, totalHours }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Days Present</p>
            <h3 className="text-xl font-bold text-[#0F172A] font-display">{presentDays}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Days Late</p>
            <h3 className="text-xl font-bold text-[#0F172A] font-display">{lateDays}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Work Hours</p>
            <h3 className="text-xl font-bold text-[#0F172A] font-display">{totalHours.toFixed(1)}h</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;
