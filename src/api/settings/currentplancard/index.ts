
import api from "@/lib/axios";
import { SubscriptionData } from "./interface";

const DEFAULT_SUBSCRIPTION: SubscriptionData = {
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
    const { data } = await api.get<{
      status: string;
      data: SubscriptionData;
    }>(`/subscription/${userId}`);

    if (data.status === "success" && data.data.isSubscribed) {
      return data.data;
    }
    return DEFAULT_SUBSCRIPTION;
  } catch (err: any) {
    // treat 404 as “no subscription”
    if (err.response?.status === 404) {
      return DEFAULT_SUBSCRIPTION;
    }
    // re‑throw other errors
    throw err;
  }
}
