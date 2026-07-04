import React from "react";
import { LeaveRequest } from "../../types/index.ts";
import { LeaveStatusBadge } from "./LeaveStatusBadge.tsx";
import { Badge } from "../ui/Badge.tsx";
import { Calendar, User, Briefcase, FileText, CheckCircle2, ShieldCheck, X } from "lucide-react";

interface LeaveDetailsProps {
  leave: LeaveRequest | null;
  onClose: () => void;
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const LeaveDetails: React.FC<LeaveDetailsProps> = ({
  leave,
  onClose,
  isAdmin = false,
  onApprove,
  onReject,
}) => {
  if (!leave) return null;

  // Calculate duration
  const start = new Date(leave.startDate);
  const end = new Date(leave.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="p-5 font-sans space-y-5 text-xs text-slate-800">
      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-bold text-slate-900 font-display uppercase tracking-wider">Leave Dossier File</h3>
          <p className="text-[10px] text-slate-400">Request code: {leave.id.substring(0, 8).toUpperCase()}</p>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-800 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Profile Card Summary */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold font-display text-sm">
            {leave.userName?.substring(0, 2).toUpperCase() || "ST"}
          </div>
          <div>
            <span className="block font-bold text-slate-900 font-display text-xs">{leave.userName || leave.employeeName}</span>
            <span className="block text-[10px] text-slate-400">{leave.department} Department</span>
          </div>
        </div>

        {/* Info list */}
        <div className="space-y-3.5">
          <div className="space-y-1">
            <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Classification</span>
            <div className="flex items-center gap-2">
              <Badge variant={leave.leaveType === "SICK" ? "danger" : leave.leaveType === "ANNUAL" ? "success" : "default"} className="text-[10px] font-bold">
                {leave.leaveType}
              </Badge>
              <span className="text-slate-500 font-medium">({diffDays} {diffDays === 1 ? "day" : "days"})</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Target Time Range</span>
            <span className="flex items-center gap-2 text-slate-700 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {leave.startDate} to {leave.endDate}
            </span>
          </div>

          <div className="space-y-1">
            <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Reasoning Statement</span>
            <span className="flex items-start gap-2 text-slate-650 italic leading-relaxed bg-slate-50/50 p-2.5 rounded-xl border border-dashed border-slate-150">
              <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              "{leave.reason}"
            </span>
          </div>

          <div className="space-y-1">
            <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Audited State</span>
            <div className="flex items-center gap-2">
              <LeaveStatusBadge status={leave.status} />
              {leave.status === "APPROVED" && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> approved by system audit
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Administration Decision Pad */}
        {isAdmin && leave.status === "PENDING" && (
          <div className="border-t border-slate-100 pt-4 flex gap-2">
            <button
              onClick={() => {
                onApprove?.(leave.id);
                onClose();
              }}
              className="flex-1 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              Approve Request
            </button>
            <button
              onClick={() => {
                onReject?.(leave.id);
                onClose();
              }}
              className="flex-1 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              Reject Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveDetails;
