import React, { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "brand";
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "neutral", className = "", ...props }) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-800 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    info: "bg-sky-50 text-sky-700 border-sky-100",
    brand: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-semibold font-display rounded-full border ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
