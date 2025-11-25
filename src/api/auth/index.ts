import api from "@/lib/axios";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleAuthRequest,
  GoogleAuthResponse,
  LoginCredentials,
  LoginResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignupRequest,
  SignupResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  VerifySignupOtpRequest,
  VerifySignupOtpResponse,
} from "./interface";

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const google_verify = async (code: string): Promise<LoginResponse> => {
  const response = await api.get(`/google-verify`, {
    params: { code },
  });
  return response.data;
};

export const forgotPassword = async (
  requestData: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await api.post("/forgot-password", requestData);
  return response.data;
};

export const verifyOtp = async (
  requestData: VerifyOtpRequest
): Promise<VerifyOtpResponse> => {
  const response = await api.post("/verify-otp", requestData);
  return response.data;
};

export const resetPassword = async (
  requestData: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const response = await api.post("/reset-password", requestData);
  return response.data;
};

export const signupUser = async (
  requestData: SignupRequest
): Promise<SignupResponse> => {
  const response = await api.post("/signup", requestData);
  return response.data;
};

export const verifySignupOtp = async (
  requestData: VerifySignupOtpRequest
): Promise<VerifySignupOtpResponse> => {
  const response = await api.post("/verify-signup-otp", requestData);
  return response.data;
};

export const resendSignupOtp = async (
  requestData: ResendOtpRequest
): Promise<ResendOtpResponse> => {
  const response = await api.post("/resend-otp", requestData);
  return response.data;
};

export const googleAuth = async (
  requestData: GoogleAuthRequest
): Promise<GoogleAuthResponse> => {
  const response = await api.post("/google-auth", requestData);
  return response.data;
};
