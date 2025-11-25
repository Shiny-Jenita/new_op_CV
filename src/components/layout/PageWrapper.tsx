"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "../header";
import Sidebar from "../sidebar";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (/^\/profile\/[^/]+$/.test(pathname)) {
  return <>{children}</>;
}

if (/^\/resume\/[^/]+$/.test(pathname)) {
  return <>{children}</>;
}

  return (
    <div className="flex min-h-screen bg-gray-100 w-screen">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300`}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main
          className={`p-4 transition-all duration-300 ${
            isSidebarOpen ? "mr-72" : "mr-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
