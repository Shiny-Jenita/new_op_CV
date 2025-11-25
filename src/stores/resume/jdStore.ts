import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JDStore, JobDetails } from "./interface";

export const useJDStore = create<JDStore>()(
  persist(
    (set) => ({
      jobDetails: null,
      jdResponse: null,

      setJobDetails: (details: JobDetails) => {
        set({ jobDetails: details });
      },

      setJdResponse: (response: any) => {
        set({ jdResponse: response });
      },
    }),
    {
      name: "jd-storage",
    }
  )
);
