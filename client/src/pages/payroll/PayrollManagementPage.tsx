import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { useHRMS } from "../../hooks/useHRMS.ts";
import { PayrollFilters } from "../../components/payroll/PayrollFilters.tsx";
import { PayrollTable } from "../../components/payroll/PayrollTable.tsx";
import { PayrollStats } from "../../components/payroll/PayrollStats.tsx";
import { PayrollActions } from "../../components/payroll/PayrollActions.tsx";
import { SalaryBreakdown } from "../../components/payroll/SalaryBreakdown.tsx";
import { PayslipViewer } from "../../components/payroll/PayslipViewer.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card.tsx";
import { Breadcrumb } from "../../components/layout/Breadcrumb.tsx";

export const PayrollManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { payrolls, processPayrollPayment, calculatePayroll, isLoading } = useHRMS();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  const filteredPayrolls = payrolls.filter((p) => {
    const matchesSearch = (p.userName || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "ALL" || p.status === status;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ["Employee", "Month", "Base Salary", "Allowances", "Deductions", "Net Salary", "Status"];
    const rows = filteredPayrolls.map(p => [
      p.userName || "Unknown",
      p.month,
      p.basicSalary || 0,
      p.allowances || 0,
      p.deductions || 0,
      p.netSalary,
      p.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payroll_ledger_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Financials", "Payroll Administration"]} />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">Payroll Administration</h2>
          <p className="text-xs text-slate-450">Run ledger calculations, disburse staff funds, and export statutory compliance sheets.</p>
        </div>
      </div>

      {/* Render the full statistical dashboard of payroll */}
      <PayrollStats payrolls={payrolls} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Payroll Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <PayrollFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
              />
              <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
                <PayrollTable
                  payrolls={filteredPayrolls}
                  isAdmin={isAdmin}
                  onPay={(id) => processPayrollPayment(id, "PAID")}
                  onViewDetails={setSelectedPayroll}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Admin Calculations & Toolkit Actions Card */}
          <PayrollActions 
            onCalculate={calculatePayroll} 
            onExportCSV={handleExportCSV}
            isLoading={isLoading}
          />

          {selectedPayroll && (
            <Card>
              <CardHeader className="flex justify-between items-center flex-row">
                <CardTitle>Calculation Insights</CardTitle>
                <button 
                  onClick={() => setSelectedPayroll(null)} 
                  className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
                >
                  Clear Selection
                </button>
              </CardHeader>
              <CardContent className="space-y-6">
                <SalaryBreakdown payroll={selectedPayroll} />
                <PayslipViewer payroll={selectedPayroll} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollManagementPage;
