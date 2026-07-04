import React, { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.ts";

export const AuthGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] font-sans">
        <p className="text-slate-500 text-sm">Please log in to continue.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
