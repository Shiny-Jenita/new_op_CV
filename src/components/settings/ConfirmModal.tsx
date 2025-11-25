import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react"; // Spinner icon

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [sending, setSending] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleConfirm = () => {
    if (disabled) return;
    setSending(true);
    setDisabled(true);
    onConfirm();

    timerRef.current = window.setTimeout(() => {
      setSending(false);
      setDisabled(false);
      timerRef.current = null;
    }, 10_000); // Reset after 10 seconds
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Confirm Send
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to share your profile?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
            disabled={sending}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={disabled}
            className={`
              px-4 py-2 bg-gradient-to-r from-sky-700 to-blue-800 text-white 
              hover:opacity-90 shadow-md rounded-md flex items-center justify-center gap-2
              ${disabled ? "opacity-50 cursor-not-allowed hover:opacity-50" : ""}
            `}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Yes, Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
