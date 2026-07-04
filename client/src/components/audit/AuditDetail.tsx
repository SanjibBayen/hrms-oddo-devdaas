import React from "react";
import { ActivityLog } from "../../types/index.ts";

interface AuditDetailProps {
  log: ActivityLog | null;
  onClose: () => void;
}

export const AuditDetail: React.FC<AuditDetailProps> = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="p-4 flex flex-col gap-3 font-sans">
      <h3 className="text-sm font-bold text-slate-900 font-display">Activity Details</h3>
      <div className="text-xs space-y-2 text-slate-600">
        <div><strong className="text-slate-800">User:</strong> {log.userName} (ID: {log.userId})</div>
        <div><strong className="text-slate-800">Action:</strong> {log.action}</div>
        <div><strong className="text-slate-800">Category:</strong> {log.category}</div>
        <div><strong className="text-slate-800">Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</div>
      </div>
      <button onClick={onClose} className="mt-4 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200">
        Close
      </button>
    </div>
  );
};

export default AuditDetail;
