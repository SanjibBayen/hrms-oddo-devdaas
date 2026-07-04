import React from "react";
import { Payroll } from "../../types/index.ts";
import { Badge } from "../ui/Badge.tsx";
import { Card, CardContent } from "../ui/Card.tsx";
import { DollarSign, Briefcase, Calendar, CreditCard, Eye } from "lucide-react";

interface PayrollCardProps {
  payroll: Payroll;
  isAdmin?: boolean;
  onPay?: (id: string) => void;
  onViewDetails?: (p: Payroll) => void;
}

export const PayrollCard: React.FC<PayrollCardProps> = ({
  payroll,
  isAdmin = false,
  onPay,
  onViewDetails,
}) => {
  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-slate-100">
      <CardContent className="p-5 font-sans space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-display leading-tight">
              {payroll.userName || "Employee"}
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> {payroll.designation || "Staff"} • {payroll.department || "HR"}
            </p>
          </div>
          <Badge variant={payroll.status === "PAID" ? "success" : "warning"} className="text-[9px]">
            {payroll.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-50 py-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pay Period</span>
            <span className="flex items-center gap-1 font-semibold text-slate-750">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {payroll.month}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Net Disbursed</span>
            <span className="flex items-center gap-1 font-mono font-bold text-slate-900">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> ${payroll.netSalary.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={() => onViewDetails?.(payroll)}
            className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-100 text-slate-650 hover:bg-slate-100 text-[11px] font-semibold font-display rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> View Payslip
          </button>
          {isAdmin && payroll.status === "DRAFT" && (
            <button
              onClick={() => onPay?.(payroll.id)}
              className="flex-1 py-1.5 px-3 bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 text-[11px] font-semibold font-display rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" /> Disburse
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollCard;
