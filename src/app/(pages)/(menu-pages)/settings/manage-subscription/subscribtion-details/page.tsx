"use client"
import PaymentDetails from "./PaymentDetails";
import CurrentPlanCard from "./CurrentPlanCard";
import SettingsLayout from "@/components/settings/SettingsLayout";

const SubscriptionsDetails = () => {
  return (
    <SettingsLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Left side (PaymentDetails) */}
        <div
          className="w-[60%] overflow-y-auto pr-4 custom-scroll"
          style={{ height: "calc(104vh - 200px)" }}  // Ensures the height is full screen
        >
          <PaymentDetails />
        </div>

        {/* Right side (CurrentPlanCard) */}
        <div className="w-[30%] h-full flex flex-col  ">
          <CurrentPlanCard />
        </div>
      </div>

      {/* Tailwind + Custom CSS to hide scrollbar */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          display: none; /* Hide scrollbar UI */
        }
        .custom-scroll {
          -ms-overflow-style: none; /* Hide scrollbar in IE/Edge */
          scrollbar-width: none; /* Hide scrollbar in Firefox */
        }
      `}</style>
    </SettingsLayout>
  );
};

export default SubscriptionsDetails;
