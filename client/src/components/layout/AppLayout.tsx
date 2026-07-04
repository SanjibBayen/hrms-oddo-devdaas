import React, { ReactNode } from "react";

interface AppLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ sidebar, header, children }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      {sidebar}
      <div className="flex-1 flex flex-col lg:pl-68 pt-16 lg:pt-0">
        {header}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
