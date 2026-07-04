import { useContext } from "react";
import { HRMSContext } from "../context/HRMSContext.tsx";

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (context === undefined) {
    throw new Error("useHRMS must be used within an HRMSProvider");
  }
  return context;
};

export default useHRMS;
