
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: boolean;
    variant?: "default" | "project" | "task" | "widget";
  }
>(({ className, gradient, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
      variant === "project" && "border-l-4",
      variant === "task" && "border-l-4 hover:shadow-md",
      variant === "widget" && "bg-gradient-to-br overflow-hidden",
      gradient && "bg-gradient-to-br",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: "default" | "section" | "widget";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      variant === "section" && "text-lg flex items-center gap-2",
      variant === "widget" && "text-lg font-medium",
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
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    color?: "red" | "green" | "blue" | "yellow" | "purple" | "gray";
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
      color === "gray" && "bg-gray-100 text-gray-800",
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
    color?: "default" | "blue" | "green" | "red" | "purple" | "yellow";
  }
>(({ className, value = 0, color = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full h-1 bg-gray-100 rounded-full overflow-hidden", className)}
    {...props}
  >
    <div 
      className={cn(
        "h-full",
        color === "default" && "bg-blue-500",
        color === "blue" && "bg-blue-500",
        color === "green" && "bg-green-500",
        color === "red" && "bg-red-500",
        color === "purple" && "bg-purple-500",
        color === "yellow" && "bg-yellow-500"
      )}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
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
