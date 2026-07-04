import React from "react";
import { Input } from "../ui/Input.tsx";

interface PayrollFiltersProps {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (st: string) => void;
}

export const PayrollFilters: React.FC<PayrollFiltersProps> = ({ search, setSearch, status, setStatus }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search staff name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md text-xs"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-1.5 border border-[#E2E8F0] rounded-xl bg-white text-xs font-semibold font-display text-[#0F172A] focus:outline-hidden"
      >
        <option value="ALL">All Statuses</option>
        <option value="PAID">Paid</option>
        <option value="UNPAID">Unpaid</option>
      </select>
    </div>
  );
};

export default PayrollFilters;
