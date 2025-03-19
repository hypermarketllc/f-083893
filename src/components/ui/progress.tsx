
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  color?: "default" | "blue" | "green" | "red" | "yellow" | "purple";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  max?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, color = "default", size = "md", showValue = false, max = 100, ...props }, ref) => (
  <div className={cn("flex items-center gap-2", className)}>
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-full bg-muted",
        size === "sm" && "h-1",
        size === "md" && "h-2.5",
        size === "lg" && "h-4",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all",
          color === "default" && "bg-primary",
          color === "blue" && "bg-blue-500",
          color === "green" && "bg-green-500",
          color === "red" && "bg-red-500",
          color === "yellow" && "bg-yellow-500",
          color === "purple" && "bg-purple-500"
        )}
        style={{ transform: `translateX(-${100 - ((value || 0) / max * 100)}%)` }}
      />
    </ProgressPrimitive.Root>
    {showValue && (
      <span className="text-xs font-medium">{Math.round(value || 0)}%</span>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
