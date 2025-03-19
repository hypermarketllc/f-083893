
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  color?: "default" | "blue" | "green" | "red" | "yellow" | "purple" | "clickup";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  max?: number;
  indeterminate?: boolean;
  withGradient?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, color = "default", size = "md", showValue = false, max = 100, indeterminate = false, withGradient = false, ...props }, ref) => (
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
          indeterminate && "animate-[move-left-right_2s_ease-in-out_infinite]",
          withGradient && "bg-gradient-to-r",
          color === "default" && "bg-primary",
          color === "blue" && (withGradient ? "from-blue-400 to-blue-600" : "bg-blue-500"),
          color === "green" && (withGradient ? "from-green-400 to-green-600" : "bg-green-500"),
          color === "red" && (withGradient ? "from-red-400 to-red-600" : "bg-red-500"),
          color === "yellow" && (withGradient ? "from-yellow-400 to-yellow-600" : "bg-yellow-500"),
          color === "purple" && (withGradient ? "from-purple-400 to-purple-600" : "bg-purple-500"),
          color === "clickup" && (withGradient ? "from-[#7B68EE] to-[#4D4CAC]" : "bg-[#7B68EE]")
        )}
        style={{ 
          transform: `translateX(-${100 - ((value || 0) / max * 100)}%)`,
          // Apply custom animation for indeterminate progress
          animation: indeterminate ? "move-left-right 2s ease-in-out infinite" : undefined,
        }}
      />
    </ProgressPrimitive.Root>
    {showValue && (
      <span className="text-xs font-medium">
        {indeterminate ? "Loading..." : `${Math.round(value || 0)}%`}
      </span>
    )}
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
