"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Phone, MapPin, Send, AlertCircle } from "lucide-react";
import Image from "next/image";
import { getProfile } from "@/api/profile";
import { shareProfile } from "@/api/settings/shareprofile";
import type {
  ShareProfileProps,
  ProfileData,
  VisibilitySettings,
  ShareProfilePayload,
} from "@/api/settings/shareprofile/interface";
import { ConfirmModal } from "./ConfirmModal";
import { SuccessModal } from "./SuccessModal";

function maskValue(val: string): string {
  if (val.length <= 5) return "*".repeat(val.length);
  const first = val.slice(0, 2);
  const last = val.slice(-3);
  const middleMask = "*".repeat(val.length - 5);
  return `${first}${middleMask}${last}`;
}

// Create a local state type that omits `address` and adds `city` + `state`
type LocalProfile = Omit<ProfileData, "address"> & {
  city: string;
  state: string;
};

export const ShareProfile: React.FC<ShareProfileProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const [profile, setProfile] = useState<LocalProfile>({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
  });

  const [visibility, setVisibility] = useState<VisibilitySettings>({
    email: true,
    phone: true,
    address: true, // we still call it `address` in visibility settings
  });
  const [recipient, setRecipient] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Your Name";

  // Load local storage profile
  useEffect(() => {
    const raw = localStorage.getItem("profile-storage");
    if (!raw) return;
    try {
      const once = JSON.parse(raw);
      const twice = typeof once === "string" ? JSON.parse(once) : once;
      const pd = twice.state?.profileData;
      setProfile({
        userId: pd?.userId || "",
        firstName: pd?.firstName || "",
        lastName: pd?.lastName || "",
        email: pd?.email || "",
        phone: pd?.phone || "",
        city: pd?.city || "",
        state: pd?.state || "",
      });
    } catch {
      console.error("Failed to parse profile-storage");
    }
  }, []);

  // Fetch visibility settings when modal opens
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await getProfile();
        if (!res.success) throw new Error(res.message);
        const vis = res.data.visibility;
        setVisibility({
          email: vis?.email ?? true,
          phone: vis?.phone ?? true,
          address: vis?.address ?? true,
        });
      } catch (err) {
        console.error("Failed to load visibility:", err);
      }
    })();
  }, [isOpen]);

  // Combine city & state into one string
  const locationValue = [profile.city, profile.state].filter(Boolean).join(", ");

  const fields = [
    { key: "email" as const, label: "Email", value: profile.email, icon: <Mail className="w-4 h-4" /> },
    { key: "phone" as const, label: "Phone Number", value: profile.phone, icon: <Phone className="w-4 h-4" /> },
    { key: "address" as const, label: "City & State", value: locationValue, icon: <MapPin className="w-4 h-4" /> },
  ];

  const handleSend = async () => {
    const { userId } = profile;
    if (!userId) return console.error("Missing userId");
    const payload: ShareProfilePayload = { userId, recipientEmail: recipient };
    try {
      const res = await shareProfile(payload);
      if (!res.success) throw new Error(res.message);
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      console.error("Failed to share profile:", err);
    }
  };

  const onSendClick = () => {
    if (recipient) setShowConfirm(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
        <div className="relative w-full sm:max-w-xl lg:max-w-4xl max-h-[75vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-6">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="mb-6 text-xl font-bold text-sky-700">Share Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
            <div className="overflow-auto rounded-lg border border-gray-300 bg-gray-50 p-4">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-sky-50 shadow-sm">
                <div className="p-4 text-center">
                  <Image src="/logo.svg" alt="Logo" width={250} height={80} className="mx-auto" />
                </div>
                <div className="p-4 bg-white max-h-[40vh] overflow-y-auto">
                  <p className="text-slate-600 mb-1 text-sm">
                    {fullName}  has shared their Optimized CV profile with you, showcasing their professional experience and accomplishments.
                  </p>

                  <p className="text-slate-600 mb-1 text-sm mt-8">
                  You can view their profile here: [personalized link]
                  </p>

                  <p className="text-slate-600 mb-1 text-sm mt-8">
                  Interested in creating your own Optimized CV profile? Get started now. [Link to landing page].
                  </p>

                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="mb-1">You’re sharing your Optimized CV profile. The following information may be visible to viewers:</p>
              <ul className="list-disc list-inside pl-1 text-gray-700">
                <li>Email</li>
                <li>Phone Number</li>
                <li>Location</li>
              </ul>              

              <p>
                Be sure to check your {" "}
                <button
                  className="text-sky-700 underline hover:text-sky-900"
                  onClick={() => {
                    onClose();
                    router.push("/settings/security?tab=visibility-settings");
                  }}
                >
                  privacy settings
                </button>{" "}
                prior to sharing your profile.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-700">Recipient Email</label>
                  <input
                    type="email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
                  />
                </div>
                <button
                  onClick={onSendClick}
                  disabled={!recipient}
                  className="flex w-full items-center justify-center gap-2 transition disabled:opacity-50 
                  bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 rounded-full shadow-md px-4 py-2"
                >
                  <Send className="w-4 h-4" /> SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSend}
      />

      <SuccessModal isOpen={showSuccess} onClose={closeSuccess} />
    </>
  );
};
