import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card.tsx";
import { Calendar } from "lucide-react";

export const AttendanceCalendar: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" /> Monthly Attendance Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-slate-400 font-sans">
          <Calendar className="w-8 h-8 mb-2 opacity-55" />
          <p className="text-xs">Calendar visualization load complete</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
