export interface ProfileData {
  name: string
  designation: string
  email: string
  phone: string
  location: string
  summary: string
  websites: { 
    type: string
    url: string
  }[]
  visible: {
    name: boolean
    designation: boolean
    email: boolean
    phone: boolean
    location: boolean
    summary: boolean
    websites: boolean
  } 
  websitesVisible?: boolean[] 
}

  export interface ExperienceData {
  date: string;
  position: string;
  company: string;
  location:string;
  description: string[];
  descriptionVisible?: boolean;
  visible?: boolean;
  descriptionSentencesVisibility?: boolean[];
}

interface Score {
  type:string,
value:string
}
  export interface EducationData {
    level: string
    university: string
    major: string
    specialization: string
    date: string
    score:Score[]
    location:String
    description: string[]
    descriptionVisible?: boolean
    visible?: boolean
    descriptionSentencesVisibility?: boolean[];
  }
  
  export interface SkillsData {
    name: string
    visible?: boolean
  }
  
  export interface CertificationsData {
    certificateName: string
    completionId?: string
    issuer?:string
    url?: string
    date?: string
    visible?: boolean
  }
  
  export interface PublicationData {
    title: string
    publisher: string
    publishedDate: string
    publisherUrl: string
    author: string
    description: string[]
    descriptionVisible?: boolean
    visible?: boolean
    descriptionSentencesVisibility?: boolean[];
  }
  
  export interface LanguageData {
    name: string
    proficiency: string
    visible?: boolean
  }
  export interface ProjectData {
    projectName: string;
    projectDescription: string[];
    visible?: boolean;
    descriptionVisible?: boolean;
    descriptionSentencesVisibility?: boolean[];
  }
  
  export interface ResumeData {
    profile: ProfileData
    experiences: ExperienceData[]
    education: EducationData[]
    skills: SkillsData[]
    projects: ProjectData[]
    others: {
      languages: LanguageData[]
      publications: PublicationData[]
      certifications: CertificationsData[]
    }
  }
  
  