import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table.tsx";
import { Badge } from "../ui/Badge.tsx";
import { AttendanceLog } from "../../types/index.ts";

interface AttendanceTableProps {
  logs: AttendanceLog[];
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ logs }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Check-In</TableHead>
          <TableHead>Check-Out</TableHead>
          <TableHead>Hours Worked</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-slate-400 py-8 font-sans">
              No attendance logs found for this period.
            </TableCell>
          </TableRow>
        ) : (
          logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-semibold text-slate-900 font-sans">{log.date}</TableCell>
              <TableCell className="font-mono text-slate-600">{log.checkIn || "--:--:--"}</TableCell>
              <TableCell className="font-mono text-slate-600">{log.checkOut || "--:--:--"}</TableCell>
              <TableCell className="font-semibold text-slate-700">{log.workHours.toFixed(2)} hrs</TableCell>
              <TableCell>
                <Badge
                  variant={
                    log.status === "PRESENT"
                      ? "success"
                      : log.status === "LATE"
                      ? "warning"
                      : "danger"
                  }
                >
                  {log.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AttendanceTable;
