import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import api from '@/lib/axios';
import { handleApiError, ERROR_MESSAGES } from '@/lib/error';
import type { AuthState, AuthActionType, AuthResponse } from './interface';
import type {
  LoginCredentials,
  SignupRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  VerifySignupOtpRequest,
  LoginResponse
} from '@/api/auth/interface';
import { loginUser } from '@/api/auth';

const initialState: AuthState = {
  accessToken: null,
  user: null,
  loading: {
    login: false,
    signup: false,
    forgotPassword: false,
    verifyOtp: false,
    resetPassword: false,
    resendOtp: false,
    googleVerify: false,
    verifySignupOtp: false
  },
  error: null,
  flags: {
    isValidRouteAccess: false,
    isSignUpSuccess: false,
    isForgotPasswordSuccess: false
  }
};

const createAuthSlice = (set: any, get: any) => ({
  ...initialState,

  setLoading: (actionType: AuthActionType, isLoading: boolean) =>
    set((state: AuthState) => ({
      loading: { ...state.loading, [actionType]: isLoading }
    })),

  setError: (error: string | null) => set({ error }),

  resetFlags: () => set({ flags: initialState.flags }),

  handleAuthSuccess: (response: AuthResponse) => {
    const { accessToken, user } = response;
    localStorage.setItem('accessToken', accessToken);
    set({ accessToken, user, error: null });
    return response;
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse | undefined> => {
    const store = get();
    try {
      store.setLoading('login', true);
      const response = await loginUser(credentials);
      console.log('Login response:', response);
      if (!response.success) {
        return response;
      }
      store.handleAuthSuccess(response.data);
      toast.success('Login Successful!', {
        autoClose: 3000 
      });
      return response;
    } catch (error) {
      handleApiError(error, ERROR_MESSAGES.LOGIN);
      return undefined;
    } finally {
      store.setLoading('login', false);
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('profile-storage');
    document.cookie = Object.keys(document.cookie).reduce(
      (cookies, key) => `${cookies}${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`,
      ''
    );
    set(initialState);
  },

  googleVerify: async (code: string) => {
    const store = get();
    try {
      store.setLoading('googleVerify', true);
      const { data } = await api.get('/google-verify', { params: { code } });
      return store.handleAuthSuccess(data.data);
    } catch (error) {
      handleApiError(error, ERROR_MESSAGES.GOOGLE_VERIFY);
    } finally {
      store.setLoading('googleVerify', false);
    }
  },

    signup: async (data: SignupRequest) => {
    const store = get();
    try {
      store.setLoading('signup', true);
      const response = await api.post('/signup', data);
      set({ flags: { ...get().flags, isSignUpSuccess: true } });
      return response.data;
    } catch (error) {
      return handleApiError(error, ERROR_MESSAGES.SIGNUP);
    } finally {
      store.setLoading('signup', false);
    }
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const store = get();
    try {
      store.setLoading('forgotPassword', true);
      const response = await api.post('/forgot-password', data);
      set({ flags: { ...get().flags, isForgotPasswordSuccess: true } });
      return response.data;
    } catch (error) {
      handleApiError(error, ERROR_MESSAGES.PASSWORD_RESET);
    } finally {
      store.setLoading('forgotPassword', false);
    }
  },

  verifyOtp: async (data: VerifyOtpRequest) => {
    const store = get();
    try {
      store.setLoading('verifyOtp', true);
      await api.post('/verify-otp', data);
    } catch (error) {
      handleApiError(error, ERROR_MESSAGES.OTP_VERIFY);
    } finally {
      store.setLoading('verifyOtp', false);
    }
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const store = get();
    try {
      store.setLoading('resetPassword', true);
      await api.post('/reset-password', data);
    } catch (error) {
      handleApiError(error, ERROR_MESSAGES.PASSWORD_RESET);
    } finally {
      store.setLoading('resetPassword', false);
    }
  },

  resendSignupOtp: async (data: ResendOtpRequest) => {
    const store = get();
    try {
      store.setLoading('resendOtp', true);
      await api.post('/resend-otp', data);
    } catch (error) {
      handleApiError(error, ERROR_MESSAGES.RESEND_OTP);
    } finally {
      store.setLoading('resendOtp', false);
    }
  },

  verifySignupOtp: async (data: VerifySignupOtpRequest) => {
    const store = get();
    try {
      store.setLoading('verifySignupOtp', true);
      await api.post('/verify-signup-otp', data);
    } catch (error) {
      handleApiError(error, ERROR_MESSAGES.VERIFY_SIGNUP);
    } finally {
      store.setLoading('verifySignupOtp', false);
    }
  }
});

export const useAuthStore = create<AuthState & ReturnType<typeof createAuthSlice>>()(
  persist(
    (set, get) => createAuthSlice(set, get),
    {
      name: 'auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user
      })
    }
  )
);