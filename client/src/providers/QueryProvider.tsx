import React, { ReactNode } from "react";

export const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default QueryProvider;
