import React, { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.ts";

export const RoleGate: React.FC<{ children: ReactNode; allowedRoles: string[]; fallback?: ReactNode }> = ({ children, allowedRoles, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGate;
