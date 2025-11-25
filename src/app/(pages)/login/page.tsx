"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth/authStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginFormValues } from "@/app/interfaces";
import { loginSchema } from "@/app/schemas/authSchemas";
import { ROUTES } from "@/config/constants";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleCodeProcessed = useRef(false);
  const { login, googleVerify, resendSignupOtp, loading, error, setError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });

  const handleGoogleAuth = async () => {
    if (googleCodeProcessed.current) return;

    const code = searchParams.get("code");
    if (!code) return;

    try {
      const response = await googleVerify(code);
      googleCodeProcessed.current = true;
      if (response?.isProfileCompleted) {
        router.push("/my-profile");
      } else {
        router.push("/upload-resume");
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      toast.error("Error during Google login. Please try again.");
    }
  };

  useEffect(() => {
    setError(null);
    handleGoogleAuth();
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data);
      if (response?.data.isProfileCompleted) {
        return router.push(ROUTES.MY_PROFILE);
      } else {
        return router.push(ROUTES.UPLOAD_RESUME);
      }
    }
    catch (err: any) {
      const msg = err?.response?.data?.message || err?.message;

      if (msg === "Please verify your email to login.") {
        try {
          await resendSignupOtp({ email: data.email });
          toast.success("Verification code resent to your inbox!");
        } catch (sendErr) {
          console.error("Failed to resend OTP:", sendErr);
          toast.error("Could not resend verification code. Please try again later.");
        }

        // then redirect into the verify-OTP page
        return router.push(
          `/signup-verify?email=${encodeURIComponent(data.email)}`
        );
      }

      setError(msg);
    }
  };

  const handleGoogleLogin = () => {
    // window.location.href = "http://localhost:5000/api/v1/google-auth";
    window.location.href = "https://dev-api.optimizedcv.ai/api/v1/google-auth";
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
      <div className="flex-1 justify-center items-center bg-white p-6 md:p-10">
        <div className="flex flex-row justify-end">
          <Image src={"/logo.svg"} alt="logo" width={180} height={180} />
        </div>
        <div className="flex justify-center items-center bg-white mt-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-sky-700">
                Sign in
              </h2>
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className={`border ${errors.email
                        ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                        : "border-gray-300 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                      } rounded-md shadow-sm w-full py-3 px-4`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...register("password")}
                      className={`border ${errors.password
                          ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
                          : "border-gray-300 focus-visible:ring-gray-400 focus-visible:border-gray-400"
                        } rounded-md shadow-sm w-full py-3 px-4`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 flex items-center bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Image
                        src={
                          showPassword
                            ? "/passwordEyeOpen.svg"
                            : "/eyePasswordClosed.svg"
                        }
                        alt="Toggle Password Visibility"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-sky-700 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md`}
                  disabled={loading.login}
                >
                  {loading.login ? (
                    <div className="w-6 h-6 border-4 border-t-transparent border-blue-200 border-solid rounded-full animate-spin" />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300" />
                <span className="px-4 text-gray-500 text-sm">Or</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <Button
                variant="outline"
                className="w-full flex justify-center items-center border border-gray-300 py-2 rounded-lg"
                onClick={handleGoogleLogin}
                disabled={loading.googleVerify}
              >
                <Image src="/Google.svg" alt="Google" width={20} height={20} />
                <span className="ml-2">Continue with Google</span>
              </Button>

              <div className="flex justify-center my-6">
                <hr className="w-3/4 border-gray-300" />
              </div>
              <p className="mt-6 text-sm text-center text-gray-500">
                New User?{" "}
                <Link href="/sign-up" className="text-sky-700 hover:underline">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
