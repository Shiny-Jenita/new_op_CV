import api from "@/lib/axios";
import { SubscriptionResponse, CheckoutSubscribeResponse } from "./interface";

export async function getUserSubscription(userId: string): Promise<SubscriptionResponse> {
  const { data } = await api.get<SubscriptionResponse>(`/token-summary/${userId}`);
  return data;
}

export async function checkoutSubscribe(
  userId: string,
  priceId: string
): Promise<CheckoutSubscribeResponse> {
  const { data } = await api.post<CheckoutSubscribeResponse>(
    "/checkout-subscribe",
    { userId, priceId }
  );
  return data;
}
