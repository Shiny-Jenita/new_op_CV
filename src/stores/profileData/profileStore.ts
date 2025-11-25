import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProfileData, ProfileStore } from "./interface";
import { getProfile, updateProfile } from "@/api/profile";

const defaultProfileData: ProfileData = {
  firstName: "",
  lastName: "",
  dob: undefined,
  email: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
  phone: "",
  currentTitle: "",
  industry: "",
  summary: "",
  websites: [{ url: "", type: "linkedin" }],
  languages: [{ name: "", proficiency: "", skills: [] }],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  publications: []
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

// Function to sort profile data by dates
const sortProfileData = (data: ProfileData): ProfileData => {
  const sortedData = { ...data };

  // Sort experiences by date (most recent first)
  if (sortedData.experience && Array.isArray(sortedData.experience)) {
    sortedData.experience = [...sortedData.experience].sort((a, b) => {
      const dateA = getSortDate(a);
      const dateB = getSortDate(b);
      return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
    });
  }

  // Sort education by date (most recent first)
  if (sortedData.education && Array.isArray(sortedData.education)) {
    sortedData.education = [...sortedData.education].sort((a, b) => {
      const dateA = getSortDate(a);
      const dateB = getSortDate(b);
      return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
    });
  }

  // Sort publications by published date (most recent first)
  if (sortedData.publications && Array.isArray(sortedData.publications)) {
    sortedData.publications = [...sortedData.publications].sort((a, b) => {
      const dateA = parseDate(a.publishedDate);
      const dateB = parseDate(b.publishedDate);
      return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
    });
  }

  // Sort certifications by start date (most recent first)
  if (sortedData.certifications && Array.isArray(sortedData.certifications)) {
    sortedData.certifications = [...sortedData.certifications].sort((a, b) => {
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
    });
  }

  return sortedData;
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profileData: defaultProfileData,

      fetchProfileData: async () => {
        try {
          const data = await getProfile();
          const mergedData = {
            ...defaultProfileData,
            ...data.data,
          };
          
          // Sort the data before setting it
          const sortedData = sortProfileData(mergedData);
          
          set(() => ({
            profileData: sortedData,
          }));
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        }
      },

      updateProfileData: async (data) => {
        try {
          const response = await updateProfile(data);
          set((state) => {
            const updatedData = {
              ...state.profileData,
              ...response.data, // Update only the changed fields
            };
            
            // Sort the updated data before setting it
            const sortedData = sortProfileData(updatedData);
            
            return {
              profileData: sortedData,
            };
          });
        } catch (error) {
          console.error("Failed to update profile data:", error);
        }
      },

      resetProfileData: () => set({ profileData: defaultProfileData }),
    }),
    {
      name: "profile-storage", // Key for localStorage
    }
  )
);