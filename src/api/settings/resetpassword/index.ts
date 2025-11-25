
import api from "@/lib/axios";
import { ResetPasswordRequest, ResetPasswordResponse } from "./interface";

export async function resetPassword(
  payload: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  const { data } = await api.post<ResetPasswordResponse>(
    "/reset-password",
    payload
  );
  return data;
}
