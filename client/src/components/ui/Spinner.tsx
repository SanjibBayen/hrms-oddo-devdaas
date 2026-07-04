import React from "react";

export const Spinner: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-slate-200 border-t-slate-800 h-4 w-4 ${className}`} />
  );
};

export default Spinner;
