
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "red" | "green" | "blue" | "yellow" | "purple" | "gray" | "orange" | "clickup-red" | "clickup-green" | "clickup-blue" | "clickup-yellow" | "clickup-purple" | "clickup-orange";
}

const CardBadge = React.forwardRef<HTMLDivElement, CardBadgeProps>(
  ({ className, color = "gray", ...props }, ref) => (
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
  )
);

CardBadge.displayName = "CardBadge";

export { CardBadge };
