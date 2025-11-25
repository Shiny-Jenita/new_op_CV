import api from "@/lib/axios";
import { SubscriptionData } from "./interface";

const FREE_FALLBACK: SubscriptionData = {
  subscriptionId: "",
  planName: "Free",
  price: 0,
  isSubscribed: false,
  startDate: "",
  endDate: "",
};

export async function getSubscriptionData(
  userId: string
): Promise<SubscriptionData> {
  try {
    const response = await api.get<{
      status: string;
      data: SubscriptionData;
    }>(`/subscription/${userId}`);

    // 404 → no subscription → Free
    if (response.status === 404) {
      return FREE_FALLBACK;
    }

    const json = response.data;
    if (json.status === "success" && json.data.isSubscribed) {
      return json.data;
    }

    // even if the API call succeeded, but user isn't subscribed
    return FREE_FALLBACK;
  } catch (err: any) {
    // on network error or other HTTP errors (including 404),
    // log and fall back to Free plan
    console.error("getSubscriptionData failed", err);
    return FREE_FALLBACK;
  }
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<void> {
  await api.post("/cancel-subscription", { subscriptionId });
}
