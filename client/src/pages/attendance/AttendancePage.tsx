import React from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { useHRMS } from "../../hooks/useHRMS.ts";
import { AttendanceStats } from "../../components/attendance/AttendanceStats.tsx";
import { AttendanceTable } from "../../components/attendance/AttendanceTable.tsx";
import { CheckInOutButton } from "../../components/attendance/CheckInOutButton.tsx";
import { GeoLocationCheck } from "../../components/attendance/GeoLocationCheck.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card.tsx";
import { Breadcrumb } from "../../components/layout/Breadcrumb.tsx";

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const { attendanceLogs, checkIn, checkOut, isLoading } = useHRMS();

  if (!user) return null;

  const isCheckedIn = attendanceLogs.length > 0 && attendanceLogs[0].checkOut === null;
  const userLogs = user.role === "ADMIN" ? attendanceLogs : attendanceLogs.filter(l => l.userId === user.id);

  const presentDays = userLogs.filter(l => l.status === "PRESENT").length;
  const lateDays = userLogs.filter(l => l.status === "LATE").length;
  const totalHours = userLogs.reduce((acc, l) => acc + l.workHours, 0);

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Core Menu", "Attendance Console"]} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shift Terminal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CheckInOutButton
                isCheckedIn={isCheckedIn}
                onCheckIn={() => checkIn(user.id)}
                onCheckOut={() => checkOut(user.id)}
                isLoading={isLoading}
              />
              <GeoLocationCheck />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <AttendanceStats
            presentDays={presentDays}
            lateDays={lateDays}
            totalHours={totalHours}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.role === "ADMIN" ? "Company Attendance Registry" : "My Attendance Records"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AttendanceTable logs={userLogs} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
