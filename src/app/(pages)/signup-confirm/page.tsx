"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SignupConfirm = () => {
  return (
    <div className="flex h-screen">
      <div className="hidden md:flex flex-1 relative">
        <Image
          src="/OptCvBg.svg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
          className="absolute inset-0"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-white px-4 md:px-14 mt-0 md:mt-96">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-center">
            Empowering Resumes with <span className="text-yellow-300">AI</span>{" "}
            Precision
          </h1>
          <p className="text-sm md:text-md text-center">
            Revolutionizing your resume creation with cutting-edge AI for <br />
            a smarter, faster, and tailored job hunt.
          </p>
        </div>
      </div>

      <div className="flex-1 justify-center items-center bg-white p-6 md:p-10">
        <div className="flex flex-row justify-end ">
          <Image src={'/logo.svg'} alt="logo" width={180}
            height={180} />
        </div>
        <div className="flex-1 flex justify-center items-center bg-white p-6 md:p-10 my-auto">
          <div className="w-full max-w-md ">
          <div className="flex justify-center mb-6">
            <Image
              src="/AllSet.svg"
              alt="Background"
              width={400}
              height={400}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#2E6DA4] text-white hover:bg-[#265C8A] py-3 rounded-lg shadow-md"
          >
            Continue to resume creation
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignupConfirm;
