
export interface IDeleteAccountResponse {
    success: boolean;
    message?: string;
  }
  
  export interface SupportFormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    requestType:string;
  }
  
  export interface ISupportSendResponse {
    success: boolean;
    message?: string;
  }