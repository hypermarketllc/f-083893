
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: "default" | "section" | "widget" | "clickup";
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, variant = "default", ...props }, ref) => (
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
  )
);

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

export { CardTitle, CardDescription };
