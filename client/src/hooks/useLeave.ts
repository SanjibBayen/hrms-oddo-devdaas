import { useHRMS } from "./useHRMS.ts";

export const useLeave = () => {
  const { leaveRequests, applyLeave, updateLeaveStatus, refreshLeaves } = useHRMS();
  return { leaveRequests, applyLeave, updateLeaveStatus, refreshLeaves };
};

export default useLeave;
