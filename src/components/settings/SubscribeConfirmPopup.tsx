// File: components/settings/SubscribeConfirmPopup.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SubscribeConfirmPopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SubscribeConfirmPopup: React.FC<SubscribeConfirmPopupProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md p-6">
        {/* Icon at the top */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-sky-700" />
        </div>

        <h2 className="text-xl font-medium text-gray-900 mb-4">
          Confirm Subscription
        </h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to subscribe to this plan?
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 shadow-md"
          >
            Confirm
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SubscribeConfirmPopup;
