import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table.tsx";
import { Badge } from "../ui/Badge.tsx";
import { Payroll } from "../../types/index.ts";
import { CreditCard, Eye } from "lucide-react";

interface PayrollTableProps {
  payrolls: Payroll[];
  isAdmin?: boolean;
  onPay?: (id: string) => void;
  onViewDetails?: (p: Payroll) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ payrolls, isAdmin = false, onPay, onViewDetails }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Staff</TableHead>
          <TableHead>Month</TableHead>
          <TableHead>Base Salary</TableHead>
          <TableHead>Net Salary</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payrolls.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-slate-400 py-8 font-sans">
              No payroll records found.
            </TableCell>
          </TableRow>
        ) : (
          payrolls.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-semibold text-slate-900 font-sans">{p.userName}</TableCell>
              <TableCell className="text-slate-600 text-xs">{p.month}</TableCell>
              <TableCell className="font-mono text-slate-700">${p.basicSalary.toLocaleString()}</TableCell>
              <TableCell className="font-mono font-bold text-slate-900">${p.netSalary.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={p.status === "PAID" ? "success" : "warning"}>
                  {p.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onViewDetails?.(p)}
                    className="p-1 bg-slate-50 border border-slate-100 text-slate-650 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                    title="View payslip"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && p.status === "DRAFT" && (
                    <button
                      onClick={() => onPay?.(p.id)}
                      className="p-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded hover:bg-emerald-100 transition-colors cursor-pointer"
                      title="Disburse Funds"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PayrollTable;
