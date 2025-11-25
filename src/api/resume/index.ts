import api from "@/lib/axios";
import { IResumeListResponse, IResumeResponse, ITemplateListResponse,EnhanceSentenceRequest,EnhanceSentenceResponse} from "./interface";
import axios from "axios";
import { ResumeJSON } from "@/stores/resume/interface";
interface GenerateResumePayload {
  job_description: {
    jobTitle: string;
    companyName: string;
    jobDescription: string;
  };
  templateId: string;
  profile_json: ResumeJSON;
}
export interface ITemplate {
  id: string;
  thumbnailUrl: string;
}

export interface ITemplateListResponse {
  success: boolean;
  message: string;
  total: number;
  templates: ITemplate[];
}
export const generateResumeFromProfile = async (
  payload: GenerateResumePayload 
): Promise<IResumeResponse> => {
  const response = await api.post("/generate/resume/profile", payload);

  return {
    success: response.data.success,
    message: response.data.message,
    s3_url: response.data.s3_url,
    resume_json: response.data.resume_json,
    html: response.data.resumeHtml,
  };
};

export const fetchSavedResumes = async (): Promise<IResumeListResponse> => {
  const response = await api.get("/list-resume");
  return response.data;
};
interface JobDescription{
  jobTitle:string;
  compayName:string;
  jobDescription:string;
}

export const saveResumeAPI = async (
  resumeData: any, 
  html: string,
  resumeName: string,
  templateId:string,
  jobDescription:JobDescription,
): Promise<SaveResumeResponse> => {
  const payload = {
    resume_json: {
      details: resumeData,
      JD: ""
    },
    html: html,
    resumeName:resumeName,
    templateId:templateId,
    jobDescription:jobDescription
  };
  
  const response = await api.post("/save", payload);
  
  return response.data;
};

export const fetchTemplates = async (): Promise<ITemplateListResponse> => {
  const response = await api.get("/list-templates");
  return response.data;
};

export const renameResume = async (
  resumeId: string,
  newName: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/rename/${resumeId}`, { newName });
  return response.data;
};

/**
 * @param payload 
 * @returns 
 */

export const enhanceSentences = async (
  payload: EnhanceSentenceRequest
): Promise<EnhanceSentenceResponse> => {
  const response = await api.post(
    `/ai-buddy/`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const enhanceSummary = async (
): Promise<any> => {
  const response = await api.post("/enhance/summary",
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// interface payload {
//   html:string;
// }
interface DownloadResponse {
  success: boolean;
  message: string;
  pdfUrl: string;
  pdfFileName: string;
}
export const downloadResumePDF = async (
  payload: string
): Promise<DownloadResponse> => {
  const response = await api.post(
    "/download/resume/pdf",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data; 
};
interface DownloadDocxResponse {
  success: boolean;
  message: string;
  docxUrl: string;
  docxFileName: string;
}

export const downloadResumeDOCX = async (
  payload: string
): Promise<DownloadDocxResponse> => {
  const response = await api.post("/download/resume/docx", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

