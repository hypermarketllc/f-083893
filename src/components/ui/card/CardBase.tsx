
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  variant?: "default" | "project" | "task" | "widget" | "clickup";
  borderColor?: "blue" | "green" | "red" | "yellow" | "purple" | "default" | "orange";
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient, variant = "default", borderColor = "default", hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
        variant === "project" && "border-l-4",
        variant === "task" && "border-l-4 hover:shadow-md",
        variant === "widget" && "bg-gradient-to-br overflow-hidden",
        variant === "clickup" && "border-t-0 border-r-0 border-b border-l-4 rounded-none px-2 py-2.5 hover:bg-muted/30",
        borderColor === "blue" && "border-l-blue-500",
        borderColor === "green" && "border-l-green-500",
        borderColor === "red" && "border-l-red-500",
        borderColor === "yellow" && "border-l-yellow-500",
        borderColor === "purple" && "border-l-purple-500",
        borderColor === "orange" && "border-l-orange-500",
        borderColor === "default" && "border-l-border",
        hover && "cursor-pointer hover:shadow-md",
        gradient && "bg-gradient-to-br",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

export { Card };
