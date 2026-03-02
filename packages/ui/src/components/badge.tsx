import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "success" | "warning" | "accent";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          default: "bg-primary/20 text-primary",
          outline: "border border-border text-muted-foreground",
          success: "bg-success/20 text-success",
          warning: "bg-yellow-500/20 text-yellow-400",
          accent: "bg-accent/20 text-accent",
        }[variant],
        className
      )}
      {...props}
    />
  );
}
