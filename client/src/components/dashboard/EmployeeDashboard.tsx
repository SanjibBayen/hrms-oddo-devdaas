import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card.tsx";
import { GeoLocationCheck } from "../attendance/GeoLocationCheck.tsx";
import { useHRMS } from "../../hooks/useHRMS.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { CheckInOutButton } from "../attendance/CheckInOutButton.tsx";
import { AttendanceStats } from "../attendance/AttendanceStats.tsx";
import { Clock } from "lucide-react";

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { attendanceLogs, checkIn, checkOut, isLoading } = useHRMS();

  const isCheckedIn = attendanceLogs.length > 0 && attendanceLogs[0].checkOut === null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" /> Duty Console
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CheckInOutButton
              isCheckedIn={isCheckedIn}
              onCheckIn={() => checkIn(user?.id || "")}
              onCheckOut={() => checkOut(user?.id || "")}
              isLoading={isLoading}
            />
            <GeoLocationCheck />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceStats
              presentDays={attendanceLogs.filter(l => l.status === "PRESENT").length}
              lateDays={attendanceLogs.filter(l => l.status === "LATE").length}
              totalHours={attendanceLogs.reduce((acc, l) => acc + l.workHours, 0)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
