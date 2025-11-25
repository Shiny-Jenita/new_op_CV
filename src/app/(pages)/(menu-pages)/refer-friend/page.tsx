"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
  FaEllipsisH,
  FaCopy,
  FaLink,
} from "react-icons/fa";

const socialIcons = [
  { icon: FaFacebookF, key: "facebook" },
  { icon: FaWhatsapp, key: "whatsapp" },
  { icon: FaEnvelope, key: "email" },
  { icon: FaEllipsisH, key: "more" },
];

const referralSteps = [
  {
    src: "/add-user.svg",
    title: "Invite your friends",
    description:
      "Share your personalized referral link via email or social media and help others discover what Optimized CV has to offer.",
  },
  {
    src: "/wallet.svg",
    title: "They save",
    description:
      "When your referrals sign up for a subscription, they’ll get a 10% discount on their first payment.",
  },
  {
    src: "/reward.svg",
    title: "You earn rewards",
    description:
      "Once they make their first subscription purchase, you’ll earn 10% of their payment in Optimized CV Credits, which you can use toward your own subscription.",
  },
];

const Referral = () => {
  return (
    // Set overall container to 80vh and reduce overall padding
    <div className="p-4 h-[80vh] mx-auto bg-white shadow-md rounded-lg w-full flex flex-col">
      {/* Top Card Area */}
      <Card className="p-4 flex flex-col md:flex-row justify-between items-start">
        <div className="w-full md:w-3/5 pr-4">
          <h2 className="text-2xl font-bold text-sky-700">Refer & Rewards</h2>

          <div className="relative mt-3 flex items-center w-full">
            <div className="flex items-center border border-sky-700 rounded-md px-2 h-10 w-full md:w-[70%]">
              <Input
                type="text"
                value="optimizedcv.referal-program"
                readOnly
                className="border-none flex-1 text-gray-700 focus:ring-0 focus:outline-none px-2 h-full text-sm"
              />
              <FaLink className="text-sky-700 ml-1" size={14} />
            </div>

            <Button className="bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md px-3 flex items-center gap-1 ml-2 h-10 text-sm">
              <FaCopy size={12} /> Copy Link
            </Button>
          </div>

          <div className="relative my-3 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 my-2 text-gray-500 font-semibold bg-white px-1 text-xs">
              Or
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center gap-2">
            {socialIcons.map(({ icon: Icon, key }) => (
              <Button
                key={key}
                variant="outline"
                size="icon"
                className="border-sky-700 text-sky-700 p-2"
              >
                <Icon size={14} />
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-2/5 border-l border-gray-300 pl-4 mt-4 md:mt-0">
          <CardContent className="p-3">
            <h3 className="text-base font-semibold text-gray-500">
              Your Referrals, Your Rewards!
            </h3>
            <p className="text-xs text-gray-500">
              Based on your referrals, you’ve earned:
            </p>
            <p className="text-base font-bold text-gray-500">$45 Credits</p>
            <p className="text-base font-bold text-gray-500">23 Tokens</p>
            <p className="text-xs mt-2 text-gray-500">
              Keep referring and keep earning!
            </p>
          </CardContent>
        </div>
      </Card>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3"></div>

      {/* Referral Steps Section */}
      <div className="px-2 md:px-4 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-sky-700">
          Earn effortlessly through referrals
        </h3>

        <div className="mt-3 border-2 border-dashed border-sky-700 p-4 rounded-lg grid md:grid-cols-3 gap-4 flex-1">
          {referralSteps.map(({ src, title, description }) => (
            <div key={title} className="flex flex-col">
              <Image src={src} alt={title} width={30} height={30} />
              <h4 className="text-base font-semibold text-sky-700 mt-1">
                {title}
              </h4>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          ))}
        </div>

        <div className="text-gray-500 text-[10px] mt-2">
          <span>📄 Terms & Conditions</span>
        </div>
      </div>
    </div>
  );
};

export default Referral;
