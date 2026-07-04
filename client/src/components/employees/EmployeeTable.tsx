import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table.tsx";
import { Employee } from "../../types/index.ts";
import { Badge } from "../ui/Badge.tsx";
import { Eye } from "lucide-react";

interface EmployeeTableProps {
  employees: Employee[];
  onViewDetails: (emp: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onViewDetails }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Staff</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Designation</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-slate-400 py-8 font-sans">
              No staff records matches current query.
            </TableCell>
          </TableRow>
        ) : (
          employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell className="font-sans font-semibold text-slate-900">
                <div className="flex items-center gap-2.5">
                  <img src={emp.avatarUrl} alt={emp.name} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <span className="block leading-tight">{emp.name}</span>
                    <span className="block text-[10px] text-slate-400 font-normal">{emp.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-sans font-medium text-slate-700">{emp.department}</TableCell>
              <TableCell className="font-sans text-slate-600">{emp.designation}</TableCell>
              <TableCell>
                <Badge variant={emp.status === "ACTIVE" ? "success" : "danger"}>
                  {emp.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => onViewDetails(emp)}
                  className="p-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer"
                  title="View Profile Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default EmployeeTable;
