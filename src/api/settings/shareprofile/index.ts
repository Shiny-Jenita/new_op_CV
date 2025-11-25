import api from "@/lib/axios";
import { ShareProfilePayload,ShareProfileResponse } from "./interface";

export async function shareProfile(
  payload: ShareProfilePayload
): Promise<ShareProfileResponse> {
  const { data } = await api.post<ShareProfileResponse>(
    "/share-profile",
    payload
  );
  return data;
}
