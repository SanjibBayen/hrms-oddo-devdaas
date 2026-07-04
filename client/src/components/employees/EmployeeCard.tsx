import React from "react";
import { Employee } from "../../types/index.ts";
import { Card, CardContent } from "../ui/Card.tsx";
import { Badge } from "../ui/Badge.tsx";
import { Mail, Phone, Briefcase } from "lucide-react";

interface EmployeeCardProps {
  employee: Employee;
  onSelect: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onSelect }) => {
  return (
    <Card hoverable className="cursor-pointer" onClick={onSelect}>
      <CardContent className="p-5 space-y-4 font-sans">
        <div className="flex items-center gap-3">
          <img
            src={employee.avatarUrl}
            alt={employee.name}
            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 truncate font-display">{employee.name}</h4>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="truncate">{employee.designation}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{employee.email}</span></div>
          <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {employee.phone}</div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{employee.department}</span>
          <Badge variant={employee.status === "ACTIVE" ? "success" : "danger"}>
            {employee.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
