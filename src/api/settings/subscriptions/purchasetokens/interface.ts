

export interface TokenPackage {
  amount: number;
  price: string;
}

export interface CreditsInformationProps {
  totalCredits?: number;
  monthlyCredits: number;
  extraCredits: number;
}

export interface CreatePurchaseSessionPayload {
  priceId: string;
  userId: string;
}

export interface CreatePurchaseSessionResponse {
  status: "success" | "error";
  message: string;
  url: string; 
}

export interface PurchasePackageWithPriceId extends TokenPackage {
  priceId: string;
}
