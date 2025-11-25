import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeData, ResumeStore, ResumeJSON } from "./interface";
import { fetchTemplates, generateResumeFromProfile } from "@/api/resume";

const defaultResumeData: ResumeData = {
  resumeUrl: "",
  resumeName: "",
  resumeJson: null,
  resumeHtml: "",
  generatedHtml: "",
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumeData: defaultResumeData,
      templateList: [],

      fetchTemplates: async () => {
        try {
          const response = await fetchTemplates();
          if (response.success) {
            set({ templateList: response.templates });
          } else {
            console.error("Failed to fetch templates: Invalid response format");
          }
        } catch (error) {
          console.error("Failed to fetch templates:", error);
        }
      },

     generateResumeFromProfile: async (payload) => {
  try {
    const response = await generateResumeFromProfile(payload); // This is your API call
    const updatedData: ResumeData = {
      resumeUrl: response.s3_url,
      resumeName: response.s3_url || "",
      resumeJson: response.resume_json,
      resumeHtml: response.html,
      generatedHtml: "",
    };
    set({ resumeData: updatedData });
    return updatedData;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to generate resume.";
    console.error("Failed to generate resume:", message);
    return message; // Return message as string to check later
  }
}
,
setResumeFromSaved: (payload: {
  html?: string;
  json?: ResumeJSON | null;
  resumeUrl?: string;
  resumeName?: string;
}) => {
  set((state) => ({
    resumeData: {
      ...state.resumeData,
      resumeHtml: payload.html ?? state.resumeData.resumeHtml,
      resumeJson: payload.json ?? state.resumeData.resumeJson,
      resumeUrl: payload.resumeUrl ?? state.resumeData.resumeUrl,
      resumeName: payload.resumeName ?? state.resumeData.resumeName,
    },
  }));
},

      setGeneratedHtml: (html: string) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            generatedHtml: html,
          },
        }));
      },

      setResumeJson: (json: ResumeJSON) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            resumeJson: json,
          },
        }));
      },

      updateResumeJson: (newJson: any) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            resumeJson: {
              ...state.resumeData.resumeJson,
              ...newJson,
            } as ResumeJSON,
          },
        }));
      },
    }),
    {
      name: "resume-storage", // LocalStorage key
    }
  )
);
