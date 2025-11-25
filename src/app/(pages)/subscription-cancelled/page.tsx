"use client";

import React, { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SubscriptionCancelledProps {
  onClose: () => void;
}

const SubscriptionCancelled = ({ onClose }: SubscriptionCancelledProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      localStorage.removeItem("subscriptionCancelled");
    };
  }, []);

  if (!isMounted) return null;

  const handleContinue = () => {
    router.push("/settings/manage-subscription");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-[90%] h-[90%] bg-white rounded-2xl shadow-xl border border-gray-100/30 p-8 z-20 flex flex-col items-center justify-center overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="relative w-32 h-32 mb-8 flex items-center justify-center"
        >
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-md shadow-red-300/30">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <X className="text-white w-12 h-12" strokeWidth={2.5} />
            </motion.div>
          </div>
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Subscription Cancelled
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="text-gray-600 mb-8 max-w-md"
          >
            Your subscription has been cancelled. If this was a mistake, please try again or contact support.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          <motion.button
            onClick={handleContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 text-white px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 font-medium"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SubscriptionCancelled;
