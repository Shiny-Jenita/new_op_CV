import api from "@/lib/axios";
import { IDeleteAccountResponse } from "./interface";
import { SupportFormData,ISupportSendResponse } from "./interface";

/**
 * @param token 
 * @returns   
 */
export async function deleteAccount(
  token: string
): Promise<IDeleteAccountResponse> {
  const { data } = await api.delete<IDeleteAccountResponse>(
    "/delete",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
}

export async function sendSupportMessage(
  data: SupportFormData,
  token: string
): Promise<ISupportSendResponse> {
  const { data: response } = await api.post<ISupportSendResponse>(
    "/support/send",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}
