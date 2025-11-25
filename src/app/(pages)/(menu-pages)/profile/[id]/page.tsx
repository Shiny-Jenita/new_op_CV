"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation"; 
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  BriefcaseBusiness,
  University,
  FolderDot,
  ScrollText,
  BookCheck,
  Languages,
  Camera,
} from "lucide-react";
import AccordionSection from "@/components/my-profile/accordion";
import EducationSection from "@/components/my-profile/education-section";
import ExperienceSection from "@/components/my-profile/experience-section";
import LanguageSection from "@/components/my-profile/language-section";
import ProjectSection from "@/components/my-profile/project-section";
import PublicationSection from "@/components/my-profile/publication-section";
import CertificationSection from "@/components/my-profile/certification-section";
import PlaceholderCard from "@/components/ui/placeholderCard";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdWeb } from "react-icons/md";
import { uploadProfileImage } from "@/api/profile";

type WebsiteEntry = { url: string; type: string; _id: string } | null;
type LanguageEntry = { name: string; proficiency: string; skills: string[]; _id: string };
type ProjectEntry = { projectName: string; projectUrl?: string; projectDescription: string[]; _id: string };
type ExperienceEntry = {
  companyName: string;
  jobTitle: string;
  skills: string[];
  location?: string;
  startDate?: string;
  endDate?: string | null;
  currentlyWorking: boolean;
  responsibilities: string[];
  _id: string;
};
type EducationEntry = {
  level: string;
  university: string;
  major: string;
  specialization?: string;
  location?: string;
  currentlyEnrolled: boolean;
  startDate?: string;
  endDate?: string;
  score: { type: string; value: number; _id: string }[];
  description: string[];
  _id: string;
};
type CertificationEntry = {
  name: string;
  completionId: string;
  issuer: string;
  url: string;
  startDate?: string | null;
  endDate?: string | null;
  _id: string;
};
type PublicationEntry = {
  author: string;
  description: string[];
  publishedDate?: string;
  publisherUrl?: string;
  title: string;
  _id: string;
};

interface ApiProfileData {
  visibility: { address: boolean; dob: boolean; email: boolean; phone: boolean };
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
  currentTitle: string;
  industry: string;
  websites: WebsiteEntry[];
  languages: LanguageEntry[];
  projects: ProjectEntry[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  publications: PublicationEntry[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  summary: string;
  profileImage?: string;
  summary_updated_at: string;
}

const ProfileSummary = ({ summary }: { summary: string }) => {
  const summaryText = summary || "";
  const sentences = summaryText
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-sky-700">Summary</h3>
      </div>

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
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2 text-sky-700 font-semibold hover:text-sky-800 transition-colors"
              >
                {expanded ? "view less" : "view more"}
              </button>
            )}
          </>
        ) : (
          <PlaceholderCard
            Icon={ScrollText}
            title="No Summary Available"
            description="No summary to display."
          />
        )}
      </div>
    </div>
  );
};

export default function MyProfile() {
  const params = useParams();
  const routeUserId = params?.id as string | undefined;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (routeUserId) {
      setUserId(routeUserId);
      return;
    }

    try {
      const raw = localStorage.getItem("profile-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const twice = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
        const profile = twice.state?.profileData;
        const id = profile?.userId || profile?.userID;
        if (id) {
          setUserId(id);
        }
      }
    } catch (e) {
      console.error("profile-storage parse error", e);
    }
  }, [routeUserId]);

  const [profile, setProfile] = useState<ApiProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(
          `https://dev-api.optimizedcv.ai/api/v1/profile/${userId}`
        );
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        const json = await resp.json();
        if (json.success && json.data) {
          setProfile(json.data as ApiProfileData);
        } else {
          throw new Error("API returned success=false or no data");
        }
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const [imgError, setImgError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [temporaryPreview, setTemporaryPreview] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageOptionsRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState("auto");
  
  useEffect(() => {
    const updateHeight = () => setContentHeight(`${window.innerHeight}px`);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

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

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">
          {routeUserId ? "Invalid profile ID." : "No profile ID found in localStorage."}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No profile data to display.</p>
      </div>
    );
  }

  const {
    firstName = "",
    lastName = "",
    currentTitle = "",
    state: userState = "",
    email = "",
    phone = "",
    city = "",
    summary = "",
    profileImage,
    websites = [],
    experience = [],
    education = [],
    projects = [],
    certifications = [],
    publications = [],
    languages = [],
    visibility = { email: true, phone: true, address: true }, // Default visibility
  } = profile;

  const shouldShowField = (field: 'email' | 'phone' | 'address') => {
    return visibility[field];
  };

  const initials = `${(firstName.charAt(0) || "").toUpperCase()}${(lastName.charAt(0) || "").toUpperCase()}`;

  const firstSite = (websites || []).find((w) => w !== null) as WebsiteEntry | undefined;
  const siteMap: Record<string, { Icon: React.ComponentType; label: string }> = {
    linkedin: { Icon: FaLinkedin, label: firstSite?.url || "" },
    github: { Icon: FaGithub, label: firstSite?.url || "" },
    portfolio: { Icon: MdWeb, label: firstSite?.url || "" },
    other: { Icon: MdWeb, label: firstSite?.url || "" },
  };
  const siteInfo = firstSite ? siteMap[firstSite.type] || siteMap.other : null;

  const hasMeaningfulData = (obj: Record<string, any>) => {
    return Object.values(obj).some((value) => {
      if (typeof value === "string") return value.trim() !== "";
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    });
  };

  const filterMeaningfulExperienceEntries = (exps?: ExperienceEntry[]) => {
    if (!Array.isArray(exps)) return [];
    return exps.filter((e) => {
      const isTitleValid = e.jobTitle?.trim() !== "";
      const isCompanyValid = e.companyName?.trim() !== "";
      const isResponsibilitiesValid = e.responsibilities?.some((res: string) => res.trim() !== "");
      const isSkillsValid = e.skills?.length > 0;
      return isTitleValid && isCompanyValid && isResponsibilitiesValid && isSkillsValid;
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setTemporaryPreview(previewUrl);
    setImgError(false);
    setIsUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadProfileImage(file);
      setTemporaryPreview(null);
    } catch (err: any) {
      console.error(err);
      setUploadError(err instanceof Error ? err.message : "Failed to upload");
      setTemporaryPreview(null);
    } finally {
      setIsUploading(false);
      setShowImageOptions(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      setUploadError(null);
      setImgError(false);
    } catch (err) {
      console.error("Error removing image:", err);
      setUploadError("Failed to remove image");
    } finally {
      setIsUploading(false);
      setShowImageOptions(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-[90%] mx-auto">
        <div
          className="overflow-y-auto p-6 hide-scrollbar"
          style={{ height: contentHeight }}
        >
          <div className="w-full bg-[#2a6baa] rounded-lg max-h-[30vh] relative">
            <Image
              src="/bannerstar1.svg"
              alt="Banner Star"
              width={70}
              height={70}
              className="absolute top-[30%] right-[8%] z-0"
            />
            <Image
              src="/bannerstar2.svg"
              alt="Banner Star"
              width={80}
              height={80}
              className="absolute top-[-26%] right-[2%] z-0"
            />
            <Image
              src="/bannerstar2.svg"
              alt="Banner Star"
              width={60}
              height={60}
              className="absolute bottom-[10%] right-[1%] z-0"
            />
            <Image
              src="/bannerstar2.svg"
              alt="Banner Star"
              width={60}
              height={60}
              className="absolute top-[8%] right-[15%] z-0"
            />
            <Image
              src="/bannerstar2.svg"
              alt="Banner Star"
              width={80}
              height={80}
              className="absolute bottom-[-25%] right-[14%] z-0"
            />

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
                  </div>
                ) : (
                  <div className="relative w-[22vh] h-[22vh] bg-[#d9e8f7] rounded-full overflow-visible">
                    <div className="flex items-center justify-center h-full">
                      <span className="text-7xl font-bold text-[#2a6baa]">
                        {initials}
                      </span>
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
                  <h1 className="text-3xl font-bold text-white mb-4">
                    {firstName} {lastName}
                  </h1>
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <div className="relative bg-white rounded-lg py-1.5 px-3 flex items-center">
                        <div className="absolute inset-y-0 left-0 w-12 bg-[#FFE458] rounded-l-lg" />
                        <div className="relative flex flex-col z-10">
                          <div className="flex items-center">
                            <div className="p-1 mr-5">
                              <Image
                                src="/briefcase.svg"
                                alt="Briefcase"
                                width={20}
                                height={20}
                              />
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

                <div className="h-full w-px mx-8 bg-gradient-to-b from-transparent via-white to-transparent" />

                <div className="flex flex-col justify-center">
                  {shouldShowField('email') && (
                    <div className="flex items-center text-white mb-4">
                      <Mail className="h-5 w-5 mr-2" />
                      <span>{email}</span>
                    </div>
                  )}
                  {shouldShowField('phone') && (
                    <div className="flex items-center text-white mb-4">
                      <Phone className="h-5 w-5 mr-2" />
                      <span>{phone}</span>
                    </div>
                  )}
                  {shouldShowField('address') && (
                    <div className="flex items-center text-white">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>
                        {city}, {userState}
                      </span>
                    </div>
                  )}
                  
                  {/* Show message when no contact info is visible */}
                  {!shouldShowField('email') && !shouldShowField('phone') && !shouldShowField('address') && (
                    <div className="text-white/70 text-sm italic">
                      Contact information is private
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="my-4">
            <ProfileSummary summary={summary} />
          </div>
          <div className="mb-2">
            <AccordionSection title="Work Experience" defaultOpen={true}>
              {experience.length > 0 ? (
                experience.map((job) => (
                  <ExperienceSection
                    key={job._id}
                    title={job.jobTitle}
                    company={job.companyName}
                    location={job.location}
                    period={`${
                      job.startDate
                        ? new Date(job.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })
                        : "Unknown"
                    } - ${
                      job.currentlyWorking
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
                  description="No work experience to display."
                />
              )}
            </AccordionSection>

            <AccordionSection title="Education" defaultOpen={true}>
              {education.length > 0 ? (
                education.map((edu) => (
                  <EducationSection
                    key={edu._id}
                    major={edu.major}
                    level={edu.level}
                    university={edu.university}
                    specialization={edu.specialization || ""}
                    location={edu.location || ""}
                    startDate={edu.startDate}
                    endDate={edu.endDate}
                    currentlyEnrolled={edu.currentlyEnrolled}
                    gpa={edu.score.map((data) => data.value)}
                    editable={false}
                    description={edu.description}
                  />
                ))
              ) : (
                <PlaceholderCard
                  Icon={University}
                  title="No Education Listed"
                  description="No education details to display."
                />
              )}
            </AccordionSection>

            <AccordionSection title="Projects" defaultOpen={true}>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectSection
                    key={project._id}
                    projectName={project.projectName}
                    projectUrl={project.projectUrl || ""}
                    projectDescription={project.projectDescription}
                    editable={false}
                  />
                ))
              ) : (
                <PlaceholderCard
                  Icon={FolderDot}
                  title="No Projects Listed"
                  description="No projects to display."
                />
              )}
            </AccordionSection>

            <AccordionSection title="Certifications" defaultOpen={true}>
              {certifications.length > 0 ? (
                certifications.map((cert) => (
                  <CertificationSection
                    key={cert._id}
                    name={cert.name}
                    issuer={cert.issuer}
                    completionId={cert.completionId}
                    url={cert.url}
                    startDate={cert.startDate || undefined}
                    endDate={cert.endDate || undefined}
                    editable={false}
                  />
                ))
              ) : (
                <PlaceholderCard
                  Icon={ScrollText}
                  title="No Certifications Listed"
                  description="No certifications to display."
                />
              )}
            </AccordionSection>

            <AccordionSection title="Publications" defaultOpen={true}>
              {publications.length > 0 ? (
                publications.map((publication) => (
                  <PublicationSection
                    key={publication._id}
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
                  description="No publications to display."
                />
              )}
            </AccordionSection>

            <AccordionSection title="Language" defaultOpen={true}>
              {languages.length > 0 ? (
                <LanguageSection languages={languages} />
              ) : (
                <PlaceholderCard
                  Icon={Languages}
                  title="No Languages Available"
                  description="No language skills to display."
                />
              )}
            </AccordionSection>
          </div>
        </div>
      </div>
    </div>
  );
}