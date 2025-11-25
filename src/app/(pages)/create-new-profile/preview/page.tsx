"use client";

import React from "react";
import SuspenseWrapper from "../../../../components/SuspenseWrapper";
import Image from "next/image";
import ProfileForm from "../ProfileCreationForm/ProfileForm";

const ProfileCreation = () => {

  return (
    <SuspenseWrapper>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">

        <div className="hidden md:flex flex-1 relative bg-sky-900 text-white justify-center items-center w-full h-full">
          <Image
            src={"/left.svg"}            
            alt="Background"
            layout="fill"
            objectFit="cover"
            priority
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <ProfileForm readOnly />
      </div>
    </SuspenseWrapper>
  );
};

export default ProfileCreation;
