"use client";

import React from "react";
import { Check } from "lucide-react";

export interface SupportSuccessPopupProps {
  onClose: () => void;
}

const SupportSuccessPopup: React.FC<SupportSuccessPopupProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md relative"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-green-100 rounded-full">
            <Check className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold">Support message sent</h3>
          <p className="text-sm text-gray-600 text-center">
            We’ve received the message. Our dedicated team will be getting back to
            you in 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportSuccessPopup;
