
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    variant?: "default" | "modern" | "clickup";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm",
        variant === "clickup" && "border-collapse",
        className
      )}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    variant?: "default" | "modern" | "clickup";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "[&_tr]:border-b",
      variant === "clickup" && "bg-muted/50 text-xs font-medium text-muted-foreground",
      className
    )} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    variant?: "default" | "modern" | "clickup";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0",
      variant === "clickup" && "divide-y divide-border/50",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    variant?: "default" | "modern" | "clickup";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors",
      variant === "default" && "hover:bg-muted/50 data-[state=selected]:bg-muted",
      variant === "clickup" && "hover:bg-muted/30 group cursor-pointer",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    variant?: "default" | "modern" | "clickup";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      variant === "clickup" && "px-3 py-2 text-xs uppercase tracking-wider",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    variant?: "default" | "modern" | "clickup";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      variant === "clickup" && "px-3 py-3 align-middle group-hover:bg-muted/20",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
