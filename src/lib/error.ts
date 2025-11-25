import { toast } from "react-toastify";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: { data?: { message?: string } }
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const ERROR_MESSAGES = {
  LOGIN: "Login failed. Please try again.",
  SIGNUP: "Signup failed. Please try again.",
  GOOGLE_VERIFY: "Google verification failed. Please try again.",
  OTP_VERIFY: "OTP verification failed. Please try again.",
  PASSWORD_RESET: "Password reset failed. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  RESEND_OTP: "Failed to resend OTP. Please try again.",
  VERIFY_SIGNUP: "Signup OTP verification failed. Please try again.",
} as const;

export const handleApiError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  customMessage?: string
): never => {
  const message = error.message || customMessage || ERROR_MESSAGES.NETWORK;

  toast.error(message);
  throw new ApiError(message);
};
