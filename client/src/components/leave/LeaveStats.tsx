import React from "react";
import { Card, CardContent } from "../ui/Card.tsx";
import { Smile, Umbrella, Activity } from "lucide-react";

interface LeaveStatsProps {
  sickTaken: number;
  casualTaken: number;
  annualRemaining: number;
}

export const LeaveStats: React.FC<LeaveStatsProps> = ({ sickTaken, casualTaken, annualRemaining }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sick Leaves Taken</p>
            <h3 className="text-xl font-bold text-slate-900 font-display">{sickTaken} days</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Casual Leaves Taken</p>
            <h3 className="text-xl font-bold text-slate-900 font-display">{casualTaken} days</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Umbrella className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Balance</p>
            <h3 className="text-xl font-bold text-slate-900 font-display">{annualRemaining} days</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveStats;
