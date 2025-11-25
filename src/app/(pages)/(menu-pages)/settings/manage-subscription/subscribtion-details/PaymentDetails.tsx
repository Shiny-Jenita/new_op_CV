// File: pages/settings/PaymentDetails.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import InvoiceList from "./InvoiceList";
import CancelPlanPopup from "@/components/settings/CancelPlanPopup";

import {
  getSubscriptionData,
  cancelSubscription,
} from "@/api/settings/paymentdetails";
import { checkoutSubscribe } from "@/api/settings/subscriptions";
import { SubscriptionData } from "@/api/settings/paymentdetails/interface";

const FREE_FALLBACK: SubscriptionData = {
  subscriptionId: "",
  planName: "Free",
  price: 0,
  status: "canceled",
  startDate: "",
  endDate: "",
};

export default function PaymentDetails() {
  const [userId, setUserId] = useState<string | null>(null);
  const [subscription, setSubscription] =
    useState<SubscriptionData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // pull userId from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("profile-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const profile =
          typeof parsed === "string" ? JSON.parse(parsed) : parsed;
        const id =
          profile?.state?.profileData?.userId ||
          profile?.state?.profileData?.userID;
        if (id) setUserId(id);
      }
    } catch {
      console.error("Could not parse profile-storage");
    }
  }, []);

  // central refetch function
  const refetchSubscription = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSubscriptionData(userId);
      setSubscription(data);
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError("Failed to load subscription. Please refresh.");
      setSubscription(FREE_FALLBACK);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // initial fetch
  useEffect(() => {
    refetchSubscription();
  }, [refetchSubscription]);

  const handleViewInvoiceDetails = () => {
    if (!subscription) return;
    setSelectedInvoice(subscription.subscriptionId || subscription.planName);
  };

  const handleCancelPlan = async () => {
    if (!subscription?.subscriptionId) return;
    setCanceling(true);
    try {
      await cancelSubscription(subscription.subscriptionId);
      // instead of FREE_FALLBACK, re-fetch the real latest state
      await refetchSubscription();
    } catch (err) {
      console.error("Cancel subscription failed", err);
      setError("Could not cancel plan. Please try again.");
    } finally {
      setCanceling(false);
    }
  };

  const priceIds: Record<string, string | undefined> = {
    Basic: process.env.NEXT_PUBLIC_PRICE_PLAN_BASIC,
    Professional: process.env.NEXT_PUBLIC_PRICE_PLAN_PROFESSIONAL,
    Enterprise: process.env.NEXT_PUBLIC_PRICE_PLAN_ENTERPRISE,
  };

  const handleSubscribe = async (planName: string) => {
    if (!userId) return;
    const priceId = priceIds[planName];
    if (!priceId) {
      setError("Unable to subscribe to this plan.");
      return;
    }
    setLoading(true);
    try {
      const data = await checkoutSubscribe(userId, priceId);
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Subscription failed. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // invoice view
  if (selectedInvoice) {
    return <InvoiceList planName={selectedInvoice} />;
  }

  // loading / error states
  if (loading) return <div>Loading payment details…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!subscription) return null;

  // render
  const endDateLabel = subscription.endDate
    ? new Date(subscription.endDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const isActive = subscription.status === "active";
  const isCanceled = subscription.status === "canceled";

  const allPlans = ["Free", "Basic", "Professional", "Enterprise"];
  const otherPlans = allPlans.filter((p) => p !== subscription.planName);

  return (
    <div className="flex flex-col gap-4 max-w-lg overflow-auto">
      {/* Current subscription summary */}
      <Card className="border-2 border-sky-700 rounded-xl p-4">
        <div className="flex">
          <div className="w-1/2 pr-4 border-r border-sky-700">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Subscription
            </h3>
            <div className="bg-sky-700 p-2 rounded-md text-sm text-gray-200">
              {isActive ? (
                <>
                  <p>Your Next Payment</p>
                  <p>
                    is on{" "}
                    <span className="font-bold text-white">
                      {endDateLabel}
                    </span>
                  </p>
                </>
              ) : (
                <p>
                  Expires on{" "}
                  <span className="font-bold text-white">
                    {endDateLabel}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="w-2/3 pl-4">
            <h3 className="mb-2 font-medium text-gray-700 whitespace-nowrap">
              Payment Mode & Billing Details
            </h3>
            <div className="inline-block rounded-md bg-violet-500 px-4 py-1 text-white">
              <span className="font-medium">Stripe</span>
            </div>
            <div className="mt-2 border-t border-sky-700 pt-2">
              <p className="font-medium text-sky-700">Billing Invoice</p>
              <p
                className="mt-1 cursor-pointer text-sm text-gray-600"
                onClick={handleViewInvoiceDetails}
              >
                View Invoice
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Manage Plan */}
      <Card className="border-2 border-sky-700 rounded-xl">
        <div className="p-4">
          <h3 className="font-medium text-gray-700">Manage Plan</h3>
          <p className="mt-1 text-sm text-gray-600">
            Customize, downgrade or cancel your plan
          </p>

          <div className="mt-4 w-full rounded-xl bg-sky-700 p-4">
            <div className="mb-1 text-sm font-medium text-yellow-300">
              Current Plan
            </div>
            <div className="my-2 w-full border-t border-white" />
            <div className="flex w-full items-center justify-between">
              <div className="rounded-md bg-white px-6 py-2">
                <span className="font-medium text-gray-800">
                  {subscription.planName}
                </span>
              </div>
              <div className="ml-4 w-full text-right text-gray-200">
                {isActive ? (
                  <>
                    <p>Your Next Payment</p>
                    <p>
                      is on{" "}
                      <span className="font-bold text-white">
                        {endDateLabel}
                      </span>
                    </p>
                  </>
                ) : (
                  <p>
                    Expires on{" "}
                    <span className="font-bold text-white">
                      {endDateLabel}
                    </span>
                  </p>
                )}
                <button
                  onClick={() => setShowCancelPopup(true)}
                  disabled={canceling || isCanceled}
                  className="mt-2 rounded-md border border-white bg-sky-700 px-4 py-1 text-sm text-white disabled:opacity-50"
                >
                  {isCanceled
                    ? "Cancelled"
                    : canceling
                    ? "Canceling…"
                    : "Cancel Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-sky-700 p-4">
          <h3 className="mb-4 text-gray-600">Other Plans</h3>
          {otherPlans.map((plan) => (
            <div
              key={plan}
              className="mb-4 flex items-center justify-between rounded-md bg-sky-700 p-4"
            >
              <div className="rounded-md bg-white px-6 py-2">
                <span className="font-medium text-gray-800">{plan}</span>
              </div>
              <button
                // onClick={() => handleSubscribe(plan)}
                disabled={loading}
                className="rounded-md border border-white bg-sky-700 px-4 py-1 text-sm text-white disabled:opacity-50"
              >
                {loading ? "Subscribing…" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <CancelPlanPopup
        open={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={() => {
          setShowCancelPopup(false);
          handleCancelPlan();
        }}
      />
    </div>
  );
}
