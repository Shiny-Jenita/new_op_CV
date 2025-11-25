import api from "@/lib/axios";
import { IProfileResponse } from "./interface";
import { ProfileData } from "@/stores/profileData/interface";
import type { ProfileImage } from "./interface";

export const getProfile = async (): Promise<IProfileResponse> => {
    const response = await api.get("/profile");
    return response.data;
};

export const updateProfile = async (data: Partial<ProfileData>): Promise<IProfileResponse> => {
    const response = await api.post("/profile", data);
    return response.data;
}

export async function uploadProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file); 
    
    const { data } = await api.post<ProfileImage>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data" 
      }
    });
  
    if (data.success && data.data?.downloadUrl) {
      return data.data.downloadUrl;
    }
    throw new Error(data.message || "Failed to upload image");
  }