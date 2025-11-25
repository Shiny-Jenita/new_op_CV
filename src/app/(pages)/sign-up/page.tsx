'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitErrorHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth/authStore";
import { ROUTES, GOOGLE_AUTH_URL, ERROR_MESSAGES } from "@/config/constants";
import { signUpSchema } from "@/app/schemas/authSchemas";
import { SignUpFormValues } from "@/app/interfaces";

interface FormState {
  passwordVisibility: {
    password: boolean;
    confirmPassword: boolean;
  };
  terms: {
    isAgreed: boolean;
    error: string | null;
  };
}

const initialState: FormState = {
  passwordVisibility: {
    password: false,
    confirmPassword: false,
  },
  terms: {
    isAgreed: false,
    error: null,
  },
};

export default function SignUp() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleCodeProcessed = useRef(false);

  const {
    signup,
    loading,
    error,
    setError,
    googleVerify,
    flags: { isSignUpSuccess },
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    mode: "onSubmit",
  });

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");

  const passwordRules = [
    { label: "Minimum 8 characters", test: passwordValue.length >= 8 },
    { label: "At least one uppercase letter", test: /[A-Z]/.test(passwordValue) },
    { label: "At least one lowercase letter", test: /[a-z]/.test(passwordValue) },
    { label: "At least one number", test: /[0-9]/.test(passwordValue) },
    { label: "At least one special character (!@#$%^&*)", test: /[!@#$%^&*]/.test(passwordValue) },
  ];

  const onSubmit = async (data: SignUpFormValues) => {
    setFormErrors([]);
    if (!formState.terms.isAgreed) {
      setFormErrors([ERROR_MESSAGES.TERMS_REQUIRED]);
      return;
    }
    try {
      const response = await signup(data);
      if (response.success) {
        router.push(`${ROUTES.SIGNUP_VERIFY}?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err: any) {
      setFormErrors([err.message || "Signup failed. Please try again."]);
    }
  };

  const onError: SubmitErrorHandler<SignUpFormValues> = (errs) => {
    const messages = Object.values(errs).map(e => e.message!);
    setFormErrors(messages);
  };

  const handleGoogleAuth = async () => {
    if (googleCodeProcessed.current) return;
    const code = searchParams.get("code");
    if (!code) return;
    try {
      await googleVerify(code);
      googleCodeProcessed.current = true;
      router.push(isSignUpSuccess ? ROUTES.SIGNUP_VERIFY : ROUTES.LOGIN);
    } catch (err) {
      setFormErrors([ERROR_MESSAGES.GOOGLE_AUTH_FAILED]);
    }
  };

  useEffect(() => {
    setError(null);
    handleGoogleAuth();
  }, [setError]);

  const togglePasswordVisibility = (field: keyof FormState['passwordVisibility']) => {
    setFormState(prev => ({
      ...prev,
      passwordVisibility: {
        ...prev.passwordVisibility,
        [field]: !prev.passwordVisibility[field],
      },
    }));
  };

  const handleTermsChange = (checked: boolean) => {
    setFormState(prev => ({ ...prev, terms: { isAgreed: checked, error: null } }));
    setFormErrors([]);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:flex flex-1 relative bg-sky-900">
        <Image src="/left.svg" alt="Background" layout="fill" objectFit="cover" priority className="absolute inset-0" />
      </div>

      <div className="flex-1 bg-white p-6 md:p-10 overflow-y-auto hide-scrollbar">
        <div className="flex justify-end">
          <Image src="/logo.svg" alt="logo" width={180} height={180} />
        </div>

        <div className="flex justify-center items-center mt-4">
          <div className="w-full max-w-md px-4 md:px-8">
            <h2 className="text-3xl font-bold mb-6 text-sky-700">Sign up</h2>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {['firstName', 'lastName'].map(field => (
                  <div key={field}>
                    <Input
                      type="text"
                      placeholder={field === 'firstName' ? 'First Name' : 'Last Name'}
                      {...register(field as keyof SignUpFormValues)}
                      className={`border ${errors[field as keyof SignUpFormValues] ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-gray-400'} rounded-md w-full py-3 px-4`}
                    />
                  </div>
                ))}
              </div>

              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`border ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-gray-400'} rounded-md w-full py-3 px-4`}
              />

              {['password', 'confirmPassword'].map(field => (
                <div key={field} className="relative">
                  <Input
                    type={formState.passwordVisibility[field as keyof FormState['passwordVisibility']] ? 'text' : 'password'}
                    placeholder={field === 'password' ? 'Password' : 'Confirm Password'}
                    {...register(field as keyof SignUpFormValues)}
                    className={`pr-10 border ${errors[field as keyof SignUpFormValues] ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-gray-400'} rounded-md w-full py-3 px-4`}
                    onFocus={() => field === 'password' && setShowPasswordHint(true)}
                    onBlur={() => field === 'password' && setShowPasswordHint(false)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                    onClick={() => togglePasswordVisibility(field as keyof FormState['passwordVisibility'])}
                  >
                    <Image
                      src={formState.passwordVisibility[field as keyof FormState['passwordVisibility']] ? "/passwordEyeOpen.svg" : "/eyePasswordClosed.svg"}
                      alt="toggle visibility"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              ))}

              <Input
                type="text"
                placeholder="Referral Code (optional)"
                {...register("referalCode")}
                className="border border-gray-300 rounded-md w-full py-3 px-4"
              />

              {showPasswordHint && (
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-md text-sm">
                  <p className="font-medium text-gray-700 mb-2">Your password must contain:</p>
                  <ul className="space-y-1">
                    {passwordRules.map(rule => (
                      <li key={rule.label} className="flex items-center">
                        <span className={`${rule.test ? 'text-green-500' : 'text-gray-400'} mr-2`}>{rule.test ? '✓' : '○'}</span>
                        <span className={rule.test ? 'text-gray-900' : 'text-gray-500'}>{rule.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {formErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md text-sm mb-4">
                  <ul className="space-y-1 text-red-800 list-none">
                    {formErrors.map((msg, idx) => (
                      <li key={idx} className="flex items-center">
                        <span>{msg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center mt-3">
                <Checkbox
                  id="terms"
                  checked={formState.terms.isAgreed}
                  onCheckedChange={(checked) => handleTermsChange(checked as boolean)}
                />
                <label htmlFor="terms" className="text-gray-600 text-sm ml-2">
                  I&apos;m 18+ and accept the <Link href="/terms" className="text-sky-700 hover:underline">Terms & Conditions</Link>.
                </label>
              </div>

              <Button
                type="submit"
                className={`w-full bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md`}
                disabled={loading.signup}
              >
                {loading.signup ? (
                  <div className="w-6 h-6 border-4 border-t-transparent border-blue-200 border-solid rounded-full animate-spin" />
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>

            <div className="flex items-center my-5">
              <hr className="flex-grow border-gray-300" />
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <Button
              variant="outline"
              className="w-full flex justify-center items-center border border-gray-300 py-2 rounded-lg"
              onClick={() => {
                if (!formState.terms.isAgreed) {
                  setFormErrors([ERROR_MESSAGES.TERMS_REQUIRED]);
                } else {
                  window.location.href = GOOGLE_AUTH_URL;
                }
              }}
              disabled={loading.googleVerify}
            >
              <Image src="/Google.svg" alt="Google" width={20} height={20} />
              <span className="ml-2">Continue with Google</span>
            </Button>

            <p className="mt-4 text-sm text-center text-gray-500">
              Already a User? <Link href="/login" className="text-sky-700 hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
