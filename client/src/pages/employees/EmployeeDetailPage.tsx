import React from "react";
import { useHRMS } from "../../hooks/useHRMS.ts";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Breadcrumb } from "../../components/layout/Breadcrumb.tsx";
import { ArrowLeft, Mail, Phone, Briefcase, DollarSign, Calendar, Clock, AlertCircle } from "lucide-react";
import Badge from "../../components/ui/Badge.tsx";

interface EmployeeDetailPageProps {
  employeeId?: string;
  onBack?: () => void;
}

export const EmployeeDetailPage: React.FC<EmployeeDetailPageProps> = ({ employeeId, onBack }) => {
  const { employees, attendanceLogs, leaveRequests, payrolls } = useHRMS();

  // If no ID passed, get first active employee or show empty state
  const empId = employeeId || (employees.length > 0 ? employees[0].id : "");
  const employee = employees.find(e => e.id === empId);

  if (!employee) {
    return (
      <div className="space-y-6">
        <Breadcrumb items={["Core Menu", "Staff Directory", "Profile Detail"]} />
        <Card className="p-12 text-center text-xs text-slate-400 font-sans">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          No employee matches the specified identification code.
          {onBack && (
            <div className="mt-4">
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Staff List
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  const empAttendance = attendanceLogs.filter(a => a.userId === employee.id);
  const empLeaves = leaveRequests.filter(l => l.userId === employee.id);
  const empPayrolls = payrolls.filter(p => p.userId === employee.id);

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Core Menu", "Staff Directory", employee.name]} />

      <div className="flex items-center gap-4">
        {onBack && (
          <Button onClick={onBack} variant="outline" className="h-9 px-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">Staff File Detail</h2>
          <p className="text-xs text-slate-450">Granular profile breakdown, compensations, shift schedules, and compliance ledgers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 font-sans space-y-6">
              <div className="flex flex-col items-center text-center gap-3">
                <img src={employee.avatarUrl} alt={employee.name} className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display leading-tight">{employee.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 justify-center">
                    <Briefcase className="w-3.5 h-3.5" />
                    {employee.designation}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{employee.department} Department</p>
                </div>
                <Badge variant={employee.status === "ACTIVE" ? "success" : "neutral"} className="text-[9px]">
                  {employee.status}
                </Badge>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Corporate Email</span>
                  <span className="flex items-center gap-2 text-slate-700 font-medium"><Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}</span>
                </div>
                <div className="space-y-1">
                  <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Phone</span>
                  <span className="flex items-center gap-2 text-slate-700 font-medium"><Phone className="w-3.5 h-3.5 text-slate-400" /> {employee.phone || "Not specified"}</span>
                </div>
                <div className="space-y-1">
                  <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Base Compensation Rate</span>
                  <span className="flex items-center gap-2 text-slate-700 font-mono font-bold text-emerald-600"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> ${employee.salary.toLocaleString()}/mo</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance & Leave Records */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-slate-500" /> Shift & Attendance Ledger ({empAttendance.length} records)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 font-bold font-display text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 font-bold font-display text-slate-500 uppercase tracking-wider">Punches</th>
                      <th className="px-6 py-3 font-bold font-display text-slate-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 font-bold font-display text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {empAttendance.slice(0, 5).map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-semibold">{log.date}</td>
                        <td className="px-6 py-3 font-mono">{log.checkIn || "--:--"} - {log.checkOut || "--:--"}</td>
                        <td className="px-6 py-3 font-mono">{log.workHours} hrs</td>
                        <td className="px-6 py-3">
                          <Badge variant={log.status === "PRESENT" ? "success" : "warning"} className="text-[8px]">
                            {log.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {empAttendance.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center p-6 text-slate-400">No shift punches logged.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <Calendar className="w-4 h-4 text-slate-500" /> Leave Requests ({empLeaves.length} requests)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 font-bold font-display text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 font-bold font-display text-slate-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-3 font-bold font-display text-slate-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 font-bold font-display text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {empLeaves.slice(0, 5).map(req => (
                      <tr key={req.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-bold">{req.leaveType}</td>
                        <td className="px-6 py-3">{req.startDate} to {req.endDate}</td>
                        <td className="px-6 py-3 text-slate-500 truncate max-w-xs">{req.reason}</td>
                        <td className="px-6 py-3">
                          <Badge variant={
                            req.status === "APPROVED" ? "success" :
                            req.status === "REJECTED" ? "danger" : "warning"
                          } className="text-[8px]">
                            {req.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {empLeaves.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center p-6 text-slate-400">No time off requested.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
