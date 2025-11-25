"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, UserX, Bell, Shield } from "lucide-react";

interface SettingsNavItem {
  name: string;
  href: string;
  Icon: React.FC<any>;
}

const settingsNavItems: SettingsNavItem[] = [
  { name: "Manage Subscription", href: "/settings/manage-subscription", Icon: CreditCard },
  // { name: "Email Marketing", href: "/settings/email-marketing", icon: "/subscription.svg" },
  { name: "Delete Account", href: "/settings/delete-account", Icon: UserX },
  { name: "Help & Support", href: "/settings/support", Icon: Bell },
  { name: "Security", href: "/settings/security", Icon: Shield },
];

const SettingsSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white h-screen p-4 border-r shadow-md">
      <nav className="flex flex-col space-y-1">
        {settingsNavItems.map(({ name, href, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={name} href={href} passHref>
              <div
                className={`group flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 shadow-md"
                    : "text-gray-600 hover:bg-gradient-to-r from-sky-700 to-blue-800 hover:text-white hover:opacity-80"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-yellow-300" : "text-gray-800"
                  } group-hover:text-yellow-300`}
                />
                <span className="text-sm">{name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;