import React from "react";
import { LeaveStatus } from "../../types/index.ts";
import { Badge } from "../ui/Badge.tsx";

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
  className?: string;
}

export const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status, className = "" }) => {
  switch (status) {
    case "APPROVED":
      return (
        <Badge variant="success" className={`text-[9px] font-bold font-sans tracking-wide uppercase px-2 py-0.5 ${className}`}>
          Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="danger" className={`text-[9px] font-bold font-sans tracking-wide uppercase px-2 py-0.5 ${className}`}>
          Rejected
        </Badge>
      );
    case "PENDING":
    default:
      return (
        <Badge variant="warning" className={`text-[9px] font-bold font-sans tracking-wide uppercase px-2 py-0.5 ${className}`}>
          Pending
        </Badge>
      );
  }
};

export default LeaveStatusBadge;
