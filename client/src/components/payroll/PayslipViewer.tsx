import React, { useRef } from "react";
import { Payroll } from "../../types/index.ts";
import { Badge } from "../ui/Badge.tsx";
import { Button } from "../ui/Button.tsx";
import { Printer, Download, Building, ShieldCheck, Mail, Briefcase } from "lucide-react";

interface PayslipViewerProps {
  payroll: Payroll;
}

export const PayslipViewer: React.FC<PayslipViewerProps> = ({ payroll }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printAreaRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Payslip - ${payroll.userName}</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
                .payslip-container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 12px; }
                .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
                .company-info { font-weight: bold; }
                .emp-details { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin: 24px 0; font-size: 13px; }
                .table-sect { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .table-sect th { text-align: left; background: #f8fafc; padding: 10px; border-bottom: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
                .table-sect td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
                .total-bar { display: flex; justify-content: space-between; padding: 15px 10px; background: #0f172a; color: white; border-radius: 8px; margin-top: 24px; font-weight: bold; }
                .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 40px; border-t: 1px dashed #cbd5e1; padding-top: 20px; }
              </style>
            </head>
            <body>
              <div class="payslip-container">
                ${printContent}
              </div>
            </body>
          </html>
        `);
        win.document.close();
        win.print();
      }
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="flex justify-end gap-2 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="h-8 text-[11px] font-semibold">
          <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Statement
        </Button>
      </div>

      <div 
        ref={printAreaRef}
        className="border border-slate-150 rounded-2xl p-6 bg-white shadow-xs space-y-6 text-slate-800"
      >
        {/* Header Block */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 font-bold font-display text-slate-900 text-sm tracking-tight uppercase">
              <Building className="w-4 h-4 text-slate-500" />
              Enterprise Core HRMS
            </span>
            <span className="block text-[10px] text-slate-400">100 Corporate Parkway, Suite 500 • New York, NY</span>
          </div>
          <div className="text-right space-y-1">
            <Badge variant={payroll.status === "PAID" ? "success" : "warning"} className="text-[10px] px-2 py-0.5 font-semibold">
              {payroll.status}
            </Badge>
            <p className="text-[10px] text-slate-450 font-mono">ID: {payroll.id.toUpperCase()}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Staff Associate</span>
            <span className="font-bold text-slate-900 font-display text-xs">{payroll.userName}</span>
          </div>
          <div>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pay Statement Cycle</span>
            <span className="font-semibold text-slate-800">{payroll.month}</span>
          </div>
          <div>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Corporate Role</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-slate-400" /> {payroll.designation || "Staff"} ({payroll.department || "HR"})
            </span>
          </div>
          <div>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Status Certification</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Certified Secure
            </span>
          </div>
        </div>

        {/* Salary Calculations Ledger */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">Salary Ledger Breakdown</h4>
          <table className="w-full text-left text-slate-700">
            <thead>
              <tr className="text-[9px] text-slate-400 uppercase tracking-wider">
                <th className="py-2 font-semibold">Description</th>
                <th className="py-2 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              <tr>
                <td className="py-2.5 text-slate-700">Contract Base Wages</td>
                <td className="py-2.5 text-right font-mono text-slate-900">${(payroll.basicSalary || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-emerald-700">Active Monthly Performance Allowances</td>
                <td className="py-2.5 text-right font-mono text-emerald-600">+${(payroll.allowances || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2.5 text-rose-700">Social Care, Taxes & Retirement Deductions</td>
                <td className="py-2.5 text-right font-mono text-rose-600">-${(payroll.deductions || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Ledger Banner */}
        <div className="flex justify-between items-center bg-[#0F172A] text-white p-4 rounded-xl shadow-xs">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Net Bank Credit</span>
            <span className="text-[10px] text-slate-300">Sum paid directly to designated bank router</span>
          </div>
          <span className="font-mono font-bold text-lg text-emerald-400">${payroll.netSalary.toLocaleString()}</span>
        </div>

        {/* Certificate Signature */}
        <div className="border-t border-slate-100 pt-5 flex justify-between items-end text-[10px] text-slate-400">
          <div>
            <p className="font-bold text-slate-800">HR Director Signature</p>
            <p className="mt-4 font-serif italic text-slate-500 text-xs border-b border-slate-300 w-36 pb-1">Enterprise HR Team</p>
          </div>
          <p className="text-right max-w-[180px] leading-relaxed">
            This document represents a certified secure corporate electronic payslip issued on behalf of human resources management systems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayslipViewer;
