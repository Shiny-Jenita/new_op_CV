
export type ResumeData = {
  resumeUrl: string;
  resumeName: string;
  resumeJson: ResumeJSON | null;
  resumeHtml: string;
  generatedHtml: string;
};
export interface ITemplate {
  id: string;
  thumbnailUrl: string;
}



export type ResumeStore = {
  resumeData: ResumeData;
  templateList: ITemplate[];
  fetchTemplates: () => Promise<void>;
  generateResumeFromProfile: (payload:any) => Promise<ResumeData | string>;
  setGeneratedHtml: (html: string) => void;
  setResumeJson: (json: ResumeJSON) => void;
  updateResumeJson: (newJson: any) => void;
  setResumeFromSaved: (payload: {
    html?: string;
    json?: ResumeJSON | null;
    resumeUrl?: string;
    resumeName?: string;
  }) => void;
};
export interface ResumeJSON {
  details:{
    profile: {
      name: string;
      email: string;
      phone: string;
      designation: string;  // job title
      location: string;
      summary: string;
      websites: string[];
    };
    experiences: Array<{
      company: string;
      position: string;
      date: string;  // could be a range, e.g., "Jan 2020 - Present"
      highlights: string[];
      currentlyWorking: boolean;
    }>;
    education: Array<{
      level: string;
      university: string;
      major: string;
      specialization: string;
      date: string;  // date range
      gpa: string[];
      score: Array<{ type: "gpa" | "cgpa"; value: string }>;
      description: string[];
    }>;
    projects: Array<{
      projectName: string;
      projectUrl: string;
      projectDescription: string[];
    }>;
    skills: Array<{
      name: string;
    }>;
    others: {
      languages: Array<{
        name: string;
        proficiency: string;
      }>;
      publications: Array<{
        title: string;
        publisher: string;
        publishedDate: string;
        publisherUrl: string;
        author: string;
        description: string[];
      }>;
      certifications: Array<{
        certificateName: string;
        completionId: string;
        date: string;
        url: string;
      }>;
      
  }
  
  };
}

export interface JobDetails {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
}

export interface JDStore {
  jobDetails: JobDetails | null;
  jdResponse: any; // You can type this more strictly if you know the structure
  setJobDetails: (details: JobDetails) => void;
  setJdResponse: (response: any) => void;
}
