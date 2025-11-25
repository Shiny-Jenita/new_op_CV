"use client"

import type React from "react"

import { useEffect, useState } from "react"
import ExperienceTab from "./tabs/experience-tab"
import EducationTab from "./tabs/education-tab"
import ProjectsTab from "./tabs/projects-tab"
import SkillsTab from "./tabs/skills-tab"
import OtherTab from "./tabs/other-tab"
import ResumePreview from "./resume-preview"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProfileStore } from "@/stores/profileData/profileStore"
import { ResumeData } from "./tabs/interface"
import ProfileTab from "./tabs/profile-tab"
import { useRouter } from "next/navigation"
import { useResumeStore } from "@/stores/resume/resumeStore";

const getMonthYearFromDate = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "";

  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${month} ${year}`;
  } catch (error) {
    console.error("Error parsing date:", error);
    return "";
  }
};

// Helper function to parse date and return Date object for sorting
const parseDate = (date: Date | string | null | undefined): Date => {
  if (!date) return new Date(0); // Return epoch date for null/undefined dates
  
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return isNaN(d.getTime()) ? new Date(0) : d;
  } catch (error) {
    console.error("Error parsing date for sorting:", error);
    return new Date(0);
  }
};

// Helper function to get sort date (end date for completed items, current date for ongoing items)
const getSortDate = (item: any): Date => {
  // For currently working/enrolled items, use current date to put them at top
  if (item.currentlyWorking || item.currentlyEnrolled) {
    return new Date();
  }
  
  // For completed items, use end date
  const endDate = parseDate(item.endDate);
  return endDate;
};

export default function ResumePickPreview() {
  const [activeTab, setActiveTab] = useState("profile")
  const { profileData } = useProfileStore();
  const router = useRouter();
  const [resumedata, setResumeData] = useState<ResumeData>({
    profile: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      location: "",
      summary: "",
      websites: [],
      visible: {
        name: true,
        email: true,
        phone: true,
        designation: true,
        location: true,
        summary: true,
        websites: true,
      },
      websitesVisible: [],
    },
    experiences: [],
    education: [],
    projects: [],
    skills: [],
    others: {
      languages: [],
      publications: [],
      certifications: []
    },
  });
  const generateResumeFromProfile = useResumeStore.getState().generateResumeFromProfile;
 
  useEffect(() => {
    if (!profileData) return;

    const allSkills = profileData.experience?.flatMap(exp => exp.skills || []) || [];
    const uniqueSkills = [...new Set(allSkills)];

    // Sort experiences by date (most recent first)
    const sortedExperiences = [...(profileData.experience || [])].sort((a, b) => {
      const dateA = getSortDate(a);
      const dateB = getSortDate(b);
      return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
    });

    // Sort education by date (most recent first)
    const sortedEducation = [...(profileData.education || [])].sort((a, b) => {
      const dateA = getSortDate(a);
      const dateB = getSortDate(b);
      return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
    });

    // Sort publications by published date (most recent first)
    const sortedPublications = [...(profileData.publications || [])].sort((a, b) => {
      const dateA = parseDate(a.publishedDate);
      const dateB = parseDate(b.publishedDate);
      return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
    });

    // Sort certifications by start date (most recent first)
    const sortedCertifications = [...(profileData.certifications || [])].sort((a, b) => {
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
    });

    setResumeData({
      profile: {
        name: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
        email: profileData.email || '',
        phone: profileData.phone || '',
        designation: profileData.currentTitle || '',
        location: `${profileData.city || ''}, ${profileData.state || ''}`.replace(/(^,\s*)|(\s*,\s*$)/g, ''),
        summary: profileData.summary,
        websites: profileData.websites || [],
        visible: {
          name: true,
          email: true,
          phone: true,
          designation: true,
          location: true,
          summary: true,
          websites: true,
        },
        websitesVisible: (profileData.websites || []).map(() => true),
      },
      experiences: sortedExperiences.map(exp => {
        const responsibilities = exp.responsibilities || [];
        const descriptionSentencesVisibility = responsibilities.map(() => true);

        const date = `${getMonthYearFromDate(exp.startDate)} - ${exp.currentlyWorking ? 'Present' : getMonthYearFromDate(exp.endDate)
          }` || '';

        return {
          company: exp.companyName || '',
          position: exp.jobTitle || '',
          skills: exp.skills || [],
          location: exp.location|| '',
          date,
          endDate: exp.endDate || '',
          currentlyWorking: exp.currentlyWorking || false,
          description: responsibilities,
          visible: true,
          descriptionVisible: true,
          descriptionSentencesVisibility,
        };
      }),

      education: sortedEducation.map(edu => {
        console.log("education", profileData.education)
        const description = edu.description || [];
        const descriptionSentencesVisibility = description.map(() => true);
        const date = `${getMonthYearFromDate(edu.startDate)} - ${
            edu.currentlyEnrolled ? 'Present' : getMonthYearFromDate(edu.endDate)
          }` || '';
        console.log(edu.currentlyEnrolled)
        return {
          level: edu.level || '',
          university: edu.university || '',
          major: edu.major || '',
          specialization: edu.specialization || '',
         date :date,
              location:edu.location,
          score: edu.score || [],
          description: description,
          visible: true,
          descriptionVisible: true,
          descriptionSentencesVisibility,
        };
      }),
      projects: (profileData.projects || []).map(proj => {
        const projectDescription = proj.projectDescription || [];
        const descriptionSentencesVisibility = projectDescription.map(() => true);

        return {
          projectName: proj.projectName || '',
          projectUrl: proj.projectUrl || '',
          projectDescription: projectDescription,
          visible: true,
          descriptionVisible: true,
          descriptionSentencesVisibility,
        };
      }),

      skills: uniqueSkills.map(skill => ({
        name: skill,
        visible: true
      })),

      others: {
        languages: (profileData.languages || []).map(lang => ({
          name: lang.name || '',
          proficiency: lang.proficiency || '',
          visible: true
        })),

        publications: sortedPublications.map(pub => {
          const description = pub.description || [];
          const descriptionSentencesVisibility = description.map(() => true);

          return {
            title: pub.title || '',
            publisher: pub.publisher || '',
            publishedDate: getMonthYearFromDate(pub.publishedDate) || '',
            year: getMonthYearFromDate(pub.publishedDate),
            publisherUrl: pub.publisherUrl || '',
            author: pub.author || '',
            description: description,
            visible: true,
            descriptionVisible: true,
            descriptionSentencesVisibility,
          };
        }),

        certifications: sortedCertifications.map(cert => ({
          certificateName: cert.name || '',
          completionId: cert.completionId || '',
          issuer:cert.issuer || '',
          name: cert.name || '',
          date: getMonthYearFromDate(cert.startDate),
          url: cert.url || '',
          visible: true
        }))
      },
    });
  }, [profileData]);

  const handleProceedToEditor = async() => {
    const resumeData=useResumeStore.getState().resumeData;
    const payload = {
      job_description: {
        jobTitle: "",
        companyName: "",
        jobDescription: ""
      },
      templateId: "template_1", 
      profile_json: resumeData.resumeJson
    };
  
    const result = await generateResumeFromProfile(payload);
  
    router.push("/resume-generation/generate-from-profile");
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen">
      <div className="bg-white p-6 rounded-lg shadow flex flex-col h-[87vh] relative">
        <div className="mb-2">
            <div className=" flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-sky-700 whitespace-nowrap">Filter</h2>
              <div className="flex-1 border-t-2 border-sky-700" />
            </div>
            <p className="text-gray-600 text-sm">
              <i>Filter and preview the outline of your resume.</i>
            </p>
        </div>
        <div className="flex-grow pb-20 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 sticky top-0 bg-white">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <div className="mt-6 border-t pt-2">
              <TabsContent value="profile">
                <ProfileTab profileData={resumedata.profile} setResumeData={setResumeData} />
              </TabsContent>

              <TabsContent value="experience">
                <ExperienceTab experienceData={resumedata.experiences} setResumeData={setResumeData} />
              </TabsContent>

              <TabsContent value="education">
                <EducationTab educationData={resumedata.education} setResumeData={setResumeData} />
              </TabsContent>

              <TabsContent value="projects">
                <ProjectsTab projectsData={resumedata.projects} setResumeData={setResumeData} />
              </TabsContent>

              <TabsContent value="skills">
                <SkillsTab skillsData={resumedata.skills} setResumeData={setResumeData} />
              </TabsContent>

              <TabsContent value="other">
                <OtherTab othersData={resumedata.others} setResumeData={setResumeData} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 bg-white">
          <div className="flex justify-end">
            <Button
              onClick={handleProceedToEditor}
              className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md mr-6"
            >
              Proceed to Editor
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white py-6 px-2 rounded-lg shadow flex flex-col h-[87vh]">
        <div className=" flex items-center space-x-2 mb-4">
          <h2 className="text-xl font-semibold text-sky-700 whitespace-nowrap">Resume Preview</h2>
          <div className="flex-1 border-t-2 border-sky-700" />
        </div>
        <div className="overflow-y-auto flex-grow">
          <ResumePreview resumeData={resumedata} />
        </div>
      </div>
    </div>
  )
}