"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChangePlanModalProps {
  currentPlanName: string;
  subscriptionStatus: "active" | "canceled" | "inactive" | null;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (priceId: string) => void;
}

const ChangePlanModal: React.FC<ChangePlanModalProps> = ({
  currentPlanName,
  subscriptionStatus,
  isOpen,
  onClose,
  onSubscribe,
}) => {
  if (!isOpen) return null;

  // define features per plan
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/monthly",
      priceId: "",
      features: [
        "Profile Management",
        "Share Profile",
        "AI Optimization",
        "Resume Templates",
        "Resume Editor",
        "No Branding",
        "3 Downloads (PDF Only)",
      ],
    },
    {
      name: "Monthly",
      price: "$15",
      period: "/monthly",
      priceId: "price_1RImAJCm6lUrd7Q9XfsRJAQY",
      features: [
        "Profile Management",
        "Share Profile",
        "AI Optimization",
        "Resume Templates",
        "Resume Editor",
        "No Branding",
        "Unlimited Downloads (PDF & Docx)",
        "Saved Job Descriptions",
        "Create Resume from Job Description",
      ],
    },
    {
      name: "Semi-Annual",
      price: "$75",
      period: "/6 months",
      priceId: "price_1RImCYCm6lUrd7Q9tgPv5mre",
      features: [
        "Profile Management",
        "Share Profile",
        "AI Optimization",
        "Resume Templates",
        "Resume Editor",
        "No Branding",
        "Unlimited Downloads (PDF & Docx)",
        "Saved Job Descriptions",
        "Create Resume from Job Description",
      ],
    },
  ];

  const canSubscribe = subscriptionStatus === "inactive";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[100vh] p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Change Plan</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.name === currentPlanName;

            return (
              <Card
                key={plan.name}
                className={cn(
                  "group relative border border-gray-200 shadow-lg bg-white h-full flex flex-col transition-all duration-300 hover:scale-105 hover:bg-sky-700 hover:text-white hover:border-sky-700",
                  isCurrent && "bg-sky-700 text-white border-sky-700"
                )}
              >
                {isCurrent && (
                  <div className="absolute -top-3 right-4 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-md">
                    Current Plan
                  </div>
                )}

                <CardContent className="pt-4 flex-grow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div>
                      <p className={cn("text-sm opacity-80", isCurrent && "text-white")}>Plan</p>
                      <p
                        className={cn(
                          "font-semibold text-3xl",
                          isCurrent ? "text-white" : "text-sky-700 group-hover:text-white"
                        )}
                      >
                        {plan.name}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span
                      className={cn(
                        "text-4xl font-bold",
                        isCurrent ? "text-white" : "text-gray-900 group-hover:text-white"
                      )}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={cn(
                        "text-lg opacity-70 ml-1",
                        isCurrent ? "text-white" : "text-gray-700 group-hover:text-white"
                      )}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <div>
                    <p
                      className={cn(
                        "text-sm font-bold mb-4",
                        isCurrent ? "text-white" : "text-gray-800 group-hover:text-white"
                      )}
                    >
                      What&apos;s included
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span
                            className={cn(
                              "mr-2 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                              isCurrent
                                ? "bg-white text-sky-700"
                                : "bg-sky-700 text-white group-hover:bg-white group-hover:text-sky-700"
                            )}
                          >
                            <Check size={12} />
                          </span>
                          <span
                            className={cn(
                              "text-sm",
                              isCurrent ? "text-white" : "text-gray-700 group-hover:text-white"
                            )}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="pb-6">
                  {isCurrent ? (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-sky-700 bg-white border-white hover:bg-white rounded-full"
                      onClick={onClose}
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full rounded-full",
                        canSubscribe
                          ? "bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
                          : "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed"
                      )}
                      onClick={() => canSubscribe && onSubscribe(plan.priceId)}
                      disabled={!canSubscribe}
                    >
                      Subscribe
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChangePlanModal;
