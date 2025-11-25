"use client";

import { useState, useEffect, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SettingsLayout from "@/components/settings/SettingsLayout";
import SupportSuccessPopup from "@/components/settings/SupportSuccesPopup";
import { sendSupportMessage } from "@/api/settings";
import type { SupportFormData } from "@/api/settings/interface";

const HelpAndSupport: React.FC = () => {
  const [email, setEmail] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const profileStorage = localStorage.getItem("profile-storage");
    if (profileStorage) {
      try {
        const parsedOnce = JSON.parse(profileStorage);
        const parsedTwice =
          typeof parsedOnce === "string" ? JSON.parse(parsedOnce) : parsedOnce;
        const emailFromStorage = parsedTwice?.state?.profileData?.email;
        if (emailFromStorage) setEmail(emailFromStorage);
      } catch (err) {
        console.error("Failed to parse profile-storage:", err);
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const rawRequestType = (
      form.elements.namedItem("requestType") as RadioNodeList
    ).value;

    const formData: SupportFormData = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      email,
      requestType: rawRequestType.trim().toLowerCase().split(/\s+/).join("-"),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const accessToken = localStorage.getItem("accessToken") || "";

    try {
      const { success, message } = await sendSupportMessage(formData, accessToken);
      if (!success) throw new Error(message || "Failed to send message");

      form.reset();
      setShowSuccessPopup(true);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError("Error sending message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showSuccessPopup && (
        <SupportSuccessPopup onClose={() => setShowSuccessPopup(false)} />
      )}

      <SettingsLayout>
        <div className="space-y-4 max-w-xl h-[80vh] overflow-y-auto p-4">
          <h2 className="text-2xl font-semibold text-sky-700">Help & Support</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="first-name"
                    name="firstName"
                    type="text"
                    required
                    className="bg-gray-100 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="last-name"
                    name="lastName"
                    type="text"
                    required
                    className="bg-gray-100 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Request Type</h3>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center text-sm font-medium text-gray-700">
                  <input type="radio" name="requestType" value="Support" defaultChecked className="mr-2" />
                  Support
                </label>
                <label className="inline-flex items-center text-sm font-medium text-gray-700">
                  <input type="radio" name="requestType" value="Feature Request" className="mr-2" />
                  Feature Request
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500">This is your account email and cannot be changed.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Type your message below. Our team will get back to you within 48 hours.
                <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="message"
                name="message"
                className="bg-gray-100 focus:ring-2 focus:ring-sky-500"
                rows={5}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md w-full"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>

            {error && <p className="text-center text-sm text-red-600">{error}</p>}
          </form>
        </div>
      </SettingsLayout>
    </>
  );
};

export default HelpAndSupport;
