import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export type SocialPlatform =
   "LinkedIn"
   | "GitHub"
  | "Portfolio"
  | "Twitter"
  | "Other";

export const platformPrefixes: Record<SocialPlatform, string> = {
  LinkedIn: "",
  GitHub: "",
  Portfolio: "",
  Twitter: "",
  Other: "",
};

const getIconForPlatform = (platform: SocialPlatform, size: number) => {
  switch (platform) {
    case "LinkedIn":
      return <FaLinkedinIn size={size} />;
      case "GitHub":
        return <FaGithub size={size} />;
    case "Portfolio":
      return (
        <Image
          src={"/portfolio.svg"}
          alt="Portfolio Icon"
          width={size}
          height={size}
        />
      );
    case "Twitter":
      return <FaTwitter size={size} />;
    case "Other":
      return <CgProfile size={size} />;
    default:
      return null;
  }
};

export interface SocialInputProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value: string | undefined;
  onChange: (value: string) => void;
  platform: SocialPlatform;
  onPlatformChange: (platform: SocialPlatform) => void;
  availablePlatforms?: SocialPlatform[];
  removable?: boolean;
  onRemove?: () => void;
}

const SocialInput: React.FC<SocialInputProps> = ({
  value: parentValue,
  onChange: parentOnChange,
  platform = "LinkedIn", 
  onPlatformChange,
  availablePlatforms,
  removable,
  onRemove,
  className,
  ...props
}) => {
  const prefix = platformPrefixes[platform];

  const sanitize = (val: string | undefined) =>
    val && val !== "undefined" && val.trim() !== "" ? val : prefix;
  const initial = sanitize(parentValue);
  const [localValue, setLocalValue] = React.useState(initial);

  React.useEffect(() => {
    setLocalValue(sanitize(parentValue));
  }, [parentValue, prefix]);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const caretPosRef = React.useRef<number>(0);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    caretPosRef.current = e.target.selectionStart || 0;
    let newValue = e.target.value;
    if (!newValue.startsWith(prefix)) {
      newValue = prefix + newValue.slice(prefix.length);
      caretPosRef.current = Math.max(caretPosRef.current, prefix.length);
    }
    setLocalValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const pos = e.currentTarget.selectionStart || 0;
    if (pos <= prefix.length && (e.key === "Backspace" || e.key === "ArrowLeft")) {
      e.preventDefault();
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    parentOnChange(localValue);
  };

  React.useLayoutEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.setSelectionRange(caretPosRef.current, caretPosRef.current);
    }
  }, [localValue, isFocused]);

  const globalPlatforms: SocialPlatform[] = [
    
    "LinkedIn",
    "GitHub",
    "Portfolio",
    "Twitter",
    "Other",
  ];
  const options: SocialPlatform[] = availablePlatforms
    ? Array.from(new Set([...availablePlatforms, platform]))
    : globalPlatforms;

  return (
    <div className={cn("relative flex", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-12 bg-gray-100 rounded-[10px] rounded-r-none border-r-0 flex items-center gap-1 px-3"
          >
            {getIconForPlatform(platform, 30)}
            <ChevronDown size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-full">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onPlatformChange(option)}
              className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded w-full"
            >
              {getIconForPlatform(option, 16)}
              <span className="ml-3">{option
                }</span>
            </button>
          ))}
        </PopoverContent>
      </Popover>
      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={(e) => e.stopPropagation()}
        className="h-12 bg-gray-100 rounded-[10px] rounded-l-none pr-10"
        {...props}
      />
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Image src={"/trash.svg"} alt="Remove" width={16} height={16} />
        </button>
      )}
    </div>
  );
};

export default React.memo(SocialInput);
