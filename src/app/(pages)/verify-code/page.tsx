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
import { VerifyCodeFormValues } from "@/app/interfaces";
import { verifyCodeSchema } from "@/app/schemas/authSchemas";
import { ROUTES } from "@/config/constants";

const VerifyCode = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyOtp, forgotPassword, loading } = useAuthStore();
  const email = searchParams.get("email");

  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeFormValues>({
    resolver: yupResolver(verifyCodeSchema),
  });

  // Handle OTP submission
  const onSubmit = async (data: VerifyCodeFormValues) => {
    if(loading.verifyOtp){
      return;
    }
    if (!email) {
      toast.error("No email found. Please go back and request a new OTP.");
      return;
    }
    try {
      await verifyOtp({ email, otp: data.otp });
      toast.success("OTP Verified Successfully!");
      setTimeout(() => {
        router.push(`${ROUTES.RESET_PASSWORD}?email=${email}`);
      }, 2000);
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (!email) {
      toast.error("No email found. Please go back and request a new OTP.");
      return;
    }
    if (resendCooldown > 0) return;

    try {
      setResendCooldown(30);
      await forgotPassword({ email });
      toast.success("New OTP sent to your email.");

      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <ToastContainer />

      {/* Left Section */}
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

      {/* Right Section */}
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

          <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-2">Verify Code</h2>
          <p className="text-gray-500 text-sm">
            An authentication code has been sent to <strong>{email || "your email"}</strong>.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="text-left">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-500">
                Enter Code
              </label>
              <Input
                type="text"
                id="otp"
                placeholder="Enter your OTP"
                {...register("otp")}
                className={`mt-2 border ${
                  errors.otp
                    ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                    : "border-gray-300 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                } rounded-md shadow-sm w-full py-3 px-4`}
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
            </div>

            <div className="flex items-center space-x-1 text-gray-600 text-sm">
              <span>Did not receive a code?</span>
              <button
                type="button"
                className={`text-red-500 font-medium hover:underline ${
                  resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex justify-center items-center"
              disabled={loading.verifyOtp}
            >
              {loading.verifyOtp ? (
                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;