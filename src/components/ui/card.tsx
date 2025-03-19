
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: boolean;
    variant?: "default" | "project" | "task" | "widget" | "clickup";
    borderColor?: "blue" | "green" | "red" | "yellow" | "purple" | "default" | "orange";
    hover?: boolean;
  }
>(({ className, gradient, variant = "default", borderColor = "default", hover = false, ...props }, ref) => (
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
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean;
  }
>(({ className, compact, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5",
      compact ? "p-3" : "p-6",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: "default" | "section" | "widget" | "clickup";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      variant === "section" && "text-lg flex items-center gap-2",
      variant === "widget" && "text-lg font-medium",
      variant === "clickup" && "text-base font-semibold",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean;
  }
>(({ className, compact, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      compact ? "p-3 pt-0" : "p-6 pt-0",
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean;
  }
>(({ className, compact, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center",
      compact ? "p-3 pt-0" : "p-6 pt-0",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    color?: "red" | "green" | "blue" | "yellow" | "purple" | "gray" | "orange" | "clickup-red" | "clickup-green" | "clickup-blue" | "clickup-yellow" | "clickup-purple" | "clickup-orange";
  }
>(({ className, color = "gray", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center",
      color === "red" && "bg-red-100 text-red-800",
      color === "green" && "bg-green-100 text-green-800",
      color === "blue" && "bg-blue-100 text-blue-800",
      color === "yellow" && "bg-yellow-100 text-yellow-800",
      color === "purple" && "bg-purple-100 text-purple-800",
      color === "orange" && "bg-orange-100 text-orange-800",
      color === "gray" && "bg-gray-100 text-gray-800",
      color === "clickup-red" && "bg-[#ffd5d2] text-[#d8210d]",
      color === "clickup-green" && "bg-[#cff2df] text-[#0b875b]",
      color === "clickup-blue" && "bg-[#d3e5ff] text-[#2555cf]",
      color === "clickup-yellow" && "bg-[#ffefd2] text-[#f2b202]",
      color === "clickup-purple" && "bg-[#e7d8fd] text-[#6b38fb]",
      color === "clickup-orange" && "bg-[#ffefd2] text-[#f25c02]",
      className
    )}
    {...props}
  />
))
CardBadge.displayName = "CardBadge"

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
))
CardIconButton.displayName = "CardIconButton"

const CardProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number;
    color?: "default" | "blue" | "green" | "red" | "purple" | "yellow" | "orange" | "clickup";
    showValue?: boolean;
    size?: "sm" | "md" | "lg";
  }
>(({ className, value = 0, color = "default", showValue = false, size = "md", ...props }, ref) => (
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
))
CardProgress.displayName = "CardProgress"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardBadge,
  CardIconButton,
  CardProgress
}
