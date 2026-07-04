import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = "", ...props }) => {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-xl shadow-2xs transition-all duration-350 ${
        hoverable ? "hover:shadow-sm hover:border-[#CBD5E1]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => {
  return (
    <div className={`px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`text-sm font-bold font-display text-[#0F172A] tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => {
  return (
    <div className={`px-5 py-3.5 border-t border-[#E2E8F0] bg-slate-50/30 flex items-center justify-end gap-2 rounded-b-xl ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
