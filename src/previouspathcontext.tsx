"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface PreviousPathContextType {
  previousPath: string | null;
  beforePreviousPath: string | null;
}

const PreviousPathContext = createContext<PreviousPathContextType | undefined>(undefined);

export const PreviousPathProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [beforePreviousPath, setBeforePreviousPath] = useState<string | null>(null);
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // On first load, restore from sessionStorage
      if (prevPathnameRef.current === null) {
        const storedPreviousPath = sessionStorage.getItem("previousPath");
        const storedBeforePreviousPath = sessionStorage.getItem("beforePreviousPath");
        
        setPreviousPath(storedPreviousPath);
        setBeforePreviousPath(storedBeforePreviousPath);
        prevPathnameRef.current = pathname;
        return;
      }

      // If pathname actually changed
      if (prevPathnameRef.current !== pathname) {
        // Shift the chain: beforePrevious ← previous ← current
        setBeforePreviousPath(previousPath);
        setPreviousPath(prevPathnameRef.current);
        
        // Update sessionStorage
        if (previousPath) {
          sessionStorage.setItem("beforePreviousPath", previousPath);
        }
        sessionStorage.setItem("previousPath", prevPathnameRef.current);
        
        // Update ref for next navigation
        prevPathnameRef.current = pathname;
      }
    }
  }, [pathname, previousPath]);

  return (
    <PreviousPathContext.Provider value={{ previousPath, beforePreviousPath }}>
      {children}
    </PreviousPathContext.Provider>
  );
};

export const usePreviousPath = () => {
  const context = useContext(PreviousPathContext);
  if (!context) {
    throw new Error("usePreviousPath must be used within a PreviousPathProvider");
  }
  return context;
};