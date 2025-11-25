export interface PlanFeature {
    name: string;
  }
  
  export interface Plan {
    name: string;
    price: string;
    period: string;
    features: string[];
    isCurrent?: boolean;
    isPopular?: boolean;
    isFree?: boolean;
    priceId?: string;
    tokenBased?: boolean;
  }
  
  export interface Transaction {
  _id: string;
  userId: string;
  action: string;
  source: string;
  amount: number;
  balanceAfter: number;
  tokenType: "expiring" | "non-expiring";
  note: string;
  createdAt: string;
  __v: number;
}

export interface SubscriptionResponse {
  status: string;
  data: {
    isSubscribed: boolean;
    planName: string;
    status: "active" | "canceled" | "inactive";
    endDate?: string;
    totalTokens: number;
    expiringTokens: number;
    nonExpiringTokens: number;
    tokenExpiry: string | null;
    tokensUsed: number;
    recentTransactions: Transaction[];
  };
}
  
  export interface CheckoutSubscribeResponse {
    url?: string;
  }

  export interface CreditsInformationProps {
  totalCredits: number;
  monthlyCredits: number;   
  extraCredits: number;      
}

export interface TokenPackage {
  amount: number;
  price: string;
}
  