"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, FC, useEffect } from "react";
import Image from "next/image";
import { NavItem } from "@/app/interfaces";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, User, FileText, Save, Send } from "lucide-react";

const navItems: { name: string; href: string; Icon: FC<any> }[] = [
  {
    name: "My Profile",
    href: "/my-profile",
    Icon: User,
  },
  {
    name: "Resume Generation",
    href: "/resume-generation",
    Icon: FileText,
  },
  {
    name: "Saved Resumes",
    href: "/my-profile?tab=generated-resumes",
    Icon: Save,
  },
  {
    name: "Refer a Friend",
    href: "/refer-friend",
    Icon: Send,
  },
];

const Sidebar: FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isIconsOnly, setIsIconsOnly] = useState(false);
  useEffect(() => {
    const autoCollapseRoutes = [
      "/resume-editor",
      "/resume-generation/generate-from-profile",
      "/resume-generation/pick-preview",
    ];
    const shouldCollapse = autoCollapseRoutes.some((route) => pathname.startsWith(route));
    setIsIconsOnly(shouldCollapse);
  }, [pathname]);

  return (
    <div
      className={`relative h-screen bg-white border-r border-gray-200 shadow-md transition-all duration-300 ${
        isIconsOnly ? "w-20" : "w-64"
      }`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsIconsOnly((prev) => !prev)}
              className="absolute top-3 right-[-12px] bg-white border border-gray-300 shadow-sm rounded-full p-1 hover:bg-gray-100 transition z-50"
              aria-label="Toggle sidebar"
            >
              {isIconsOnly ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-sm">
            {isIconsOnly ? "Expand menu" : "Collapse menu"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex justify-center mt-2 mb-4 px-2">
        <Image
          src={isIconsOnly ? "/logoicon.svg" : "/logo.svg"}
          alt="Optimised CV Logo"
          width={isIconsOnly ? 50 : 210}
          height={isIconsOnly ? 60 : 60}
          className="object-contain"
        />
      </div>
      <TooltipProvider delayDuration={50}>
        <nav className="flex flex-col space-y-2 px-3 mt-6">
          {navItems.map(({ name, href, Icon }) => {
            let isActive = false;

            if (name === "Saved Resumes") {
              isActive = pathname === "/my-profile" && tab === "generated-resumes";
            } else if (name === "My Profile") {
              isActive = pathname === "/my-profile" && tab !== "generated-resumes";
            } else {
              isActive = pathname.startsWith(href);
            }
            return (
              <Link key={name} href={href}>
                <Tooltip open={hoveredItem === name}>
                  <TooltipTrigger asChild>
                    <div
                      className={`group flex items-center ${
                        isIconsOnly ? "justify-center" : "space-x-3"
                      } p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-sky-700 to-blue-800 text-white shadow-md"
                          : "text-gray-600 hover:bg-gradient-to-r hover:from-sky-700 hover:to-blue-800 hover:text-white hover:opacity-80"
                      }`}
                      onMouseEnter={() => setHoveredItem(name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-md">
                        <Icon
                          size={25}
                          className={`transition-colors duration-200 ${
                            isActive ? "text-yellow-300" : "text-gray-600"
                          } group-hover:text-yellow-300`}
                        />
                      </div>
                      {!isIconsOnly && <span className="text-sm font-semibold">{name}</span>}
                    </div>
                  </TooltipTrigger>
                  {isIconsOnly && (
                    <TooltipContent
                      side="right"
                      className="bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg"
                    >
                      <span>{name}</span>
                    </TooltipContent>
                  )}
                </Tooltip>
              </Link>
            );
          })}
        </nav>
      </TooltipProvider>
    </div>
  );
};

export default Sidebar;
