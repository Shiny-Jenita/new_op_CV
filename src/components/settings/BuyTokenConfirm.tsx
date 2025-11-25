"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface BuyTokenConfirmProps {
  isOpen: boolean;
  tokenCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BuyTokenConfirm({
  isOpen,
  tokenCount,
  onConfirm,
  onCancel,
}: BuyTokenConfirmProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-sm p-6 flex flex-col items-center">
        <svg
          className="h-12 w-12 text-green-500 mb-4 animate-bounce"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeWidth="2"
            className="opacity-20"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M9 12l2 2 4-4"
          />
        </svg>

        <h3 className="text-lg font-semibold mb-2">Confirm Purchase</h3>

        <p className="text-sm text-center mb-6">
          Are you sure you want to purchase{" "}
          <span className="font-semibold">{tokenCount} Non-Expiring Tokens</span>
          ?
        </p>

        <div className="flex justify-end space-x-2 w-full">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-4 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 text-sm bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
