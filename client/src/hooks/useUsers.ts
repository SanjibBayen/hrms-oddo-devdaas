import { useHRMS } from "./useHRMS.ts";

export const useUsers = () => {
  const { employees, addEmployee, updateEmployee, deactivateEmployee, refreshEmployees } = useHRMS();
  return { employees, addEmployee, updateEmployee, deactivateEmployee, refreshEmployees };
};

export default useUsers;
