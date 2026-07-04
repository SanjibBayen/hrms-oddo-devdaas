import React from "react";
import { Payroll } from "../../types/index.ts";

interface PayrollDetailsProps {
  payroll: Payroll | null;
  onClose: () => void;
}

export const PayrollDetails: React.FC<PayrollDetailsProps> = ({ payroll, onClose }) => {
  if (!payroll) return null;

  return (
    <div className="p-5 font-sans space-y-4">
      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-display">Pay Slip Details</h3>
          <p className="text-[10px] text-slate-450">{payroll.month}</p>
        </div>
        <button onClick={onClose} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
          Close
        </button>
      </div>

      <div className="text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-500">Employee Name:</span>
          <span className="font-semibold text-slate-850">{payroll.userName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Base Salary:</span>
          <span className="font-mono font-semibold text-slate-850">${payroll.basicSalary.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Allowances:</span>
          <span className="font-mono font-semibold text-emerald-600">+${payroll.allowances.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Deductions:</span>
          <span className="font-mono font-semibold text-rose-600">-${payroll.deductions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-2 text-sm">
          <span className="font-bold text-slate-800">Net Pay:</span>
          <span className="font-mono font-bold text-slate-900">${payroll.netSalary.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetails;
