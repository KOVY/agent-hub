import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
          {
            default: "bg-primary text-primary-foreground hover:opacity-90",
            outline:
              "border border-border bg-transparent hover:bg-muted text-foreground",
            ghost: "hover:bg-muted text-foreground",
            destructive:
              "bg-destructive text-white hover:opacity-90",
          }[variant],
          {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-4",
            lg: "h-12 px-6 text-lg",
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
