import { ResumeFormValues } from "@/app/interfaces";

export type BasicInfoFormValues = Pick<
  ResumeFormValues,
  | "firstName"
  | "lastName"
  | "email"
  | "address"
  | "city"
  | "state"
  | "country"
  | "zipcode"
  | "phone"
  | "currentTitle"
  | "industry"
  | "summary"
 
  
>;
