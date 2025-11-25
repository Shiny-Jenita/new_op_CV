"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/api/settings/resetpassword";
import ResetConfirmPopup from "@/components/settings/ResetConfirmPopup";
import ResetSuccessPopup from "@/components/settings/ResetSuccessPopup";
import { resetPasswordSchema } from "@/app/schemas/authSchemas";

interface FormValues {
  password: string;
  confirmPassword: string;
}

const PasswordUpdateForm = () => {
  const [email, setEmail] = useState<string>("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("profile-storage");
    if (!raw) return;
    try {
      const pd = JSON.parse(raw).state.profileData;
      setEmail(pd?.email || pd?.userEmail || "");
    } catch {
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
  } = useForm<FormValues>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password", "");

  const rules = [
    { label: "Min. 8 characters", test: watchedPassword.length >= 8 },
    { label: "One uppercase letter", test: /[A-Z]/.test(watchedPassword) },
    { label: "One lowercase letter", test: /[a-z]/.test(watchedPassword) },
    { label: "One digit", test: /[0-9]/.test(watchedPassword) },
    { label: "One special (!@#$%^&*)", test: /[!@#$%^&*]/.test(watchedPassword) },
  ];
  const allHintRulesPassed = rules.every((r) => r.test);

  const onSubmit = (data: FormValues) => {
    setShowConfirmPopup(true);
  };

  const onConfirmedReset = async () => {
    setShowConfirmPopup(false);
    setLoading(true);

    const { password, confirmPassword } = getValues();
    try {
      await resetPassword({ email, newPassword: password, confirmPassword });
      setShowSuccessPopup(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-sky-700">
          Update Password
        </h2>
        <p className="text-sm text-gray-500">
          Enter and confirm your new password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-left">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-500"
            >
              New Password
            </label>
            <div className="relative mt-1">
              <Input
                type={showNew ? "text" : "password"}
                id="password"
                placeholder="Enter new password"
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
                onClick={() => setShowNew((v) => !v)}
              >
                <Image
                  src={
                    showNew
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
              Confirm Password
            </label>
            <div className="relative mt-1">
              <Input
                type={showConfirm ? "text" : "password"}
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
                onClick={() => setShowConfirm((v) => !v)}
                disabled={!allHintRulesPassed}
              >
                <Image
                  src={
                    showConfirm
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
              <p className="font-medium text-gray-700 mb-2">
                Your password must contain:
              </p>
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
                    <span
                      className={rule.test ? "text-gray-900" : "text-gray-500"}
                    >
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
                  <li className="text-red-500">
                    {errors.confirmPassword.message}
                  </li>
                )}
              </ul>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md"
          >
            {loading ? "Processing..." : "Set Password"}
          </Button>
        </form>
      </div>

      <ResetConfirmPopup
        open={showConfirmPopup}
        onClose={() => setShowConfirmPopup(false)}
        onConfirm={onConfirmedReset}
      />

      <ResetSuccessPopup
        open={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </>
  );
};

export default PasswordUpdateForm;
