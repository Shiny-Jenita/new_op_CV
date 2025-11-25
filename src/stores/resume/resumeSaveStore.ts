
"use client"
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ISavedResume } from "@/api/resume/interface";
import { fetchSavedResumes, saveResumeAPI } from "@/api/resume";

// Define the API response interface
interface SaveResumeResponse {
  success: boolean;
  message: string;
  s3_url: string;
  resume_json: any;
  html: string;
}

// Store state interface
interface ResumeSaveState {
  savedResumes: ISavedResume[];
  currentResumeId: string | null;
  lastSavedResume: SaveResumeResponse | null;
}

// Store actions interface
interface ResumeSaveActions {
  fetchSavedResumes: () => Promise<void>;
  deleteResume: (id: string) => void;
  setCurrentResume: (id: string) => void;
  saveResume: (
    resumeData: any,
    html: string,
    resumeName: string,
    templateId: string,
    jobDescription: any
  ) => Promise<SaveResumeResponse | null>;
  getResumeById: (id: string) => ISavedResume | null;
}

type ResumeSaveStore = ResumeSaveState & ResumeSaveActions;

// Helper: Convert "Jan 2022" -> "2022-01"
const convertToISODate = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  const [monthStr, yearStr] = dateStr.split(" ");
  if (!monthStr || !yearStr) return "";
  try {
    const month = new Date(`${monthStr} 1, 2000`).getMonth() + 1;
    return `${yearStr}-${String(month).padStart(2, '0')}`;
  } catch {
    return "";
  }
};

// Optional: Normalize resume data for saving (used outside this store)
export const normalizeResumeData = (rawDetails: any) => {
  const locationString =
    typeof rawDetails?.profile?.location === "string"
      ? rawDetails.profile.location
      : "";

  return {
    basics: {
      name: rawDetails?.profile?.name || "",
      email: rawDetails?.profile?.email || "",
      phone: rawDetails?.profile?.phone || "",
      label: rawDetails?.profile?.designation || "",
      summary: rawDetails?.profile?.summary || "",
      location: {
        city: locationString.split(",")[0]?.trim() || "",
        countryCode: locationString.split(",")[1]?.trim() || ""
      },
      profiles:
        rawDetails?.profile?.websites?.map((site: any) => ({
          network: site.type,
          url: site.url
        })) || []
    },
    experience:
      rawDetails?.experiences?.map((job: any) => {
        const [startDate, endDate] = job.date?.split(" - ") || [];
        return {
          name: job.company,
          position: job.position,
          startDate: convertToISODate(startDate),
          endDate: endDate?.toLowerCase().includes("present")
            ? "Present"
            : convertToISODate(endDate),
          highlights: job.description || []
        };
      }) || [],
    education:
      rawDetails?.education?.map((edu: any) => {
        const [startDate, endDate] = edu.date?.split(" - ") || [];
        return {
          institution: edu.university,
          area: edu.major,
          studyType: edu.level,
          startDate: convertToISODate(startDate),
          endDate: convertToISODate(endDate),
          courses: [],
          highlights: edu.description || []
        };
      }) || [],
    skills: [
      {
        name: "General",
        keywords: rawDetails?.skills?.map((skill: any) => skill.name) || []
      }
    ],
    projects:
      rawDetails?.projects?.map((p: any) => ({
        name: p.projectName,
        description: p.projectDescription
      })) || []
  };
};

// Initial state
const initialState: ResumeSaveState = {
  savedResumes: [],
  currentResumeId: null,
  lastSavedResume: null
};

// Create store
export const useResumeSaveStore = create<ResumeSaveStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      fetchSavedResumes: async () => {
        try {
          const data = await fetchSavedResumes();
          console.log(data);
          if (Array.isArray(data.resumes)) {
            set({ savedResumes: data.resumes });
          } else {
            set({ savedResumes: [] });
          }
        } catch (error) {
          // console.error("Error fetching resumes:", error);
          set({ savedResumes: [] });
        }
      },
      deleteResume: (id: string) => {
        set((state) => ({
          savedResumes: state.savedResumes.filter((resume) => resume.id !== id)
        }));
      },

      setCurrentResume: (id: string) => {
        set({ currentResumeId: id });
        localStorage.setItem("currentResumeId", id);
      },

      saveResume: async (
        resumeData: any,
        html: string,
        resumeName: string,
        templateId: string,
        jobDescription: any
      ) => {
        try {
          const response = await saveResumeAPI(
            resumeData,
            html,
            resumeName,
            templateId,
            jobDescription,
          );

          if (response.success) {
            set({ lastSavedResume: response });

            const newId = Date.now().toString();
            const newResume: ISavedResume = {
              id: newId,
              resumeName,
              createdAt: new Date().toISOString(),
              s3_url: response.s3_url,
              resume_json: response.resume_json,
              html: response.html
            };

            set((state) => ({
              savedResumes: [...state.savedResumes, newResume],
              currentResumeId: newId
            }));

            return response;
          }
          return null;
        } catch (error) {
          console.error("Error saving resume:", error);
          return null;
        }
      },
      
      getResumeById: (id: string) => {
        return get().savedResumes.find((resume) => resume.id === id) || null;
      }
    }),
    {
      name: "resume-save-storage",
      partialize: (state) => ({
        savedResumes: state.savedResumes,
        currentResumeId: state.currentResumeId,
        lastSavedResume: state.lastSavedResume
      })
    }
  )
);
