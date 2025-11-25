import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CreditsInformationProps,
} from "@/api/settings/subscriptions/interface";
import { PurchasePackageWithPriceId } from "@/api/settings/subscriptions/purchasetokens/interface";
import { createTokenPurchaseSession } from "@/api/settings/subscriptions/purchasetokens";
import { BuyTokenConfirm } from "@/components/settings/BuyTokenConfirm";

const PURCHASE_PACKAGES: PurchasePackageWithPriceId[] = [
  { amount: 20000, price: "$5",  priceId: "price_1RW9YdCm6lUrd7Q9sfYKWnQA" },
  { amount: 35000, price: "$8",  priceId: "price_1RW9ZHCm6lUrd7Q9cvrWa0va" },
  { amount: 50000, price: "$10", priceId: "price_1RW9aGCm6lUrd7Q9V5YrVwGo" },
];

const CreditsInformation: React.FC<CreditsInformationProps> = ({
  totalCredits,
  monthlyCredits,
  extraCredits,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasePackageWithPriceId | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("profile-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const twice = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
        const profile = twice.state?.profileData;
        const id = profile?.userId || profile?.userID;
        if (id) {
          setUserId(id);
        }
      }
    } catch (e) {
      console.error("profile-storage parse error", e);
    }
  }, []);

  const handleBuyClick = (pkg: PurchasePackageWithPriceId) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) {
      console.error("No package selected.");
      setIsModalOpen(false);
      return;
    }
    if (!userId) {
      console.error("User ID not found. Redirect to login or show error.");
      setIsModalOpen(false);
      return;
    }

    try {
      const payload = {
        priceId: selectedPackage.priceId,
        userId,
      };

      const data = await createTokenPurchaseSession(payload);
      window.location.href = data.url;
    } catch (err: any) {
      console.error(
        "Error while creating purchase session:",
        err?.response?.data || err.message
      );
    } finally {
      setIsModalOpen(false);
      setSelectedPackage(null);
    }
  };

  const handleCancelPurchase = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <div className="space-y-3 text-sm">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        Tokens
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white p-3 rounded-md shadow-sm border border-sky-700 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold">{monthlyCredits}</span>
          <span className="text-xs text-gray-600 mt-1">
            Non-Expiring Tokens
          </span>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm border border-sky-700 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold">{extraCredits}</span>
          <span className="text-xs text-gray-600 mt-1">Expiring Tokens</span>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold mt-4 mb-2">Buy Non-Expiring Tokens</h2>
        <div className="grid grid-cols-2 gap-2">
          {PURCHASE_PACKAGES.map((pkg, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-md shadow-sm border border-sky-700 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center mr-2">
                  <Image
                    src="/aiStar.svg"
                    alt="credit"
                    width={16}
                    height={16}
                  />
                </div>
                <div>
                  <span className="font-semibold text-sm">{pkg.amount}</span>
                  <p className="text-xs text-gray-600">Tokens</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">{pkg.price}</span>
                <Button
                  className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-2 px-3 text-xs rounded shadow"
                  onClick={() => handleBuyClick(pkg)}
                >
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BuyTokenConfirm
        isOpen={isModalOpen}
        tokenCount={selectedPackage?.amount ?? 0}
        onConfirm={handleConfirmPurchase}
        onCancel={handleCancelPurchase}
      />
    </div>
  );
};

export default CreditsInformation;
