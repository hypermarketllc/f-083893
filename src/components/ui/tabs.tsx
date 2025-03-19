
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "default" | "outline" | "pill" | "underline" | "clickup";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center",
      variant === "default" && "h-10 rounded-md bg-muted p-1 text-muted-foreground",
      variant === "outline" && "h-10 gap-2 border-b border-border",
      variant === "pill" && "h-10 gap-1 p-1 border rounded-full bg-muted/20",
      variant === "underline" && "h-10 gap-6 border-b border-border",
      variant === "clickup" && "h-10 gap-4 border-b border-border/30",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "outline" | "pill" | "underline" | "clickup";
    icon?: React.ReactNode;
  }
>(({ className, variant = "default", icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variant === "default" && "rounded-sm px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      variant === "outline" && "px-3 py-2.5 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground -mb-px",
      variant === "pill" && "rounded-full px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
      variant === "underline" && "px-2 pb-2.5 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground -mb-px font-semibold",
      variant === "clickup" && "px-3 py-2.5 border-b-2 border-transparent text-muted-foreground hover:text-foreground data-[state=active]:border-[#7B68EE] data-[state=active]:text-[#7B68EE] -mb-px font-medium",
      className
    )}
    {...props}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
