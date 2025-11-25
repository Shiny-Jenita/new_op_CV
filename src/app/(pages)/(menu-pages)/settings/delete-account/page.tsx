
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SettingsLayout from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import DeleteAccountConfirm from "@/components/settings/DeleteAccountConfirm";
import { deleteAccount } from "@/api/settings";
import type { IDeleteAccountResponse } from "@/api/settings/interface";

const AccountDeletion = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const { success, message }: IDeleteAccountResponse = await deleteAccount(token);

      if (!success) {
        throw new Error(message || `Server indicated failure`);
      }
      router.push("/login");
    } catch (err: any) {
      console.error("Failed to delete account:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
      setConfirmText("");
    }
  };

  return (
    <SettingsLayout>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-sky-700">Account Deletion</h2>
        <p className="text-sm text-gray-500">
          By clicking this you will be proceeding to account deletion
        </p>

        <Button
          color="destructive"
          className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-md"
          onClick={() => setShowConfirm(true)}
        >
          Delete Account
        </Button>
      </div>

      {showConfirm && (
        <DeleteAccountConfirm
          confirmText={confirmText}
          onTextChange={setConfirmText}
          onClose={() => {
            setShowConfirm(false);
            setConfirmText("");
          }}
          onConfirm={handleDeleteAccount}
          isLoading={isDeleting}
        />
      )}
    </SettingsLayout>
  );
};

export default AccountDeletion;
