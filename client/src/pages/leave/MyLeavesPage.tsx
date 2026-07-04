import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { useHRMS } from "../../hooks/useHRMS.ts";
import { LeaveRequestForm } from "../../components/leave/LeaveRequestForm.tsx";
import { LeaveBalance } from "../../components/leave/LeaveBalance.tsx";
import { LeaveTable } from "../../components/leave/LeaveTable.tsx";
import { LeaveDetails } from "../../components/leave/LeaveDetails.tsx";
import { LeaveFilters } from "../../components/leave/LeaveFilters.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Breadcrumb } from "../../components/layout/Breadcrumb.tsx";
import { CalendarRange } from "lucide-react";

export const MyLeavesPage: React.FC = () => {
  const { user } = useAuth();
  const { leaveRequests, applyLeave } = useHRMS();
  const [showApply, setShowApply] = useState(false);
  
  // Search & Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [leaveType, setLeaveType] = useState("ALL");
  
  // Detail sidebar state
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  if (!user) return null;

  const userLeaves = leaveRequests.filter(l => l.userId === user.id);

  const sickTaken = userLeaves.filter(l => l.leaveType === "SICK" && l.status === "APPROVED").length;
  const casualTaken = userLeaves.filter(l => l.leaveType === "CASUAL" && l.status === "APPROVED").length;
  const annualRemaining = 18 - userLeaves.filter(l => l.leaveType === "ANNUAL" && l.status === "APPROVED").length;

  const filteredLeaves = userLeaves.filter((l) => {
    const matchesSearch = (l.userName || l.employeeName || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "ALL" || l.status === status;
    const matchesType = leaveType === "ALL" || l.leaveType === leaveType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Core Menu", "Leave Center", "My Requests"]} />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">My Leave Manager</h2>
          <p className="text-xs text-slate-450">Submit leave applications and track active status updates.</p>
        </div>
        {!showApply && (
          <Button onClick={() => setShowApply(true)} className="bg-[#0F172A] hover:bg-slate-850 text-white font-semibold">
            <CalendarRange className="w-4 h-4 mr-2" /> Apply Leave
          </Button>
        )}
      </div>

      <LeaveBalance sickTaken={sickTaken} casualTaken={casualTaken} annualRemaining={annualRemaining} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {showApply ? (
            <Card>
              <CardHeader>
                <CardTitle>Submit Leave Application</CardTitle>
              </CardHeader>
              <CardContent>
                <LeaveRequestForm
                  onSubmit={async (values) => {
                    await applyLeave({
                      ...values,
                      userId: user.id,
                      userName: user.name,
                    });
                    setShowApply(false);
                  }}
                  onCancel={() => setShowApply(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>My Leave History</CardTitle>
              </CardHeader>
              <CardContent>
                <LeaveFilters
                  search={search}
                  setSearch={setSearch}
                  status={status}
                  setStatus={setStatus}
                  leaveType={leaveType}
                  setLeaveType={setLeaveType}
                />
                <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
                  <LeaveTable
                    leaves={filteredLeaves}
                    isAdmin={false}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedLeave ? (
            <Card>
              <CardHeader className="flex justify-between items-center flex-row">
                <CardTitle>Request Dossier</CardTitle>
                <button 
                  onClick={() => setSelectedLeave(null)} 
                  className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
                >
                  Close
                </button>
              </CardHeader>
              <CardContent>
                <LeaveDetails leave={selectedLeave} onClose={() => setSelectedLeave(null)} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Active Calendar Info</CardTitle>
              </CardHeader>
              <CardContent className="p-5 text-center text-xs text-slate-400">
                You currently have {userLeaves.filter(l => l.status === "PENDING").length} pending requests awaiting management review.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLeavesPage;
