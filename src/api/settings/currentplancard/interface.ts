// subscriptions/interface.ts
export interface SubscriptionData {
    planName: string;
    price: number;
    isSubscribed: boolean;
    startDate: string;
    endDate: string;
  }
  
  export interface PlanConfig {
    name: string;
    price: string;
    period: string;
    features: string[];
    isFree?: boolean;
  }
  