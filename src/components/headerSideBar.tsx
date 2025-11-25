"use client";

import React, { FC, useRef, useEffect, useState } from "react";
import { ChevronRight, Settings, LogOut, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/authStore";
import { useProfileStore } from "@/stores/profileData/profileStore";
import { ShareProfile } from "./settings/ShareProfile";

interface HeaderSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const HeaderSidebar: FC<HeaderSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { profileData } = useProfileStore();
  const { profileImage, firstName, lastName } = profileData;
  const [isShareOpen, setIsShareOpen] = useState(false);

  const initials = firstName && lastName
    ? firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
    : "";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navigateToSettings = () => {
    router.push("/settings/manage-subscription");
  };

  const navigateToProfile = () => {
    router.push(`/my-profile`);
  };

  const handleShareClick = () => {
    setIsShareOpen(true);
  };

  const handleShareClose = () => {
    setIsShareOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-share-popup]')
      ) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        ref={sidebarRef} 
        className="absolute right-4 top-16 w-64 bg-white rounded-lg shadow-lg z-[100]"
      >
        <div className="py-2">
          {/* Header with user info */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
            <div className="relative w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-4 border-sky-700">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <span className="text-sky-700 font-semibold text-lg">{initials}</span>
              )}
            </div>
            <div className="flex-1">
              <div 
                className="text-gray-800 font-medium flex items-center cursor-pointer"
                onClick={navigateToProfile}
              >
                {firstName} {lastName}
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button 
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={navigateToSettings}
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </button>

            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={handleShareClick}
              data-share-button
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Profile
            </button>
            
            <button 
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Share Profile Popup */}
      <div data-share-popup>
        <ShareProfile isOpen={isShareOpen} onClose={handleShareClose} />
      </div>
    </>
  );
};

export default HeaderSidebar;
