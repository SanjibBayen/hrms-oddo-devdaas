import React from "react";
import { ActivityLog } from "../../types/index.ts";
import { User, Key, Check, DollarSign, Calendar } from "lucide-react";

interface RecentActivityProps {
  logs: ActivityLog[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ logs }) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "AUTH": return <Key className="w-3.5 h-3.5 text-indigo-500" />;
      case "ATTENDANCE": return <Check className="w-3.5 h-3.5 text-emerald-500" />;
      case "LEAVE": return <Calendar className="w-3.5 h-3.5 text-amber-500" />;
      case "PAYROLL": return <DollarSign className="w-3.5 h-3.5 text-rose-500" />;
      default: return <User className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="flow-root font-sans">
      <ul className="-mb-8">
        {logs.length === 0 ? (
          <li className="text-center text-xs text-slate-400 py-4">No recent activity</li>
        ) : (
          logs.slice(0, 5).map((log, idx) => (
            <li key={log.id}>
              <div className="relative pb-5">
                {idx !== logs.slice(0, 5).length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3 items-start">
                  <div>
                    <span className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {getCategoryIcon(log.category)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1.5">
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">{log.userName}</span> {log.action}
                    </p>
                    <span className="text-[9px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecentActivity;
