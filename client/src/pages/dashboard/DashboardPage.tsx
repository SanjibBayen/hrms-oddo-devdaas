import React, { useEffect, useState } from "react";
import { 
  Users, 
  CalendarCheck, 
  FileCheck, 
  Coins, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  UserMinus, 
  BellRing,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useAuth } from "../../hooks/useAuth.ts";
import { useHRMS } from "../../hooks/useHRMS.ts";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.tsx";
import Badge from "../../components/ui/Badge.tsx";
import Button from "../../components/ui/Button.tsx";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    stats, 
    auditLogs, 
    attendanceLogs, 
    leaveRequests, 
    refreshAll,
    checkIn,
    checkOut
  } = useHRMS();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [todayLog, setTodayLog] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user && attendanceLogs.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const found = attendanceLogs.find(a => a.userId === user.id && a.date === today);
      setTodayLog(found || null);
      setIsCheckedIn(!!found && found.checkIn !== null && found.checkOut === null);
    }
  }, [user, attendanceLogs]);

  if (!user) return null;

  const handlePunch = async () => {
    try {
      if (!isCheckedIn) {
        await checkIn(user.id, "Standard login punch");
      } else {
        await checkOut(user.id);
      }
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Mock charts data based on database ---
  const attendanceTrendData = [
    { name: "Mon", Present: 4, Late: 1 },
    { name: "Tue", Present: 5, Late: 0 },
    { name: "Wed", Present: 4, Late: 1 },
    { name: "Thu", Present: 3, Late: 2 },
    { name: "Fri", Present: stats?.presentToday || 4, Late: stats?.lateToday || 1 },
  ];

  const payrollDistributionData = [
    { name: "Engineering", Budget: 17500 },
    { name: "Human Resources", Budget: 8500 },
    { name: "Design", Budget: 5200 },
  ];

  // Employee customized figures
  const myTotalHours = attendanceLogs
    .filter(a => a.userId === user.id)
    .reduce((sum, a) => sum + a.workHours, 0);
  
  const myApprovedLeaves = leaveRequests
    .filter(l => l.userId === user.id && l.status === "APPROVED").length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Dynamic Welcoming Card */}
      <div className="bg-white text-slate-900 rounded-2xl p-6 lg:p-8 border border-[#E2E8F0] shadow-2xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="z-10 flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-[10px] font-bold font-display self-start mb-1 border border-slate-200">
            <Sparkles className="w-3 h-3 text-slate-500" /> Hackathon Enterprise Node Active
          </div>
          <h1 className="text-lg lg:text-xl font-bold font-display tracking-tight text-slate-950">
            Welcome back, <span className="text-[#0F172A]">{user.name}</span>
          </h1>
          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
            {user.role === "ADMIN" 
              ? "You have full super-administrator rights. Manage roster records, verify check-ins, approve outstanding leaves, and process July payroll."
              : `Welcome to your employee self-service terminal. Access active compensation logs, submit leave requests, and review checked schedules.`}
          </p>
        </div>

        {/* Live Clock & Shift Clock Console */}
        <div className="flex flex-col items-start md:items-end gap-1 z-10 font-display">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Current System Time
          </span>
          <span className="text-xl lg:text-2xl font-bold text-[#0F172A] tracking-tight leading-none tabular-nums">
            {currentTime.toLocaleTimeString()}
          </span>
          <span className="text-[9px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            {currentTime.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} (UTC)
          </span>
        </div>
      </div>

      {user.role === "ADMIN" || user.role === "MANAGER" ? (
        /* ==========================================
           ADMIN & MANAGER DASHBOARD FLOW
           ========================================== */
        <>
          {/* Bento Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card hoverable className="p-4 lg:p-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400 font-display uppercase tracking-wider">Total Staff</span>
                <span className="text-xl font-extrabold font-display text-slate-900 tabular-nums">{stats?.totalEmployees || 0}</span>
                <span className="text-[10px] text-slate-500 font-medium">{stats?.activeEmployees || 0} active in system</span>
              </div>
              <div className="bg-slate-100 p-2.5 rounded-xl text-slate-855">
                <Users className="w-5 h-5" />
              </div>
            </Card>

            <Card hoverable className="p-4 lg:p-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400 font-display uppercase tracking-wider">Present Today</span>
                <span className="text-xl font-extrabold font-display text-slate-900 tabular-nums">{stats?.presentToday || 0}</span>
                <span className="text-[10px] text-emerald-600 font-medium">Checked in on schedule</span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </Card>

            <Card hoverable className="p-4 lg:p-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400 font-display uppercase tracking-wider">Pending Leaves</span>
                <span className="text-xl font-extrabold font-display text-slate-900 tabular-nums">{stats?.pendingLeaves || 0}</span>
                <span className="text-[10px] text-amber-600 font-medium">Awaiting manual approval</span>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600">
                <FileCheck className="w-5 h-5" />
              </div>
            </Card>

            <Card hoverable className="p-4 lg:p-5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400 font-display uppercase tracking-wider">Payroll Cost</span>
                <span className="text-xl font-extrabold font-display text-slate-900 tabular-nums">${stats?.totalPayrollThisMonth?.toLocaleString() || 0}</span>
                <span className="text-[10px] text-indigo-600 font-medium">Current July forecast</span>
              </div>
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                <Coins className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {/* Charts/Reporting Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Analytics (Line/Area) */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex flex-col">
                  <CardTitle>Attendance Trends</CardTitle>
                  <p className="text-[10px] text-slate-400">Total checked-in employees over past five working days</p>
                </div>
                <Badge variant="brand" className="text-[10px]">Weekly Report</Badge>
              </CardHeader>
              <CardContent className="h-68">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                    <Area type="monotone" dataKey="Present" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" />
                    <Area type="monotone" dataKey="Late" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Budgets breakdown (Bar) */}
            <Card>
              <CardHeader>
                <div className="flex flex-col">
                  <CardTitle>Department Payouts</CardTitle>
                  <p className="text-[10px] text-slate-400">Estimated monthly basic salary by department</p>
                </div>
              </CardHeader>
              <CardContent className="h-68">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollDistributionData} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="Budget" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Audit Logs Trail & Recent Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Audit Timeline */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" /> Recent Security & HR Audit logs
                </CardTitle>
                <Badge variant="neutral" className="text-[9px]">Continuous Sync</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-68 overflow-y-auto divide-y divide-slate-50">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="px-6 py-3.5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-lg ${
                          log.category === "AUTH" ? "bg-indigo-50 text-indigo-600" :
                          log.category === "ATTENDANCE" ? "bg-emerald-50 text-emerald-600" :
                          log.category === "LEAVE" ? "bg-amber-50 text-amber-600" :
                          log.category === "PAYROLL" ? "bg-purple-50 text-purple-600" : "bg-slate-50 text-slate-600"
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 font-sans leading-relaxed">{log.action}</p>
                          <p className="text-[10px] text-slate-400">By {log.userName} ({log.userId})</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400">No recent logs logged.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick HR actions Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Core Workflows</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-indigo-950 font-display flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-indigo-600" /> Auto-Compute July Ledgers
                  </h4>
                  <p className="text-[10px] text-indigo-850 font-sans leading-relaxed">
                    Automatically synchronize system attendance sheets with gross-to-net calculators. Adjust draft ledgers.
                  </p>
                  <Button variant="primary" size="sm" className="w-full font-bold text-[10px] bg-slate-900 border-none mt-1">
                    Process Computations
                  </Button>
                </div>

                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-amber-950 font-display flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-amber-600" /> Process Pending Leaves
                  </h4>
                  <p className="text-[10px] text-amber-850 leading-relaxed">
                    There are currently {stats?.pendingLeaves || 0} leave request forms awaiting administrative assessment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        /* ==========================================
           EMPLOYEE SELF-SERVICE DASHBOARD FLOW
           ========================================== */
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Punch Clock Terminal */}
            <Card className="lg:col-span-2 border-indigo-100 bg-linear-to-b from-indigo-50/20 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" /> Digital Check-In Terminal
                </CardTitle>
                <Badge variant={isCheckedIn ? "success" : "neutral"} className="text-[10px]">
                  {isCheckedIn ? "ACTIVE SHIFT" : "OFF SHIFT"}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center gap-4">
                <div className={`p-5 rounded-full border-2 ${
                  isCheckedIn ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"
                }`}>
                  <Clock className="w-10 h-10" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold font-display text-slate-900">
                    {isCheckedIn 
                      ? `Shift active since ${todayLog?.checkIn}`
                      : "Ready to start your work schedule today?"
                    }
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Punches are logged directly to secure compliance sheets. Your IP and physical geo-coordinates are logged.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full max-w-xs mt-2">
                  <Button 
                    variant={isCheckedIn ? "danger" : "success"} 
                    className="w-full font-bold font-display"
                    onClick={handlePunch}
                  >
                    {isCheckedIn ? "Punch Check-Out" : "Punch Check-In"}
                  </Button>
                </div>

                {todayLog && (
                  <div className="w-full max-w-md bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-around text-xs mt-2 shadow-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-display block">CHECK-IN</span>
                      <strong className="font-mono text-slate-800">{todayLog.checkIn || "--:--:--"}</strong>
                    </div>
                    <div className="border-r border-slate-100 h-8" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-display block">CHECK-OUT</span>
                      <strong className="font-mono text-slate-800">{todayLog.checkOut || "--:--:--"}</strong>
                    </div>
                    <div className="border-r border-slate-100 h-8" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-display block">WORK HOURS</span>
                      <strong className="font-mono text-indigo-600">{todayLog.workHours} hrs</strong>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Micro Statistics Panel */}
            <div className="flex flex-col gap-4">
              <Card className="p-5 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 font-display uppercase tracking-wider">Shift Hours Worked</span>
                  <span className="text-xl font-extrabold font-display text-slate-900 tabular-nums">{myTotalHours.toFixed(1)} hrs</span>
                  <span className="text-[10px] text-indigo-600 font-medium">Accumulated this cycle</span>
                </div>
                <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                  <Clock className="w-5 h-5" />
                </div>
              </Card>

              <Card className="p-5 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 font-display uppercase tracking-wider">Approved Leaves</span>
                  <span className="text-xl font-extrabold font-display text-slate-900 tabular-nums">{myApprovedLeaves} days</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Approved by HR</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </Card>

              <Card className="p-5 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-slate-400 font-display uppercase tracking-wider">Your Compensation</span>
                  <span className="text-xl font-extrabold font-display text-slate-900 tabular-nums">${user.salary.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 font-medium">Basic monthly wage</span>
                </div>
                <div className="bg-slate-100 p-2.5 rounded-xl text-slate-700">
                  <Coins className="w-5 h-5" />
                </div>
              </Card>
            </div>
          </div>

          {/* Detailed Attendance Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Clock-In Records</CardTitle>
              <Badge variant="brand" className="text-[10px]">Real-Time Card</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3.5 font-bold font-display text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3.5 font-bold font-display text-slate-500 uppercase tracking-wider">Punch In</th>
                      <th className="px-6 py-3.5 font-bold font-display text-slate-500 uppercase tracking-wider">Punch Out</th>
                      <th className="px-6 py-3.5 font-bold font-display text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 font-bold font-display text-slate-500 uppercase tracking-wider">Hours Worked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
                    {attendanceLogs.filter(a => a.userId === user.id).slice(0, 5).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-semibold text-slate-800">{log.date}</td>
                        <td className="px-6 py-3.5 font-mono text-slate-600">{log.checkIn || "--:--:--"}</td>
                        <td className="px-6 py-3.5 font-mono text-slate-600">{log.checkOut || "--:--:--"}</td>
                        <td className="px-6 py-3.5">
                          <Badge variant={
                            log.status === "PRESENT" ? "success" :
                            log.status === "LATE" ? "warning" :
                            log.status === "ON_LEAVE" ? "info" : "danger"
                          } className="text-[9px] font-display">
                            {log.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-3.5 font-mono font-bold text-slate-850">{log.workHours} hrs</td>
                      </tr>
                    ))}
                    {attendanceLogs.filter(a => a.userId === user.id).length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center p-8 text-slate-400">No shift records tracked yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
