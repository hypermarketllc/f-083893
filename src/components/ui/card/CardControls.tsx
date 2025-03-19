
import * as React from "react";
import { cn } from "@/lib/utils";

const CardIconButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "p-1 rounded-full text-muted-foreground hover:bg-muted transition-colors",
      className
    )}
    {...props}
  />
));

CardIconButton.displayName = "CardIconButton";

interface CardProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  color?: "default" | "blue" | "green" | "red" | "purple" | "yellow" | "orange" | "clickup";
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

const CardProgress = React.forwardRef<HTMLDivElement, CardProgressProps>(
  ({ className, value = 0, color = "default", showValue = false, size = "md", ...props }, ref) => (
    <div className={cn("flex items-center gap-2 w-full", className)} {...props}>
      <div
        ref={ref}
        className={cn(
          "w-full bg-gray-100 rounded-full overflow-hidden",
          size === "sm" && "h-1",
          size === "md" && "h-2",
          size === "lg" && "h-3"
        )}
      >
        <div 
          className={cn(
            "h-full transition-all duration-300",
            color === "default" && "bg-blue-500",
            color === "blue" && "bg-blue-500",
            color === "green" && "bg-green-500",
            color === "red" && "bg-red-500",
            color === "purple" && "bg-purple-500",
            color === "yellow" && "bg-yellow-500",
            color === "orange" && "bg-orange-500",
            color === "clickup" && "bg-[#7B68EE]"
          )}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      {showValue && (
        <span className="text-xs font-medium">{Math.round(value)}%</span>
      )}
    </div>
  )
);

CardProgress.displayName = "CardProgress";

export { CardIconButton, CardProgress };
