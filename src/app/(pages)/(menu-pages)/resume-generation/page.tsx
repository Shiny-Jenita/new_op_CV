"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CardOption from "@/components/ui/cardOption";
import ProfilesForm from "@/app/(pages)/create-new-profile/ProfileCreationForm/ProfileForm";

const ResumeGeneration = () => {
  const router = useRouter();

  const [showProfileForm, setShowProfileForm] = useState(false);

  const handleCreateManually = () => {
    setShowProfileForm(true);
  };

  const handleCloseProfileForm = () => {
    setShowProfileForm(false);
  };

  return (
    <div className="relative w-full h-screen ">
      <div
        className={`p-4 m-4 rounded-xl bg-white shadow-lg border border-gray-200 transition-all duration-200 
          ${showProfileForm ? "blur-sm" : ""}
        `}
      >
        <div className="flex items-center mb-6">
          <h3 className="text-xl font-bold text-sky-700">Resume Generation</h3>
          <div className="flex-1 border-t-2 border-sky-700 ml-4"></div>
        </div>

        <div className="space-y-4">
          <CardOption
            title="Generate From Profile"
            description="Get an AI-powered resume instantly using your existing profile data."
            onClick={() => router.push("/resume-generation/pick-preview")}
          />
          <CardOption
            title="Create Manually"
            description="Build your resume step by step by inputting your experience and achievements."
            onClick={handleCreateManually}
          />
          <CardOption
            title="Optimize For Job Description"
            description="Customize your saved resume or profile to match specific job requirements."
            onClick={() => router.push("/resume-generation/build-from-jd")}
          />
        </div>
      </div>

      {showProfileForm && (
        <div className="fixed inset-0 z-50 flex justify-end ">
          <div
            className="absolute inset-0 bg-black bg-opacity-30 "
            onClick={handleCloseProfileForm}
          />
          <div
            className="
              relative
              w-[700px]  /* Adjust width as needed, e.g. w-1/3, max-w-md, etc. */
              h-full
              bg-white
              shadow-xl
              transition-transform
              duration-300
              flex flex-col
            "
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={handleCloseProfileForm}
            >
              ✕
            </button>

            <div className="flex-1 overflow-y-auto ">
              <ProfilesForm isEditForm={true} isCreateForm={true} onClose={handleCloseProfileForm} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeGeneration;
