import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GradientButtonProps = React.ComponentProps<typeof Button>;

export const GradientButton = ({ className, children, ...props }: GradientButtonProps) => {
  return (
    <Button
      className={cn(
        "bg-gradient-to-r from-sky-700 to-blue-800 text-white hover:opacity-90 py-3 rounded-lg shadow-md flex items-center gap-2 w-32 p-2 justify-start",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
