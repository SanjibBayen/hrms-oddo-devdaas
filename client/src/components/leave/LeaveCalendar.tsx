import React from "react";
import { Card, CardContent } from "../ui/Card.tsx";
import { Calendar } from "lucide-react";

export const LeaveCalendar: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8 text-slate-400 font-sans">
        <Calendar className="w-8 h-8 mb-2 opacity-55" />
        <p className="text-xs">Visual roster calendar loaded</p>
      </CardContent>
    </Card>
  );
};

export default LeaveCalendar;
