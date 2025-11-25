"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CardOption from "@/components/ui/cardOption";
import { useProfileStore } from "@/stores/profileData/profileStore";
import { useJDStore } from "@/stores/resume/jdStore";
import { useResumeStore } from "@/stores/resume/resumeStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BuildFromJd = () => {
  const [profile, setProfile] = useState(true);
  const [showErrors, setShowErrors] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // ← guard flag

  const router = useRouter();
  const profileData = useProfileStore((state) => state.profileData);
  const { generateResumeFromProfile } = useResumeStore((state) => state);
  const { setJobDetails } = useJDStore();

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobDetails, setLocalJobDetails] = useState<any>(null);

  const handleProceed = () => {
    setShowErrors(true);
    if (!jobTitle.trim() || !jobDescription.trim()) return;
    const payload = { jobTitle, companyName, jobDescription };
    setJobDetails(payload);
    setLocalJobDetails(payload);
    setProfile(false);
  };

  const handleGenerateFromProfile = async () => {
    if (isGenerating) return;           // ← prevent double-fire
    setIsGenerating(true);

    if (!jobDetails) {
      toast.error("Please complete the job description form first.");
      setIsGenerating(false);
      return;
    }

    try {
      const response = await generateResumeFromProfile({
        job_description: jobDetails.jobDescription,
      });

      if (typeof response === "string") {
        toast.error(response);
        setIsGenerating(false);
        return;
      }

      router.push("/resume-generation/generate-from-profile");
    } catch (err) {
      console.error("Generation failed:", err);
      toast.error("Unexpected error occurred while generating resume.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto">
      <ToastContainer />

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-[85vh]">
        <div className="flex items-center mb-6">
          <h3 className="text-xl font-bold text-sky-700">
            Optimize For Job Description
          </h3>
          <div className="flex-1 border-t-2 border-sky-700 ml-4" />
        </div>

        {profile ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-gray-600 font-medium text-sm">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <Input
                  className="mt-1 bg-white text-gray-700 h-12"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                {showErrors && !jobTitle.trim() && (
                  <p className="text-red-500 text-sm mt-1">
                    Job Title is required.
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-600 font-medium text-sm">
                  Company Name
                </label>
                <Input
                  className="mt-1 bg-white text-gray-700 h-12"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-600 font-medium text-sm">
                Job Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                className="mt-1 bg-white text-gray-700 h-[220px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              {showErrors && !jobDescription.trim() && (
                <p className="text-red-500 text-sm mt-1">
                  Job Description is required.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleProceed}
                className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md"
              >
                Proceed
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <CardOption
              title="Generate From Profile"
              description="Our AI crafts a tailored resume by aligning your profile with targeted job requirements."
              onClick={handleGenerateFromProfile}
              disabled={isGenerating} 
            />
            <CardOption
              title="Start from Saved Resume"
              description="Our AI crafts a tailored resume by aligning your previously saved resume with targeted job requirements."
              onClick={() => {
                setJobDetails(jobDetails);
                router.push("/my-profile?tab=generated-resumes");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildFromJd;
