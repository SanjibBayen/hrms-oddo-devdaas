import React from "react";
import { Input } from "../ui/Input.tsx";

interface AuditFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  category: string;
  setCategory: (c: string) => void;
}

export const AuditFilters: React.FC<AuditFiltersProps> = ({ search, setSearch, category, setCategory }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search user or action..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md text-xs"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-1.5 border border-[#E2E8F0] rounded-xl bg-white text-xs font-semibold font-display text-[#0F172A] focus:outline-hidden"
      >
        <option value="ALL">All Categories</option>
        <option value="AUTH">Authentication</option>
        <option value="ATTENDANCE">Attendance</option>
        <option value="LEAVE">Leave</option>
        <option value="PAYROLL">Payroll</option>
        <option value="PROFILE">Profile</option>
      </select>
    </div>
  );
};

export default AuditFilters;
