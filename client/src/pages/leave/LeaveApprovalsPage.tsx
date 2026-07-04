import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { useHRMS } from "../../hooks/useHRMS.ts";
import { LeaveApprovalTable } from "../../components/leave/LeaveApprovalTable.tsx";
import { LeaveFilters } from "../../components/leave/LeaveFilters.tsx";
import { LeaveDetails } from "../../components/leave/LeaveDetails.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card.tsx";
import { Breadcrumb } from "../../components/layout/Breadcrumb.tsx";
import { FileClock, UserCheck, Users } from "lucide-react";

export const LeaveApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const { leaveRequests, updateLeaveStatus } = useHRMS();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [leaveType, setLeaveType] = useState("ALL");
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN" || user.role === "MANAGER";
  
  const pendingCount = leaveRequests.filter(l => l.status === "PENDING").length;
  const approvedCount = leaveRequests.filter(l => l.status === "APPROVED").length;

  const filteredLeaves = leaveRequests.filter((l) => {
    const userNameStr = l.userName || "";
    const matchesSearch = userNameStr.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "ALL" || l.status === status;
    const matchesType = leaveType === "ALL" || l.leaveType === leaveType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Administration", "Leave Request Approvals"]} />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">Leave Approvals Center</h2>
          <p className="text-xs text-slate-450">Review corporate leave applications and update active approval status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Pending Card */}
        <Card className="border border-amber-100 bg-amber-50/10">
          <CardContent className="p-5 font-sans flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">Awaiting Review</span>
              <span className="block text-lg font-bold text-amber-800 font-mono leading-tight">{pendingCount} requests</span>
            </div>
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <FileClock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Approved Card */}
        <Card className="border border-emerald-100 bg-emerald-50/10">
          <CardContent className="p-5 font-sans flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Approved Leaves</span>
              <span className="block text-lg font-bold text-emerald-800 font-mono leading-tight">{approvedCount} requests</span>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Leaves Ledger</CardTitle>
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
              <div className="mt-4">
                <LeaveApprovalTable
                  leaves={filteredLeaves}
                  onApprove={(id) => updateLeaveStatus(id, "APPROVED", user.name)}
                  onReject={(id) => updateLeaveStatus(id, "REJECTED", user.name)}
                  onViewDetails={setSelectedLeave}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {selectedLeave ? (
            <Card>
              <CardHeader className="flex justify-between items-center flex-row">
                <CardTitle>Detailed Request Dossier</CardTitle>
                <button 
                  onClick={() => setSelectedLeave(null)} 
                  className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
                >
                  Close
                </button>
              </CardHeader>
              <CardContent>
                <LeaveDetails 
                  leave={selectedLeave} 
                  onClose={() => setSelectedLeave(null)}
                  isAdmin={isAdmin}
                  onApprove={(id) => updateLeaveStatus(id, "APPROVED", user.name)}
                  onReject={(id) => updateLeaveStatus(id, "REJECTED", user.name)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>System Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5 text-xs text-slate-500 leading-relaxed font-sans">
                <p>
                  As an administrator or manager, you hold clearance to authorize or deny employee leaves.
                </p>
                <p>
                  Select any active line on the ledger or click a detailed inspect trigger to view full medical and casual explanations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalsPage;
