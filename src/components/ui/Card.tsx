import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-[var(--color-surface-1)] p-6",
        "border-[var(--color-border)]",
        hover && "transition-shadow hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold", className)}
      style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm", className)} style={{ color: "var(--color-text-secondary)" }} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 flex items-center gap-3 border-t pt-4", className)}
      style={{ borderColor: "var(--color-border)" }}
      {...props}
    >
      {children}
    </div>
  );
}
