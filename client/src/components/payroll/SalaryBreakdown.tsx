import React from "react";
import { Payroll } from "../../types/index.ts";
import { DollarSign, ShieldAlert, TrendingUp, TrendingDown } from "lucide-react";

interface SalaryBreakdownProps {
  payroll: Payroll;
}

export const SalaryBreakdown: React.FC<SalaryBreakdownProps> = ({ payroll }) => {
  const totalEarnings = (payroll.basicSalary || 0) + (payroll.allowances || 0);
  const deductionsVal = payroll.deductions || 0;
  
  const basicPercent = totalEarnings > 0 ? (((payroll.basicSalary || 0) / totalEarnings) * 100) : 0;
  const allowancePercent = totalEarnings > 0 ? (((payroll.allowances || 0) / totalEarnings) * 100) : 0;
  const deductionPercent = totalEarnings > 0 ? ((deductionsVal / totalEarnings) * 100) : 0;

  return (
    <div className="space-y-4 font-sans text-xs">
      <div>
        <h4 className="text-xs font-bold text-slate-800 font-display mb-1">Earnings & Deductions Ratio</h4>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${Math.max(0, basicPercent - deductionPercent)}%` }} 
            className="bg-slate-900" 
            title="Basic Salary"
          />
          <div 
            style={{ width: `${allowancePercent}%` }} 
            className="bg-emerald-500" 
            title="Allowances"
          />
          <div 
            style={{ width: `${deductionPercent}%` }} 
            className="bg-rose-500" 
            title="Deductions"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        {/* Basic Salary Row */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
            <div>
              <span className="block font-bold text-slate-800 leading-none">Basic Pay Rate</span>
              <span className="text-[10px] text-slate-450">Agreed basic hourly/monthly contract rate</span>
            </div>
          </div>
          <span className="font-mono font-bold text-slate-900">${(payroll.basicSalary || 0).toLocaleString()}</span>
        </div>

        {/* Allowances Row */}
        <div className="flex items-center justify-between p-2.5 bg-emerald-50/40 border border-emerald-100/50 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <span className="block font-bold text-emerald-850 leading-none">Corporate Allowances</span>
              <span className="text-[10px] text-emerald-600/80">Active bonuses, shifts, travel & meal credits</span>
            </div>
          </div>
          <span className="font-mono font-bold text-emerald-600">+${(payroll.allowances || 0).toLocaleString()}</span>
        </div>

        {/* Deductions Row */}
        <div className="flex items-center justify-between p-2.5 bg-rose-50/40 border border-rose-100/50 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <div>
              <span className="block font-bold text-rose-850 leading-none">Statutory Deductions</span>
              <span className="text-[10px] text-rose-600/80">National insurance, tax, health plan, retirement savings</span>
            </div>
          </div>
          <span className="font-mono font-bold text-rose-600">-${deductionsVal.toLocaleString()}</span>
        </div>

        {/* Net Salary Summary */}
        <div className="flex items-center justify-between p-3 bg-slate-900 text-white border border-slate-900 rounded-xl mt-1 shadow-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="block font-bold font-display leading-none text-white text-xs">Total Net Disbursed</span>
              <span className="text-[10px] text-slate-350">Actual amount credited to bank account</span>
            </div>
          </div>
          <span className="font-mono font-bold text-base text-emerald-400">${payroll.netSalary.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaryBreakdown;
