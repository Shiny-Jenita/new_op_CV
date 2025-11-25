import { ProfileData } from "@/stores/profileData/interface";

export interface IProfileResponse {
    success: boolean;
    message: string;
    data: ProfileData;
}

export interface ProfileImage {
    success: boolean;
    data?: {
      downloadUrl: string;
    };
    message?: string;
  }