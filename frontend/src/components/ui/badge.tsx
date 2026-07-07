import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-pills text-xs font-medium",
        variant === "default" && "bg-paper-warmth text-graphite",
        variant === "success" && "bg-green-50 text-green-700",
        variant === "warning" && "bg-amber-50 text-amber-700",
        variant === "danger" && "bg-red-50 text-coral",
        variant === "info" && "bg-sky-tint text-notion-blue",
        className
      )}
      {...props}
    />
  );
}
export { Badge };
