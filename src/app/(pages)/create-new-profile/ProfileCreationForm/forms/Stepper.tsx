"use client";

import React from "react";
import Image from "next/image";

interface StepperProps {
  steps: string[];
  activeStep: number;
  isPreview?: boolean;
}

const Stepper: React.FC<StepperProps> = ({ steps, activeStep, isPreview = false }) => {
  return (
    <div className={`flex items-center ${isPreview ? 'mb-0 scale-75 -ml-8' : 'mb-8'}`}>
      {steps.map((label, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                ${isPreview || index < activeStep 
                  ? "border-[#345BA9] text-white bg-[#345BA9]"
                  : activeStep === index
                    ? "border-[#345BA9] text-[#345BA9]"
                    : "border-[#A1AEBE] text-[#A1AEBE]"
                }`}
            >
              {isPreview || index < activeStep ? (
                <Image src="/tick.svg" alt="Tick" width={14} height={14} />
              ) : index === 0 ? (
                <Image src="/BasicInfoIcon.svg" alt="info" width={14} height={14} />
              ) : index === 1 ? (
                <Image src="/workexp.svg" alt="Briefcase" width={14} height={14} />
              ) : (
                <Image src="/eduicon.svg" alt="Graduation Cap" width={14} height={14} />
              )}
            </div>
            <span
              className={`text-s ${index <= activeStep ? "text-[#2D6DA4]" : "text-[#A1AEBE]"}`}
            >
              {label}
            </span>
          </div>

          {index !== steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-2 ${activeStep > index ? "bg-[#1976D2]" : "bg-[#A1AEBE]"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};


export default Stepper;
