import React, { useState } from "react";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

interface LeaveFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [leaveType, setLeaveType] = useState("SICK");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      leaveType,
      startDate,
      endDate,
      reason,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1">Leave Type</label>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl bg-white text-xs text-[#0F172A] focus:outline-hidden font-display font-semibold"
        >
          <option value="SICK">Sick Leave</option>
          <option value="CASUAL">Casual Leave</option>
          <option value="ANNUAL">Annual Leave</option>
          <option value="MATERNITY">Maternity Leave</option>
          <option value="PATERNITY">Paternity Leave</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1">Start Date</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1">End Date</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1">Reason / Description</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please specify the reason for this leave request..."
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl bg-white text-xs text-[#0F172A] focus:outline-hidden font-sans"
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#0F172A] hover:bg-slate-800 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Apply Leave"}
        </Button>
      </div>
    </form>
  );
};

export default LeaveForm;
