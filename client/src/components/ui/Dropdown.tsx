import React, { useState } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white p-1.5 shadow-md ring-1 ring-black/5 z-40 focus:outline-hidden">
            <div onClick={() => setIsOpen(false)}>{children}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
