import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" && "phantom-btn-primary",
          variant === "ghost" && "phantom-btn-ghost",
          variant === "outline" && "phantom-btn-ghost",
          variant === "secondary" && "phantom-btn-secondary",
          size === "sm" && "px-4 py-2 text-[13px]",
          size === "md" && "px-6 py-3 text-[15px]",
          size === "lg" && "px-8 py-4 text-[16px]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
