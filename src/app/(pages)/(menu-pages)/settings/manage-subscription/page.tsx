"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import SettingsLayout from "@/components/settings/SettingsLayout";
import SubscriptionsDetails from "./subscribtion-details/page";
import SubscribeConfirmPopup from "@/components/settings/SubscribeConfirmPopup";
import ChangePlanModal from "@/components/settings/ChangePlanModal";
import CancelPlanPopup from "@/components/settings/CancelPlanPopup";
import CreditsInformation from "./subscribtion-details/CreditsInformation";

import {
  getUserSubscription,
  checkoutSubscribe,
} from "@/api/settings/subscriptions";
import { cancelSubscription } from "@/api/settings/paymentdetails";

interface PlanWithFeatures {
  name: string;
  price: string;
  period: string;
  priceId: string;
  features: string[];
}

const commonFeatures = [
  "Create Profile",
  "Add to Profile",
  "Access Templates",
  "Format resume from profile or scratch",
  "Share Profile",
  "Create Resume from JD",
  "Rewrite with AI",
];

const plans: PlanWithFeatures[] = [
  { name: "Free", price: "$0", period: "/month", priceId: "", features: commonFeatures },
  { name: "Monthly", price: "$15", period: "/monthly", priceId: "", features: commonFeatures },
  { name: "Semi-Annual", price: "$75", period: "/6 months", priceId: "", features: commonFeatures },
];

const Subscriptions: React.FC = () => {
  // UI/dialog state
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [pendingPriceId, setPendingPriceId] = useState<string>();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"plan" | "credits-info">("plan");
  const searchParams = useSearchParams();
  const [activePlanName, setActivePlanName] = useState("Free");
  const [subscriptionDataStatus, setSubscriptionDataStatus] = useState<"active" | "canceled" | "inactive">("inactive");
  const [subscriptionBanner, setSubscriptionBanner] = useState<string>("Free Plan");
  const [subscriptionLoading, setSubscriptionLoading] = useState<boolean>(true);
  const [credits, setCredits] = useState<number>(0);
  const [monthlyCredits, setMonthlyCredits] = useState<number>(0);
  const [extraCredits, setExtraCredits] = useState<number>(0);
  const [tokensLoading, setTokensLoading] = useState<boolean>(true);
  const [tokensError, setTokensError] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("profile-storage");
    if (!raw) return;
    try {
      const once = JSON.parse(raw);
      const parsed = typeof once === "string" ? JSON.parse(once) : once;
      const pd = parsed?.state?.profileData;
      const id = pd?.userId || pd?.userID;
      if (id) setUserId(id);
    } catch {
      console.error("Failed to parse profile-storage");
    }
  }, []);

  useEffect(() => {
    const st = searchParams.get("status");
    if (st === "success" || st === "failed") setLoading(false);
  }, [searchParams]);

  const fetchSummary = useCallback(async () => {
    if (!userId) return;

    setSubscriptionLoading(true);
    setTokensLoading(true);
    setTokensError(null);

    try {
      const resp = await getUserSubscription(userId);
      const {
        totalTokens,
        nonExpiringTokens,
        expiringTokens,
        isSubscribed,
        subscription,
      } = resp.data;

      // store subscription metadata
      setSubscriptionId(subscription?.subscriptionId ?? null);
      setEndDate(subscription?.endDate ?? null);

      // Map tokens
      setCredits(totalTokens);
      setMonthlyCredits(nonExpiringTokens);
      setExtraCredits(expiringTokens);

      // Determine plan
      const planName = isSubscribed ? (subscription.planName || "Free") : "Free";
      setActivePlanName(planName);

      // Determine status/banner
      if (subscription.status === "canceled") {
        setSubscriptionDataStatus("canceled");
        setSubscriptionBanner("Active until");
      } else {
        setSubscriptionDataStatus(isSubscribed ? "active" : "inactive");
        setSubscriptionBanner(isSubscribed ? "Active Plan" : "Free Plan");
      }
    } catch (err) {
      console.error("Failed to load token summary", err);
      setTokensError("Failed to load tokens");
      setSubscriptionDataStatus("inactive");
      setActivePlanName("Free");
      setSubscriptionBanner("Free Plan");
    } finally {
      setSubscriptionLoading(false);
      setTokensLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // cancel subscription
  const handleConfirmCancel = async () => {
    setShowCancelPopup(false);
    if (!subscriptionId) return;

    try {
      setLoading(true);
      await cancelSubscription(subscriptionId);
      await fetchSummary();
    } catch (err) {
      console.error("Failed to cancel subscription", err);
    } finally {
      setLoading(false);
    }
  };

  // subscribe flow
  const handlePlanSelect = (priceId: string) => {
    setPendingPriceId(priceId);
    setShowSubscribePopup(true);
  };
  const confirmSubscribe = async () => {
    setShowSubscribePopup(false);
    if (!pendingPriceId || !userId) return;
    setLoading(true);
    try {
      const { url } = await checkoutSubscribe(userId, pendingPriceId);
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
      setPendingPriceId(undefined);
    }
  };

  if (selectedPlan) {
    return <SubscriptionsDetails planName={selectedPlan} />;
  }

  const currentPlan = plans.find((p) => p.name === activePlanName)!;

  return (
    <SettingsLayout>
      <div className="relative w-full font-sora max-w-full h-[75vh] overflow-y-auto">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 sticky top-0 bg-white z-50">
          <button
            className={cn(
              "px-3 py-2 text-sm font-medium",
              activeTab === "plan"
                ? "text-sky-700 border-b-2 border-sky-700"
                : "text-gray-600 hover:text-gray-700"
            )}
            onClick={() => setActiveTab("plan")}
          >
            Plan & Billing
          </button>
          <button
            className={cn(
              "px-3 py-2 text-sm font-medium",
              activeTab === "credits-info"
                ? "text-sky-700 border-b-2 border-sky-700"
                : "text-gray-600 hover:text-gray-700"
            )}
            onClick={() => setActiveTab("credits-info")}
          >
            Token Information
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "plan" ? (
            <div className="space-y-4">
              {/* Your Plan */}
              <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  Your Plan
                  {subscriptionDataStatus === "canceled" && endDate && (
                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      Expires on{" "}
                      {new Date(endDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </h2>

                <div className="flex justify-between items-start bg-white p-4 rounded-lg shadow-sm border border-sky-700 min-h-[120px]">
                  {subscriptionLoading ? (
                    <div className="flex items-center justify-center w-full h-[80px]">
                      <div className="h-6 w-6 border-4 border-sky-700 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-gradient-to-r from-sky-700 to-blue-800 text-white text-xs font-medium px-2 py-1 rounded">
                            {currentPlan.name}
                          </span>
                        </div>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold">{currentPlan.price}</span>
                          <span className="text-xs text-gray-500 ml-1">{currentPlan.period}</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          className="bg-gradient-to-r from-sky-700 to-blue-800 text-white py-2 px-4 text-sm rounded shadow-md"
                          onClick={() => setShowChangePlanModal(true)}
                        >
                          Change Plan
                        </Button>
                        {currentPlan.name !== "Free" && (
                          subscriptionDataStatus === "canceled" ? (
                            <Button
                              variant="outline"
                              disabled
                              className="border-red-500 text-red-500 text-sm cursor-not-allowed rounded-full"
                            >
                              Cancelled
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50 text-sm rounded-full"
                              onClick={() => setShowCancelPopup(true)}
                            >
                              Cancel Plan
                            </Button>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Tokens */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Tokens</h2>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-700 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-700">Remaining Tokens:</span>
                    {tokensLoading ? (
                      <div className="h-4 w-4 border-2 border-sky-700 border-t-transparent rounded-full animate-spin" />
                    ) : tokensError ? (
                      <span className="text-red-500 text-xs">{tokensError}</span>
                    ) : (
                      <span className="flex items-center gap-1 font-medium">
                        <Image
                          src="/aiStar.svg"
                          alt="credit"
                          width={18}
                          height={18}
                          className="inline-block"
                        />
                        {credits}
                      </span>
                    )}
                  </div>
                  <Button
                    className="bg-gradient-to-r from-sky-700 to-blue-800 text-white py-2 px-4 text-sm rounded shadow-md"
                    onClick={() => setActiveTab("credits-info")}
                  >
                    Buy Tokens
                  </Button>
                </div>
              </div>

              {/* Invoices & Billing */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Invoices & Billing</h2>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-700 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <p className="text-sm text-gray-700">
                    Manage your invoices and billing details
                  </p>
                  <Button className="bg-gradient-to-r from-sky-700 to-blue-800 text-white py-2 px-4 text-sm rounded shadow-md">
                    Manage Billing
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <CreditsInformation
              credits={credits}
              setCredits={setCredits}
              monthlyCredits={monthlyCredits}
              setMonthlyCredits={setMonthlyCredits}
              extraCredits={extraCredits}
              setExtraCredits={setExtraCredits}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ChangePlanModal
        currentPlanName={activePlanName}
        subscriptionStatus={subscriptionDataStatus}
        isOpen={showChangePlanModal}
        onClose={() => setShowChangePlanModal(false)}
        onSubscribe={(priceId) => {
          handlePlanSelect(priceId);
          setShowChangePlanModal(false);
        }}
      />
      <SubscribeConfirmPopup
        open={showSubscribePopup}
        onClose={() => setShowSubscribePopup(false)}
        onConfirm={confirmSubscribe}
      />
      <CancelPlanPopup
        open={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleConfirmCancel}
      />
    </SettingsLayout>
  );
};

export default Subscriptions;
