"use client";

import { Suspense, ReactNode } from "react";
import { Loader } from "./ui/loader";

const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={ <div className="flex justify-center items-center h-screen">
          <Loader /> 
        </div>}>{children}</Suspense>;
};

export default SuspenseWrapper;
