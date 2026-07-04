import React from "react";
import { LeaveRequest } from "../../types/index.ts";
import { LeaveStatusBadge } from "./LeaveStatusBadge.tsx";
import { Card, CardContent } from "../ui/Card.tsx";
import { Calendar, User, FileText, Check, X } from "lucide-react";

interface LeaveCardProps {
  leave: LeaveRequest;
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewDetails?: (leave: LeaveRequest) => void;
}

export const LeaveCard: React.FC<LeaveCardProps> = ({
  leave,
  isAdmin = false,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-slate-100">
      <CardContent className="p-5 font-sans space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              {leave.leaveType} Leave
            </span>
            <h4 className="text-xs font-bold text-slate-900 font-display flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {leave.userName || "Associate"}
            </h4>
          </div>
          <LeaveStatusBadge status={leave.status} />
        </div>

        <div className="text-xs bg-slate-50/50 border border-slate-100 p-3 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-slate-650 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {leave.startDate} to {leave.endDate}
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-slate-500">
            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <p className="line-clamp-2 leading-relaxed italic">
              "{leave.reason}"
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-1">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(leave)}
              className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-100 text-slate-650 hover:bg-slate-100 text-[11px] font-semibold font-display rounded-lg transition-colors cursor-pointer"
            >
              Details
            </button>
          )}

          {isAdmin && leave.status === "PENDING" && (
            <>
              <button
                onClick={() => onApprove?.(leave.id)}
                className="py-1.5 px-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Approve request"
              >
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => onReject?.(leave.id)}
                className="py-1.5 px-2.5 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Reject request"
              >
                <X className="w-3.5 h-3.5" /> Reject
              </button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveCard;
