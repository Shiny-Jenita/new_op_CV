
"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

import { getSubscriptionData } from "@/api/settings/paymentdetails";
import { SubscriptionData,PlanConfig } from "@/api/settings/currentplancard/interface";

const featureMap: Record<string, string[]> = {
  Free: [
    "Create Profile",
    "Add to Profile",
    "Access Templates",
    "Format resume from profile or scratch",
    "Share Profile",
    "Create Resume from JD",
    "Rewrite with AI",
  ],
  Basic: [
    "Create Profile",
    "Add to Profile",
    "Access Templates",
    "Format resume from profile or scratch",
    "Share Profile",
    "Create Resume from JD",
    "Rewrite with AI",
  ],
  Professional: [
    "Create Profile",
    "Add to Profile",
    "Access Templates",
    "Format resume from profile or scratch",
    "Share Profile",
    "Create Resume from JD",
    "Rewrite with AI",
  ],
  Enterprise: [
    "Create Profile",
    "Add to Profile",
    "Access Templates",
    "Format resume from profile or scratch",
    "Share Profile",
    "Create Resume from JD",
    "Rewrite with AI",
  ],
};

export default function CurrentPlanCard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("profile-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const twice = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
        const profile = twice.state?.profileData;
        const id = profile?.userId || profile?.userID;
        if (id) setUserId(id);
      }
    } catch (e) {
      console.error("profile-storage parse error", e);
    }
  }, []);

  // 2️⃣ Fetch subscription via API util
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getSubscriptionData(userId)
      .then((data) => setSubscription(data))
      .catch((err) => {
        console.error("Error loading subscription", err);
        setSubscription({
          planName: "Free",
          price: 0,
          isSubscribed: false,
          startDate: "",
          endDate: "",
        });
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading current plan…</div>;
  if (!subscription) return null;

  const planName = subscription.planName;
  const plan: PlanConfig = {
       name: planName,
       price: subscription.price > 0 ? `$${subscription.price}` : "Free",
       period: planName === "Free" ? "" : "/monthly",
       features: featureMap[planName] ?? featureMap.Free,
       isFree: planName === "Free",
      };

  return (
    <div className="relative w-full font-sora">
      <div className="grid grid-cols-1 gap-6 p-4">
        <Card className="group relative border border-gray-200 shadow-lg bg-sky-700 h-full flex flex-col transition-all duration-300 hover:scale-105 text-white">
          <div className="absolute -top-3 right-4 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-md">
            Current Plan
          </div>

          <CardContent className="pt-4 flex-grow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white">
                <Image src="/logoicon.svg" alt="logo" width={30} height={30} />
              </div>
              <div>
                <p className="text-sm opacity-80">Plan</p>
                <p className="font-semibold text-lg">
                  {plan.name}
                  {plan.isFree ? "" : " (Tokens)"}
                </p>
              </div>
            </div>

            <div className="mb-2 text-4xl font-bold">
              {plan.price}
              {!plan.isFree && (
                <span className="text-lg opacity-70 ml-1">{plan.period}</span>
              )}
            </div>

            {subscription.startDate && (
              <p className="text-xs opacity-80 mb-4">
                Valid:{" "}
                {new Date(subscription.startDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                –{" "}
                {new Date(subscription.endDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}

            <div>
              <p className="text-sm font-bold mb-2">What&apos;s included</p>
              <ul className="space-y-2">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-white text-sky-700">
                      <Check size={12} />
                    </span>
                    <span className="text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
