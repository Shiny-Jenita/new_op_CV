
"use client";
import React from "react";

interface CancelPlanPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelPlanPopup: React.FC<CancelPlanPopupProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    // overlay now also has backdrop-blur-sm
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            {/* “X” cancel icon */}
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-lg font-semibold">
          Do you want to Cancel your Plan?
        </h2>
        <p className="text-center text-gray-500 text-sm mt-2">
          Changes will be effective from the next billing cycle
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="border border-gray-300 px-4 py-2 rounded-md text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
            onClick={onConfirm}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPlanPopup;
