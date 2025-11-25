"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch"; // ShadCN Switch component
import SettingsLayout from "@/components/settings/SettingsLayout";

const EmailMarketing = () => {
  const [importantUpdates, setImportantUpdates] = useState(true); // State for Important Updates
  const [featureUpdates, setFeatureUpdates] = useState(false); // State for Feature Updates

  const handleImportantUpdatesToggle = () => {
    setImportantUpdates(!importantUpdates); // Toggle Important Updates
  };

  const handleFeatureUpdatesToggle = () => {
    setFeatureUpdates(!featureUpdates); // Toggle Feature Updates
  };

  return (
    <SettingsLayout>
    <div className="space-y-4">
      <h2 className="text-2xl font-medium text-gray-700 ">
        Stay Informed & Never Miss an Update
      </h2>
      <p className="text-sm text-gray-500">
        Enable notifications to receive important updates, feature enhancements
      </p>

      {/* Important Updates */}
      <div className="flex items-center space-x-4">
        <Switch
          checked={importantUpdates}
          onCheckedChange={handleImportantUpdatesToggle}
        />
        <span className="text-sm text-gray-700">Important Updates</span>
      </div>

      {/* Feature Updates */}
      <div className="flex items-center space-x-4">
        <Switch
          checked={featureUpdates}
          onCheckedChange={handleFeatureUpdatesToggle}
        />
        <span className="text-sm text-gray-700">Feature Updates</span>
      </div>
    </div>
    </SettingsLayout>
  );
};

export default EmailMarketing;
