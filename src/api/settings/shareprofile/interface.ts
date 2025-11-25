// Payload & response for the API call
export interface ShareProfilePayload {
    userId: string;
    recipientEmail: string;
  }
  
  export interface ShareProfileResponse {
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
  }
  
  // Props & local data shapes for the React component
  export interface ShareProfileProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export interface ProfileData {
    userId: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    city: string;
    state: string;
  }
  
  export interface VisibilitySettings {
    email: boolean;
    phone: boolean;
    address: boolean;
  }
  