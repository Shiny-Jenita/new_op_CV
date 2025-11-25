import { ResumeFormValues } from "@/app/interfaces";
import { BasicInfoFormValues } from "@/types/BasicInfoFormValues";

export type ExtendedBasicInfoFormValues = BasicInfoFormValues &
  Partial<Omit<ResumeFormValues, keyof BasicInfoFormValues>>;
