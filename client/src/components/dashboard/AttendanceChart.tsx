import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface AttendanceChartProps {
  data?: Array<{ name: string; present: number; absent: number }>;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  const defaultData = data || [
    { name: "Mon", present: 22, absent: 2 },
    { name: "Tue", present: 23, absent: 1 },
    { name: "Wed", present: 24, absent: 0 },
    { name: "Thu", present: 21, absent: 3 },
    { name: "Fri", present: 22, absent: 2 },
  ];

  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={defaultData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E2E8F0" }} />
          <Bar dataKey="present" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="absent" fill="#FDA4AF" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
