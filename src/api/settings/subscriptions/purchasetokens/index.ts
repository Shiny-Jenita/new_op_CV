
import api from "@/lib/axios";
import {
  CreatePurchaseSessionPayload,
  CreatePurchaseSessionResponse,
} from "./interface";


export async function createTokenPurchaseSession(
  payload: CreatePurchaseSessionPayload
): Promise<CreatePurchaseSessionResponse> {
  const response = await api.post<CreatePurchaseSessionResponse>(
    "/token-purchase-session",
    payload
  );
  return response.data;
}
