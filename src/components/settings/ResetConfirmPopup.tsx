"use client";

import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ResetConfirmPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmPopup: FC<ResetConfirmPopupProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [input, setInput] = useState("");
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-500 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11c1.657 0 3-.895 3-2V7a3 3 0 10-6 0v2c0 1.105 1.343 2 3 2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
            />
          </svg>
        </div>
        <h3 className="text-center text-lg font-semibold text-gray-800">
          Please Confirm
        </h3>
        <p className="text-center text-sm text-gray-600">
          To change your password, type{" "}
          <span className="rounded bg-gray-100 px-1 font-mono text-gray-800">
            CONFIRM
          </span>{" "}
          below:
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Type CONFIRM"
        />

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 shadow-md"
            disabled={input !== "CONFIRM"}
            onClick={() => {
              setInput("");
              onConfirm();
            }}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmPopup;
