"use client";
import React, { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  title: string;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-xl mb-2 bg-white text-gray-800 shadow-lg">
      <button
        className="w-full flex justify-between items-center p-4 font-semibold text-lg text-sky-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {isOpen && <div className="p-4 ">{children}</div>}
    </div>
  );
};

export default Accordion;
