import React from "react";
import { Input } from "../ui/Input.tsx";

interface EmployeeFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  department: string;
  setDepartment: (d: string) => void;
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({ search, setSearch, department, setDepartment }) => {
  const departments = ["ALL", "Engineering", "HR", "Sales", "Marketing", "Finance", "Operations"];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md text-xs"
      />
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="px-3 py-1.5 border border-[#E2E8F0] rounded-xl bg-white text-xs font-semibold font-display text-[#0F172A] focus:outline-hidden"
      >
        {departments.map((dept) => (
          <option key={dept} value={dept}>{dept === "ALL" ? "All Departments" : dept}</option>
        ))}
      </select>
    </div>
  );
};

export default EmployeeFilters;
