import { IconType } from "react-icons";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface VerifyCodeFormValues {
  otp: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  referalCode?: string;
}

export interface SignUpVerifyCodeFormValues {
  otp: string;
}

export interface GoogleAuthResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface GoogleAuthRequest {
  tokenId: string;
}

export interface Website {
  id: number;
  type: "LinkedIn" | "GitHub"  | "Portfolio" | "Twitter" | "Other";
  url: string;
}

export interface LanguageSkills {
  read: boolean;
  write: boolean;
  speak: boolean;
}

export interface Language {
  id?: number;
  name?: string;
  proficiency?: string;
  skills?: string[];
}

export interface Payload {
  id: number;
  companyName: string;
  jobTitle: string;
  skills: string[];
  startDate: Date | null;
  endDate: Date | null;
  roles: string;
  [key: string]: unknown;
}

export interface Project {
  projectName: string;
  projectDescription: string;
  role: string;
  technologiesUsed: string;
  projectUrl: string;
  startDate: Date | null;
  endDate: Date | null;
}

export interface ResumeFormValues {
  unique_userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date | null;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
  currentTitle: string;
  industry: string;
  summary: string;
  websites: Website[];
  languages: {
    name: string;
    proficiency: string;
    skills: string[];
  }[];
 experienceData:ExperienceFormData;
  educationData: EducationFormData;
}
export interface Project {
  projectName: string;
  projectUrl: string;
  projectDescription: string;
  _id?: string; 
}

export interface ProjectFormData {
  projects: Project[]; 
}

export interface Experience {
  roles: string;
  id: number;
  companyName: string;
  jobTitle: string;

  skills: string[];
  startDate: Date | null;
  endDate: Date | null;
  currentlyWorking: boolean;
  responsibilities: string;
}

export interface ExperienceFormData {
  experience: Experience[];
}
export interface EducationFormData {
  education: Education[];
}
export interface Score {
  type: string;    
  value: number;
}
export interface Education {
  id: number | string;
  level: string;
  university: string;
  major: string;
  specialization: string;
  startDate: Date | null;
  endDate: Date | null;
  location:string;
 score?: Score;
  description?: string[];
}

export interface Certification {
  id?: number;
  name: string;
  completionId?: string;
  url?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface Publication {
  id?: number;
  title: string;
  publisher?: string;
  publishedDate?: Date | null;
  publisherUrl?: string;
  author?: string;
  description?: string;
}

export interface EducationFormData {
  educationList?: Education[];
  certifications?: Certification[];
  publications?: Publication[];
}
export interface ExperienceFormData {
  experiences:Experience[];
  projects?:Project[];

}

export interface NavItem {
  name: string;
  href: string;
  icon: string;
  hoverIcon: string;
}

export interface UserProfile {
  name: string;
  role: string;
  tokens: number;
  maxTokens: number;
}

export interface FormField {
  id?: string;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  icon?: string | IconType;
  iconColor?: string;
  iconSize?: number;
  error?: { message?: string };
  register?: unknown;
  className?: string;
  value?: string;
  control?: unknown;
  setValue?: unknown;
  options?: Array<{
    value: string;
    label: string;
  }>;
  index?: number;
  readonly?: boolean;
}
export interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  imageSrc?: string;
  alt?: string;
  children?: React.ReactNode;
}

export interface EditorState {
  contentRef: React.RefObject<HTMLDivElement>;
  history: string[];
  historyIndex: number;
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface ToolbarProps {
  contentRef: React.RefObject<HTMLDivElement>;
  editorState: EditorState;
}

export interface SideToolbarProps {
  contentRef: React.RefObject<HTMLDivElement>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}
