import React from "react";
import { Payroll } from "../../types/index.ts";
import { Card, CardContent } from "../ui/Card.tsx";
import { DollarSign, Wallet, AlertCircle, Sparkles } from "lucide-react";

interface PayrollStatsProps {
  payrolls: Payroll[];
}

export const PayrollStats: React.FC<PayrollStatsProps> = ({ payrolls }) => {
  const totalBudget = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
  const paidBudget = payrolls.filter(p => p.status === "PAID").reduce((sum, p) => sum + p.netSalary, 0);
  const draftBudget = payrolls.filter(p => p.status !== "PAID").reduce((sum, p) => sum + p.netSalary, 0);
  
  const paidCount = payrolls.filter(p => p.status === "PAID").length;
  const draftCount = payrolls.filter(p => p.status !== "PAID").length;

  const averageNet = payrolls.length > 0 ? (totalBudget / payrolls.length) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Budget Card */}
      <Card className="border border-slate-100 bg-white">
        <CardContent className="p-5 font-sans flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Payroll</span>
            <span className="block text-lg font-bold text-slate-800 font-mono leading-tight">
              ${totalBudget.toLocaleString()}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">
              Across {payrolls.length} active statements
            </span>
          </div>
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
        </CardContent>
      </Card>

      {/* Disbursed Card */}
      <Card className="border border-emerald-100 bg-emerald-50/10">
        <CardContent className="p-5 font-sans flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Disbursed Funds</span>
            <span className="block text-lg font-bold text-emerald-800 font-mono leading-tight">
              ${paidBudget.toLocaleString()}
            </span>
            <span className="block text-[10px] text-emerald-500 font-medium">
              {paidCount} processed invoices
            </span>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Outstanding/Drafts Card */}
      <Card className="border border-amber-100 bg-amber-50/10">
        <CardContent className="p-5 font-sans flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">Outstanding Drafts</span>
            <span className="block text-lg font-bold text-amber-800 font-mono leading-tight">
              ${draftBudget.toLocaleString()}
            </span>
            <span className="block text-[10px] text-amber-500 font-medium">
              {draftCount} pending payments
            </span>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Average Comp Card */}
      <Card className="border border-slate-100 bg-white">
        <CardContent className="p-5 font-sans flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Average Monthly Net</span>
            <span className="block text-lg font-bold text-slate-800 font-mono leading-tight">
              ${Math.round(averageNet).toLocaleString()}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">
              Median staff monthly compensation
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollStats;
