

export interface SubscriptionData {
    subscriptionId: string;
    planName: string;
    price: number;
    isSubscribed: boolean;
    startDate: string;
    endDate: string;
  }
  
  export interface SubscriptionResponse {
    status: "success" | string;
    data: SubscriptionData;
  }
  