
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, compact, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        compact ? "p-3 pt-0" : "p-6 pt-0",
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = "CardFooter";

export { CardFooter };
