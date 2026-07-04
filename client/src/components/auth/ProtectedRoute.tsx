import React, { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.ts";

export const ProtectedRoute: React.FC<{ children: ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <div className="p-8 text-center text-slate-500 font-sans">Access Denied. Please log in first.</div>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="p-8 text-center text-rose-500 font-sans">Unauthorized to view this portal.</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
