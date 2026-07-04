import React from "react";

interface AvatarProps {
  src?: string;
  fallback: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, className = "" }) => {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-50 ${className}`}>
      {src ? (
        <img src={src} alt={fallback} className="aspect-square h-full w-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 font-display">
          {fallback.substring(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
