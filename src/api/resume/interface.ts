import { ResumeJSON } from "@/stores/resume/interface";

export interface IResumeResponse {
    resumeHtml: string;
    html: string;
    success: boolean;
    message: string;
    s3_url: string;
    resume_json: ResumeJSON;
}

export interface ISavedResume {
    jdData: {
      jobTitle: string;
      companyName: string;
      jobDescription: string;
    };
    resume_json: ResumeJSON | null | undefined;
    id: string;
    resumeName: string;
    resumeUrl: string;
    createdAt: string;
    updatedAt: string;
    htmlContent: string;
  }
  
  export interface IResumeListResponse {
    success: boolean;
    message: string;
    total: number;
    resumes: ISavedResume[];
  }

  export interface ITemplate {
  id: string;
  name?: string;
  description?: string;
  thumbnailUrl: string;
}

export interface ITemplateListResponse {
  success: boolean;
  message: string;
  templates: ITemplate[];
}

export interface EnhanceSentenceRequest {
  sentences: string[];
  style: string;
  context?: string;
}

export interface EnhancedResult {
  original: string;
  enhanced: string;
  token_usage: number;
}

export interface EnhanceSentenceResponse {
  results: EnhancedResult[];
}

  