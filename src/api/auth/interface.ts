export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    isProfileCompleted: boolean;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}


export interface ForgotPasswordResponse {
    status: string;
    message: string;
  }
  
  export interface ForgotPasswordRequest {
    email: string;
  }


  export interface VerifyOtpResponse {
    status: string;
    message: string;
  }
  
  export interface VerifyOtpRequest {
    email: string;
    otp: string;
  }

  export interface ResetPasswordResponse {
    status: string;
    message: string;
  }
  
  export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }

  export interface SignupResponse {
    status: string;
    message: string;
  }
  
  export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    referalCode?: string;
  }

  export interface VerifySignupOtpResponse {
    status: string;
    message: string;
  }
  
  export interface VerifySignupOtpRequest {
    email: string;
    otp: string;
  }

  export interface ResendOtpResponse {
    status: string;
    message: string;
  }
  
  export interface ResendOtpRequest {
    email: string;
    otp?: string;
  }

  export interface GoogleAuthResponse {
    status: string;
    message: string;
    data: {
      accessToken: string;
      user?: {
        firstName: string;
        lastName: string;
        email: string;
      };
    };
  }
  
  export interface GoogleAuthRequest {
    token: string;
  }