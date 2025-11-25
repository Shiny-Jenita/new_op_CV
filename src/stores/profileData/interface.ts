export interface ProfileScore {
  type: string;    
  value: number;
}

export interface ProfileVisibility {
  email: boolean;
  phone: boolean;
  address: boolean;
  dob: boolean;
}

export interface ProfileWebsites {
  type: string;
  url: string;
}

export interface ProfileLanguage {
  name: string;
  proficiency: string;
  skills?: string[];   // optional array
  read?: boolean;      // if you still need them
  write?: boolean;
  speak?: boolean;
}

export interface ProfileExperience {
  companyName: string;
  jobTitle: string;
  startDate: string;            // ISO date
  endDate: string;          
  location:string;    // ISO date
  currentlyWorking: boolean;
  responsibilities: string[];   // array
  skills: string[];
}

export interface ProfileEducation {
  level: string;
  university: string;
  major: string;
  specialization: string;
  startDate: string;    
  location:string;
  currentlyEnrolled:boolean;        
  endDate: string;              
  score?: ProfileScore[];      
  description?: string[];        
}

export interface ProfileProject {
  projectName: string;
  projectUrl: string;
  projectDescription: string[]; // array
}

export interface ProfileCertification {
  name: string;
  completionId: string;
  url: string;
  issuer:string
  startDate: string;          
  endDate: string;            
}

export interface ProfilePublication {
  title: string;
  author: string;
  description: string[];        // array
  publishedDate: string;        // ISO date
  publisher: string;
  publisherUrl: string;
}

export interface ProfileData {
  userId?: string;             
  profileImage?: string;     
  firstName: string;
  lastName: string;
  dob?: string;              
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
  currentTitle: string;
  industry: string;
  summary: string;
  websites?: ProfileWebsites[];
  languages: ProfileLanguage[];
  experience: ProfileExperience[];
  education: ProfileEducation[];
  projects: ProfileProject[];
  certifications: ProfileCertification[];
  publications: ProfilePublication[];
  visibility?: ProfileVisibility; // from API
}

export type ProfileStore = {
  profileData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  fetchProfileData: () => Promise<void>;
  resetProfileData: () => void;
};

