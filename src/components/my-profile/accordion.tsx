import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const AccordionSection = ({
  title,
  defaultOpen = false,
  children,
}: AccordionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 w-full">
          <h2 className="text-xl font-semibold text-[#2a6baa]">{title}</h2>
          {isOpen && <div className="h-[1px] bg-sky-700 flex-grow ml-2"></div>}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default AccordionSection;
