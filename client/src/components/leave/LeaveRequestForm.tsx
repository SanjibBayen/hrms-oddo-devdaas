import React, { useState } from "react";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";
import { Calendar, Info } from "lucide-react";

interface LeaveRequestFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
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
      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
        <p className="text-[10px] text-slate-500 leading-normal">
          All leave requests undergo automatic notification to department heads and administrative managers for audit compliance.
        </p>
      </div>

      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1.5">Leave Classification</label>
        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-800 focus:outline-hidden font-display font-bold cursor-pointer"
        >
          <option value="SICK">Sick Leave</option>
          <option value="CASUAL">Casual Leave</option>
          <option value="ANNUAL">Annual Leave</option>
          <option value="MATERNITY">Maternity Leave</option>
          <option value="UNPAID">Unpaid Leave</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1.5">Start Date</label>
          <div className="relative">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1.5">End Date</label>
          <div className="relative">
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
        </div>
      </div>

      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1.5">Reason / Description</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please specify detailed medical or personal reasons..."
          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs text-slate-800 focus:outline-hidden font-sans"
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#0F172A] hover:bg-slate-850 text-white font-semibold" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Apply Leave"}
        </Button>
      </div>
    </form>
  );
};

export default LeaveRequestForm;
