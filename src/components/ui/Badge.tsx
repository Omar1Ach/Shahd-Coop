import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--stone-100)] text-[var(--stone-700)]",
  success: "bg-[var(--botanical-50)] text-[var(--botanical-600)]",
  warning: "bg-[var(--warning-bg)] text-[#92600A]",
  danger: "bg-[var(--error-bg)] text-[var(--error)]",
  info: "bg-[var(--info-bg)] text-[#1E5A9E]",
  outline: "border border-[var(--color-border)] text-[var(--color-text-secondary)]",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
