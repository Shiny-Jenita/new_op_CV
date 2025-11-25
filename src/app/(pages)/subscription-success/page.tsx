'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SubscriptionSuccessfulProps {
  onClose: (sessionId?: string | null) => void;
}

const SubscriptionSuccessful = ({ onClose }: SubscriptionSuccessfulProps) => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const router = useRouter(); 

  const [showConfetti, setShowConfetti] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (sessionId) {
      console.log('Stripe Session ID:', sessionId);

    }

    const timer = setTimeout(() => setShowConfetti(true), 300);
    return () => {
      clearTimeout(timer);
      localStorage.removeItem('paymentSuccess');
    };
  }, [sessionId]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          scale: { type: 'spring', stiffness: 200, damping: 15 },
        }}
        className="relative w-[90%] h-[90%] bg-white rounded-2xl shadow-xl border border-gray-100/30 p-8 z-20 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0, y: [-2, 2, -2] }}
          transition={{
            scale: { type: 'spring', stiffness: 300, damping: 10, delay: 0.2 },
            rotate: { duration: 0.4, ease: 'backOut' },
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative w-32 h-32 mb-8 flex items-center justify-center"
        >
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-md shadow-green-300/30">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
            >
              <Check className="text-white w-12 h-12" strokeWidth={2.5} />
            </motion.div>
          </div>
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
            className="text-gray-600 mb-8 max-w-md"
          >
            Your transaction has been processed and a receipt has been sent to your email.
          </motion.p>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          className="w-full flex justify-center"
        >
          <motion.button
            onClick={() => router.push("/settings/manage-subscription")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 text-white px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 font-medium"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    y: -10,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  animate={{
                    y: '120vh',
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    delay: i * 0.05,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className={`absolute w-2 h-2 rounded-full ${
                    ['bg-green-400/80', 'bg-emerald-400/80', 'bg-teal-400/80', 'bg-cyan-400/80', 'bg-sky-400/80'][i % 5]
                  }`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    x: Math.random() * 40 - 20,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SubscriptionSuccessful;
