import React, { ReactNode } from "react";

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default ToastProvider;
