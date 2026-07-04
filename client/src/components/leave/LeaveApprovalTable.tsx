import React from "react";
import { LeaveRequest } from "../../types/index.ts";
import { LeaveStatusBadge } from "./LeaveStatusBadge.tsx";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table.tsx";
import { Badge } from "../ui/Badge.tsx";
import { Check, X, Eye, ShieldCheck, User } from "lucide-react";

interface LeaveApprovalTableProps {
  leaves: LeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails?: (leave: LeaveRequest) => void;
}

export const LeaveApprovalTable: React.FC<LeaveApprovalTableProps> = ({
  leaves,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  const pendingRequests = leaves.filter((l) => l.status === "PENDING");
  const processedRequests = leaves.filter((l) => l.status !== "PENDING");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider mb-3">
          Awaiting Review ({pendingRequests.length})
        </h3>
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Associate Name</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Target Schedule</TableHead>
                <TableHead>Reasoning Statement</TableHead>
                <TableHead className="text-right">Action Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-8 font-sans text-xs">
                    No pending leave applications require review at this time.
                  </TableCell>
                </TableRow>
              ) : (
                pendingRequests.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-semibold text-slate-900 font-sans flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold font-display text-[11px]">
                        {l.userName?.substring(0, 2).toUpperCase() || "ST"}
                      </div>
                      <div>
                        <span className="block font-bold">{l.userName || l.employeeName}</span>
                        <span className="block text-[9px] text-slate-400">{l.department || "Enterprise"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={l.leaveType === "SICK" ? "danger" : l.leaveType === "ANNUAL" ? "success" : "default"} className="text-[10px]">
                        {l.leaveType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs font-mono">
                      {l.startDate} to {l.endDate}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs font-normal max-w-xs truncate" title={l.reason}>
                      {l.reason}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onViewDetails && (
                          <button
                            onClick={() => onViewDetails(l)}
                            className="p-1 bg-slate-50 border border-slate-100 text-slate-500 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onApprove(l.id)}
                          className="p-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Certify Approval"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onReject(l.id)}
                          className="p-1 bg-rose-50 border border-rose-100 text-rose-600 rounded hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Reject Leave"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider mb-3">
          Decision Archive ({processedRequests.length})
        </h3>
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Associate Name</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Target Schedule</TableHead>
                <TableHead>Decision State</TableHead>
                <TableHead>Audited Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-400 py-8 font-sans text-xs">
                    No decision logs compiled yet.
                  </TableCell>
                </TableRow>
              ) : (
                processedRequests.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-semibold text-slate-900 font-sans">
                      <span className="block font-bold">{l.userName || l.employeeName}</span>
                      <span className="block text-[9px] text-slate-400">{l.department || "Enterprise"}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={l.leaveType === "SICK" ? "danger" : l.leaveType === "ANNUAL" ? "success" : "default"} className="text-[10px]">
                        {l.leaveType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs font-mono">
                      {l.startDate} to {l.endDate}
                    </TableCell>
                    <TableCell>
                      <LeaveStatusBadge status={l.status} />
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs flex items-center gap-1.5 font-normal">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Processed digitally</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalTable;
