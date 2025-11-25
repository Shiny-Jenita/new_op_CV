"use client";

import { FC, useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useProfileStore } from "@/stores/profileData/profileStore";
import HeaderSidebar from "./headerSideBar";
import { getUserSubscription } from "@/api/settings/subscriptions";

const Header: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profileData } = useProfileStore();
  const { firstName, lastName, currentTitle, profileImage, userId } = profileData;
  const initials =
    firstName && lastName
      ? (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
      : firstName
      ? firstName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";
  const [imgError, setImgError] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const fullName = (firstName + " " + lastName).trim();
  const displayName =
    fullName.length > 20 ? fullName.slice(0, 17) + "..." : fullName;
  const [tokens, setTokens] = useState<number>(0);
  const [tokensLoading, setTokensLoading] = useState<boolean>(true);
  const [tokensError, setTokensError] = useState<string | null>(null);

 useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    const fetchTokens = async () => {
      if (!isMounted) return;
      setTokensLoading(true);
      try {
        const resp = await getUserSubscription(userId);
        if (isMounted) {
          setTokens(resp.data.totalTokens);
          setTokensError(null);
        }
      } catch (err) {
        console.error("Failed to load tokens", err);
        if (isMounted) setTokensError("Failed to load tokens");
      } finally {
        if (isMounted) setTokensLoading(false);
      }
    };
    fetchTokens();
    const interval = setInterval(fetchTokens, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  return (
    <div className="relative">
      <header className="flex items-center justify-end p-4 h-16">
        <div
          className="flex items-center space-x-3 relative cursor-pointer"
          onClick={toggleSidebar}
        >
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-sky-700 to-blue-800 p-[5px] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-blue-100 overflow-hidden relative">
              {profileImage && !imgError ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-sky-700 font-bold text-2xl">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <p className="font-bold text-black text-sm truncate">
              {displayName}
            </p>
            <p className="text-gray-500 text-xs truncate">{currentTitle}</p>
            <div className="text-sky-700 font-semibold text-[11px]">
              Tokens:{" "}
               {tokensError ? (
                <span className="text-red-500">{tokensError}</span>
              ) : (
                <span className="font-bold">{tokens}</span>
              )}
            </div>
          </div>

          <div className="ml-2">
            {isSidebarOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </div>
      </header>

      <HeaderSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Header;
