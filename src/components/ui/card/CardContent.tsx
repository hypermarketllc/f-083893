
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, compact, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        compact ? "p-3 pt-0" : "p-6 pt-0",
        className
      )} 
      {...props} 
    />
  )
);

CardContent.displayName = "CardContent";

export { CardContent };
