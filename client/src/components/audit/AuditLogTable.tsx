import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table.tsx";
import { ActivityLog } from "../../types/index.ts";
import { Badge } from "../ui/Badge.tsx";

interface AuditLogTableProps {
  logs: ActivityLog[];
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-slate-400 py-8 font-sans">
              No audit logs recorded yet.
            </TableCell>
          </TableRow>
        ) : (
          logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-xs text-slate-500 font-mono">
                {new Date(log.timestamp).toLocaleString()}
              </TableCell>
              <TableCell className="font-semibold text-slate-900 font-sans">{log.userName}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    log.category === "AUTH"
                      ? "default"
                      : log.category === "PAYROLL"
                      ? "success"
                      : log.category === "LEAVE"
                      ? "warning"
                      : "primary"
                  }
                >
                  {log.category}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-600 font-sans">{log.action}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AuditLogTable;
