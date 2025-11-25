"use client";

import { Button } from "@/components/ui/button";

interface DeleteAccountConfirmProps {
  confirmText: string;
  onTextChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountConfirm = ({
  confirmText,
  onTextChange,
  onClose,
  onConfirm,
}: DeleteAccountConfirmProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Account Deletion</h3>
        <p className="text-sm text-gray-700 mb-4">
          To confirm account deletion, please type{" "}
          <span className="font-bold">CONFIRM</span> below.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Type CONFIRM"
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-md"
            disabled={confirmText !== "CONFIRM"}
            onClick={onConfirm}
          >
            Confirm Deletion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountConfirm;