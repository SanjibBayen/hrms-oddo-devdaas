import React from "react";
import { Input } from "../ui/Input.tsx";

interface LeaveFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (st: string) => void;
  leaveType: string;
  setLeaveType: (type: string) => void;
}

export const LeaveFilters: React.FC<LeaveFiltersProps> = ({
  search,
  setSearch,
  status,
  setStatus,
  leaveType,
  setLeaveType,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Search associate name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold font-display text-slate-800 focus:outline-hidden cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold font-display text-slate-800 focus:outline-hidden cursor-pointer"
        >
          <option value="ALL">All Classifications</option>
          <option value="SICK">Sick Leave</option>
          <option value="CASUAL">Casual Leave</option>
          <option value="ANNUAL">Annual Leave</option>
          <option value="MATERNITY">Maternity Leave</option>
          <option value="UNPAID">Unpaid Leave</option>
        </select>
      </div>
    </div>
  );
};

export default LeaveFilters;
