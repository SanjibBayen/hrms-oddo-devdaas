import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { useHRMS } from "../../hooks/useHRMS.ts";
import { PayrollTable } from "../../components/payroll/PayrollTable.tsx";
import { SalaryBreakdown } from "../../components/payroll/SalaryBreakdown.tsx";
import { PayslipViewer } from "../../components/payroll/PayslipViewer.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card.tsx";
import { Breadcrumb } from "../../components/layout/Breadcrumb.tsx";

export const MyPayrollPage: React.FC = () => {
  const { user } = useAuth();
  const { payrolls } = useHRMS();
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  if (!user) return null;

  const userPayrolls = payrolls.filter((p) => p.userId === user.id);

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Financials", "My Compensation"]} />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">My Compensation Details</h2>
          <p className="text-xs text-slate-450">Review processed payslips, base salaries, social security, and net credit history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Payroll History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <PayrollTable
                  payrolls={userPayrolls}
                  isAdmin={false}
                  onViewDetails={setSelectedPayroll}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedPayroll ? (
            <Card>
              <CardHeader className="flex justify-between items-center flex-row">
                <CardTitle>Payslip Viewer</CardTitle>
                <button 
                  onClick={() => setSelectedPayroll(null)} 
                  className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
                >
                  Close
                </button>
              </CardHeader>
              <CardContent className="space-y-6">
                <SalaryBreakdown payroll={selectedPayroll} />
                <PayslipViewer payroll={selectedPayroll} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Payslip Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center text-xs text-slate-400 font-sans">
                  Select a payroll record from the list to preview the certified pay statement breakdown.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPayrollPage;
