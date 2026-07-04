import React, { TdHTMLAttributes, ThHTMLAttributes, TableHTMLAttributes, HTMLAttributes } from "react";

export const Table: React.FC<TableHTMLAttributes<HTMLTableElement>> = ({ children, className = "", ...props }) => {
  return (
    <div className="w-full overflow-x-auto border border-slate-100 rounded-lg">
      <table className={`w-full text-left border-collapse bg-white ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = "", ...props }) => {
  return (
    <thead className={`bg-slate-50 border-b border-slate-100 ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({ children, className = "", ...props }) => {
  return (
    <tbody className={`divide-y divide-slate-100 text-slate-700 ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<HTMLAttributes<HTMLTableRowElement>> = ({ children, className = "", ...props }) => {
  return (
    <tr className={`hover:bg-slate-50/50 transition-colors duration-150 ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const TableHead: React.FC<ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className = "", ...props }) => {
  return (
    <th className={`px-6 py-4.5 text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`} {...props}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className = "", ...props }) => {
  return (
    <td className={`px-6 py-4 text-sm text-slate-700 font-sans align-middle ${className}`} {...props}>
      {children}
    </td>
  );
};
