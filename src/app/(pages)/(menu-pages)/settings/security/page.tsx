"use client";

import SettingsLayout from "@/components/settings/SettingsLayout";
import PasswordUpdateForm from "./PasswordUpdateForm"; 
import VisibilitySettings from "./VisibilitySettings";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import clsx from "clsx";

type TabKey = "update-password" | "visibility-settings";
const ALL_TABS: TabKey[] = ["update-password", "visibility-settings"];

function normalizeTab(raw: string | null): TabKey | null {
  if (!raw) return null;
  const key = raw
    .toLowerCase()
    .replace(/\s+/g, "-")      
    .replace(/_/g, "-")         
    .replace(/[^a-z0-9-]/g, ""); 
  return ALL_TABS.includes(key as TabKey) ? (key as TabKey) : null;
}

const SettingsTabs: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initial = normalizeTab(searchParams.get("tab")) || "update-password";
  const [activeTab, setActiveTab] = useState<TabKey>(initial);

  useEffect(() => {
    const tab = normalizeTab(searchParams.get("tab"));
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabClick = (tab: TabKey) => {
    setActiveTab(tab);
    router.replace(`/settings/security?tab=${encodeURIComponent(tab)}`);
  };

  return (
    <SettingsLayout>
      <div className="max-w-full mx-auto">
        <div className="flex border-b">
          {ALL_TABS.map((tab) => (
            <button
              key={tab}
              className={clsx(
                "text-sx font-semibold px-4 pb-1 transition-all text-center w-full sm:w-auto",
                activeTab === tab
                  ? "border-b-2 border-sky-700 text-sky-700"
                  : "text-gray-600"
              )}
              onClick={() => handleTabClick(tab)}
            >
              {tab === "update-password" ? "Update Password" : "Visibility Settings"}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto p-4" style={{ height: "auto" }}>
          {activeTab === "update-password" ? (
            <PasswordUpdateForm />
          ) : (
            <VisibilitySettings />
          )}
        </div>
      </div>
    </SettingsLayout>
  );
};

export default SettingsTabs;
