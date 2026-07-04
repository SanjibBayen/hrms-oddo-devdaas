import React, { useState } from "react";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

interface PayrollFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const PayrollForm: React.FC<PayrollFormProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("July 2026");
  const [bonus, setBonus] = useState("");
  const [deductions, setDeductions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      employeeId,
      month,
      bonus: parseFloat(bonus) || 0,
      deductions: parseFloat(deductions) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1">Employee ID</label>
        <Input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required placeholder="e.g. EMP001" />
      </div>
      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1">Pay Period</label>
        <Input value={month} onChange={(e) => setMonth(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1">Bonus ($)</label>
          <Input type="number" value={bonus} onChange={(e) => setBonus(e.target.value)} />
        </div>
        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1">Deductions ($)</label>
          <Input type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#0F172A] hover:bg-slate-800 text-white" disabled={isSubmitting}>
          Generate Payroll Slip
        </Button>
      </div>
    </form>
  );
};

export default PayrollForm;
