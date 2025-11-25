export type AuthActionType = 
  | 'login'
  | 'signup'
  | 'forgotPassword'
  | 'verifyOtp'
  | 'resetPassword'
  | 'resendOtp'
  | 'googleVerify'
  | 'verifySignupOtp';

export interface User {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  userId: string | null;
  username: string | null;
  isProfile: boolean;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: Record<AuthActionType, boolean>;
  error: string | null;
  flags: {
    isValidRouteAccess: boolean;
    isSignUpSuccess: boolean;
    isForgotPasswordSuccess: boolean;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}