
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, compact, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5",
        compact ? "p-3" : "p-6",
        className
      )}
      {...props}
    />
  )
);

CardHeader.displayName = "CardHeader";

export { CardHeader };
