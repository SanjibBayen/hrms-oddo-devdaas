import { useHRMS } from "./useHRMS.ts";

export const useAuditLog = () => {
  const { auditLogs, refreshAuditLogs } = useHRMS();
  return { auditLogs, refreshAuditLogs };
};

export default useAuditLog;
