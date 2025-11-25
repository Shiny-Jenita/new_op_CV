"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/stores/auth/authStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResetPasswordFormValues } from "@/app/interfaces";
import { resetPasswordSchema } from "@/app/schemas/authSchemas";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword, loading } = useAuthStore();
  const email = searchParams.get("email");

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [showHint, setShowHint] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const watchedPassword = watch("password", "");
  const rules = [
    { label: "Min. 8 characters", test: watchedPassword.length >= 8 },
    { label: "One uppercase letter", test: /[A-Z]/.test(watchedPassword) },
    { label: "One lowercase letter", test: /[a-z]/.test(watchedPassword) },
    { label: "One digit", test: /[0-9]/.test(watchedPassword) },
    { label: "One special (!@#$%^&*)", test: /[!@#$%^&*]/.test(watchedPassword) },
  ];
  const allHintRulesPassed = rules.every((r) => r.test);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!email) {
      toast.error("No email found. Please go back and request a new password reset.");
      return;
    }

    try {
      await resetPassword({
        email,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <ToastContainer />
      <div className="hidden md:flex flex-1 relative bg-sky-900 text-white justify-center items-center w-full h-full">
        <Image
          src="/left.svg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="flex-1 flex justify-center items-center bg-white p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-row justify-end">
            <Image src="/logo.svg" alt="logo" width={180} height={180} />
          </div>
          <div className="flex items-center space-x-1 mb-4">
            <ChevronLeft className="h-5 w-5 text-gray-600 ml-[-4px]" />
            <Link href="/forgot-password" className="text-sm text-sky-700 hover:underline">
              Back to Forgot Password
            </Link>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-2">
            Set a Password
          </h2>
          <p className="text-gray-500 text-sm">
            Your previous password has been reset. Please set a new password for your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="text-left">
              <label htmlFor="password" className="block text-sm font-medium text-gray-500">
                Create Password
              </label>
              <div className="relative mt-1">
                <Input
                  type={passwordVisibility.password ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  onFocus={() => setShowHint(true)}
                  onBlur={() => setShowHint(false)}
                  className={`pr-10 border ${
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                      : "border-gray-300 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                  } rounded-md shadow-sm w-full py-3 px-4`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  <Image
                    src={
                      passwordVisibility.password
                        ? "/passwordEyeOpen.svg"
                        : "/eyePasswordClosed.svg"
                    }
                    alt="Toggle Password Visibility"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>

            <div className="text-left">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-500"
              >
                Re-Enter Password
              </label>
              <div className="relative mt-1">
                <Input
                  type={passwordVisibility.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Re-enter your password"
                  {...register("confirmPassword")}
                  disabled={!allHintRulesPassed}
                  className={`pr-10 border ${
                    errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                      : "border-gray-300 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                  } rounded-md shadow-sm w-full py-3 px-4`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  disabled={!allHintRulesPassed}
                >
                  <Image
                    src={
                      passwordVisibility.confirmPassword
                        ? "/passwordEyeOpen.svg"
                        : "/eyePasswordClosed.svg"
                    }
                    alt="Toggle Password Visibility"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>

            {showHint && (
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-md text-sm">
                <p className="font-medium text-gray-700 mb-2">Your password must contain:</p>
                <ul className="space-y-1">
                  {rules.map((rule) => (
                    <li key={rule.label} className="flex items-center">
                      <span
                        className={`${
                          rule.test ? "text-green-500" : "text-gray-400"
                        } mr-2`}
                      >
                        {rule.test ? "✓" : "○"}
                      </span>
                      <span className={rule.test ? "text-gray-900" : "text-gray-500"}>
                        {rule.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(errors.password || errors.confirmPassword) && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-md text-sm">
                <ul className="space-y-1">
                  {errors.password && (
                    <li className="text-red-500">{errors.password.message}</li>
                  )}
                  {errors.confirmPassword && (
                    <li className="text-red-500">{errors.confirmPassword.message}</li>
                  )}
                </ul>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md"
              disabled={loading.resetPassword}
            >
              {loading.resetPassword ? (
                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
