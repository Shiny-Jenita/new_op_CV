"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ResetSuccessPopupProps {
    open: boolean;
    onClose: () => void;
}

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

const tickVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeInOut", delay: 0.3 }
    }
};

const ResetSuccessPopup: FC<ResetSuccessPopupProps> = ({ open, onClose }) => {
    const router = useRouter();

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black z-40"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
                            <div className="flex justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-green-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <motion.path
                                        variants={tickVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h3 className="text-center text-xl font-semibold text-green-600">
                                Password Reset!
                            </h3>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Your password has been updated successfully. You’ll be redirected to the login page shortly.
                            </p>

                            <div className="mt-6 flex justify-center">
                                <Button
                                    className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 shadow-md"
                                    onClick={() => {
                                        onClose();
                                        router.push("/login");
                                    }}
                                >
                                    Go to Login
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ResetSuccessPopup;
