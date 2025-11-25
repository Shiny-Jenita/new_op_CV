"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail, MapPin, Phone, Pencil, Save, X, NotepadText,
  BriefcaseBusiness, University, FolderDot, ScrollText,
  BookCheck, Languages, Edit2Icon, Camera,
  Loader2
} from "lucide-react";
import AccordionSection from "@/components/my-profile/accordion";
import EducationSection from "@/components/my-profile/education-section";
import ExperienceSection from "@/components/my-profile/experience-section";
import LanguageSection from "@/components/my-profile/language-section";
import ProjectSection from "@/components/my-profile/project-section";
import PublicationSection from "@/components/my-profile/publication-section";
import CertificationSection from "@/components/my-profile/certification-section";
import PlaceholderCard from "@/components/ui/placeholderCard";
import GeneratedResumes from "./GeneratedResumes";
import BasicInfoFormWithProvider from "../../create-new-profile/ProfileCreationForm/forms/providers/BasicInfoFormProvider";
import ProjectFormWithProvider from "../../create-new-profile/ProfileCreationForm/forms/providers/ProjectProvider";
import PublicationFormWithProvider from "../../create-new-profile/ProfileCreationForm/forms/providers/PublicationProvider";
import CertificationFormWithProvider from "../../create-new-profile/ProfileCreationForm/forms/providers/CertificationProvider";
import ExperienceFormWithProvider from "../../create-new-profile/ProfileCreationForm/forms/providers/ExperienceProvider";
import EducationFormWithProvider from "../../create-new-profile/ProfileCreationForm/forms/providers/EducationProvider";
import LanguagesProvider from "../../create-new-profile/ProfileCreationForm/forms/providers/LanguagesProvider";
import { useProfileStore } from "@/stores/profileData/profileStore";
import { uploadProfileImage } from "@/api/profile";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdWeb } from "react-icons/md";
import { enhanceSummary } from "@/api/resume";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

type FormVisibility = {
  profile: boolean;
  project: boolean;
  publication: boolean;
  certification: boolean;
  education: boolean;
  experience: boolean;
  languages: boolean;
};

type ActiveTab = "profile" | "generated";

const FormModal = ({
  isOpen,
  onClose,
  title,
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30">
      <div className="relative w-[700px] h-full bg-white shadow-xl flex flex-col">
        <div className="sticky top-0 z-10">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="text-2xl p-4 pb-2 font-semibold text-sky-700 ml-2">{title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          {children}
        </div>
      </div>

    </div>
  );
};


interface ProfileSummaryProps {
  summary: string;
  updateProfileData: (data: any) => Promise<void>;
  profileId: string;
}

export const ProfileSummary = ({
  summary,
  updateProfileData,
  profileId,
}: ProfileSummaryProps) => {
  const initialSummary = summary || "";
  const [isEditing, setIsEditing] = useState(false);
  const [summaryText, setSummaryText] = useState(initialSummary);
  const [temporarySummary, setTemporarySummary] = useState(initialSummary);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  useEffect(() => {
    setSummaryText(initialSummary);
    setTemporarySummary(initialSummary);
  }, [initialSummary]);

  const sentences = useMemo(
    () => summaryText.split(".").map(s => s.trim()).filter(Boolean),
    [summaryText]
  );

  const save = async () => {
    setSummaryText(temporarySummary);
    setIsEditing(false);
    setError("");
    await updateProfileData({ summary: temporarySummary });
  };

  const cancel = () => {
    setTemporarySummary(summaryText);
    setIsEditing(false);
    setError("");
  };

const handleEnhanceSummary = async () => {
  
  setIsEnhancing(true);
  setError("");

  try {
    const response = await enhanceSummary();
    const enhancedSummary = response?.data?.enhanced_summary;
    if (enhancedSummary) {
      setTemporarySummary(enhancedSummary);
      setSummaryText(enhancedSummary);
      await updateProfileData({ summary: enhancedSummary });
      
      setIsEditing(false); 
    } else {
      setError("No summary returned from AI.");
    }
  } catch (err) {
    console.error("Error enhancing summary", err);
    setError("Failed to enhance summary.");
  } finally {
    setIsEnhancing(false);
  }
};

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-sky-700">Summary</h3>
        <div className="flex items-center gap-2">
          {/* <button onClick={handleEnhanceSummary} disabled={isEnhancing}>
            {isEnhancing ? (
              <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
            ) : (
              <Image
                src="/aiStar.svg"
                alt="AI Suggestions"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            )}
          </button> */}
          <Tippy content="Use AI to create your summary" placement="top">
            <button onClick={handleEnhanceSummary} disabled={isEnhancing}>
              {isEnhancing ? (
                <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
              ) : (
                <Image
                  src="/aiStar.svg"
                  alt="AI Suggestions"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              )}
            </button>
          </Tippy>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg shadow-md border border-sky-700 flex items-center hover:bg-gray-100 transition-colors"
            >
              <Pencil className="w-4 h-4 text-sky-700" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={save}
                className="p-2 rounded-lg shadow-md border border-sky-700 flex items-center hover:bg-gray-100 text-sky-700 transition-colors"
              >
                <Save className="w-4 h-4 text-sky-700" />
              </button>
              <button
                onClick={cancel}
                className="p-2 rounded-lg shadow-md border border-gray-500 flex items-center hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4">
          <textarea
            value={temporarySummary}
            onChange={(e) => setTemporarySummary(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
            rows={6}
            placeholder="Describe your professional background, skills, and experience..."
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="mt-4">
          {summaryText.trim() ? (
            <>
              <p className="text-gray-700 whitespace-normal break-words">
                {expanded || sentences.length <= 3
                  ? summaryText
                  : `${sentences.slice(0, 3).join(". ")}...`}
              </p>
              {sentences.length > 3 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-sky-700 font-semibold hover:text-sky-800 transition-colors"
                >
                  {expanded ? "view less" : "view more"}
                </button>
              )}
            </>
          ) : (
            <PlaceholderCard
              Icon={NotepadText}
              title="No Summary Available"
              description="Add summary or generate using AI."
            />
          )}
        </div>
      )}
    </div>
  );
};


export default function MyProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profileData, updateProfileData, fetchProfileData } = useProfileStore(state => state);
  const {
    firstName,
    lastName,
    currentTitle,
    state: userState,
    country,
    email,
    phone,
    experience,
    education,
    languages,
    summary,
    projects,
    certifications,
    publications,
    profileImage,
    dob,
    address,
    city,
    zipcode,
    industry,
    websites
  } = profileData;

  const initials = useMemo(() =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
    [firstName, lastName]
  );
  const [imgError, setImgError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [areAccordionsOpen, setAreAccordionsOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [temporaryPreview, setTemporaryPreview] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState("auto");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageOptionsRef = useRef<HTMLDivElement>(null);

  const name = `${firstName} ${lastName}`;

  const [formVisibility, setFormVisibility] = useState<FormVisibility>({
    profile: false,
    project: false,
    publication: false,
    certification: false,
    education: false,
    experience: false,
    languages: false
  });

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    tabParam === "generated-resumes" ? "generated" : "profile"
  );

  const firstSite = websites && websites.length > 0 ? websites[0] : null;

  const siteMap: Record<string, { Icon: React.ComponentType; label: string }> = {
    linkedin: { Icon: FaLinkedin, label: firstSite?.url || '' },
    github: { Icon: FaGithub, label: firstSite?.url || '' },
    portfolio: { Icon: MdWeb, label: firstSite?.url || '' },
    other: { Icon: MdWeb, label: firstSite?.url || '' },
  };
  const siteInfo = firstSite ? (siteMap[firstSite.type] || siteMap.other) : null;

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  useEffect(() => {
    const updateHeight = () => setContentHeight(`${window.innerHeight - 150}px`);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    if (tabParam === "generated-resumes") {
      setActiveTab("generated");
    } else {
      setActiveTab("profile");
    }
  }, [tabParam]);
  const toggleForm = useCallback((formName: keyof FormVisibility) => {
    setFormVisibility(prev => ({
      ...prev,
      [formName]: !prev[formName]
    }));
  }, []);

  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setTemporaryPreview(previewUrl);
    setImgError(false);
    setIsUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadProfileImage(file);
      await updateProfileData({ profileImage: imageUrl });
      setTemporaryPreview(null);
    } catch (err) {
      console.error(err);
      setUploadError(err instanceof Error ? err.message : "Failed to upload");
      setTemporaryPreview(null);
    } finally {
      setIsUploading(false);
      setShowImageOptions(false);
    }
  }, [updateProfileData]);

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      setUploadError(null);
      await updateProfileData({ profileImage: "" });
      setImgError(false);
    } catch (err) {
      console.error("Error removing image:", err);
      setUploadError("Failed to remove image");
    } finally {
      setIsUploading(false);
      setShowImageOptions(false);
    }
  };

  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      if (
        imageOptionsRef.current &&
        !imageOptionsRef.current.contains(e.target as Node)
      ) {
        setShowImageOptions(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const hasMeaningfulData = (obj: Record<string, any>) => {
    return Object.values(obj).some(value => {
      if (typeof value === "string") return value.trim() !== "";
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    });
  };
  const filterMeaningfulEntries = (array?: Record<string, any>[]) => {
    return Array.isArray(array) ? array.filter(hasMeaningfulData) : [];
  };

  const hasMeaningfulExperienceData = (experience: Record<string, any>) => {
    const isTitleValid = experience.title?.trim() !== "";
    const isCompanyValid = experience.company?.trim() !== "";
    const isResponsibilitiesValid = experience.responsibilities?.some((res: string) => res.trim() !== "");
    const isSkillsValid = experience.skills?.length > 0;

    return isTitleValid && isCompanyValid && isResponsibilitiesValid && isSkillsValid;
  };
  const filterMeaningfulExperienceEntries = (experiences?: Record<string, any>[]) => {
    if (!Array.isArray(experiences)) return [];

    return experience.filter(experience => hasMeaningfulExperienceData(experience));
  };
  
  const handleTabChange = useCallback((tab: ActiveTab) => {
    const queryParam = tab === "profile" ? "" : "?tab=generated-resumes";
    router.push(`/my-profile${queryParam}`);
  }, [router]);

  const closeEducationModal = useCallback(() => {
    window.location.reload();
  }, [toggleForm, fetchProfileData]);
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-screen mx-auto">
        <div className="flex border-b">
          {["profile", "generated"].map(tab => (
            <button
              key={tab}
              className={clsx(
                "text-xl font-semibold px-4 pb-2 transition-all text-center w-[250px]",
                activeTab === tab ? "border-b-2 border-sky-700 text-sky-700" : "text-gray-600"
              )}
              onClick={() => handleTabChange(tab as ActiveTab)}
            >
              {tab === "profile" ? "Profile" : "Generated Resumes"}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto p-6" style={{ height: contentHeight }}>
          {activeTab === "profile" ? (
            <>
              <div className="w-full bg-[#2a6baa] rounded-lg max-h-[30vh] relative">
                <Image src="/bannerstar1.svg" alt="Banner Star" width={70} height={70} className="absolute top-[30%] right-[8%] z-0" />
                <Image src="/bannerstar2.svg" alt="Banner Star" width={80} height={80} className="absolute top-[-26%] right-[2%] z-0" />
                <Image src="/bannerstar2.svg" alt="Banner Star" width={60} height={60} className="absolute bottom-[10%] right-[1%] z-0" />
                <Image src="/bannerstar2.svg" alt="Banner Star" width={60} height={60} className="absolute top-[8%] right-[15%] z-0" />
                <Image src="/bannerstar2.svg" alt="Banner Star" width={80} height={80} className="absolute bottom-[-25%] right-[14%] z-0" />
                <button
                  type="button"
                  className="absolute top-2 right-2 p-2 rounded-md hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#427CAD" }}
                  onClick={() => toggleForm('profile')}
                >
                  <div className="w-5 h-5 relative text-yellow-400">
                    <Edit2Icon />
                  </div>
                </button>
                <div className="flex p-6">
                  <div className="flex-shrink-0 relative">
                    {profileImage && !imgError ? (
                      <div className="relative w-[22vh] h-[22vh] overflow-visible">
                        <Image
                          key={temporaryPreview ?? profileImage}
                          src={temporaryPreview || profileImage}
                          alt="Profile"
                          fill
                          unoptimized
                          className="rounded-full object-cover border-4 border-white"
                          onError={() => {
                            setImgError(true);
                            setTemporaryPreview(null);
                          }}
                        />
                        <div className="absolute bottom-0 right-0">
                          <button
                            className="bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition-colors"
                            onClick={() => setShowImageOptions((prev) => !prev)}
                          >
                            <Camera className="w-6 h-6 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-[22vh] w-[22vh] bg-[#d9e8f7] rounded-full overflow-visible">
                        <div className="flex items-center justify-center h-full">
                          <span className="text-7xl font-bold text-[#2a6baa]">{initials}</span>
                        </div>
                        <div className="absolute bottom-0 right-0">
                          <button
                            className="bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition-colors"
                            onClick={() => setShowImageOptions((prev) => !prev)}
                          >
                            <Camera className="w-6 h-6 text-gray-700" />
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={isUploading}
                          />
                        </div>
                      </div>
                    )}

                    {showImageOptions && (
                      <div
                        ref={imageOptionsRef}
                        className="min-w-max absolute top-1/2 left-full ml-2 transform -translate-y-1/2 bg-white shadow-md rounded-lg p-2 space-y-1 z-20"
                      >
                        {profileImage && !imgError ? (
                          <>
                            <label className="block cursor-pointer hover:bg-gray-100 p-2 rounded-md text-sm text-gray-700">
                              Change Image
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={isUploading}
                              />
                            </label>
                            <button
                              onClick={handleRemoveImage}
                              disabled={isUploading}
                              className="min-w-max w-full text-left text-sm text-red-600 hover:bg-gray-100 p-2 rounded-md"
                            >
                              Remove Image
                            </button>
                          </>
                        ) : (
                          <label className="block cursor-pointer hover:bg-gray-100 p-2 rounded-md text-sm text-gray-700">
                            Browse Image
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={handleImageChange}
                              disabled={isUploading}
                            />
                          </label>
                        )}

                        <p className="text-xs text-gray-500 px-2">
                          📌 Images over 5 MB cannot be uploaded.
                        </p>

                        {uploadError && (
                          <div className="text-red-500 text-xs text-center mt-1">
                            {uploadError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex ml-8 relative">
                    <div className="flex flex-col justify-center">
                      <h1 className="text-3xl font-bold text-white mb-4">{name}</h1>
                      <div className="flex flex-col">
                        <div className="flex items-center mb-2">
                          <div className="relative bg-white rounded-lg py-1.5 px-3 flex items-center">
                            <div className="absolute inset-y-0 left-0 w-12 bg-[#FFE458] rounded-l-lg"></div>
                            <div className="relative flex flex-col z-10">
                              {/* Briefcase + title */}
                              <div className="flex items-center">
                                <div className="p-1 mr-5">
                                  <Image src="/briefcase.svg" alt="Briefcase" width={20} height={20} />
                                </div>
                                <span className="text-[#425466] text-[18px] font-medium">
                                  {currentTitle}
                                </span>
                              </div>

                            </div>
                          </div>

                        </div>
                        {firstSite && firstSite.url?.trim() && siteInfo && (
                          <a
                            href={firstSite.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 flex items-center text-white hover:underline"
                          >
                            <siteInfo.Icon className="w-5 h-5 mr-1" />
                            <span className="text-sm">{siteInfo.label}</span>
                          </a>
                        )}

                      </div>

                    </div>

                    {/* Divider */}
                    <div className="h-full w-px mx-8 bg-gradient-to-b from-transparent via-white to-transparent" />

                    {/* Contact info */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center text-white mb-4">
                        <Mail className="h-5 w-5 mr-2" />
                        <span>{email}</span>
                      </div>
                      <div className="flex items-center text-white mb-4">
                        <Phone className="h-5 w-5 mr-2" />
                        <span>{phone}</span>
                      </div>
                      <div className="flex items-center text-white">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{city}, {userState}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Modals */}
              <FormModal
                isOpen={formVisibility.profile}
                onClose={() => toggleForm('profile')}
                title="Profile"
              >
                <BasicInfoFormWithProvider
                  existingData={{
                    firstName,
                    lastName,
                    email,
                    address,
                    city,
                    state: userState,
                    country,
                    zipcode,
                    phone,
                    currentTitle,
                    industry,
                    websites,
                  }}
                  onSave={(updated) => {
                    updateProfileData(updated);
                    toggleForm('profile');
                  }}
                  onCancel={() => toggleForm('profile')}
                />
              </FormModal>

              <div className="flex justify-end my-4">
                <button
                  onClick={() => setAreAccordionsOpen(prev => !prev)}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-sky-700 text-sky-700 hover:bg-sky-50 transition-colors"
                >
                  {areAccordionsOpen ? "Collapse All" : "Expand All"}
                </button>
              </div>

              {/* Summary Section */}
              <div className="my-4">
                <ProfileSummary summary={summary} updateProfileData={updateProfileData} />
              </div>
              
              {/* Work Experience Section */}
              <div className="mb-2">
                <AccordionSection key={`work-${areAccordionsOpen}`} title="Work Experience" defaultOpen={areAccordionsOpen}>
                  <div className="flex justify-between items-center w-full mb-2">
                    <span></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleForm('experience');
                      }}
                      className="p-2 rounded-lg shadow-md border border-sky-700 flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-sky-700" />
                    </button>
                  </div>

                  {experience && experience.length > 0 ? (
                    experience.map((job, i) => (
                      <ExperienceSection
                        key={i}
                        title={job.jobTitle}
                        company={job.companyName}
                        location={job.location}
                        period={`${job.startDate
                          ? new Date(job.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })
                          : "Unknown"} - ${job.currentlyWorking
                            ? "Present"
                            : job.endDate
                              ? new Date(job.endDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                              })
                              : "Unknown"
                          }`}
                        skills={job.skills}
                        description={job.responsibilities}
                        editable={false}
                      />
                    ))
                  ) : (
                    <PlaceholderCard
                      Icon={BriefcaseBusiness}
                      title="No Work Experience Listed"
                      description="Add work experience to showcase your skills."
                    />
                  )}
                </AccordionSection>

                <FormModal
                  isOpen={formVisibility.experience}
                  onClose={() => toggleForm('experience')}
                  title="Work Experience"
                >
                  <ExperienceFormWithProvider
                    existingExperiences={experience || []}
                    onSave={(updatedExperiences) => {
                      console.log("RECEIVED FROM FORM:", updatedExperiences);
                      if (updatedExperiences.length > 0) {
                        updateProfileData({ experience: updatedExperiences });
                        toggleForm('experience');
                      } else {
                        console.log("No experience data to save.");
                      }
                    }}
                    onCancel={() => toggleForm('experience')}
                  />

                </FormModal>

                <AccordionSection key={`education-${areAccordionsOpen}`} title="Education" defaultOpen={areAccordionsOpen}>
                  <div className="flex justify-between items-center w-full mb-2">
                    <span></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleForm('education');
                      }}
                      className="p-2 rounded-lg shadow-md border border-sky-700 flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-sky-700" />
                    </button>
                  </div>

                  {education && education.length > 0 ? (
                    education.map((edu, i) => (
                      <EducationSection
                        key={i}
                        major={edu.major}
                        level={edu.level}
                        university={edu.university}
                        specialization={edu.specialization}
                        location={edu.location}
                        startDate={edu.startDate}
                        endDate={edu.endDate}
                        currentlyEnrolled={edu.currentlyEnrolled}

                        gpa={edu.score.map((data, index) => data.value)}
                        editable={false}
                        description={edu.description}
                      />
                    ))
                  ) : (
                    <PlaceholderCard
                      Icon={University}
                      title="No Education Listed"
                      description="Add Education to showcase your achievements."
                    />
                  )}
                </AccordionSection>

                <FormModal
                  isOpen={formVisibility.education}
                  onClose={() => toggleForm('education')}
                  title="Education"
                >
                  <EducationFormWithProvider
                    existingEducation={education || []}
                    onSave={(updatedEducation) => {
                      const filteredEducation = filterMeaningfulEntries(updatedEducation);
                      updateProfileData({ education: filteredEducation });
                      // toggleForm('education');
                      closeEducationModal();
                    }}
                    onCancel={() => toggleForm('education')}
                  />

                </FormModal>

                {/* Projects Section */}
                <AccordionSection key={`projects-${areAccordionsOpen}`} title="Projects" defaultOpen={areAccordionsOpen}>
                  <div className="flex justify-between items-center w-full mb-2">
                    <span></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleForm('project');
                      }}
                      className="p-2 rounded-lg shadow-md border border-sky-700 flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-sky-700" />
                    </button>
                  </div>

                  {projects && projects.length > 0 ? (
                    projects.map((project, i) => (
                      <ProjectSection
                        key={i}
                        projectName={project.projectName}
                        projectUrl={project.projectUrl}
                        projectDescription={project.projectDescription}
                        editable={false}
                      />
                    ))
                  ) : (
                    <PlaceholderCard
                      Icon={FolderDot}
                      title="No Projects Listed"
                      description="Add Projects to showcase your skills."
                    />
                  )}
                </AccordionSection>

                <FormModal
                  isOpen={formVisibility.project}
                  onClose={() => toggleForm('project')}
                  title="Projects"
                >
                  <ProjectFormWithProvider
                    existingProjects={projects || []}
                    onSave={(updatedProjects) => {
                      const filteredProjects = filterMeaningfulEntries(updatedProjects);
                      updateProfileData({ projects: filteredProjects });
                      toggleForm('project');
                    }}
                    onCancel={() => toggleForm('project')}
                  />

                </FormModal>

                {/* Certifications Section */}
                <AccordionSection key={`certification-${areAccordionsOpen}`} title="Certifications" defaultOpen={areAccordionsOpen}>
                  <div className="flex justify-between items-center w-full mb-2">
                    <span></span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleForm('certification');
                      }}
                      className="p-2 rounded-lg shadow-md border border-sky-700 flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-sky-700" />
                    </button>
                  </div>

                  {certifications && certifications.length > 0 ? (
                    certifications.map((cert, i) => (
                      <CertificationSection
                        key={i}
                        name={cert.name}
                        issuer={cert.issuer}
                        completionId={cert.completionId}
                        url={cert.url}
                        startDate={cert.startDate}
                        endDate={cert.endDate}
                        editable={false}
                      />
                    ))
                  ) : (
                    <PlaceholderCard
                      Icon={ScrollText}
                      title="No Certifications Listed"
                      description="Add Certificates to highlight your qualifications."
                    />
                  )}
                </AccordionSection>

                <FormModal
                  isOpen={formVisibility.certification}
                  onClose={() => toggleForm('certification')}
                  title="Certifications"
                >
                  <CertificationFormWithProvider
                    existingCertifications={certifications || []}
                    onSave={(updatedCertifications) => {
                      const cleanedCertifications = filterMeaningfulEntries(updatedCertifications);
                      updateProfileData({ certifications: cleanedCertifications });
                      toggleForm('certification');
                    }}
                    onCancel={() => toggleForm('certification')}
                  />
                </FormModal>

                <div className="mb-35">
                  {/* Publications Section */}
                  <AccordionSection key={`publication-${areAccordionsOpen}`} title="Publications" defaultOpen={areAccordionsOpen}>
                    <div className="flex justify-between items-center w-full mb-2">
                      <span></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleForm('publication');
                        }}
                        className="p-2 rounded-lg shadow-md border border-sky-700 flex items-center hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-sky-700" />
                      </button>
                    </div>

                    {publications && publications.length > 0 ? (
                      publications.map((publication, i) => (
                        <PublicationSection
                          key={i}
                          title={publication.title}
                          author={publication.author}
                          publishedDate={publication.publishedDate}
                          publisher={publication.publisher}
                          publisherUrl={publication.publisherUrl}
                          description={publication.description}
                          editable={false}
                        />
                      ))
                    ) : (
                      <PlaceholderCard
                        Icon={BookCheck}
                        title="No Publications Listed"
                        description="Add Publications to showcase your achievements."
                      />
                    )}
                  </AccordionSection>

                  <FormModal
                    isOpen={formVisibility.publication}
                    onClose={() => toggleForm('publication')}
                    title="Publications"
                  >
                    <PublicationFormWithProvider
                      existingPublications={publications || []}
                      onSave={(updatedPublications) => {
                        const filteredPublications = filterMeaningfulEntries(updatedPublications);
                        updateProfileData({ publications: filteredPublications });
                        toggleForm('publication');
                      }}
                      onCancel={() => toggleForm('publication')}
                    />

                  </FormModal>

                  {/* Languages Section */}
                  <AccordionSection key={`language-${areAccordionsOpen}`} title="Languages" defaultOpen={areAccordionsOpen}>
                    <div className="flex justify-between items-center w-full mb-2">
                      <span></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleForm('languages');
                        }}
                        className="p-2 rounded-lg shadow-md border border-sky-700 flex items-center hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-sky-700" />
                      </button>
                    </div>

                    {languages && languages.length > 0 ? (
                      <LanguageSection languages={languages} />
                    ) : (
                      <PlaceholderCard
                        Icon={Languages}
                        title="No Languages Available"
                        description="Start adding your language skills."
                      />
                    )}
                  </AccordionSection>

                  <FormModal
                    isOpen={formVisibility.languages}
                    onClose={() => toggleForm('languages')}
                    title="Languages"
                  >
                    <LanguagesProvider
                      existingLanguages={languages || []}
                      onSave={(updatedLanguages) => {
                        updateProfileData({ languages: updatedLanguages });
                        toggleForm('languages');
                      }}
                      onCancel={() => toggleForm('languages')}
                    />
                  </FormModal>
                </div>
              </div>
            </>
          ) : (
            <GeneratedResumes />)}
        </div>
      </div>
    </div >
  );
}
