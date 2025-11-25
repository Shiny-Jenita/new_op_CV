"use client";

import SettingsSidebar from "./SettingsSidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = pathname.split("/").pop()?.replace("-", " ") ?? "";

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
     
      <div className="bg-white px-6 py-4 border-b shadow-sm flex justify-between items-center">
      
        <div className="flex items-center space-x-2 text-sky-700 font-semibold text-lg">
          <span className="text-sky-700 font-semibold">Settings</span>
          <span className="mx-1 text-gray-400"> &gt; </span>
          <span className="text-sky-700 font-semibold capitalize">{currentPage}</span>
        </div>
      </div>
      <div className="flex flex-1">
        <SettingsSidebar />
        <main className="flex-1">
          <div className="bg-white min-h-screen p-2">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;
