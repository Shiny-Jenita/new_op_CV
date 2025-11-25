"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl text-center">
        <CheckCircle className="mx-auto text-green-500 w-12 h-12 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Success!</h2>
        <p className="text-gray-600 mb-6">Your profile has been shared successfully.</p>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 shadow-md rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};
