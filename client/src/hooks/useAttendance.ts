import { useHRMS } from "./useHRMS.ts";

export const useAttendance = () => {
  const { attendanceLogs, checkIn, checkOut, submitManualAttendance, refreshAttendance } = useHRMS();
  return { attendanceLogs, checkIn, checkOut, submitManualAttendance, refreshAttendance };
};

export default useAttendance;
