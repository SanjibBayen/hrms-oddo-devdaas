import React from "react";
import { Users, Clock, DollarSign, Calendar } from "lucide-react";
import { StatCard } from "./StatCard.tsx";
import { AttendanceChart } from "./AttendanceChart.tsx";
import { DepartmentBreakdown } from "./DepartmentBreakdown.tsx";
import { RecentActivity } from "./RecentActivity.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card.tsx";
import { useHRMS } from "../../hooks/useHRMS.ts";

export const AdminDashboard: React.FC = () => {
  const { stats, auditLogs } = useHRMS();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={stats?.totalEmployees || 0} icon={<Users className="w-4 h-4" />} trend="+3%" description="vs last month" />
        <StatCard title="Active Logins" value={stats?.activeEmployees || 0} icon={<Users className="w-4 h-4" />} description="currently verified" />
        <StatCard title="Check-Ins Today" value={stats?.presentToday || 0} icon={<Clock className="w-4 h-4" />} trend={`${(((stats?.presentToday || 0) / (stats?.totalEmployees || 1)) * 100).toFixed(0)}%`} description="on shift" />
        <StatCard title="Pending Leaves" value={stats?.pendingLeaves || 0} icon={<Calendar className="w-4 h-4" />} description="awaiting approval" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentBreakdown />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Enterprise Events</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity logs={auditLogs} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
