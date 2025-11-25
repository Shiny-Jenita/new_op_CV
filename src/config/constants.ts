export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    SIGNUP_VERIFY: '/signup-verify',
    TERMS: '/terms',
    FORGOT_PASSWORD: '/forgot-password',
    FORGOT_PASSWORD_VERIFY: '/verify-code',
    RESET_PASSWORD: '/reset-password',
    MY_PROFILE: '/my-profile',
    CREATE_NEW_PROFILE: '/create-new-profile',
    UPLOAD_RESUME: '/upload-resume',
  } as const;
  
  // export const GOOGLE_AUTH_URL = 'http://localhost:5000/api/v1/google-auth';
  export const GOOGLE_AUTH_URL = 'https://dev-api.optimizedcv.ai/api/v1/google-auth';
  
  export const ERROR_MESSAGES = {
    TERMS_REQUIRED: 'You must accept the Terms & Conditions to continue.',
    GOOGLE_AUTH_FAILED: 'Error during Google login.',
    SIGNUP_FAILED: 'Signup failed. Please try again.',
  } as const;