import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table.tsx";
import { Badge } from "../ui/Badge.tsx";
import { LeaveRequest } from "../../types/index.ts";
import { Check, X } from "lucide-react";

interface LeaveTableProps {
  leaves: LeaveRequest[];
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export const LeaveTable: React.FC<LeaveTableProps> = ({ leaves, isAdmin = false, onApprove, onReject }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Staff</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          {isAdmin && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaves.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isAdmin ? 6 : 5} className="text-center text-slate-400 py-8 font-sans">
              No leave applications recorded.
            </TableCell>
          </TableRow>
        ) : (
          leaves.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="font-semibold text-slate-900 font-sans">{l.employeeName}</TableCell>
              <TableCell>
                <Badge variant={l.leaveType === "SICK" ? "danger" : l.leaveType === "ANNUAL" ? "success" : "default"}>
                  {l.leaveType}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600 text-xs">
                {l.startDate} to {l.endDate}
              </TableCell>
              <TableCell className="text-slate-600 text-xs font-normal max-w-xs truncate" title={l.reason}>
                {l.reason}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    l.status === "APPROVED"
                      ? "success"
                      : l.status === "REJECTED"
                      ? "danger"
                      : "warning"
                  }
                >
                  {l.status}
                </Badge>
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  {l.status === "PENDING" && (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onApprove?.(l.id)}
                        className="p-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded hover:bg-emerald-100 transition-colors cursor-pointer"
                        title="Approve"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onReject?.(l.id)}
                        className="p-1 bg-rose-50 border border-rose-100 text-rose-650 rounded hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default LeaveTable;
