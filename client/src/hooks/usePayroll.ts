import { useHRMS } from "./useHRMS.ts";

export const usePayroll = () => {
  const { payrolls, calculatePayroll, processPayrollPayment, refreshPayrolls } = useHRMS();
  return { payrolls, calculatePayroll, processPayrollPayment, refreshPayrolls };
};

export default usePayroll;
