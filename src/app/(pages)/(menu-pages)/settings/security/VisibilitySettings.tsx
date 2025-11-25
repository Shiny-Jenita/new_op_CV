"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { getProfile,updateProfile } from "@/api/profile";
import type { IProfileResponse } from "@/api/profile/interface";
import { ShieldCheck } from "lucide-react";

export default function VisibilitySettings() {
  const [visibility, setVisibility] = useState({
    email: true,
    phone: true,
    address: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const result: IProfileResponse = await getProfile();
  
        if (result.success) {
          const vis = result.data.visibility ?? {
            email: true,
            phone: true,
            address: true,
          };
  
          const { email, phone, address } = vis;
          setVisibility({ email, phone, address });
        } else {
          console.error("Failed to fetch profile:", result.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);
  

  const handleToggle = async (key: keyof typeof visibility, value: boolean) => {
    const updatedVisibility = { ...visibility, [key]: value };
    setVisibility(updatedVisibility);

    try {
      const payload = { visibility: updatedVisibility };
      const result = await updateProfile(payload);
      if (!result.success) {
        console.error("Failed to update visibility:", result.message);
        // optionally revert local state on failure:
        // setVisibility(visibility);
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      // optionally revert local state on exception:
      // setVisibility(visibility);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="h-6 w-6 text-sky-700" />
        <h2 className="text-lg font-semibold text-sky-700">
          Show/Hide Personal Information
        </h2>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 mb-6">
        Control what personal details are visible when sharing your profile.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <svg
            className="h-4 w-4 animate-spin text-sky-600"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>Loading preferences...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {[
            { label: "Email", key: "email" as const },
            { label: "Phone Number", key: "phone" as const },
            { label: "Address", key: "address" as const },
          ].map(({ label, key }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all"
            >
              <span className="text-gray-700 font-medium">{label}</span>
              <Switch
                checked={visibility[key]}
                onCheckedChange={(val) => handleToggle(key, val)}
                aria-label={`Toggle visibility for ${label}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
