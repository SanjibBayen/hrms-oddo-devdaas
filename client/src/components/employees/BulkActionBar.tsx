import React from "react";
import { Button } from "../ui/Button.tsx";

interface BulkActionBarProps {
  selectedCount: number;
  onDeactivate: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedCount, onDeactivate }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between bg-slate-900 text-white px-5 py-3 rounded-xl shadow-md font-sans text-xs">
      <span>{selectedCount} employees selected</span>
      <Button variant="danger" size="sm" onClick={onDeactivate}>
        Bulk Deactivate
      </Button>
    </div>
  );
};

export default BulkActionBar;
