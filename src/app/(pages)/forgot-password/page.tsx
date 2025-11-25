"use client";

import { useRouter } from "next/navigation";
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
import { ForgotPasswordFormValues } from "@/app/interfaces";
import { forgotPasswordSchema } from "@/app/schemas/authSchemas";
import { ROUTES } from "@/config/constants";
import { Loader } from "@/components/ui/loader";

const ForgotPassword = () => {
  const router = useRouter();
  const { forgotPassword, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (loading.resetPassword) return;

    try {
      const response = await forgotPassword({ email: data.email });

      if (response.status === "success") {
        toast.success("A verification email has been sent. Please check your inbox.", {
          autoClose: 3000,
        });
        router.push(`${ROUTES.FORGOT_PASSWORD_VERIFY}?email=${data.email}`);
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
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
            <Link href="/login" className="text-sm text-sky-700 hover:underline">
              Back to login
            </Link>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-sky-700 mb-2">
            Reset your Password?
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your email below to reset your password
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium text-gray-500">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`mt-2 border ${
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                    : "border-gray-300 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                } rounded-md shadow-sm w-full py-3 px-4`}
                disabled={loading.resetPassword}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex items-center justify-center"
              disabled={loading.resetPassword}
            >
              {loading.resetPassword ? (
                <Loader />
              ) : (
                "Send Verification Email"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;